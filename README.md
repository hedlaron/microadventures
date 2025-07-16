# 🚀 Microadventures

**AI-powered micro-adventure planning application** that helps you discover short, exciting trips from a few hours to a few days, tailored to your location, time constraints, and current weather conditions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/hedlaron/microadventures)](https://github.com/hedlaron/microadventures/stargazers)

## ✨ Features

- 🤖 **AI-Powered Planning**: Generate personalized adventure recommendations using OpenAI
- 🗺️ **Interactive Maps**: Visual trip planning with Google Maps integration  
- 🌤️ **Weather Integration**: Real-time weather considerations for optimal planning
- 📱 **Responsive Design**: Beautiful, mobile-first interface built with React and Tailwind CSS
- 👤 **User Authentication**: Secure JWT-based authentication system
- 📊 **Adventure History**: Track and revisit your past adventures
- 🔗 **Adventure Sharing**: Share your adventures with others via public links
- ☁️ **Cloud Native**: Production-ready Kubernetes deployment with GitOps

## 🚀 Quick Start

Choose your preferred development environment:

### 🐳 Local Development (Recommended)
For rapid development with live reloading:
```bash
# Using Tilt (recommended for active development)
# See: docs/tilt-setup.md
cd initial-setup && task kind:setup
cd .. && tilt up
```

### 🏗️ Full Local Kubernetes
For testing production-like deployments locally:
```bash
# Using Kind cluster
# See: docs/kind-setup.md
cd initial-setup && task kind:setup
cd ../k8s && task apply-all
```

### ☁️ Cloud Deployment
For production deployment on Google Cloud Platform:
```bash
# See: docs/gcp-deployment.md
cd initial-setup && task gcp:create-all
cd ../k8s && task apply-all
```

### 💻 Native Development
For component-level development without containers:
```bash
# See: docs/native-local-setup.md
# Run backend and frontend directly on your machine
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  FastAPI Backend│    │   PostgreSQL    │
│                 │    │                 │    │    Database     │
│ • Vite + React  │◄──►│ • Python 3.13  │◄──►│                 │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Adventure Data│
│ • Google Maps   │    │ • OpenAI API    │    │ • User Profiles │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                 ┌─────────────────────────────┐
                 │      Kubernetes Cluster      │
                 │                             │
                 │ • Traefik Ingress          │
                 │ • External Secrets (GCP)   │
                 │ • GitOps with Kluctl       │
                 │ • Automated CI/CD          │
                 └─────────────────────────────┘
```

## 📁 Project Structure

```
microadventures/
├── 📱 components/
│   ├── backend/           # FastAPI backend service
│   │   ├── adventure/     # Adventure planning logic
│   │   ├── auth/          # Authentication system  
│   │   ├── core/          # Core configuration
│   │   └── user/          # User management
│   └── frontend/          # React frontend application
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── contexts/      # State management
│       │   └── utils/         # Helper functions
│       └── public/        # Static assets
├── ☸️ k8s/                # Kubernetes manifests
│   ├── components/        # Service-specific configs
│   ├── values/           # Environment configurations
│   └── scripts/          # Deployment automation
├── 🔧 cicd/              # GitOps and CI/CD
│   ├── github-actions/   # GitHub Actions workflows
│   └── kluctl-gitops/    # GitOps configurations
├── 📚 docs/              # Documentation
├── 🚀 initial-setup/     # Cluster bootstrap
└── 🔄 tilt/              # Local development
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Google Maps API** for mapping
- **React Router** for navigation

### Backend  
- **FastAPI** (Python 3.13)
- **PostgreSQL** database
- **Alembic** for migrations
- **JWT** authentication
- **OpenAI API** integration

### Infrastructure
- **Kubernetes** orchestration
- **Docker** containerization
- **Traefik** ingress controller
- **Kluctl** for GitOps
- **GitHub Actions** CI/CD
- **GCP Secret Manager** for secrets

## 📋 Prerequisites

- **Docker** and **kubectl**
- **Kind** (for local Kubernetes)
- **Task** runner (`go install github.com/go-task/task/v3/cmd/task@latest`)
- **Google Cloud SDK** (for cloud deployment)
- **Tilt** (for live development - optional)

## 🔧 Configuration

The application supports multiple environments with proper secret management:

- **Local Development**: Uses `.env` files and local secrets
- **Kind Cluster**: Manual secret provisioning from GCP
- **Production**: External Secrets Operator with GCP Secret Manager

Required secrets:
- `OPENAI_API_KEY` - For AI adventure generation
- `JWT_SECRET_KEY` - For user authentication  
- `POSTGRES_*` - Database connection details

## 📖 Documentation

- 📘 [Kind Setup Guide](docs/kind-setup.md) - Local Kubernetes development
- 📗 [Tilt Setup Guide](docs/tilt-setup.md) - Live reload development  
- 📙 [GCP Deployment](docs/gcp-deployment.md) - Cloud deployment
- 📕 [Native Setup](docs/native-local-setup.md) - Direct machine setup

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test locally
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all environments still work

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT integration
- **Google Maps** for mapping services
- **FastAPI** and **React** communities
- **Kubernetes** ecosystem contributors
- **Sid from DevOps Directive** ([sidpalas](https://github.com/sidpalas/)) for excellent DevOps and Kubernetes tutorials

---

**Built with ❤️ for adventure seekers everywhere**