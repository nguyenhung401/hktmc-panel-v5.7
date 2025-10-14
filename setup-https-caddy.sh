#!/bin/bash
set -e
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: sudo bash $0 <PANEL_DOMAIN> <API_DOMAIN>"; exit 1; fi
PANEL_DOMAIN="$1"; API_DOMAIN="$2"
sudo apt update -y
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /usr/share/keyrings/caddy-stable-archive-keyring.gpg >/dev/null
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian/debian.repo' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update -y && sudo apt install -y caddy
sudo bash -c "cat >/etc/caddy/Caddyfile" <<EOF
${PANEL_DOMAIN} { encode gzip zstd; reverse_proxy 127.0.0.1:8080 }
${API_DOMAIN}   { encode gzip zstd; reverse_proxy 127.0.0.1:3200 }
EOF
if command -v ufw >/dev/null 2>&1; then sudo ufw allow 80/tcp || true; sudo ufw allow 443/tcp || true; fi
sudo systemctl enable --now caddy; sudo systemctl reload caddy
echo "Caddy ready for ${PANEL_DOMAIN} and ${API_DOMAIN}"
