# GCP Deployment Guide for Microadventures

This guide outlines the steps to deploy the Microadventures application to a Google Kubernetes Engine (GKE) cluster on Google Cloud Platform (GCP).

## Prerequisites

Ensure you have the following tools installed and configured:

*   **gcloud CLI:** Google Cloud SDK, authenticated to your GCP project.
    *   Authenticate: `gcloud auth login`
    *   Set project: `gcloud config set project YOUR_GCP_PROJECT_ID`
*   **kubectl:** Kubernetes command-line tool.
*   **Helm:** Kubernetes package manager.
*   **Task (Taskfile runner):** Used to automate common commands.
    *   Installation: `go install github.com/go-task/task/v3/cmd/task@latest` (or your preferred method)

## Setup Steps

Follow these steps to deploy your Microadventures application to GCP.

### 1. GCP Project Setup

Navigate to the `initial-setup` directory. This Taskfile contains tasks to set up your GCP project, including enabling necessary APIs, creating a VPC, subnet, and a GKE cluster.

```bash
cd initial-setup
```

**Important:** Before proceeding, ensure you have a billing account set up in your GCP console.

Run the following tasks to set up your GCP environment and create the GKE cluster:

```bash
task gcp:01-init-cli
task gcp:02-enable-apis
task gcp:03-set-region-and-zone
task gcp:04-create-vpc
task gcp:05-create-subnet
task gcp:06-create-cluster
```

Alternatively, you can run the `gcp:07-create-all` task to execute all the above steps in sequence:

```bash
task gcp:07-create-all
```

### 2. Connect to the GKE Cluster

After the GKE cluster is created, connect `kubectl` to it:

```bash
cd initial-setup
task gcp:08-connect-to-cluster
```

### 3. Install External Secrets Operator

For secure secret management in GKE, we will use the External Secrets Operator to sync secrets from GCP Secret Manager to Kubernetes secrets. Navigate to the `k8s/secrets-gcp` directory.

```bash
cd k8s/secrets-gcp
```

This directory should contain a `Taskfile.yaml` and Kubernetes manifests for setting up External Secrets. Follow the instructions within that `Taskfile.yaml` (e.g., `task deploy`) to install the External Secrets Operator and configure it to pull secrets from your GCP Secret Manager.

### 4. Deploy All Applications

Once the External Secrets Operator is configured and syncing your secrets, navigate to the `k8s` directory and use its main Taskfile to deploy PostgreSQL, the database migration job, Traefik, and your backend and frontend applications.

```bash
cd k8s
task apply-all
```

### 5. Create Docker Image Pull Secret (if needed)

If your application images are in a private Docker registry (e.g., Docker Hub), you will likely encounter `ImagePullBackOff` errors. You need to create an image pull secret.

```bash
cd k8s
# Replace with your Docker credentials
DOCKER_USERNAME=your_username DOCKER_EMAIL=your_email DOCKER_PASSWORD=your_password task backend:create-image-pull-secret
```

### 6. Restart Backend Deployment

After creating the image pull secret, restart the backend deployment to ensure new pods can pull the images.

```bash
cd k8s
task backend:restart-backend
```

### 7. Verify Deployment

Check the status of your pods to ensure everything is running:

```bash
kubectl get pods -n microadventures
kubectl get pods -n postgres
```

You should see all pods in a `Running` or `Completed` state.

### 8. Access Applications

To access your applications, you will typically use the external IP address or hostname provided by your GKE Ingress/LoadBalancer. You can find this by checking your Traefik Ingress service:

```bash
kubectl get svc -n traefik
```

Look for the `EXTERNAL-IP` of the Traefik service. You may also need to configure DNS records to point your desired hostnames (e.g., `microadventures.aronhedl.com`) to this external IP.

## Cleanup

To delete all GCP resources created by this setup, navigate to the `initial-setup` directory and run the cleanup task:

```bash
cd initial-setup
task gcp:09-clean-up
```

---

**Important Considerations:**

*   **Secret Management:** For GCP deployments, the External Secrets Operator is the recommended way to manage secrets from GCP Secret Manager. Ensure its configuration in `k8s/secrets-gcp` is correct for your environment.
*   **Cost:** Running a GKE cluster incurs costs. Remember to clean up resources when you are finished to avoid unnecessary charges.
