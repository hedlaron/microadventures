#!/usr/bin/env python3
"""
Test script to generate an adventure and check the enhanced AI response
"""

import time

import requests


# Test the enhanced AI service
def test_adventure_generation():
    base_url = "http://localhost:8000"

    # First, let's try to register a test user or login
    register_data = {
        "username": "test_user_edgy",
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpassword123",
    }

    # Try to register (might fail if user exists, that's okay)
    try:
        response = requests.post(f"{base_url}/api/auth/register", json=register_data)
        print(f"Registration: {response.status_code}")
    except Exception as e:
        print(f"Registration failed: {e}")

    # Login to get token
    login_data = {"username": "test_user_edgy", "password": "testpassword123"}

    try:
        response = requests.post(f"{base_url}/api/auth/login", data=login_data)
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data["access_token"]
            print("✅ Login successful")

            # Test adventure generation
            headers = {"Authorization": f"Bearer {access_token}"}
            adventure_request = {
                "location": "Brooklyn, New York",
                "destination": None,
                "duration": "half-day",
                "activity_type": "urban-exploration",
                "is_round_trip": False,
                "custom_activity": None,
            }

            print("🎯 Generating edgy adventure for Brooklyn...")
            start_time = time.time()

            response = requests.post(
                f"{base_url}/api/adventures/generate", json=adventure_request, headers=headers
            )

            duration = time.time() - start_time
            print(f"⏱️  Generation took {duration:.2f} seconds")

            if response.status_code == 200:
                adventure = response.json()
                print("✅ Adventure generated successfully!")
                print(f"📍 Title: {adventure['title']}")
                print(f"📝 Description: {adventure['description'][:200]}...")
                print(
                    f"🖼️  Image URL: {'✅ Present' if adventure.get('image_url') else '❌ Missing'}"
                )
                print(f"🗓️  Itinerary items: {len(adventure.get('itinerary', []))}")

                # Show first itinerary item as example
                if adventure.get("itinerary"):
                    first_item = adventure["itinerary"][0]
                    print(f"📋 First activity: {first_item.get('activity', 'N/A')}")
                    print(f"🔍 Intel notes: {first_item.get('notes', 'N/A')[:150]}...")

                # Test history endpoint
                print("\n🕰️  Testing history endpoint...")
                history_response = requests.get(
                    f"{base_url}/api/adventures/my-history", headers=headers
                )

                if history_response.status_code == 200:
                    history = history_response.json()
                    print(f"✅ History retrieved: {len(history.get('adventures', []))} adventures")
                else:
                    print(
                        f"❌ History failed: {history_response.status_code} - {history_response.text}"
                    )

            else:
                print(f"❌ Adventure generation failed: {response.status_code}")
                print(f"Error: {response.text}")

        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"❌ Test failed: {e}")


if __name__ == "__main__":
    test_adventure_generation()
