#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import SessionLocal
from adventure.services.adventure_service import get_user_adventures
from user.models.user import User

def test_history():
    """Test the history endpoint functionality"""
    db = SessionLocal()
    try:
        # Try to find a user in the database
        user = db.query(User).first()
        if not user:
            print("No users found in database")
            return
        
        print(f"Testing history for user {user.id}")
        
        # Get user adventures
        adventures = get_user_adventures(db, user.id)
        print(f"Found {len(adventures)} adventures")
        
        for adventure in adventures:
            print(f"Adventure {adventure.id}:")
            print(f"  Title: {adventure.title}")
            print(f"  Has image_url: {hasattr(adventure, 'image_url')}")
            print(f"  Has is_public: {hasattr(adventure, 'is_public')}")
            print(f"  Has share_token: {hasattr(adventure, 'share_token')}")
            print(f"  Has shared_at: {hasattr(adventure, 'shared_at')}")
            print(f"  Image URL: {getattr(adventure, 'image_url', 'NOT FOUND')}")
            print(f"  Is Public: {getattr(adventure, 'is_public', 'NOT FOUND')}")
            print(f"  Share Token: {getattr(adventure, 'share_token', 'NOT FOUND')}")
            print(f"  Shared At: {getattr(adventure, 'shared_at', 'NOT FOUND')}")
            print()
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_history()
