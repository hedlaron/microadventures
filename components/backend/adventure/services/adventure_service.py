from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from adventure.models.adventure import Adventure, AdventureQuota
from adventure.schemas.adventure import AdventureRequest
from user.models.user import User


def get_adventure_quota(db: Session, user_id: int) -> Optional[AdventureQuota]:
    """Get the adventure quota for a user"""
    return db.query(AdventureQuota).filter(AdventureQuota.user_id == user_id).first()


def create_adventure_quota(db: Session, user_id: int) -> AdventureQuota:
    """Create a new adventure quota for a user"""
    db_quota = AdventureQuota(user_id=user_id)
    db.add(db_quota)
    db.commit()
    db.refresh(db_quota)
    return db_quota


def reset_quota_if_needed(db: Session, quota: AdventureQuota) -> AdventureQuota:
    """Reset quota if 24 hours have passed since last reset"""
    now = datetime.now(timezone.utc)
    # Ensure last_reset_date is timezone-aware
    last_reset = quota.last_reset_date
    if last_reset.tzinfo is None:
        last_reset = last_reset.replace(tzinfo=timezone.utc)
    
    if now - last_reset > timedelta(hours=24):
        quota.quota_remaining = 10
        quota.last_reset_date = now
        db.commit()
        db.refresh(quota)
    return quota


def create_adventure(
    db: Session,
    location: str,
    destination: Optional[str],
    duration: str,
    activity_type: str,
    is_round_trip: bool,
    created_by: int,
    title: str,
    description: str,
    image_url: Optional[str],
    itinerary: list,
    route: dict,
    weather_forecast: dict,
    packing_list: dict,
    recommendations: dict,
    estimated_cost: Optional[str] = None,
    difficulty_level: Optional[str] = None,
    best_season: Optional[str] = None,
    accessibility: Optional[str] = None
) -> Adventure:
    """Create a new adventure recommendation"""
    db_adventure = Adventure(
        location=location,
        destination=destination,
        duration=duration,
        activity_type=activity_type,
        is_round_trip=is_round_trip,
        created_by=created_by,
        title=title,
        description=description,
        image_url=image_url,
        itinerary=itinerary,  # SQLAlchemy JSON field will handle the list automatically
        route=route,  # SQLAlchemy JSON field will handle the dict automatically
        weather_forecast=weather_forecast,  # SQLAlchemy JSON field will handle the dict automatically
        packing_list=packing_list,  # SQLAlchemy JSON field will handle the dict automatically
        recommendations=recommendations,  # SQLAlchemy JSON field will handle the dict automatically
        estimated_cost=estimated_cost,
        difficulty_level=difficulty_level,
        best_season=best_season,
        accessibility=accessibility
    )
    db.add(db_adventure)
    db.commit()
    db.refresh(db_adventure)
    return db_adventure


def get_user_adventures(db: Session, user_id: int, limit: int = 50) -> List[Adventure]:
    """Get all adventures created by a user"""
    return (db.query(Adventure)
            .filter(Adventure.created_by == user_id)
            .order_by(Adventure.created_at.desc())
            .limit(limit)
            .all())


def get_adventure_by_id(db: Session, adventure_id: int) -> Optional[Adventure]:
    """Get an adventure by its ID"""
    return db.query(Adventure).filter(Adventure.id == adventure_id).first()


def decrement_user_quota(db: Session, quota: AdventureQuota) -> AdventureQuota:
    """Decrement the user's quota by 1"""
    if quota.quota_remaining > 0:
        quota.quota_remaining -= 1
        db.commit()
        db.refresh(quota)
    return quota


def toggle_adventure_sharing(db: Session, adventure_id: int, user_id: int, make_public: bool) -> Optional[Adventure]:
    """Toggle public sharing for an adventure"""
    adventure = (db.query(Adventure)
                .filter(Adventure.id == adventure_id, Adventure.created_by == user_id)
                .first())
    
    if not adventure:
        return None
    
    adventure.is_public = make_public
    
    if make_public:
        # Generate share token if it doesn't exist
        if not adventure.share_token:
            adventure.generate_share_token()
        adventure.shared_at = datetime.now(timezone.utc)
    else:
        # Clear sharing data when making private
        adventure.shared_at = None
        # Keep the share_token for potential future sharing
    
    db.commit()
    db.refresh(adventure)
    return adventure


def get_public_adventure_by_token(db: Session, share_token: str) -> Optional[Adventure]:
    """Get a publicly shared adventure by its share token"""
    return (db.query(Adventure)
            .filter(Adventure.share_token == share_token, Adventure.is_public == True)
            .first())


def get_user_adventure_by_id(db: Session, adventure_id: int, user_id: int) -> Optional[Adventure]:
    """Get an adventure by ID if it belongs to the user"""
    return (db.query(Adventure)
            .filter(Adventure.id == adventure_id, Adventure.created_by == user_id)
            .first())
