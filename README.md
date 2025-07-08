# Microadventures Project

This repository contains the Microadventures application, a platform for discovering and sharing micro-adventures.

## Getting Started

To get the Microadventures application running, you have a few options:

*   **Local Development (Kind Cluster):** For local development and testing using a Kubernetes in Docker (Kind) cluster, refer to the [Kind Cluster Setup Guide](docs/kind-setup.md).
*   **Local Development (Tilt):** For local development with live reloading using Tilt, refer to the [Tilt Setup Guide](docs/tilt-setup.md).
*   **GCP Deployment:** For deploying to Google Cloud Platform, refer to the [GCP Deployment Guide](docs/gcp-deployment.md).
*   **Native Local Development:** For running components directly on your local machine, refer to the [Native Local Setup Guide](docs/native-local-setup.md).

## Project Structure

*   `components/backend`: The backend API service.
*   `components/frontend`: The frontend web application.
*   `k8s`: Kubernetes manifests and Taskfiles for deployment.
*   `initial-setup`: Initial cluster setup scripts and configurations.
*   `tilt`: Tilt configurations for local development with live reloading.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.