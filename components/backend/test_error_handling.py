#!/usr/bin/env python3
"""
Simple test to verify error handling
"""

from unittest.mock import MagicMock
from user.services.user_service import UserService
from user.schemas.user import UserCreate
from user.models.user import User

def test_error_handling():
    """Test that duplicate user creation raises ValueError"""
    
    # Mock the repository
    mock_repo = MagicMock()
    mock_repo.get_by_email.return_value = User(id=1, email="test@test.com", username="test")
    mock_repo.get_by_username.return_value = None
    
    # Create service with mock repository
    service = UserService(mock_repo)
    
    # Mock database session
    mock_db = MagicMock()
    
    # Test data
    user_create = UserCreate(username="test", email="test@test.com", password="password")
    
    # Try to create user - should raise ValueError
    try:
        service.create_user(mock_db, user_create)
        print("❌ ERROR: Should have raised ValueError")
        return False
    except ValueError as e:
        print(f"✅ SUCCESS: Correctly raised ValueError: {e}")
        return True
    except Exception as e:
        print(f"❌ ERROR: Unexpected exception: {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    success = test_error_handling()
    if success:
        print("\n✅ All error handling tests passed!")
    else:
        print("\n❌ Error handling tests failed!")
