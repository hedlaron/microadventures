# ☸️ Microadventures Kubernetes Deployment

This directory contains the Kluctl deployment configuration for the Microadventures application. Kluctl was chosen for its powerful templating and multi-environment management capabilities, which allows for a clean separation of configuration from the core application logic.

## ✨ Why Kluctl?

- **GitOps**: Kluctl enables a GitOps workflow, where the Git repository is the single source of truth for the desired state of the Kubernetes cluster.
- **Multi-Environment**: It simplifies managing deployments across different environments (e.g., local, staging, production) with a single configuration.
- **Templating**: Kluctl uses Jinja2 templating, which allows for dynamic and reusable Kubernetes manifests.
- **Lifecycle Hooks**: It supports pre and post-deployment hooks, which are used here to run database migrations.

## 🛠️ Tech Stack

- **Kubernetes**: The container orchestration platform.
- **Kluctl**: The GitOps deployment tool.
- **Kind**: For local Kubernetes development.
- **GKE**: For production deployments.
- **Traefik**: As the Ingress controller.
- **Cert-manager**: For automated TLS certificate management.
- **External Secrets Operator**: For managing secrets from external secret stores like GCP Secret Manager.
- **Trivy**: For vulnerability scanning.

## 🚀 Deployment

### Prerequisites

- **kubectl**: The Kubernetes command-line tool.
- **Kluctl**: The Kluctl command-line tool.
- **Task**: The task runner.

### Deploying to Kind (Local)

1. **Create the Kind cluster:**
   ```bash
   task kind:setup
   ```

2. **Deploy the application:**
   ```bash
   cd k8s
   task apply-all
   ```

### Deploying to GKE (Production)

1. **Create the GKE cluster and resources:**
   ```bash
   task gcp:create-all
   ```

2. **Deploy the application:**
   ```bash
   cd k8s
   task apply-all
   ```

## 🔐 Secret Management

Secrets are managed using the **External Secrets Operator**, which fetches secrets from **GCP Secret Manager** and injects them into the cluster as Kubernetes secrets. This is a secure way to manage secrets without storing them in the Git repository.

For local development, secrets are managed with `.env` files.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
