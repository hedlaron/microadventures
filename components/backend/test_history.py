#!/usr/bin/env python3

import sys
import os
sys.path.append('.')

from sqlalchemy.orm import Session
from core.database import get_db
from adventure.services.adventure_service import get_user_adventures

def test_history():
    """Test the adventure history function"""
    try:
        # Get database session
        db: Session = next(get_db())
        
        # Test with user ID 1 (adjust as needed)
        user_id = 1
        
        print(f"Testing get_user_adventures for user_id: {user_id}")
        adventures = get_user_adventures(db, user_id)
        
        print(f"Found {len(adventures)} adventures")
        
        for adventure in adventures:
            print(f"Adventure ID: {adventure.id}")
            print(f"Title: {adventure.title}")
            print(f"Image URL: {adventure.image_url}")
            print(f"Has itinerary: {hasattr(adventure, 'itinerary')}")
            print(f"Has route: {hasattr(adventure, 'route')}")
            print("---")
            
        db.close()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_history()
