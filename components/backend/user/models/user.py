from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, DateTime, Enum
from core.database import Base
from datetime import datetime, timezone
from enum import Enum as PyEnum

class Role(str, PyEnum):
    USER = "User"
    MANAGER = "Manager"
    ADMIN = "Admin"

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    role: Mapped[str] = mapped_column(String, default=Role.USER, nullable=False)
    
    # Relationships
    adventures = relationship("Adventure", back_populates="creator")
    adventure_quota = relationship("AdventureQuota", back_populates="user", uselist=False)