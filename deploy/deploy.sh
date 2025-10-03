#!/bin/bash

# Premier Prime Cleaning App - Universal Deployment Script
# This script prepares your app for deployment on any platform

echo "🏢 Premier Prime Cleaning Service - Deployment Preparation"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the cleaning-app directory"
    exit 1
fi

echo "📦 Preparing application for deployment..."

# Create production environment template
cat > .env.production << EOF
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
EOF

echo "✅ Production environment template created (.env.production)"

# Create health check endpoint for backend (if not exists)
if [ ! -f "backend/internal/handlers/health.go" ]; then
    mkdir -p backend/internal/handlers
    cat > backend/internal/handlers/health.go << EOF
package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
		"service": "Premier Prime Cleaning API",
		"version": "1.0.0",
		"timestamp": time.Now().Unix(),
	})
}
EOF
    echo "✅ Health check endpoint created"
fi

# Update frontend package.json for production
cd frontend
if [ -f "package.json" ]; then
    # Install serve for production deployment
    npm install --save serve
    
    # Update package.json if needed
    if ! grep -q "serve -s build" package.json; then
        # Add production start script
        sed -i '/"scripts": {/a \    "start:prod": "serve -s build -l $PORT",' package.json
    fi
    
    echo "✅ Frontend configured for production"
fi
cd ..

# Create Docker ignore file
cat > .dockerignore << EOF
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
EOF

echo "✅ .dockerignore created"

# Create GitHub Actions workflow for CI/CD
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << EOF
name: Deploy Premier Prime Cleaning App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Go
      uses: actions/setup-go@v3
      with:
        go-version: 1.23
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Test Backend
      run: |
        cd backend
        go mod tidy
        go test ./...
    
    - name: Test Frontend
      run: |
        cd frontend
        npm install
        npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      run: |
        echo "🚀 Deploy to your chosen platform here"
        echo "This workflow can be customized for your deployment target"
EOF

echo "✅ GitHub Actions workflow created"

# Create security.md for security policy
cat > SECURITY.md << EOF
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Premier Prime Cleaning App, please report it by emailing hello@premierprime.com.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and provide updates as we work on a fix.

## Security Measures

- Passwords are hashed using bcrypt with cost factor 14
- JWT tokens for authentication with configurable expiry
- Input validation on all endpoints
- SQL injection protection through parameterized queries
- CORS policies implemented
- Rate limiting on authentication endpoints
- HTTPS enforced in production
- Security headers configured in nginx
EOF

echo "✅ Security policy created"

echo ""
echo "🎯 Deployment Preparation Complete!"
echo "=================================="
echo ""
echo "📁 Files created:"
echo "   ✅ .env.production (template)"
echo "   ✅ .dockerignore"
echo "   ✅ .github/workflows/deploy.yml"
echo "   ✅ SECURITY.md"
echo "   ✅ Health check endpoint"
echo ""
echo "🚀 Choose your deployment platform:"
echo ""
echo "   1️⃣  Railway (Easiest)     → Run: chmod +x deploy/railway-start.sh && ./deploy/railway-start.sh"
echo "   2️⃣  Render (Simple)       → Upload deploy/render.yaml to Render"
echo "   3️⃣  DigitalOcean (Pro)    → Upload deploy/digitalocean-app.yaml"
echo "   4️⃣  AWS/VPS (Advanced)    → Use docker-compose.prod.yml"
echo ""
echo "📖 Full deployment guide: ./deploy/README.md"
echo ""
echo "🔐 IMPORTANT SECURITY REMINDERS:"
echo "   ⚠️  Update .env.production with secure passwords"
echo "   ⚠️  Change default admin password after deployment"
echo "   ⚠️  Use SSL/HTTPS in production"
echo "   ⚠️  Set up regular database backups"
echo ""
echo "📞 Need help? Email: hello@premierprime.com"
echo ""
echo "🎉 Your Premier Prime Cleaning App is ready for deployment!"