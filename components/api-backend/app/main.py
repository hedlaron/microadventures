from fastapi import FastAPI
from app.core.config import settings
from app.api.endpoints import auth, products

app = FastAPI(title=settings.app_name)

# Include routers
# app.include_router(auth.router, tags=["auth"])
app.include_router(products.router, tags=["products"])
