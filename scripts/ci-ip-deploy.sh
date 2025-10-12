#!/bin/bash
set -e
TARGET="/var/www/panel-v9.0.2"; BACKEND_PORT=3200; FRONTEND_PORT=8080
sudo apt update -y && sudo apt install -y curl git unzip python3
if ! command -v node >/dev/null 2>&1; then curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs; fi
sudo mkdir -p "$TARGET"; sudo rsync -a --delete ./ "$TARGET"/
cd "$TARGET/server"; [ ! -f package.json ] && npm init -y >/dev/null 2>&1 || true
npm i express cors nodemailer >/dev/null 2>&1
if [ ! -f /etc/panel.env ]; then sudo bash -c 'cat >/etc/panel.env <<E
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_SECURE=false
SMTP_FROM="Hoskt Panel <noreply@example.com>"
E'; fi
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
if command -v ufw >/dev/null 2>&1; then sudo ufw allow $BACKEND_PORT/tcp || true; sudo ufw allow $FRONTEND_PORT/tcp || true; fi
SV_IP=$(hostname -I | awk '{print $1}'); APPJS="$TARGET/frontend/js/app.js"
if [ -f "$APPJS" ]; then sudo sed -i "s|const BACKEND_URL *= *['\"][^'\"]*['\"]|const BACKEND_URL = 'http://$SV_IP:$BACKEND_PORT'|g" "$APPJS" || echo "const BACKEND_URL = 'http://$SV_IP:$BACKEND_PORT';" | sudo tee -a "$APPJS"; fi
sudo systemctl daemon-reload; sudo systemctl enable --now panel-backend panel-frontend
echo "UI: http://$SV_IP:$FRONTEND_PORT"; echo "API: http://$SV_IP:$BACKEND_PORT"
