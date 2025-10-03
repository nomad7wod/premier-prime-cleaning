# 🚀 Premier Prime Cleaning App - Deployment Guide

This guide provides step-by-step instructions for deploying the Premier Prime Cleaning Service application to various cloud platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- Docker and Docker Compose installed
- A domain name (for production deployment)
- SSL certificates (Let's Encrypt recommended)
- Environment variables configured

## 🌐 Deployment Options

### 1. Railway (Recommended - Easiest)
### 2. DigitalOcean App Platform
### 3. Render
### 4. AWS EC2 with Docker

---

## 🟩 Option 1: Railway (Simplest & Cheapest)

**Cost:** ~$20/month | **Difficulty:** ⭐ Very Easy | **Time:** 10 minutes

### Steps:

1. **Sign up at Railway.app**
   - Go to https://railway.app
   - Sign up with GitHub account

2. **Push your code to GitHub** (if not already done)
   ```bash
   cd C:\Users\herna\Downloads\premierprime\cleaning-app
   git init
   git add .
   git commit -m "Initial deployment commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/premierprime-cleaning.git
   git push -u origin main
   ```

3. **Create Railway Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. **Deploy Database First**
   - Add service → Database → PostgreSQL
   - Railway will provide connection details automatically

5. **Deploy Backend**
   - Add service → GitHub repo
   - Root directory: `backend`
   - Railway auto-detects Go and builds automatically
   - Add environment variables:
     ```
     PORT=8080
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-super-secret-key-here-32-chars-min
     GIN_MODE=release
     ```

6. **Deploy Frontend**
   - Add service → GitHub repo  
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npx serve -s build -l 80`

**✅ Done! Your app will be live at `https://yourapp.railway.app`**

---

## 🟦 Option 2: DigitalOcean App Platform

**Cost:** ~$25-35/month | **Difficulty:** ⭐⭐ Easy | **Time:** 15 minutes

### Steps:

1. **Create DigitalOcean Account**
   - Sign up at https://digitalocean.com
   - Get $200 credit for new users

2. **Create App Platform Application**
   - Apps → Create App
   - Connect GitHub repository
   - Select your repo and main branch

3. **Configure Components**
   
   **Backend Service:**
   - Name: `backend`
   - Source Directory: `/backend`
   - Build Command: `go build -o main cmd/main.go`
   - Run Command: `./main`
   - HTTP Port: 8080

   **Frontend Service:**
   - Name: `frontend` 
   - Source Directory: `/frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Add Managed Database**
   - Add Component → Database → PostgreSQL
   - Plan: Basic ($15/month)

5. **Environment Variables**
   ```
   PORT=8080
   DB_HOST=${db.HOSTNAME}
   DB_PORT=${db.PORT}
   DB_USER=${db.USERNAME}
   DB_PASSWORD=${db.PASSWORD}
   DB_NAME=${db.DATABASE}
   JWT_SECRET=your-jwt-secret-key-here
   GIN_MODE=release
   ```

6. **Deploy**
   - Review and Create Resources
   - Wait ~10 minutes for build and deployment

---

## 🟪 Option 3: Render

**Cost:** ~$25/month | **Difficulty:** ⭐⭐ Easy | **Time:** 15 minutes

### Steps:

1. **Create Render Account**
   - Sign up at https://render.com
   - Connect GitHub account

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Name: `premierprime-db`
   - Note the Internal Database URL

3. **Deploy Backend Web Service**
   - New → Web Service
   - Connect GitHub repository
   - Root Directory: `backend`
   - Environment: Go
   - Build Command: `go build -o main cmd/main.go`
   - Start Command: `./main`
   - Add Environment Variables:
     ```
     PORT=8080
     DATABASE_URL=[Internal Database URL from step 2]
     JWT_SECRET=your-super-secret-jwt-key
     GIN_MODE=release
     ```

4. **Deploy Frontend Static Site**
   - New → Static Site
   - Connect same GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `build`

**✅ Your backend will be at `https://yourapp.onrender.com`**
**✅ Your frontend will be at `https://yourfrontend.onrender.com`**

---

## 🟧 Option 4: AWS EC2 (Advanced)

**Cost:** ~$20-40/month | **Difficulty:** ⭐⭐⭐ Medium | **Time:** 45 minutes

### Steps:

1. **Launch EC2 Instance**
   - Instance Type: t3.small (2 vCPU, 2GB RAM)
   - AMI: Ubuntu 22.04 LTS
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
   - Key Pair: Create and download .pem file

2. **Connect to Instance**
   ```bash  
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   newgrp docker
   
   # Install Git  
   sudo apt install git -y
   ```

4. **Clone and Setup Application**
   ```bash
   git clone https://github.com/yourusername/premierprime-cleaning.git
   cd premierprime-cleaning/cleaning-app
   
   # Create environment file
   cp .env.example .env
   nano .env  # Edit with your secure values
   ```

5. **Get SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot -y
   sudo certbot certonly --standalone -d yourdomain.com
   
   # Copy SSL certificates
   sudo mkdir -p nginx/ssl
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
   sudo chown ubuntu:ubuntu nginx/ssl/*
   ```

6. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

**✅ Your app will be live at `https://yourdomain.com`**

---

## 🔧 Production Environment Setup

Create a `.env` file with these secure values:

```bash
# Database Configuration
DB_PASSWORD=super-secure-password-123-change-this
JWT_SECRET=your-super-secret-jwt-signing-key-must-be-32-characters-minimum

# Domain (for SSL)
DOMAIN=yourdomain.com

# Email Configuration (optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-email-app-password
```

## 🔒 Security Checklist

- ✅ Use strong, unique passwords (20+ characters)
- ✅ Enable HTTPS/SSL encryption
- ✅ Configure firewall rules (only necessary ports open)
- ✅ Regular security updates
- ✅ Database backups configured
- ✅ Environment variables for all secrets
- ✅ Rate limiting enabled (configured in nginx)

## 📊 Post-Deployment Testing

Test these features after deployment:

1. **Frontend Access**
   - ✅ Website loads properly
   - ✅ Navigation works
   - ✅ Responsive design on mobile

2. **User Features** 
   - ✅ Guest booking system
   - ✅ User registration/login
   - ✅ Quote request system
   - ✅ Contact form

3. **Admin Features**
   - ✅ Admin login (`admin@premierprime.com` / `admin123`)
   - ✅ Dashboard access
   - ✅ Booking management
   - ✅ Calendar views
   - ✅ Invoice generation

## 🆘 Troubleshooting Common Issues

### Database Connection Failed
```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
docker exec -it postgres-container psql -U postgres -d cleaning_app -c "SELECT 1;"
```

### Frontend Won't Load
```bash
# Check if frontend container is running
docker ps

# Check frontend logs
docker logs frontend-container-name

# Verify API endpoint in frontend config
```

### SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew
```

## 💰 Platform Comparison

| Platform | Monthly Cost | Difficulty | Auto-Deploy | Managed DB | SSL | Scaling |
|----------|-------------|------------|-------------|------------|-----|---------|
| Railway | $20 | ⭐ | ✅ | ✅ | ✅ | ✅ |
| Render | $25 | ⭐⭐ | ✅ | ✅ | ✅ | ✅ |
| DigitalOcean | $35 | ⭐⭐ | ✅ | ✅ | ✅ | ✅ |
| AWS EC2 | $30 | ⭐⭐⭐ | ❌ | ❌ | Manual | Manual |

**🎯 Recommendation:** 
- **Beginners:** Railway (easiest setup)
- **Growing Business:** DigitalOcean (best balance)
- **Advanced Users:** AWS (most control)

## 📞 Support

Need help with deployment?
- **Email:** hello@premierprime.com
- **Documentation:** Check individual README files
- **Issues:** Create GitHub issues for bugs

---

**🎉 Congratulations! Your Premier Prime Cleaning Service app is now live and ready to serve customers worldwide!**

**Next Steps:**
1. Update admin credentials
2. Configure email notifications
3. Set up analytics
4. Configure automated backups
5. Test all booking flows