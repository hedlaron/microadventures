# Microadventures Kluctl Deployment

This directory contains the Kluctl deployment configuration for the Microadventures application.

## Prerequisites

- Kluctl CLI installed (via devbox)
- Access to the target Kubernetes cluster
- Docker image pull credentials

## Structure

- `deployment.yaml`: Main deployment configuration
- `components/`: Directory containing individual deployment components
  - `common/`: Common resources like namespace, middleware, cert-manager
  - `backend/`: Backend application
  - `frontend/`: Frontend application
  - `postgresql/`: Database and migration job
  - `trivy-operator/`: Security scanning for containers and workloads
- `values/`: Environment-specific values
  - `kind.yaml`: Values for local Kind cluster
  - `gcp.yaml`: Values for GCP deployment

## Environment Setup

### Kind Environment

1. Set up your Kind cluster:
   ```bash
   task kind:create
   ```

2. Sync secrets for Kind:
   ```bash
   cd k8s/secrets-kind
   task setup-kind-secrets
   ```

3. Set up image pull secrets:
   ```bash
   cd k8s
   DOCKER_USERNAME=$DOCKER_USERNAME DOCKER_EMAIL=$DOCKER_EMAIL DOCKER_PASSWORD=$DOCKER_PASSWORD task registry:create-image-pull-secret
   ```

### GCP Environment

1. Ensure you are connected to your GCP cluster:
   ```bash
   gcloud container clusters get-credentials [CLUSTER_NAME] --zone [ZONE] --project [PROJECT_ID]
   ```

2. Create Docker registry pull secret (if using private images):
   ```bash
   kubectl create secret -n microadventures docker-registry dockerconfigjson \
     --docker-email=your-email@example.com \
     --docker-username=your-username \
     --docker-password=your-password \
     --docker-server=https://index.docker.io/v1/
   ```

3. Update the cluster context in `.kluctl.yaml` to match your GCP cluster context.

## Deployment Commands

1. Deploy to Kind:
   ```bash
   kluctl deploy -t kind
   ```

2. Deploy to GCP:
   ```bash
   kluctl deploy -t gcp
   ```

3. To render the manifests without deploying:
   ```bash
   kluctl render -t [kind|gcp]
   ```

4. To diff before deploying:
   ```bash
   kluctl diff -t [kind|gcp]
   ```

## Utility Commands

For day-to-day operations such as checking logs, port-forwarding, and other utilities, we've created a set of tasks that can be used with the Task tool. See [TASKS.md](TASKS.md) for details.

Example usage:
```bash
# View backend logs
task -t tasks.yaml logs:backend

# Port-forward the frontend
task -t tasks.yaml port-frontend

# Check security scan results
task -t tasks.yaml security:scan
```

## Environment-Specific Configuration

The configuration for each environment is managed in the `values/` directory:

### Kind (Local Development)
- `values/kind.yaml`: 
  - Uses self-signed certificates
  - Single replicas
  - Uses "kind" as the secret source
  - Development environment settings
  - Uses `localhost` or local domain names

### GCP (Production)
- `values/gcp.yaml`:
  - Uses Let's Encrypt certificates
  - Multiple replicas for high availability
  - Uses "gcp" as the secret source
  - Production environment settings
  - Uses your production domain name

## Differences Between Environments

The main differences between Kind and GCP environments are:

1. **Certificates**: Kind uses self-signed certificates, while GCP uses Let's Encrypt
2. **Secrets**: Kind uses local secrets, while GCP uses secrets from GCP Secret Manager
3. **Resources**: GCP uses more replicas and resources than the development environment
4. **Domain**: Different domain names for development and production

## Security Scanning with Trivy Operator

The deployment includes Trivy Operator for automatic security scanning:

- Scans container images for vulnerabilities
- Enforces security policies with custom ConfigAuditPolicy
- Identifies exposed secrets and misconfigurations
- Results available in Kubernetes CRDs (VulnerabilityReport, ConfigAuditReport)

To view scan results:
```bash
kubectl get vulnerabilityreport -A
kubectl get configauditreport -A
```

## Rolling Back

To roll back to a previous deployment:

```bash
kluctl deploy -t [kind|gcp] --target-commit PREVIOUS_COMMIT_ID
```
