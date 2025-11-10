# 🚀 Quick Deployment Guide - Premier Prime Cleaning App

**Ready to deploy your cleaning service app to the web? Here are the fastest options:**

## ⚡ Ultra-Fast Deployment (5 minutes)

### 🥇 Option 1: Railway.app (Recommended)
**Cost:** $20/month | **Difficulty:** ⭐ | **Time:** 5 minutes

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Deploy Premier Prime Cleaning App"
git remote add origin https://github.com/yourusername/premierprime-app.git
git push -u origin main

# 2. Go to https://railway.app
# 3. Sign up → New Project → Deploy from GitHub
# 4. Add PostgreSQL database
# 5. Deploy backend (root: backend) and frontend (root: frontend)
# 6. Add environment variables:
#    - DATABASE_URL: ${{Postgres.DATABASE_URL}}
#    - JWT_SECRET: your-secret-key-here
#    - PORT: 8080
```

**✅ Live at: `https://yourapp.railway.app`**

---

### 🥈 Option 2: Render.com
**Cost:** $25/month | **Difficulty:** ⭐⭐ | **Time:** 10 minutes

```bash
# 1. Go to https://render.com → Sign up
# 2. New → PostgreSQL (note the connection URL)
# 3. New → Web Service (backend)
#    - Repo: your-github-repo
#    - Root: backend
#    - Build: go build -o main cmd/main.go
#    - Start: ./main
#    - Environment: DATABASE_URL, JWT_SECRET, PORT=8080
# 4. New → Static Site (frontend)  
#    - Root: frontend
#    - Build: npm run build
#    - Publish: build
```

**✅ Backend: `https://yourapi.onrender.com`**
**✅ Frontend: `https://yourapp.onrender.com`**

---

### 🥉 Option 3: DigitalOcean App Platform
**Cost:** $35/month | **Difficulty:** ⭐⭐ | **Time:** 15 minutes

```bash
# 1. Go to https://digitalocean.com → Apps → Create App
# 2. Connect GitHub → Select repo
# 3. Add components:
#    - Backend: root=backend, build=go build -o main cmd/main.go
#    - Frontend: root=frontend, build=npm run build
#    - Database: PostgreSQL
# 4. Set environment variables
# 5. Deploy
```

**✅ Live at: `https://yourapp.ondigitalocean.app`**

---

### 🏢 Option 4: AWS (Full Control)
**Cost:** $40-100/month | **Difficulty:** ⭐⭐⭐⭐ | **Time:** 1-2 hours

**Architecture:**
- **RDS PostgreSQL** for database
- **EC2** or **ECS** for backend
- **S3 + CloudFront** for frontend
- **Route 53** for DNS

**Quick Start:**
```bash
# 1. Create RDS PostgreSQL Database
# - Go to AWS Console → RDS → Create Database
# - Choose PostgreSQL 15
# - Select instance size (db.t3.micro for start)
# - Set master username and password
# - Enable public access (for initial setup)
# - Note the endpoint URL

# 2. Seed the Database
# From your local machine with PostgreSQL client installed:
.\seed-database.ps1 -Host "your-rds-endpoint.amazonaws.com" -Database "cleaning_app" -User "postgres"

# Or use the bash version:
./seed-database.sh your-rds-endpoint.amazonaws.com cleaning_app postgres

# 3. Deploy Backend to EC2 or ECS (see AWS_DEPLOYMENT.md for details)

# 4. Deploy Frontend to S3 + CloudFront
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**See [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for complete AWS deployment guide**

---

## 🔧 Quick Setup Commands

Run this from the `cleaning-app` directory:

### Windows (PowerShell):
```powershell
# Make deployment script executable and run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy\deploy.sh
```

### Linux/Mac:
```bash
# Make deployment script executable and run  
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

## 🔐 Essential Environment Variables

Add these to your deployment platform:

```bash
# Required
DATABASE_URL=postgres://user:pass@host:port/dbname
JWT_SECRET=your-super-secret-key-32-chars-minimum
PORT=8080
GIN_MODE=release

# Optional
DOMAIN=yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@domain.com  
SMTP_PASSWORD=your-email-password
```

## ✅ Post-Deployment Checklist

1. **Test the app** → Visit your live URL
2. **Admin login** → Use `admin@premierprime.com` / `admin123`
3. **Change admin password** → Security settings
4. **Test booking flow** → Create a test booking
5. **Test admin features** → Calendar, bookings, quotes
6. **Set up SSL** → Most platforms do this automatically
7. **Configure backups** → Database backups

## 🆘 Common Issues & Fixes

**Frontend won't connect to backend:**
```bash
# Check environment variables
# Ensure CORS is configured properly
# Verify API endpoints
```

**Database connection failed:**
```bash
# Verify DATABASE_URL format
# Check database service is running
# Ensure firewall allows connections
```

**Build failed:**
```bash
# Check Node.js version (18+)
# Check Go version (1.21+)
# Verify package.json and go.mod
```

## 💰 Platform Comparison

| Platform | Monthly Cost | Setup Time | Managed DB | Auto SSL |
|----------|-------------|------------|------------|----------|
| Railway | $20 | 5 min | ✅ | ✅ |
| Render | $25 | 10 min | ✅ | ✅ |
| DigitalOcean | $35 | 15 min | ✅ | ✅ |

## 📞 Support

- **Email:** hello@premierprime.com  
- **Full Guide:** [deploy/README.md](deploy/README.md)
- **Issues:** Create GitHub issues

---

**🎉 Your Premier Prime Cleaning Service will be live and ready to serve customers!**

**Next:** Update admin credentials, test all features, and start taking bookings! 🧹✨