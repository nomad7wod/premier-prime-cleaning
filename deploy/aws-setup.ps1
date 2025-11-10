# Premier Prime Cleaning App - AWS Setup Script
# This script helps you deploy the application to AWS step by step

param(
    [string]$Step = "menu"
)

function Show-Menu {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host " Premier Prime AWS Deployment Helper" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "1. Check Prerequisites"
    Write-Host "2. Create RDS Database"
    Write-Host "3. Create Security Groups"
    Write-Host "4. Launch EC2 Instance"
    Write-Host "5. Deploy Backend to EC2"
    Write-Host "6. Build and Deploy Frontend to S3"
    Write-Host "7. Create CloudFront Distribution"
    Write-Host "8. Full Deployment (All Steps)"
    Write-Host "9. Exit`n"
}

function Check-Prerequisites {
    Write-Host "`n[Step 1] Checking Prerequisites..." -ForegroundColor Green
    
    # Check AWS CLI
    try {
        $awsVersion = aws --version 2>&1
        Write-Host "✓ AWS CLI installed: $awsVersion" -ForegroundColor Green
    } catch {
        Write-Host "✗ AWS CLI not found. Please install it first." -ForegroundColor Red
        return $false
    }
    
    # Check AWS Configuration
    try {
        $awsIdentity = aws sts get-caller-identity 2>&1 | ConvertFrom-Json
        Write-Host "✓ AWS Configured - Account: $($awsIdentity.Account)" -ForegroundColor Green
    } catch {
        Write-Host "✗ AWS CLI not configured. Run: aws configure" -ForegroundColor Red
        return $false
    }
    
    # Check Docker
    try {
        $dockerVersion = docker --version 2>&1
        Write-Host "✓ Docker installed: $dockerVersion" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Docker not found (needed for local testing)" -ForegroundColor Yellow
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>&1
        Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "✗ Node.js not found (required for frontend build)" -ForegroundColor Red
        return $false
    }
    
    Write-Host "`n✓ All prerequisites met!" -ForegroundColor Green
    return $true
}

function Create-RDSDatabase {
    Write-Host "`n[Step 2] Creating RDS PostgreSQL Database..." -ForegroundColor Green
    
    $dbName = Read-Host "Enter DB Instance Name (default: premierprime-db)"
    if ([string]::IsNullOrEmpty($dbName)) { $dbName = "premierprime-db" }
    
    $dbPassword = Read-Host "Enter Master Password (min 8 chars)" -AsSecureString
    $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
    
    Write-Host "Creating RDS instance..." -ForegroundColor Yellow
    
    aws rds create-db-instance `
        --db-instance-identifier $dbName `
        --db-instance-class db.t3.micro `
        --engine postgres `
        --engine-version 15.4 `
        --master-username postgres `
        --master-user-password $dbPasswordPlain `
        --allocated-storage 20 `
        --db-name cleaning_app `
        --backup-retention-period 7 `
        --publicly-accessible `
        --storage-encrypted `
        --tags "Key=Project,Value=PremierPrime"
    
    Write-Host "`n✓ RDS creation initiated. This takes 5-10 minutes..." -ForegroundColor Green
    Write-Host "Save your password securely: $dbPasswordPlain" -ForegroundColor Yellow
    
    # Wait for DB to be available
    Write-Host "`nWaiting for database to become available..." -ForegroundColor Yellow
    aws rds wait db-instance-available --db-instance-identifier $dbName
    
    # Get endpoint
    $endpoint = aws rds describe-db-instances `
        --db-instance-identifier $dbName `
        --query 'DBInstances[0].Endpoint.Address' `
        --output text
    
    Write-Host "`n✓ Database ready!" -ForegroundColor Green
    Write-Host "Endpoint: $endpoint" -ForegroundColor Cyan
    
    # Save to config file
    @{
        DB_HOST = $endpoint
        DB_NAME = "cleaning_app"
        DB_USER = "postgres"
        DB_PASSWORD = $dbPasswordPlain
    } | ConvertTo-Json | Out-File "deploy\aws-config.json"
    
    Write-Host "`n✓ Configuration saved to deploy\aws-config.json" -ForegroundColor Green
}

function Seed-Database {
    Write-Host "`n[Step 2.5] Seeding Database..." -ForegroundColor Green
    
    if (-not (Test-Path "deploy\aws-config.json")) {
        Write-Host "✗ No configuration found. Create RDS first." -ForegroundColor Red
        return
    }
    
    $config = Get-Content "deploy\aws-config.json" | ConvertFrom-Json
    
    Write-Host "Seeding database at $($config.DB_HOST)..." -ForegroundColor Yellow
    
    & ".\seed-database.ps1" `
        -Host $config.DB_HOST `
        -Database $config.DB_NAME `
        -User $config.DB_USER `
        -Password $config.DB_PASSWORD
}

function Create-SecurityGroups {
    Write-Host "`n[Step 3] Creating Security Groups..." -ForegroundColor Green
    
    # Get default VPC
    $vpcId = aws ec2 describe-vpcs `
        --filters "Name=isDefault,Values=true" `
        --query 'Vpcs[0].VpcId' `
        --output text
    
    Write-Host "Using VPC: $vpcId" -ForegroundColor Cyan
    
    # Create security group for EC2
    Write-Host "Creating EC2 security group..." -ForegroundColor Yellow
    
    $sgId = aws ec2 create-security-group `
        --group-name premierprime-backend-sg `
        --description "Security group for Premier Prime backend" `
        --vpc-id $vpcId `
        --query 'GroupId' `
        --output text
    
    # Add rules
    aws ec2 authorize-security-group-ingress `
        --group-id $sgId `
        --protocol tcp --port 22 --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress `
        --group-id $sgId `
        --protocol tcp --port 80 --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress `
        --group-id $sgId `
        --protocol tcp --port 443 --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress `
        --group-id $sgId `
        --protocol tcp --port 8080 --cidr 0.0.0.0/0
    
    Write-Host "✓ Security group created: $sgId" -ForegroundColor Green
    
    # Update config
    if (Test-Path "deploy\aws-config.json") {
        $config = Get-Content "deploy\aws-config.json" | ConvertFrom-Json
        $config | Add-Member -NotePropertyName "SG_ID" -NotePropertyValue $sgId -Force
        $config | ConvertTo-Json | Out-File "deploy\aws-config.json"
    }
}

function Launch-EC2Instance {
    Write-Host "`n[Step 4] Launching EC2 Instance..." -ForegroundColor Green
    
    if (-not (Test-Path "deploy\aws-config.json")) {
        Write-Host "✗ No configuration found. Run previous steps first." -ForegroundColor Red
        return
    }
    
    $config = Get-Content "deploy\aws-config.json" | ConvertFrom-Json
    
    # Create key pair
    Write-Host "Creating SSH key pair..." -ForegroundColor Yellow
    
    aws ec2 create-key-pair `
        --key-name premierprime-key `
        --query 'KeyMaterial' `
        --output text | Out-File "deploy\premierprime-key.pem"
    
    Write-Host "✓ Key saved to deploy\premierprime-key.pem" -ForegroundColor Green
    
    # Get latest Amazon Linux AMI
    $amiId = aws ec2 describe-images `
        --owners amazon `
        --filters "Name=name,Values=al2023-ami-2023.*-x86_64" `
        --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' `
        --output text
    
    Write-Host "Using AMI: $amiId" -ForegroundColor Cyan
    
    # Launch instance
    Write-Host "Launching EC2 instance..." -ForegroundColor Yellow
    
    $instanceId = aws ec2 run-instances `
        --image-id $amiId `
        --instance-type t3.micro `
        --key-name premierprime-key `
        --security-group-ids $config.SG_ID `
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=premierprime-backend}]" `
        --query 'Instances[0].InstanceId' `
        --output text
    
    Write-Host "✓ Instance launched: $instanceId" -ForegroundColor Green
    
    # Wait for instance
    Write-Host "Waiting for instance to start..." -ForegroundColor Yellow
    aws ec2 wait instance-running --instance-ids $instanceId
    
    # Get public IP
    $publicIp = aws ec2 describe-instances `
        --instance-ids $instanceId `
        --query 'Reservations[0].Instances[0].PublicIpAddress' `
        --output text
    
    Write-Host "✓ Instance ready!" -ForegroundColor Green
    Write-Host "Public IP: $publicIp" -ForegroundColor Cyan
    
    # Update config
    $config | Add-Member -NotePropertyName "EC2_INSTANCE_ID" -NotePropertyValue $instanceId -Force
    $config | Add-Member -NotePropertyName "EC2_PUBLIC_IP" -NotePropertyValue $publicIp -Force
    $config | ConvertTo-Json | Out-File "deploy\aws-config.json"
}

function Show-NextSteps {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host " Next Steps" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    if (Test-Path "deploy\aws-config.json") {
        $config = Get-Content "deploy\aws-config.json" | ConvertFrom-Json
        
        Write-Host "Your AWS Resources:" -ForegroundColor Yellow
        Write-Host "  Database: $($config.DB_HOST)"
        if ($config.EC2_PUBLIC_IP) {
            Write-Host "  EC2 Instance: $($config.EC2_PUBLIC_IP)"
        }
        Write-Host ""
        
        if ($config.EC2_PUBLIC_IP) {
            Write-Host "To connect to your EC2 instance:" -ForegroundColor Green
            Write-Host "  ssh -i deploy\premierprime-key.pem ec2-user@$($config.EC2_PUBLIC_IP)" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Next: Deploy the backend application" -ForegroundColor Yellow
        } else {
            Write-Host "Next: Launch EC2 instance (Step 4)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Start by checking prerequisites and creating the RDS database." -ForegroundColor Yellow
    }
}

# Main execution
switch ($Step.ToLower()) {
    "1" { Check-Prerequisites }
    "2" { Create-RDSDatabase; Seed-Database }
    "3" { Create-SecurityGroups }
    "4" { Launch-EC2Instance }
    "menu" {
        Show-Menu
        $choice = Read-Host "`nEnter your choice (1-9)"
        
        switch ($choice) {
            "1" { Check-Prerequisites }
            "2" { Create-RDSDatabase; Seed-Database }
            "3" { Create-SecurityGroups }
            "4" { Launch-EC2Instance }
            "8" {
                Check-Prerequisites
                Create-RDSDatabase
                Seed-Database
                Create-SecurityGroups
                Launch-EC2Instance
            }
            "9" { exit }
            default { Write-Host "Invalid choice" -ForegroundColor Red }
        }
        
        Show-NextSteps
    }
    default {
        Show-Menu
        Show-NextSteps
    }
}
