# AWS Deployment Guide - Premier Prime Cleaning App

Complete guide for deploying the Premier Prime Cleaning application to Amazon Web Services (AWS).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup (RDS)](#database-setup-rds)
3. [Backend Deployment Options](#backend-deployment-options)
4. [Frontend Deployment (S3 + CloudFront)](#frontend-deployment-s3--cloudfront)
5. [Domain & SSL Setup](#domain--ssl-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Tools
- AWS Account with billing enabled
- AWS CLI installed and configured
- PostgreSQL client (psql) installed
- Git
- Node.js 18+
- Go 1.21+ (if building locally)

### Install AWS CLI
**Windows:**
```powershell
winget install Amazon.AWSCLI
```

**Mac:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter default output format: json
```

---

## Database Setup (RDS)

### Step 1: Create RDS PostgreSQL Instance

#### Via AWS Console:
1. Go to AWS Console → RDS → Databases → Create database
2. Choose **PostgreSQL**
3. Templates: **Free tier** (for testing) or **Production** (for live)
4. Settings:
   - DB instance identifier: `premierprime-db`
   - Master username: `postgres`
   - Master password: Create a strong password
5. Instance configuration:
   - **Free tier**: db.t3.micro
   - **Production**: db.t3.small or larger
6. Storage:
   - Allocated storage: 20 GB (minimum)
   - Storage autoscaling: Enable
7. Connectivity:
   - Public access: **Yes** (for initial setup, restrict later)
   - VPC security group: Create new
   - Security group name: `premierprime-db-sg`
8. Database authentication: **Password authentication**
9. Additional configuration:
   - Initial database name: `cleaning_app`
   - Backup retention: 7 days
   - Enable automated backups
10. Click **Create database**

#### Via AWS CLI:
```bash
aws rds create-db-instance \
    --db-instance-identifier premierprime-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username postgres \
    --master-user-password YOUR_SECURE_PASSWORD \
    --allocated-storage 20 \
    --db-name cleaning_app \
    --backup-retention-period 7 \
    --publicly-accessible \
    --vpc-security-group-ids sg-xxxxxxxxx
```

### Step 2: Configure Security Group

Allow connections from your IP and application servers:

1. Go to EC2 → Security Groups → Find `premierprime-db-sg`
2. Edit inbound rules:
   - Type: PostgreSQL
   - Port: 5432
   - Source: Your IP address (for setup)
   - Source: Application server security group (for production)

### Step 3: Get Database Endpoint

Wait 5-10 minutes for RDS instance to be created, then:

```bash
aws rds describe-db-instances \
    --db-instance-identifier premierprime-db \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text
```

Example output: `premierprime-db.c9akciq32.us-east-1.rds.amazonaws.com`

### Step 4: Seed the Database

**Windows PowerShell:**
```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app
.\seed-database.ps1 `
    -Host "premierprime-db.c9akciq32.us-east-1.rds.amazonaws.com" `
    -Database "cleaning_app" `
    -User "postgres"
```

**Linux/Mac:**
```bash
cd /path/to/cleaning-app
./seed-database.sh \
    premierprime-db.c9akciq32.us-east-1.rds.amazonaws.com \
    cleaning_app \
    postgres
```

**Verify Seeding:**
```bash
psql -h premierprime-db.c9akciq32.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d cleaning_app \
     -c "SELECT COUNT(*) FROM users WHERE role='admin';"
```

Should return: 1

---

## Backend Deployment Options

Choose one of these options for deploying the Go backend:

### Option A: EC2 with Docker (Recommended)

**Step 1: Launch EC2 Instance**

1. Go to EC2 → Launch Instance
2. Name: `premierprime-backend`
3. AMI: **Amazon Linux 2023** or **Ubuntu 22.04**
4. Instance type: **t3.micro** (free tier) or **t3.small**
5. Key pair: Create new or use existing
6. Network settings:
   - Auto-assign public IP: Enable
   - Security group: Create new
     - Allow SSH (22) from your IP
     - Allow HTTP (80) from anywhere
     - Allow HTTPS (443) from anywhere
     - Allow Custom TCP (8080) from anywhere
7. Storage: 20 GB gp3
8. Launch instance

**Step 2: Connect to EC2**

```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ec2-user@ec2-xx-xx-xx-xx.compute.amazonaws.com
```

**Step 3: Install Docker**

```bash
# Amazon Linux 2023
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Log out and back in for group changes
exit
# SSH back in
```

**Step 4: Deploy Application**

```bash
# Clone repository
git clone https://github.com/yourusername/cleaning-app.git
cd cleaning-app/backend

# Create environment file
cat > .env << EOF
PORT=8080
DB_HOST=premierprime-db.c9akciq32.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=cleaning_app
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
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
docker logs backend -f
```

**Step 5: Set up Nginx (Optional but recommended)**

```bash
sudo yum install nginx -y

sudo cat > /etc/nginx/conf.d/premierprime.conf << 'EOF'
server {
    listen 80;
    server_name api.premierprime.org;

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

**Step 6: Install SSL Certificate**

```bash
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.premierprime.org
```

### Option B: ECS with Fargate (Managed)

**Step 1: Create ECR Repository**

```bash
aws ecr create-repository --repository-name premierprime-backend
```

**Step 2: Build and Push Docker Image**

```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build image
cd backend
docker build -t premierprime-backend .

# Tag image
docker tag premierprime-backend:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/premierprime-backend:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/premierprime-backend:latest
```

**Step 3: Create ECS Cluster**

```bash
aws ecs create-cluster --cluster-name premierprime-cluster
```

**Step 4: Create Task Definition**

Create file `task-definition.json`:

```json
{
  "family": "premierprime-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/premierprime-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "PORT", "value": "8080"},
        {"name": "DB_HOST", "value": "premierprime-db.c9akciq32.us-east-1.rds.amazonaws.com"},
        {"name": "DB_PORT", "value": "5432"},
        {"name": "DB_USER", "value": "postgres"},
        {"name": "DB_PASSWORD", "value": "YOUR_DB_PASSWORD"},
        {"name": "DB_NAME", "value": "cleaning_app"},
        {"name": "JWT_SECRET", "value": "your-super-secret-jwt-key"},
        {"name": "GIN_MODE", "value": "release"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/premierprime-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

**Step 5: Create ECS Service with Application Load Balancer**

This is complex - use AWS Console:
1. ECS → Clusters → premierprime-cluster
2. Create Service
3. Launch type: Fargate
4. Task definition: premierprime-backend
5. Service name: premierprime-backend-service
6. Number of tasks: 2
7. Load balancer: Create new Application Load Balancer
8. Configure health checks
9. Create service

---

## Frontend Deployment (S3 + CloudFront)

### Step 1: Build Frontend

```bash
cd frontend

# Update API URL in .env.production
echo "REACT_APP_API_URL=https://api.premierprime.org/api" > .env.production

# Build
npm install
npm run build
```

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://premierprime-frontend --region us-east-1

# Enable static website hosting
aws s3 website s3://premierprime-frontend --index-document index.html --error-document index.html

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket premierprime-frontend --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::premierprime-frontend/*"
  }]
}'
```

### Step 3: Upload Build Files

```bash
aws s3 sync build/ s3://premierprime-frontend/ --delete
```

### Step 4: Create CloudFront Distribution

```bash
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "premierprime-'$(date +%s)'",
  "Comment": "Premier Prime Cleaning App",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-premierprime-frontend",
      "DomainName": "premierprime-frontend.s3-website-us-east-1.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-premierprime-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {"Enabled": false, "Quantity": 0},
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    }]
  }
}'
```

Note the Distribution Domain Name (e.g., `d111111abcdef8.cloudfront.net`)

---

## Domain & SSL Setup

### Step 1: Configure Route 53

1. Go to Route 53 → Hosted zones
2. Create hosted zone for `premierprime.org`
3. Create records:

**For Frontend:**
- Type: A
- Name: premierprime.org
- Alias: Yes
- Target: CloudFront distribution

**For API:**
- Type: A
- Name: api.premierprime.org
- Value: EC2 Elastic IP or ALB

### Step 2: SSL Certificates

**For CloudFront (Frontend):**
1. Go to Certificate Manager (us-east-1 region required for CloudFront)
2. Request certificate for `premierprime.org` and `www.premierprime.org`
3. Validate via DNS
4. Attach to CloudFront distribution

**For API (Backend on EC2):**
```bash
sudo certbot --nginx -d api.premierprime.org
```

---

## Monitoring & Maintenance

### CloudWatch Logs

```bash
# View backend logs (ECS)
aws logs tail /ecs/premierprime-backend --follow

# Create log metric filters
aws logs put-metric-filter \
    --log-group-name /ecs/premierprime-backend \
    --filter-name ErrorCount \
    --filter-pattern "ERROR" \
    --metric-transformations \
        metricName=BackendErrors,metricNamespace=PremierPrime,metricValue=1
```

### Automated Backups

RDS automated backups are enabled by default. To create manual snapshot:

```bash
aws rds create-db-snapshot \
    --db-instance-identifier premierprime-db \
    --db-snapshot-identifier premierprime-manual-snapshot-$(date +%Y%m%d)
```

### Updates and Deployments

**Backend:**
```bash
# SSH to EC2
cd cleaning-app
git pull
cd backend
docker build -t premierprime-backend .
docker stop backend
docker rm backend
docker run -d --name backend --restart unless-stopped -p 8080:8080 --env-file .env premierprime-backend
```

**Frontend:**
```bash
# Local machine
cd frontend
git pull
npm run build
aws s3 sync build/ s3://premierprime-frontend/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Cost Estimation

**Monthly Costs (Estimated):**
- RDS db.t3.micro: $15-20
- EC2 t3.micro: $8-10
- S3 + CloudFront: $5-10
- Data transfer: $5-15
- **Total: $33-55/month**

**Production (Scaled):**
- RDS db.t3.small: $30-40
- EC2 t3.small x2 + Load Balancer: $40-60
- S3 + CloudFront: $10-20
- **Total: $80-120/month**

---

## Troubleshooting

### Can't connect to RDS
- Check security group rules
- Verify RDS is publicly accessible (for testing)
- Check VPC settings
- Test with psql from local machine

### Backend not starting
- Check CloudWatch logs
- Verify environment variables
- Check database connection string
- Ensure RDS security group allows connections

### Frontend shows API errors
- Verify API URL in frontend build
- Check CORS configuration in backend
- Verify SSL certificates
- Check CloudFront distribution settings

---

## Security Best Practices

1. **Restrict RDS Access**: After setup, disable public access and use VPC
2. **Use Secrets Manager**: Store database credentials in AWS Secrets Manager
3. **Enable MFA**: On AWS root and IAM users
4. **Regular Updates**: Keep OS, Docker, and dependencies updated
5. **Monitor Logs**: Set up CloudWatch alarms for errors
6. **Backup Strategy**: Test restore procedures regularly
7. **WAF**: Consider AWS WAF for CloudFront
8. **Change Default Passwords**: Change admin@premierprime.org password immediately

---

## Support

For issues specific to AWS deployment:
- AWS Support (if you have support plan)
- AWS Documentation: https://docs.aws.amazon.com
- Premier Prime specific issues: Create GitHub issue

---

**🎉 Your Premier Prime Cleaning App is now live on AWS!**

Access your application:
- Frontend: https://premierprime.org
- API: https://api.premierprime.org/api
- Admin: https://premierprime.org/admin (login with adaperez@premierprime.org / admin123)
