# 🚀 Deploy Premier Prime to AWS - Quick Guide

## What You Have
- ✅ AWS Account configured (us-east-2)
- ✅ RDS Database running
- ✅ EC2 Instance running
- ✅ Domain: premierprime.org (from Spaceship.com)

## What We'll Do Now

### Step 1: Get Your AWS Resource Information

1. **Get RDS Endpoint:**
   - Go to AWS Console → RDS → Databases
   - Click on your database instance
   - Copy the **Endpoint** (looks like: `xxx.us-east-2.rds.amazonaws.com`)
   - Save your database password

2. **Get EC2 IP Address:**
   - Go to AWS Console → EC2 → Instances
   - Click on your instance
   - Copy the **Public IPv4 address**
   - Download your `.pem` key file if you haven't

### Step 2: Build and Deploy

From PowerShell in your project folder, run:

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app

# Run the deployment script
.\deploy\deploy-to-aws.ps1
```

The script will ask you for:
- RDS Endpoint
- Database Password
- EC2 Public IP
- Path to your .pem key file

### Step 3: Configure Domain (Spaceship.com)

1. Log in to Spaceship.com
2. Go to your domain **premierprime.org**
3. Click on **DNS Settings**
4. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | [Your EC2 IP] | 3600 |
| A | www | [Your EC2 IP] | 3600 |
| CNAME | api | premierprime.org | 3600 |

5. Save changes (DNS can take 5-60 minutes to propagate)

### Step 4: Setup SSL Certificate

SSH to your EC2 instance:

```powershell
ssh -i "path\to\your-key.pem" ubuntu@[EC2-IP-ADDRESS]
```

Then run:

```bash
# Install SSL certificate
sudo certbot --nginx -d premierprime.org -d www.premierprime.org

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS

# Restart nginx
sudo systemctl restart nginx

# Check application status
cd /opt/premierprime
docker-compose ps
docker-compose logs -f
```

### Step 5: Seed the Database

From your local machine:

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app

# Install PostgreSQL client (psql) if not installed
# Download from: https://www.postgresql.org/download/windows/

# Run seeding script
.\seed-database.ps1 -Host "YOUR-RDS-ENDPOINT" -Database "cleaning_app" -User "postgres"
```

Enter your database password when prompted.

### Step 6: Test Your Application

1. **Check if backend is running:**
   ```
   https://premierprime.org/api/health
   ```
   Should return: `{"status":"healthy"}`

2. **Open your website:**
   ```
   https://premierprime.org
   ```

3. **Login to admin:**
   ```
   https://premierprime.org/admin
   Email: adaperez@premierprime.org
   Password: admin123
   ```
   
   ⚠️ **CHANGE THIS PASSWORD IMMEDIATELY!**

---

## Quick Deployment Script (Alternative)

If the automated script doesn't work, here's a manual approach:

### 1. Build Frontend

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app\frontend

# Create production config
echo "REACT_APP_API_URL=https://premierprime.org/api" > .env.production

# Build
npm install
npm run build
```

### 2. Upload to EC2

```powershell
# From project root
cd C:\Users\herna\Downloads\premierprime\cleaning-app

# Upload files (replace with your details)
scp -i "your-key.pem" -r backend ubuntu@[EC2-IP]:/opt/premierprime/
scp -i "your-key.pem" -r frontend/build ubuntu@[EC2-IP]:/opt/premierprime/frontend
scp -i "your-key.pem" -r nginx ubuntu@[EC2-IP]:/opt/premierprime/
scp -i "your-key.pem" docker-compose.prod.yml ubuntu@[EC2-IP]:/opt/premierprime/docker-compose.yml
```

### 3. Setup on EC2

SSH to EC2:

```powershell
ssh -i "your-key.pem" ubuntu@[EC2-IP]
```

Then on EC2:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx & Certbot
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Create app directory
sudo mkdir -p /opt/premierprime
sudo chown ubuntu:ubuntu /opt/premierprime

# Create .env file
cd /opt/premierprime
cat > .env << EOF
PORT=8080
DB_HOST=YOUR-RDS-ENDPOINT
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR-DB-PASSWORD
DB_NAME=cleaning_app
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars-long
GIN_MODE=release
CORS_ORIGIN=https://premierprime.org
EOF

# Start application
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs
```

---

## Troubleshooting

### Can't connect to database
```bash
# Test database connection from EC2
psql -h YOUR-RDS-ENDPOINT -U postgres -d cleaning_app

# If it fails, check RDS Security Group:
# 1. Go to AWS Console → RDS → Your DB → Connectivity & security
# 2. Click on the VPC security group
# 3. Edit inbound rules
# 4. Add rule: Type=PostgreSQL, Port=5432, Source=[EC2 Security Group]
```

### Docker containers not starting
```bash
# Check logs
cd /opt/premierprime
docker-compose logs backend
docker-compose logs frontend

# Restart containers
docker-compose restart

# Rebuild if needed
docker-compose down
docker-compose up -d --build
```

### Website not loading
1. Check EC2 Security Group allows ports 80 and 443
2. Check if nginx is running: `sudo systemctl status nginx`
3. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Verify DNS has propagated: `nslookup premierprime.org`

---

## Monthly Costs Estimate

- **EC2 t3.small**: ~$15/month
- **RDS db.t3.micro**: ~$15/month  
- **Data Transfer**: ~$5/month
- **Total**: ~$35-40/month

This is very affordable for a production application!

---

## Next Steps After Deployment

1. **Change admin password**
2. **Setup email notifications** (configure SMTP in backend)
3. **Add your business logo** (already in `/frontend/public/images/logo.png`)
4. **Enable database backups** (already enabled in RDS)
5. **Setup CloudWatch monitoring** (optional, for alerts)
6. **Consider CDN** (CloudFront) for better performance (optional)

---

## Need Help?

If you encounter any issues:
1. Check docker logs: `docker-compose logs -f`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify database connection: Test from EC2 with psql
4. Check AWS Security Groups: Ensure ports 80, 443, 5432 are open appropriately

---

🎉 **Your application will be live at: https://premierprime.org**
