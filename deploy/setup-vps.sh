#!/bin/bash

# VPS Setup Script for Kanban Board
# Run this script on your Ubuntu/Debian VPS

set -e

echo "🚀 Starting VPS setup for Kanban Board..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version:"
node --version
echo "✅ npm version:"
npm --version

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Setup firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/kanban
sudo chown -R $USER:$USER /var/www/kanban

echo "✅ VPS setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /var/www/kanban"
echo "2. Run: cd /var/www/kanban && npm install"
echo "3. Run: npm run build"
echo "4. Copy deploy/nginx.conf to /etc/nginx/sites-available/kanban"
echo "5. Update server_name in nginx.conf with your domain"
echo "6. Create symlink: sudo ln -s /etc/nginx/sites-available/kanban /etc/nginx/sites-enabled/"
echo "7. Test nginx: sudo nginx -t"
echo "8. Reload nginx: sudo systemctl reload nginx"
echo "9. Start app with PM2: pm2 start ecosystem.config.js"
echo "10. Setup SSL: sudo certbot --nginx -d your-domain.com"
