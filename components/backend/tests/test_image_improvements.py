#!/usr/bin/env python3
"""
Test script to verify improved image relevance for adventures
"""

import os
import sys

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), "components", "backend")
sys.path.insert(0, backend_path)

from adventure.services.image_service import get_adventure_image  # noqa: E402


def test_image_relevance():
    """Test that images are more relevant to adventure content"""

    # Test cases with different types of adventures
    test_cases = [
        {
            "activity_type": "walking",
            "location": "San Francisco, CA",
            "title": "Urban Photography Adventure in Mission District",
            "description": "Explore vibrant street art and murals in the Mission District, discover hidden cafes, and capture the authentic local culture through photography.",
            "expected_keywords": ["street art", "photography", "san francisco", "urban"],
        },
        {
            "activity_type": "nature",
            "location": "Central Park, New York",
            "title": "Peaceful Morning in Central Park",
            "description": "Take a relaxing walk through Central Park, visit the botanical gardens, and enjoy near the lake.",
            "expected_keywords": ["park", "nature", "peaceful", "bird"],
        },
        {
            "activity_type": "food",
            "location": "Pike Place Market, Seattle",
            "title": "Culinary Discovery at Pike Place Market",
            "description": "Taste local specialties, watch fish throwing, visit artisan coffee roasters, and explore the historic market stalls.",
            "expected_keywords": ["market", "food", "coffee", "culinary"],
        },
    ]

    print("🖼️  Testing Image Relevance Improvements\n")

    for i, test_case in enumerate(test_cases, 1):
        print(f"Test Case {i}: {test_case['title']}")
        print(f"Location: {test_case['location']}")
        print(f"Activity: {test_case['activity_type']}")
        print(f"Description: {test_case['description'][:100]}...")

        try:
            # Get image URL using improved service
            image_url = get_adventure_image(
                activity_type=test_case["activity_type"],
                location=test_case["location"],
                description=test_case["description"],
                title=test_case["title"],
            )

            print(f"✅ Image URL generated: {image_url}")

            # Test keyword extraction
            from adventure.services.image_service import unsplash_service

            keywords = unsplash_service._extract_content_keywords(
                test_case["description"], test_case["title"]
            )
            print(f"📝 Extracted keywords: {keywords}")

            # Check if expected keywords are found
            _found_keywords = []
            for expected in test_case["expected_keywords"]:
                if any(expected.lower() in keyword.lower() for keyword in keywords):
                    _found_keywords.append(expected)

            if _found_keywords:
                print(f"🎯 Relevant keywords found: {_found_keywords}")
            else:
                print(f"⚠️  Expected keywords not found: {test_case['expected_keywords']}")

        except Exception as e:
            print(f"❌ Error: {e}")

        print("-" * 80)
        print()

    print("✨ Image relevance testing complete!")


if __name__ == "__main__":
    test_image_relevance()
