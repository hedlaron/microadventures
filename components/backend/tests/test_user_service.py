from unittest.mock import patch

import pytest
from sqlalchemy.orm import Session

from user.models.user import User
from user.schemas.user import UserCreate
from user.services.user_service import UserService


@pytest.mark.unit
class TestUserService:
    """Test cases for UserService"""

    def test_get_users(self, db: Session, test_user: User):
        """Test getting all users"""
        service = UserService()

        users = service.get_users(db)

        assert len(users) == 1
        assert users[0].id == test_user.id
        assert users[0].email == test_user.email

    def test_get_user(self, db: Session, test_user: User):
        """Test getting user by ID"""
        service = UserService()

        found_user = service.get_user(db, test_user.id)

        assert found_user is not None
        assert found_user.id == test_user.id
        assert found_user.email == test_user.email

    def test_get_user_not_found(self, db: Session):
        """Test getting user by non-existent ID"""
        service = UserService()

        found_user = service.get_user(db, 999)

        assert found_user is None

    def test_get_user_by_email(self, db: Session, test_user: User):
        """Test getting user by email"""
        service = UserService()

        found_user = service.get_user_by_email(db, test_user.email)

        assert found_user is not None
        assert found_user.id == test_user.id
        assert found_user.email == test_user.email

    def test_get_user_by_email_not_found(self, db: Session):
        """Test getting user by non-existent email"""
        service = UserService()

        found_user = service.get_user_by_email(db, "nonexistent@example.com")

        assert found_user is None

    def test_get_user_by_username(self, db: Session, test_user: User):
        """Test getting user by username"""
        service = UserService()

        found_user = service.get_user_by_username(db, test_user.username)

        assert found_user is not None
        assert found_user.id == test_user.id
        assert found_user.username == test_user.username

    def test_get_user_by_username_not_found(self, db: Session):
        """Test getting user by non-existent username"""
        service = UserService()

        found_user = service.get_user_by_username(db, "nonexistent")

        assert found_user is None

    @patch("user.services.user_service.get_password_hash")
    def test_create_user(self, mock_hash, db: Session):
        """Test creating a user"""
        mock_hash.return_value = "hashedpassword123"

        service = UserService()
        user_data = UserCreate(
            email="newuser@example.com", username="newuser", password="plainpassword"
        )

        created_user = service.create_user(db, user_data)

        assert created_user.id is not None
        assert created_user.email == "newuser@example.com"
        assert created_user.username == "newuser"
        assert created_user.password == "hashedpassword123"
        mock_hash.assert_called_once_with("plainpassword")

    def test_create_user_duplicate_username(self, db: Session, test_user: User):
        """Test creating user with duplicate username raises ValueError"""
        service = UserService()

        # Try to create user with existing username
        user_create = UserCreate(
            username=test_user.username,
            email="different@email.com",
            password="password123",
        )

        with pytest.raises(ValueError) as exc_info:
            service.create_user(db, user_create)

        assert "username" in str(exc_info.value)
        assert "already exists" in str(exc_info.value)

    def test_create_user_duplicate_email(self, db: Session, test_user: User):
        """Test creating user with duplicate email raises ValueError"""
        service = UserService()

        # Try to create user with existing email
        user_create = UserCreate(
            username="different_username",
            email=test_user.email,
            password="password123",
        )

        with pytest.raises(ValueError) as exc_info:
            service.create_user(db, user_create)

        assert "email" in str(exc_info.value)
        assert "already exists" in str(exc_info.value)

    def test_update_user(self, db: Session, test_user: User):
        """Test updating a user"""
        service = UserService()

        test_user.email = "updated@example.com"
        updated_user = service.update_user(db, test_user)

        assert updated_user.email == "updated@example.com"

        # Verify it was actually updated in the database
        found_user = service.get_user(db, test_user.id)
        assert found_user.email == "updated@example.com"

    def test_delete_user(self, db: Session, test_user: User):
        """Test deleting a user"""
        service = UserService()

        deleted = service.delete_user(db, test_user.id)

        assert deleted is True

        # Verify it was actually deleted
        found_user = service.get_user(db, test_user.id)
        assert found_user is None

    def test_delete_user_not_found(self, db: Session):
        """Test deleting non-existent user"""
        service = UserService()

        deleted = service.delete_user(db, 999)

        assert deleted is False


@pytest.mark.integration
class TestUserServiceIntegration:
    """Integration tests for UserService"""

    def test_full_user_workflow(self, db: Session):
        """Test the complete user workflow"""
        service = UserService()

        # 1. Create user
        user_data = UserCreate(
            email="workflow@example.com", username="workflowuser", password="testpassword123"
        )

        with patch("user.services.user_service.get_password_hash") as mock_hash:
            mock_hash.return_value = "hashedpassword123"
            created_user = service.create_user(db, user_data)

        assert created_user.id is not None
        assert created_user.email == "workflow@example.com"

        # 2. Get user by ID
        found_user = service.get_user(db, created_user.id)
        assert found_user is not None
        assert found_user.email == "workflow@example.com"

        # 3. Get user by email
        found_user = service.get_user_by_email(db, "workflow@example.com")
        assert found_user is not None
        assert found_user.id == created_user.id

        # 4. Update user
        found_user.email = "updated@example.com"
        updated_user = service.update_user(db, found_user)
        assert updated_user.email == "updated@example.com"

        # 5. Delete user
        deleted = service.delete_user(db, created_user.id)
        assert deleted is True

        # 6. Verify user is deleted
        found_user = service.get_user(db, created_user.id)
        assert found_user is None
