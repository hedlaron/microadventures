#!/usr/bin/env python3

import json
from datetime import UTC, datetime

import requests


# Quick test of the quota endpoint
def test_quota_endpoint():
    try:
        print("🔍 Testing quota endpoint...")

        # Test without authentication first to see the error structure
        response = requests.get("http://localhost:8000/api/adventures/quota")
        print(f"Status (no auth): {response.status_code}")

        if response.status_code == 401:
            print("✅ Endpoint is requiring authentication (expected)")
        else:
            print(f"Response: {response.text}")

        # Test the structure with a mock response
        mock_quota = {
            "adventures_remaining": 5,
            "total_quota": 10,
            "reset_time": datetime.now(UTC).isoformat(),
            "time_until_reset": 43200,  # 12 hours
        }

        print("\n📊 Expected quota response structure:")
        print(json.dumps(mock_quota, indent=2, default=str))

    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")


if __name__ == "__main__":
    test_quota_endpoint()
