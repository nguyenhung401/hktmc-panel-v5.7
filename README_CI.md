
# CI/CD Add-ons for hoskt-panel-v9

## Workflows
- `.github/workflows/build-web-only.yml` → Build & upload **web-only** artifact on each push.
- `.github/workflows/deploy-vps.yml` → **Manual** deploy to a VPS over SSH.

## Secrets (in GitHub → Settings → Secrets and variables → Actions)
- `VPS_HOST` — VPS IP/host
- `VPS_USER` — SSH username (e.g., root)
- `VPS_SSH_KEY` — private key (PEM content)
- `VPS_PORT` — optional, defaults to 22

## Deploy modes
- `ip` — sets up services and exposes `http://IP:8080` & `http://IP:3200`
- `domain` — also enables HTTPS via **Caddy** (default) or **NGINX+Certbot** using inputs `panel_domain` and `api_domain`.
