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

# Set test environment variables
ENV JWT_SECRET_KEY=test-secret-key-for-docker-build
ENV POSTGRESQL_USERNAME=test_user
ENV POSTGRESQL_PASSWORD=test_password
ENV POSTGRESQL_SERVER=localhost
ENV POSTGRESQL_PORT=5432
ENV POSTGRESQL_DATABASE=test_db
ENV OPENAI_API_KEY=test-api-key

    # Run tests and linting if RUN_TESTS=true
    RUN if [ "$RUN_TESTS" = "true" ]; then \
          echo "Running tests and linting..." && \
          uv run ruff check . && \
          uv run black --check . && \
          uv run pytest --cov=. --cov-report=term-missing --cov-fail-under=64 -v && \
          echo "Tests and linting completed successfully!"; \
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
