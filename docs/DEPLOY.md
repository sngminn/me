# 🚀 Deployment Guide (Home Server)

## 1. Prerequisites
- **Docker** installed on your home server.
- **SSH Access** to your home server.

## 2. GitHub Secrets Setup
Go to your repository settings -> **Secrets and variables** -> **Actions** and add the following secrets:

- `HOST`: Your server's public IP or domain (e.g., `123.45.67.89`).
- `USERNAME`: SSH username (e.g., `ubuntu`).
- `KEY`: Your private SSH key content (Open `~/.ssh/id_rsa` and copy everything).

## 3. Enable Deployment
1. Open `.github/workflows/ci-cd.yml`.
2. Uncomment the `deploy` job section at the bottom.
3. Commit and push to `main`.

## 4. Manual Testing (Local)
To test the Docker build locally:

```bash
# Build
docker build -t me .

# Run
docker run -p 3000:3000 me
```

Visit `http://localhost:3000`.
