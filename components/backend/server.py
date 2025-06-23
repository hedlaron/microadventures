from app import app

if __name__ == "__main__":
    import uvicorn, os
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=os.environ.get("ENVIRONMENT", "local") == "local")