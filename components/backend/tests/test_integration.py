"""
Test script to verify the AI challenge generation integration
"""

import asyncio
import os
import sys

sys.path.append(".")

from dotenv import load_dotenv

load_dotenv()


async def test_ai_integration():
    """Test the AI integration components"""
    print("Testing AI Challenge Integration...")

    # Test 1: Import check
    try:
        from challenge.services.ai_service import generate_challenge_with_ai

        print("✅ AI service import successful")
    except ImportError as e:
        print(f"❌ AI service import failed: {e}")
        return

    # Test 2: Configuration check
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key and openai_key != "changeme":
        print("✅ OpenAI API key configured")
    else:
        print("⚠️  OpenAI API key not configured - will use fallback")

    # Test 3: Generate test challenge
    try:
        challenge = generate_challenge_with_ai("easy")
        print("✅ Challenge generation successful")
        print(f"   Title: {challenge['title']}")
        print(f"   Options: {len(challenge['options'])} options")
        print(f"   Correct Answer: {challenge['correct_answer_id']}")
        print(f"   Has Explanation: {'explanation' in challenge}")
    except Exception as e:
        print(f"❌ Challenge generation failed: {e}")

    print("\nIntegration test completed!")


if __name__ == "__main__":
    asyncio.run(test_ai_integration())
