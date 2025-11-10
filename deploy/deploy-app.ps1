#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy Premier Prime Cleaning App to AWS EC2
.DESCRIPTION
    This script uploads and deploys the application to your EC2 instance
#>

param(
    [string]$EC2IP = "18.116.44.7",
    [string]$KeyFile = "deploy\premierprime-key.pem",
    [string]$DBHost = "premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com",
    [string]$DBPassword = "PremierPrime2024!Secure"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Premier Prime Cleaning App - AWS Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Generate JWT secret
$jwtSecret = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Step 1: Create production environment file
Write-Host "📝 Step 1: Creating production configuration..." -ForegroundColor Yellow

$prodEnvContent = @"
PORT=8080
DB_HOST=$DBHost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=$DBPassword
DB_NAME=cleaning_app
JWT_SECRET=$jwtSecret
JWT_EXPIRY=24h
DATABASE_URL=postgres://postgres:$DBPassword@$DBHost:5432/cleaning_app?sslmode=require
"@

$prodEnvContent | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "✅ Production environment configured" -ForegroundColor Green

# Step 2: Create docker-compose.prod.yml
Write-Host "📝 Step 2: Creating production Docker Compose file..." -ForegroundColor Yellow

$dockerComposeContent = @"
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
      - DB_HOST=$DBHost
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=$DBPassword
      - DB_NAME=cleaning_app
      - JWT_SECRET=$jwtSecret
      - JWT_EXPIRY=24h
      - DATABASE_URL=postgres://postgres:$DBPassword@$DBHost:5432/cleaning_app?sslmode=require
    restart: unless-stopped
    volumes:
      - ./logs:/root/logs
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_API_URL=https://premierprime.org/api
    ports:
      - "3000:80"
    depends_on:
      - app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  logs:
"@

$dockerComposeContent | Out-File -FilePath "docker-compose.prod.yml" -Encoding UTF8
Write-Host "✅ Docker Compose file created" -ForegroundColor Green

# Step 3: Update frontend environment
Write-Host "📝 Step 3: Updating frontend configuration..." -ForegroundColor Yellow

$frontendEnv = @"
REACT_APP_API_URL=https://premierprime.org/api
"@

$frontendEnv | Out-File -FilePath "frontend\.env.production" -Encoding UTF8
Write-Host "✅ Frontend configured for production" -ForegroundColor Green

# Step 4: Create Nginx configuration
Write-Host "📝 Step 4: Creating Nginx configuration..." -ForegroundColor Yellow

$nginxConfig = @"
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
        return 301 https://`$server_name`$request_uri;
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
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        
        # Increase timeouts for long requests
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # File upload size limit
    client_max_body_size 50M;
}
"@

New-Item -ItemType Directory -Force -Path "deploy\nginx-config" | Out-Null
$nginxConfig | Out-File -FilePath "deploy\nginx-config\premierprime.conf" -Encoding UTF8
Write-Host "✅ Nginx configuration created" -ForegroundColor Green

# Step 5: Create deployment script for EC2
Write-Host "📝 Step 5: Creating EC2 deployment script..." -ForegroundColor Yellow

$ec2DeployScript = @"
#!/bin/bash
set -e

echo "🚀 Deploying Premier Prime Cleaning App..."
echo "==========================================="

# Navigate to app directory
cd ~/cleaning-app

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start containers
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "Container Status:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo ""
echo "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "✅ Deployment complete!"
echo "Backend health: http://localhost:8080/api/health"
echo "Frontend: http://localhost:3000"
"@

$ec2DeployScript | Out-File -FilePath "deploy\ec2-deploy.sh" -Encoding UTF8 -NoNewline
Write-Host "✅ EC2 deployment script created" -ForegroundColor Green

# Step 6: Create setup script for first-time EC2 setup
Write-Host "📝 Step 6: Creating EC2 setup script..." -ForegroundColor Yellow

$ec2SetupScript = @"
#!/bin/bash
set -e

echo "🔧 Setting up EC2 instance..."
echo "=============================="

# Update system
echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt install certbot python3-certbot-nginx -y
fi

# Install PostgreSQL client for backups
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL client..."
    sudo apt install postgresql-client -y
fi

# Configure Nginx
echo "Configuring Nginx..."
sudo cp ~/cleaning-app/deploy/nginx-config/premierprime.conf /etc/nginx/sites-available/premierprime
sudo ln -sf /etc/nginx/sites-available/premierprime /etc/nginx/sites-enabled/premierprime
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "✅ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify DNS: nslookup premierprime.org"
echo "2. Deploy app: cd ~/cleaning-app && bash deploy/ec2-deploy.sh"
echo "3. Setup SSL: sudo certbot --nginx -d premierprime.org -d www.premierprime.org"
"@

$ec2SetupScript | Out-File -FilePath "deploy\setup-ec2-simple.sh" -Encoding UTF8 -NoNewline
Write-Host "✅ EC2 setup script created" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📦 Files Ready for Deployment!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration files created:" -ForegroundColor Yellow
Write-Host "  ✓ .env.production" -ForegroundColor Green
Write-Host "  ✓ docker-compose.prod.yml" -ForegroundColor Green
Write-Host "  ✓ frontend/.env.production" -ForegroundColor Green
Write-Host "  ✓ deploy/nginx-config/premierprime.conf" -ForegroundColor Green
Write-Host "  ✓ deploy/ec2-deploy.sh" -ForegroundColor Green
Write-Host "  ✓ deploy/setup-ec2-simple.sh" -ForegroundColor Green
Write-Host ""
Write-Host "📋 MANUAL DEPLOYMENT STEPS:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Since we're having SSH key issues, please follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Connect to EC2 via AWS Console:" -ForegroundColor White
Write-Host "   - Go to https://console.aws.amazon.com/ec2" -ForegroundColor Gray
Write-Host "   - Select your instance (18.116.44.7)" -ForegroundColor Gray
Write-Host "   - Click 'Connect' → 'Session Manager'" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Upload application files:" -ForegroundColor White
Write-Host "   Option A - Using AWS Console:" -ForegroundColor Gray
Write-Host "     - Zip the cleaning-app folder" -ForegroundColor Gray
Write-Host "     - Use AWS S3 to upload the zip" -ForegroundColor Gray
Write-Host "     - Download on EC2 and extract" -ForegroundColor Gray
Write-Host ""
Write-Host "   Option B - Using Git (RECOMMENDED):" -ForegroundColor Gray
Write-Host "     - Push your code to GitHub" -ForegroundColor Gray
Write-Host "     - On EC2, run: git clone https://github.com/your-repo/cleaning-app.git" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Once connected to EC2, run these commands:" -ForegroundColor White
Write-Host @"
   cd ~/cleaning-app
   bash deploy/setup-ec2-simple.sh
   bash deploy/ec2-deploy.sh
"@ -ForegroundColor Green
Write-Host ""
Write-Host "4️⃣  Setup SSL certificate:" -ForegroundColor White
Write-Host "   sudo certbot --nginx -d premierprime.org -d www.premierprime.org" -ForegroundColor Green
Write-Host "   Email: adaperez@premierprime.org" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣  Configure DNS (if not done):" -ForegroundColor White
Write-Host "   - Go to spaceship.com DNS settings" -ForegroundColor Gray
Write-Host "   - Add A record: @ → 18.116.44.7" -ForegroundColor Gray
Write-Host "   - Add A record: www → 18.116.44.7" -ForegroundColor Gray
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Configuration Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
