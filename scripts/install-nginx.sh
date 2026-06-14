#!/bin/bash
# Install Nginx via BaoTa or dnf

echo "========================================"
echo "  Installing Nginx"
echo "========================================"
echo ""

# Check if nginx is already installed
if command -v nginx &> /dev/null; then
    echo "[OK] Nginx already installed: $(nginx -v 2>&1)"
    exit 0
fi

# Method 1: Check BaoTa's nginx
if [ -f /www/server/nginx/sbin/nginx ]; then
    echo "[INFO] Found BaoTa Nginx"
    ln -sf /www/server/nginx/sbin/nginx /usr/local/bin/nginx
    ln -sf /www/server/nginx/conf /etc/nginx
    echo "[OK] Symlinked BaoTa Nginx"
    nginx -v
    exit 0
fi

# Method 2: Try to install via dnf
echo "[INFO] Trying dnf install..."
dnf install -y nginx 2>/dev/null

if command -v nginx &> /dev/null; then
    echo "[OK] Nginx installed via dnf"
    systemctl enable nginx
    systemctl start nginx
    exit 0
fi

# Method 3: Install from EPEL
echo "[INFO] Trying EPEL repository..."
dnf install -y epel-release 2>/dev/null
dnf install -y nginx 2>/dev/null

if command -v nginx &> /dev/null; then
    echo "[OK] Nginx installed via EPEL"
    systemctl enable nginx
    systemctl start nginx
    exit 0
fi

# Method 4: Manual download
echo "[INFO] Trying manual download..."
NGINX_VERSION="1.24.0"
cd /tmp
wget -q "https://nginx.org/packages/centos/8/x86_64/RPMS/nginx-${NGINX_VERSION}-1.el8.ngx.x86_64.rpm" -O nginx.rpm 2>/dev/null
if [ -f nginx.rpm ]; then
    rpm -ivh nginx.rpm
    rm -f nginx.rpm
    if command -v nginx &> /dev/null; then
        echo "[OK] Nginx installed from RPM"
        systemctl enable nginx
        systemctl start nginx
        exit 0
    fi
fi

echo "[ERROR] Failed to install Nginx"
echo "[INFO] Please install Nginx manually via your server panel or package manager"
exit 1
