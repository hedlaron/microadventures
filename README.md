# 🚀 Microadventures

**AI-powered micro-adventure planning application** that helps you discover short, exciting trips from a few hours to a few days, tailored to your location, time constraints, and current weather conditions. This project is a full-stack application built with a modern, cloud-native architecture, designed to be a portfolio piece showcasing a wide range of skills and technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/hedlaron/microadventures)](https://github.com/hedlaron/microadventures/stargazers)

## ✨ Features

- 🤖 **AI-Powered Planning**: Generate personalized adventure recommendations using OpenAI, Anthropic Sonnet 4, GPT-4.1, and Gemini 2.5.
- 🗺️ **Interactive Maps**: Visual trip planning with Leaflet integration.
- 🌤️ **Weather Integration**: Real-time weather considerations for optimal planning.
- 📱 **Responsive Design**: Beautiful, mobile-first interface built with React and Tailwind CSS.
- 👤 **User Authentication**: Secure JWT-based authentication system.
- 📊 **Adventure History**: Track and revisit your past adventures.
- 🔗 **Adventure Sharing**: Share your adventures with others via public links.
- ☁️ **Cloud Native**: Production-ready Kubernetes deployment with GitOps.

## 📖 Documentation

- 📘 [Backend README](components/backend/README.md)
- 📗 [Frontend README](components/frontend/README.md)
- 📙 [Kubernetes README](k8s/README.md)
- 📕 [Initial Setup README](initial-setup/README.md)

## 🛠️ Technology Stack

This project uses a modern, robust, and high-performance technology stack to solve complex problems efficiently.

### Frontend
- **React 19**: For building a fast, modern, and responsive user interface.
- **Vite**: As a next-generation frontend build tool for a fast development experience.
- **Tailwind CSS**: For a utility-first CSS workflow, enabling rapid UI development.
- **Leaflet**: For interactive maps.
- **Axios**: For making HTTP requests to the backend.

### Backend
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.13.
- **PostgreSQL**: As the primary relational database.
- **SQLAlchemy**: As the ORM for interacting with the database.
- **Alembic**: For database migrations.
- **Pydantic**: For data validation.
- **JWT**: For secure user authentication.

### Infrastructure & DevOps
- **Docker**: For containerizing the frontend and backend applications.
- **Kubernetes (K8s)**: For container orchestration, enabling scalable and resilient deployments.
- **Kind**: For local Kubernetes development.
- **GKE (Google Kubernetes Engine)**: For production deployments on Google Cloud.
- **Kluctl**: For a GitOps approach to Kubernetes deployments.
- **Devbox**: For creating isolated development environments with Nix.
- **Task**: As a task runner and build tool.
- **Pre-commit**: For running linters and formatters before committing code.
- **GitHub Actions**: For continuous integration and continuous deployment (CI/CD).
- **Trivy**: For vulnerability scanning of container images.
- **OpenTelemetry**: For observability and monitoring.

## 🧑‍💻 Development Lifecycle

This project was developed with a strong emphasis on modern software development practices and a robust DevOps culture.

### Local Development
- **Devbox**: `devbox.json` defines the development environment, ensuring all developers have the same tools and versions. `devbox shell` creates an isolated environment with all the necessary dependencies.
- **Tilt**: `Tiltfile` provides a live development environment for Kubernetes. It automatically builds and deploys services as you make changes to the code.
- **Task**: `Taskfile.yaml` files are used to automate common development tasks like running tests, linting, and building the application.

### Testing
- **Frontend**: `vitest` is used for unit and integration testing of React components.
- **Backend**: `pytest` is used for unit and integration testing of the FastAPI application.
- **CI**: GitHub Actions runs all tests automatically on every push and pull request.

### Linting and Formatting
- **Pre-commit**: `.pre-commit-config.yaml` is configured to run linters and formatters before each commit, ensuring code quality and consistency.
- **Ruff**: For linting and formatting Python code.
- **ESLint** and **Prettier**: For linting and formatting JavaScript/React code.

### CI/CD
- **GitHub Actions**: Workflows in `.github/workflows` automate the testing, building, and deployment of the application.
- **Kluctl**: Used for deploying to Kubernetes in a GitOps fashion. The desired state of the cluster is defined in the `k8s` directory and `kluctl` ensures the cluster matches that state.

### AI-Assisted Development
Throughout the development of this project, I have intensively used the following AI models to assist with coding, debugging, and documentation:
- **Anthropic Sonnet 4**
- **GPT-4.1**
- **Gemini 2.5**

## 🚀 Getting Started

To get started with this project, please refer to the [Initial Setup README](initial-setup/README.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
