from abc import ABC, abstractmethod

from sqlalchemy.orm import Session

from user.models.user import User


class UserRepositoryInterface(ABC):
    """Interface for user repository operations"""

    @abstractmethod
    def create(self, db: Session, user: User) -> User:
        pass

    @abstractmethod
    def get_by_id(self, db: Session, user_id: int) -> User | None:
        pass

    @abstractmethod
    def get_by_email(self, db: Session, email: str) -> User | None:
        pass

    @abstractmethod
    def get_by_username(self, db: Session, username: str) -> User | None:
        pass

    @abstractmethod
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        pass

    @abstractmethod
    def update(self, db: Session, user: User) -> User:
        pass

    @abstractmethod
    def delete(self, db: Session, user_id: int) -> bool:
        pass


class UserRepository(UserRepositoryInterface):
    """SQLAlchemy implementation of user repository"""

    def create(self, db: Session, user: User) -> User:
        """Create a new user"""
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_by_id(self, db: Session, user_id: int) -> User | None:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> User | None:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, username: str) -> User | None:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination"""
        return db.query(User).offset(skip).limit(limit).all()

    def update(self, db: Session, user: User) -> User:
        """Update a user"""
        db.commit()
        db.refresh(user)
        return user

    def delete(self, db: Session, user_id: int) -> bool:
        """Delete a user"""
        user = self.get_by_id(db, user_id)
        if user:
            db.delete(user)
            db.commit()
            return True
        return False
