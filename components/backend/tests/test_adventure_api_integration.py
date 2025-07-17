"""
Integration tests for adventure API endpoints
"""

import pytest
from fastapi.testclient import TestClient


class TestAdventureAPI:
    """Integration tests for adventure endpoints"""

    @pytest.mark.integration
    def test_adventure_quota_endpoint(self, client: TestClient, auth_headers: dict):
        """Test getting adventure quota status"""
        # Act
        response = client.get("/api/adventures/quota", headers=auth_headers)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert "adventures_remaining" in data
        assert "total_quota" in data
        assert "reset_time" in data
        assert "time_until_reset" in data
        assert isinstance(data["adventures_remaining"], int)
        assert isinstance(data["total_quota"], int)
        assert data["total_quota"] == 10

    @pytest.mark.integration
    def test_adventure_history_endpoint(
        self, client: TestClient, auth_headers: dict, test_adventure
    ):
        """Test getting adventure history"""
        # Act
        response = client.get("/api/adventures/my-history", headers=auth_headers)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert "adventures" in data
        assert isinstance(data["adventures"], list)
        assert len(data["adventures"]) >= 1

        # Check adventure structure
        adventure = data["adventures"][0]
        assert "id" in adventure
        assert "title" in adventure
        assert "description" in adventure
        assert "location" in adventure
        assert "created_at" in adventure

    @pytest.mark.integration
    def test_adventure_sharing_flow(self, client: TestClient, auth_headers: dict, test_adventure):
        """Test the complete adventure sharing flow"""
        # Step 1: Share the adventure
        share_response = client.post(
            f"/api/adventures/{test_adventure.id}/share",
            json={"adventure_id": test_adventure.id, "make_public": True},
            headers=auth_headers,
        )

        assert share_response.status_code == 200
        share_data = share_response.json()
        assert share_data["success"] is True
        assert "share_url" in share_data
        assert share_data["share_url"] is not None

        # Extract share token from URL
        share_token = share_data["share_url"].split("/")[-1]

        # Step 2: Access the shared adventure (no auth required)
        public_response = client.get(f"/api/adventures/shared/{share_token}")

        assert public_response.status_code == 200
        public_data = public_response.json()
        assert public_data["id"] == test_adventure.id
        assert public_data["title"] == test_adventure.title
        assert public_data["description"] == test_adventure.description

        # Step 3: Unshare the adventure
        unshare_response = client.post(
            f"/api/adventures/{test_adventure.id}/share",
            json={"adventure_id": test_adventure.id, "make_public": False},
            headers=auth_headers,
        )

        assert unshare_response.status_code == 200
        unshare_data = unshare_response.json()
        assert unshare_data["success"] is True
        assert "Adventure sharing disabled" in unshare_data["message"]

        # Step 4: Verify shared adventure is no longer accessible
        private_response = client.get(f"/api/adventures/shared/{share_token}")
        assert private_response.status_code == 404

    @pytest.mark.integration
    def test_adventure_quota_consumption(
        self, client: TestClient, auth_headers: dict, test_adventure_quota
    ):
        """Test that adventure quota decreases when generating adventures"""
        # Get initial quota
        initial_response = client.get("/api/adventures/quota", headers=auth_headers)
        initial_data = initial_response.json()
        initial_remaining = initial_data["adventures_remaining"]

        # Mock adventure generation request
        adventure_request = {
            "location": "San Francisco, CA",
            "destination": "Golden Gate Park",
            "duration": "half-day",
            "activity_type": "hiking",
            "is_round_trip": True,
        }

        # The AI service has a fallback mechanism, so this should succeed
        response = client.post(
            "/api/adventures/generate", json=adventure_request, headers=auth_headers
        )

        # Check that the adventure was generated successfully
        assert response.status_code == 200
        adventure_data = response.json()
        assert "id" in adventure_data
        assert "title" in adventure_data
        assert adventure_data["location"] == "San Francisco, CA"

        # Check that quota was consumed
        new_quota_response = client.get("/api/adventures/quota", headers=auth_headers)
        new_quota_data = new_quota_response.json()
        assert new_quota_data["adventures_remaining"] == initial_remaining - 1

    @pytest.mark.integration
    def test_unauthorized_access(self, client: TestClient):
        """Test that protected endpoints require authentication"""
        # Test quota endpoint without auth
        response = client.get("/api/adventures/quota")
        assert response.status_code == 401

        # Test history endpoint without auth
        response = client.get("/api/adventures/my-history")
        assert response.status_code == 401

        # Test generate endpoint without auth
        response = client.post("/api/adventures/generate", json={})
        assert response.status_code == 401

    @pytest.mark.integration
    def test_adventure_not_found(self, client: TestClient, auth_headers: dict):
        """Test handling of non-existent adventures"""
        # Try to share non-existent adventure
        response = client.post(
            "/api/adventures/99999/share",
            json={"adventure_id": 99999, "make_public": True},
            headers=auth_headers,
        )
        assert response.status_code == 404

        # Try to access non-existent shared adventure
        response = client.get("/api/adventures/shared/non-existent-token")
        assert response.status_code == 404
