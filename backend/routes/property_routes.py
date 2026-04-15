from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from models.property_model import Property, PropertyUpdate

router = APIRouter(tags=["Properties"])

# Import shared database connection from server.py
# This will be injected when the routes are included
properties_collection = None

def init_db(db):
    """Initialize database connection"""
    global properties_collection
    properties_collection = db.properties

@router.get("/", response_model=List[Property])
async def get_all_properties(active_only: bool = False):
    """Get all properties"""
    query = {"active": True} if active_only else {}
    properties = await properties_collection.find(query, {"_id": 0}).to_list(100)
    return properties

@router.get("/{property_id}", response_model=Property)
async def get_property(property_id: str):
    """Get a single property by ID"""
    property_data = await properties_collection.find_one(
        {"property_id": property_id},
        {"_id": 0}
    )
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data

@router.post("/", response_model=Property)
async def create_property(property: Property):
    """Create a new property (Admin only)"""
    # Check if property already exists
    existing = await properties_collection.find_one(
        {"property_id": property.property_id},
        {"_id": 0}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Property already exists")
    
    property_dict = property.dict()
    property_dict["created_at"] = datetime.utcnow()
    property_dict["updated_at"] = datetime.utcnow()
    
    await properties_collection.insert_one(property_dict)
    return property

@router.put("/{property_id}", response_model=Property)
async def update_property(property_id: str, updates: PropertyUpdate):
    """Update a property (Admin only)"""
    property_data = await properties_collection.find_one(
        {"property_id": property_id},
        {"_id": 0}
    )
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Prepare update data
    update_data = {k: v for k, v in updates.dict(exclude_unset=True).items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        
        await properties_collection.update_one(
            {"property_id": property_id},
            {"$set": update_data}
        )
    
    # Return updated property
    updated_property = await properties_collection.find_one(
        {"property_id": property_id},
        {"_id": 0}
    )
    return updated_property

@router.delete("/{property_id}")
async def delete_property(property_id: str):
    """Delete a property (Admin only - soft delete by setting active=false)"""
    result = await properties_collection.update_one(
        {"property_id": property_id},
        {"$set": {"active": False, "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deactivated successfully"}

@router.post("/seed")
async def seed_properties_endpoint():
    """Seed properties database (One-time setup)"""
    from seed_properties import PROPERTIES_DATA
    
    count = 0
    for prop_data in PROPERTIES_DATA:
        existing = await properties_collection.find_one({"property_id": prop_data["property_id"]})
        if existing:
            continue
        
        prop_data["created_at"] = datetime.utcnow()
        prop_data["updated_at"] = datetime.utcnow()
        await properties_collection.insert_one(prop_data)
        count += 1
    
    total = await properties_collection.count_documents({})
    return {"message": f"Seeded {count} new properties. Total: {total}"}
