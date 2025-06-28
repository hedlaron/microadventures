# 🗺️ Microadventures

*AI-powered spontaneous local adventures at your fingertips*

Transform your free time into memorable experiences with AI-generated microadventures tailored to your location, preferences, and schedule. Whether you have a few hours or a full day, discover hidden gems and exciting activities in your area.

## ✨ Features

### 🤖 **AI-Powered Adventure Generation**
- **Smart Recommendations**: GPT-powered adventure suggestions based on your location and preferences
- **Weather Integration**: Real-time weather forecasting to optimize your adventure
- **Flexible Duration**: Choose from quick escapes to full-day explorations
- **Local Insights**: Discover hidden gems and off-the-beaten-path locations

### 🗺️ **Interactive Planning**
- **Map Integration**: Visual location selection with Google Maps
- **Route Planning**: Turn-by-turn directions and estimated travel times
- **Packing Lists**: Personalized gear recommendations based on activity and weather
- **Detailed Itineraries**: Time-structured adventure plans with local tips

### 📱 **User Experience**
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Adventure History**: Save and revisit your favorite adventures
- **Public Sharing**: Share your adventures with friends via unique links
- **Quota Management**: Fair usage with transparent limits and reset counters

### 🔐 **Account Management**
- **Secure Authentication**: JWT-based user authentication
- **Profile Management**: Track your adventure history and preferences
- **Quota Tracking**: Visual countdown to quota reset with transparent limits

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **AI**: OpenAI GPT for adventure generation
- **Maps**: Google Maps API integration
- **Images**: Unsplash API for adventure visuals
- **Authentication**: JWT tokens with secure storage

### **Project Structure**
```
microadventures/
├── components/
│   ├── backend/          # FastAPI backend application
│   │   ├── adventure/    # Adventure domain logic
│   │   ├── auth/         # Authentication & authorization
│   │   ├── user/         # User management
│   │   ├── core/         # Configuration & database
│   │   ├── alembic/      # Database migrations
│   │   └── tests/        # Comprehensive test suite
│   ├── frontend/         # React frontend application
│   │   └── src/          # Source code & components
│   └── postgresql/       # Database configuration
├── gcloud/               # Google Cloud deployment
├── initial-setup/        # Development setup scripts
└── devbox.json          # Development environment
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **PostgreSQL** 14+ (database)
- **API Keys**: OpenAI, Google Maps (optional: Unsplash)

### 1. Clone & Setup
```bash
git clone <repository-url>
cd microadventures
```

### 2. Backend Setup
```bash
cd components/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies using uv (faster package manager)
uv sync
# If uv is not installed: pip install uv

# Configure environment
cp .env.example .env
# Edit .env with your API keys and database credentials

# Run database migrations
alembic upgrade head

# Start development server
python server.py
```

### 3. Frontend Setup
```bash
cd components/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API endpoints

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Development

### **Development Environment Setup**

This project uses modern development tools for a consistent, reproducible development experience:

#### **🔮 Devbox - Reproducible Environments**
[Devbox](https://www.jetpack.io/devbox) ensures everyone uses the same tool versions across all platforms.

```bash
# Install devbox
curl -fsSL https://get.jetpack.io/devbox | bash

# Enter development environment (installs all tools)
devbox shell

# Quick start commands
devbox run setup      # Install all dependencies
devbox run dev         # Start both frontend and backend
devbox run test        # Run all tests
```

#### **🔄 direnv - Automatic Environment Loading**
[direnv](https://direnv.net/) automatically loads environment variables when entering directories.

```bash
# Install direnv
brew install direnv  # macOS
# Add to shell: eval "$(direnv hook zsh)" >> ~/.zshrc

# Allow environment loading (first time)
direnv allow
```

#### **🐳 Docker - Containerized Development**
Optional Docker setup for complete isolation and production-like environment.

```bash
# Full stack with Docker Compose
docker-compose up -d

# Development with hot reload
docker-compose -f docker-compose.dev.yml up

# Production-like environment
docker-compose -f docker-compose.prod.yml up
```

### **Development Workflow**

#### **Recommended Setup**
```bash
# 1. Clone and enter development environment
git clone <repository-url>
cd microadventures
devbox shell

# 2. Setup both frontend and backend
devbox run setup

# 3. Configure environment variables
cp components/backend/.env.example components/backend/.env
cp components/frontend/.env.example components/frontend/.env
# Edit .env files with your API keys

# 4. Start development servers
devbox run dev
# Or separately:
# devbox run backend:dev
# devbox run frontend:dev
```

#### **Available Commands**
```bash
# Development
devbox run dev             # Start all services
devbox run backend:dev     # Backend only
devbox run frontend:dev    # Frontend only

# Database
devbox run db:setup        # Initialize database
devbox run db:migrate      # Run migrations
devbox run db:reset        # Reset database

# Testing
devbox run test            # All tests
devbox run backend:test    # Backend tests
devbox run frontend:test   # Frontend tests

# Code Quality
devbox run lint            # Lint all code
devbox run format          # Format all code
devbox run type-check      # Type checking
```

### **Development Configuration Files**

#### **devbox.json** - Development Environment Definition
```json
{
  "packages": [
    "python@3.11",
    "nodejs@20",
    "postgresql@15",
    "redis@7.2"
  ],
  "shell": {
    "init_hook": [
      "echo 'Microadventures development environment loaded!'",
      "python --version && node --version"
    ],
    "scripts": {
      "setup": [
        "cd components/backend && uv sync",
        "cd components/frontend && npm install"
      ],
      "dev": [
        "concurrently 'devbox run backend:dev' 'devbox run frontend:dev'"
      ],
      "backend:dev": "cd components/backend && python server.py",
      "frontend:dev": "cd components/frontend && npm run dev"
    }
  }
}
```

#### **.envrc** - direnv Configuration
```bash
# Automatic environment loading
export PYTHONPATH="$PWD:$PYTHONPATH"
export NODE_ENV=development

# Load devbox environment
if command -v devbox >/dev/null 2>&1; then
  eval "$(devbox generate direnv --print-envrc)"
fi

# Load local environment variables
if [ -f .env ]; then
  source .env
fi
```

#### **Docker Configuration**
```yaml
# docker-compose.yml - Production-like setup
version: '3.8'
services:
  backend:
    build: ./components/backend
    ports: ["8000:8000"]
    environment:
      - POSTGRESQL_SERVER=db
    depends_on: [db, redis]
  
  frontend:
    build: ./components/frontend
    ports: ["5173:5173"]
    depends_on: [backend]
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: microadventures
    volumes: [postgres_data:/var/lib/postgresql/data]
  
  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]
```

### **Environment Variables**

#### Backend (.env)
```bash
# Database
POSTGRESQL_USERNAME=your_db_user
POSTGRESQL_PASSWORD=your_db_password
POSTGRESQL_SERVER=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_DATABASE=microadventures

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key

# APIs
OPENAI_API_KEY=your-openai-api-key

# Optional
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### **Running Tests**
```bash
# Backend tests
cd components/backend
python -m pytest tests/

# Frontend tests (if configured)
cd components/frontend
npm test
```

### **Database Management**
```bash
cd components/backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 📚 API Documentation

The backend provides a comprehensive REST API documented with OpenAPI/Swagger:

- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### **Key Endpoints**
- `POST /api/adventures/generate` - Generate new adventures
- `GET /api/adventures/my-history` - User's adventure history
- `POST /api/adventures/{id}/share` - Toggle adventure sharing
- `GET /api/shared/{share_token}` - View shared adventures
- `GET /api/user/quota` - Check usage quota

## 🎯 Usage Examples

### **Planning an Adventure**
1. **Choose Location**: Use the map picker or enter an address
2. **Set Preferences**: Select duration, activity type, and round-trip option
3. **Generate**: AI creates a personalized adventure with:
   - Detailed itinerary with timestamps
   - Weather forecast and recommendations
   - Packing list based on activities
   - Photo opportunities and local tips
   - Interactive map with routes

### **Managing Adventures**
- **Save Favorites**: All generated adventures are automatically saved
- **Share Adventures**: Make adventures public and share via unique links
- **Browse History**: Paginated view of all your past adventures
- **Track Usage**: Visual quota counter with reset countdown

## 🚢 Deployment

### **Development**
Both frontend and backend include development servers for hot reloading and debugging.

### **Production**
- **Backend**: Deploy with Gunicorn/Uvicorn behind reverse proxy
- **Frontend**: Build static assets and serve with nginx/CDN
- **Database**: Managed PostgreSQL service recommended
- **Environment**: Use proper secret management for API keys

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Run** the test suite
6. **Submit** a pull request

### **Development Guidelines**
- Follow existing code style and conventions
- Add comprehensive tests for new features
- Update documentation for API changes
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Check the component-specific READMEs for detailed information
- **API**: Use the interactive API documentation for endpoint details

---

*Built with ❤️ to make spontaneous adventures accessible to everyone*
