package services

import (
	"fmt"
	"time"
	"strings"

	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/repositories"
)

type InvoiceService struct {
	invoiceRepo *repositories.InvoiceRepository
	bookingRepo *repositories.BookingRepository
}

func NewInvoiceService(invoiceRepo *repositories.InvoiceRepository, bookingRepo *repositories.BookingRepository) *InvoiceService {
	return &InvoiceService{
		invoiceRepo: invoiceRepo,
		bookingRepo: bookingRepo,
	}
}

// CreateInvoiceFromBooking creates an invoice from a booking
func (s *InvoiceService) CreateInvoiceFromBooking(bookingID int, request *models.InvoiceCreateRequest) (*models.InvoiceResponse, error) {
	// Get booking details
	booking, err := s.bookingRepo.GetBookingByID(bookingID)
	if err != nil {
		return nil, fmt.Errorf("failed to get booking: %v", err)
	}

	// Check if invoice already exists for this booking
	existingInvoice, _ := s.invoiceRepo.GetInvoiceByBookingID(bookingID)
	if existingInvoice != nil {
		return nil, fmt.Errorf("invoice already exists for booking ID %d", bookingID)
	}

	// Generate invoice number
	invoiceNumber, err := s.invoiceRepo.GenerateInvoiceNumber()
	if err != nil {
		return nil, fmt.Errorf("failed to generate invoice number: %v", err)
	}

	// Parse service address
	serviceCity, serviceState, serviceZip := parseAddress(booking.Address)

	// Calculate tax
	subtotal := booking.TotalPrice
	var taxRate float64 = 0.0
	var taxAmount float64 = 0.0

	if !request.TaxExempt {
		taxRate = models.FloridaStateTaxRate + models.FloridaDiscretionaryTax // 7% total
		taxAmount = subtotal * taxRate
	}

	totalAmount := subtotal + taxAmount

	// Create invoice
	invoice := &models.Invoice{
		BookingID:          bookingID,
		InvoiceNumber:      invoiceNumber,
		IssueDate:          time.Now(),
		DueDate:            time.Now().AddDate(0, 0, models.DefaultDueDays),
		CustomerName:       getCustomerName(booking),
		CustomerEmail:      getCustomerEmail(booking),
		CustomerPhone:      getCustomerPhone(booking),
		BillingAddress:     request.BillingAddress,
		BillingCity:        request.BillingCity,
		BillingState:       request.BillingState,
		BillingZipCode:     request.BillingZipCode,
		BillingCountry:     getDefaultCountry(request.BillingCountry),
		ServiceAddress:     booking.Address,
		ServiceCity:        serviceCity,
		ServiceState:       serviceState,
		ServiceZipCode:     serviceZip,
		Subtotal:          subtotal,
		TaxRate:           taxRate,
		TaxAmount:         taxAmount,
		TotalAmount:       totalAmount,
		Status:            models.InvoiceStatusPending,
		PaymentMethod:     request.PaymentMethod,
		FloridaTaxID:      "FL-TAX-ID-123456", // Should be configurable
		TaxExempt:         request.TaxExempt,
		TaxExemptReason:   request.TaxExemptReason,
		Notes:             request.Notes,
		Terms:             getDefaultTerms(),
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	// Create invoice items
	var items []models.InvoiceItem
	if len(request.Items) > 0 {
		// Use provided items
		for _, itemReq := range request.Items {
			item := models.InvoiceItem{
				Description: itemReq.Description,
				Quantity:    itemReq.Quantity,
				UnitPrice:   itemReq.UnitPrice,
				TotalPrice:  itemReq.Quantity * itemReq.UnitPrice,
				Taxable:     itemReq.Taxable,
			}
			items = append(items, item)
		}
	} else {
		// Create default item from booking
		// Get service name from service ID
		serviceName := "Cleaning Service" // Default name
		item := models.InvoiceItem{
			Description: fmt.Sprintf("%s - %s", serviceName, booking.Address),
			Quantity:    1,
			UnitPrice:   booking.TotalPrice,
			TotalPrice:  booking.TotalPrice,
			Taxable:     true,
		}
		items = append(items, item)
	}

	// Save to database
	err = s.invoiceRepo.CreateInvoice(invoice, items)
	if err != nil {
		return nil, fmt.Errorf("failed to create invoice: %v", err)
	}

	// Return the created invoice
	return s.invoiceRepo.GetInvoiceByID(invoice.ID)
}

// GetInvoice retrieves an invoice by ID
func (s *InvoiceService) GetInvoice(id int) (*models.InvoiceResponse, error) {
	return s.invoiceRepo.GetInvoiceByID(id)
}

// GetAllInvoices retrieves all invoices with pagination
func (s *InvoiceService) GetAllInvoices(page, limit int) ([]models.InvoiceResponse, int, error) {
	offset := (page - 1) * limit
	return s.invoiceRepo.GetAllInvoices(limit, offset)
}

// GetInvoicesByStatus retrieves invoices by status
func (s *InvoiceService) GetInvoicesByStatus(status string, page, limit int) ([]models.InvoiceResponse, int, error) {
	offset := (page - 1) * limit
	return s.invoiceRepo.GetInvoicesByStatus(status, limit, offset)
}

// UpdateInvoice updates an invoice
func (s *InvoiceService) UpdateInvoice(id int, updates *models.InvoiceUpdateRequest) error {
	return s.invoiceRepo.UpdateInvoice(id, updates)
}

// MarkAsPaid marks an invoice as paid
func (s *InvoiceService) MarkAsPaid(id int, paymentMethod, paymentReference string) error {
	now := time.Now()
	updates := &models.InvoiceUpdateRequest{
		Status:           models.InvoiceStatusPaid,
		PaymentMethod:    paymentMethod,
		PaymentDate:      &now,
		PaymentReference: paymentReference,
	}
	return s.invoiceRepo.UpdateInvoice(id, updates)
}

// DeleteInvoice deletes an invoice
func (s *InvoiceService) DeleteInvoice(id int) error {
	return s.invoiceRepo.DeleteInvoice(id)
}

// GetInvoicesByDateRange retrieves invoices within a date range
func (s *InvoiceService) GetInvoicesByDateRange(startDate, endDate time.Time) ([]models.InvoiceResponse, error) {
	// This would need a new repository method, but for now return all invoices
	invoices, _, err := s.invoiceRepo.GetAllInvoices(1000, 0) // Get up to 1000 invoices
	if err != nil {
		return nil, err
	}

	// Filter by date range
	var filtered []models.InvoiceResponse
	for _, invoice := range invoices {
		if invoice.IssueDate.After(startDate) && invoice.IssueDate.Before(endDate.AddDate(0, 0, 1)) {
			filtered = append(filtered, invoice)
		}
	}

	return filtered, nil
}

// Helper functions

func getCustomerName(booking *models.Booking) string {
	if booking.IsGuestBooking {
		return booking.GuestName
	}
	// For registered users, you'd get from user table
	return "Registered Customer"
}

func getCustomerEmail(booking *models.Booking) string {
	if booking.IsGuestBooking {
		return booking.GuestEmail
	}
	// For registered users, you'd get from user table
	return "customer@email.com"
}

func getCustomerPhone(booking *models.Booking) string {
	if booking.IsGuestBooking {
		return booking.GuestPhone
	}
	// For registered users, you'd get from user table
	return ""
}

func getDefaultCountry(country string) string {
	if country == "" {
		return "United States"
	}
	return country
}

func parseAddress(address string) (city, state, zip string) {
	// Simple address parsing - in production you'd use a proper address parser
	parts := strings.Split(address, ",")
	if len(parts) >= 2 {
		city = strings.TrimSpace(parts[len(parts)-2])
		
		// Try to extract state and zip from last part
		lastPart := strings.TrimSpace(parts[len(parts)-1])
		stateParts := strings.Fields(lastPart)
		if len(stateParts) >= 2 {
			state = stateParts[0]
			zip = stateParts[1]
		} else {
			state = "FL" // Default to Florida
		}
	} else {
		city = "Unknown"
		state = "FL"
	}
	
	return city, state, zip
}

func getDefaultTerms() string {
	return `Payment Terms: Net 30 days
Late Payment: 1.5% per month on past due amounts
Florida Sales Tax included where applicable

Premier Prime Cleaning Services
Licensed & Insured in Florida
Thank you for your business!`
}