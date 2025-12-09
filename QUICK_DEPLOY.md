# Quick VPS Deployment Guide

## Deploy in 3 Simple Steps

### Step 1: SSH into Your VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### Step 2: Run One-Command Deploy

**Option A: From Repository (After you push)**
```bash
curl -sSL https://raw.githubusercontent.com/ar4droid/Status-board-kanban/claude/iridescent-kanban-board-01FQj1JXH4WQvzLuoP1RXnem/deploy/auto-deploy.sh | bash
```

**Option B: Manual Deploy**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone -b claude/iridescent-kanban-board-01FQj1JXH4WQvzLuoP1RXnem \
  https://github.com/ar4droid/Status-board-kanban.git /var/www/kanban

# Build and start
cd /var/www/kanban
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3: Configure Domain (Optional)

**Install Nginx:**
```bash
sudo apt-get install -y nginx

# Copy nginx config
sudo cp /var/www/kanban/deploy/nginx.conf /etc/nginx/sites-available/kanban

# Edit with your domain
sudo nano /etc/nginx/sites-available/kanban
# Change 'your-domain.com' to your actual domain

# Enable site
sudo ln -s /etc/nginx/sites-available/kanban /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Install SSL Certificate:**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Verify Deployment

```bash
# Check if app is running
pm2 status

# View logs
pm2 logs kanban-board

# Test locally
curl http://localhost:3000
```

Visit your server's IP or domain in a browser!

## Quick Commands

```bash
# Restart app
pm2 restart kanban-board

# Update from git
cd /var/www/kanban
git pull
npm install
npm run build
pm2 restart kanban-board

# View logs
pm2 logs kanban-board --lines 100
```

## Troubleshooting

**Port 3000 already in use:**
```bash
# Kill process on port 3000
sudo kill -9 $(sudo lsof -t -i:3000)
pm2 restart kanban-board
```

**Build failed:**
```bash
cd /var/www/kanban
rm -rf node_modules .next
npm install
npm run build
```

**Nginx errors:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```
