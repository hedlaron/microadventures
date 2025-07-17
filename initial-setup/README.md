# Installation and Setup

## Dependencies

### Docker Desktop

### Devbox

Dependencies are defined in the `devbox.json` and `devbox.lock` files in the root directory.

https://www.jetify.com/devbox/docs/installing_devbox/

After installation run:

```
devbox shell
```

Use Nix package manager to install a copy of all of the required software in an isolated environment.

### Aliases

Create the following

```
k=kubectl
t=task
tl='task --list-all'
```

### Autocomplete:

- kubectl: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_completion/
- task: https://taskfile.dev/installation/#setup-completions


### KinD

For local development create the cluster with:

```
devbox shell
task kind:01-generate-config
task kind:02-create-cluster
```

### Google Kubernetes Engine (GKE)

90-day, $300 free trial for new users: https://cloud.google.com/free

To create a cluster run:

```
devbox shell
gcp:01-init-cli
gcp:07-create-all
gcp:08-connect-to-cluster
```

To destroy the cluster run:

```
gcp:09-clean-up
```
