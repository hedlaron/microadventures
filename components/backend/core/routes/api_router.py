from fastapi import APIRouter
import os

api_router = APIRouter()

@api_router.get("/version", tags=["Version"])
async def get_version():
    """Get the current backend version from environment variable or default"""
    version = os.getenv("APP_VERSION", "latest")
    return {"version": version}
