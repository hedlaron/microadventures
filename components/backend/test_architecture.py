"""
Basic test to verify the restructured backend architecture works
"""

import pytest

from adventure.repositories.adventure_repository import AdventureRepository
from adventure.services.adventure_service import AdventureService
from user.repositories.user_repository import UserRepository
from user.services.user_service import UserService


@pytest.mark.unit
def test_repository_classes_exist():
    """Test that repository classes can be imported and instantiated"""
    adventure_repo = AdventureRepository()
    user_repo = UserRepository()

    assert adventure_repo is not None
    assert user_repo is not None
    assert hasattr(adventure_repo, "create")
    assert hasattr(user_repo, "create")


@pytest.mark.unit
def test_service_classes_exist():
    """Test that service classes can be imported and instantiated"""
    adventure_service = AdventureService()
    user_service = UserService()

    assert adventure_service is not None
    assert user_service is not None
    assert hasattr(adventure_service, "adventure_repo")
    assert hasattr(user_service, "user_repo")


@pytest.mark.unit
def test_dependency_injection():
    """Test that dependency injection works"""
    adventure_repo = AdventureRepository()
    user_repo = UserRepository()

    adventure_service = AdventureService(adventure_repo)
    user_service = UserService(user_repo)

    assert adventure_service.adventure_repo is adventure_repo
    assert user_service.user_repo is user_repo


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
