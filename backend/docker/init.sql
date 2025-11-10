-- ============================================
-- Premier Prime Cleaning - Database Initialization Script
-- ============================================
-- This script runs automatically when PostgreSQL container starts
-- It creates the database schema and seeds initial data
-- ============================================

-- Create extension for UUID support if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SCHEMA CREATION
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2),
    duration_hours DECIMAL(4, 2),
    service_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    notes TEXT,
    total_price DECIMAL(10, 2),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    invoice_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    service_type VARCHAR(255),
    address TEXT,
    preferred_date DATE,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    service_date DATE NOT NULL,
    service_description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA - ADMIN USER
-- ============================================
-- Default Admin User
-- Email: adaperez@premierprime.org
-- Password: admin123 (Please change after first login)

INSERT INTO users (email, password_hash, first_name, last_name, phone, role, created_at, updated_at) 
VALUES (
    'adaperez@premierprime.org',
    '$2a$10$TIpmjZY3eJ46ioo8j7qJA.p5TzrHEox8yekuGfTW/h9QlfKIvsnXC',
    'Ada',
    'Perez',
    '5551234567',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SEED DATA - SERVICES
-- ============================================

INSERT INTO services (name, description, base_price, duration_hours, service_type, created_at, updated_at) VALUES
('Residential Cleaning', 'Standard cleaning service including dusting, vacuuming, mopping, bathroom cleaning, and kitchen cleaning. Perfect for regular maintenance of your home.', 120.00, 3.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Office and Commercial Cleaning', 'Professional commercial cleaning for offices including trash removal, surface cleaning, vacuuming, and restroom maintenance.', 150.00, 3.0, 'commercial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Airbnb Turnaround Cleaning', 'Fast and thorough cleaning for vacation rentals including linen changes, restocking amenities, and guest-ready preparation.', 100.00, 2.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Custom Cleaning', 'Personalized cleaning service tailored to your specific needs and requirements. Contact us for a custom quote.', 150.00, 3.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Post Renovation Cleaning', 'Specialized cleaning after construction or renovation. Removes dust, debris, and prepares the space for use.', 350.00, 5.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Move in/Move out Deep Cleaning', 'Thorough deep cleaning for moving situations. Includes detailed cleaning of all rooms, cabinets, appliances, and ensuring the property is spotless.', 300.00, 5.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Deep Cleaning', 'Comprehensive deep cleaning service including all basic services plus detailed cleaning of appliances, baseboards, windows, and hard-to-reach areas.', 250.00, 4.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - FAQs
-- ============================================

INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
('What areas do you serve?', 'We currently serve all of Palm Beach County, Florida. Contact us if you have questions about your specific location.', 'Service Area', 1, true),
('How far in advance should I book?', 'We recommend booking at least 2-3 days in advance. However, we do accept same-day bookings based on availability.', 'Booking', 2, true),
('Do I need to provide cleaning supplies?', 'No! We bring all necessary cleaning supplies and equipment. If you have specific products you''d like us to use, we''re happy to accommodate.', 'Service Details', 3, true),
('What if I need to reschedule?', 'You can reschedule your appointment up to 24 hours before the scheduled time at no charge. Please contact us as soon as possible.', 'Booking', 4, true),
('Are your cleaners insured?', 'Yes, all our cleaning professionals are fully insured and bonded for your peace of mind.', 'Safety & Insurance', 5, true),
('How do I pay for services?', 'We accept all major credit cards, debit cards, and electronic payments. Payment is processed securely through our online system.', 'Payment', 6, true),
('What is included in a standard cleaning?', 'Standard cleaning includes dusting, vacuuming, mopping, bathroom cleaning, kitchen cleaning, and general tidying. Deep cleaning services include additional detailed work.', 'Service Details', 7, true),
('Can I request specific cleaning tasks?', 'Absolutely! We customize our services to meet your specific needs. Just let us know your requirements when booking.', 'Service Details', 8, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- END OF INITIALIZATION SCRIPT
-- ============================================
