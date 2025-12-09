# Deployment Guide

Complete guide for deploying the Kanban Board to a VPS.

## Prerequisites

- A VPS with Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- A domain name pointing to your VPS IP
- SSH access configured

## Quick Deploy

### Step 1: Prepare Your VPS

SSH into your VPS and run the automated setup script:

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/your-repo/Status-board-kanban/main/deploy/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

Or manually follow the steps in the script.

### Step 2: Deploy Application

```bash
# Clone the repository
cd /var/www/kanban
git clone <your-repo-url> .

# Install dependencies
npm install

# Create environment file
cp .env.example .env
nano .env  # Edit with your configuration

# Build the application
npm run build
```

### Step 3: Configure Nginx

```bash
# Copy nginx configuration
sudo cp deploy/nginx.conf /etc/nginx/sites-available/kanban

# Edit the configuration with your domain
sudo nano /etc/nginx/sites-available/kanban
# Replace 'your-domain.com' with your actual domain

# Create symlink to enable site
sudo ln -s /etc/nginx/sites-available/kanban /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 4: Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the output
```

### Step 5: Setup SSL Certificate

```bash
# Install SSL certificate with Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts to complete SSL setup
```

## Post-Deployment

### Verify Deployment

1. Visit `https://your-domain.com` in your browser
2. You should see the kanban board with the iridescent effect
3. Test drag-and-drop functionality

### Monitor Application

```bash
# View application logs
pm2 logs kanban-board

# Check application status
pm2 status

# Restart application
pm2 restart kanban-board
```

### Update Application

```bash
cd /var/www/kanban
git pull origin main
npm install
npm run build
pm2 restart kanban-board
```

## Environment Variables

Required environment variables in `.env`:

```env
# Office 365 (when ready to integrate)
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
AZURE_TENANT_ID=your_tenant_id

# NextAuth
NEXTAUTH_SECRET=generate_random_secret
NEXTAUTH_URL=https://your-domain.com

# API
API_BASE_URL=https://your-domain.com/api
```

Generate a secure secret for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs kanban-board

# Verify build completed
ls -la /var/www/kanban/.next

# Rebuild if necessary
npm run build
pm2 restart kanban-board
```

### Nginx 502 Bad Gateway

```bash
# Verify application is running
pm2 status

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Renew certificates
sudo certbot renew

# Test renewal process
sudo certbot renew --dry-run
```

## Security Best Practices

1. **Keep System Updated**
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

2. **Configure Firewall**
   ```bash
   sudo ufw status
   # Only allow SSH, HTTP, and HTTPS
   ```

3. **Setup Fail2Ban** (optional but recommended)
   ```bash
   sudo apt-get install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Regular Backups**
   - Backup `/var/www/kanban` directory
   - Backup environment variables
   - Backup nginx configuration

5. **Monitor Resources**
   ```bash
   # Install monitoring tools
   sudo apt-get install htop

   # Check disk space
   df -h

   # Check memory
   free -h
   ```

## Performance Optimization

### Enable Gzip Compression

Already configured in `deploy/nginx.conf`

### Optimize PM2 Settings

For VPS with more resources:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'kanban-board',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 2,  // Increase based on CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
  }]
}
```

### Add Redis for Session Storage (Future)

When adding authentication:

```bash
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

## Monitoring & Logging

### Setup Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Monitor with PM2 Plus (Optional)

```bash
pm2 plus
# Follow instructions to connect to PM2 monitoring dashboard
```

## Support

For deployment issues:
1. Check logs: `pm2 logs kanban-board`
2. Review nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify configuration: `pm2 show kanban-board`
4. Open an issue on GitHub
