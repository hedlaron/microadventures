from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from adventure.routes.adventure_router import router as adventure_router
from auth.routes.auth_router import auth_router
from core.config_loader import settings
from core.routes.api_router import api_router
from user.routes.user_router import user_router

openapi_tags = [
    {
        "name": "Users",
        "description": "User operations",
    },
    {
        "name": "Adventures",
        "description": "AI-powered microadventure recommendations",
    },
    {
        "name": "Health Checks",
        "description": "Application health checks",
    },
]

app = FastAPI(openapi_tags=openapi_tags)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api", tags=["Users"])
app.include_router(adventure_router, prefix="/api", tags=["Adventures"])
app.include_router(api_router, prefix="/api", tags=["Version"])


@app.get("/health", tags=["Health Checks"])
def read_root():
    return {"health": "true"}
