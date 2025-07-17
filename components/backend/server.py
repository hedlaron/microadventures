if __name__ == "__main__":
    import os

    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=os.environ.get("ENVIRONMENT", "local") == "local",
    )
