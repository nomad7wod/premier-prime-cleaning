# Premier Prime Cleaning - AWS Deployment Steps

## Current Status ✅

Your AWS infrastructure is partially set up:

- **RDS Database**: ✅ Created and running
  - Endpoint: `premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com`
  - Database: `cleaning_app`
  - User: `postgres`
  - Password: `PremierPrime2024!Secure`
  - Region: `us-east-2`
  - Security Group: `sg-05448b6fe58ff5fe8`

## Next Steps

### Step 1: Create EC2 Instance for Backend

Run this command in PowerShell from your project directory:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
cd C:\Users\herna\Downloads\premierprime\cleaning-app

# Create security group for EC2
$sgEc2 = aws ec2 create-security-group `
    --group-name premierprime-backend-sg `
    --description "Security group for Premier Prime backend" `
    --region us-east-2 `
    --query 'GroupId' `
    --output text

# Allow SSH, HTTP, HTTPS, and app port
aws ec2 authorize-security-group-ingress --group-id $sgEc2 --protocol tcp --port 22 --cidr 0.0.0.0/0 --region us-east-2
aws ec2 authorize-security-group-ingress --group-id $sgEc2 --protocol tcp --port 80 --cidr 0.0.0.0/0 --region us-east-2
aws ec2 authorize-security-group-ingress --group-id $sgEc2 --protocol tcp --port 443 --cidr 0.0.0.0/0 --region us-east-2
aws ec2 authorize-security-group-ingress --group-id $sgEc2 --protocol tcp --port 8080 --cidr 0.0.0.0/0 --region us-east-2

# Create key pair
aws ec2 create-key-pair `
    --key-name premierprime-key `
    --region us-east-2 `
    --query 'KeyMaterial' `
    --output text | Out-File "deploy\premierprime-key.pem" -Encoding ASCII

# Get latest Amazon Linux 2023 AMI
$ami = aws ec2 describe-images `
    --owners amazon `
    --filters "Name=name,Values=al2023-ami-2023.*-x86_64" "Name=state,Values=available" `
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' `
    --output text `
    --region us-east-2

# Launch EC2 instance
$instanceId = aws ec2 run-instances `
    --image-id $ami `
    --instance-type t3.micro `
    --key-name premierprime-key `
    --security-group-ids $sgEc2 `
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=premierprime-backend}]" `
    --region us-east-2 `
    --query 'Instances[0].InstanceId' `
    --output text

Write-Host "Instance ID: $instanceId"
Write-Host "Waiting for instance to start..."

# Wait for instance to be running
aws ec2 wait instance-running --instance-ids $instanceId --region us-east-2

# Get public IP
$publicIp = aws ec2 describe-instances `
    --instance-ids $instanceId `
    --region us-east-2 `
    --query 'Reservations[0].Instances[0].PublicIpAddress' `
    --output text

Write-Host "`n✓ EC2 Instance is ready!"
Write-Host "Public IP: $publicIp"
Write-Host "Instance ID: $instanceId"
Write-Host "Security Group: $sgEc2"

# Allow RDS to accept connections from EC2
aws ec2 authorize-security-group-ingress `
    --group-id sg-05448b6fe58ff5fe8 `
    --protocol tcp `
    --port 5432 `
    --source-group $sgEc2 `
    --region us-east-2

Write-Host "`n✓ RDS configured to accept connections from EC2"
Write-Host "`nNext: Connect to EC2 and deploy the application"
Write-Host "Connection command:"
Write-Host "ssh -i deploy\premierprime-key.pem ec2-user@$publicIp"
```

### Step 2: Connect to EC2 and Setup Environment

You'll need to use an SSH client. On Windows, you can use:
- **PowerShell SSH** (built-in on Windows 10+)
- **PuTTY** (convert .pem to .ppk first)
- **Windows Subsystem for Linux (WSL)**

If using PowerShell SSH:
```powershell
# Set correct permissions on key file
icacls deploy\premierprime-key.pem /inheritance:r
icacls deploy\premierprime-key.pem /grant:r "$($env:USERNAME):(R)"

# Connect
ssh -i deploy\premierprime-key.pem ec2-user@YOUR_EC2_IP
```

### Step 3: Deploy Application on EC2

Once connected to EC2, run these commands:

```bash
# Install Docker and Git
sudo yum update -y
sudo yum install docker git postgresql15 -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Log out and back in for Docker group to take effect
exit
```

SSH back in, then continue:

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/cleaning-app.git
cd cleaning-app

# Seed the database
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

# Create backend .env file
cd backend
cat > .env << 'EOF'
PORT=8080
DB_HOST=premierprime-db.c1g8gckm03ld.us-east-2.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=PremierPrime2024!Secure
DB_NAME=cleaning_app
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars
GIN_MODE=release
EOF

# Build and run backend with Docker
docker build -t premierprime-backend .
docker run -d \
  --name backend \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file .env \
  premierprime-backend

# Check if it's running
docker logs backend
curl http://localhost:8080/health

# If successful, you should see health check response
```

### Step 4: Setup Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo yum install nginx -y

# Configure Nginx
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

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 5: Deploy Frontend to S3 + CloudFront

Back on your local Windows machine:

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app\frontend

# Update API URL to point to EC2 instance
$ec2Ip = "YOUR_EC2_PUBLIC_IP"  # Replace with your actual IP
@"
REACT_APP_API_URL=http://$ec2Ip/api
"@ | Out-File .env.production -Encoding UTF8

# Build frontend
npm install
npm run build

# Create S3 bucket
$bucketName = "premierprime-frontend"
aws s3 mb "s3://$bucketName" --region us-east-2

# Enable static website hosting
aws s3 website "s3://$bucketName" --index-document index.html --error-document index.html --region us-east-2

# Set bucket policy for public access
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

# Upload build files
aws s3 sync build/ "s3://$bucketName/" --delete --region us-east-2

# Get website URL
Write-Host "`n✓ Frontend deployed!"
Write-Host "Website URL: http://$bucketName.s3-website.us-east-2.amazonaws.com"
```

### Step 6: Create CloudFront Distribution (For HTTPS)

```powershell
# Create CloudFront distribution
$distConfig = @"
{
  "CallerReference": "premierprime-$(Get-Date -Format 'yyyyMMddHHmmss')",
  "Comment": "Premier Prime Cleaning App",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-premierprime",
      "DomainName": "$bucketName.s3-website.us-east-2.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultRootObject": "index.html",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-premierprime",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "Compress": true
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
}
"@

$distConfig | Out-File cloudfront-config.json -Encoding UTF8
$distribution = aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --region us-east-2 | ConvertFrom-Json

Write-Host "`n✓ CloudFront distribution created!"
Write-Host "CloudFront URL: https://$($distribution.Distribution.DomainName)"
Write-Host "Note: It may take 15-20 minutes for CloudFront to fully deploy"
```

## Summary

After completing all steps, you'll have:

1. ✅ **RDS Database**: PostgreSQL database with all data seeded
2. **EC2 Backend**: Go backend running in Docker, accessible via HTTP
3. **S3 Frontend**: React frontend hosted on S3
4. **CloudFront**: CDN for HTTPS access to frontend

### Access Your Application

- **Frontend**: https://YOUR_CLOUDFRONT_URL or http://YOUR_BUCKET.s3-website.us-east-2.amazonaws.com
- **Backend API**: http://YOUR_EC2_IP/api
- **Admin Login**: adaperez@premierprime.org / admin123

### Estimated Monthly Costs

- RDS db.t3.micro: $15-20
- EC2 t3.micro: $8-10
- S3 + CloudFront: $5-10
- **Total**: ~$28-40/month

### Updating Your Application

**Backend updates:**
```bash
ssh -i deploy\premierprime-key.pem ec2-user@YOUR_EC2_IP
cd cleaning-app
git pull
cd backend
docker build -t premierprime-backend .
docker stop backend
docker rm backend
docker run -d --name backend --restart unless-stopped -p 8080:8080 --env-file .env premierprime-backend
```

**Frontend updates:**
```powershell
cd frontend
git pull
npm run build
aws s3 sync build/ s3://premierprime-frontend/ --delete --region us-east-2
```

## Troubleshooting

**Can't connect to EC2:**
- Check security group allows SSH (port 22) from your IP
- Verify key file permissions
- Ensure you're using the correct username (ec2-user for Amazon Linux)

**Backend not starting:**
- Check Docker logs: `docker logs backend`
- Verify environment variables: `docker exec backend env`
- Test database connection from EC2: `psql -h DB_HOST -U postgres -d cleaning_app`

**Frontend can't reach API:**
- Check CORS settings in backend
- Verify API URL in frontend .env.production
- Check browser console for errors
- Ensure EC2 security group allows traffic on port 80/8080

## Need Help?

Contact AWS Support or review:
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
