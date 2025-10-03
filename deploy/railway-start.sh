#!/bin/bash

# Railway deployment script for Premier Prime Cleaning App
# This script helps set up the app on Railway.app

echo "🚂 Premier Prime Cleaning App - Railway Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the cleaning-app directory"
    exit 1
fi

echo "📦 Setting up environment for Railway deployment..."

# Create railway.json for service configuration
cat > railway.json << EOF
{
  "\$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "backend/Dockerfile"
  },
  "deploy": {
    "startCommand": "./main",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

echo "✅ railway.json created"

# Create Procfile for the backend
cat > backend/Procfile << EOF
web: ./main
EOF

echo "✅ Backend Procfile created"

# Create package.json start script fix for frontend
cd frontend
if [ -f "package.json" ]; then
    # Add serve dependency and update start script for production
    npm install --save serve
    
    # Update package.json start script
    sed -i 's/"start": "react-scripts start"/"start": "serve -s build -l \$PORT"/' package.json
    
    echo "✅ Frontend package.json updated for Railway"
fi
cd ..

# Create .env.example specifically for Railway
cat > .env.railway << EOF
# Railway Environment Variables Template
# Copy these to your Railway service environment variables

# Database (Railway PostgreSQL provides this automatically)
DATABASE_URL=\${{Postgres.DATABASE_URL}}

# Backend Configuration  
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
GIN_MODE=release

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@domain.com
SMTP_PASSWORD=your-email-app-password
EOF

echo "✅ Railway environment template created (.env.railway)"

echo ""
echo "🎯 Next Steps for Railway Deployment:"
echo "======================================"
echo ""
echo "1. Push your code to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial Railway deployment'"
echo "   git remote add origin https://github.com/yourusername/premierprime-app.git"
echo "   git push -u origin main"
echo ""
echo "2. Go to https://railway.app and sign up"
echo ""  
echo "3. Create a new project → Deploy from GitHub"
echo ""
echo "4. Add PostgreSQL database service first"
echo ""
echo "5. Add backend service:"
echo "   - Root Directory: backend"
echo "   - Add environment variables from .env.railway"
echo ""
echo "6. Add frontend service:"
echo "   - Root Directory: frontend"  
echo "   - Build Command: npm run build"
echo "   - Start Command: npm start"
echo ""
echo "🎉 Your app will be live at https://yourapp.railway.app"
echo ""
echo "📞 Need help? Email: hello@premierprime.com"