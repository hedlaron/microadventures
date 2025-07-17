from datetime import UTC
from unittest.mock import patch

import pytest
from sqlalchemy.orm import Session

from adventure.models.adventure import Adventure, AdventureQuota
from adventure.schemas.adventure import AdventureRequest
from adventure.services.adventure_domain_service import AdventureDomainService
from user.models.user import User


@pytest.mark.unit
class TestAdventureDomainService:
    """Test cases for AdventureDomainService"""

    def test_init(self):
        """Test service initialization"""
        service = AdventureDomainService()

        assert service.adventure_repo is not None
        assert service.quota_repo is not None

    @patch("adventure.services.adventure_domain_service.generate_adventure_recommendations")
    def test_generate_adventure_for_user_success(
        self, mock_ai_service, db: Session, test_user: User, mock_openai_response: dict
    ):
        """Test successful adventure generation"""
        mock_ai_service.return_value = mock_openai_response

        service = AdventureDomainService()
        request = AdventureRequest(
            location="San Francisco, CA",
            destination="Golden Gate Park",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=True,
        )

        adventure = service.generate_adventure_for_user(db, test_user.id, request)

        assert adventure is not None
        assert adventure.title == "Mock Adventure"
        assert adventure.location == "San Francisco, CA"
        assert adventure.created_by == test_user.id

        # Verify quota was decremented
        quota = service.quota_repo.get_by_user_id(db, test_user.id)
        assert quota.quota_remaining == 9  # Started with 10, decremented by 1

    @patch("adventure.services.adventure_domain_service.generate_adventure_recommendations")
    def test_generate_adventure_for_user_quota_exhausted(
        self, mock_ai_service, db: Session, test_user: User
    ):
        """Test adventure generation with exhausted quota"""
        service = AdventureDomainService()

        # Create quota with 0 remaining
        quota = AdventureQuota(user_id=test_user.id, quota_remaining=0)
        service.quota_repo.create(db, quota)

        request = AdventureRequest(
            location="San Francisco, CA",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=True,
        )

        with pytest.raises(ValueError, match="quota exhausted"):
            service.generate_adventure_for_user(db, test_user.id, request)

        # Verify AI service was not called
        mock_ai_service.assert_not_called()

    def test_get_user_adventures(self, db: Session, test_user: User, test_adventure: Adventure):
        """Test getting user adventures"""
        service = AdventureDomainService()

        adventures = service.get_user_adventures(db, test_user.id)

        assert len(adventures) == 1
        assert adventures[0].id == test_adventure.id
        assert adventures[0].created_by == test_user.id

    def test_share_adventure_make_public(
        self, db: Session, test_user: User, test_adventure: Adventure
    ):
        """Test sharing an adventure"""
        service = AdventureDomainService()

        shared_adventure = service.share_adventure(
            db, test_adventure.id, test_user.id, make_public=True
        )

        assert shared_adventure is not None
        assert shared_adventure.is_public is True
        assert shared_adventure.share_token is not None
        assert shared_adventure.shared_at is not None

    def test_share_adventure_make_private(
        self, db: Session, test_user: User, test_adventure: Adventure
    ):
        """Test making an adventure private"""
        service = AdventureDomainService()

        # First make it public
        test_adventure.is_public = True
        test_adventure.generate_share_token()
        db.commit()

        # Then make it private
        shared_adventure = service.share_adventure(
            db, test_adventure.id, test_user.id, make_public=False
        )

        assert shared_adventure is not None
        assert shared_adventure.is_public is False
        assert shared_adventure.shared_at is None
        # Note: share_token is kept for potential future sharing

    def test_share_adventure_wrong_user(self, db: Session, test_adventure: Adventure):
        """Test sharing adventure with wrong user"""
        service = AdventureDomainService()

        shared_adventure = service.share_adventure(db, test_adventure.id, 999, make_public=True)

        assert shared_adventure is None

    def test_get_shared_adventure(self, db: Session, test_adventure: Adventure):
        """Test getting shared adventure"""
        service = AdventureDomainService()

        # Make adventure public
        test_adventure.is_public = True
        test_adventure.generate_share_token()
        db.commit()

        shared_adventure = service.get_shared_adventure(db, test_adventure.share_token)

        assert shared_adventure is not None
        assert shared_adventure.id == test_adventure.id
        assert shared_adventure.is_public is True

    def test_get_shared_adventure_not_found(self, db: Session):
        """Test getting non-existent shared adventure"""
        service = AdventureDomainService()

        shared_adventure = service.get_shared_adventure(db, "nonexistent-token")

        assert shared_adventure is None

    def test_get_user_quota_status(self, db: Session, test_user: User):
        """Test getting user quota status"""
        service = AdventureDomainService()

        quota = service.get_user_quota_status(db, test_user.id)

        assert quota is not None
        assert quota.user_id == test_user.id
        assert quota.quota_remaining == 10  # Default quota

    def test_ensure_user_has_quota_creates_new(self, db: Session, test_user: User):
        """Test that quota is created if it doesn't exist"""
        service = AdventureDomainService()

        # Verify no quota exists
        quota = service.quota_repo.get_by_user_id(db, test_user.id)
        assert quota is None

        # Call method that should create quota
        quota = service._ensure_user_has_quota(db, test_user.id)

        assert quota is not None
        assert quota.user_id == test_user.id
        assert quota.quota_remaining == 10

    def test_reset_quota_if_needed_should_reset(self, db: Session, test_user: User):
        """Test quota reset when 24 hours have passed"""
        from datetime import datetime, timedelta

        service = AdventureDomainService()

        # Create quota with old reset date
        quota = AdventureQuota(
            user_id=test_user.id,
            quota_remaining=0,
            last_reset_date=datetime.now(UTC) - timedelta(hours=25),
        )
        quota = service.quota_repo.create(db, quota)

        reset_quota = service._reset_quota_if_needed(db, quota)

        assert reset_quota.quota_remaining == 10

    def test_reset_quota_if_needed_should_not_reset(self, db: Session, test_user: User):
        """Test quota not reset when less than 24 hours have passed"""
        from datetime import datetime

        service = AdventureDomainService()

        # Create quota with recent reset date
        quota = AdventureQuota(
            user_id=test_user.id, quota_remaining=5, last_reset_date=datetime.now(UTC)
        )
        quota = service.quota_repo.create(db, quota)

        reset_quota = service._reset_quota_if_needed(db, quota)

        assert reset_quota.quota_remaining == 5  # Should not be reset

    def test_decrement_user_quota(self, db: Session, test_user: User):
        """Test decrementing user quota"""
        service = AdventureDomainService()

        quota = AdventureQuota(user_id=test_user.id, quota_remaining=5)
        quota = service.quota_repo.create(db, quota)

        updated_quota = service._decrement_user_quota(db, quota)

        assert updated_quota.quota_remaining == 4

    def test_decrement_user_quota_at_zero(self, db: Session, test_user: User):
        """Test decrementing quota when already at zero"""
        service = AdventureDomainService()

        quota = AdventureQuota(user_id=test_user.id, quota_remaining=0)
        quota = service.quota_repo.create(db, quota)

        updated_quota = service._decrement_user_quota(db, quota)

        assert updated_quota.quota_remaining == 0  # Should not go negative


@pytest.mark.integration
class TestAdventureDomainServiceIntegration:
    """Integration tests for AdventureDomainService"""

    @patch("adventure.services.adventure_domain_service.generate_adventure_recommendations")
    def test_full_adventure_generation_workflow(
        self, mock_ai_service, db: Session, test_user: User, mock_openai_response: dict
    ):
        """Test the complete adventure generation workflow"""
        mock_ai_service.return_value = mock_openai_response

        service = AdventureDomainService()
        request = AdventureRequest(
            location="San Francisco, CA",
            destination="Golden Gate Park",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=True,
        )

        # 1. Generate adventure
        adventure = service.generate_adventure_for_user(db, test_user.id, request)
        assert adventure is not None

        # 2. Verify it appears in user's adventures
        adventures = service.get_user_adventures(db, test_user.id)
        assert len(adventures) == 1
        assert adventures[0].id == adventure.id

        # 3. Share the adventure
        shared_adventure = service.share_adventure(db, adventure.id, test_user.id, make_public=True)
        assert shared_adventure is not None
        assert shared_adventure.is_public is True

        # 4. Retrieve shared adventure
        retrieved_adventure = service.get_shared_adventure(db, shared_adventure.share_token)
        assert retrieved_adventure is not None
        assert retrieved_adventure.id == adventure.id

        # 5. Check quota was decremented
        quota = service.get_user_quota_status(db, test_user.id)
        assert quota.quota_remaining == 9
