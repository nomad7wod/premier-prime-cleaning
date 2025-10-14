# Premier Prime Cleaning Service System

A comprehensive web application for managing cleaning service reservations, built with Go (Gin) backend and React (TypeScript) frontend.

## 🏢 Company Information
**Company Name:** Premier Prime  
**Industry:** Professional Cleaning Services  
**Mission:** Making your space shine with professional cleaning services. Your satisfaction is our priority!

## 🚀 Features

### Core Functionality
- User authentication with JWT tokens
- Service reservation system for residential and commercial cleaning
- Admin panel for managing bookings and services
- Role-based access control (client/admin)
- Service catalog with pricing and duration
- Booking management with status tracking
- **Guest booking system** - Book without creating an account
- **Quote request system** - Get price estimates
- **Contact message system** - Customer inquiries

### 💰 Professional Invoicing & Florida Tax Compliance
- **Automated Invoice Generation**: Professional invoices created automatically from bookings
- **Custom Invoice Creation**: Create invoices for services outside the booking system
  - Service dropdown with existing services or custom entry
  - Optional email and phone fields for flexibility
  - Tax-inclusive pricing (enter final amount, system calculates breakdown)
- **Florida Tax Compliance**: 7% tax calculation (6% state + 1% discretionary) with proper reporting
- **Billing Address Collection**: Separate service and billing addresses for accurate invoicing
- **Payment Tracking**: Multiple payment methods (cash, check, credit card, bank transfer)
- **Tax-Exempt Handling**: Support for tax-exempt customers with reason tracking
- **Professional Invoice Format**: 
  - Unique invoice numbers (PP-INV-YYYY-MM-NNN format)
  - Complete company branding and Florida tax ID
  - Detailed service descriptions and line items
  - Payment terms and conditions
  - Clean, customer-facing format (no internal status displayed)
- **Invoice Management Features**:
  - Prevent duplicate invoices with booking-invoice linking
  - Filter bookings to show only those without existing invoices
  - Real-time invoice status tracking (pending, paid, overdue)
  - Mark invoices as paid with payment method and reference
- **Accounting Features**:
  - Monthly revenue reports
  - Tax collection summaries
  - Overdue invoice tracking
  - Payment history and references

### 📅 Enhanced Calendar System
- **Monthly View**: Complete month overview with booking counts and revenue
- **Weekly View**: Detailed weekly scheduling with time slots
- **Daily View**: Comprehensive daily schedule with customer information
- **Real-time Updates**: Live booking status and calendar synchronization
- **FAQ management** - Frequently asked questions
- **Multi-view calendar** - Month, Week, and Day views for admins
- Responsive web interface with warm, friendly design

## Technology Stack

### Backend
- **Go 1.21+** - Programming language
- **Gin Framework** - Web framework
- **PostgreSQL 15+** - Database
- **Redis** - Caching and session storage
- **JWT** - Authentication
- **Docker** - Containerization

### Frontend
- **React 18+** - Frontend library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **React Router v6** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Form validation
- **React DatePicker** - Date selection component

## 🚀 Quick Start (Development)

### Prerequisites
- Docker and Docker Desktop
- Go 1.21+ (if running backend separately)
- Node.js 18+ (if running frontend separately)

### Using Docker (Recommended)

1. **Clone and navigate:**
```bash
git clone <repository-url>
cd cleaning-app
```

2. **Start the application:**
```bash
docker-compose up --build
```

3. **Access the application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080
   - **Database:** localhost:5432

## 🔑 Development Admin Access

### Default Admin Credentials
- **Email:** `admin@premierprime.com`
- **Password:** `admin123`

### Admin Features Available
- 📊 **Admin Dashboard** - System overview and statistics
- 📅 **Calendar Management** - Month/Week/Day booking views
- 👥 **Booking Management** - View and manage all bookings
- 💳 **Invoice Management** - Create, track, and manage invoices
  - Create from bookings or manually
  - Track payment status
  - Generate professional invoices
  - Filter by status (pending, paid, overdue)
- 📧 **Quote Management** - Handle customer quote requests
- 💬 **Message Management** - Customer inquiries and support
- ❓ **FAQ Management** - Update frequently asked questions
- 🧹 **Service Management** - Add/edit cleaning services

## 🗄️ Database Access (Development)

### Connection Details
- **Host:** localhost
- **Port:** 5432
- **Database:** cleaning_app
- **Username:** postgres
- **Password:** password

### Quick Database Access
```bash
# Connect via Docker
docker exec -it cleaning-app-postgres-1 psql -U postgres -d cleaning_app

# Common queries
\dt                           # List all tables
SELECT * FROM users;          # View all users
SELECT * FROM bookings;       # View all bookings
SELECT * FROM services;       # View all services
SELECT * FROM quotes;         # View quote requests
SELECT * FROM contact_messages; # View contact messages
\q                           # Exit
```

### Database Tables
- **users** - User accounts and admin users
- **services** - Available cleaning services
- **bookings** - All bookings (registered users + guests)
- **invoices** - Professional invoices linked to bookings
- **quotes** - Quote requests from potential customers
- **contact_messages** - Customer inquiries and support requests
- **faqs** - Frequently asked questions

## Project Structure

```
cleaning-app/
├── backend/
│   ├── cmd/
│   ├── internal/
│   │   ├── handlers/        # API request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database operations
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Authentication & CORS
│   │   ├── config/          # Configuration management
│   │   ├── database/        # Database connection
│   │   └── utils/           # Utility functions
│   ├── migrations/          # Database migrations
│   └── docker/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   └── utils/           # Utility functions
│   └── public/
└── docker-compose.yml       # Container orchestration
```

## 🎨 UI Design Features

### Modern, Friendly Interface
- **Warm Color Scheme** - Blues, oranges, yellows, greens
- **Gradient Backgrounds** - Beautiful color transitions
- **Emoji Integration** - Friendly visual indicators throughout
- **Rounded Corners** - Modern, soft design language
- **Hover Effects** - Interactive button animations
- **Responsive Design** - Works on all device sizes

### User Experience
- **Guest Booking** - No account required for quick bookings
- **Real-time Estimates** - Dynamic pricing based on space size
- **Multi-step Forms** - Organized, easy-to-follow booking process
- **Success Celebrations** - Delightful confirmation messages
- **Loading States** - Smooth transitions and feedback

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to get JWT token
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile

### Services
- `GET /api/services` - Get all available services
- `POST /api/services` - Create a new service (admin only)
- `PUT /api/services/:id` - Update a service (admin only)
- `DELETE /api/services/:id` - Delete a service (admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get specific booking
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Cancel a booking

### Guest Features
- `POST /api/guest/booking` - Create guest booking (no auth)
- `GET /api/guest/booking/:id` - Get guest booking details
- `POST /api/quote` - Request a quote (no auth)
- `GET /api/quote/estimate` - Get instant estimate (no auth)

### Admin Features
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/calendar/events` - Get calendar events
- `GET /api/admin/calendar/day/:date` - Get day schedule
- `GET /api/admin/calendar/stats` - Get booking statistics
- `GET /api/admin/quotes` - Get all quote requests
- `PUT /api/admin/quotes/:id` - Update quote status
- `GET /api/admin/messages` - Get contact messages
- `PUT /api/admin/messages/:id` - Update message status

### Invoice Management
- `GET /api/admin/invoices` - Get all invoices (with optional status filter)
- `GET /api/admin/invoices/:id` - Get specific invoice details
- `POST /api/admin/invoices/from-booking/:booking_id` - Create invoice from existing booking
- `POST /api/admin/invoices/custom` - Create custom invoice (no booking required)
- `PUT /api/admin/invoices/:id/mark-paid` - Mark invoice as paid
- `DELETE /api/admin/invoices/:id` - Delete invoice
- `GET /api/admin/invoices/date-range` - Get invoices by date range
- `GET /api/admin/reports` - Get revenue and tax reports

### Public Features
- `POST /api/contact` - Submit contact message (no auth)
- `GET /api/faq` - Get frequently asked questions (no auth)
- `GET /api/available-slots` - Get available time slots (no auth)

## Environment Variables

### Backend
- `SERVER_PORT` - Port for the server (default: 8080)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRY` - JWT token expiry time

## Development Workflow

### Running Tests
Backend tests:
```bash
go test ./...
```

Frontend tests:
```bash
npm test
```

### Database Migrations
Database migrations are handled via the `migrations` directory and are automatically applied on container startup.

### Making Changes
1. **Backend changes**: Modify Go files, rebuild with `docker-compose up --build`
2. **Frontend changes**: Modify React files, hot reload is enabled in development
3. **Database changes**: Add new migration files to `backend/migrations/`

## 🚀 Deployment

The application is containerized and ready for deployment with Docker. Use the provided `docker-compose.yml` file to deploy to any container orchestration platform.

## Security Features

- Passwords hashed with bcrypt (cost factor: 14)
- JWT tokens for authentication
- Input validation on both frontend and backend
- CORS policies implemented
- SQL injection protection through parameterized queries
- Role-based access control (client/admin)

## 📞 Support & Contact

For development support or questions:
- **Email:** adaperez@premierprime.com
- **Phone:** (561) 452-3128
- **Website:** www.premierprime.com
- **Hours:** Mon-Sat 8AM-6PM

## 🎯 Current Development Status

- ✅ User authentication system
- ✅ Service management
- ✅ Regular user bookings
- ✅ Guest booking system
- ✅ Quote request system
- ✅ Admin calendar (Month/Week/Day views)
- ✅ Contact message system
- ✅ FAQ management
- ✅ Modern, friendly UI design
- ✅ Mobile responsive design
- ✅ Professional invoicing system
- ✅ Custom invoice generator with tax-inclusive pricing
- ✅ Invoice-booking linking to prevent duplicates
- ✅ Advanced booking management with status filters
- ✅ Timezone-safe date handling
- ✅ Recent bookings filter
- ✅ Status-based filtering with live counts
- 🚧 Payment integration (planned)
- 🚧 Email notifications (planned)
- 🚧 SMS notifications (planned)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**© 2025 Premier Prime. Made with ❤️ for cleaner spaces.**