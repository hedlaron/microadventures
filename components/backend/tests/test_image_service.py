#!/usr/bin/env python3

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from adventure.services.image_service import get_adventure_image


def test_image_service():
    """Test the new image service"""
    try:
        print("Testing Unsplash image service...")

        # Test different activity types
        test_cases = [
            ("hiking", "San Francisco, CA", "Mountain adventure"),
            ("cycling", "New York, NY", "Urban bike tour"),
            ("photography", "London, UK", "Street photography walk"),
            ("surprise-me", "Paris, France", "Mystery adventure"),
        ]

        for activity, location, description in test_cases:
            print(f"\nTesting: {activity} in {location}")
            image_url = get_adventure_image(activity, location, description)
            print(f"Result: {image_url}")

            if image_url:
                print("✅ Image URL received")
            else:
                print("❌ No image URL")

    except Exception as e:
        print(f"Error testing image service: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    test_image_service()
