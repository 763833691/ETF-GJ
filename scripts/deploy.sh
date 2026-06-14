#!/bin/bash
# ETF Platform Full Deployment Script
# Run this on the server as root after uploading project files

set -e

echo "========================================"
echo "  ETF Platform - Full Deployment"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DEPLOY_DIR="/opt/etf-agent"
RELEASE_DIR="$DEPLOY_DIR/releases/v1"
CURRENT_LINK="$DEPLOY_DIR/current"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR] Please run as root${NC}"
    exit 1
fi

# Check if project files exist
if [ ! -f "$RELEASE_DIR/package.json" ]; then
    echo -e "${RED}[ERROR] Project files not found in $RELEASE_DIR${NC}"
    echo "Please upload project files first."
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}[1/8] Installing system dependencies...${NC}"
npm install -g pnpm pm2

if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."

    # Check if BaoTa's nginx exists
    if [ -f /www/server/nginx/sbin/nginx ]; then
        echo "Found BaoTa Nginx, creating symlink..."
        ln -sf /www/server/nginx/sbin/nginx /usr/local/bin/nginx
    else
        # Try to install nginx
        dnf module reset nginx -y 2>/dev/null || true
        dnf module enable nginx:1.24 -y 2>/dev/null || true
        dnf install -y nginx 2>/dev/null || \
        dnf install -y nginx-mod-http-geoip nginx-mod-stream 2>/dev/null || \
        echo "Nginx installation failed, please install manually"
    fi
fi

# Ensure nginx is available
if command -v nginx &> /dev/null; then
    systemctl enable nginx 2>/dev/null || true
    systemctl start nginx 2>/dev/null || true
    echo -e "${GREEN}[OK] Nginx available: $(nginx -v 2>&1)${NC}"
else
    echo -e "${YELLOW}[WARN] Nginx not installed, you may need to install it manually${NC}"
fi

echo -e "${GREEN}[OK] Dependencies installed${NC}"
echo ""

# Step 2: Create directory structure
echo -e "${YELLOW}[2/8] Creating directory structure...${NC}"
mkdir -p $DEPLOY_DIR/{current,releases,backups,logs}
echo -e "${GREEN}[OK] Directories created${NC}"
echo ""

# Step 3: Backup if needed
if [ -L "$CURRENT_LINK" ] && [ -d "$CURRENT_LINK" ]; then
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}[3/8] Backing up current deployment...${NC}"
    cp -r "$CURRENT_LINK" "$DEPLOY_DIR/backups/$BACKUP_NAME"
    echo -e "${GREEN}[OK] Backup: $BACKUP_NAME${NC}"
else
    echo -e "${YELLOW}[3/8] No existing deployment to backup${NC}"
fi
echo ""

# Step 4: Create symlink
echo -e "${YELLOW}[4/8] Setting up symlink...${NC}"
rm -f "$CURRENT_LINK"
ln -s "$RELEASE_DIR" "$CURRENT_LINK"
echo -e "${GREEN}[OK] $CURRENT_LINK -> $RELEASE_DIR${NC}"
echo ""

# Step 5: Install project dependencies
echo -e "${YELLOW}[5/8] Installing project dependencies...${NC}"
cd "$CURRENT_LINK"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}[OK] Created .env from .env.example${NC}"
fi

# 生产构建必须走 Nginx /api 代理，不能写 127.0.0.1
if grep -q "^VITE_API_BASE_URL=" .env; then
    sed -i 's|^VITE_API_BASE_URL=.*|VITE_API_BASE_URL=/api|' .env
else
    echo "VITE_API_BASE_URL=/api" >> .env
fi
pnpm install --frozen-lockfile || pnpm install
echo -e "${GREEN}[OK] Dependencies installed${NC}"
echo ""

# Step 6: Build project
echo -e "${YELLOW}[6/8] Building project...${NC}"
pnpm build
if [ ! -f "apps/web/dist/index.html" ]; then
    echo -e "${RED}[ERROR] Frontend build failed${NC}"
    exit 1
fi
if [ ! -f "apps/api/dist/server.js" ]; then
    echo -e "${RED}[ERROR] Backend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Build successful${NC}"
echo ""

# Step 7: Start PM2
echo -e "${YELLOW}[7/8] Starting PM2 services...${NC}"
cd "$CURRENT_LINK"
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
echo -e "${GREEN}[OK] PM2 started${NC}"
echo ""

# Step 8: Configure Nginx
echo -e "${YELLOW}[8/8] Configuring Nginx...${NC}"

if command -v nginx &> /dev/null; then
    # Create nginx conf directory if not exists
    mkdir -p /etc/nginx/conf.d

    # Backup existing nginx config if exists
    if [ -f /etc/nginx/conf.d/etf-agent.conf ]; then
        cp /etc/nginx/conf.d/etf-agent.conf /opt/etf-agent/backups/nginx.conf.bak
    fi

    cat > /etc/nginx/conf.d/etf-agent.conf << 'EOF'
server {
    listen 80;
    server_name _;

    root /opt/etf-agent/current/apps/web/dist;
    index index.html;

    client_max_body_size 50m;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    nginx -t
    systemctl reload nginx || systemctl start nginx
    echo -e "${GREEN}[OK] Nginx configured${NC}"
else
    echo -e "${YELLOW}[WARN] Nginx not installed, skipping configuration${NC}"
    echo -e "${YELLOW}[INFO] You can install Nginx manually or use BaoTa panel${NC}"
fi
echo ""

# Step 9: Verification
echo -e "${YELLOW}[9/9] Verifying deployment...${NC}"
echo ""

echo "PM2 Status:"
pm2 list
echo ""

echo "Nginx Status:"
systemctl status nginx --no-pager -l | head -5
echo ""

echo "API Health Check:"
curl -s http://127.0.0.1:8000/api/health || echo "API health check failed"
echo ""

echo "Frontend Check:"
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/
echo ""

echo ""
echo "========================================"
echo -e "  ${GREEN}Deployment Complete!${NC}"
echo ""
echo "  Frontend: http://YOUR_SERVER_IP"
echo "  API: http://YOUR_SERVER_IP/api/"
echo ""
echo "  PM2 Logs: pm2 logs"
echo "  Nginx Logs: tail -f /var/log/nginx/error.log"
echo "========================================"
