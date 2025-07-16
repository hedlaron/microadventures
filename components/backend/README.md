# 🚀 Microadventures Backend

**FastAPI-based backend service** powering the Microadventures application with AI-driven adventure planning, user authentication, and comprehensive adventure management.

## ✨ Features

- 🤖 **AI Adventure Generation**: OpenAI GPT integration for personalized adventure recommendations
- 🔐 **JWT Authentication**: Secure user authentication and session management
- 🗄️ **PostgreSQL Integration**: Robust data persistence with Alembic migrations
- 📊 **Adventure Management**: CRUD operations for adventures with history tracking
- 🔗 **Adventure Sharing**: Public adventure sharing with unique tokens
- 📈 **User Quotas**: Rate limiting and usage tracking
- 🌐 **CORS Support**: Configurable cross-origin resource sharing
- 📝 **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- 🏗️ **Modular Architecture**: Clean separation of concerns with domain-driven design

## 🛠️ Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.13**: Latest Python with async/await support
- **PostgreSQL**: Reliable relational database
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **OpenAI API**: GPT integration for AI-powered features
- **uvicorn**: ASGI server for production deployment

## 🏗️ Project Structure

```
backend/
├── 📁 adventure/          # Adventure domain
│   ├── models/           # SQLAlchemy models
│   ├── routes/           # FastAPI route handlers
│   ├── schemas/          # Pydantic models
│   └── services/         # Business logic
├── 🔐 auth/              # Authentication domain  
│   ├── models/           # User models
│   ├── routes/           # Auth endpoints
│   ├── services/         # Auth services
│   └── utils/            # JWT utilities
├── ⚙️ core/              # Core configuration
│   ├── config.py         # Application settings
│   ├── database.py       # Database connection
│   └── routes/           # Core API routes
├── 👤 user/              # User management
│   ├── models/           # User profile models
│   ├── routes/           # User endpoints
│   └── services/         # User services
├── 🗃️ alembic/           # Database migrations
├── 🧪 tests/             # Test suite
├── 📄 app.py             # FastAPI application entry
├── 🚀 server.py          # Development server
└── 📦 pyproject.toml     # Dependencies and config
```

## 🚀 Quick Start

### Prerequisites

- Python 3.13+
- PostgreSQL database
- OpenAI API key

### Development Setup

1. **Install dependencies:**
   ```bash
   cd components/backend
   uv install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run database migrations:**
   ```bash
   uv run alembic upgrade head
   ```

4. **Start development server:**
   ```bash
   uv run python server.py
   ```

5. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

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

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
POSTGRESQL_SERVER=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_DATABASE=microadventures
POSTGRESQL_USERNAME=postgres
POSTGRESQL_PASSWORD=password

# Application Settings
DOMAIN=localhost
ENVIRONMENT=local
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Security
JWT_SECRET_KEY=your-super-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# External Services
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4

# Optional: Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
```

### Configuration Files

- `core/config.py`: Central configuration management
- `alembic.ini`: Database migration settings
- `pyproject.toml`: Dependencies and project metadata

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user

### Adventures
- `POST /api/adventures` - Create new adventure
- `GET /api/adventures` - List user adventures
- `GET /api/adventures/{id}` - Get specific adventure
- `PUT /api/adventures/{id}` - Update adventure
- `DELETE /api/adventures/{id}` - Delete adventure
- `POST /api/adventures/{id}/share` - Share adventure
- `GET /api/shared/{token}` - Get shared adventure

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/quota` - Get user quota status

### System
- `GET /api/health` - Health check
- `GET /api/version` - Application version

## 🗄️ Database Schema

### Core Models

```python
# User Model
class User(Base):
    id: UUID
    email: str
    username: str
    hashed_password: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Adventure Model  
class Adventure(Base):
    id: UUID
    user_id: UUID
    title: str
    description: str
    location: str
    duration_hours: int
    weather_conditions: str
    ai_recommendations: JSON
    is_shared: bool
    share_token: str
    created_at: datetime
    updated_at: datetime
```

### Migrations

```bash
# Create new migration
uv run alembic revision --autogenerate -m "Add new feature"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1

# Check migration status
uv run alembic current
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=. --cov-report=html

# Run specific test file
uv run pytest tests/test_adventures.py

# Run with verbose output
uv run pytest -v
```

### Test Structure

```python
# Test example
def test_create_adventure(client, auth_headers):
    """Test adventure creation with valid data."""
    adventure_data = {
        "title": "Mountain Hiking",
        "location": "Rocky Mountains",
        "duration_hours": 4
    }
    
    response = client.post(
        "/api/adventures",
        json=adventure_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    assert response.json()["title"] == "Mountain Hiking"
```

## 🔒 Security

### Authentication Flow

1. User registers/logs in with credentials
2. Server validates and returns JWT token
3. Client includes token in Authorization header
4. Server validates token on each request
5. Token expires after configured time

### Security Features

- **Password hashing** with bcrypt
- **JWT token validation** on protected routes
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse
- **Input validation** with Pydantic models
- **SQL injection protection** via SQLAlchemy ORM

## 🚀 Deployment

### Production Settings

```python
# core/config.py
class Settings:
    environment: str = "production"
    debug: bool = False
    backend_cors_origins: List[str] = ["https://microadventures.com"]
    database_pool_size: int = 20
    log_level: str = "INFO"
```

### Docker Production

```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen

# Copy application
COPY . .

# Run application
CMD ["uv", "run", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes Deployment

The backend is deployed using Kubernetes manifests in `/k8s/components/backend/`:
- **Deployment**: Application pods with resource limits
- **Service**: Internal cluster communication
- **ConfigMap**: Environment-specific configuration
- **Secrets**: Sensitive configuration (JWT keys, API keys)

## 📈 Monitoring

### Health Checks

```python
@router.get("/health")
async def health_check():
    """Health check endpoint for load balancers."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

### Logging

```python
import logging

logger = logging.getLogger(__name__)

@router.post("/adventures")
async def create_adventure(data: AdventureCreate):
    logger.info(f"Creating adventure: {data.title}")
    try:
        # Adventure creation logic
        logger.info(f"Adventure created successfully: {adventure.id}")
        return adventure
    except Exception as e:
        logger.error(f"Failed to create adventure: {str(e)}")
        raise
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.