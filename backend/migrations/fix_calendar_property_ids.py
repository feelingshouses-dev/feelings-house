import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

async def migrate_calendar_property_ids(db: AsyncIOMotorDatabase):
    """
    Migration: Fix calendar_sources property_id mismatch
    Old IDs: 1, 2, 3, 4 (integers)
    New IDs: feelings-houses, the-journey, courtly-love, feelings-4 (strings)
    """
    
    mapping = {
        1: "feelings-houses",
        2: "the-journey", 
        3: "courtly-love",
        4: "feelings-4"
    }
    
    try:
        for old_id, new_id in mapping.items():
            result = await db.calendar_sources.update_many(
                {"property_id": old_id},
                {"$set": {"property_id": new_id}}
            )
            if result.modified_count > 0:
                logger.info(f"✅ Migrated {result.modified_count} calendar sources: {old_id} → {new_id}")
        
        logger.info("✅ Calendar property ID migration completed")
        
    except Exception as e:
        logger.error(f"❌ Calendar migration failed: {e}")
