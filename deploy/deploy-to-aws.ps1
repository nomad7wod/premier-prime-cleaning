# Premier Prime Cleaning App - Complete AWS Deployment Script
# This script deploys the full application to AWS EC2 + RDS

param(
    [string]$RDSEndpoint = "",
    [string]$DBPassword = "",
    [string]$EC2PublicIP = "",
    [string]$KeyPairPath = "",
    [switch]$SkipBuild
)

Write-Host @"

=================================================
  Premier Prime Cleaning App - AWS Deployment
=================================================

This script will:
1. Build the frontend and backend
2. Upload files to EC2
3. Configure Docker Compose
4. Set up Nginx with SSL
5. Configure your domain

"@ -ForegroundColor Cyan

# Step 1: Get information from user
if ([string]::IsNullOrEmpty($RDSEndpoint)) {
    $RDSEndpoint = Read-Host "Enter your RDS Endpoint (e.g., premierprime-db.xxx.us-east-2.rds.amazonaws.com)"
}

if ([string]::IsNullOrEmpty($DBPassword)) {
    $DBPassword = Read-Host "Enter your RDS Master Password" -AsSecureString
    $DBPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DBPassword))
}

if ([string]::IsNullOrEmpty($EC2PublicIP)) {
    $EC2PublicIP = Read-Host "Enter your EC2 Public IP Address"
}

if ([string]::IsNullOrEmpty($KeyPairPath)) {
    $KeyPairPath = Read-Host "Enter path to your .pem key file"
}

Write-Host "`n[1/7] Validating inputs..." -ForegroundColor Green
if (!(Test-Path $KeyPairPath)) {
    Write-Host "Error: Key file not found at $KeyPairPath" -ForegroundColor Red
    exit 1
}

# Step 2: Build the application
if (!$SkipBuild) {
    Write-Host "`n[2/7] Building application..." -ForegroundColor Green
    
    # Build frontend
    Write-Host "Building frontend..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot\..\frontend"
    
    # Create production env file
    @"
REACT_APP_API_URL=https://premierprime.org/api
"@ | Out-File -FilePath .env.production -Encoding UTF8
    
    npm install
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Frontend build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "`n[2/7] Skipping build (using existing build)..." -ForegroundColor Yellow
}

# Step 3: Create deployment package
Write-Host "`n[3/7] Creating deployment package..." -ForegroundColor Green
Set-Location "$PSScriptRoot\.."

$deployDir = "$PSScriptRoot\aws-deploy-package"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy necessary files
Copy-Item -Recurse backend $deployDir\backend
Copy-Item -Recurse frontend\build $deployDir\frontend
Copy-Item docker-compose.prod.yml $deployDir\docker-compose.yml
Copy-Item -Recurse nginx $deployDir\nginx

# Create .env file for production
@"
PORT=8080
DB_HOST=$RDSEndpoint
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=$DBPassword
DB_NAME=cleaning_app
JWT_SECRET=$(New-Guid)$(New-Guid)
GIN_MODE=release
CORS_ORIGIN=https://premierprime.org
"@ | Out-File -FilePath $deployDir\.env -Encoding UTF8

Write-Host "✓ Deployment package created" -ForegroundColor Green

# Step 4: Update Nginx configuration
Write-Host "`n[4/7] Updating Nginx configuration..." -ForegroundColor Green

$nginxConfig = @"
server {
    listen 80;
    server_name premierprime.org www.premierprime.org;
    
    # Redirect HTTP to HTTPS
    return 301 https://`$host`$request_uri;
}

server {
    listen 443 ssl http2;
    server_name premierprime.org www.premierprime.org;
    
    # SSL will be configured by Certbot
    ssl_certificate /etc/letsencrypt/live/premierprime.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/premierprime.org/privkey.pem;
    
    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
}
"@

$nginxConfig | Out-File -FilePath $deployDir\nginx\nginx.conf -Encoding UTF8

# Step 5: Create setup script for EC2
Write-Host "`n[5/7] Creating EC2 setup script..." -ForegroundColor Green

$ec2SetupScript = @'
#!/bin/bash
set -e

echo "=========================================="
echo " Premier Prime - EC2 Setup Script"
echo "=========================================="

# Update system
echo "[1/6] Updating system..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "[2/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
fi

# Install Docker Compose
echo "[3/6] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx
echo "[4/6] Installing Nginx..."
sudo apt-get install -y nginx

# Install Certbot for SSL
echo "[5/6] Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Setup application directory
echo "[6/6] Setting up application..."
sudo mkdir -p /opt/premierprime
sudo chown ubuntu:ubuntu /opt/premierprime

echo "✓ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload application files to /opt/premierprime"
echo "2. Run: cd /opt/premierprime && docker-compose up -d"
echo "3. Setup SSL: sudo certbot --nginx -d premierprime.org -d www.premierprime.org"
'@

$ec2SetupScript | Out-File -FilePath $deployDir\setup-ec2.sh -Encoding UTF8

# Step 6: Upload to EC2
Write-Host "`n[6/7] Uploading files to EC2..." -ForegroundColor Green
Write-Host "EC2 IP: $EC2PublicIP" -ForegroundColor Cyan

# First, run the setup script
Write-Host "Running initial setup on EC2..." -ForegroundColor Yellow
scp -i $KeyPairPath -o StrictHostKeyChecking=no $deployDir\setup-ec2.sh ubuntu@${EC2PublicIP}:~/setup-ec2.sh
ssh -i $KeyPairPath -o StrictHostKeyChecking=no ubuntu@$EC2PublicIP "chmod +x ~/setup-ec2.sh && ~/setup-ec2.sh"

# Upload application files
Write-Host "Uploading application files..." -ForegroundColor Yellow
scp -i $KeyPairPath -r $deployDir/* ubuntu@${EC2PublicIP}:/opt/premierprime/

Write-Host "✓ Files uploaded successfully" -ForegroundColor Green

# Step 7: Deploy application
Write-Host "`n[7/7] Deploying application on EC2..." -ForegroundColor Green

$deployCommands = @'
cd /opt/premierprime
docker-compose down 2>/dev/null || true
docker-compose up -d
docker-compose ps
'@

ssh -i $KeyPairPath ubuntu@$EC2PublicIP $deployCommands

Write-Host @"

=================================================
  ✓ Deployment Complete!
=================================================

Your application is now running on EC2!

Next Steps:
-----------
1. Configure DNS (Spaceship.com):
   - Add A Record: @ → $EC2PublicIP
   - Add A Record: www → $EC2PublicIP
   
2. Setup SSL Certificate:
   SSH to EC2: ssh -i $KeyPairPath ubuntu@$EC2PublicIP
   Run: sudo certbot --nginx -d premierprime.org -d www.premierprime.org
   
3. Test the application:
   - Frontend: http://$EC2PublicIP (then https://premierprime.org after DNS)
   - Backend API: http://${EC2PublicIP}/api/health
   
4. Monitor logs:
   ssh -i $KeyPairPath ubuntu@$EC2PublicIP
   cd /opt/premierprime
   docker-compose logs -f

Admin Login:
-----------
URL: https://premierprime.org/admin
Email: adaperez@premierprime.org
Password: admin123 (CHANGE THIS!)

=================================================

"@ -ForegroundColor Green

Write-Host "Deployment log saved to: $deployDir\deployment.log" -ForegroundColor Cyan
