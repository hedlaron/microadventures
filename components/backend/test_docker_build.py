#!/usr/bin/env python3
"""
Test script to verify multi-stage Docker build
"""
import subprocess
import sys


def run_command(cmd, description):
    """Run a command and check result"""
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Command: {cmd}")
    print(f"{'='*60}")

    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            return True
        else:
            print(f"❌ {description} - FAILED")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False


def main():
    """Test the multi-stage Docker build"""
    print("🐳 Testing Multi-Stage Docker Build")

    tests = [
        # Test base stage
        ("docker build --target base -t backend-base-test .", "Build base stage"),
        # Test test stage without running tests
        ("docker build --target test -t backend-test-stage .", "Build test stage (tests disabled)"),
        # Test production stage
        ("docker build --target production -t backend-prod-test .", "Build production stage"),
        # Test with tests enabled (if desired)
        # ("docker build --target test --build-arg RUN_TESTS=true -t backend-test-enabled .", "Build test stage with tests"),
        # Clean up test images
        (
            "docker rmi backend-base-test backend-test-stage backend-prod-test",
            "Clean up test images",
        ),
    ]

    passed = 0
    failed = 0

    for cmd, description in tests:
        if run_command(cmd, description):
            passed += 1
        else:
            failed += 1

    print(f"\n{'='*60}")
    print("🎯 MULTI-STAGE BUILD TEST RESULTS")
    print(f"{'='*60}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"Total: {passed + failed}")

    if failed > 0:
        print("\n⚠️  Some tests failed. Please review the errors above.")
        sys.exit(1)
    else:
        print("\n🎉 All multi-stage build tests passed!")
        print("Multi-stage Docker build is working correctly!")


if __name__ == "__main__":
    main()
