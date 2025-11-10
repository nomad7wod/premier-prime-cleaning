# Migrate from EC2 + RDS to Single EC2 (Cost Optimization)
# This will save ~$20-30/month

param(
    [switch]$SkipBackup = $false
)

$ErrorActionPreference = "Stop"
$config = Get-Content "deploy\aws-config.json" | ConvertFrom-Json

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Migrate to Single EC2 (Save Money!)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Current Monthly Cost: ~$30-40" -ForegroundColor Red
Write-Host "New Monthly Cost: ~$8-10" -ForegroundColor Green
Write-Host "Monthly Savings: ~$20-30`n" -ForegroundColor Yellow

# Step 1: Backup RDS data
if (-not $SkipBackup) {
    Write-Host "[Step 1/6] Backing up RDS database..." -ForegroundColor Yellow
    
    Write-Host "Creating database backup..." -ForegroundColor Cyan
    
    # Export database to SQL file
    $backupFile = "deploy\database-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
    
    Write-Host "Run this command to backup (requires PostgreSQL client):" -ForegroundColor Yellow
    Write-Host "pg_dump -h $($config.DB_HOST) -U $($config.DB_USER) -d $($config.DB_NAME) -f $backupFile" -ForegroundColor Cyan
    Write-Host ""
    
    $continue = Read-Host "Have you backed up the database? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Please backup first!" -ForegroundColor Red
        exit
    }
}

# Step 2: Connect to EC2 and setup
Write-Host "`n[Step 2/6] Setting up EC2 instance..." -ForegroundColor Yellow

Write-Host "Creating EC2 setup script..." -ForegroundColor Cyan

$setupScript = @"
#!/bin/bash
set -e

echo "🚀 Setting up Premier Prime App on EC2..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install -y git

# Create application directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

echo "✅ EC2 setup complete!"
"@

$setupScript | Out-File "deploy\ec2-setup.sh" -Encoding UTF8

Write-Host "✅ Setup script created" -ForegroundColor Green

# Step 3: Upload application
Write-Host "`n[Step 3/6] Preparing application files..." -ForegroundColor Yellow

# Create optimized docker-compose for single EC2
$dockerCompose = @"
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: premierprime-db
    restart: always
    environment:
      POSTGRES_DB: cleaning_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: $($config.DB_PASSWORD)
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: premierprime-backend
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:$($config.DB_PASSWORD)@postgres:5432/cleaning_app
      JWT_SECRET: your-secret-key-change-this
      PORT: 8080
    ports:
      - "8080:8080"
    volumes:
      - ./backend:/app
      - /app/node_modules

  # Frontend (Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: premierprime-frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro

volumes:
  postgres_data:
    driver: local

networks:
  default:
    name: premierprime-network
"@

$dockerCompose | Out-File "deploy\docker-compose-ec2.yml" -Encoding UTF8

Write-Host "✅ Docker Compose config created" -ForegroundColor Green

# Step 4: Create deployment script
Write-Host "`n[Step 4/6] Creating deployment script..." -ForegroundColor Yellow

$deployScript = @"
#!/bin/bash
set -e

echo "🚀 Deploying Premier Prime App..."

# Stop existing containers
docker-compose down || true

# Pull latest images
docker-compose -f docker-compose-ec2.yml pull || true

# Build and start
docker-compose -f docker-compose-ec2.yml up -d --build

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
docker-compose -f docker-compose-ec2.yml ps

echo "✅ Deployment complete!"
echo "📊 App running at: http://\$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
"@

$deployScript | Out-File "deploy\deploy-ec2.sh" -Encoding UTF8

# Step 5: Instructions
Write-Host "`n[Step 5/6] Manual deployment steps..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Copy these commands and run them:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# 1. Connect to EC2" -ForegroundColor Green
Write-Host "ssh -i `"deploy\premierprime-key.pem`" ec2-user@$($config.EC2_PUBLIC_IP)" -ForegroundColor White
Write-Host ""
Write-Host "# 2. Setup EC2 (run once)" -ForegroundColor Green
Write-Host "bash ec2-setup.sh" -ForegroundColor White
Write-Host ""
Write-Host "# 3. Upload your app files" -ForegroundColor Green
Write-Host "scp -i `"deploy\premierprime-key.pem`" -r backend frontend docker-compose-ec2.yml deploy-ec2.sh ec2-user@$($config.EC2_PUBLIC_IP):~/app/" -ForegroundColor White
Write-Host ""
Write-Host "# 4. Deploy" -ForegroundColor Green
Write-Host "cd ~/app && bash deploy-ec2.sh" -ForegroundColor White
Write-Host ""

# Step 6: Cleanup RDS
Write-Host "`n[Step 6/6] Cleanup old RDS (after verifying app works)" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  ONLY run this AFTER you verify the app works on EC2!" -ForegroundColor Red
Write-Host ""
Write-Host "To delete RDS and save money:" -ForegroundColor Yellow
Write-Host "aws rds delete-db-instance --db-instance-identifier premierprime-db --skip-final-snapshot --region us-east-2" -ForegroundColor White
Write-Host ""

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Files created in deploy/ folder" -ForegroundColor Green
Write-Host "✅ Follow the manual steps above" -ForegroundColor Green
Write-Host "✅ After verification, delete RDS to save ~$20-30/month" -ForegroundColor Green
Write-Host ""
Write-Host "💰 New monthly cost: ~$8-10 (EC2 t3.micro only)" -ForegroundColor Yellow
Write-Host ""
