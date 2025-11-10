# Database Seeding Guide - Premier Prime Cleaning

## Overview
This guide explains how the database is automatically initialized with essential data when you deploy the application.

## Automatic Initialization

When you start the application for the first time (locally or on AWS), the PostgreSQL database automatically runs all SQL migration files in the `backend/migrations` folder. These files create the schema and insert initial data.

## What Gets Seeded Automatically

### 1. **Database Schema**
All tables are created automatically:
- Users
- Services
- Bookings
- Quotes
- Invoices
- Contact Messages
- FAQs

### 2. **Default Admin User**
- **Email**: adaperez@premierprime.org
- **Password**: admin123
- **Role**: Admin
- **Note**: ⚠️ Change this password immediately after first login!

### 3. **Services** (6 Services)
1. **Residential Cleaning** - Standard home cleaning
2. **Office and Commercial Cleaning** - Business cleaning services
3. **Airbnb Turnaround Cleaning** - Vacation rental cleaning
4. **Custom Cleaning** - Tailored cleaning services
5. **Post Renovation Cleaning** - Construction cleanup
6. **Move in/Move out Deep Cleaning** - Moving cleaning services
7. **Deep Cleaning** - Comprehensive deep cleaning

### 4. **FAQs** (8 Common Questions)
- What areas do you serve?
- How far in advance should I book?
- Do I need to provide cleaning supplies?
- What if I need to reschedule?
- Are your cleaners insured?
- How do I pay for services?
- What is included in a standard cleaning?
- Can I request specific cleaning tasks?

## How It Works

### Local Development
1. When you run `docker-compose up --build`, Docker creates a PostgreSQL container
2. PostgreSQL automatically executes all `.sql` files in the `backend/migrations` folder in alphabetical order
3. Your database is ready with all initial data

### AWS Deployment (RDS)
1. Create a new RDS PostgreSQL instance
2. Connect to it using a PostgreSQL client (like pgAdmin or psql)
3. Run all migration files manually in order:
   ```bash
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d cleaning_app -f backend/migrations/001_initial_schema.sql
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d cleaning_app -f backend/migrations/002_enhanced_features.sql
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d cleaning_app -f backend/migrations/003_create_default_admin.sql
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d cleaning_app -f backend/migrations/004_insert_default_services.sql
   # ... continue for all migrations
   ```

## Migration Files (Execution Order)

The migrations run in this order:
1. `001_initial_schema.sql` - Creates all tables
2. `002_enhanced_features.sql` - Adds additional features
3. `003_create_default_admin.sql` - Creates admin user
4. `004_insert_default_services.sql` - Inserts services
5. `005_add_billing_and_invoices.sql` - Adds invoice tables
6. `006_add_custom_invoice_flag.sql` - Adds invoice features
7. `007_add_invoice_id_to_bookings.sql` - Links invoices to bookings

## Resetting the Database

### Local Development
If you need to start fresh:

```bash
# Stop containers
docker-compose down

# Remove database volume (this deletes all data)
docker volume rm cleaning-app_postgres_data

# Restart (will re-run all migrations)
docker-compose up --build
```

### AWS/Production
**⚠️ WARNING**: Never delete production data without a backup!

1. Create a backup first:
   ```bash
   pg_dump -h your-rds-endpoint.amazonaws.com -U postgres cleaning_app > backup.sql
   ```

2. Drop and recreate database:
   ```sql
   DROP DATABASE cleaning_app;
   CREATE DATABASE cleaning_app;
   ```

3. Re-run all migrations

## Adding More Seed Data

To add more initial data (e.g., more services, FAQs):

1. Create a new migration file: `008_your_description.sql`
2. Add your INSERT statements
3. Place it in `backend/migrations/`
4. Restart the application

Example:
```sql
-- 008_add_more_services.sql
INSERT INTO services (name, description, base_price, duration_hours, service_type) 
VALUES ('Window Cleaning', 'Professional window cleaning service', 80.00, 2.0, 'residential')
ON CONFLICT DO NOTHING;
```

## Verifying Seed Data

After deployment, verify data loaded correctly:

### Check Admin User
```sql
SELECT email, first_name, last_name, role FROM users WHERE role = 'admin';
```

### Check Services
```sql
SELECT id, name, service_type FROM services ORDER BY id;
```

### Check FAQs
```sql
SELECT question FROM faqs ORDER BY display_order;
```

## Environment Variables Required

Make sure these are set in your environment:
- `DB_HOST` - Database hostname
- `DB_PORT` - Database port (usually 5432)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (cleaning_app)

## Troubleshooting

### Problem: Migrations don't run
**Solution**: Check docker-compose.yml has this volume mapping:
```yaml
volumes:
  - ./backend/migrations:/docker-entrypoint-initdb.d
```

### Problem: Duplicate key errors
**Solution**: All seed data uses `ON CONFLICT DO NOTHING` or `ON CONFLICT (email) DO NOTHING` to prevent duplicates. If you see errors, the database might already have data.

### Problem: Can't login with admin credentials
**Solution**: 
1. Verify the admin user exists in the database
2. The password hash is for "admin123"
3. Email should be: adaperez@premierprime.org

### Problem: Services don't appear
**Solution**: 
1. Check migration 004 ran successfully
2. Query: `SELECT COUNT(*) FROM services;` should return 7

## Security Notes

1. **Change default admin password** immediately after first login
2. **Use strong passwords** in production
3. **Restrict database access** - only allow your application servers
4. **Enable SSL** for database connections in production
5. **Backup regularly** - especially before migrations

## AWS RDS Specific Notes

When using AWS RDS:
1. RDS doesn't support `/docker-entrypoint-initdb.d/` - you must run migrations manually
2. Consider using AWS Database Migration Service (DMS) for initial setup
3. Or use an initialization Lambda function to run migrations on first deploy
4. Store migration state in a separate table to track which migrations have run

## Next Steps

After seeding is complete:
1. Login with admin credentials
2. Change the default password
3. Add your team members
4. Customize services as needed
5. Test booking flow
6. Configure email notifications for quotes

## Contact

For issues with database initialization, check:
- Application logs: `./logs/app.log`
- PostgreSQL logs: `docker logs cleaning-app_postgres_1`
- Backend console: `docker logs cleaning-app_app_1`
