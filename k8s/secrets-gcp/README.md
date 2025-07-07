# GCP Secrets Management for Microadventures

This directory contains the configuration for managing secrets using Google Cloud Secret Manager with External Secrets Operator.

## Overview

The microadventures application now uses GCP Secret Manager to securely store and manage sensitive configuration data. The External Secrets Operator automatically syncs secrets from GCP Secret Manager into Kubernetes secrets.

## GCP Secrets Configuration

The following secrets are configured in GCP Secret Manager:

- `database-url` - Complete PostgreSQL connection string
- `jwt-secret-key` - JWT signing key for authentication
- `openai-api-key` - OpenAI API key for AI services
- `postgresql-user` - PostgreSQL username
- `postgresql-password` - PostgreSQL password

## Kubernetes Resources

### ClusterSecretStore
Configures the connection to GCP Secret Manager for the entire cluster.

### ExternalSecret
Defines which GCP secrets to sync and creates the `microadventures-gcp-secrets` Kubernetes secret.

### ServiceAccount
Service account with appropriate IAM permissions to access GCP Secret Manager.

## Migration from Local Secrets

The following local secret files have been deprecated and should not be used in production:

- `/k8s/common/Secret.yaml` - Contains hardcoded secrets
- `/k8s/backend/Secret.yaml` - Contains hardcoded secrets  
- `/k8s/postgresql/Secret.postgresql.yaml` - Contains hardcoded secrets

## Usage

Applications should reference secrets from the `microadventures-gcp-secrets` secret:

```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: microadventures-gcp-secrets
        key: DATABASE_URL
  - name: JWT_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: microadventures-gcp-secrets
        key: JWT_SECRET_KEY
```

## Prerequisites

1. External Secrets Operator must be installed in the cluster
2. Service account must have `secretmanager.secretAccessor` role
3. Workload Identity must be configured for the service account
4. All secrets must exist in GCP Secret Manager

## Deployment

You can deploy using either the Taskfile or the shell scripts:

### Using Taskfile (Recommended)
```bash
# Deploy everything
task deploy

# Verify deployment
task verify

# Get secret values (for debugging)
task get-secret-values
```

### Using Shell Scripts
```bash
# Deploy everything
./deploy.sh

# Verify deployment  
./verify.sh
```

### Manual Deployment
Apply the resources in this order:
1. `kubectl apply -f ClusterSecretStore.yaml`
2. `kubectl apply -f ServiceAccount.yaml` 
3. `kubectl apply -f ExternalSecret.yaml`

The External Secrets Operator will automatically create the `microadventures-gcp-secrets` Kubernetes secret from the GCP secrets.
