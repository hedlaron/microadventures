#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from adventure.services.image_service import get_adventure_image

def test_image_service():
    """Test the image service"""
    print("🖼️  Testing Image Service...")
    
    test_cases = [
        ("hiking", "San Francisco, CA"),
        ("cycling", "New York, NY"),
        ("surprise-me", "London, UK"),
    ]
    
    for activity, location in test_cases:
        try:
            print(f"\n📍 Testing: {activity} in {location}")
            url = get_adventure_image(activity, location)
            
            if url and url.startswith('https://'):
                print(f"✅ Success: {url[:50]}...")
            else:
                print(f"❌ Failed: {url}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

def test_quota_info():
    """Test quota info structure"""
    print("\n📊 Testing Quota Response Structure...")
    
    # Test the expected structure
    sample_quota = {
        "adventures_remaining": 5,
        "total_quota": 10,
        "reset_time": "2025-06-28T11:44:13.123456Z",
        "time_until_reset": 43200  # 12 hours in seconds
    }
    
    print("Expected quota structure:")
    for key, value in sample_quota.items():
        print(f"  {key}: {value} ({type(value).__name__})")
    
    # Test countdown formatting
    def format_time(seconds):
        if seconds <= 0:
            return "00:00:00"
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    
    print(f"\nCountdown format test: {format_time(43200)} (12 hours)")
    print(f"Countdown format test: {format_time(3661)} (1 hour, 1 minute, 1 second)")

if __name__ == "__main__":
    test_image_service()
    test_quota_info()
    print("\n🎉 All tests completed!")
