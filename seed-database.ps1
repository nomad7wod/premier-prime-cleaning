# Database Seeding Script for AWS RDS or Remote PostgreSQL (Windows PowerShell)
# Usage: .\seed-database.ps1 -Host "your-rds.amazonaws.com" -Database "cleaning_app" -User "postgres"

param(
    [Parameter(Mandatory=$true)]
    [string]$DbHost,
    
    [Parameter(Mandatory=$true)]
    [string]$Database,
    
    [Parameter(Mandatory=$true)]
    [string]$User,
    
    [Parameter(Mandatory=$false)]
    [string]$Password
)

Write-Host "Premier Prime Cleaning - Database Seeding Script" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Host: $DbHost"
Write-Host "Database: $Database"
Write-Host "User: $User"
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

# Ask for password securely if not provided
if ([string]::IsNullOrEmpty($Password)) {
    $SecurePassword = Read-Host "Enter database password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Set environment variable for psql
$env:PGPASSWORD = $Password

# Test connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
try {
    $testResult = & psql -h $DbHost -U $User -d postgres -c "\q" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Connection successful" -ForegroundColor Green
    } else {
        Write-Host "✗ Connection failed. Please check your credentials." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ psql command not found. Please install PostgreSQL client tools." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Check if database exists
Write-Host "Checking if database exists..." -ForegroundColor Yellow
$dbExists = & psql -h $DbHost -U $User -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$Database'" 2>&1
if ($dbExists -ne "1") {
    Write-Host "Database doesn't exist. Creating..." -ForegroundColor Yellow
    & psql -h $DbHost -U $User -d postgres -c "CREATE DATABASE $Database;" | Out-Null
    Write-Host "✓ Database created" -ForegroundColor Green
} else {
    Write-Host "✓ Database exists" -ForegroundColor Green
}

# Get list of migration files
$migrationDir = "backend\migrations"
if (-not (Test-Path $migrationDir)) {
    Write-Host "✗ Migration directory not found: $migrationDir" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "Running migrations..." -ForegroundColor Yellow
$migrations = Get-ChildItem -Path $migrationDir -Filter "*.sql" | Sort-Object Name
foreach ($migration in $migrations) {
    $filename = $migration.Name
    Write-Host "  Running $filename..." -ForegroundColor Yellow
    
    $result = & psql -h $DbHost -U $User -d $Database -f $migration.FullName 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $filename completed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $filename failed (this might be expected if already applied)" -ForegroundColor Red
    }
}

# Verify data was seeded
Write-Host ""
Write-Host "Verifying seed data..." -ForegroundColor Yellow

# Check admin user
$adminCount = & psql -h $DbHost -U $User -d $Database -tAc "SELECT COUNT(*) FROM users WHERE role='admin';" 2>&1
Write-Host "  Admin users: $adminCount"
if ([int]$adminCount -gt 0) {
    Write-Host "  ✓ Admin user exists" -ForegroundColor Green
    & psql -h $DbHost -U $User -d $Database -c "SELECT email, first_name, last_name, role FROM users WHERE role='admin';"
} else {
    Write-Host "  ✗ No admin user found" -ForegroundColor Red
}

# Check services
$serviceCount = & psql -h $DbHost -U $User -d $Database -tAc "SELECT COUNT(*) FROM services;" 2>&1
Write-Host ""
Write-Host "  Services: $serviceCount"
if ([int]$serviceCount -gt 0) {
    Write-Host "  ✓ Services exist" -ForegroundColor Green
    & psql -h $Host -U $User -d $Database -c "SELECT id, name, service_type FROM services ORDER BY id;"
} else {
    Write-Host "  ✗ No services found" -ForegroundColor Red
}

# Check FAQs
$faqCount = & psql -h $Host -U $User -d $Database -tAc "SELECT COUNT(*) FROM faqs;" 2>&1
Write-Host ""
Write-Host "  FAQs: $faqCount"
if ([int]$faqCount -gt 0) {
    Write-Host "  ✓ FAQs exist" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No FAQs found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Database seeding completed!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Default Admin Credentials:"
Write-Host "  Email: adaperez@premierprime.org"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Change the admin password after first login!" -ForegroundColor Yellow
Write-Host ""

# Clear password from environment
$env:PGPASSWORD = $null
