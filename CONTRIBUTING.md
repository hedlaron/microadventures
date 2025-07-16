# 🤝 Contributing to Microadventures

Thank you for your interest in contributing to Microadventures! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful** and inclusive in all interactions
- **Be collaborative** and help others learn and grow
- **Be constructive** when providing feedback
- **Focus on the code and ideas**, not personal attributes

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Docker** and **kubectl**
- **Kind** (Kubernetes in Docker)
- **Task** runner: `go install github.com/go-task/task/v3/cmd/task@latest`
- **Node.js 18+** and **npm** (for frontend development)
- **Python 3.13+** and **uv** (for backend development)
- **Git** with proper configuration

### Setting Up Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/microadventures.git
   cd microadventures
   ```

2. **Set up local development environment:**
   ```bash
   # Quick setup with Kind + Tilt (recommended)
   cd initial-setup
   task kind:setup
   cd ..
   tilt up
   ```

3. **Verify the setup:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API docs: http://localhost:8000/docs

## 🔄 Development Process

### Branching Strategy

- **main/master**: Production-ready code
- **feature/\***: New features or enhancements
- **bugfix/\***: Bug fixes
- **docs/\***: Documentation updates
- **refactor/\***: Code refactoring

### Workflow

1. **Create an issue** or check existing issues
2. **Create a branch** from main: `git checkout -b feature/your-feature-name`
3. **Make your changes** following our coding standards
4. **Test thoroughly** in all supported environments
5. **Update documentation** as needed
6. **Submit a pull request** with clear description

## 📝 Coding Standards

### Frontend (React/JavaScript)

```javascript
// Use functional components with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects here
  }, [dependency]);

  return (
    <div className="container mx-auto p-4">
      {/* JSX here */}
    </div>
  );
};

export default MyComponent;
```

**Standards:**
- Use **functional components** with hooks
- Follow **Tailwind CSS** utility patterns
- Use **camelCase** for variables and functions
- Use **PascalCase** for component names
- Keep components **focused and small**
- Add **PropTypes** or TypeScript types when possible

### Backend (Python/FastAPI)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .schemas import ItemCreate, ItemResponse
from .services import item_service
from ..core.database import get_db

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemResponse)
async def create_item(
    item_data: ItemCreate,
    db: Session = Depends(get_db)
) -> ItemResponse:
    """Create a new item."""
    try:
        return await item_service.create_item(db, item_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

**Standards:**
- Follow **PEP 8** style guidelines
- Use **type hints** for all function parameters and returns
- Write **descriptive docstrings** for public functions
- Use **snake_case** for variables and functions
- Use **dependency injection** pattern
- Handle **exceptions** appropriately

### Kubernetes/Infrastructure

```yaml
# Use consistent naming and labeling
apiVersion: apps/v1
kind: Deployment
metadata:
  name: microadventures-backend
  labels:
    app: microadventures
    component: backend
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: microadventures
      component: backend
  template:
    metadata:
      labels:
        app: microadventures
        component: backend
```

**Standards:**
- Use **consistent labeling** across all resources
- Follow **12-factor app** principles
- Use **ConfigMaps** for configuration
- Use **Secrets** for sensitive data
- Include **resource limits** and **health checks**

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd components/frontend
npm test

# Backend tests  
cd components/backend
uv run pytest

# Integration tests
cd k8s
task test:integration

# End-to-end tests
tilt up  # Start development environment
npm run test:e2e
```

### Test Requirements

- **Unit tests** for new functions and components
- **Integration tests** for API endpoints
- **End-to-end tests** for critical user flows
- Tests should be **fast**, **reliable**, and **independent**

### Test Structure

```python
# Backend test example
def test_create_adventure():
    """Test adventure creation with valid data."""
    # Arrange
    adventure_data = {
        "title": "Test Adventure",
        "location": "Test Location"
    }
    
    # Act
    response = client.post("/api/adventures", json=adventure_data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["title"] == "Test Adventure"
```

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date:**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run all tests and linting:**
   ```bash
   task test:all
   task lint:all
   ```

3. **Create a pull request** with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **References to related issues**
   - **Screenshots** for UI changes
   - **Testing instructions** for reviewers

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings or errors
```

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear title** and **description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, browser, etc.)
- **Screenshots or logs** if applicable
- **Minimal reproduction case** when possible

### Feature Requests

For feature requests, please include:

- **Clear description** of the proposed feature
- **Use case** and **user story**
- **Acceptance criteria**
- **Implementation suggestions** (optional)
- **Priority level** and **timeline** expectations

## 🏷️ Labeling

We use labels to categorize issues and pull requests:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority/high` - High priority items
- `area/frontend` - Frontend-related changes
- `area/backend` - Backend-related changes
- `area/infrastructure` - Kubernetes/deployment changes

## 🎯 Development Focus Areas

We're particularly interested in contributions in these areas:

- **🤖 AI/ML Features**: Improving adventure recommendations
- **🗺️ Map Integration**: Enhanced mapping and location features  
- **📱 Mobile Experience**: Better mobile UI/UX
- **⚡ Performance**: Frontend and backend optimizations
- **🔒 Security**: Security enhancements and audits
- **🧪 Testing**: Improving test coverage and quality
- **📚 Documentation**: User guides and API documentation

## 💬 Community

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bugs and feature requests
- **Pull Requests**: For code contributions

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Thank you for contributing to Microadventures! 🚀✨
