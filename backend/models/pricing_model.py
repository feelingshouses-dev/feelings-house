from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import date

class SeasonalRate(BaseModel):
    """Seasonal pricing rate for a specific date range"""
    property_id: str
    season_name: str  # e.g., "High Season", "Peak Season", "Christmas"
    start_date: date
    end_date: date
    price_per_night: float
    min_nights: int = 1
    max_nights: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class PropertyPricing(BaseModel):
    """Complete pricing configuration for a property"""
    property_id: str
    base_price: float  # Default price when no seasonal rate applies
    seasonal_rates: List[SeasonalRate] = []
    
    # Discounts
    weekly_discount: float = 0  # % discount for 7+ nights
    monthly_discount: float = 0  # % discount for 30+ nights
    
    # Extra fees
    cleaning_fee: float = 0
    extra_guest_fee: float = 0  # Per guest above base occupancy
    
    # Cancellation policy
    cancellation_policy: str = "strict"  # flexible, moderate, strict
    
class PriceCalculation(BaseModel):
    """Price calculation result for a booking"""
    property_id: str
    check_in: date
    check_out: date
    nights: int
    base_total: float
    seasonal_breakdown: List[Dict]  # Daily rate breakdown
    discount_amount: float = 0
    discount_reason: Optional[str] = None
    cleaning_fee: float = 0
    extra_fees: float = 0
    subtotal: float
    tourist_tax: float  # Ειδικός Φόρος Διαμονής
    total: float
    
class CancellationRefund(BaseModel):
    """Cancellation refund calculation"""
    booking_id: str
    cancellation_date: date
    check_in_date: date
    original_amount: float
    refund_percentage: int  # 0, 50, or 100
    refund_amount: float
    policy: str
    reason: str
