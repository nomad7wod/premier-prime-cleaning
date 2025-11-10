#!/bin/bash
# Database Seeding Script for AWS RDS or Remote PostgreSQL
# Usage: ./seed-database.sh <host> <database> <user>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required arguments are provided
if [ "$#" -lt 3 ]; then
    echo -e "${RED}Usage: $0 <host> <database> <user>${NC}"
    echo "Example: $0 my-rds.amazonaws.com cleaning_app postgres"
    exit 1
fi

DB_HOST=$1
DB_NAME=$2
DB_USER=$3

echo -e "${GREEN}Premier Prime Cleaning - Database Seeding Script${NC}"
echo "=================================================="
echo "Host: $DB_HOST"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "=================================================="
echo ""

# Ask for password
read -sp "Enter database password: " DB_PASSWORD
echo ""

# Test connection
echo -e "${YELLOW}Testing database connection...${NC}"
export PGPASSWORD=$DB_PASSWORD
if psql -h $DB_HOST -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed. Please check your credentials.${NC}"
    exit 1
fi

# Check if database exists, create if not
echo -e "${YELLOW}Checking if database exists...${NC}"
DB_EXISTS=$(psql -h $DB_HOST -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" != "1" ]; then
    echo -e "${YELLOW}Database doesn't exist. Creating...${NC}"
    psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
else
    echo -e "${GREEN}✓ Database exists${NC}"
fi

# Get list of migration files
MIGRATION_DIR="backend/migrations"
if [ ! -d "$MIGRATION_DIR" ]; then
    echo -e "${RED}✗ Migration directory not found: $MIGRATION_DIR${NC}"
    exit 1
fi

# Run migrations
echo -e "${YELLOW}Running migrations...${NC}"
for migration in $(ls -1 $MIGRATION_DIR/*.sql | sort); do
    filename=$(basename "$migration")
    echo -e "${YELLOW}  Running $filename...${NC}"
    
    if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$migration" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ $filename completed${NC}"
    else
        echo -e "${RED}  ✗ $filename failed (this might be expected if already applied)${NC}"
    fi
done

# Verify data was seeded
echo ""
echo -e "${YELLOW}Verifying seed data...${NC}"

# Check admin user
ADMIN_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM users WHERE role='admin';")
echo -e "  Admin users: $ADMIN_COUNT"
if [ "$ADMIN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}  ✓ Admin user exists${NC}"
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT email, first_name, last_name, role FROM users WHERE role='admin';"
else
    echo -e "${RED}  ✗ No admin user found${NC}"
fi

# Check services
SERVICE_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM services;")
echo ""
echo -e "  Services: $SERVICE_COUNT"
if [ "$SERVICE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}  ✓ Services exist${NC}"
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT id, name, service_type FROM services ORDER BY id;"
else
    echo -e "${RED}  ✗ No services found${NC}"
fi

# Check FAQs
FAQ_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM faqs;")
echo ""
echo -e "  FAQs: $FAQ_COUNT"
if [ "$FAQ_COUNT" -gt 0 ]; then
    echo -e "${GREEN}  ✓ FAQs exist${NC}"
else
    echo -e "${YELLOW}  ⚠ No FAQs found${NC}"
fi

echo ""
echo -e "${GREEN}=================================================="
echo "Database seeding completed!"
echo "==================================================${NC}"
echo ""
echo "Default Admin Credentials:"
echo "  Email: adaperez@premierprime.org"
echo "  Password: admin123"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change the admin password after first login!${NC}"
echo ""

unset PGPASSWORD
