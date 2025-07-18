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
FROM python:3.13-alpine as test
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev
COPY . .
ARG RUN_TESTS=false
RUN if [ "$RUN_TESTS" = "true" ]; then \
      echo "Running backend tests..." && \
      uv run pytest && \
      echo "ALL_TESTS_PASSED"; \
    else \
      echo "Skipping backend tests (RUN_TESTS=false)"; \
    fi

# Production stage
FROM base AS production

# Copy source code
COPY . .

# Set environment variable for runtime
ENV APP_VERSION=${APP_VERSION}

CMD ["uv", "run", "server.py"]
