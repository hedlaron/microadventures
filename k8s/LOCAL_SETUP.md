# Microadventures Local Setup Guide

This guide provides the complete steps to run the Microadventures application locally with HTTPS support.

## Quick Start (HTTPS Setup)

The following commands will set up the complete local environment with HTTPS certificates:

```bash
# 1. Set Docker credentials (required for private registry)
export DOCKER_USERNAME=your_username
export DOCKER_EMAIL=your_email@example.com
export DOCKER_PASSWORD=your_password

# 2. Deploy infrastructure and application
cd k8s
task full-stack-deploy

# 3. Set up HTTPS certificates
task setup-cert-manager
task setup-cluster-issuer-kind
task setup-certificates-kind  
task setup-https-ingress-kind

# 4. Access the application
# HTTPS: https://local-microadventures.aronhedl.com/
# HTTP:  http://local-microadventures.aronhedl.com/ (redirects to HTTPS)
```

## Step-by-Step Breakdown

### 1. Infrastructure Setup

```bash
# Deploy Traefik ingress controller
task setup-traefik

# Create secrets from GCP Secret Manager
task setup-kind-secrets

# Create PostgreSQL secrets
task setup-postgres-secret

# Create Docker registry credentials
task create-image-pull-secret
```

### 2. Application Deployment

```bash
# Deploy all application components
kluctl deploy -t kind

# Set up Traefik middleware
task setup-traefik-middleware
```

### 3. HTTPS Certificate Setup

```bash
# Install cert-manager for certificate management
task setup-cert-manager

# Create cluster issuers (self-signed for local development)
task setup-cluster-issuer-kind

# Create self-signed certificate for local domains
task setup-certificates-kind

# Set up HTTPS IngressRoutes and HTTP redirects
task setup-https-ingress-kind
```

## Manual HTTPS Setup Commands

If you prefer to run the HTTPS setup manually, here are the individual kubectl commands:

### Create Cluster Issuers
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-issuer
spec:
  selfSigned: {}
EOF
```

### Create Certificate
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: microadventures-selfsigned-cert
  namespace: microadventures
spec:
  secretName: microadventures-tls
  issuerRef:
    name: selfsigned-issuer
    kind: ClusterIssuer
  dnsNames:
    - localhost
    - local-microadventures.aronhedl.com
    - microadventures.aronhedl.com
EOF
```

### Create HTTPS IngressRoutes
```bash
kubectl apply -f - <<EOF
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: https-redirect
  namespace: microadventures
spec:
  redirectScheme:
    scheme: https
    permanent: true
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: frontend-https
  namespace: microadventures
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(\`local-microadventures.aronhedl.com\`) || Host(\`microadventures.aronhedl.com\`) || Host(\`localhost\`)
      kind: Rule
      services:
        - name: frontend
          port: 8080
  tls:
    secretName: microadventures-tls
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: frontend-http-redirect
  namespace: microadventures
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`local-microadventures.aronhedl.com\`) || Host(\`microadventures.aronhedl.com\`)
      kind: Rule
      services:
        - name: frontend
          port: 8080
      middlewares:
        - name: https-redirect
EOF
```

## Troubleshooting

### Check Status
```bash
# Check application pods
task status

# Check certificates
task check-certs

# Check IngressRoutes
kubectl get ingressroute -n microadventures

# Check Traefik
kubectl get pods -n traefik
kubectl get svc -n traefik
```

### View Logs
```bash
# Frontend logs
task logs:frontend

# Backend logs  
task logs:backend

# Certificate manager logs
kubectl logs -n cert-manager -l app.kubernetes.io/name=cert-manager
```

### Port Forwarding (Alternative Access)
```bash
# Frontend (port 3000)
task port-forward:frontend

# Backend (port 8000)
task port-forward:backend
```

## Available Tasks

Run `task --list` to see all available tasks. Key tasks include:

- `full-stack-deploy` - Complete deployment with infrastructure
- `setup-cert-manager` - Install certificate manager
- `setup-traefik` - Install Traefik ingress controller
- `status` - Check deployment status
- `security:scan` - View security scan results

## Notes

- **Self-signed certificates**: Your browser will show a security warning for the self-signed certificate. This is normal for local development.
- **DNS**: The domain `local-microadventures.aronhedl.com` should be configured in your DNS to point to the Kind cluster IP.
- **Docker credentials**: Required for pulling private images from Docker registry.

## URLs

Once setup is complete:

- **Main Application**: https://local-microadventures.aronhedl.com/
- **Backend API**: https://local-microadventures.aronhedl.com/api/
- **HTTP Access**: http://local-microadventures.aronhedl.com/ (redirects to HTTPS)
