# Utility Tasks for Kluctl Deployment

This directory contains utility tasks to help with managing your Kluctl deployment.

## Using the Tasks

We've created a companion `tasks.yaml` file that provides useful utility commands for managing your Kluctl deployments. You can use these commands with `task`:

```bash
# Install Task if you don't have it already
go install github.com/go-task/task/v3/cmd/task@latest

# Run a command
task -t tasks.yaml [command]
```

## Available Commands

### Deployment Commands

- `task -t tasks.yaml deploy:kind` - Deploy to local Kind cluster
- `task -t tasks.yaml deploy:gcp` - Deploy to GCP cluster
- `task -t tasks.yaml diff:kind` - Show diff for kind deployment
- `task -t tasks.yaml diff:gcp` - Show diff for GCP deployment
- `task -t tasks.yaml render:kind` - Render manifests for kind deployment
- `task -t tasks.yaml render:gcp` - Render manifests for GCP deployment
- `task -t tasks.yaml validate` - Validate the Kluctl configuration

### Status Commands

- `task -t tasks.yaml status` - Check status of all deployments
- `task -t tasks.yaml describe:backend` - Describe backend deployment
- `task -t tasks.yaml describe:frontend` - Describe frontend deployment

### Log Commands

- `task -t tasks.yaml logs:backend` - View backend logs
- `task -t tasks.yaml logs:frontend` - View frontend logs
- `task -t tasks.yaml logs:postgres` - View PostgreSQL logs

### Port-Forwarding

- `task -t tasks.yaml port-backend` - Port forward backend to localhost:8000
- `task -t tasks.yaml port-frontend` - Port forward frontend to localhost:3000
- `task -t tasks.yaml port-postgres` - Port forward PostgreSQL to localhost:5432

### Deployment Management

- `task -t tasks.yaml restart:backend` - Restart backend deployment
- `task -t tasks.yaml restart:frontend` - Restart frontend deployment
- `task -t tasks.yaml create-pull-secret` - Create Docker image pull secret

### Security

- `task -t tasks.yaml security:scan` - View Trivy security scan results
- `task -t tasks.yaml check-certs` - Check certificate status

## Comparison to Previous Workflow

These tasks provide the same functionality as the previous `k8s` folder Taskfiles, but are designed to work alongside the new Kluctl deployment methodology. The main difference is:

1. Previous workflow: `task backend:deploy` - Directly applied individual Kubernetes manifests
2. New workflow: `task -t tasks.yaml deploy:kind` - Deploys everything through Kluctl with proper templating

The new workflow provides better consistency, environment awareness, and dependency management while these utility tasks still give you the convenient commands for day-to-day operations.

## Best Practices

1. For deployment, always use the Kluctl commands (`deploy`, `diff`, etc.)
2. Use these utility tasks for operational needs like checking logs, port-forwarding, etc.
3. When creating new components, add them to the Kluctl deployment structure rather than using kubectl directly
