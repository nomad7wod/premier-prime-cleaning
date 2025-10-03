-- Migration: Add billing address to bookings and create invoicing tables
-- Date: 2025-01-01
-- Description: Add billing address fields to bookings table and create comprehensive invoicing system for Florida compliance

-- Add billing address fields to bookings table
ALTER TABLE bookings 
ADD COLUMN billing_address VARCHAR(255),
ADD COLUMN billing_city VARCHAR(100),
ADD COLUMN billing_state VARCHAR(50) DEFAULT 'FL',
ADD COLUMN billing_zip_code VARCHAR(20),
ADD COLUMN billing_country VARCHAR(100) DEFAULT 'United States';

-- Create invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    
    -- Billing Address
    billing_address VARCHAR(255) NOT NULL,
    billing_city VARCHAR(100) NOT NULL,
    billing_state VARCHAR(50) NOT NULL DEFAULT 'FL',
    billing_zip_code VARCHAR(20) NOT NULL,
    billing_country VARCHAR(100) NOT NULL DEFAULT 'United States',
    
    -- Service Address
    service_address VARCHAR(255) NOT NULL,
    service_city VARCHAR(100),
    service_state VARCHAR(50) DEFAULT 'FL',
    service_zip_code VARCHAR(20),
    
    -- Financial Details
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0700, -- 7% Florida tax
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment Information
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    payment_reference VARCHAR(100),
    
    -- Florida Tax Compliance
    florida_tax_id VARCHAR(50) DEFAULT 'FL-TAX-ID-123456',
    tax_exempt BOOLEAN NOT NULL DEFAULT FALSE,
    tax_exempt_reason VARCHAR(255),
    
    -- Additional Information
    notes TEXT,
    terms TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice_items table for line items
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    taxable BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on invoices
CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for invoice summaries (useful for accounting reports)
CREATE VIEW invoice_summary AS
SELECT 
    i.id,
    i.invoice_number,
    i.issue_date,
    i.due_date,
    i.customer_name,
    i.customer_email,
    i.status,
    i.subtotal,
    i.tax_amount,
    i.total_amount,
    i.payment_method,
    i.payment_date,
    b.scheduled_date as service_date,
    s.name as service_name,
    CASE 
        WHEN i.status = 'paid' THEN 'Current'
        WHEN i.due_date < CURRENT_DATE AND i.status = 'pending' THEN 'Overdue'
        ELSE 'Pending'
    END as aging_status,
    CASE 
        WHEN i.due_date < CURRENT_DATE AND i.status = 'pending' THEN 
            CURRENT_DATE - i.due_date::date
        ELSE 0
    END as days_overdue
FROM invoices i
JOIN bookings b ON i.booking_id = b.id
JOIN services s ON b.service_id = s.id;

-- Create a view for monthly revenue reports
CREATE VIEW monthly_revenue AS
SELECT 
    EXTRACT(YEAR FROM issue_date) as year,
    EXTRACT(MONTH FROM issue_date) as month,
    COUNT(*) as invoice_count,
    SUM(subtotal) as gross_revenue,
    SUM(tax_amount) as tax_collected,
    SUM(total_amount) as total_revenue,
    SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_revenue,
    SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END) as pending_revenue,
    SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) as overdue_revenue
FROM invoices
GROUP BY EXTRACT(YEAR FROM issue_date), EXTRACT(MONTH FROM issue_date)
ORDER BY year DESC, month DESC;