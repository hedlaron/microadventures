FROM python:3.13-alpine
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/bin/uv 

WORKDIR /app

COPY . /app

RUN uv sync --no-dev

CMD ["uv", "run", "server.py"]