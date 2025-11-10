# 🚀 AWS EC2 + RDS Deployment Guide - Premier Prime Cleaning App

## 📋 Overview

**Cost:** ~$30-50/month
**Time:** 1-2 hours
**Difficulty:** ⭐⭐⭐

### Architecture:
```
Internet
    ↓
Route 53 (DNS) → premierprime.org
    ↓
EC2 Instance
    ├── Nginx (Reverse Proxy + SSL)
    ├── Frontend (React - Port 3000)
    ├── Backend API (Go - Port 8080)
    └── RDS PostgreSQL (Database)
```

---

## 🎯 Step 1: Create RDS Database (10 mins)

### 1.1 Go to AWS RDS Console
1. Sign in to AWS Console: https://console.aws.amazon.com
2. Search for "RDS" → Click "RDS"
3. Click **"Create database"**

### 1.2 Configure Database
```
Engine type: PostgreSQL
Version: PostgreSQL 15.x

Templates: Production (or Free tier for testing)

Settings:
  - DB instance identifier: premierprime-db
  - Master username: postgres
  - Master password: [CREATE STRONG PASSWORD - Save this!]
  
Instance configuration:
  - DB instance class: db.t3.micro (2 vCPU, 1 GB RAM) - $15/month
  - Storage type: General Purpose SSD (gp3)
  - Allocated storage: 20 GB

Connectivity:
  - VPC: Default VPC
  - Subnet group: default
  - Public access: No (more secure)
  - VPC security group: Create new
    - Name: premierprime-db-sg
  
Database authentication: Password authentication

Additional configuration:
  - Initial database name: cleaning_app
  - Backup retention: 7 days (recommended)
  - Enable automated backups: Yes
```

### 1.3 Note Your RDS Endpoint
After creation (takes 5-10 mins), note the **Endpoint**:
```
Example: premierprime-db.xxxxxx.us-east-1.rds.amazonaws.com
```

---

## 🖥️ Step 2: Create EC2 Instance (15 mins)

### 2.1 Go to EC2 Console
1. AWS Console → Search "EC2" → Click "EC2"
2. Click **"Launch Instance"**

### 2.2 Configure Instance
```
Name: premierprime-app

Application and OS Images:
  - Quick Start: Ubuntu
  - Ubuntu Server 22.04 LTS (Free tier eligible)
  - Architecture: 64-bit (x86)

Instance type: t2.small (1 vCPU, 2 GB RAM) - $17/month
  OR t3.small (2 vCPU, 2 GB RAM) - $15/month (better)

Key pair:
  - Click "Create new key pair"
  - Name: premierprime-key
  - Type: RSA
  - Format: .pem
  - Download and SAVE this file securely!

Network settings:
  - VPC: Same as RDS (default)
  - Auto-assign public IP: Enable
  - Create security group:
    - Name: premierprime-web-sg
    - Description: Security group for Premier Prime web server
    - Rules:
      ✓ SSH (22) - Source: My IP (for security)
      ✓ HTTP (80) - Source: Anywhere (0.0.0.0/0)
      ✓ HTTPS (443) - Source: Anywhere (0.0.0.0/0)

Configure storage:
  - 20 GB gp3 (General Purpose SSD)
```

### 2.3 Launch Instance
Click **"Launch Instance"** and wait for it to start (2-3 minutes)

### 2.4 Get Your Instance IP
- Go to EC2 Dashboard → Instances
- Select your instance → Copy **Public IPv4 address**
- Example: `3.123.45.67`

---

## 🔐 Step 3: Configure Security Groups (5 mins)

### 3.1 Allow EC2 to Access RDS
1. Go to **RDS Console** → Databases → Click your database
2. Click on **VPC security groups** → Click the security group
3. Click **"Edit inbound rules"**
4. Add rule:
   ```
   Type: PostgreSQL
   Port: 5432
   Source: Custom → premierprime-web-sg (your EC2 security group)
   Description: Allow EC2 access to database
   ```
5. Click **"Save rules"**

---

## 💻 Step 4: Connect to EC2 and Setup (20 mins)

### 4.1 Connect via SSH

**Windows (PowerShell):**
```powershell
# Move to where you saved the key
cd Downloads

# Set permissions
icacls premierprime-key.pem /inheritance:r
icacls premierprime-key.pem /grant:r "$($env:USERNAME):(R)"

# Connect
ssh -i premierprime-key.pem ubuntu@YOUR_EC2_IP
```

**Mac/Linux:**
```bash
chmod 400 premierprime-key.pem
ssh -i premierprime-key.pem ubuntu@YOUR_EC2_IP
```

### 4.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 4.3 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### 4.4 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.5 Install Certbot (for SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

## 📦 Step 5: Upload Your Application (10 mins)

### 5.1 From Your Local Computer

**Option A: Using SCP (Recommended):**
```powershell
# Windows PowerShell - From your project directory
cd C:\Users\herna\Downloads\premierprime

# Upload the entire app
scp -i Downloads\premierprime-key.pem -r cleaning-app ubuntu@YOUR_EC2_IP:~/
```

**Option B: Using Git:**
```bash
# On EC2 server
git clone https://github.com/yourusername/cleaning-app.git
cd cleaning-app
```

---

## 🔧 Step 6: Configure Production Environment (15 mins)

### 6.1 Create Production Docker Compose File

On EC2 server:
```bash
cd ~/cleaning-app
nano docker-compose.prod.yml
```

Paste this configuration:
```yaml
version: '3.8'

services:
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - DB_HOST=YOUR_RDS_ENDPOINT_HERE
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=YOUR_RDS_PASSWORD_HERE
      - DB_NAME=cleaning_app
      - JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_KEY
      - JWT_EXPIRY=24h
      - DATABASE_URL=postgres://postgres:YOUR_RDS_PASSWORD@YOUR_RDS_ENDPOINT:5432/cleaning_app?sslmode=require
    restart: unless-stopped
    volumes:
      - ./logs:/root/logs

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - app
    restart: unless-stopped

volumes:
  logs:
```

**IMPORTANT: Replace these values:**
- `YOUR_RDS_ENDPOINT_HERE` → Your RDS endpoint (from Step 1.3)
- `YOUR_RDS_PASSWORD_HERE` → Your RDS master password
- `CHANGE_THIS_TO_RANDOM_SECRET_KEY` → Generate random string

To generate JWT secret:
```bash
openssl rand -base64 32
```

Save file: `Ctrl+O`, `Enter`, `Ctrl+X`

### 6.2 Update Frontend API URL

```bash
nano frontend/.env.production
```

Add:
```
REACT_APP_API_URL=http://YOUR_EC2_IP:8080
```

Save and exit.

---

## 🌐 Step 7: Configure Nginx as Reverse Proxy (15 mins)

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/premierprime
```

Paste this configuration:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name premierprime.org www.premierprime.org;
    
    # Allow Certbot challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name premierprime.org www.premierprime.org;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/premierprime.org/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/premierprime.org/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - React App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for long requests
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # File upload size limit
    client_max_body_size 50M;
}
```

Save file: `Ctrl+O`, `Enter`, `Ctrl+X`

### 7.2 Enable Site and Test Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/premierprime /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx
```

---

## 🚀 Step 8: Deploy Application (10 mins)

### 8.1 Build and Start Containers

```bash
cd ~/cleaning-app

# Build images (first time takes 5-10 minutes)
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 8.2 Test Application

```bash
# Test backend
curl http://localhost:8080/api/health

# Test frontend
curl http://localhost:3000
```

---

## 🔒 Step 9: Setup SSL Certificate (10 mins)

### 9.1 Point Domain to EC2

**Before running Certbot, configure your domain:**

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add DNS A Records:
   ```
   Type: A
   Name: @
   Value: YOUR_EC2_PUBLIC_IP
   TTL: 300

   Type: A
   Name: www
   Value: YOUR_EC2_PUBLIC_IP
   TTL: 300
   ```
3. Wait 5-10 minutes for DNS to propagate

**Verify DNS:**
```bash
nslookup premierprime.org
# Should show your EC2 IP
```

### 9.2 Obtain SSL Certificate

```bash
# Run Certbot
sudo certbot --nginx -d premierprime.org -d www.premierprime.org

# Follow prompts:
# - Enter email: adaperez@premierprime.org
# - Agree to terms: Yes
# - Share email: No (optional)
# - Redirect HTTP to HTTPS: Yes (recommended)
```

### 9.3 Test Auto-Renewal

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# If successful, certificate will auto-renew every 60 days
```

---

## ✅ Step 10: Verify Deployment

### 10.1 Check All Services

```bash
# Check Docker containers
docker-compose -f docker-compose.prod.yml ps

# Should see:
# cleaning-app-app-1       running
# cleaning-app-frontend-1  running

# Check Nginx
sudo systemctl status nginx

# Check logs
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### 10.2 Test Your Website

Open browser:
- ✅ http://premierprime.org → Should redirect to HTTPS
- ✅ https://premierprime.org → Your app should load
- ✅ https://www.premierprime.org → Should work
- ✅ Test login, bookings, admin panel

---

## 🔧 Step 11: Production Configuration

### 11.1 Setup Automatic Restart

```bash
# Make containers restart on reboot
cd ~/cleaning-app

# Edit docker-compose.prod.yml and ensure all services have:
# restart: unless-stopped
```

### 11.2 Setup Monitoring

**Install monitoring script:**
```bash
nano ~/monitor.sh
```

```bash
#!/bin/bash
# Monitor Docker containers and restart if needed

cd ~/cleaning-app

if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "Container down, restarting..."
    docker-compose -f docker-compose.prod.yml restart
    echo "Restarted at $(date)" >> ~/restart.log
fi
```

```bash
chmod +x ~/monitor.sh

# Add to crontab (run every 5 minutes)
crontab -e
# Add line:
*/5 * * * * ~/monitor.sh
```

### 11.3 Setup Backup Script

```bash
nano ~/backup.sh
```

```bash
#!/bin/bash
# Backup database daily

BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"

# Backup RDS database
PGPASSWORD='YOUR_RDS_PASSWORD' pg_dump \
  -h YOUR_RDS_ENDPOINT \
  -U postgres \
  -d cleaning_app \
  > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Delete backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

```bash
chmod +x ~/backup.sh

# Test backup
sudo apt install postgresql-client -y
~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * ~/backup.sh
```

---

## 📊 Monitoring & Maintenance

### Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update application
cd ~/cleaning-app
git pull  # or upload new files
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Check disk space
df -h

# Check memory
free -h

# Check running processes
htop  # install: sudo apt install htop

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 💰 Cost Breakdown

```
EC2 t3.small:      ~$15/month
RDS db.t3.micro:   ~$15/month
Data Transfer:     ~$5-10/month
EBS Storage:       ~$2/month
Backups:           ~$1/month
-----------------------------------
Total:             ~$38-43/month
```

---

## 🚨 Troubleshooting

### Issue: Can't connect to RDS
```bash
# Check security group allows EC2 access
# Test connection:
PGPASSWORD='YOUR_PASSWORD' psql -h YOUR_RDS_ENDPOINT -U postgres -d cleaning_app
```

### Issue: Nginx 502 Bad Gateway
```bash
# Check if containers are running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker-compose -f docker-compose.prod.yml logs app

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Issue: SSL Certificate Failed
```bash
# Make sure DNS is pointing to EC2
nslookup premierprime.org

# Check Nginx is running on port 80
sudo netstat -tlnp | grep :80

# Try Certbot again
sudo certbot --nginx -d premierprime.org -d www.premierprime.org
```

---

## 🎉 Success Checklist

- ✅ RDS database created and accessible
- ✅ EC2 instance running
- ✅ Docker containers running
- ✅ Nginx configured and running
- ✅ SSL certificate installed
- ✅ Domain pointing to EC2
- ✅ Website accessible via HTTPS
- ✅ Admin login working
- ✅ Bookings working
- ✅ Invoice generation working
- ✅ Automated backups configured
- ✅ Monitoring setup

---

## 📞 Need Help?

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Check Nginx: `sudo nginx -t`
3. Check DNS: `nslookup premierprime.org`
4. Verify security groups allow traffic

---

**🎊 Congratulations! Your Premier Prime Cleaning App is now live on AWS!**

Visit: https://premierprime.org
