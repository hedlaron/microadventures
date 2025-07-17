#!/usr/bin/env python3
"""
Test script to verify duplicate user error handling
"""
import requests
import json

def test_duplicate_user_registration():
    """Test that registering a duplicate user returns proper error"""
    base_url = "http://localhost:8000"
    
    # First, try to register a user
    user_data = {
        "username": "testuser123",
        "email": "testuser123@example.com",
        "password": "testpassword123"
    }
    
    print("Testing duplicate user registration...")
    
    # First registration - should succeed
    response1 = requests.post(f"{base_url}/api/users/register", json=user_data)
    print(f"First registration: {response1.status_code}")
    
    if response1.status_code == 201:
        print("✅ First registration successful")
    else:
        print(f"First registration response: {response1.text}")
    
    # Second registration with same username - should fail with 400
    response2 = requests.post(f"{base_url}/api/users/register", json=user_data)
    print(f"Second registration: {response2.status_code}")
    
    if response2.status_code == 400:
        error_detail = response2.json().get("detail", "")
        print(f"✅ Second registration correctly failed with error: {error_detail}")
        if "already exists" in error_detail:
            print("✅ Error message contains 'already exists'")
        else:
            print("❌ Error message doesn't mention 'already exists'")
    else:
        print(f"❌ Second registration should have failed with 400, got {response2.status_code}")
        print(f"Response: {response2.text}")

if __name__ == "__main__":
    try:
        test_duplicate_user_registration()
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
