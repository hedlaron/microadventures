from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class AdventureRequest(BaseModel):
    location: str
    destination: Optional[str] = None
    duration: str  # few-hours, half-day, full-day, few-days
    activity_type: str  # surprise-me, hiking, cycling, etc.
    is_round_trip: bool = False
    custom_activity: Optional[str] = None
    start_time: Optional[datetime] = None
    is_immediate: bool = False  # True if "Let's go now" was selected
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "location": "San Francisco, CA",
                "destination": "Golden Gate Park",
                "duration": "half-day",
                "activity_type": "hiking",
                "is_round_trip": True,
                "custom_activity": None,
                "start_time": "2024-01-15T14:30:00",
                "is_immediate": False
            }
        }
    )

class ItineraryItem(BaseModel):
    time: str
    activity: str
    location: str
    duration: str
    notes: str

class RouteInfo(BaseModel):
    # Support both old coordinate format and new address format for backward compatibility
    start_address: Optional[str] = None
    end_address: Optional[str] = None
    start_coordinates: Optional[str] = None  # Deprecated but kept for backward compatibility
    end_coordinates: Optional[str] = None    # Deprecated but kept for backward compatibility
    waypoints: List[str]
    map_embed_url: str
    estimated_distance: str
    estimated_travel_time: str
    
    @property
    def start_location(self) -> str:
        """Return start_address if available, otherwise start_coordinates"""
        return self.start_address or self.start_coordinates or ""
    
    @property 
    def end_location(self) -> str:
        """Return end_address if available, otherwise end_coordinates"""
        return self.end_address or self.end_coordinates or ""

class WeatherForecast(BaseModel):
    temperature: str
    conditions: str
    precipitation: str
    wind: str
    uv_index: str
    best_time_outdoors: str

class PackingList(BaseModel):
    essential: List[str]
    weather_specific: List[str]
    optional: List[str]
    food_and_drink: List[str]

class AdventureRecommendations(BaseModel):
    photo_opportunities: List[str]
    local_tips: List[str]
    hidden_gems: List[str]

class AdventureResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: Optional[str]
    location: str
    destination: Optional[str]
    duration: str
    activity_type: str
    is_round_trip: bool
    itinerary: List[ItineraryItem]
    route: RouteInfo
    weather_forecast: WeatherForecast
    packing_list: PackingList
    recommendations: AdventureRecommendations
    estimated_cost: Optional[str]
    difficulty_level: Optional[str]
    best_season: Optional[str]
    accessibility: Optional[str]
    # Public sharing fields
    is_public: bool = False
    share_token: Optional[str] = None
    shared_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AdventureHistoryResponse(BaseModel):
    adventures: List[AdventureResponse]

class AdventureQuotaResponse(BaseModel):
    adventures_remaining: int
    total_quota: int
    reset_time: datetime  # When the quota will reset
    time_until_reset: int  # Seconds until reset
    
class ShareAdventureRequest(BaseModel):
    adventure_id: int
    make_public: bool

class ShareAdventureResponse(BaseModel):
    success: bool
    share_url: Optional[str] = None
    message: str

class PublicAdventureResponse(BaseModel):
    """Response for publicly shared adventures (excludes private data)"""
    id: int
    title: str
    description: str
    image_url: Optional[str]
    location: str
    destination: Optional[str]
    duration: str
    activity_type: str
    is_round_trip: bool
    itinerary: List[ItineraryItem]
    route: RouteInfo
    weather_forecast: WeatherForecast
    packing_list: PackingList
    recommendations: AdventureRecommendations
    estimated_cost: Optional[str]
    difficulty_level: Optional[str]
    best_season: Optional[str]
    accessibility: Optional[str]
    created_at: datetime
    shared_at: Optional[datetime] = None
    # Note: No creator info or share_token exposed for privacy
    
    model_config = ConfigDict(from_attributes=True)
