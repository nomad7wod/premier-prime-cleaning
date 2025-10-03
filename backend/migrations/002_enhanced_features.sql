-- +goose Up
-- SQL in this section is executed when the migration is applied.

-- Modify bookings table to support guest bookings
ALTER TABLE bookings 
    ALTER COLUMN user_id DROP NOT NULL,
    ADD COLUMN guest_name VARCHAR(255),
    ADD COLUMN guest_email VARCHAR(255),
    ADD COLUMN guest_phone VARCHAR(50),
    ADD COLUMN is_guest_booking BOOLEAN DEFAULT FALSE;

-- Create quotes table
CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    square_meters DECIMAL(8, 2) NOT NULL,
    address TEXT,
    special_requirements TEXT,
    preferred_date VARCHAR(50),
    contact_email VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    estimated_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('general', 'booking', 'complaint', 'compliment', 'other')),
    admin_notes TEXT,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create faqs table
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('How do I book a cleaning service?', 'You can book a cleaning service directly on our website without creating an account, or register for additional features like booking history and faster checkout.', 'general', 1),
('What cleaning supplies do you use?', 'We use eco-friendly, non-toxic cleaning supplies that are safe for children and pets. All supplies are included in our service.', 'general', 2),
('How far in advance should I book?', 'We recommend booking at least 24-48 hours in advance, though we can often accommodate same-day requests based on availability.', 'booking', 1),
('What if I need to reschedule my appointment?', 'You can reschedule your appointment up to 2 hours before the scheduled time. Contact us or use our online system to make changes.', 'booking', 2),
('Do you offer recurring cleaning services?', 'Yes! We offer weekly, bi-weekly, monthly, and custom recurring cleaning schedules with discounted rates.', 'general', 3),
('What is included in your cleaning service?', 'Our standard cleaning includes dusting, vacuuming, mopping, bathroom cleaning, kitchen cleaning, and trash removal. Deep cleaning includes additional services.', 'general', 4);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE faqs;
DROP TABLE contact_messages;
DROP TABLE quotes;
ALTER TABLE bookings 
    DROP COLUMN is_guest_booking,
    DROP COLUMN guest_phone,
    DROP COLUMN guest_email,
    DROP COLUMN guest_name,
    ALTER COLUMN user_id SET NOT NULL;