#!/bin/bash
set -e
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: sudo bash $0 <PANEL_DOMAIN> <API_DOMAIN>"; exit 1; fi
PANEL_DOMAIN="$1"; API_DOMAIN="$2"
sudo apt update -y && sudo apt install -y nginx certbot python3-certbot-nginx
sudo bash -c "cat >/etc/nginx/sites-available/panel.conf" <<NGX
server { listen 80; server_name ${PANEL_DOMAIN};
  location / { proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; proxy_pass http://127.0.0.1:8080; } }
NGX
sudo bash -c "cat >/etc/nginx/sites-available/api.conf" <<NGX
server { listen 80; server_name ${API_DOMAIN};
  location / { proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; proxy_pass http://127.0.0.1:3200; } }
NGX
sudo ln -sf /etc/nginx/sites-available/panel.conf /etc/nginx/sites-enabled/panel.conf
sudo ln -sf /etc/nginx/sites-available/api.conf /etc/nginx/sites-enabled/api.conf
sudo nginx -t && sudo systemctl enable --now nginx
sudo certbot --nginx -d "${PANEL_DOMAIN}" --non-interactive --agree-tos -m admin@"${PANEL_DOMAIN}" --redirect
sudo certbot --nginx -d "${API_DOMAIN}"   --non-interactive --agree-tos -m admin@"${API_DOMAIN}" --redirect
if command -v ufw >/dev/null 2>&1; then sudo ufw allow 80/tcp || true; sudo ufw allow 443/tcp || true; fi
echo "NGINX + Certbot ready for ${PANEL_DOMAIN} and ${API_DOMAIN}"
