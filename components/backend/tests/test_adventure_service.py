
from datetime import UTC

import pytest
from sqlalchemy.orm import Session

from adventure.models.adventure import AdventureQuota
from adventure.services.adventure_service import AdventureService
from user.models.user import User


@pytest.mark.unit
class TestAdventureService:
    """Test cases for AdventureService"""

    def test_get_adventure_quota(
        self, db: Session, test_user: User, test_adventure_quota: AdventureQuota
    ):
        """Test getting adventure quota"""
        service = AdventureService()

        quota = service.get_adventure_quota(db, test_user.id)

        assert quota is not None
        assert quota.user_id == test_user.id
        assert quota.quota_remaining == 5

    def test_get_adventure_quota_not_found(self, db: Session):
        """Test getting adventure quota for non-existent user"""
        service = AdventureService()

        quota = service.get_adventure_quota(db, 999)

        assert quota is None

    def test_create_adventure_quota(self, db: Session, test_user: User):
        """Test creating adventure quota"""
        service = AdventureService()

        quota = service.create_adventure_quota(db, test_user.id)

        assert quota is not None
        assert quota.user_id == test_user.id
        assert quota.quota_remaining == 10  # Default quota

    def test_reset_quota_if_needed_should_reset(self, db: Session, test_user: User):
        """Test resetting quota when 24 hours have passed"""
        from datetime import datetime, timedelta

        service = AdventureService()

        # Create quota with old reset date
        quota = AdventureQuota(
            user_id=test_user.id,
            quota_remaining=0,
            last_reset_date=datetime.now(UTC) - timedelta(hours=25),
        )
        db.add(quota)
        db.commit()
        db.refresh(quota)

        updated_quota = service.reset_quota_if_needed(db, quota)

        assert updated_quota.quota_remaining == 10  # Should be reset
        assert updated_quota.last_reset_date > quota.last_reset_date

    def test_reset_quota_if_needed_should_not_reset(self, db: Session, test_user: User):
        """Test not resetting quota when less than 24 hours have passed"""
        from datetime import datetime

        service = AdventureService()

        # Create quota with recent reset date
        original_date = datetime.now(UTC)
        quota = AdventureQuota(
            user_id=test_user.id, quota_remaining=5, last_reset_date=original_date
        )
        db.add(quota)
        db.commit()
        db.refresh(quota)

        updated_quota = service.reset_quota_if_needed(db, quota)

        assert updated_quota.quota_remaining == 5  # Should not be reset
        assert updated_quota.last_reset_date == original_date


@pytest.mark.integration
class TestAdventureServiceIntegration:
    """Integration tests for AdventureService"""

    def test_full_quota_workflow(self, db: Session, test_user: User):
        """Test the complete quota workflow"""
        service = AdventureService()

        # 1. Get quota (should not exist)
        quota = service.get_adventure_quota(db, test_user.id)
        assert quota is None

        # 2. Create quota
        quota = service.create_adventure_quota(db, test_user.id)
        assert quota.quota_remaining == 10

        # 3. Get quota again (should exist now)
        quota = service.get_adventure_quota(db, test_user.id)
        assert quota is not None
        assert quota.quota_remaining == 10

        # 4. Reset quota (should not reset since it's recent)
        quota = service.reset_quota_if_needed(db, quota)
        assert quota.quota_remaining == 10
