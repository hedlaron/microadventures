from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FastAPI Test API"
    jwt_secret: str = "itsnotasecretanymore"
    database_url: str = "postgresql://myuser:password@localhost:5432/microadventures"

settings = Settings() 