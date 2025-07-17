import pytest


def test_simple():
    """Simple test to verify pytest is working"""
    assert True


def test_addition():
    """Test basic arithmetic"""
    assert 1 + 1 == 2


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
