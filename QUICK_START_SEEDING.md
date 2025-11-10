# 🚀 Quick Start - Database Seeding

## For Local Development (Docker)

```bash
# Start application (seeds database automatically)
docker-compose up --build

# Default login
Email: adaperez@premierprime.org
Password: admin123
```

✅ **Done!** Database is automatically seeded with:
- Admin user
- 7 cleaning services
- 8 FAQs
- All required tables

---

## For AWS/Remote Database

### Windows:
```powershell
.\seed-database.ps1 -Host "your-db.amazonaws.com" -Database "cleaning_app" -User "postgres"
```

### Mac/Linux:
```bash
./seed-database.sh your-db.amazonaws.com cleaning_app postgres
```

---

## What Gets Seeded?

| Category | Count | Details |
|----------|-------|---------|
| **Admin Users** | 1 | adaperez@premierprime.org |
| **Services** | 7 | All cleaning service types |
| **FAQs** | 8 | Common questions answered |
| **Tables** | 7 | Users, Services, Bookings, etc. |

---

## After First Deployment

1. ✅ Login to admin panel
2. ✅ **Change admin password immediately**
3. ✅ Test booking flow
4. ✅ Configure email settings
5. ✅ Add team members

---

## Useful Commands

**Check if data loaded:**
```bash
# Local
docker exec -it cleaning-app_postgres_1 psql -U postgres -d cleaning_app -c "SELECT COUNT(*) FROM services;"

# Remote
psql -h your-host -U postgres -d cleaning_app -c "SELECT COUNT(*) FROM services;"
```

**Reset local database:**
```bash
docker-compose down
docker volume rm cleaning-app_postgres_data
docker-compose up --build
```

---

## 📚 Full Documentation

- **[DATABASE_SEEDING.md](DATABASE_SEEDING.md)** - Complete seeding guide
- **[AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md)** - AWS deployment walkthrough
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Quick deployment options

---

## Need Help?

1. Check logs: `docker logs cleaning-app_app_1`
2. Database logs: `docker logs cleaning-app_postgres_1`
3. Read the full docs above
4. Email: adaperez@premierprime.org

---

**🎉 Your cleaning app is ready to take bookings!**
