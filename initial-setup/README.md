# 🚀 Initial Setup

This directory contains the necessary scripts and configurations to set up the development environment for the Microadventures project.

## ✨ Why These Tools?

- **Devbox**: Chosen to create a reproducible and isolated development environment using Nix. This ensures that all developers have the same versions of all tools, avoiding the "it works on my machine" problem.
- **Task**: A simple and powerful task runner that is used to automate common development tasks. It's a great alternative to Makefiles, with a simpler syntax and better cross-platform support.
- **Kind**: A tool for running local Kubernetes clusters using Docker container "nodes". It's perfect for local development and testing of Kubernetes applications.
- **GKE (Google Kubernetes Engine)**: A managed Kubernetes service from Google Cloud. It's used for production deployments of the application.

## 🛠️ Tech Stack

- **Devbox**: For isolated development environments.
- **Task**: For task automation.
- **Kind**: For local Kubernetes clusters.
- **GKE**: For production Kubernetes clusters.
- **gcloud CLI**: For interacting with Google Cloud.

## 🚀 Getting Started

### 1. Install Devbox

Follow the instructions on the [Devbox website](https://www.jetify.com/devbox/docs/installing_devbox/) to install Devbox on your system.

### 2. Initialize the Development Environment

```bash
devbox shell
```

This command will read the `devbox.json` file in the root of the project and install all the necessary tools and dependencies in an isolated environment. It will also activate the environment, so you can start using the tools immediately.

### 3. Set up a Local Kubernetes Cluster with Kind

```bash
task kind:setup
```

This command will:

1.  Generate a Kind cluster configuration file.
2.  Create a new Kind cluster.

### 4. (Optional) Set up a GKE Cluster

If you want to deploy the application to a production-like environment, you can create a GKE cluster.

**Note:** This will incur costs on your Google Cloud account.

```bash
task gcp:create-all
```

This command will:

1.  Initialize the gcloud CLI.
2.  Create a new GKE cluster.
3.  Create a new service account.
4.  Create a new PostgreSQL instance.
5.  Create the necessary secrets in GCP Secret Manager.

### 5. Deploy the Application

Once you have a Kubernetes cluster running (either with Kind or GKE), you can deploy the application using Kluctl.

```bash
cd ../k8s
task apply-all
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
