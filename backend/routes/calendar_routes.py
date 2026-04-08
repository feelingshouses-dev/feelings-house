from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import date, datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os
from services.ical_sync_service import iCalSyncService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

sync_service = iCalSyncService(db)

@router.post("/calendar-sources")
async def add_calendar_source(
    property_id: int,
    platform: str,
    ical_url: str
):
    """Add external calendar source (Airbnb, Booking.com)"""
    try:
        # Validate platform
        if platform not in ['airbnb', 'booking', 'vrbo', 'other']:
            raise HTTPException(status_code=400, detail="Invalid platform")
        
        # Check if source already exists
        existing = await db.calendar_sources.find_one({
            "property_id": property_id,
            "platform": platform
        })
        
        if existing:
            # Update existing
            await db.calendar_sources.update_one(
                {"_id": existing['_id']},
                {"$set": {
                    "ical_url": ical_url,
                    "sync_status": "pending",
                    "updated_at": datetime.utcnow()
                }}
            )
            source_id = str(existing['_id'])
        else:
            # Create new
            source = {
                "property_id": property_id,
                "platform": platform,
                "ical_url": ical_url,
                "sync_status": "pending",
                "created_at": datetime.utcnow()
            }
            result = await db.calendar_sources.insert_one(source)
            source_id = str(result.inserted_id)
        
        # Trigger immediate sync
        calendar_source = await db.calendar_sources.find_one({"_id": source_id})
        if calendar_source:
            sync_result = await sync_service.sync_calendar_source(calendar_source)
        
        return {
            "success": True,
            "source_id": source_id,
            "message": f"Calendar source for {platform} added and synced"
        }
        
    except Exception as e:
        logger.error(f"Error adding calendar source: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/calendar-sources/{property_id}")
async def get_calendar_sources(property_id: int):
    """Get all calendar sources for a property"""
    sources = await db.calendar_sources.find({
        "property_id": property_id
    }).to_list(100)
    
    for source in sources:
        source['_id'] = str(source['_id'])
    
    return sources

@router.post("/sync/{property_id}")
async def sync_property_calendars(property_id: int):
    """Manually trigger sync for a property's calendars"""
    sources = await db.calendar_sources.find({
        "property_id": property_id
    }).to_list(None)
    
    if not sources:
        raise HTTPException(status_code=404, detail="No calendar sources found for this property")
    
    results = []
    for source in sources:
        result = await sync_service.sync_calendar_source(source)
        results.append({
            "platform": source['platform'],
            **result
        })
    
    return {
        "property_id": property_id,
        "synced_sources": len(results),
        "results": results
    }

@router.post("/sync-all")
async def sync_all_calendars():
    """Sync all calendar sources (for scheduled task)"""
    results = await sync_service.sync_all_calendars()
    return {
        "synced_count": len(results),
        "results": results
    }

@router.get("/availability/{property_id}")
async def check_availability(
    property_id: int,
    check_in: date,
    check_out: date
):
    """Check if property is available for given dates"""
    availability = await sync_service.check_availability(
        property_id,
        check_in,
        check_out
    )
    
    return availability

@router.post("/booking-hold")
async def create_booking_hold(
    property_id: int,
    check_in: date,
    check_out: date,
    guest_email: str
):
    """Create temporary hold on dates during booking process"""
    result = await sync_service.create_booking_hold(
        property_id,
        check_in,
        check_out,
        guest_email
    )
    
    if not result['success']:
        raise HTTPException(status_code=409, detail=result.get('error', 'Dates not available'))
    
    return result

@router.post("/booking-hold/{hold_id}/confirm")
async def confirm_hold(hold_id: str):
    """Confirm booking hold after successful payment"""
    success = await sync_service.confirm_booking_hold(hold_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Hold not found or expired")
    
    return {"success": True, "message": "Booking confirmed"}

@router.get("/blocked-dates/{property_id}")
async def get_blocked_dates(
    property_id: int,
    start_date: date = None,
    end_date: date = None
):
    """Get all blocked dates for a property"""
    query = {"property_id": property_id}
    
    if start_date and end_date:
        query["date"] = {
            "$gte": start_date.isoformat(),
            "$lte": end_date.isoformat()
        }
    
    blocked = await db.blocked_dates.find(query).to_list(1000)
    
    for item in blocked:
        item['_id'] = str(item['_id'])
    
    return blocked

@router.delete("/calendar-sources/{source_id}")
async def remove_calendar_source(source_id: str):
    """Remove a calendar source"""
    result = await db.calendar_sources.delete_one({"_id": source_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Calendar source not found")
    
    return {"success": True, "message": "Calendar source removed"}
