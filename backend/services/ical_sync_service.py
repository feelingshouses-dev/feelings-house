import requests
from icalendar import Calendar
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os

logger = logging.getLogger(__name__)

class iCalSyncService:
    """Service for syncing calendars from Airbnb, Booking.com via iCal"""
    
    def __init__(self, db):
        self.db = db
    
    async def fetch_ical_calendar(self, ical_url: str) -> Optional[Calendar]:
        """Fetch and parse iCal from URL"""
        try:
            response = requests.get(ical_url, timeout=30)
            response.raise_for_status()
            
            calendar = Calendar.from_ical(response.content)
            logger.info(f"Successfully fetched iCal from {ical_url}")
            return calendar
        except Exception as e:
            logger.error(f"Error fetching iCal: {str(e)}")
            return None
    
    async def parse_blocked_dates(self, calendar: Calendar, property_id: int, source: str) -> List[Dict]:
        """Parse blocked dates from iCal events"""
        blocked_dates = []
        
        for component in calendar.walk():
            if component.name == "VEVENT":
                try:
                    # Get start and end dates
                    dtstart = component.get('dtstart')
                    dtend = component.get('dtend')
                    summary = str(component.get('summary', 'Blocked'))
                    
                    if dtstart and dtend:
                        # Convert to date objects
                        if hasattr(dtstart.dt, 'date'):
                            start_date = dtstart.dt.date() if hasattr(dtstart.dt, 'date') else dtstart.dt
                        else:
                            start_date = dtstart.dt
                        
                        if hasattr(dtend.dt, 'date'):
                            end_date = dtend.dt.date() if hasattr(dtend.dt, 'date') else dtend.dt
                        else:
                            end_date = dtend.dt
                        
                        # Block all dates in the range
                        current_date = start_date
                        while current_date < end_date:
                            blocked_dates.append({
                                "property_id": property_id,
                                "date": current_date.isoformat(),
                                "source": source,
                                "summary": summary,
                                "created_at": datetime.utcnow()
                            })
                            current_date += timedelta(days=1)
                            
                except Exception as e:
                    logger.warning(f"Error parsing event: {str(e)}")
                    continue
        
        return blocked_dates
    
    async def sync_calendar_source(self, calendar_source: Dict) -> Dict:
        """Sync a single calendar source"""
        try:
            # Fetch iCal
            calendar = await self.fetch_ical_calendar(calendar_source['ical_url'])
            
            if not calendar:
                return {
                    "success": False,
                    "error": "Failed to fetch calendar"
                }
            
            # Parse blocked dates
            blocked_dates = await self.parse_blocked_dates(
                calendar,
                calendar_source['property_id'],
                calendar_source['platform']
            )
            
            # Remove old blocked dates from this source
            await self.db.blocked_dates.delete_many({
                "property_id": calendar_source['property_id'],
                "source": calendar_source['platform']
            })
            
            # Insert new blocked dates
            if blocked_dates:
                await self.db.blocked_dates.insert_many(blocked_dates)
            
            # Update sync status
            await self.db.calendar_sources.update_one(
                {"_id": calendar_source['_id']},
                {
                    "$set": {
                        "last_synced": datetime.utcnow(),
                        "sync_status": "success",
                        "error_message": None
                    }
                }
            )
            
            logger.info(f"Synced {len(blocked_dates)} blocked dates for property {calendar_source['property_id']} from {calendar_source['platform']}")
            
            return {
                "success": True,
                "blocked_dates_count": len(blocked_dates)
            }
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Error syncing calendar: {error_msg}")
            
            # Update sync status with error
            await self.db.calendar_sources.update_one(
                {"_id": calendar_source['_id']},
                {
                    "$set": {
                        "sync_status": "error",
                        "error_message": error_msg
                    }
                }
            )
            
            return {
                "success": False,
                "error": error_msg
            }
    
    async def sync_all_calendars(self):
        """Sync all calendar sources"""
        calendar_sources = await self.db.calendar_sources.find().to_list(None)
        
        results = []
        for source in calendar_sources:
            result = await self.sync_calendar_source(source)
            results.append({
                "property_id": source['property_id'],
                "platform": source['platform'],
                **result
            })
        
        return results
    
    async def check_availability(self, property_id: int, check_in: date, check_out: date) -> Dict:
        """Check if dates are available (not blocked)"""
        # Get all blocked dates in range
        blocked = await self.db.blocked_dates.find({
            "property_id": property_id,
            "date": {
                "$gte": check_in.isoformat(),
                "$lt": check_out.isoformat()
            }
        }).to_list(None)
        
        # Check for booking holds
        holds = await self.db.booking_holds.find({
            "property_id": property_id,
            "status": "pending",
            "expires_at": {"$gt": datetime.utcnow()},
            "$or": [
                {
                    "check_in": {"$lt": check_out.isoformat()},
                    "check_out": {"$gt": check_in.isoformat()}
                }
            ]
        }).to_list(None)
        
        is_available = len(blocked) == 0 and len(holds) == 0
        
        return {
            "available": is_available,
            "blocked_dates": len(blocked),
            "active_holds": len(holds),
            "blocked_by": list(set([b['source'] for b in blocked])) if blocked else []
        }
    
    async def create_booking_hold(self, property_id: int, check_in: date, check_out: date, guest_email: str) -> Dict:
        """Create a temporary hold on dates (15 minutes)"""
        # First check if available
        availability = await self.check_availability(property_id, check_in, check_out)
        
        if not availability['available']:
            return {
                "success": False,
                "error": "Dates not available",
                "details": availability
            }
        
        # Create hold
        hold = {
            "property_id": property_id,
            "check_in": check_in.isoformat(),
            "check_out": check_out.isoformat(),
            "guest_email": guest_email,
            "expires_at": datetime.utcnow() + timedelta(minutes=15),
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        
        result = await self.db.booking_holds.insert_one(hold)
        hold['_id'] = str(result.inserted_id)
        
        logger.info(f"Created booking hold for property {property_id}: {check_in} to {check_out}")
        
        return {
            "success": True,
            "hold_id": str(result.inserted_id),
            "expires_at": hold['expires_at']
        }
    
    async def confirm_booking_hold(self, hold_id: str) -> bool:
        """Confirm a booking hold after payment"""
        result = await self.db.booking_holds.update_one(
            {"_id": hold_id},
            {"$set": {"status": "confirmed"}}
        )
        
        return result.modified_count > 0
    
    async def cleanup_expired_holds(self):
        """Remove expired booking holds"""
        result = await self.db.booking_holds.delete_many({
            "status": "pending",
            "expires_at": {"$lt": datetime.utcnow()}
        })
        
        logger.info(f"Cleaned up {result.deleted_count} expired holds")
        return result.deleted_count
