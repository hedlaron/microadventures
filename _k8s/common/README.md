# Kubernetes Common Resources

This directory contains common Kubernetes resources for the microadventures application.

## Structure

```
k8s/common/
├── HTTPS_SETUP.md              # Complete HTTPS setup guide
├── Taskfile.yaml               # Task automation for deployments
├── ClusterIssuer.yaml          # Certificate issuers (Let's Encrypt, self-signed)
├── Middleware.yaml             # Traefik middleware configurations
├── Namespace.yaml              # Application namespace
├── ConfigMap.yaml              # Application configuration
├── kind/                       # Kind cluster specific resources
│   ├── Certificate.selfsigned.yaml
│   └── IngressRoute.selfsigned.yaml
└── gke/                        # GKE cluster specific resources
    ├── Certificate.main.prod.yaml
    ├── Certificate.main.staging.yaml
    ├── IngressRoute.main.prod.yaml
    └── IngressRoute.main.redirect.yaml
```

## Usage

### For Kind (Local Development)
```bash
task setup-kind
```

### For GKE (Production)
```bash
task setup-gke
```

### For GKE (Staging)
```bash
task setup-gke-staging
```

## Key Files

- **ClusterIssuer.yaml**: Defines certificate issuers for all environments
- **kind/**: Self-signed certificates for local development
- **gke/**: Let's Encrypt certificates for production domains
- **HTTPS_SETUP.md**: Comprehensive setup guide

## Environment Separation

Resources are organized by environment:
- Common resources (namespace, issuers, middleware) are shared
- Environment-specific resources (certificates, ingress routes) are separated
- This prevents conflicts and allows for clean deployments

## Troubleshooting

Use the included Taskfile commands for troubleshooting:
- `task check-certs` - Check certificate status
- `task troubleshoot-webhook` - Debug cert-manager issues
- `task status` - Overall system status
