#!/usr/bin/env python3
"""
Test runner script for the microadventures backend.
Provides an easy way to run different test suites with proper domain structure.
"""

import argparse
import os
import subprocess
import sys


def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{'=' * 50}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    print(f"{'=' * 50}")

    if isinstance(cmd, str):
        result = subprocess.run(cmd, shell=True, cwd=os.path.dirname(os.path.abspath(__file__)))
    else:
        result = subprocess.run(cmd, cwd=os.path.dirname(os.path.abspath(__file__)))
    if result.returncode != 0:
        print(f"❌ {description} failed with exit code {result.returncode}")
        return False
    else:
        print(f"✅ {description} passed")
        return True


def main():
    parser = argparse.ArgumentParser(description="Run backend tests")
    parser.add_argument("--unit", action="store_true", help="Run unit tests only")
    parser.add_argument("--integration", action="store_true", help="Run integration tests only")
    parser.add_argument("--coverage", action="store_true", help="Run with coverage report")
    parser.add_argument("--lint", action="store_true", help="Run linting")
    parser.add_argument("--format", action="store_true", help="Format code")
    parser.add_argument("--security", action="store_true", help="Run security checks")
    parser.add_argument("--all", action="store_true", help="Run all checks")
    parser.add_argument("--install", action="store_true", help="Install dependencies")
    parser.add_argument("--ci", action="store_true", help="Run CI checks")

    args = parser.parse_args()

    # If no specific test type is selected, run all tests
    if not any(
        [
            args.unit,
            args.integration,
            args.coverage,
            args.lint,
            args.format,
            args.security,
            args.all,
            args.install,
            args.ci,
        ]
    ):
        args.all = True

    success = True

    if args.install or args.all:
        success &= run_command(["uv", "sync", "--extra", "dev"], "Install dependencies")

    if args.format or args.all:
        success &= run_command(["uv", "run", "ruff", "format", "."], "Format code")
        success &= run_command(["uv", "run", "ruff", "check", "--fix", "."], "Fix linting issues")

    if args.lint or args.all:
        success &= run_command(["uv", "run", "ruff", "check", "."], "Linting")
        success &= run_command(["uv", "run", "mypy", "."], "Type checking")

    if args.security or args.all:
        success &= run_command(["uv", "run", "bandit", "-r", ".", "-f", "json"], "Security scan")
        success &= run_command(["uv", "run", "pip-audit"], "Dependency security audit")

    if args.unit:
        success &= run_command(["uv", "run", "pytest", "-m", "unit", "-v"], "Unit tests")
    elif args.integration:
        success &= run_command(
            ["uv", "run", "pytest", "-m", "integration", "-v"], "Integration tests"
        )
    elif args.coverage:
        success &= run_command(
            [
                "uv",
                "run",
                "pytest",
                "--cov=.",
                "--cov-report=html",
                "--cov-report=term-missing",
                "--cov-fail-under=80",
                "-v",
            ],
            "Tests with coverage",
        )
    elif args.ci:
        success &= run_command(
            [
                "uv",
                "run",
                "pytest",
                "--cov=.",
                "--cov-report=xml",
                "--cov-report=term-missing",
                "--cov-fail-under=80",
                "-v",
            ],
            "CI tests",
        )
    elif args.all:
        success &= run_command(
            [
                "uv",
                "run",
                "pytest",
                "--cov=.",
                "--cov-report=html",
                "--cov-report=term-missing",
                "-v",
            ],
            "All tests with coverage",
        )

    print(f"\n{'=' * 50}")
    if success:
        print("🎉 All checks passed!")
        sys.exit(0)
    else:
        print("❌ Some checks failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()
