#!/bin/bash
# Hoskt Panel v9.0.2 – Smart Installer (IP or Domain mode)
set -e
TARGET="/var/www/panel-v9.0.2"; BACKEND_PORT=3200; FRONTEND_PORT=8080

echo ">>> Updating system..."
sudo apt update -y && sudo apt install -y curl git unzip python3

if ! command -v node >/dev/null 2>&1; then
  echo ">>> Installing Node.js 18.x..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
fi

echo ">>> Copy project to $TARGET"
sudo mkdir -p "$TARGET"; sudo cp -r ./* "$TARGET"/

echo ">>> Installing backend deps..."
cd "$TARGET/server"; [ ! -f package.json ] && npm init -y >/dev/null 2>&1 || true
npm install express cors nodemailer >/dev/null 2>&1

if [ ! -f /etc/panel.env ]; then
sudo bash -c 'cat >/etc/panel.env <<ENVV
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_SECURE=false
SMTP_FROM="Hoskt Panel <noreply@example.com>"
ENVV'
fi

echo ">>> Creating systemd services..."
sudo bash -c "cat >/etc/systemd/system/panel-backend.service" <<EOF
[Unit]
Description=Hoskt Panel Backend (Express) - v9.0.2
After=network.target
[Service]
Type=simple
User=root
WorkingDirectory=$TARGET/server
EnvironmentFile=/etc/panel.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
sudo bash -c "cat >/etc/systemd/system/panel-frontend.service" <<EOF
[Unit]
Description=Hoskt Panel Frontend (Static) - v9.0.2
After=network.target
[Service]
Type=simple
User=root
WorkingDirectory=$TARGET/frontend
ExecStart=/usr/bin/python3 -m http.server $FRONTEND_PORT
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF

if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow $BACKEND_PORT/tcp || true
  sudo ufw allow $FRONTEND_PORT/tcp || true
fi

SV_IP=$(hostname -I | awk '{print $1}')
patch_backend_url () {
  local url="$1"; local appjs="$TARGET/frontend/js/app.js"
  if [ -f "$appjs" ]; then
    if grep -q "const BACKEND_URL" "$appjs"; then
      sudo sed -i "s|const BACKEND_URL *= *['\"][^'\"]*['\"]|const BACKEND_URL = '$url'|g" "$appjs"
    else
      echo "const BACKEND_URL = '$url';" | sudo tee -a "$appjs" >/dev/null
    fi
    echo ">>> FRONTEND BACKEND_URL -> $url"
  fi
}

echo
echo "=== Access Mode ==="
echo "1) Use VPS IP (HTTP :$FRONTEND_PORT / :$BACKEND_PORT)"
echo "2) Use Domain (HTTPS via Caddy or NGINX+Certbot)"
read -p "Select [1/2]: " MODE

if [ "$MODE" = "1" ]; then
  patch_backend_url "http://$SV_IP:$BACKEND_PORT"
  sudo systemctl daemon-reload
  sudo systemctl enable --now panel-backend panel-frontend
  echo "UI:  http://$SV_IP:$FRONTEND_PORT"; echo "API: http://$SV_IP:$BACKEND_PORT"
  exit 0
fi

if [ "$MODE" = "2" ]; then
  read -p "PANEL_DOMAIN (e.g. panel.example.com): " PANEL_DOMAIN
  read -p "API_DOMAIN   (e.g. api.example.com): " API_DOMAIN
  if command -v ufw >/dev/null 2>&1; then sudo ufw allow 80/tcp || true; sudo ufw allow 443/tcp || true; fi
  sudo systemctl daemon-reload; sudo systemctl enable --now panel-backend panel-frontend
  echo "Reverse proxy:"; echo "A) Caddy (auto TLS)"; echo "B) NGINX + Certbot"
  read -p "Choose [A/B]: " RP
  cd "$TARGET"
  if [[ "$RP" =~ ^[Aa]$ ]]; then bash ./setup-https-caddy.sh "$PANEL_DOMAIN" "$API_DOMAIN"; else bash ./setup-https-nginx.sh "$PANEL_DOMAIN" "$API_DOMAIN"; fi
  patch_backend_url "https://$API_DOMAIN"
  echo "UI:  https://$PANEL_DOMAIN"; echo "API: https://$API_DOMAIN"
  exit 0
fi
echo "Invalid choice."; exit 1
