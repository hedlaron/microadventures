from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from adventure.models.adventure import Adventure, AdventureQuota
from adventure.repositories.adventure_quota_repository import AdventureQuotaRepository
from adventure.repositories.adventure_repository import AdventureRepository


class AdventureService:
    """Service layer for adventure operations"""

    def __init__(
        self,
        adventure_repo: AdventureRepository = None,
        quota_repo: AdventureQuotaRepository = None,
    ):
        self.adventure_repo = adventure_repo or AdventureRepository()
        self.quota_repo = quota_repo or AdventureQuotaRepository()

    def get_adventure_quota(self, db: Session, user_id: int) -> AdventureQuota | None:
        """Get the adventure quota for a user"""
        return self.quota_repo.get_by_user_id(db, user_id)

    def create_adventure_quota(self, db: Session, user_id: int) -> AdventureQuota:
        """Create a new adventure quota for a user"""
        quota = AdventureQuota(user_id=user_id)
        return self.quota_repo.create(db, quota)

    def reset_quota_if_needed(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        """Reset quota if 24 hours have passed since last reset"""
        now = datetime.now(UTC)
        # Ensure last_reset_date is timezone-aware
        last_reset = quota.last_reset_date
        if last_reset.tzinfo is None:
            last_reset = last_reset.replace(tzinfo=UTC)

        if now - last_reset > timedelta(hours=24):
            quota.quota_remaining = 10
            quota.last_reset_date = now
            return self.quota_repo.update(db, quota)
        return quota


# Create service instance
adventure_service = AdventureService()


# Legacy function wrappers for backward compatibility
def get_adventure_quota(db: Session, user_id: int) -> AdventureQuota | None:
    """Get the adventure quota for a user"""
    return adventure_service.get_adventure_quota(db, user_id)


def create_adventure_quota(db: Session, user_id: int) -> AdventureQuota:
    """Create a new adventure quota for a user"""
    return adventure_service.create_adventure_quota(db, user_id)


def reset_quota_if_needed(db: Session, quota: AdventureQuota) -> AdventureQuota:
    """Reset quota if 24 hours have passed since last reset"""
    return adventure_service.reset_quota_if_needed(db, quota)


def create_adventure(
    db: Session,
    location: str,
    destination: str | None,
    duration: str,
    activity_type: str,
    is_round_trip: bool,
    created_by: int,
    title: str,
    description: str,
    image_url: str | None,
    itinerary: list,
    route: dict,
    weather_forecast: dict,
    packing_list: dict,
    recommendations: dict,
    estimated_cost: str | None = None,
    difficulty_level: str | None = None,
    best_season: str | None = None,
    accessibility: str | None = None,
) -> Adventure:
    """Create a new adventure recommendation"""
    adventure = Adventure(
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
        accessibility=accessibility,
    )
    return adventure_service.adventure_repo.create(db, adventure)


def get_user_adventures(db: Session, user_id: int, limit: int = 50) -> list[Adventure]:
    """Get all adventures created by a user"""
    return adventure_service.adventure_repo.get_by_user_id(db, user_id, limit)


def get_adventure_by_id(db: Session, adventure_id: int) -> Adventure | None:
    """Get an adventure by its ID"""
    return adventure_service.adventure_repo.get_by_id(db, adventure_id)


def decrement_user_quota(db: Session, quota: AdventureQuota) -> AdventureQuota:
    """Decrement the user's quota by 1"""
    if quota.quota_remaining > 0:
        quota.quota_remaining -= 1
        return adventure_service.quota_repo.update(db, quota)
    return quota


def toggle_adventure_sharing(
    db: Session, adventure_id: int, user_id: int, make_public: bool
) -> Adventure | None:
    """Toggle public sharing for an adventure"""
    adventure = adventure_service.adventure_repo.get_user_adventure_by_id(db, adventure_id, user_id)

    if not adventure:
        return None

    adventure.is_public = make_public

    if make_public:
        # Generate share token if it doesn't exist
        if not adventure.share_token:
            adventure.generate_share_token()
        adventure.shared_at = datetime.now(UTC)
    else:
        # Clear sharing data when making private
        adventure.shared_at = None
        # Keep the share_token for potential future sharing

    return adventure_service.adventure_repo.update(db, adventure)


def get_public_adventure_by_token(db: Session, share_token: str) -> Adventure | None:
    """Get a publicly shared adventure by its share token"""
    return adventure_service.adventure_repo.get_by_share_token(db, share_token)


def get_user_adventure_by_id(db: Session, adventure_id: int, user_id: int) -> Adventure | None:
    """Get an adventure by ID if it belongs to the user"""
    return adventure_service.adventure_repo.get_user_adventure_by_id(db, adventure_id, user_id)
