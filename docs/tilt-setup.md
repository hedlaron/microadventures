# Tilt Setup Guide for Microadventures

This guide outlines how to use Tilt for local development of the Microadventures application. Tilt provides a live-reloading development environment for Kubernetes applications.

## Prerequisites

Ensure you have the following tools installed and configured:

*   **Tilt:** A toolkit for local Kubernetes development.
    *   Installation: Follow the instructions on the [Tilt website](https://tilt.dev/docs/install/).
*   **Docker:** Required for Kind to run Kubernetes nodes as containers.
*   **Kind:** Kubernetes in Docker.
    *   Installation: `go install sigs.k8s.io/kind@v0.23.0` (or your preferred method)
*   **kubectl:** Kubernetes command-line tool.
*   **gcloud CLI:** Google Cloud SDK, authenticated to your GCP project with access to Secret Manager.
    *   Authenticate: `gcloud auth application-default login`
*   **Task (Taskfile runner):** Used to automate common commands.
    *   Installation: `go install github.com/go-task/task/v3/cmd/task@latest` (or your preferred method)

## Setup Steps

Follow these steps to get your Microadventures application running with Tilt.

### 1. Create the Kind Cluster

If you don't have a running Kind cluster, create one using the `initial-setup` Taskfile:

```bash
cd initial-setup
task kind:01-generate-config
task kind:02-create-cluster
```

### 2. Set up Cloud Provider Kind (Load Balancer)

This step enables LoadBalancer services in your Kind cluster, allowing external access to your applications.

```bash
cd initial-setup
task kind:03-run-cloud-provider-kind
```

### 3. Set up GCP Secrets (Manual Approach)

Since the External Secrets Operator webhook was encountering issues, we are using a manual approach to provision secrets. This involves retrieving secrets from GCP Secret Manager and creating a Kubernetes `Secret` object directly.

Navigate to the `k8s/secrets-kind` directory and run the setup task:

```bash
cd k8s/secrets-kind
task setup-kind-secrets
```

This task will:
*   Ensure the `microadventures` namespace exists.
*   Retrieve `database-url`, `jwt-secret-key`, `openai-api-key`, `postgresql-user`, and `postgresql-password` from your GCP Secret Manager.
*   Create/update a Kubernetes `Secret` named `microadventures-gcp-secrets` in the `microadventures` namespace with these values.

### 4. Start Tilt

Navigate to the `tilt` directory and start Tilt. This will deploy your application to the Kind cluster and enable live reloading.

```bash
cd tilt
tilt up
```

Tilt will open a dashboard in your browser, showing the status of your services. It will automatically build and deploy changes as you modify your code.

### 5. Access Applications via Cloudflare DNS

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

*   **Manual Secret Sync:** Remember that the GCP secrets are manually synced. If your secrets in GCP Secret Manager change, you will need to re-run `task setup-kind-secrets` from `k8s/secrets-kind` and then restart any affected deployments (e.g., by restarting Tilt).
*   **Tilt Dashboard:** The Tilt dashboard provides a centralized view of your application's status, logs, and resources. You can access it in your browser after running `tilt up`.
*   **Stopping Tilt:** To stop Tilt and remove the deployed resources from your cluster, press `Ctrl+C` in the terminal where Tilt is running, or run `tilt down` in the `tilt` directory.
