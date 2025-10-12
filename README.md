# hoskt-panel-v9 — Full All UI (v9.0.2) · Green Glass

**Tiếng Việt · English below**

## 🚀 Cài nhanh (Ubuntu 20.04/22.04)
```bash
sudo apt update -y && sudo apt install -y unzip
unzip panel-v9.0.2-full-all.zip
cd panel-v9.0.2-full-all
sudo chmod +x setup-smart.sh
sudo ./setup-smart.sh
```
- Chọn **IP** hoặc **Domain** (HTTPS tự động: Caddy hoặc NGINX+Certbot)
- Tự mở **UFW**, tạo **systemd services** (auto-start), auto sửa `BACKEND_URL` trong UI.

## 📦 Cấu trúc
- `frontend/` — UI web đầy đủ (Charts, Network, Player, Plugins, Modpacks, Worlds, Files, Trashbin, Egg, Backup, SMTP, 2FA, Users/Roles, RCON, Splitter)
- `server/` — Express API (port 3200) + SMTP (nodemailer) + stub routes
- `setup-smart.sh` — cài đặt thông minh (IP/Domain)
- `setup-https-caddy.sh`, `setup-https-nginx.sh`
- `.github/workflows/` — CI build web-only + deploy SSH lên VPS
- `scripts/ci-ip-deploy.sh` — script deploy non-interactive (IP mode)

## ✉️ SMTP
Sửa `/etc/panel.env`:
```
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_SECURE=false
SMTP_FROM="Hoskt Panel <noreply@example.com>"
```
Rồi chạy `sudo systemctl restart panel-backend`.

---

## English

### 🚀 Quick Start (Ubuntu 20.04/22.04)
```bash
sudo apt update -y && sudo apt install -y unzip
unzip panel-v9.0.2-full-all.zip
cd panel-v9.0.2-full-all
sudo chmod +x setup-smart.sh
sudo ./setup-smart.sh
```
Pick **IP** or **Domain**; the installer will handle **UFW**, **systemd**, **HTTPS** (Caddy/NGINX), and patch the UI `BACKEND_URL`.

### 📦 Structure
- `frontend/`, `server/`, `setup-smart.sh`, `setup-https-*`
- `.github/workflows/` → build web-only artifact & deploy to VPS via SSH
- `scripts/ci-ip-deploy.sh` → IP-mode deploy script

### SMTP
Edit `/etc/panel.env` (same as above) then restart backend.

---

### CI/CD (GitHub)
Set repo **Actions Secrets**:
- `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT` (optional)

Workflows:
- **Build Web-only Artifact** — runs on push
- **Deploy to VPS (SSH)** — manual dispatch; `mode=ip` or `mode=domain` (+ `panel_domain`, `api_domain`, `proxy`)
