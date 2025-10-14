# Hoskt Panel v9.0.2 — Full All UI (Green Glass)

**Tiếng Việt · English below**

## 🚀 Cách cài nhanh (Ubuntu 20.04/22.04)
```bash
unzip panel-v9.0.2-full-all.zip
cd panel-v9.0.2-full-all
sudo chmod +x setup-smart.sh
sudo ./setup-smart.sh
```
Script sẽ hỏi bạn chọn **IP** hoặc **Domain**, tự mở **UFW**, tạo **systemd service** (tự khởi động), và nếu chọn domain sẽ tự cài **HTTPS** (Caddy hoặc NGINX + Let’s Encrypt), đồng thời sửa `BACKEND_URL` trong UI.

Sau khi cài:
- UI: `http://<IP_VPS>:8080` hoặc `https://panel.domain`
- API: `http://<IP_VPS>:3200` hoặc `https://api.domain`
- Logs: `journalctl -u panel-backend -f` · `journalctl -u panel-frontend -f`
- SMTP: sửa `/etc/panel.env` rồi `sudo systemctl restart panel-backend`

---

## English – Quick Install
```bash
unzip panel-v9.0.2-full-all.zip
cd panel-v9.0.2-full-all
sudo chmod +x setup-smart.sh
sudo ./setup-smart.sh
```
The script asks **IP** or **Domain**, opens **UFW**, creates **systemd services** (auto-start), and if Domain it provisions **HTTPS** (Caddy or NGINX+Certbot) and patches the UI `BACKEND_URL` automatically.

After install:
- UI: `http://<VPS_IP>:8080` or `https://panel.domain`
- API: `http://<VPS_IP>:3200` or `https://api.domain`
- Logs: `journalctl -u panel-backend -f` · `journalctl -u panel-frontend -f`
- SMTP: edit `/etc/panel.env` then `sudo systemctl restart panel-backend`
