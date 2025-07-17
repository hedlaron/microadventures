import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base


class Adventure(Base):
    __tablename__ = "adventures"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=True)  # Store AI-generated image URL
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=True)
    duration: Mapped[str] = mapped_column(String(50), nullable=False)
    activity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    is_round_trip: Mapped[bool] = mapped_column(nullable=False, default=False)
    itinerary: Mapped[dict] = mapped_column(JSON, nullable=False)  # Store itinerary as JSON
    route: Mapped[dict] = mapped_column(JSON, nullable=False)  # Store route info as JSON
    weather_forecast: Mapped[dict] = mapped_column(JSON, nullable=False)  # Store weather as JSON
    packing_list: Mapped[dict] = mapped_column(JSON, nullable=False)  # Store packing list as JSON
    recommendations: Mapped[dict] = mapped_column(
        JSON, nullable=False
    )  # Store recommendations as JSON
    estimated_cost: Mapped[str] = mapped_column(String(50), nullable=True)
    difficulty_level: Mapped[str] = mapped_column(String(20), nullable=True)
    best_season: Mapped[str] = mapped_column(String(50), nullable=True)
    accessibility: Mapped[str] = mapped_column(String(100), nullable=True)
    # Public sharing fields
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    share_token: Mapped[str] = mapped_column(
        String(36), nullable=True, unique=True
    )  # UUID for public sharing
    shared_at: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, default=datetime.now(UTC), nullable=False
    )

    # Relationship to User
    creator = relationship("User", back_populates="adventures")

    def generate_share_token(self):
        """Generate a unique share token for public sharing"""
        if not self.share_token:
            self.share_token = str(uuid.uuid4())
        return self.share_token


class AdventureQuota(Base):
    __tablename__ = "adventure_quotas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), unique=True, nullable=False
    )
    quota_remaining: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    last_reset_date: Mapped[DateTime] = mapped_column(
        DateTime, default=datetime.now(UTC), nullable=False
    )

    # Relationship to User
    user = relationship("User", back_populates="adventure_quota")
