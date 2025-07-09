# HTTPS Setup for Microadventures

This document describes how to set up HTTPS for the microadventures application in different environments.

## Overview

The microadventures application supports HTTPS through:
- **Kind (Local Development)**: Self-signed certificates for local testing
- **GKE (Production)**: Let's Encrypt certificates for production domains

## Prerequisites

1. **cert-manager** must be installed in your cluster
2. **Traefik** must be installed and configured as the ingress controller
3. For GKE: Domain must be configured with proper DNS records

## Environment-Specific Setup

### Kind (Local Development)

For local development with Kind clusters, we use self-signed certificates since Let's Encrypt cannot validate localhost domains.

#### 1. Apply Common Resources

```bash
# Apply the namespace and cluster issuers
kubectl apply -f k8s/common/Namespace.yaml
kubectl apply -f k8s/common/ClusterIssuer.yaml
```

#### 2. Apply Kind-Specific Resources

```bash
# Apply self-signed certificate and ingress route
kubectl apply -f k8s/common/kind/Certificate.selfsigned.yaml
kubectl apply -f k8s/common/kind/IngressRoute.selfsigned.yaml
```

#### 3. Verify Setup

```bash
# Check certificate status
kubectl get certificate -n microadventures

# Check if certificate is ready
kubectl describe certificate microadventures-tls -n microadventures
```

#### 4. Access the Application

- **HTTP**: http://localhost:8080
- **HTTPS**: https://localhost:8443 (you'll need to accept the self-signed certificate)

### GKE (Production)

For production GKE clusters, we use Let's Encrypt to issue trusted certificates.

#### 1. Prerequisites

Ensure your domain is properly configured:
- DNS A record pointing to your GKE load balancer IP
- Domain should be accessible from the internet

#### 2. Apply Common Resources

```bash
# Apply the namespace and cluster issuers
kubectl apply -f k8s/common/Namespace.yaml
kubectl apply -f k8s/common/ClusterIssuer.yaml
```

#### 3. Apply GKE-Specific Resources

```bash
# Apply Let's Encrypt certificate and production ingress routes
kubectl apply -f k8s/common/gke/Certificate.main.prod.yaml
kubectl apply -f k8s/common/gke/IngressRoute.main.prod.yaml
kubectl apply -f k8s/common/gke/IngressRoute.main.redirect.yaml
```

#### 4. Verify Setup

```bash
# Check certificate status
kubectl get certificate -n microadventures

# Check certificate details
kubectl describe certificate microadventures-tls -n microadventures

# Check if Let's Encrypt challenge is working
kubectl get challenges -n microadventures
```

#### 5. Access the Application

- **HTTP**: Automatically redirects to HTTPS
- **HTTPS**: https://your-domain.com (with trusted certificate)

## ClusterIssuer Configuration

The system uses three ClusterIssuers defined in `k8s/common/ClusterIssuer.yaml`:

1. **letsencrypt-staging**: For testing Let's Encrypt integration
2. **letsencrypt-prod**: For production Let's Encrypt certificates
3. **selfsigned-issuer**: For local development with self-signed certificates

## Certificate Configuration

### Kind (Self-Signed)

- **File**: `k8s/common/kind/Certificate.selfsigned.yaml`
- **Issuer**: `selfsigned-issuer`
- **Domains**: `localhost`
- **Secret**: `microadventures-tls`

### GKE (Let's Encrypt)

- **File**: `k8s/common/gke/Certificate.main.prod.yaml`
- **Issuer**: `letsencrypt-prod`
- **Domains**: `microadventures.aronhedl.com`
- **Secret**: `microadventures-tls`

## IngressRoute Configuration

### Kind

- **File**: `k8s/common/kind/IngressRoute.selfsigned.yaml`
- **Ports**: 8080 (HTTP), 8443 (HTTPS)
- **Host**: `localhost`

### GKE

- **Main Route**: `k8s/common/gke/IngressRoute.main.prod.yaml`
  - Handles HTTPS traffic on port 443
  - Uses production TLS certificate
  
- **Redirect Route**: `k8s/common/gke/IngressRoute.main.redirect.yaml`
  - Redirects HTTP to HTTPS
  - Excludes ACME challenge paths

## Troubleshooting

### Common Issues

1. **Certificate Not Ready**
   ```bash
   kubectl describe certificate microadventures-tls -n microadventures
   ```

2. **ACME Challenge Failing**
   ```bash
   kubectl get challenges -n microadventures
   kubectl describe challenge <challenge-name> -n microadventures
   ```

3. **DNS Issues**
   ```bash
   nslookup your-domain.com
   ```

### Useful Tasks

The project includes Taskfile tasks for troubleshooting:

- `task check-certs`: Check certificate status
- `task troubleshoot-webhook`: Debug cert-manager webhook

### Using Taskfile

The project includes Taskfile tasks for common operations:

```bash
# Apply all common resources
task k8s:common:apply

# Check certificate status
task k8s:common:check-certs

# Apply Kind-specific resources
task k8s:common:apply-kind

# Apply GKE-specific resources
task k8s:common:apply-gke
```

## Best Practices

1. **Development**: Always use self-signed certificates for local Kind clusters
2. **Staging**: Use `letsencrypt-staging` for testing before production
3. **Production**: Only use `letsencrypt-prod` for live domains
4. **DNS**: Ensure DNS records are properly configured before applying certificates
5. **Rate Limits**: Be aware of Let's Encrypt rate limits in production

## Security Considerations

1. **Certificate Rotation**: Let's Encrypt certificates auto-renew every 90 days
2. **Secret Management**: TLS secrets are stored in Kubernetes secrets
3. **Access Control**: Ensure proper RBAC is configured for cert-manager
4. **Monitoring**: Monitor certificate expiration and renewal

## Environment Variables

No environment variables are required for HTTPS setup. Configuration is handled through Kubernetes manifests.

## File Structure

```
k8s/common/
├── ClusterIssuer.yaml          # All cluster issuers
├── Middleware.yaml             # Traefik middleware
├── Namespace.yaml              # Namespace definition
├── Taskfile.yaml              # Task automation
├── kind/                      # Kind-specific manifests
│   ├── Certificate.selfsigned.yaml
│   └── IngressRoute.selfsigned.yaml
└── gke/                       # GKE-specific manifests
    ├── Certificate.main.prod.yaml
    ├── Certificate.main.staging.yaml
    ├── IngressRoute.main.prod.yaml
    └── IngressRoute.main.redirect.yaml
```

This structure keeps environment-specific configurations separate and organized.
