FROM python:3.13-alpine
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/bin/uv 

# Build argument for version
ARG APP_VERSION=dev-local

WORKDIR /app

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install dependencies (this layer will be cached if deps don't change)
RUN uv sync --no-dev

# Copy source code
COPY . .

# Set environment variable for runtime
ENV APP_VERSION=${APP_VERSION}

CMD ["uv", "run", "server.py"]