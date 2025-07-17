#!/usr/bin/env python3
"""Simple test for AI adventure generation"""

import sys

sys.path.append(".")

from adventure.services.ai_service import generate_adventure_recommendations


def main():
    print("Testing AI Adventure Recommendations...")

    try:
        adventure = generate_adventure_recommendations(
            location="San Francisco, CA",
            destination="Golden Gate Park",
            duration="half-day",
            activity_type="hiking",
            is_round_trip=True,
        )
        print("✅ Success!")
        print(f"Title: {adventure['title']}")
        print(f"Description: {adventure['description'][:100]}...")
        print(f"Itinerary items: {len(adventure['itinerary'])}")
        print(
            f"First activity: {adventure['itinerary'][0]['time']} - {adventure['itinerary'][0]['activity']}"
        )
        print(
            f"Weather: {adventure['weather_forecast']['temperature']} - {adventure['weather_forecast']['conditions']}"
        )
        print(f"Essential packing: {adventure['packing_list']['essential']}")
        print(f"Map URL: {adventure['route']['map_embed_url'][:50]}...")
        print(f"Estimated cost: {adventure['estimated_cost']}")
        print(f"Difficulty: {adventure['difficulty_level']}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
