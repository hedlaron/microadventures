# PostgreSQL with GCP Secrets Integration

This directory contains the PostgreSQL deployment configuration that integrates with GCP Secret Manager for secure credential management.

## Prerequisites

1. **GCP Secrets**: The following secrets must be created in GCP Secret Manager:
   - `postgresql-user` - PostgreSQL username
   - `postgresql-password` - PostgreSQL password
   - `database-url` - Complete database connection string

2. **External Secrets Operator**: Must be installed and configured to access GCP Secret Manager

3. **GCP Secrets Deployed**: Run this first:
   ```bash
   task -d ../secrets-gcp deploy
   ```

## Quick Start

### Option 1: Complete Setup (Recommended)
```bash
# Install PostgreSQL and run initial migration
task setup-complete
```

### Option 2: Step-by-Step
```bash
# 1. Check prerequisites
task check-prerequisites

# 2. Install PostgreSQL with GCP secrets
task install-postgres

# 3. Run database migration
task apply-initial-db-migration-job
```

## Available Tasks

### Setup Tasks
- `check-prerequisites` - Verify all requirements are met
- `setup-complete` - Complete setup: Install PostgreSQL and run initial migration
- `install-postgres` - Deploy PostgreSQL using Helm with values from GCP secrets
- `verify-gcp-integration` - Verify that PostgreSQL is using GCP secrets correctly

### Database Migration Tasks
- `apply-initial-db-migration-job` - Run init.sql script against the DB using GCP secrets
- `reapply-db-migration-job` - Delete and reapply the database migration job
- `logs-migration-job` - View logs from the database migration job

### Management Tasks
- `reinstall-postgres` - Completely reinstall PostgreSQL (⚠️ **WARNING**: Deletes all data)
- `status-postgres` - Check PostgreSQL status

## How GCP Integration Works

1. **Secret Extraction**: Tasks extract PostgreSQL credentials from the `microadventures-gcp-secrets` Kubernetes secret
2. **Helm Values**: Credentials are passed to Helm as `--set` parameters during installation
3. **Migration Jobs**: Database migration jobs reference the GCP secrets directly via Kubernetes secret mounts

## Migration from Hardcoded Secrets

The old hardcoded values have been replaced:
- ❌ `--set auth.postgresPassword=microadventures` 
- ✅ `--set auth.postgresPassword="$POSTGRES_PASSWORD"` (from GCP)

- ❌ `kubectl apply -f Secret.postgresql.yaml`
- ✅ Uses `microadventures-gcp-secrets` directly

## Troubleshooting

### "GCP secrets not found" Error
```bash
# Deploy GCP secrets first
task -d ../secrets-gcp deploy
task -d ../secrets-gcp verify
```

### Check What Credentials Are Being Used
```bash
task verify-gcp-integration
```

### PostgreSQL Won't Start
```bash
# Check PostgreSQL pods and events
task status-postgres
kubectl describe pods -n postgres
```

### Migration Job Fails
```bash
# Check migration job logs
task logs-migration-job

# Reapply the migration job
task reapply-db-migration-job
```

## Security Benefits

- ✅ No hardcoded passwords in version control
- ✅ Centralized secret management through GCP
- ✅ Automatic secret rotation capability
- ✅ IAM-based access control
- ✅ Audit logging through GCP
