# 🎉 Premier Prime Cleaning - AWS Deployment Summary

## ✅ COMPLETED STEPS

Your AWS infrastructure is now ready! Here's what has been set up:

### 1. RDS PostgreSQL Database ✅
- **Endpoint**: `premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com`
- **Database**: `cleaning_app`
- **Username**: `postgres`
- **Password**: `PremierPrime2024!Secure`
- **Engine**: PostgreSQL 15.14
- **Instance**: db.t3.micro
- **Region**: us-east-2 (Ohio)
- **Status**: Running and available

### 2. EC2 Instance for Backend ✅
- **Instance ID**: `i-08e72864f05354180`
- **Public IP**: `18.116.44.7`
- **Instance Type**: t3.micro
- **AMI**: Amazon Linux 2023
- **SSH Key**: `deploy\premierprime-key-20251110155117.pem`
- **Region**: us-east-2 (Ohio)
- **Status**: Running

### 3. Security Groups ✅
- **RDS Security Group**: `sg-05448b6fe58ff5fe8`
  - Allows PostgreSQL (5432) from your IP
  - Allows PostgreSQL from EC2 security group
  
- **EC2 Security Group**: `sg-0e13e05a5a8786f50`
  - Allows SSH (22) from anywhere
  - Allows HTTP (80) from anywhere
  - Allows HTTPS (443) from anywhere
  - Allows 8080 from anywhere

---

## 🚀 NEXT STEPS

### Step 1: Connect to EC2 Instance

Open PowerShell or Git Bash and run:

```bash
ssh -i deploy\premierprime-key-20251110155117.pem ec2-user@18.116.44.7
```

**Note**: If using PowerShell and you get a permissions error, run:
```powershell
icacls deploy\premierprime-key-20251110155117.pem /inheritance:r
icacls deploy\premierprime-key-20251110155117.pem /grant:r "$($env:USERNAME):(R)"
```

### Step 2: Deploy Backend on EC2

Once connected to EC2, you have two options:

#### Option A: Automated Deployment (Recommended)

First, upload the deployment script to EC2. On your local machine:
```bash
scp -i deploy\premierprime-key-20251110155117.pem deploy\ec2-deploy.sh ec2-user@18.116.44.7:~
```

Then, on EC2:
```bash
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

#### Option B: Manual Deployment

Follow these commands on EC2:

```bash
# Update system
sudo yum update -y
sudo yum install -y docker git postgresql15

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Log out and back in for Docker group to take effect
exit
```

SSH back in, then:

```bash
# Clone your repository (replace with your actual GitHub repo URL)
git clone https://github.com/YOUR_USERNAME/cleaning-app.git
cd cleaning-app

# Seed database
export PGPASSWORD='PremierPrime2024!Secure'
psql -h premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com \
     -U postgres \
     -d cleaning_app \
     -f backend/migrations/001_initial_schema.sql

psql -h premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com \
     -U postgres \
     -d cleaning_app \
     -f backend/migrations/002_seed_data.sql

# Verify seeding
psql -h premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com \
     -U postgres \
     -d cleaning_app \
     -c "SELECT COUNT(*) FROM users WHERE role='admin';"

# Should return 1

# Create .env file
cd backend
cat > .env << 'EOF'
PORT=8080
DB_HOST=premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=PremierPrime2024!Secure
DB_NAME=cleaning_app
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars-random
GIN_MODE=release
EOF

# Build and run
docker build -t premierprime-backend .
docker run -d \
  --name backend \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file .env \
  premierprime-backend

# Check logs
docker logs backend

# Test
curl http://localhost:8080/health
```

### Step 3: Install Nginx (Optional but Recommended)

While still on EC2:

```bash
sudo yum install -y nginx

sudo tee /etc/nginx/conf.d/premierprime.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 4: Test Your Backend

From your local machine:
```bash
curl http://18.116.44.7/health
# or
curl http://18.116.44.7/api/services
```

You should get a JSON response!

### Step 5: Deploy Frontend to S3

On your local machine (Windows PowerShell):

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app\frontend

# Update API URL
@"
REACT_APP_API_URL=http://18.116.44.7/api
"@ | Out-File .env.production -Encoding UTF8

# Build
npm install
npm run build

# Create S3 bucket
$bucketName = "premierprime-frontend"
aws s3 mb "s3://$bucketName" --region us-east-2

# Enable website hosting
aws s3 website "s3://$bucketName" --index-document index.html --error-document index.html --region us-east-2

# Set public access
@"
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$bucketName/*"
  }]
}
"@ | Out-File bucket-policy.json -Encoding UTF8

aws s3api put-bucket-policy --bucket $bucketName --policy file://bucket-policy.json --region us-east-2

# Upload files
aws s3 sync build/ "s3://$bucketName/" --delete --region us-east-2

Write-Host "`n✓ Frontend deployed!"
Write-Host "Website URL: http://$bucketName.s3-website.us-east-2.amazonaws.com"
```

### Step 6: Setup CloudFront (For HTTPS)

This is optional but recommended for production. It provides:
- HTTPS support
- Better performance with CDN
- Custom domain support

See `DEPLOYMENT_STEPS.md` for detailed CloudFront setup instructions.

---

## 📊 Estimated Monthly Costs

- **RDS db.t3.micro**: ~$15-20
- **EC2 t3.micro**: ~$8-10  
- **S3 + Data Transfer**: ~$5-10
- **Total**: ~$28-40/month

---

## 🔐 Important Security Notes

1. **Change Admin Password**: Login to the app and change the default admin password immediately
   - Email: adaperez@premierprime.org
   - Default Password: admin123

2. **JWT Secret**: Consider changing the JWT secret in the .env file to a more secure random string

3. **Database Password**: Store the database password securely (it's saved in `deploy\aws-config.json`)

4. **SSH Key**: Keep your SSH key file (`deploy\premierprime-key-20251110155117.pem`) secure and never commit it to GitHub

---

## 🔄 Updating Your Application

### Update Backend:
```bash
ssh -i deploy\premierprime-key-20251110155117.pem ec2-user@18.116.44.7
cd cleaning-app
git pull
cd backend
docker build -t premierprime-backend .
docker stop backend && docker rm backend
docker run -d --name backend --restart unless-stopped -p 8080:8080 --env-file .env premierprime-backend
```

### Update Frontend:
```powershell
cd frontend
git pull
npm run build
aws s3 sync build/ s3://premierprime-frontend/ --delete --region us-east-2
```

---

## 🆘 Troubleshooting

### Can't connect to EC2:
- Ensure security group allows SSH from your IP
- Verify key file permissions
- Check that instance is running in AWS Console

### Backend not working:
```bash
# Check Docker logs
docker logs backend

# Check if container is running
docker ps -a

# Test database connection
psql -h premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com -U postgres -d cleaning_app
```

### Frontend shows API errors:
- Check browser console for CORS errors
- Verify API URL in `.env.production`
- Ensure backend is accessible from browser

---

## 📞 Support

- AWS Documentation: https://docs.aws.amazon.com
- Check `DEPLOYMENT_STEPS.md` for detailed instructions
- Review AWS CloudWatch logs for errors

---

## 🎊 You're Almost There!

Your AWS infrastructure is ready. Just connect to EC2, deploy the backend, and your application will be live!

**Quick Start Commands:**
```bash
# Connect to EC2
ssh -i deploy\premierprime-key-20251110155117.pem ec2-user@18.116.44.7

# Upload and run deployment script
# (On local machine first)
scp -i deploy\premierprime-key-20251110155117.pem deploy\ec2-deploy.sh ec2-user@18.116.44.7:~

# Then on EC2
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

Good luck! 🚀
