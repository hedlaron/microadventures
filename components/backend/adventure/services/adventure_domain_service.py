"""
Domain service for adventure business logic.
This service orchestrates multiple repositories and handles complex business rules.
"""

from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from adventure.models.adventure import Adventure, AdventureQuota
from adventure.repositories.adventure_quota_repository import AdventureQuotaRepository
from adventure.repositories.adventure_repository import AdventureRepository
from adventure.schemas.adventure import AdventureRequest
from adventure.services.ai_service import generate_adventure_recommendations


class AdventureDomainService:
    """Domain service for adventure-related business logic"""

    def __init__(self):
        self.adventure_repo = AdventureRepository()
        self.quota_repo = AdventureQuotaRepository()

    def generate_adventure_for_user(
        self, db: Session, user_id: int, request: AdventureRequest
    ) -> Adventure:
        """Generate a new adventure for a user, handling quota checks and AI generation"""

        # 1. Check and manage user quota
        quota = self._ensure_user_has_quota(db, user_id)

        if quota.quota_remaining <= 0:
            raise ValueError("Daily adventure generation quota exhausted")

        # 2. Generate adventure using AI
        adventure_data = generate_adventure_recommendations(
            location=request.location,
            destination=request.destination,
            duration=request.duration,
            activity_type=request.activity_type,
            is_round_trip=request.is_round_trip,
            custom_activity=request.custom_activity,
            start_time=request.start_time,
            is_immediate=request.is_immediate,
        )

        # 3. Create adventure entity
        adventure = Adventure(
            location=request.location,
            destination=request.destination,
            duration=request.duration,
            activity_type=request.activity_type,
            is_round_trip=request.is_round_trip,
            created_by=user_id,
            title=adventure_data["title"],
            description=adventure_data["description"],
            image_url=adventure_data.get("image_url"),
            itinerary=adventure_data["itinerary"],
            route=adventure_data["route"],
            weather_forecast=adventure_data["weather_forecast"],
            packing_list=adventure_data["packing_list"],
            recommendations=adventure_data["recommendations"],
            estimated_cost=adventure_data.get("estimated_cost"),
            difficulty_level=adventure_data.get("difficulty_level"),
            best_season=adventure_data.get("best_season"),
            accessibility=adventure_data.get("accessibility"),
        )

        # 4. Save adventure
        created_adventure = self.adventure_repo.create(db, adventure)

        # 5. Decrement user quota
        self._decrement_user_quota(db, quota)

        return created_adventure

    def get_user_adventures(self, db: Session, user_id: int, limit: int = 50) -> list[Adventure]:
        """Get all adventures for a user"""
        return self.adventure_repo.get_by_user_id(db, user_id, limit)

    def share_adventure(
        self, db: Session, adventure_id: int, user_id: int, make_public: bool
    ) -> Adventure | None:
        """Share or unshare an adventure"""
        adventure = self.adventure_repo.get_user_adventure_by_id(db, adventure_id, user_id)

        if not adventure:
            return None

        adventure.is_public = make_public

        if make_public:
            if not adventure.share_token:
                adventure.generate_share_token()
            adventure.shared_at = datetime.now(UTC)
        else:
            adventure.shared_at = None

        return self.adventure_repo.update(db, adventure)

    def get_shared_adventure(self, db: Session, share_token: str) -> Adventure | None:
        """Get a publicly shared adventure"""
        return self.adventure_repo.get_by_share_token(db, share_token)

    def get_user_quota_status(self, db: Session, user_id: int) -> AdventureQuota:
        """Get current quota status for a user"""
        quota = self._ensure_user_has_quota(db, user_id)
        return quota

    def _ensure_user_has_quota(self, db: Session, user_id: int) -> AdventureQuota:
        """Ensure user has a quota record, creating one if needed"""
        quota = self.quota_repo.get_by_user_id(db, user_id)

        if not quota:
            quota = AdventureQuota(user_id=user_id)
            quota = self.quota_repo.create(db, quota)

        # Reset quota if needed (daily reset)
        quota = self._reset_quota_if_needed(db, quota)

        return quota

    def _reset_quota_if_needed(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        """Reset quota if 24 hours have passed since last reset"""
        now = datetime.now(UTC)

        # Ensure last_reset_date is timezone-aware
        last_reset = quota.last_reset_date
        if last_reset.tzinfo is None:
            last_reset = last_reset.replace(tzinfo=UTC)

        if now - last_reset > timedelta(hours=24):
            quota.quota_remaining = 10
            quota.last_reset_date = now
            quota = self.quota_repo.update(db, quota)

        return quota

    def _decrement_user_quota(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        """Decrement user quota by 1"""
        if quota.quota_remaining > 0:
            quota.quota_remaining -= 1
            quota = self.quota_repo.update(db, quota)

        return quota


# Create a singleton instance
adventure_domain_service = AdventureDomainService()
