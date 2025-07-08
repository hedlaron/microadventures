# Native Local Setup Guide for Microadventures

This guide outlines the steps to run the Microadventures application components (backend and frontend) directly on your local machine, without using Kubernetes or Docker containers for the application itself.

## Prerequisites

Ensure you have the following tools installed and configured on your local machine:

*   **Python 3.10+:** For the backend.
    *   Recommended: Use `pyenv` or `conda` for managing Python versions.
*   **uv:** A fast Python package installer and resolver.
    *   Installation: `pip install uv`
*   **Node.js 18+ & npm (or yarn):** For the frontend.
    *   Recommended: Use `nvm` for managing Node.js versions.
*   **PostgreSQL:** A running PostgreSQL database instance accessible from your local machine.
    *   You can install PostgreSQL directly on your machine or run it via Docker (e.g., `docker run --name microadventures-postgres -e POSTGRES_USER=microadventures -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=microadventures -p 5432:5432 -d postgres:16`).
*   **gcloud CLI:** Google Cloud SDK, authenticated to your GCP project with access to Secret Manager.
    *   Authenticate: `gcloud auth application-default login`

## Setup Steps

Follow these steps to get your Microadventures application running locally.

### 1. Set up Environment Variables

Your application requires certain environment variables, including database connection details and API keys. You will retrieve these from GCP Secret Manager.

Create a `.env` file in the `components/backend` directory and populate it with the following:

```bash
# Example .env content for components/backend
# Replace with actual values from GCP Secret Manager
DATABASE_URL="$(gcloud secrets versions access latest --secret=database-url)"
JWT_SECRET_KEY="$(gcloud secrets versions access latest --secret=jwt-secret-key)"
OPENAI_API_KEY="$(gcloud secrets versions access latest --secret=openai-api-key)"
POSTGRES_USER="$(gcloud secrets versions access latest --secret=postgresql-user)"
POSTGRES_PASSWORD="$(gcloud secrets versions access latest --secret=postgresql-password)"

# Other backend specific environment variables
PORT=8000
DOMAIN=localhost
ENVIRONMENT=local
BACKEND_CORS_ORIGINS="http://localhost:5173"
```

And in the `components/frontend` directory, create a `.env` file:

```bash
# Example .env content for components/frontend
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Database Setup

Ensure your PostgreSQL database is running and accessible. The `DATABASE_URL` in your backend's `.env` file should point to this instance.

Run the database migrations for the backend:

```bash
cd components/backend
uv run alembic upgrade heads
```

### 3. Run the Backend

Navigate to the `components/backend` directory, install dependencies, and start the backend server:

```bash
cd components/backend
uv sync
uv run python app.py
```

The backend should now be running on `http://localhost:8000`.

### 4. Run the Frontend

Navigate to the `components/frontend` directory, install dependencies, and start the frontend development server:

```bash
cd components/frontend
npm install # or yarn install
npm run dev # or yarn dev
```

The frontend should now be running on `http://localhost:5173` (or another port if configured differently).

### 5. Access the Application

Open your web browser and navigate to `http://localhost:5173` (or the port your frontend is running on). The frontend will communicate with the backend running on `http://localhost:8000`.

---

**Important Considerations:**

*   **Manual Updates:** If your secrets in GCP Secret Manager change, you will need to manually update your `.env` files.
*   **Process Management:** For long-running development, consider using a process manager like `foreman` or `honcho` to run both backend and frontend simultaneously.
*   **Database URL:** Ensure the `DATABASE_URL` in `components/backend/.env` correctly points to your local PostgreSQL instance.
