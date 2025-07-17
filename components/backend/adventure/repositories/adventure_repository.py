from abc import ABC, abstractmethod

from sqlalchemy.orm import Session

from adventure.models.adventure import Adventure


class AdventureRepositoryInterface(ABC):
    """Interface for adventure repository operations"""

    @abstractmethod
    def create(self, db: Session, adventure: Adventure) -> Adventure:
        pass

    @abstractmethod
    def get_by_id(self, db: Session, adventure_id: int) -> Adventure | None:
        pass

    @abstractmethod
    def get_by_user_id(self, db: Session, user_id: int, limit: int = 50) -> list[Adventure]:
        pass

    @abstractmethod
    def get_by_share_token(self, db: Session, share_token: str) -> Adventure | None:
        pass

    @abstractmethod
    def get_user_adventure_by_id(
        self, db: Session, adventure_id: int, user_id: int
    ) -> Adventure | None:
        pass

    @abstractmethod
    def update(self, db: Session, adventure: Adventure) -> Adventure:
        pass

    @abstractmethod
    def delete(self, db: Session, adventure_id: int) -> bool:
        pass


class AdventureRepository(AdventureRepositoryInterface):
    """SQLAlchemy implementation of adventure repository"""

    def create(self, db: Session, adventure: Adventure) -> Adventure:
        """Create a new adventure"""
        db.add(adventure)
        db.commit()
        db.refresh(adventure)
        return adventure

    def get_by_id(self, db: Session, adventure_id: int) -> Adventure | None:
        """Get adventure by ID"""
        return db.query(Adventure).filter(Adventure.id == adventure_id).first()

    def get_by_user_id(self, db: Session, user_id: int, limit: int = 50) -> list[Adventure]:
        """Get all adventures created by a user"""
        return (
            db.query(Adventure)
            .filter(Adventure.created_by == user_id)
            .order_by(Adventure.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_by_share_token(self, db: Session, share_token: str) -> Adventure | None:
        """Get publicly shared adventure by share token"""
        return (
            db.query(Adventure)
            .filter(Adventure.share_token == share_token, Adventure.is_public)
            .first()
        )

    def get_user_adventure_by_id(
        self, db: Session, adventure_id: int, user_id: int
    ) -> Adventure | None:
        """Get adventure by ID if it belongs to the user"""
        return (
            db.query(Adventure)
            .filter(Adventure.id == adventure_id, Adventure.created_by == user_id)
            .first()
        )

    def update(self, db: Session, adventure: Adventure) -> Adventure:
        """Update an adventure"""
        db.commit()
        db.refresh(adventure)
        return adventure

    def delete(self, db: Session, adventure_id: int) -> bool:
        """Delete an adventure"""
        adventure = self.get_by_id(db, adventure_id)
        if adventure:
            db.delete(adventure)
            db.commit()
            return True
        return False
