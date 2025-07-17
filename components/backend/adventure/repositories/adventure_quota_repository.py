from abc import ABC, abstractmethod

from sqlalchemy.orm import Session

from adventure.models.adventure import AdventureQuota


class AdventureQuotaRepositoryInterface(ABC):
    """Interface for adventure quota repository operations"""

    @abstractmethod
    def get_by_user_id(self, db: Session, user_id: int) -> AdventureQuota | None:
        pass

    @abstractmethod
    def create(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        pass

    @abstractmethod
    def update(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        pass

    @abstractmethod
    def delete(self, db: Session, user_id: int) -> bool:
        pass


class AdventureQuotaRepository(AdventureQuotaRepositoryInterface):
    """SQLAlchemy implementation of adventure quota repository"""

    def get_by_user_id(self, db: Session, user_id: int) -> AdventureQuota | None:
        """Get adventure quota by user ID"""
        return db.query(AdventureQuota).filter(AdventureQuota.user_id == user_id).first()

    def create(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        """Create a new adventure quota"""
        db.add(quota)
        db.commit()
        db.refresh(quota)
        return quota

    def update(self, db: Session, quota: AdventureQuota) -> AdventureQuota:
        """Update an adventure quota"""
        db.commit()
        db.refresh(quota)
        return quota

    def delete(self, db: Session, user_id: int) -> bool:
        """Delete an adventure quota"""
        quota = self.get_by_user_id(db, user_id)
        if quota:
            db.delete(quota)
            db.commit()
            return True
        return False
