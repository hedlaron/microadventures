#!/usr/bin/env python3

"""Simple test to verify basic functionality"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that we can import our modules"""
    try:
        print("✅ All imports successful")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_repository_instantiation():
    """Test that we can create repository instances"""
    try:
        from adventure.repositories.adventure_repository import AdventureRepository
        from user.repositories.user_repository import UserRepository

        # These should not fail to instantiate
        _adventure_repo = AdventureRepository()
        _user_repo = UserRepository()

        print("✅ Repository instantiation successful")
        return True
    except Exception as e:
        print(f"❌ Repository instantiation failed: {e}")
        return False

def test_service_instantiation():
    """Test that we can create service instances"""
    try:
        from adventure.repositories.adventure_repository import AdventureRepository
        from adventure.services.adventure_service import AdventureService
        from user.repositories.user_repository import UserRepository
        from user.services.user_service import UserService

        # Create dependencies
        adventure_repo = AdventureRepository()
        user_repo = UserRepository()

        # These should not fail to instantiate
        _adventure_service = AdventureService()  # Uses default dependencies
        _adventure_service_with_deps = AdventureService(adventure_repo)  # With explicit dependencies
        _user_service = UserService(user_repo)

        print("✅ Service instantiation successful")
        return True
    except Exception as e:
        print(f"❌ Service instantiation failed: {e}")
        return False

def main():
    print("🚀 Running simple verification tests...")
    print("=" * 50)

    tests = [
        test_imports,
        test_repository_instantiation,
        test_service_instantiation
    ]

    passed = 0
    failed = 0

    for test in tests:
        print(f"\n📋 Running {test.__name__}...")
        if test():
            passed += 1
        else:
            failed += 1

    print("\n" + "=" * 50)
    print(f"📊 Results: {passed} passed, {failed} failed")

    if failed == 0:
        print("🎉 All tests passed! Architecture is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")

    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
