# Custom Invoice Feature Implementation

## Overview
Added functionality to create custom invoices for services provided outside the booking system. This allows you to manually create invoices for customers who didn't book through the app.

## Changes Made

### Backend Changes

1. **New Handler Function** (`backend/internal/handlers/simple_invoice.go`)
   - Added `SimpleCreateCustomInvoice` function
   - Creates invoices with manually entered data
   - Email and phone are now optional fields
   - Service selection from existing services or custom entry
   - Automatically calculates 7% Florida tax (can be exempted)
   - Creates a dummy booking record with `is_custom_invoice=true` flag for tracking

2. **New Route** (`backend/cmd/main.go`)
   - Added: `POST /api/admin/invoices/custom`
   - Protected by admin authentication middleware

3. **Database Migration** (`backend/migrations/006_add_custom_invoice_flag.sql`)
   - Added `is_custom_invoice` boolean column to bookings table
   - Allows differentiation between real bookings and custom invoice placeholders

### Frontend Changes

1. **AdminInvoices Component Updates** (`frontend/src/pages/AdminInvoices.js`)
   - Added new state for custom invoice modal
   - Split "Create Invoice" button into two options:
     - "Custom Invoice" (purple/pink gradient) - For manual entry
     - "From Booking" (green/blue gradient) - For existing bookings
   
2. **New CustomInvoiceModal Component**
   - Comprehensive form with sections for:
     - **Customer Information**: Name (required), email (optional), phone (optional)
     - **Billing Address**: Full address details
     - **Service Address**: Optional separate address (defaults to billing)
     - **Service Details**: Service dropdown (from database) or custom entry, date, subtotal, payment terms
     - **Tax Information**: Tax exempt option with reason
     - **Additional Notes**: Special terms or conditions
   
   - Features:
     - Service dropdown populated from API with existing services
     - "Custom Service" option to manually enter service name
     - Real-time total calculation with tax
     - Toggle to use billing address as service address
     - Configurable payment due days (default: 30 days)
     - Tax exempt option with reason field
     - Beautiful gradient design matching app theme

## How to Use

### Creating a Custom Invoice

1. **Navigate to Invoice Management**
   - Log in as admin
   - Go to Admin Dashboard → Invoice Management

2. **Click "Custom Invoice" Button**
   - Purple/pink gradient button in the top right
   - Opens the custom invoice form

3. **Fill Out the Form**
   - **Customer Information**: Required name, optional email and phone
   - **Billing Address**: Full address where invoice should be sent
   - **Service Address**: Can be same as billing or different
   - **Service Details**: 
     - Select service from dropdown or choose "Custom Service" to enter manually
     - Enter service name if custom selected
     - Select service date
     - Enter subtotal amount
     - Set payment due days (default 30)
   - **Tax Options**: Check if customer is tax exempt
   - **Notes**: Any special terms or instructions

4. **Review & Submit**
   - Total automatically calculates (subtotal + 7% FL tax)
   - Click "Create Custom Invoice" to generate

5. **Result**
   - Invoice is created with unique invoice number
   - Appears in invoice list with all other invoices
   - Can be viewed, marked as paid, or managed like any other invoice

## API Endpoint

### POST `/api/admin/invoices/custom`

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "(555) 123-4567",
  "billing_address": "123 Main St",
  "billing_city": "Miami",
  "billing_state": "FL",
  "billing_zip_code": "33101",
  "service_address": "123 Main St",
  "service_city": "Miami",
  "service_state": "FL",
  "service_zip_code": "33101",
  "service_name": "Deep Cleaning Service",
  "service_date": "2025-10-15",
  "subtotal": 150.00,
  "tax_exempt": false,
  "tax_exempt_reason": "",
  "notes": "Special cleaning service",
  "due_days": 30
}
```

**Note:** 
- `customer_email` and `customer_phone` are now optional fields
- `service_name` can be either a standard service or custom text

**Response:**
```json
{
  "message": "Custom invoice created successfully",
  "invoice_id": 123,
  "invoice_number": "PP-INV-2025-11-042",
  "total_amount": 160.50
}
```

## Technical Details

- **Tax Calculation**: 7% Florida sales tax (6% state + 1% discretionary)
- **Invoice Numbering**: Follows standard PP-INV-YYYY-MM-NNN format
- **Payment Terms**: Configurable due date (default 30 days)
- **Tax ID**: Uses FL-59-123456789 for all invoices
- **Status**: All custom invoices start as "pending"
- **Service Address**: Optional, defaults to billing address if not provided

## Database Structure

Custom invoices create a placeholder booking with:
- `is_custom_invoice = true`
- `status = 'completed'`
- `payment_status = 'paid'`
- `service_id = 1` (default)
- `scheduled_time = '00:00'`
- `space_size = 'N/A'`

This ensures invoice reports and queries work consistently across all invoices.

## Benefits

1. **Flexibility**: Create invoices for any service, not just bookings
2. **Professional**: Same invoice format and quality as booking-based invoices
3. **Tax Compliance**: Automatic Florida tax calculation and reporting
4. **Easy Tracking**: All invoices in one place, filterable by status
5. **Customer Service**: Can quickly invoice walk-in or phone customers

## Testing

To test the feature:
1. Navigate to http://localhost:3000/admin
2. Log in with admin credentials
3. Go to Invoice Management
4. Click "Custom Invoice"
5. Fill out the form and create a test invoice
6. Verify it appears in the invoice list
7. Click to view the invoice details
8. Test marking it as paid

## Future Enhancements

Potential improvements:
- Multiple line items per invoice
- Custom tax rates per customer
- Invoice templates
- Email invoice to customer directly
- PDF download/print functionality
- Recurring invoices
