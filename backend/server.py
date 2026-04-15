from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Import routes AFTER db is defined
from routes.calendar_routes import router as calendar_router, sync_service
from routes.property_routes import router as property_router, init_db as init_property_db
from routes.contact_routes import router as contact_router

# Initialize property routes with shared database
init_property_db(db)

# Scheduler for periodic calendar sync
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from contextlib import asynccontextmanager

scheduler = AsyncIOScheduler()

async def scheduled_calendar_sync():
    """Run calendar sync every 30 minutes"""
    try:
        logger = logging.getLogger(__name__)
        logger.info("Running scheduled calendar sync...")
        results = await sync_service.sync_all_calendars()
        logger.info(f"Synced {len(results)} calendar sources")
        
        # Also cleanup expired holds
        await sync_service.cleanup_expired_holds()
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Error in scheduled sync: {str(e)}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle"""
    logger = logging.getLogger(__name__)
    # Startup
    logger.info("Starting application...")
    
    # Auto-seed properties if collection is empty
    try:
        properties_count = await db.properties.count_documents({})
        if properties_count == 0:
            logger.info("Properties collection is empty - auto-seeding...")
            from seed_properties import PROPERTIES_DATA
            for prop_data in PROPERTIES_DATA:
                prop_data["created_at"] = datetime.utcnow()
                prop_data["updated_at"] = datetime.utcnow()
                await db.properties.insert_one(prop_data)
            logger.info(f"✅ Auto-seeded {len(PROPERTIES_DATA)} properties")
        else:
            logger.info(f"Properties collection already has {properties_count} properties")
    except Exception as e:
        logger.error(f"Error auto-seeding properties: {e}")
    
    scheduler.add_job(
        scheduled_calendar_sync,
        trigger=IntervalTrigger(minutes=30),
        id='calendar_sync',
        name='Sync all calendars every 30 minutes',
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started - calendar sync every 30 minutes")
    
    yield
    
    # Shutdown
    scheduler.shutdown()
    logger.info("Scheduler stopped")

# Create the main app with lifespan
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include routes
api_router.include_router(calendar_router, prefix="/calendar", tags=["Calendar Sync"])
api_router.include_router(property_router, prefix="/properties", tags=["Properties"])
api_router.include_router(contact_router, prefix="/contact", tags=["Contact"])

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()