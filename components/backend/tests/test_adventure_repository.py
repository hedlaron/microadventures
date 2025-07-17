import pytest
from sqlalchemy.orm import Session

from adventure.models.adventure import Adventure
from adventure.repositories.adventure_repository import AdventureRepository
from user.models.user import User


@pytest.mark.unit
class TestAdventureRepository:
    """Test cases for AdventureRepository"""

    def test_create_adventure(self, db: Session, test_user: User):
        """Test creating an adventure"""
        repo = AdventureRepository()

        adventure = Adventure(
            title="Test Adventure",
            description="Test description",
            location="Test Location",
            destination="Test Destination",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=True,
            created_by=test_user.id,
            itinerary=[{"time": "10:00", "activity": "Test"}],
            route={"start": "A", "end": "B"},
            weather_forecast={"temp": "20°C"},
            packing_list={"essential": ["water"]},
            recommendations={"tips": ["tip1"]},
        )

        created_adventure = repo.create(db, adventure)

        assert created_adventure.id is not None
        assert created_adventure.title == "Test Adventure"
        assert created_adventure.created_by == test_user.id

    def test_get_by_id(self, db: Session, test_adventure: Adventure):
        """Test getting adventure by ID"""
        repo = AdventureRepository()

        found_adventure = repo.get_by_id(db, test_adventure.id)

        assert found_adventure is not None
        assert found_adventure.id == test_adventure.id
        assert found_adventure.title == test_adventure.title

    def test_get_by_id_not_found(self, db: Session):
        """Test getting adventure by non-existent ID"""
        repo = AdventureRepository()

        found_adventure = repo.get_by_id(db, 999)

        assert found_adventure is None

    def test_get_by_user_id(self, db: Session, test_user: User, test_adventure: Adventure):
        """Test getting adventures by user ID"""
        repo = AdventureRepository()

        adventures = repo.get_by_user_id(db, test_user.id)

        assert len(adventures) == 1
        assert adventures[0].id == test_adventure.id
        assert adventures[0].created_by == test_user.id

    def test_get_by_user_id_with_limit(self, db: Session, test_user: User):
        """Test getting adventures by user ID with limit"""
        repo = AdventureRepository()

        # Create multiple adventures
        for i in range(5):
            adventure = Adventure(
                title=f"Test Adventure {i}",
                description=f"Test description {i}",
                location="Test Location",
                destination="Test Destination",
                duration="half-day",
                activity_type="hiking",
                is_round_trip=True,
                created_by=test_user.id,
                itinerary=[{"time": "10:00", "activity": "Test"}],
                route={"start": "A", "end": "B"},
                weather_forecast={"temp": "20°C"},
                packing_list={"essential": ["water"]},
                recommendations={"tips": ["tip1"]},
            )
            repo.create(db, adventure)

        adventures = repo.get_by_user_id(db, test_user.id, limit=3)

        assert len(adventures) == 3

    def test_get_by_share_token(self, db: Session, test_adventure: Adventure):
        """Test getting adventure by share token"""
        repo = AdventureRepository()

        # Make adventure public and generate share token
        test_adventure.is_public = True
        test_adventure.generate_share_token()
        db.commit()

        found_adventure = repo.get_by_share_token(db, test_adventure.share_token)

        assert found_adventure is not None
        assert found_adventure.id == test_adventure.id
        assert found_adventure.is_public is True

    def test_get_by_share_token_not_public(self, db: Session, test_adventure: Adventure):
        """Test getting adventure by share token when not public"""
        repo = AdventureRepository()

        test_adventure.generate_share_token()
        test_adventure.is_public = False
        db.commit()

        found_adventure = repo.get_by_share_token(db, test_adventure.share_token)

        assert found_adventure is None

    def test_get_user_adventure_by_id(
        self, db: Session, test_user: User, test_adventure: Adventure
    ):
        """Test getting user's adventure by ID"""
        repo = AdventureRepository()

        found_adventure = repo.get_user_adventure_by_id(db, test_adventure.id, test_user.id)

        assert found_adventure is not None
        assert found_adventure.id == test_adventure.id
        assert found_adventure.created_by == test_user.id

    def test_get_user_adventure_by_id_wrong_user(self, db: Session, test_adventure: Adventure):
        """Test getting user's adventure by ID with wrong user"""
        repo = AdventureRepository()

        found_adventure = repo.get_user_adventure_by_id(db, test_adventure.id, 999)

        assert found_adventure is None

    def test_update_adventure(self, db: Session, test_adventure: Adventure):
        """Test updating an adventure"""
        repo = AdventureRepository()

        test_adventure.title = "Updated Title"
        updated_adventure = repo.update(db, test_adventure)

        assert updated_adventure.title == "Updated Title"

        # Verify it was actually updated in the database
        found_adventure = repo.get_by_id(db, test_adventure.id)
        assert found_adventure.title == "Updated Title"

    def test_delete_adventure(self, db: Session, test_adventure: Adventure):
        """Test deleting an adventure"""
        repo = AdventureRepository()

        deleted = repo.delete(db, test_adventure.id)

        assert deleted is True

        # Verify it was actually deleted
        found_adventure = repo.get_by_id(db, test_adventure.id)
        assert found_adventure is None

    def test_delete_adventure_not_found(self, db: Session):
        """Test deleting non-existent adventure"""
        repo = AdventureRepository()

        deleted = repo.delete(db, 999)

        assert deleted is False
