# Premier Prime - Simple Deployment to AWS EC2
# Run this script from your LOCAL Windows machine

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2_IP,
    
    [Parameter(Mandatory=$true)]
    [string]$RDS_ENDPOINT,
    
    [Parameter(Mandatory=$true)]
    [string]$DB_PASSWORD,
    
    [string]$KeyFile = ".\deploy\premierprime-key.pem"
)

$ErrorActionPreference = "Stop"

Write-Host @"

=========================================
  Premier Prime AWS Deployment
=========================================

EC2 IP: $EC2_IP
RDS: $RDS_ENDPOINT
Key: $KeyFile

"@ -ForegroundColor Cyan

# Validate key file
if (!(Test-Path $KeyFile)) {
    Write-Host "❌ Key file not found: $KeyFile" -ForegroundColor Red
    exit 1
}

Write-Host "[1/6] Building frontend..." -ForegroundColor Green
Set-Location frontend

# Create production env
@"
REACT_APP_API_URL=https://premierprime.org/api
"@ | Out-File -FilePath .env.production -Encoding UTF8 -NoNewline

npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Set-Location ..

Write-Host "✅ Frontend built" -ForegroundColor Green

Write-Host "`n[2/6] Creating deployment package..." -ForegroundColor Green

# Create temp directory
$tempDir = ".\deploy\temp-deploy"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files
Copy-Item -Path frontend\build -Destination $tempDir\frontend -Recurse
Copy-Item -Path backend -Destination $tempDir\backend -Recurse -Exclude node_modules,*.exe
Copy-Item -Path deploy\setup-ec2-simple.sh -Destination $tempDir\setup.sh

Write-Host "✅ Package created" -ForegroundColor Green

Write-Host "`n[3/6] Uploading to EC2..." -ForegroundColor Green
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Upload setup script first
scp -i $KeyFile -o StrictHostKeyChecking=no $tempDir\setup.sh ubuntu@${EC2_IP}:~/setup.sh
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to upload setup script" -ForegroundColor Red
    exit 1
}

# Upload application files
scp -i $KeyFile -r $tempDir\frontend ubuntu@${EC2_IP}:/tmp/
scp -i $KeyFile -r $tempDir\backend ubuntu@${EC2_IP}:/tmp/

Write-Host "✅ Files uploaded" -ForegroundColor Green

Write-Host "`n[4/6] Running setup on EC2..." -ForegroundColor Green

ssh -i $KeyFile ubuntu@$EC2_IP @"
chmod +x ~/setup.sh
sudo ~/setup.sh
sudo mkdir -p /opt/premierprime
sudo chown -R ubuntu:ubuntu /opt/premierprime
mv /tmp/frontend /opt/premierprime/
mv /tmp/backend /opt/premierprime/
"@

Write-Host "✅ EC2 setup complete" -ForegroundColor Green

Write-Host "`n[5/6] Configuring backend..." -ForegroundColor Green

$envContent = @"
PORT=8080
DB_HOST=$RDS_ENDPOINT
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=$DB_PASSWORD
DB_NAME=cleaning_app
JWT_SECRET=$(New-Guid)$(New-Guid)
GIN_MODE=release
CORS_ORIGIN=https://premierprime.org,http://premierprime.org
"@

$envContent | Out-File -FilePath $tempDir\.env -Encoding UTF8 -NoNewline
scp -i $KeyFile $tempDir\.env ubuntu@${EC2_IP}:/opt/premierprime/backend/.env

Write-Host "✅ Backend configured" -ForegroundColor Green

Write-Host "`n[6/6] Starting application..." -ForegroundColor Green

ssh -i $KeyFile ubuntu@$EC2_IP @"
# Install Go if not present
if ! command -v go &> /dev/null; then
    echo 'Installing Go...'
    wget -q https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
    echo 'export PATH=\$PATH:/usr/local/go/bin' >> ~/.bashrc
    export PATH=\$PATH:/usr/local/go/bin
fi

# Build and run backend
cd /opt/premierprime/backend
go mod download
go build -o server .

# Create systemd service
sudo tee /etc/systemd/system/premierprime.service > /dev/null << 'SVCEOF'
[Unit]
Description=Premier Prime Cleaning App
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/premierprime/backend
Environment=PATH=/usr/local/go/bin:/usr/bin:/bin
ExecStart=/opt/premierprime/backend/server
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVCEOF

# Start service
sudo systemctl daemon-reload
sudo systemctl enable premierprime
sudo systemctl start premierprime
sudo systemctl status premierprime --no-pager

# Check if backend is running
sleep 3
curl -f http://localhost:8080/api/health || echo 'Backend not responding yet, check logs: sudo journalctl -u premierprime -f'
"@

Write-Host "✅ Application started" -ForegroundColor Green

# Cleanup
Remove-Item -Recurse -Force $tempDir

Write-Host @"

=========================================
  ✅ Deployment Complete!
=========================================

Your application is running!

🌐 Test URLs:
   - http://$EC2_IP  (before DNS)
   - http://$EC2_IP/api/health  (API test)

📋 Next Steps:

1. Configure DNS on Spaceship.com:
   Domain: premierprime.org
   Add A Record: @ → $EC2_IP
   Add A Record: www → $EC2_IP

2. Setup SSL (after DNS propagates):
   SSH to EC2: ssh -i $KeyFile ubuntu@$EC2_IP
   Run: sudo certbot --nginx -d premierprime.org -d www.premierprime.org

3. Seed Database:
   .\seed-database.ps1 -Host "$RDS_ENDPOINT" -Database "cleaning_app" -User "postgres"

4. Access Admin:
   URL: https://premierprime.org/admin
   Email: adaperez@premierprime.org
   Password: admin123 (CHANGE THIS!)

📊 Monitor Application:
   ssh -i $KeyFile ubuntu@$EC2_IP
   sudo journalctl -u premierprime -f

🔧 Manage Service:
   sudo systemctl status premierprime
   sudo systemctl restart premierprime
   sudo systemctl stop premierprime

=========================================

"@ -ForegroundColor Green

Write-Host "💡 Tip: DNS propagation takes 5-60 minutes. Test with IP first!" -ForegroundColor Yellow
