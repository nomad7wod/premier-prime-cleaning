# 🚀 Simple AWS Deployment Guide - Premier Prime Cleaning App

**Follow these steps to deploy your cleaning app to AWS**

## Prerequisites ✅

Before starting, make sure you have:
1. An AWS Account (with billing enabled)
2. AWS CLI installed (✓ Already done!)
3. Your AWS Access Keys ready

## Step-by-Step Deployment

### 1️⃣ Configure AWS CLI

First, configure AWS CLI with your credentials:

```powershell
aws configure
```

You'll be asked for:
- **AWS Access Key ID**: Get this from AWS Console → IAM → Users → Your User → Security Credentials
- **AWS Secret Access Key**: Shown when you create the access key
- **Default region**: `us-east-1` (recommended)
- **Output format**: `json`

### 2️⃣ Run the Deployment Helper

We've created a helper script to automate most of the deployment:

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app
.\deploy\aws-setup.ps1
```

This interactive menu will guide you through:
- Creating the PostgreSQL database (RDS)
- Setting up security groups
- Launching an EC2 instance
- Seeding the database with initial data

### 3️⃣ Deploy Backend to EC2

Once your EC2 instance is ready, connect to it:

```powershell
# The script will provide you with the exact command, something like:
ssh -i deploy\premierprime-key.pem ec2-user@<YOUR-EC2-IP>
```

Then on the EC2 instance, run:

```bash
# Install Docker
sudo yum update -y
sudo yum install docker git -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Log out and back in
exit
# SSH back in

# Clone your repository
git clone https://github.com/yourusername/cleaning-app.git
cd cleaning-app/backend

# Create environment file
cat > .env << EOF
PORT=8080
DB_HOST=<YOUR-RDS-ENDPOINT>
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<YOUR-DB-PASSWORD>
DB_NAME=cleaning_app
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
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

# Check if it's running
docker logs backend
```

### 4️⃣ Set up Nginx (Optional but Recommended)

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

### 5️⃣ Deploy Frontend to S3 + CloudFront

Back on your local machine:

```powershell
cd C:\Users\herna\Downloads\premierprime\cleaning-app\frontend

# Update API URL
$apiUrl = "http://<YOUR-EC2-IP>:8080/api"
# Or if using Nginx: "http://api.premierprime.org/api"

Set-Content .env.production "REACT_APP_API_URL=$apiUrl"

# Build
npm install
npm run build

# Create S3 bucket (choose a unique name)
$bucketName = "premierprime-frontend-$(Get-Random)"
aws s3 mb "s3://$bucketName" --region us-east-1

# Enable static website hosting
aws s3 website "s3://$bucketName" --index-document index.html --error-document index.html

# Set bucket policy for public access
$policy = @"
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
"@

$policy | Out-File -FilePath policy.json -Encoding utf8
aws s3api put-bucket-policy --bucket $bucketName --policy file://policy.json

# Upload build files
aws s3 sync build/ "s3://$bucketName/" --delete

Write-Host "Frontend URL: http://$bucketName.s3-website-us-east-1.amazonaws.com"
```

### 6️⃣ Set up CloudFront (For HTTPS and better performance)

```powershell
# Create CloudFront distribution
$originDomain = "$bucketName.s3-website-us-east-1.amazonaws.com"

$distConfig = @"
{
  "CallerReference": "premierprime-$(Get-Date -Format 'yyyyMMddHHmmss')",
  "Comment": "Premier Prime Cleaning App",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-premierprime",
      "DomainName": "$originDomain",
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
      "Items": ["GET", "HEAD"]
    },
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
}
"@

$distConfig | Out-File -FilePath cloudfront-config.json -Encoding utf8
$distribution = aws cloudfront create-distribution --distribution-config file://cloudfront-config.json | ConvertFrom-Json

Write-Host "CloudFront URL: https://$($distribution.Distribution.DomainName)"
```

## 7️⃣ Configure Your Domain (Optional)

If you own `premierprime.org`:

1. Go to **Route 53** in AWS Console
2. Create a hosted zone for `premierprime.org`
3. Create an A record pointing to your CloudFront distribution
4. Create an A record for `api.premierprime.org` pointing to your EC2 IP

### Get SSL Certificate (Free with AWS Certificate Manager)

1. Go to **Certificate Manager** in AWS Console
2. Request a public certificate for:
   - `premierprime.org`
   - `*.premierprime.org`
3. Verify via DNS (add the provided CNAME records to Route 53)
4. Attach certificate to CloudFront distribution

## 🎉 You're Live!

Your app should now be accessible at:
- **Frontend**: `https://your-cloudfront-url.cloudfront.net` or `https://premierprime.org`
- **API**: `http://your-ec2-ip:8080/api` or `http://api.premierprime.org/api`

### Default Login Credentials
- **Email**: adaperez@premierprime.org
- **Password**: admin123

**⚠️ IMPORTANT: Change the admin password immediately after first login!**

## 📊 Estimated Monthly Costs

- **RDS (db.t3.micro)**: ~$15-20
- **EC2 (t3.micro)**: ~$8-10
- **S3 + CloudFront**: ~$5-10
- **Data Transfer**: ~$5-10
- **Total**: ~$33-50/month

## 🔄 Updating Your App

### Update Backend:
```bash
ssh -i deploy\premierprime-key.pem ec2-user@<YOUR-EC2-IP>
cd cleaning-app
git pull
cd backend
docker build -t premierprime-backend .
docker stop backend
docker rm backend
docker run -d --name backend --restart unless-stopped -p 8080:8080 --env-file .env premierprime-backend
```

### Update Frontend:
```powershell
cd frontend
git pull
npm run build
aws s3 sync build/ s3://<your-bucket>/ --delete
aws cloudfront create-invalidation --distribution-id <YOUR-DIST-ID> --paths "/*"
```

## 🆘 Troubleshooting

### Can't connect to database
- Check RDS security group allows connections from EC2
- Verify database endpoint in .env file
- Test with: `psql -h <RDS-ENDPOINT> -U postgres -d cleaning_app`

### Backend not starting
- Check logs: `docker logs backend`
- Verify environment variables: `docker exec backend env`
- Check if port 8080 is accessible: `curl http://localhost:8080/health`

### Frontend can't reach API
- Check CORS settings in backend
- Verify API URL in frontend build
- Check browser console for errors

## 📞 Need Help?

- Check AWS CloudWatch logs for detailed errors
- Review security group rules
- Ensure all environment variables are set correctly
- Contact AWS Support if needed

---

**Congratulations! Your Premier Prime Cleaning App is now running on AWS! 🎊**
