# Kind Cluster Setup Guide for Microadventures

This guide outlines the steps to set up and run the Microadventures application on a local Kind (Kubernetes in Docker) cluster, including manual handling of GCP secrets and a load balancer for external access.

## Prerequisites

Ensure you have the following tools installed and configured:

*   **Docker:** Required for Kind to run Kubernetes nodes as containers.
*   **Kind:** Kubernetes in Docker.
    *   Installation: `go install sigs.k8s.io/kind@v0.23.0` (or your preferred method)
*   **kubectl:** Kubernetes command-line tool.
*   **Helm:** Kubernetes package manager.
*   **gcloud CLI:** Google Cloud SDK, authenticated to your GCP project with access to Secret Manager.
    *   Authenticate: `gcloud auth application-default login`
*   **Task (Taskfile runner):** Used to automate common commands.
    *   Installation: `go install github.com/go-task/task/v3/cmd/task@latest` (or your preferred method)

## Setup Steps

Follow these steps in order to get your Kind cluster running with the Microadventures application.

### 1. Create the Kind Cluster

Navigate to the `initial-setup` directory and use its Taskfile to create the Kind cluster.

```bash
cd initial-setup
task kind:01-generate-config
task kind:02-create-cluster
```

### 2. Set up Cloud Provider Kind (Load Balancer)

This step enables LoadBalancer services in your Kind cluster, allowing external access to your applications.

```bash
task kind:03-run-cloud-provider-kind
```

### 3. Set up GCP Secrets (Manual Approach)

Since the External Secrets Operator webhook was encountering issues, we are using a manual approach to provision secrets. This involves retrieving secrets from GCP Secret Manager and creating a Kubernetes `Secret` object directly.

Navigate to the `k8s/secrets-kind` directory and run the setup task:

```bash
cd ../k8s/secrets-kind
task setup-kind-secrets
```

This task will:
*   Ensure the `microadventures` namespace exists.
*   Retrieve `database-url`, `jwt-secret-key`, `openai-api-key`, `postgresql-user`, and `postgresql-password` from your GCP Secret Manager.
*   Create/update a Kubernetes `Secret` named `microadventures-gcp-secrets` in the `microadventures` namespace with these values.

### 4. Deploy All Applications

Navigate to the `k8s` directory and use its main Taskfile to deploy PostgreSQL, the database migration job, Traefik, and your backend and frontend applications.

```bash
task apply-all
```

### 5. Create Docker Image Pull Secret (if needed)

If your application images are in a private Docker registry (e.g., Docker Hub), you will likely encounter `ImagePullBackOff` errors. You need to create an image pull secret.

**Note:** If you already created this manually, you can skip this step.

```bash
# Set these values as environment variables
DOCKER_USERNAME=$DOCKER_USERNAME DOCKER_EMAIL=$DOCKER_EMAIL DOCKER_PASSWORD=$DOCKER_PASSWORD task backend:create-image-pull-secret
```

### 6. Restart Backend Deployment

After creating the image pull secret, restart the backend deployment to ensure new pods can pull the images.

```bash
task backend:restart-backend
```

### 7. Verify Deployment

Check the status of your pods to ensure everything is running:

```bash
kubectl get pods -n microadventures
kubectl get pods -n postgres
```

You should see all pods in a `Running` or `Completed` state.

### 8. Access Applications via Cloudflare DNS

Your applications are exposed via Traefik IngressRoutes using the hostnames `microadventures.aronhedl.com` and `local-microadventures.aronhedl.com`.

Since you are using Cloudflare DNS, ensure that these hostnames are configured to point to the IP address of your Kind cluster's ingress controller.

To get the IP address of your Kind control plane node (which hosts the ingress controller):

```bash
docker inspect -f '{{ .NetworkSettings.Networks.kind.IPAddress }}' kind-control-plane
```

You should configure your Cloudflare DNS records (A records) for `microadventures.aronhedl.com` and `local-microadventures.aronhedl.com` to point to the IP address obtained from the command above.

Once DNS propagates, you should be able to access your applications through these hostnames.

---

**Important Considerations:**

*   **Manual Secret Sync:** Remember that the GCP secrets are manually synced. If your secrets in GCP Secret Manager change, you will need to re-run `task setup-kind-secrets` from `k8s/secrets-kind` and then restart any affected deployments (e.g., `task backend:restart-backend`).
*   **Kind Cluster Lifecycle:** If you delete and recreate your Kind cluster, you will need to repeat all the setup steps from the beginning.
