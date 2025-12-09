#!/bin/bash
# Auto-deploy script for Kanban Board
# Run this ON YOUR VPS with: curl -sSL <raw-github-url> | bash

set -e

echo "🚀 Starting automated deployment..."

# Configuration
REPO_URL="https://github.com/ar4droid/Status-board-kanban.git"
BRANCH="claude/iridescent-kanban-board-01FQj1JXH4WQvzLuoP1RXnem"
APP_DIR="/var/www/kanban"
DOMAIN="your-domain.com"  # Change this!

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}📦 Installing system dependencies...${NC}"
sudo apt-get update
sudo apt-get install -y curl git

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo -e "${GREEN}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Create app directory
echo -e "${GREEN}📁 Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone or pull repository
if [ -d "$APP_DIR/.git" ]; then
    echo -e "${GREEN}🔄 Pulling latest changes...${NC}"
    cd $APP_DIR
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
else
    echo -e "${GREEN}📥 Cloning repository...${NC}"
    git clone -b $BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
echo -e "${GREEN}📦 Installing Node.js dependencies...${NC}"
npm install

# Create .env file if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit $APP_DIR/.env with your configuration${NC}"
fi

# Build the application
echo -e "${GREEN}🔨 Building application...${NC}"
npm run build

# Stop existing PM2 process if running
pm2 stop kanban-board 2>/dev/null || true
pm2 delete kanban-board 2>/dev/null || true

# Start with PM2
echo -e "${GREEN}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash || true

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo -e "${GREEN}📦 Installing Nginx...${NC}"
    sudo apt-get install -y nginx
fi

# Setup Nginx configuration
if [ ! -f "/etc/nginx/sites-available/kanban" ]; then
    echo -e "${GREEN}⚙️  Configuring Nginx...${NC}"
    sudo cp deploy/nginx.conf /etc/nginx/sites-available/kanban

    # Update domain in nginx config
    sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/kanban

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/kanban /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

# Setup firewall
echo -e "${GREEN}🔒 Configuring firewall...${NC}"
sudo ufw allow 'Nginx Full' 2>/dev/null || true
sudo ufw allow OpenSSH 2>/dev/null || true

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Application is running on:"
echo "  - http://localhost:3000 (internal)"
echo "  - http://$DOMAIN (if DNS configured)"
echo ""
echo "To view logs: pm2 logs kanban-board"
echo "To restart: pm2 restart kanban-board"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit $APP_DIR/.env with your configuration"
echo "2. Update domain in /etc/nginx/sites-available/kanban"
echo "3. Point your DNS to this server's IP"
echo "4. Install SSL: sudo certbot --nginx -d $DOMAIN"
