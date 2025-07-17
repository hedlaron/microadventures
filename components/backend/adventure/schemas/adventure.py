from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AdventureRequest(BaseModel):
    location: str
    destination: str | None = None
    duration: str  # few-hours, half-day, full-day, few-days
    activity_type: str  # surprise-me, hiking, cycling, etc.
    is_round_trip: bool = False
    custom_activity: str | None = None
    start_time: datetime | None = None
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
                "is_immediate": False,
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
    start_address: str | None = None
    end_address: str | None = None
    start_coordinates: str | None = None  # Deprecated but kept for backward compatibility
    end_coordinates: str | None = None  # Deprecated but kept for backward compatibility
    waypoints: list[str]
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
    essential: list[str]
    weather_specific: list[str]
    optional: list[str]
    food_and_drink: list[str]


class AdventureRecommendations(BaseModel):
    photo_opportunities: list[str]
    local_tips: list[str]
    hidden_gems: list[str]


class AdventureResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: str | None
    location: str
    destination: str | None
    duration: str
    activity_type: str
    is_round_trip: bool
    itinerary: list[ItineraryItem]
    route: RouteInfo
    weather_forecast: WeatherForecast
    packing_list: PackingList
    recommendations: AdventureRecommendations
    estimated_cost: str | None
    difficulty_level: str | None
    best_season: str | None
    accessibility: str | None
    # Public sharing fields
    is_public: bool = False
    share_token: str | None = None
    shared_at: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdventureHistoryResponse(BaseModel):
    adventures: list[AdventureResponse]


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
    share_url: str | None = None
    message: str


class PublicAdventureResponse(BaseModel):
    """Response for publicly shared adventures (excludes private data)"""

    id: int
    title: str
    description: str
    image_url: str | None
    location: str
    destination: str | None
    duration: str
    activity_type: str
    is_round_trip: bool
    itinerary: list[ItineraryItem]
    route: RouteInfo
    weather_forecast: WeatherForecast
    packing_list: PackingList
    recommendations: AdventureRecommendations
    estimated_cost: str | None
    difficulty_level: str | None
    best_season: str | None
    accessibility: str | None
    created_at: datetime
    shared_at: datetime | None = None
    # Note: No creator info or share_token exposed for privacy

    model_config = ConfigDict(from_attributes=True)
