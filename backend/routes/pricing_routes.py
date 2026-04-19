import os
from datetime import date, datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

from models.pricing_model import (
    SeasonalRate, 
    PropertyPricing, 
    PriceCalculation,
    CancellationRefund
)

router = APIRouter(tags=["Pricing"])

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ==================== SEASONAL RATES MANAGEMENT ====================

class SeasonalRateCreate(BaseModel):
    property_id: str
    season_name: str
    start_date: str  # YYYY-MM-DD
    end_date: str
    price_per_night: float
    min_nights: int = 1

@router.post("/seasonal-rates/")
async def create_seasonal_rate(rate: SeasonalRateCreate):
    """Create a new seasonal rate"""
    rate_dict = {
        "property_id": rate.property_id,
        "season_name": rate.season_name,
        "start_date": rate.start_date,
        "end_date": rate.end_date,
        "price_per_night": rate.price_per_night,
        "min_nights": rate.min_nights,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.seasonal_rates.insert_one(rate_dict)
    rate_dict["_id"] = str(result.inserted_id)
    
    return {"status": "success", "rate": rate_dict}

@router.get("/seasonal-rates/{property_id}")
async def get_seasonal_rates(property_id: str):
    """Get all seasonal rates for a property"""
    rates = await db.seasonal_rates.find(
        {"property_id": property_id},
        {"_id": 0}
    ).to_list(1000)
    
    # Sort by start_date
    rates.sort(key=lambda x: x["start_date"])
    
    return {"property_id": property_id, "rates": rates}

@router.delete("/seasonal-rates/{property_id}/{season_name}")
async def delete_seasonal_rate(property_id: str, season_name: str):
    """Delete a seasonal rate"""
    result = await db.seasonal_rates.delete_one({
        "property_id": property_id,
        "season_name": season_name
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Seasonal rate not found")
    
    return {"status": "success", "message": f"Deleted rate: {season_name}"}

# ==================== PROPERTY PRICING ====================

class PropertyPricingUpdate(BaseModel):
    base_price: float
    weekly_discount: float = 0
    monthly_discount: float = 0
    cleaning_fee: float = 0
    extra_guest_fee: float = 0
    cancellation_policy: str = "strict"

@router.put("/pricing/{property_id}")
async def update_property_pricing(property_id: str, pricing: PropertyPricingUpdate):
    """Update property pricing configuration"""
    pricing_dict = {
        "property_id": property_id,
        "base_price": pricing.base_price,
        "weekly_discount": pricing.weekly_discount,
        "monthly_discount": pricing.monthly_discount,
        "cleaning_fee": pricing.cleaning_fee,
        "extra_guest_fee": pricing.extra_guest_fee,
        "cancellation_policy": pricing.cancellation_policy,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.property_pricing.update_one(
        {"property_id": property_id},
        {"$set": pricing_dict},
        upsert=True
    )
    
    return {"status": "success", "pricing": pricing_dict}

@router.get("/pricing/{property_id}")
async def get_property_pricing(property_id: str):
    """Get property pricing configuration"""
    pricing = await db.property_pricing.find_one(
        {"property_id": property_id},
        {"_id": 0}
    )
    
    if not pricing:
        # Return default pricing
        return {
            "property_id": property_id,
            "base_price": 120.0,
            "weekly_discount": 0,
            "monthly_discount": 0,
            "cleaning_fee": 0,
            "extra_guest_fee": 0,
            "cancellation_policy": "strict"
        }
    
    return pricing

# ==================== PRICE CALCULATION ====================

class PriceQuoteRequest(BaseModel):
    property_id: str
    check_in: str  # YYYY-MM-DD
    check_out: str
    guests: int = 2

@router.post("/calculate-price/")
async def calculate_price(request: PriceQuoteRequest):
    """Calculate total price for a booking"""
    
    # Parse dates
    check_in = datetime.strptime(request.check_in, "%Y-%m-%d").date()
    check_out = datetime.strptime(request.check_out, "%Y-%m-%d").date()
    nights = (check_out - check_in).days
    
    if nights < 1:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")
    
    # Get property pricing
    pricing = await db.property_pricing.find_one(
        {"property_id": request.property_id},
        {"_id": 0}
    )
    
    if not pricing:
        pricing = {"base_price": 120.0, "cleaning_fee": 0, "cancellation_policy": "strict"}
    
    # Get seasonal rates
    seasonal_rates = await db.seasonal_rates.find(
        {"property_id": request.property_id},
        {"_id": 0}
    ).to_list(1000)
    
    # Calculate daily rates
    seasonal_breakdown = []
    base_total = 0
    
    current_date = check_in
    while current_date < check_out:
        # Find applicable seasonal rate
        daily_rate = pricing.get("base_price", 120.0)
        season_applied = "Base Rate"
        
        for rate in seasonal_rates:
            rate_start = datetime.strptime(rate["start_date"], "%Y-%m-%d").date()
            rate_end = datetime.strptime(rate["end_date"], "%Y-%m-%d").date()
            
            if rate_start <= current_date <= rate_end:
                daily_rate = rate["price_per_night"]
                season_applied = rate["season_name"]
                break
        
        seasonal_breakdown.append({
            "date": current_date.isoformat(),
            "rate": daily_rate,
            "season": season_applied
        })
        
        base_total += daily_rate
        current_date += timedelta(days=1)
    
    # Calculate discounts
    discount_amount = 0
    discount_reason = None
    
    if nights >= 30 and pricing.get("monthly_discount", 0) > 0:
        discount_amount = base_total * (pricing["monthly_discount"] / 100)
        discount_reason = f"{pricing['monthly_discount']}% monthly discount"
    elif nights >= 7 and pricing.get("weekly_discount", 0) > 0:
        discount_amount = base_total * (pricing["weekly_discount"] / 100)
        discount_reason = f"{pricing['weekly_discount']}% weekly discount"
    
    # Cleaning fee
    cleaning_fee = pricing.get("cleaning_fee", 0)
    
    # Extra guest fee
    property_data = await db.properties.find_one({"property_id": request.property_id}, {"_id": 0})
    base_guests = property_data.get("max_guests", 2) if property_data else 2
    extra_guests = max(0, request.guests - base_guests)
    extra_fees = extra_guests * pricing.get("extra_guest_fee", 0)
    
    # Subtotal
    subtotal = base_total - discount_amount + cleaning_fee + extra_fees
    
    # Tourist tax (Ειδικός Φόρος Διαμονής)
    # For Santorini: €4/night per room (4-star equivalent)
    tourist_tax = nights * 4.0
    
    # Total
    total = subtotal + tourist_tax
    
    return {
        "property_id": request.property_id,
        "check_in": request.check_in,
        "check_out": request.check_out,
        "nights": nights,
        "guests": request.guests,
        "base_total": round(base_total, 2),
        "seasonal_breakdown": seasonal_breakdown,
        "discount_amount": round(discount_amount, 2),
        "discount_reason": discount_reason,
        "cleaning_fee": round(cleaning_fee, 2),
        "extra_fees": round(extra_fees, 2),
        "subtotal": round(subtotal, 2),
        "tourist_tax": round(tourist_tax, 2),
        "total": round(total, 2),
        "cancellation_policy": pricing.get("cancellation_policy", "strict")
    }

# ==================== CANCELLATION REFUND ====================

class CancellationRequest(BaseModel):
    booking_id: str
    check_in_date: str  # YYYY-MM-DD
    original_amount: float
    cancellation_policy: str = "strict"

@router.post("/calculate-refund/")
async def calculate_refund(request: CancellationRequest):
    """Calculate refund amount based on cancellation policy"""
    
    cancellation_date = date.today()
    check_in = datetime.strptime(request.check_in_date, "%Y-%m-%d").date()
    days_until_checkin = (check_in - cancellation_date).days
    
    # Strict policy (Airbnb-style)
    if request.cancellation_policy == "strict":
        if days_until_checkin >= 30:
            refund_percentage = 100
            reason = "Full refund: Cancelled 30+ days before check-in"
        elif days_until_checkin >= 14:
            refund_percentage = 50
            reason = "50% refund: Cancelled 14-30 days before check-in"
        else:
            refund_percentage = 0
            reason = "No refund: Cancelled less than 14 days before check-in"
    
    # Moderate policy
    elif request.cancellation_policy == "moderate":
        if days_until_checkin >= 14:
            refund_percentage = 100
            reason = "Full refund: Cancelled 14+ days before check-in"
        elif days_until_checkin >= 7:
            refund_percentage = 50
            reason = "50% refund: Cancelled 7-14 days before check-in"
        else:
            refund_percentage = 0
            reason = "No refund: Cancelled less than 7 days before check-in"
    
    # Flexible policy
    else:  # flexible
        if days_until_checkin >= 7:
            refund_percentage = 100
            reason = "Full refund: Cancelled 7+ days before check-in"
        elif days_until_checkin >= 3:
            refund_percentage = 50
            reason = "50% refund: Cancelled 3-7 days before check-in"
        else:
            refund_percentage = 0
            reason = "No refund: Cancelled less than 3 days before check-in"
    
    refund_amount = request.original_amount * (refund_percentage / 100)
    
    return {
        "booking_id": request.booking_id,
        "cancellation_date": cancellation_date.isoformat(),
        "check_in_date": request.check_in_date,
        "days_until_checkin": days_until_checkin,
        "original_amount": request.original_amount,
        "refund_percentage": refund_percentage,
        "refund_amount": round(refund_amount, 2),
        "policy": request.cancellation_policy,
        "reason": reason
    }

# ==================== BULK SEASONAL RATES SETUP ====================

@router.post("/seasonal-rates/bulk/{property_id}")
async def setup_seasonal_rates_bulk(property_id: str):
    """Setup default seasonal rates for 2026"""
    
    seasonal_rates = [
        # Low Season
        {
            "property_id": property_id,
            "season_name": "Low Season - Winter",
            "start_date": "2026-01-01",
            "end_date": "2026-02-28",
            "price_per_night": 80.0,
            "min_nights": 2
        },
        {
            "property_id": property_id,
            "season_name": "Low Season - Late Fall",
            "start_date": "2026-11-01",
            "end_date": "2026-12-19",
            "price_per_night": 85.0,
            "min_nights": 2
        },
        # Mid Season
        {
            "property_id": property_id,
            "season_name": "Mid Season - Spring",
            "start_date": "2026-03-01",
            "end_date": "2026-04-30",
            "price_per_night": 120.0,
            "min_nights": 2
        },
        {
            "property_id": property_id,
            "season_name": "Mid Season - Fall",
            "start_date": "2026-10-01",
            "end_date": "2026-10-31",
            "price_per_night": 120.0,
            "min_nights": 2
        },
        # High Season
        {
            "property_id": property_id,
            "season_name": "High Season - Late Spring",
            "start_date": "2026-05-01",
            "end_date": "2026-06-30",
            "price_per_night": 150.0,
            "min_nights": 3
        },
        {
            "property_id": property_id,
            "season_name": "High Season - Early Fall",
            "start_date": "2026-09-01",
            "end_date": "2026-09-30",
            "price_per_night": 160.0,
            "min_nights": 3
        },
        # Peak Season
        {
            "property_id": property_id,
            "season_name": "Peak Season - Summer",
            "start_date": "2026-07-01",
            "end_date": "2026-08-31",
            "price_per_night": 200.0,
            "min_nights": 5
        },
        # Special - Christmas/New Year
        {
            "property_id": property_id,
            "season_name": "Special - Christmas & New Year",
            "start_date": "2026-12-20",
            "end_date": "2027-01-06",
            "price_per_night": 180.0,
            "min_nights": 3
        }
    ]
    
    # Delete existing rates for this property
    await db.seasonal_rates.delete_many({"property_id": property_id})
    
    # Insert new rates
    for rate in seasonal_rates:
        rate["created_at"] = datetime.now(timezone.utc).isoformat()
        rate["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.seasonal_rates.insert_many(seasonal_rates)
    
    return {
        "status": "success",
        "message": f"Created {len(seasonal_rates)} seasonal rates for property {property_id}",
        "rates": seasonal_rates
    }
