-- Migration: Add custom invoice flag to bookings
-- Date: 2025-10-14
-- Description: Add is_custom_invoice flag to bookings table to support custom invoices without real bookings

-- Add custom invoice flag to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS is_custom_invoice BOOLEAN DEFAULT FALSE;

-- Update existing records to be false
UPDATE bookings SET is_custom_invoice = FALSE WHERE is_custom_invoice IS NULL;
