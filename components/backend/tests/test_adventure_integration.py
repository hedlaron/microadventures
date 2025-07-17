"""
Integration tests for adventure domain
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from adventure.models.adventure import Adventure, AdventureQuota
from adventure.repositories.adventure_quota_repository import AdventureQuotaRepository
from adventure.repositories.adventure_repository import AdventureRepository
from adventure.services.adventure_quota_domain_service import AdventureQuotaDomainService
from user.models.user import User


@pytest.mark.integration
class TestAdventureIntegration:
    """Integration tests for adventure domain"""

    def test_create_adventure_with_quota_check(self, db: Session, test_user: User):
        """Test creating an adventure with quota validation"""
        # Arrange
        adventure_repo = AdventureRepository()
        quota_repo = AdventureQuotaRepository()
        quota_service = AdventureQuotaDomainService(quota_repo)

        # Act - Create initial quota
        quota = quota_service.get_or_create_quota(db, test_user.id)

        # Assert initial state
        assert quota.quota_remaining == 10
        assert quota.user_id == test_user.id

        # Act - Create adventure
        adventure = Adventure(
            title="Integration Test Adventure",
            description="Test adventure for integration testing",
            location="Test Location",
            destination="Test Destination",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=True,
            created_by=test_user.id,
            itinerary=[
                {
                    "time": "09:00",
                    "activity": "Start hiking",
                    "location": "Trailhead",
                    "duration": "30 minutes",
                    "notes": "Integration test activity",
                }
            ],
            route={
                "start_address": "Test Start",
                "end_address": "Test End",
                "waypoints": [],
                "map_embed_url": "https://maps.google.com/test",
                "estimated_distance": "5 km",
                "estimated_travel_time": "2 hours",
            },
            weather_forecast={
                "temperature": "22°C",
                "conditions": "Sunny",
                "precipitation": "0%",
                "wind": "Light breeze",
                "uv_index": "5",
                "best_time_outdoors": "Morning",
            },
            packing_list={
                "essential": ["Water", "Snacks"],
                "weather_specific": ["Sunscreen"],
                "optional": ["Camera"],
                "food_and_drink": ["Energy bars"],
            },
            recommendations={
                "photo_opportunities": ["Scenic overlook"],
                "local_tips": ["Start early"],
                "hidden_gems": ["Secret waterfall"],
            },
        )

        created_adventure = adventure_repo.create(db, adventure)

        # Assert adventure creation
        assert created_adventure.id is not None
        assert created_adventure.title == "Integration Test Adventure"
        assert created_adventure.created_by == test_user.id

        # Act - Consume quota
        updated_quota = quota_service.consume_quota(db, test_user.id)

        # Assert quota consumption
        assert updated_quota.quota_remaining == 9

        # Act - Get user adventures
        user_adventures = adventure_repo.get_by_user_id(db, test_user.id)

        # Assert user adventures
        assert len(user_adventures) == 1
        assert user_adventures[0].id == created_adventure.id

    def test_adventure_sharing_workflow(self, db: Session, test_user: User):
        """Test complete adventure sharing workflow"""
        # Arrange
        adventure_repo = AdventureRepository()

        adventure = Adventure(
            title="Shareable Adventure",
            description="Test adventure for sharing",
            location="Share Location",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=False,
            created_by=test_user.id,
            itinerary=[],
            route={},
            weather_forecast={},
            packing_list={},
            recommendations={},
        )

        created_adventure = adventure_repo.create(db, adventure)

        # Act - Make adventure public
        created_adventure.is_public = True
        created_adventure.generate_share_token()
        updated_adventure = adventure_repo.update(db, created_adventure)

        # Assert sharing setup
        assert updated_adventure.is_public is True
        assert updated_adventure.share_token is not None

        # Act - Get adventure by share token
        shared_adventure = adventure_repo.get_by_share_token(db, updated_adventure.share_token)

        # Assert public access
        assert shared_adventure is not None
        assert shared_adventure.id == created_adventure.id
        assert shared_adventure.is_public is True

        # Act - Make adventure private
        updated_adventure.is_public = False
        private_adventure = adventure_repo.update(db, updated_adventure)

        # Assert private access
        assert private_adventure.is_public is False

        # Act - Try to get private adventure by share token
        no_access_adventure = adventure_repo.get_by_share_token(db, updated_adventure.share_token)

        # Assert no access to private adventure
        assert no_access_adventure is None

    def test_quota_reset_workflow(self, db: Session, test_user: User):
        """Test quota reset workflow"""
        # Arrange
        quota_repo = AdventureQuotaRepository()
        quota_service = AdventureQuotaDomainService(quota_repo)

        # Create quota with no remaining quota
        quota = AdventureQuota(user_id=test_user.id, quota_remaining=0)
        created_quota = quota_repo.create(db, quota)

        # Assert initial state
        assert created_quota.quota_remaining == 0
        assert not quota_service.can_generate_adventure(db, test_user.id)

        # Act - Simulate quota reset (would happen after 24 hours)
        created_quota.quota_remaining = 10
        updated_quota = quota_repo.update(db, created_quota)

        # Assert quota reset
        assert updated_quota.quota_remaining == 10
        assert quota_service.can_generate_adventure(db, test_user.id)

        # Act - Get quota status
        status = quota_service.get_quota_status(db, test_user.id)

        # Assert quota status
        assert status["adventures_remaining"] == 10
        assert status["total_quota"] == 10
        assert "reset_time" in status
        assert "time_until_reset" in status

    def test_adventure_api_endpoints(self, client: TestClient, auth_headers: dict, test_user: User):
        """Test adventure API endpoints integration"""
        # Test getting quota
        response = client.get("/api/adventures/quota", headers=auth_headers)
        assert response.status_code == 200
        quota_data = response.json()
        assert "adventures_remaining" in quota_data
        assert "total_quota" in quota_data

        # Test getting adventure history
        response = client.get("/api/adventures/my-history", headers=auth_headers)
        assert response.status_code == 200
        history_data = response.json()
        assert "adventures" in history_data
        assert isinstance(history_data["adventures"], list)

        # Test adventure generation (mock the AI service)
        _adventure_data = {  # Not used in actual test
            "location": "Test Location",
            "destination": "Test Destination",
            "duration": "half-day",
            "activity_type": "hiking",
            "is_round_trip": True,
        }

        # This would require mocking the AI service to avoid external dependencies
        # For now, we'll skip the actual generation test in integration
        # response = client.post("/api/adventures/generate", json=adventure_data, headers=auth_headers)
        # assert response.status_code == 200
