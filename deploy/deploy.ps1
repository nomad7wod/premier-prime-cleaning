# Premier Prime Cleaning App - Windows Deployment Script
# Run this script from PowerShell in the cleaning-app directory

Write-Host "Premier Prime Cleaning Service - Deployment Preparation" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "Error: Please run this script from the cleaning-app directory" -ForegroundColor Red
    exit 1
}

Write-Host "Preparing application for deployment..." -ForegroundColor Yellow

# Create production environment template
$envContent = @"
# Production Environment Variables
# IMPORTANT: Change all these values for production!

# Database Configuration
DB_HOST=your-database-host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=CHANGE-THIS-SUPER-SECURE-PASSWORD-123
DB_NAME=cleaning_app
DATABASE_URL=postgres://postgres:CHANGE-THIS-PASSWORD@your-host:5432/cleaning_app

# Application Configuration
PORT=8080
JWT_SECRET=CHANGE-THIS-TO-A-VERY-SECURE-SECRET-KEY-32-CHARACTERS-MINIMUM
GIN_MODE=release

# Domain Configuration (for SSL)
DOMAIN=yourdomain.com

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-email-app-password
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "Production environment template created (.env.production)" -ForegroundColor Green

# Create .dockerignore
$dockerIgnoreContent = @"
node_modules
npm-debug.log
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.git
.gitignore
logs
*.log
README.md
deploy/
"@

$dockerIgnoreContent | Out-File -FilePath ".dockerignore" -Encoding UTF8
Write-Host ".dockerignore created" -ForegroundColor Green

# Update frontend for production
Set-Location frontend
if (Test-Path "package.json") {
    Write-Host "Installing serve for production deployment..." -ForegroundColor Yellow
    npm install --save serve
    Write-Host "Frontend configured for production" -ForegroundColor Green
}
Set-Location ..

Write-Host ""
Write-Host "Deployment Preparation Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Cyan
Write-Host "   .env.production (template)" -ForegroundColor White
Write-Host "   .dockerignore" -ForegroundColor White
Write-Host ""
Write-Host "Choose your deployment platform:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Railway (Easiest - 20 dollars/month)" -ForegroundColor Yellow
Write-Host "      Go to https://railway.app" -ForegroundColor White
Write-Host "      New Project -> Deploy from GitHub" -ForegroundColor White
Write-Host "      Add PostgreSQL + Backend + Frontend services" -ForegroundColor White
Write-Host ""
Write-Host "   2. Render (Simple - 25 dollars/month)" -ForegroundColor Yellow  
Write-Host "      Go to https://render.com" -ForegroundColor White
Write-Host "      Upload deploy/render.yaml blueprint" -ForegroundColor White
Write-Host ""
Write-Host "   3. DigitalOcean (Professional - 35 dollars/month)" -ForegroundColor Yellow
Write-Host "      Go to https://digitalocean.com/apps" -ForegroundColor White
Write-Host "      Upload deploy/digitalocean-app.yaml" -ForegroundColor White
Write-Host ""
Write-Host "Full deployment guide: ./deploy/README.md" -ForegroundColor Cyan
Write-Host "Quick guide: ./DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT SECURITY REMINDERS:" -ForegroundColor Red
Write-Host "   Update .env.production with secure passwords" -ForegroundColor White
Write-Host "   Change default admin password after deployment" -ForegroundColor White
Write-Host "   Use SSL/HTTPS in production" -ForegroundColor White
Write-Host "   Set up regular database backups" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Email: hello@premierprime.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your Premier Prime Cleaning App is ready for deployment!" -ForegroundColor Green

# Open deployment guide
Write-Host ""
Write-Host "Opening deployment guide..." -ForegroundColor Yellow
Start-Process notepad.exe DEPLOYMENT.md