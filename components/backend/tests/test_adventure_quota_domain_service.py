"""
Unit tests for adventure domain service
"""

from unittest.mock import Mock, patch

import pytest
from sqlalchemy.orm import Session

from adventure.models.adventure import AdventureQuota
from adventure.repositories.adventure_quota_repository import AdventureQuotaRepository
from adventure.services.adventure_quota_domain_service import AdventureQuotaDomainService


class TestAdventureQuotaDomainService:
    """Test cases for AdventureQuotaDomainService"""

    def setup_method(self):
        """Setup test fixtures"""
        self.quota_repo_mock = Mock(spec=AdventureQuotaRepository)
        self.service = AdventureQuotaDomainService(self.quota_repo_mock)
        self.db_mock = Mock(spec=Session)

    @pytest.mark.unit
    def test_get_or_create_quota_existing(self):
        """Test getting existing quota"""
        # Arrange
        user_id = 1
        existing_quota = Mock(spec=AdventureQuota)
        self.quota_repo_mock.get_by_user_id.return_value = existing_quota

        # Act
        result = self.service.get_or_create_quota(self.db_mock, user_id)

        # Assert
        self.quota_repo_mock.get_by_user_id.assert_called_once_with(self.db_mock, user_id)
        self.quota_repo_mock.create.assert_not_called()
        assert result == existing_quota

    @pytest.mark.unit
    def test_get_or_create_quota_new(self):
        """Test creating new quota when none exists"""
        # Arrange
        user_id = 1
        new_quota = Mock(spec=AdventureQuota)
        self.quota_repo_mock.get_by_user_id.return_value = None
        self.quota_repo_mock.create.return_value = new_quota

        # Act
        result = self.service.get_or_create_quota(self.db_mock, user_id)

        # Assert
        self.quota_repo_mock.get_by_user_id.assert_called_once_with(self.db_mock, user_id)
        self.quota_repo_mock.create.assert_called_once()
        assert result == new_quota

    @pytest.mark.unit
    def test_get_or_create_quota_invalid_user_id(self):
        """Test error handling for invalid user ID"""
        # Arrange
        user_id = 0

        # Act & Assert
        with pytest.raises(ValueError, match="Invalid user ID"):
            self.service.get_or_create_quota(self.db_mock, user_id)

    @pytest.mark.unit
    def test_can_generate_adventure_with_quota(self):
        """Test checking if user can generate adventure with remaining quota"""
        # Arrange
        user_id = 1
        quota = Mock(spec=AdventureQuota)
        quota.quota_remaining = 5

        with patch.object(self.service, "get_or_create_quota", return_value=quota) as get_mock:
            with patch.object(
                self.service, "reset_quota_if_needed", return_value=quota
            ) as reset_mock:
                # Act
                result = self.service.can_generate_adventure(self.db_mock, user_id)

                # Assert
                get_mock.assert_called_once_with(self.db_mock, user_id)
                reset_mock.assert_called_once_with(self.db_mock, quota)
                assert result is True

    @pytest.mark.unit
    def test_can_generate_adventure_no_quota(self):
        """Test checking if user can generate adventure with no remaining quota"""
        # Arrange
        user_id = 1
        quota = Mock(spec=AdventureQuota)
        quota.quota_remaining = 0

        with patch.object(self.service, "get_or_create_quota", return_value=quota) as get_mock:
            with patch.object(
                self.service, "reset_quota_if_needed", return_value=quota
            ) as reset_mock:
                # Act
                result = self.service.can_generate_adventure(self.db_mock, user_id)

                # Assert
                get_mock.assert_called_once_with(self.db_mock, user_id)
                reset_mock.assert_called_once_with(self.db_mock, quota)
                assert result is False

    @pytest.mark.unit
    def test_consume_quota_success(self):
        """Test consuming quota successfully"""
        # Arrange
        user_id = 1
        quota = Mock(spec=AdventureQuota)
        quota.quota_remaining = 5
        updated_quota = Mock(spec=AdventureQuota)
        updated_quota.quota_remaining = 4

        self.quota_repo_mock.update.return_value = updated_quota

        with patch.object(self.service, "get_or_create_quota", return_value=quota) as get_mock:
            with patch.object(
                self.service, "reset_quota_if_needed", return_value=quota
            ) as reset_mock:
                # Act
                result = self.service.consume_quota(self.db_mock, user_id)

                # Assert
                get_mock.assert_called_once_with(self.db_mock, user_id)
                reset_mock.assert_called_once_with(self.db_mock, quota)
                assert quota.quota_remaining == 4
                self.quota_repo_mock.update.assert_called_once_with(self.db_mock, quota)
                assert result == updated_quota

    @pytest.mark.unit
    def test_consume_quota_no_remaining(self):
        """Test consuming quota when none remaining"""
        # Arrange
        user_id = 1
        quota = Mock(spec=AdventureQuota)
        quota.quota_remaining = 0

        with patch.object(self.service, "get_or_create_quota", return_value=quota) as get_mock:
            with patch.object(
                self.service, "reset_quota_if_needed", return_value=quota
            ) as reset_mock:
                # Act & Assert
                with pytest.raises(ValueError, match="No remaining quota"):
                    self.service.consume_quota(self.db_mock, user_id)

                get_mock.assert_called_once_with(self.db_mock, user_id)
                reset_mock.assert_called_once_with(self.db_mock, quota)

    @pytest.mark.unit
    @patch("adventure.services.adventure_quota_domain_service.datetime")
    def test_get_quota_status(self, mock_datetime):
        """Test getting quota status"""
        # Arrange
        user_id = 1
        quota = Mock(spec=AdventureQuota)
        quota.quota_remaining = 7
        quota.last_reset_date = mock_datetime.now.return_value

        mock_datetime.now.return_value.replace.return_value = quota.last_reset_date

        with patch.object(self.service, "get_or_create_quota", return_value=quota) as get_mock:
            with patch.object(
                self.service, "reset_quota_if_needed", return_value=quota
            ) as reset_mock:
                # Act
                result = self.service.get_quota_status(self.db_mock, user_id)

                # Assert
                get_mock.assert_called_once_with(self.db_mock, user_id)
                reset_mock.assert_called_once_with(self.db_mock, quota)
                assert result["adventures_remaining"] == 7
                assert result["total_quota"] == 10
                assert "reset_time" in result
                assert "time_until_reset" in result
