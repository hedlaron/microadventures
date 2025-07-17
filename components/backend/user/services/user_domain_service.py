"""
Domain service for user business logic.
This service handles user-related business rules and orchestrates user operations.
"""


from sqlalchemy.orm import Session

from auth.utils.auth_utils import get_password_hash, verify_password
from user.models.user import User
from user.repositories.user_repository import UserRepository
from user.schemas.user import UserCreate, UserUpdate


class UserDomainService:
    """Domain service for user-related business logic"""

    def __init__(self):
        self.user_repo = UserRepository()

    def create_user(self, db: Session, user_data: UserCreate) -> User:
        """Create a new user with password hashing and validation"""

        # Check if user already exists
        if self.user_repo.get_by_email(db, user_data.email):
            raise ValueError(f"User with email {user_data.email} already exists")

        if self.user_repo.get_by_username(db, user_data.username):
            raise ValueError(f"User with username {user_data.username} already exists")

        # Create user with hashed password
        user = User(
            email=str(user_data.email),
            username=user_data.username,
            password=get_password_hash(user_data.password),
            is_active=True,
        )

        return self.user_repo.create(db, user)

    def authenticate_user(self, db: Session, email: str, password: str) -> User | None:
        """Authenticate a user with email and password"""
        user = self.user_repo.get_by_email(db, email)

        if not user or not user.is_active:
            return None

        if not verify_password(password, user.password):
            return None

        return user

    def get_user_by_id(self, db: Session, user_id: int) -> User | None:
        """Get user by ID"""
        return self.user_repo.get_by_id(db, user_id)

    def get_user_by_email(self, db: Session, email: str) -> User | None:
        """Get user by email"""
        return self.user_repo.get_by_email(db, email)

    def get_all_users(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination"""
        return self.user_repo.get_all(db, skip, limit)

    def update_user(self, db: Session, user_id: int, user_data: UserUpdate) -> User | None:
        """Update user information"""
        user = self.user_repo.get_by_id(db, user_id)

        if not user:
            return None

        # Update fields if provided
        if user_data.email is not None:
            # Check if new email is already taken
            existing_user = self.user_repo.get_by_email(db, user_data.email)
            if existing_user and existing_user.id != user_id:
                raise ValueError(f"Email {user_data.email} is already taken")
            user.email = user_data.email

        if user_data.username is not None:
            # Check if new username is already taken
            existing_user = self.user_repo.get_by_username(db, user_data.username)
            if existing_user and existing_user.id != user_id:
                raise ValueError(f"Username {user_data.username} is already taken")
            user.username = user_data.username

        if user_data.password is not None:
            user.password = get_password_hash(user_data.password)

        if user_data.is_active is not None:
            user.is_active = user_data.is_active

        return self.user_repo.update(db, user)

    def deactivate_user(self, db: Session, user_id: int) -> User | None:
        """Deactivate a user instead of deleting them"""
        user = self.user_repo.get_by_id(db, user_id)

        if not user:
            return None

        user.is_active = False
        return self.user_repo.update(db, user)

    def reactivate_user(self, db: Session, user_id: int) -> User | None:
        """Reactivate a deactivated user"""
        user = self.user_repo.get_by_id(db, user_id)

        if not user:
            return None

        user.is_active = True
        return self.user_repo.update(db, user)

    def delete_user(self, db: Session, user_id: int) -> bool:
        """Permanently delete a user (use with caution)"""
        return self.user_repo.delete(db, user_id)

    def change_password(
        self, db: Session, user_id: int, current_password: str, new_password: str
    ) -> User | None:
        """Change user password with current password verification"""
        user = self.user_repo.get_by_id(db, user_id)

        if not user:
            return None

        if not verify_password(current_password, user.password):
            raise ValueError("Current password is incorrect")

        user.password = get_password_hash(new_password)
        return self.user_repo.update(db, user)


# Create a singleton instance
user_domain_service = UserDomainService()
