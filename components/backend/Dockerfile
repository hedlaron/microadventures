FROM python:3.13-alpine AS base
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/bin/uv

# Build argument for version
ARG APP_VERSION=dev-local

# Install system dependencies for building Python packages
RUN apk add --no-cache gcc musl-dev linux-headers python3-dev

WORKDIR /app

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install base dependencies
RUN uv sync

# Testing stage
FROM base AS test
ARG RUN_TESTS=false

# Install development dependencies for testing
RUN uv sync --group dev

# Copy source code for testing
COPY . .

# Run tests and linting if RUN_TESTS=true
# Note: Tests use SQLite for testing, so no external database connection needed
# But we need to provide PostgreSQL env vars since Settings class validates them
RUN if [ "$RUN_TESTS" = "true" ]; then \
      echo "Running tests and linting..." && \
      export JWT_SECRET_KEY="test-secret-key-for-docker-build" && \
      export OPENAI_API_KEY="test-api-key-for-docker-build" && \
      export POSTGRESQL_USERNAME="test_user" && \
      export POSTGRESQL_PASSWORD="test_password" && \
      export POSTGRESQL_SERVER="localhost" && \
      export POSTGRESQL_PORT="5432" && \
      export POSTGRESQL_DATABASE="test_db" && \
      echo "[LINT] Starting Ruff linting..." && \
      uv run ruff check .; \
      RUFF_EXIT_CODE=$?; \
      if [ $RUFF_EXIT_CODE -ne 0 ]; then \
        echo "[ERROR] Ruff linting failed with exit code $RUFF_EXIT_CODE"; \
        exit 1; \
      fi; \
      echo "[SUCCESS] Ruff linting passed!" && \
      echo "[LINT] Starting Black formatting check..." && \
      uv run black --check .; \
      BLACK_EXIT_CODE=$?; \
      if [ $BLACK_EXIT_CODE -ne 0 ]; then \
        echo "[ERROR] Black formatting failed with exit code $BLACK_EXIT_CODE"; \
        exit 1; \
      fi; \
      echo "[SUCCESS] Black formatting passed!" && \
      echo "[TEST] Starting pytest..." && \
      uv run pytest -v --tb=short; \
      PYTEST_EXIT_CODE=$?; \
      if [ $PYTEST_EXIT_CODE -ne 0 ]; then \
        echo "[ERROR] Tests failed with exit code $PYTEST_EXIT_CODE"; \
        exit 1; \
      fi; \
      echo "[SUCCESS] Tests passed!" && \
      echo "[COMPLETE] All backend tests and linting completed successfully!" && \
      echo "ALL_TESTS_PASSED"; \
    else \
      echo "Skipping tests (RUN_TESTS=false)"; \
    fi

# Production stage
FROM base AS production

# Copy source code
COPY . .

# Set environment variable for runtime
ENV APP_VERSION=${APP_VERSION}

CMD ["uv", "run", "server.py"]
