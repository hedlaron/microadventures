FROM python:3.13-alpine
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/bin/uv 

WORKDIR /app

COPY . /app

RUN uv sync --no-dev --compile-bytecode

CMD ["uv", "run", "server.py"]