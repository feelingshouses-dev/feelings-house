import uuid
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date

class CalendarSource(BaseModel):
    """External calendar source (Airbnb, Booking.com, etc)"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    property_id: int
    platform: str  # "airbnb", "booking", "vrbo"
    ical_url: str
    last_synced: Optional[datetime] = None
    sync_status: str = "pending"  # pending, success, error
    error_message: Optional[str] = None

class BlockedDate(BaseModel):
    """Blocked date from external calendar"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    property_id: int
    date: date
    source: str  # "airbnb", "booking", "manual"
    summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingHold(BaseModel):
    """Temporary hold on dates during booking process"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    property_id: int
    check_in: date
    check_out: date
    guest_email: str
    expires_at: datetime
    status: str = "pending"  # pending, confirmed, expired
