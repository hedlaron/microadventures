from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Annotated, Any, Literal
import socket
import os

from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field,
    PostgresDsn,
    Field
)

from pydantic_core import MultiHostUrl


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


def resolve_db_host(host: str) -> str:
    """
    Resolve database host, falling back to localhost if 'db' host is not reachable.
    This allows the same config to work in both Docker and local environments.
    """
    if host == "db":
        try:
            # Try to resolve 'db' hostname
            socket.gethostbyname(host)
            return host
        except socket.gaierror:
            # If 'db' can't be resolved, assume we're running locally
            return "localhost"
    return host


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra="ignore",
        env_ignore_empty = True,
    )
    DOMAIN: str = 'localhost'
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"
    JWT_SECRET_KEY: str

    @computed_field
    @property
    def server_host(self) -> str:
        # Use HTTPS for anything other than local development
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN}"
        return f"https://{self.DOMAIN}"

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = Field(default_factory=list)

    POSTGRESQL_USERNAME: str
    POSTGRESQL_PASSWORD: str
    POSTGRESQL_SERVER: str
    POSTGRESQL_PORT: int
    POSTGRESQL_DATABASE: str

    # OpenAI Configuration
    OPENAI_API_KEY: str

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        # Resolve the database host (fall back to localhost if 'db' is not reachable)
        resolved_host = resolve_db_host(self.POSTGRESQL_SERVER)
        
        return MultiHostUrl.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRESQL_USERNAME,
            password=self.POSTGRESQL_PASSWORD,
            host=resolved_host,
            port=self.POSTGRESQL_PORT,
            path=self.POSTGRESQL_DATABASE,
        )