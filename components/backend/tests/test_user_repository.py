import pytest
from sqlalchemy.orm import Session

from user.models.user import User
from user.repositories.user_repository import UserRepository


@pytest.mark.unit
class TestUserRepository:
    """Test cases for UserRepository"""

    def test_create_user(self, db: Session):
        """Test creating a user"""
        repo = UserRepository()

        user = User(
            email="test@example.com", username="testuser", password="hashedpassword", is_active=True
        )

        created_user = repo.create(db, user)

        assert created_user.id is not None
        assert created_user.email == "test@example.com"
        assert created_user.username == "testuser"
        assert created_user.is_active is True

    def test_get_by_id(self, db: Session, test_user: User):
        """Test getting user by ID"""
        repo = UserRepository()

        found_user = repo.get_by_id(db, test_user.id)

        assert found_user is not None
        assert found_user.id == test_user.id
        assert found_user.email == test_user.email

    def test_get_by_id_not_found(self, db: Session):
        """Test getting user by non-existent ID"""
        repo = UserRepository()

        found_user = repo.get_by_id(db, 999)

        assert found_user is None

    def test_get_by_email(self, db: Session, test_user: User):
        """Test getting user by email"""
        repo = UserRepository()

        found_user = repo.get_by_email(db, test_user.email)

        assert found_user is not None
        assert found_user.id == test_user.id
        assert found_user.email == test_user.email

    def test_get_by_email_not_found(self, db: Session):
        """Test getting user by non-existent email"""
        repo = UserRepository()

        found_user = repo.get_by_email(db, "nonexistent@example.com")

        assert found_user is None

    def test_get_by_username(self, db: Session, test_user: User):
        """Test getting user by username"""
        repo = UserRepository()

        found_user = repo.get_by_username(db, test_user.username)

        assert found_user is not None
        assert found_user.id == test_user.id
        assert found_user.username == test_user.username

    def test_get_by_username_not_found(self, db: Session):
        """Test getting user by non-existent username"""
        repo = UserRepository()

        found_user = repo.get_by_username(db, "nonexistent")

        assert found_user is None

    def test_get_all(self, db: Session, test_user: User):
        """Test getting all users"""
        repo = UserRepository()

        # Create additional users
        user2 = User(
            email="user2@example.com", username="user2", password="hashedpassword2", is_active=True
        )
        repo.create(db, user2)

        users = repo.get_all(db)

        assert len(users) == 2
        assert any(u.email == test_user.email for u in users)
        assert any(u.email == "user2@example.com" for u in users)

    def test_get_all_with_pagination(self, db: Session, test_user: User):
        """Test getting all users with pagination"""
        repo = UserRepository()

        # Create additional users
        for i in range(5):
            user = User(
                email=f"user{i}@example.com",
                username=f"user{i}",
                password=f"hashedpassword{i}",
                is_active=True,
            )
            repo.create(db, user)

        users = repo.get_all(db, skip=1, limit=3)

        assert len(users) == 3

    def test_update_user(self, db: Session, test_user: User):
        """Test updating a user"""
        repo = UserRepository()

        test_user.email = "updated@example.com"
        updated_user = repo.update(db, test_user)

        assert updated_user.email == "updated@example.com"

        # Verify it was actually updated in the database
        found_user = repo.get_by_id(db, test_user.id)
        assert found_user.email == "updated@example.com"

    def test_delete_user(self, db: Session, test_user: User):
        """Test deleting a user"""
        repo = UserRepository()

        deleted = repo.delete(db, test_user.id)

        assert deleted is True

        # Verify it was actually deleted
        found_user = repo.get_by_id(db, test_user.id)
        assert found_user is None

    def test_delete_user_not_found(self, db: Session):
        """Test deleting non-existent user"""
        repo = UserRepository()

        deleted = repo.delete(db, 999)

        assert deleted is False
