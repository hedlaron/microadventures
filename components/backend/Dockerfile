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

# Build arguments for test configuration (secrets passed at build time)
ARG OPENAI_API_KEY=test-api-key
ARG JWT_SECRET_KEY=test-secret-key-for-docker-build
ARG POSTGRESQL_USERNAME=test_user
ARG POSTGRESQL_PASSWORD=test_password
ARG POSTGRESQL_SERVER=localhost
ARG POSTGRESQL_PORT=5432
ARG POSTGRESQL_DATABASE=test_db

# Install development dependencies for testing
RUN uv sync --group dev

# Copy source code for testing
COPY . .

# Set non-sensitive environment variables
ENV POSTGRESQL_USERNAME=${POSTGRESQL_USERNAME}
ENV POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD}
ENV POSTGRESQL_SERVER=${POSTGRESQL_SERVER}
ENV POSTGRESQL_PORT=${POSTGRESQL_PORT}
ENV POSTGRESQL_DATABASE=${POSTGRESQL_DATABASE}

    # Run tests and linting if RUN_TESTS=true
    RUN if [ "$RUN_TESTS" = "true" ]; then \
          echo "Running tests and linting..." && \
          export JWT_SECRET_KEY="${JWT_SECRET_KEY}" && \
          export OPENAI_API_KEY="${OPENAI_API_KEY}" && \
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
