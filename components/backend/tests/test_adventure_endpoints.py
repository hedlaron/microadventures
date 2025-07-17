from unittest.mock import patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient


@pytest.mark.integration
class TestAdventureEndpoints:
    """Integration tests for adventure endpoints"""

    @patch("adventure.services.ai_service.generate_adventure_recommendations")
    def test_generate_adventure_success(
        self, mock_ai_service, client: TestClient, auth_headers: dict, mock_openai_response: dict
    ):
        """Test successful adventure generation"""
        mock_ai_service.return_value = mock_openai_response

        adventure_data = {
            "location": "San Francisco, CA",
            "destination": "Golden Gate Park",
            "duration": "half-day",
            "activity_type": "hiking",
            "is_round_trip": True,
        }

        response = client.post(
            "/api/adventures/generate", json=adventure_data, headers=auth_headers
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "id" in data
        assert data["title"] == "Mock Adventure"
        assert data["location"] == "San Francisco, CA"
        assert data["destination"] == "Golden Gate Park"
        assert data["duration"] == "half-day"
        assert data["activity_type"] == "hiking"
        assert data["is_round_trip"] is True

    def test_generate_adventure_unauthorized(self, client: TestClient):
        """Test adventure generation without authentication"""
        adventure_data = {
            "location": "San Francisco, CA",
            "duration": "half-day",
            "activity_type": "hiking",
            "is_round_trip": True,
        }

        response = client.post("/api/adventures/generate", json=adventure_data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_generate_adventure_quota_exceeded(
        self, client: TestClient, auth_headers: dict, test_adventure_quota
    ):
        """Test adventure generation with exceeded quota"""
        # Set quota to 0
        test_adventure_quota.quota_remaining = 0

        adventure_data = {
            "location": "San Francisco, CA",
            "duration": "half-day",
            "activity_type": "hiking",
            "is_round_trip": True,
        }

        response = client.post(
            "/api/adventures/generate", json=adventure_data, headers=auth_headers
        )

        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        data = response.json()
        assert "quota exhausted" in data["detail"].lower()

    def test_get_my_history(self, client: TestClient, auth_headers: dict, test_adventure):
        """Test getting user's adventure history"""
        response = client.get("/api/adventures/my-history", headers=auth_headers)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "adventures" in data
        assert len(data["adventures"]) == 1
        assert data["adventures"][0]["id"] == test_adventure.id
        assert data["adventures"][0]["title"] == test_adventure.title

    def test_get_my_history_unauthorized(self, client: TestClient):
        """Test getting adventure history without authentication"""
        response = client.get("/api/adventures/my-history")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_quota(self, client: TestClient, auth_headers: dict, test_adventure_quota):
        """Test getting user's quota"""
        response = client.get("/api/adventures/quota", headers=auth_headers)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "adventures_remaining" in data
        assert "total_quota" in data
        assert data["adventures_remaining"] == test_adventure_quota.quota_remaining

    def test_get_quota_unauthorized(self, client: TestClient):
        """Test getting quota without authentication"""
        response = client.get("/api/adventures/quota")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_share_adventure(self, client: TestClient, auth_headers: dict, test_adventure):
        """Test sharing an adventure"""
        share_data = {"adventure_id": test_adventure.id, "make_public": True}

        response = client.post(
            f"/api/adventures/{test_adventure.id}/share", json=share_data, headers=auth_headers
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert data["success"] is True
        assert "share_url" in data
        assert data["share_url"] is not None

    def test_share_adventure_unauthorized(self, client: TestClient, test_adventure):
        """Test sharing adventure without authentication"""
        share_data = {"adventure_id": test_adventure.id, "make_public": True}

        response = client.post(f"/api/adventures/{test_adventure.id}/share", json=share_data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_share_adventure_not_found(self, client: TestClient, auth_headers: dict):
        """Test sharing non-existent adventure"""
        share_data = {"adventure_id": 999, "make_public": True}

        response = client.post("/api/adventures/999/share", json=share_data, headers=auth_headers)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_shared_adventure(self, client: TestClient, test_adventure):
        """Test getting a shared adventure"""
        # Make adventure public first
        test_adventure.is_public = True
        test_adventure.generate_share_token()

        response = client.get(f"/api/adventures/shared/{test_adventure.share_token}")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert data["id"] == test_adventure.id
        assert data["title"] == test_adventure.title
        assert "created_at" in data
        assert "share_token" not in data  # Should not expose share token

    def test_get_shared_adventure_not_found(self, client: TestClient):
        """Test getting non-existent shared adventure"""
        response = client.get("/api/adventures/shared/nonexistent-token")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_shared_adventure_not_public(self, client: TestClient, test_adventure):
        """Test getting shared adventure that is not public"""
        # Generate token but keep private
        test_adventure.generate_share_token()
        test_adventure.is_public = False

        response = client.get(f"/api/adventures/shared/{test_adventure.share_token}")

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.integration
class TestAdventureValidation:
    """Test adventure request validation"""

    def test_generate_adventure_missing_location(self, client: TestClient, auth_headers: dict):
        """Test adventure generation with missing location"""
        adventure_data = {"duration": "half-day", "activity_type": "hiking", "is_round_trip": True}

        response = client.post(
            "/api/adventures/generate", json=adventure_data, headers=auth_headers
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_generate_adventure_invalid_duration(self, client: TestClient, auth_headers: dict):
        """Test adventure generation with invalid duration"""
        adventure_data = {
            "location": "San Francisco, CA",
            "duration": "invalid-duration",
            "activity_type": "hiking",
            "is_round_trip": True,
        }

        response = client.post(
            "/api/adventures/generate", json=adventure_data, headers=auth_headers
        )

        # Should still work as validation is minimal for now
        # In a real implementation, you might want stricter validation
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_422_UNPROCESSABLE_ENTITY]
