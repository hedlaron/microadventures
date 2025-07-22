# 🚀 Microadventures Backend

**FastAPI-based backend service** powering the Microadventures application with AI-driven adventure planning, user authentication, and comprehensive adventure management. This backend is designed for high performance, scalability, and maintainability, making it an ideal foundation for a modern web application.

## ✨ Why This Stack?

This project intentionally uses a modern, robust, and high-performance technology stack to solve complex problems efficiently. Here’s why these technologies were chosen:

- **FastAPI**: Chosen for its incredible performance, which rivals Node.js and Go. Its automatic interactive documentation with Swagger UI and ReDoc is a massive productivity booster, and its dependency injection system simplifies code and improves testability.
- **Python 3.13**: Leveraging the latest version of Python for its ongoing performance improvements and new features, particularly in asynchronous programming.
- **PostgreSQL**: A powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance. It's perfect for handling the complex data relationships in this application.
- **SQLAlchemy**: Provides a full suite of well-known enterprise-level persistence patterns, designed for efficient and high-performing database access, adapted into a simple and Pythonic domain language.
- **Alembic**: A lightweight database migration tool for SQLAlchemy. It allows for the management of database schema changes in a structured and repeatable way.
- **Pydantic**: For data validation and settings management using Python type annotations. It enforces type hints at runtime, and provides user-friendly errors when data is invalid.
- **JWT (JSON Web Tokens)**: A compact, URL-safe means of representing claims to be transferred between two parties. It's a standard for stateless authentication, which is perfect for a decoupled frontend-backend architecture.
- **OpenAI, Anthropic Sonnet 4, GPT-4.1, and Gemini 2.5**: To provide the core functionality of the application - AI-powered adventure generation.
- **Uvicorn**: A lightning-fast ASGI server, for running the FastAPI application in production.
- **Docker**: For containerizing the application, ensuring a consistent environment for development, testing, and production.
- **OpenTelemetry**: For instrumenting the application to provide observability data (metrics, traces, and logs).

## 🛠️ Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.13**: Latest Python with async/await support
- **PostgreSQL**: Reliable relational database
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **OpenAI, Anthropic Sonnet 4, GPT-4.1, and Gemini 2.5**: For AI-powered features
- **uvicorn**: ASGI server for production deployment
- **Requests**: Elegant and simple HTTP library for Python.
- **Svix**: for sending webhooks.
- **OpenTelemetry**: For observability.

## 🚀 Getting Started

### Prerequisites

- **Devbox**: For setting up the development environment.
- **Docker**: For running the application in a container.

### Development Setup

1. **Initialize the development environment:**
   ```bash
   devbox shell
   ```

2. **Install dependencies:**
   ```bash
   cd components/backend
   uv install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**
   ```bash
   uv run alembic upgrade head
   ```

5. **Start development server:**
   ```bash
   uv run python server.py
   ```

6. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs

### Docker Development

```bash
# Build the image
docker build -t microadventures-backend .

# Run with environment variables
docker run -p 8000:8000 \
  -e POSTGRESQL_SERVER=host.docker.internal \
  -e OPENAI_API_KEY=your_key \
  microadventures-backend
```

## 🧪 Testing

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=. --cov-report=html
```

## 🔒 Security

- **Password hashing** with bcrypt
- **JWT token validation** on protected routes
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse
- **Input validation** with Pydantic models
- **SQL injection protection** via SQLAlchemy ORM

## 🚀 Deployment

The backend is deployed using Kubernetes manifests in `/k8s/components/backend/`. See the [Kubernetes README](../../k8s/README.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
