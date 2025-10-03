package models

import (
	"time"
)

// Invoice represents an invoice for a booking
type Invoice struct {
	ID                 int       `json:"id" db:"id"`
	BookingID          int       `json:"booking_id" db:"booking_id"`
	InvoiceNumber      string    `json:"invoice_number" db:"invoice_number"`
	IssueDate          time.Time `json:"issue_date" db:"issue_date"`
	DueDate            time.Time `json:"due_date" db:"due_date"`
	
	// Customer Information
	CustomerName       string    `json:"customer_name" db:"customer_name"`
	CustomerEmail      string    `json:"customer_email" db:"customer_email"`
	CustomerPhone      string    `json:"customer_phone" db:"customer_phone"`
	
	// Billing Address
	BillingAddress     string    `json:"billing_address" db:"billing_address"`
	BillingCity        string    `json:"billing_city" db:"billing_city"`
	BillingState       string    `json:"billing_state" db:"billing_state"`
	BillingZipCode     string    `json:"billing_zip_code" db:"billing_zip_code"`
	BillingCountry     string    `json:"billing_country" db:"billing_country"`
	
	// Service Address
	ServiceAddress     string    `json:"service_address" db:"service_address"`
	ServiceCity        string    `json:"service_city" db:"service_city"`
	ServiceState       string    `json:"service_state" db:"service_state"`
	ServiceZipCode     string    `json:"service_zip_code" db:"service_zip_code"`
	
	// Financial Details
	Subtotal           float64   `json:"subtotal" db:"subtotal"`
	TaxRate            float64   `json:"tax_rate" db:"tax_rate"`
	TaxAmount          float64   `json:"tax_amount" db:"tax_amount"`
	TotalAmount        float64   `json:"total_amount" db:"total_amount"`
	
	// Payment Information
	Status             string    `json:"status" db:"status"` // pending, paid, overdue, cancelled
	PaymentMethod      string    `json:"payment_method" db:"payment_method"` // cash, check, credit_card, bank_transfer
	PaymentDate        *time.Time `json:"payment_date" db:"payment_date"`
	PaymentReference   string    `json:"payment_reference" db:"payment_reference"`
	
	// Florida Tax Compliance
	FloridaTaxID       string    `json:"florida_tax_id" db:"florida_tax_id"`
	TaxExempt          bool      `json:"tax_exempt" db:"tax_exempt"`
	TaxExemptReason    string    `json:"tax_exempt_reason" db:"tax_exempt_reason"`
	
	// Additional Information
	Notes              string    `json:"notes" db:"notes"`
	Terms              string    `json:"terms" db:"terms"`
	
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}

// InvoiceItem represents individual line items on an invoice
type InvoiceItem struct {
	ID          int     `json:"id" db:"id"`
	InvoiceID   int     `json:"invoice_id" db:"invoice_id"`
	Description string  `json:"description" db:"description"`
	Quantity    float64 `json:"quantity" db:"quantity"`
	UnitPrice   float64 `json:"unit_price" db:"unit_price"`
	TotalPrice  float64 `json:"total_price" db:"total_price"`
	Taxable     bool    `json:"taxable" db:"taxable"`
}

// InvoiceResponse represents the full invoice with line items
type InvoiceResponse struct {
	Invoice
	Items       []InvoiceItem `json:"items"`
	ServiceName string        `json:"service_name"`
	BookingDate time.Time     `json:"booking_date"`
}

// InvoiceCreateRequest represents the request to create an invoice
type InvoiceCreateRequest struct {
	BookingID          int                        `json:"booking_id" validate:"required"`
	BillingAddress     string                     `json:"billing_address" validate:"required"`
	BillingCity        string                     `json:"billing_city" validate:"required"`
	BillingState       string                     `json:"billing_state" validate:"required"`
	BillingZipCode     string                     `json:"billing_zip_code" validate:"required"`
	BillingCountry     string                     `json:"billing_country"`
	TaxExempt          bool                       `json:"tax_exempt"`
	TaxExemptReason    string                     `json:"tax_exempt_reason"`
	PaymentMethod      string                     `json:"payment_method"`
	Notes              string                     `json:"notes"`
	Items              []InvoiceItemCreateRequest `json:"items"`
}

// InvoiceItemCreateRequest represents individual items for invoice creation
type InvoiceItemCreateRequest struct {
	Description string  `json:"description" validate:"required"`
	Quantity    float64 `json:"quantity" validate:"required,gt=0"`
	UnitPrice   float64 `json:"unit_price" validate:"required,gt=0"`
	Taxable     bool    `json:"taxable"`
}

// InvoiceUpdateRequest represents updates to an invoice
type InvoiceUpdateRequest struct {
	Status           string     `json:"status" validate:"omitempty,oneof=pending paid overdue cancelled"`
	PaymentMethod    string     `json:"payment_method"`
	PaymentDate      *time.Time `json:"payment_date"`
	PaymentReference string     `json:"payment_reference"`
	Notes            string     `json:"notes"`
}

// Florida tax rates and settings
const (
	FloridaStateTaxRate     = 0.06    // 6% Florida state sales tax
	FloridaDiscretionaryTax = 0.01    // 1% discretionary sales surtax (varies by county)
	DefaultDueDays          = 30      // Net 30 payment terms
)

// Invoice statuses
const (
	InvoiceStatusPending  = "pending"
	InvoiceStatusPaid     = "paid"
	InvoiceStatusOverdue  = "overdue"
	InvoiceStatusCancelled = "cancelled"
)

// Payment methods
const (
	PaymentMethodCash        = "cash"
	PaymentMethodCheck       = "check"
	PaymentMethodCreditCard  = "credit_card"
	PaymentMethodBankTransfer = "bank_transfer"
)