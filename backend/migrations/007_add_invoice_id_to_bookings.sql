-- Add invoice_id column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS invoice_id INTEGER;

-- Add foreign key constraint
ALTER TABLE bookings ADD CONSTRAINT bookings_invoice_id_fkey 
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_invoice_id ON bookings(invoice_id);
