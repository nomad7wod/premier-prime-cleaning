# 🚀 Deploy Premier Prime to AWS - QUICK START

## Your AWS Resources
- **EC2 IP:** 18.116.44.7
- **RDS Database:** premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com
- **Region:** us-east-2 (Ohio)
- **Domain:** premierprime.org (Spaceship)

---

## 🎯 Step-by-Step Deployment (30 minutes)

### 1. Configure DNS (5 minutes)

Go to Spaceship.com DNS settings for **premierprime.org**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 18.116.44.7 | 300 |
| A | www | 18.116.44.7 | 300 |

Wait 5 minutes for DNS propagation, then verify:
```bash
nslookup premierprime.org
# Should show: 18.116.44.7
```

---

### 2. Connect to EC2 Instance (2 minutes)

**Option A: AWS Console (Easiest)**
1. Go to: https://console.aws.amazon.com/ec2
2. Click on **Instances**
3. Select your instance (18.116.44.7)
4. Click **Connect** → **Session Manager**
5. Click **Connect** button

**Option B: SSH (if key works)**
```powershell
ssh -i deploy\premierprime-key.pem ubuntu@18.116.44.7
```

---

### 3. Upload Application to EC2 (10 minutes)

**Once connected to EC2, run:**

```bash
# Install Git if not installed
sudo apt update
sudo apt install git -y

# Clone your repository
cd ~
git clone https://github.com/nomad7wod/premier-prime-cleaning.git cleaning-app
cd cleaning-app

# Verify files
ls -la
```

---

### 4. Setup EC2 Environment (10 minutes)

```bash
# Run the setup script
cd ~/cleaning-app
bash deploy/setup-ec2-simple.sh
```

This will install:
- Docker & Docker Compose
- Nginx
- Certbot (SSL)
- PostgreSQL client

---

### 5. Deploy Application (5 minutes)

```bash
# Deploy the application
cd ~/cleaning-app
bash deploy/ec2-deploy.sh
```

This will:
- Build Docker images
- Start containers
- Show logs

**Verify deployment:**
```bash
# Check containers are running
docker-compose -f docker-compose.prod.yml ps

# Test backend
curl http://localhost:8080/api/health

# Test frontend
curl http://localhost:3000
```

---

### 6. Setup SSL Certificate (5 minutes)

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d premierprime.org -d www.premierprime.org
```

**When prompted:**
- Email: `adaperez@premierprime.org`
- Terms: **Y**es
- Share email: **N**o
- Redirect HTTP to HTTPS: **Y**es (recommended)

---

### 7. Test Your Website 🎉

Open browser and visit:
- ✅ http://premierprime.org → Should redirect to HTTPS
- ✅ https://premierprime.org → Your website!
- ✅ https://www.premierprime.org → Should work

**Test functionality:**
- ✅ Request a quote
- ✅ Book a service
- ✅ Login to admin: https://premierprime.org/login
- ✅ View bookings
- ✅ Generate invoices

---

## 🔧 Useful Commands

### View Logs
```bash
cd ~/cleaning-app
docker-compose -f docker-compose.prod.yml logs -f
```

### Restart Services
```bash
cd ~/cleaning-app
docker-compose -f docker-compose.prod.yml restart
```

### Update Application
```bash
cd ~/cleaning-app
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Check Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View System Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check running processes
htop
```

---

## 📊 Monitoring

### Setup Automatic Backups

```bash
# Create backup script
nano ~/backup.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"

PGPASSWORD='PremierPrime2024!Secure' pg_dump \
  -h premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com \
  -U postgres \
  -d cleaning_app \
  > $BACKUP_FILE

gzip $BACKUP_FILE
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
echo "Backup completed: $BACKUP_FILE.gz"
```

Make executable and schedule:
```bash
chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * ~/backup.sh
```

---

## 🚨 Troubleshooting

### Website not loading?
```bash
# Check containers
docker-compose -f docker-compose.prod.yml ps

# Restart if needed
docker-compose -f docker-compose.prod.yml restart

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
```

### Can't connect to database?
```bash
# Test connection
PGPASSWORD='PremierPrime2024!Secure' psql \
  -h premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com \
  -U postgres \
  -d cleaning_app
```

### SSL certificate issues?
```bash
# Check DNS
nslookup premierprime.org

# Try Certbot again
sudo certbot --nginx -d premierprime.org -d www.premierprime.org
```

### View Nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 💰 Monthly Costs

| Service | Cost |
|---------|------|
| EC2 t3.small | ~$15 |
| RDS db.t3.micro | ~$15 |
| Data Transfer | ~$5-10 |
| Storage | ~$3 |
| **Total** | **~$38-43/month** |

---

## 🎉 You're Live!

Your Premier Prime Cleaning website is now live at:
**https://premierprime.org**

### What's included:
- ✅ Modern responsive design
- ✅ Online quote requests
- ✅ Service booking system
- ✅ Admin dashboard
- ✅ Invoice generation (PDF)
- ✅ Email notifications
- ✅ SSL security (HTTPS)
- ✅ Automatic backups
- ✅ 6 service pages
- ✅ Professional UI/UX

---

## 📧 Support

If you encounter any issues:
1. Check logs: `docker-compose logs -f`
2. Verify DNS: `nslookup premierprime.org`
3. Check containers: `docker ps`
4. Review Nginx: `sudo nginx -t`

Need help? Contact your development team.
