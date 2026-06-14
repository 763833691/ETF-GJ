#!/bin/bash
# ETF Platform Server Setup Script
# Run this on the server as root

set -e

echo "========================================"
echo "  ETF Platform - Server Setup"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR] Please run as root${NC}"
    exit 1
fi

# Step 1: Install pnpm and PM2
echo -e "${YELLOW}[1/6] Installing pnpm and PM2...${NC}"
npm install -g pnpm pm2
echo -e "${GREEN}[OK] pnpm $(pnpm -v), PM2 $(pm2 -v)${NC}"
echo ""

# Step 2: Install Nginx
echo -e "${YELLOW}[2/6] Installing Nginx...${NC}"
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}[OK] Nginx already installed: $(nginx -v 2>&1)${NC}"
else
    dnf install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}[OK] Nginx installed: $(nginx -v 2>&1)${NC}"
fi
echo ""

# Step 3: Create directory structure
echo -e "${YELLOW}[3/6] Creating directory structure...${NC}"
mkdir -p /opt/etf-agent/{current,releases,backups,logs}
echo -e "${GREEN}[OK] /opt/etf-agent created${NC}"
echo ""

# Step 4: Backup existing deployment if exists
if [ -L /opt/etf-agent/current ] || [ -d /opt/etf-agent/current ]; then
    if [ "$(ls -A /opt/etf-agent/current 2>/dev/null)" ]; then
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
        echo -e "${YELLOW}[4/6] Backing up existing deployment to /opt/etf-agent/backups/$BACKUP_NAME...${NC}"
        cp -r /opt/etf-agent/current /opt/etf-agent/backups/$BACKUP_NAME
        echo -e "${GREEN}[OK] Backup created${NC}"
    else
        echo -e "${YELLOW}[4/6] No existing deployment to backup${NC}"
    fi
else
    echo -e "${YELLOW}[4/6] No existing deployment${NC}"
fi
echo ""

# Step 5: Create release directory
echo -e "${YELLOW}[5/6] Preparing release directory...${NC}"
mkdir -p /opt/etf-agent/releases/v1
echo -e "${GREEN}[OK] /opt/etf-agent/releases/v1 ready${NC}"
echo ""

# Step 6: Create symlink
echo -e "${YELLOW}[6/6] Creating symlink...${NC}"
rm -f /opt/etf-agent/current
ln -s /opt/etf-agent/releases/v1 /opt/etf-agent/current
echo -e "${GREEN}[OK] /opt/etf-agent/current -> /opt/etf-agent/releases/v1${NC}"
echo ""

echo "========================================"
echo "  Server setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Upload project files to /opt/etf-agent/releases/v1/"
echo "  2. Run: cd /opt/etf-agent/current && pnpm install && pnpm build"
echo "  3. Run: pm2 start ecosystem.config.cjs"
echo "========================================"
