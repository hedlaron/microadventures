"""
Domain service for adventure quota operations
"""

from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from adventure.models.adventure import AdventureQuota
from adventure.repositories.adventure_quota_repository import AdventureQuotaRepository


class AdventureQuotaDomainService:
    """Domain service for adventure quota business logic"""

    def __init__(self, quota_repo: AdventureQuotaRepository):
        self.quota_repo = quota_repo

    def get_or_create_quota(self, db: Session, user_id: int) -> AdventureQuota:
        """Get existing quota or create new one for user"""
        if user_id <= 0:
            raise ValueError("Invalid user ID")

        quota = self.quota_repo.get_by_user_id(db, user_id)
        if not quota:
            quota = AdventureQuota(user_id=user_id)
            quota = self.quota_repo.create(db, quota)

        return quota

    def reset_quota_if_needed(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        """Reset quota if 24 hours have passed since last reset"""
        now = datetime.now(UTC)

        # Ensure last_reset_date is timezone-aware
        last_reset = quota.last_reset_date
        if last_reset.tzinfo is None:
            last_reset = last_reset.replace(tzinfo=UTC)

        # Check if 24 hours have passed
        if now - last_reset > timedelta(hours=24):
            quota.quota_remaining = 10  # Reset to default quota
            quota.last_reset_date = now
            quota = self.quota_repo.update(db, quota)

        return quota

    def can_generate_adventure(self, db: Session, user_id: int) -> bool:
        """Check if user can generate an adventure"""
        quota = self.get_or_create_quota(db, user_id)
        quota = self.reset_quota_if_needed(db, quota)
        return quota.quota_remaining > 0

    def consume_quota(self, db: Session, user_id: int) -> AdventureQuota:
        """Consume one quota unit for the user"""
        quota = self.get_or_create_quota(db, user_id)
        quota = self.reset_quota_if_needed(db, quota)

        if quota.quota_remaining <= 0:
            raise ValueError("No remaining quota")

        quota.quota_remaining -= 1
        return self.quota_repo.update(db, quota)

    def get_quota_status(self, db: Session, user_id: int) -> dict:
        """Get quota status for the user"""
        quota = self.get_or_create_quota(db, user_id)
        quota = self.reset_quota_if_needed(db, quota)

        # Calculate time until reset
        now = datetime.now(UTC)
        last_reset = quota.last_reset_date
        if last_reset.tzinfo is None:
            last_reset = last_reset.replace(tzinfo=UTC)

        next_reset = last_reset + timedelta(hours=24)
        time_until_reset = int((next_reset - now).total_seconds())

        return {
            "adventures_remaining": quota.quota_remaining,
            "total_quota": 10,
            "reset_time": next_reset,
            "time_until_reset": max(0, time_until_reset),
        }


# Create domain service instance
adventure_quota_domain_service = AdventureQuotaDomainService(AdventureQuotaRepository())
