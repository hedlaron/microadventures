from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth.utils.auth_utils import get_password_hash
from user.models.user import User
from user.repositories.user_repository import UserRepository
from user.schemas.user import UserCreate


class UserService:
    """Service layer for user operations"""

    def __init__(self, user_repo: UserRepository = None):
        self.user_repo = user_repo or UserRepository()

    def get_users(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination"""
        return self.user_repo.get_all(db, skip, limit)

    def get_user(self, db: Session, user_id: int) -> User | None:
        """Get user by ID"""
        return self.user_repo.get_by_id(db, user_id)

    def get_user_by_email(self, db: Session, email: str) -> User | None:
        """Get user by email"""
        return self.user_repo.get_by_email(db, email)

    def get_user_by_username(self, db: Session, username: str) -> User | None:
        """Get user by username"""
        return self.user_repo.get_by_username(db, username)

    def create_user(self, db: Session, user: UserCreate) -> User:
        """Create a new user"""
        try:
            # Check if user already exists
            existing_user = self.user_repo.get_by_email(db, str(user.email))
            if existing_user:
                raise ValueError(f"User with email {user.email} already exists")

            existing_username = self.user_repo.get_by_username(db, user.username)
            if existing_username:
                raise ValueError(f"User with username {user.username} already exists")

            db_user = User(
                email=str(user.email),
                username=user.username,
                password=get_password_hash(user.password),
            )
            return self.user_repo.create(db, db_user)
        except IntegrityError as e:
            db.rollback()
            # Handle specific constraint violations
            if "users_email_key" in str(e):
                raise ValueError(f"User with email {user.email} already exists") from e
            elif "users_username_key" in str(e):
                raise ValueError(f"User with username {user.username} already exists") from e
            else:
                raise ValueError(
                    "Failed to create user due to database constraint violation"
                ) from e

    def update_user(self, db: Session, user: User) -> User:
        """Update a user"""
        return self.user_repo.update(db, user)

    def delete_user(self, db: Session, user_id: int) -> bool:
        """Delete a user"""
        return self.user_repo.delete(db, user_id)


# Create service instance
user_service = UserService()


# Legacy function wrappers for backward compatibility
def get_users(db: Session):
    return user_service.get_users(db)


def get_user(db: Session, user_id: int):
    return user_service.get_user(db, user_id)


def get_user_by_email(db: Session, email: str):
    return user_service.get_user_by_email(db, email)


def create_user(db: Session, user: UserCreate):
    return user_service.create_user(db, user)


def delete_user(db: Session, user_id: int):
    return user_service.delete_user(db, user_id)
