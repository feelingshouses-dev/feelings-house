from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PropertyAmenities(BaseModel):
    wifi: bool = True
    kitchen: bool = True
    parking: bool = True
    ac: bool = True
    tv: bool = True
    washer: bool = True
    iron: bool = True
    hair_dryer: bool = True
    stove_oven: bool = True
    dishes_cutlery: bool = True
    drying_rack: bool = True
    mountain_view: bool = True
    sea_view: bool = True
    beach_access: bool = True

class PropertyDescription(BaseModel):
    gr: str
    en: str

class Property(BaseModel):
    property_id: str  # e.g., "feelings-4", "courtly-love"
    airbnb_id: str  # Airbnb listing ID
    name: PropertyDescription
    slug: str
    bedrooms: int
    bathrooms: int
    beds: int
    max_guests: int
    size_sqm: int
    price_per_night: float = 0  # Will be editable via admin panel
    description: PropertyDescription
    short_description: PropertyDescription
    photos: List[str] = []  # Photo URLs
    amenities: PropertyAmenities
    rating: float = 0
    review_count: int = 0
    featured: bool = False
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PropertyUpdate(BaseModel):
    name: Optional[PropertyDescription] = None
    price_per_night: Optional[float] = None
    description: Optional[PropertyDescription] = None
    short_description: Optional[PropertyDescription] = None
    photos: Optional[List[str]] = None
    amenities: Optional[PropertyAmenities] = None
    featured: Optional[bool] = None
    active: Optional[bool] = None
