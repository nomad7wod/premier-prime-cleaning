package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"cleaning-app-backend/internal/models"
)

type InvoiceRepository struct {
	db *sql.DB
}

func NewInvoiceRepository(db *sql.DB) *InvoiceRepository {
	return &InvoiceRepository{db: db}
}

// CreateInvoice creates a new invoice with line items
func (r *InvoiceRepository) CreateInvoice(invoice *models.Invoice, items []models.InvoiceItem) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	// Insert main invoice record
	query := `
		INSERT INTO invoices (
			booking_id, invoice_number, issue_date, due_date,
			customer_name, customer_email, customer_phone,
			billing_address, billing_city, billing_state, billing_zip_code, billing_country,
			service_address, service_city, service_state, service_zip_code,
			subtotal, tax_rate, tax_amount, total_amount,
			status, payment_method, florida_tax_id, tax_exempt, tax_exempt_reason,
			notes, terms, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
			$17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
		) RETURNING id`

	err = tx.QueryRow(query,
		invoice.BookingID, invoice.InvoiceNumber, invoice.IssueDate, invoice.DueDate,
		invoice.CustomerName, invoice.CustomerEmail, invoice.CustomerPhone,
		invoice.BillingAddress, invoice.BillingCity, invoice.BillingState, invoice.BillingZipCode, invoice.BillingCountry,
		invoice.ServiceAddress, invoice.ServiceCity, invoice.ServiceState, invoice.ServiceZipCode,
		invoice.Subtotal, invoice.TaxRate, invoice.TaxAmount, invoice.TotalAmount,
		invoice.Status, invoice.PaymentMethod, invoice.FloridaTaxID, invoice.TaxExempt, invoice.TaxExemptReason,
		invoice.Notes, invoice.Terms, invoice.CreatedAt, invoice.UpdatedAt,
	).Scan(&invoice.ID)

	if err != nil {
		return fmt.Errorf("failed to create invoice: %v", err)
	}

	// Insert invoice items
	for i := range items {
		items[i].InvoiceID = invoice.ID
		itemQuery := `
			INSERT INTO invoice_items (
				invoice_id, description, quantity, unit_price, total_price, taxable
			) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

		err = tx.QueryRow(itemQuery,
			items[i].InvoiceID, items[i].Description, items[i].Quantity,
			items[i].UnitPrice, items[i].TotalPrice, items[i].Taxable,
		).Scan(&items[i].ID)

		if err != nil {
			return fmt.Errorf("failed to create invoice item: %v", err)
		}
	}

	return nil
}

// GetInvoiceByID retrieves an invoice with its items
func (r *InvoiceRepository) GetInvoiceByID(id int) (*models.InvoiceResponse, error) {
	var invoice models.Invoice
	var paymentDate sql.NullTime
	var paymentReference sql.NullString
	
	query := `SELECT 
		id, booking_id, invoice_number, issue_date, due_date,
		customer_name, customer_email, customer_phone,
		billing_address, billing_city, billing_state, billing_zip_code, billing_country,
		service_address, service_city, service_state, service_zip_code,
		subtotal, tax_rate, tax_amount, total_amount,
		status, payment_method, payment_date, payment_reference,
		florida_tax_id, tax_exempt, tax_exempt_reason,
		notes, terms, created_at, updated_at
		FROM invoices WHERE id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&invoice.ID, &invoice.BookingID, &invoice.InvoiceNumber, &invoice.IssueDate, &invoice.DueDate,
		&invoice.CustomerName, &invoice.CustomerEmail, &invoice.CustomerPhone,
		&invoice.BillingAddress, &invoice.BillingCity, &invoice.BillingState, &invoice.BillingZipCode, &invoice.BillingCountry,
		&invoice.ServiceAddress, &invoice.ServiceCity, &invoice.ServiceState, &invoice.ServiceZipCode,
		&invoice.Subtotal, &invoice.TaxRate, &invoice.TaxAmount, &invoice.TotalAmount,
		&invoice.Status, &invoice.PaymentMethod, &paymentDate, &paymentReference,
		&invoice.FloridaTaxID, &invoice.TaxExempt, &invoice.TaxExemptReason,
		&invoice.Notes, &invoice.Terms, &invoice.CreatedAt, &invoice.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("invoice not found")
		}
		return nil, fmt.Errorf("failed to get invoice: %v", err)
	}

	// Handle nullable fields
	if paymentDate.Valid {
		invoice.PaymentDate = &paymentDate.Time
	}
	if paymentReference.Valid {
		invoice.PaymentReference = paymentReference.String
	}

	// Get invoice items
	items := []models.InvoiceItem{}
	itemQuery := `SELECT id, invoice_id, description, quantity, unit_price, total_price, taxable FROM invoice_items WHERE invoice_id = $1 ORDER BY id`
	rows, err := r.db.Query(itemQuery, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get invoice items: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var item models.InvoiceItem
		err = rows.Scan(&item.ID, &item.InvoiceID, &item.Description, &item.Quantity, &item.UnitPrice, &item.TotalPrice, &item.Taxable)
		if err != nil {
			return nil, fmt.Errorf("failed to scan invoice item: %v", err)
		}
		items = append(items, item)
	}

	// Get service name and booking date
	var serviceName string
	var bookingDate time.Time
	var scheduledTime string
	serviceQuery := `
		SELECT s.name, b.scheduled_date, b.scheduled_time
		FROM bookings b 
		JOIN services s ON b.service_id = s.id 
		WHERE b.id = $1`
	err = r.db.QueryRow(serviceQuery, invoice.BookingID).Scan(&serviceName, &bookingDate, &scheduledTime)
	if err != nil {
		serviceName = "Unknown Service"
		bookingDate = time.Now()
	}

	response := &models.InvoiceResponse{
		Invoice:     invoice,
		Items:       items,
		ServiceName: serviceName,
		BookingDate: bookingDate,
	}

	return response, nil
}

// GetInvoiceByBookingID retrieves an invoice by booking ID
func (r *InvoiceRepository) GetInvoiceByBookingID(bookingID int) (*models.InvoiceResponse, error) {
	var invoice models.Invoice
	query := `SELECT * FROM invoices WHERE booking_id = $1`

	err := r.db.QueryRow(query, bookingID).Scan(
		&invoice.ID, &invoice.BookingID, &invoice.InvoiceNumber, &invoice.IssueDate, &invoice.DueDate,
		&invoice.CustomerName, &invoice.CustomerEmail, &invoice.CustomerPhone,
		&invoice.BillingAddress, &invoice.BillingCity, &invoice.BillingState, &invoice.BillingZipCode, &invoice.BillingCountry,
		&invoice.ServiceAddress, &invoice.ServiceCity, &invoice.ServiceState, &invoice.ServiceZipCode,
		&invoice.Subtotal, &invoice.TaxRate, &invoice.TaxAmount, &invoice.TotalAmount,
		&invoice.Status, &invoice.PaymentMethod, &invoice.PaymentDate, &invoice.PaymentReference,
		&invoice.FloridaTaxID, &invoice.TaxExempt, &invoice.TaxExemptReason,
		&invoice.Notes, &invoice.Terms, &invoice.CreatedAt, &invoice.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("invoice not found for booking")
		}
		return nil, fmt.Errorf("failed to get invoice: %v", err)
	}

	return r.GetInvoiceByID(invoice.ID)
}

// GetAllInvoices retrieves all invoices with pagination
func (r *InvoiceRepository) GetAllInvoices(limit, offset int) ([]models.InvoiceResponse, int, error) {
	// Get total count
	var totalCount int
	countQuery := `SELECT COUNT(*) FROM invoices`
	err := r.db.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get invoice count: %v", err)
	}

	// Get invoices
	query := `SELECT 
		id, booking_id, invoice_number, issue_date, due_date,
		customer_name, customer_email, customer_phone,
		billing_address, billing_city, billing_state, billing_zip_code, billing_country,
		service_address, service_city, service_state, service_zip_code,
		subtotal, tax_rate, tax_amount, total_amount,
		status, payment_method, payment_date, payment_reference,
		florida_tax_id, tax_exempt, tax_exempt_reason,
		notes, terms, created_at, updated_at
		FROM invoices ORDER BY created_at DESC LIMIT $1 OFFSET $2`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get invoices: %v", err)
	}
	defer rows.Close()

	var invoices []models.Invoice
	for rows.Next() {
		var invoice models.Invoice
		var paymentDate sql.NullTime
		var paymentReference sql.NullString
		
		err = rows.Scan(
			&invoice.ID, &invoice.BookingID, &invoice.InvoiceNumber, &invoice.IssueDate, &invoice.DueDate,
			&invoice.CustomerName, &invoice.CustomerEmail, &invoice.CustomerPhone,
			&invoice.BillingAddress, &invoice.BillingCity, &invoice.BillingState, &invoice.BillingZipCode, &invoice.BillingCountry,
			&invoice.ServiceAddress, &invoice.ServiceCity, &invoice.ServiceState, &invoice.ServiceZipCode,
			&invoice.Subtotal, &invoice.TaxRate, &invoice.TaxAmount, &invoice.TotalAmount,
			&invoice.Status, &invoice.PaymentMethod, &paymentDate, &paymentReference,
			&invoice.FloridaTaxID, &invoice.TaxExempt, &invoice.TaxExemptReason,
			&invoice.Notes, &invoice.Terms, &invoice.CreatedAt, &invoice.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan invoice: %v", err)
		}

		// Handle nullable fields
		if paymentDate.Valid {
			invoice.PaymentDate = &paymentDate.Time
		}
		if paymentReference.Valid {
			invoice.PaymentReference = paymentReference.String
		}

		invoices = append(invoices, invoice)
	}

	// Build response with items for each invoice
	var responses []models.InvoiceResponse
	for _, invoice := range invoices {
		items := []models.InvoiceItem{}
		itemQuery := `SELECT id, invoice_id, description, quantity, unit_price, total_price, taxable FROM invoice_items WHERE invoice_id = $1 ORDER BY id`
		itemRows, err := r.db.Query(itemQuery, invoice.ID)
		if err != nil {
			continue // Skip this invoice if items can't be loaded
		}

		for itemRows.Next() {
			var item models.InvoiceItem
			err = itemRows.Scan(&item.ID, &item.InvoiceID, &item.Description, &item.Quantity, &item.UnitPrice, &item.TotalPrice, &item.Taxable)
			if err != nil {
				continue
			}
			items = append(items, item)
		}
		itemRows.Close()

		// Get service name and booking date
		var serviceName string
		var bookingDate time.Time
		var scheduledTime string
		serviceQuery := `
			SELECT s.name, b.scheduled_date, b.scheduled_time
			FROM bookings b 
			JOIN services s ON b.service_id = s.id 
			WHERE b.id = $1`
		err = r.db.QueryRow(serviceQuery, invoice.BookingID).Scan(&serviceName, &bookingDate, &scheduledTime)
		if err != nil {
			serviceName = "Unknown Service"
			bookingDate = time.Now()
		}

		response := models.InvoiceResponse{
			Invoice:     invoice,
			Items:       items,
			ServiceName: serviceName,
			BookingDate: bookingDate,
		}
		responses = append(responses, response)
	}

	return responses, totalCount, nil
}

// UpdateInvoice updates an invoice
func (r *InvoiceRepository) UpdateInvoice(id int, updates *models.InvoiceUpdateRequest) error {
	query := `
		UPDATE invoices SET 
			status = COALESCE(NULLIF($2, ''), status),
			payment_method = COALESCE(NULLIF($3, ''), payment_method),
			payment_date = COALESCE($4, payment_date),
			payment_reference = COALESCE(NULLIF($5, ''), payment_reference),
			notes = COALESCE(NULLIF($6, ''), notes),
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1`

	result, err := r.db.Exec(query, id, updates.Status, updates.PaymentMethod, 
		updates.PaymentDate, updates.PaymentReference, updates.Notes)
	if err != nil {
		return fmt.Errorf("failed to update invoice: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("invoice not found")
	}

	return nil
}

// GetInvoicesByStatus retrieves invoices by status
func (r *InvoiceRepository) GetInvoicesByStatus(status string, limit, offset int) ([]models.InvoiceResponse, int, error) {
	// Get total count for this status
	var totalCount int
	countQuery := `SELECT COUNT(*) FROM invoices WHERE status = $1`
	err := r.db.QueryRow(countQuery, status).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get invoice count: %v", err)
	}

	// Get invoices
	var invoices []models.Invoice
	query := `SELECT 
		id, booking_id, invoice_number, issue_date, due_date,
		customer_name, customer_email, customer_phone,
		billing_address, billing_city, billing_state, billing_zip_code, billing_country,
		service_address, service_city, service_state, service_zip_code,
		subtotal, tax_rate, tax_amount, total_amount,
		status, payment_method, payment_date, payment_reference,
		florida_tax_id, tax_exempt, tax_exempt_reason,
		notes, terms, created_at, updated_at
		FROM invoices WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`
	rows, err := r.db.Query(query, status, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get invoices by status: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var invoice models.Invoice
		var paymentDate sql.NullTime
		var paymentReference sql.NullString

		err = rows.Scan(
			&invoice.ID, &invoice.BookingID, &invoice.InvoiceNumber, &invoice.IssueDate, &invoice.DueDate,
			&invoice.CustomerName, &invoice.CustomerEmail, &invoice.CustomerPhone,
			&invoice.BillingAddress, &invoice.BillingCity, &invoice.BillingState, &invoice.BillingZipCode, &invoice.BillingCountry,
			&invoice.ServiceAddress, &invoice.ServiceCity, &invoice.ServiceState, &invoice.ServiceZipCode,
			&invoice.Subtotal, &invoice.TaxRate, &invoice.TaxAmount, &invoice.TotalAmount,
			&invoice.Status, &invoice.PaymentMethod, &paymentDate, &paymentReference,
			&invoice.FloridaTaxID, &invoice.TaxExempt, &invoice.TaxExemptReason,
			&invoice.Notes, &invoice.Terms, &invoice.CreatedAt, &invoice.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan invoice: %v", err)
		}

		// Handle nullable fields
		if paymentDate.Valid {
			invoice.PaymentDate = &paymentDate.Time
		}
		if paymentReference.Valid {
			invoice.PaymentReference = paymentReference.String
		}
		invoices = append(invoices, invoice)
	}

		// Build response with items for each invoice (same as GetAllInvoices)
		var responses []models.InvoiceResponse
		for _, invoice := range invoices {
			items := []models.InvoiceItem{}
			itemQuery := `SELECT id, invoice_id, description, quantity, unit_price, total_price, taxable FROM invoice_items WHERE invoice_id = $1 ORDER BY id`
			itemRows, err := r.db.Query(itemQuery, invoice.ID)
			if err != nil {
				continue
			}

			for itemRows.Next() {
				var item models.InvoiceItem
				err = itemRows.Scan(&item.ID, &item.InvoiceID, &item.Description, &item.Quantity, &item.UnitPrice, &item.TotalPrice, &item.Taxable)
				if err != nil {
					continue
				}
				items = append(items, item)
			}
			itemRows.Close()

		// Get service name and booking date
		var serviceName string
		var bookingDate time.Time
		var scheduledTime string
		serviceQuery := `
			SELECT s.name, b.scheduled_date, b.scheduled_time
			FROM bookings b 
			JOIN services s ON b.service_id = s.id 
			WHERE b.id = $1`
		err = r.db.QueryRow(serviceQuery, invoice.BookingID).Scan(&serviceName, &bookingDate, &scheduledTime)
		if err != nil {
			serviceName = "Unknown Service"
			bookingDate = time.Now()
		}

		response := models.InvoiceResponse{
			Invoice:     invoice,
			Items:       items,
			ServiceName: serviceName,
			BookingDate: bookingDate,
		}
		responses = append(responses, response)
	}

	return responses, totalCount, nil
}

// DeleteInvoice deletes an invoice and its items
func (r *InvoiceRepository) DeleteInvoice(id int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	// Delete invoice items first
	_, err = tx.Exec("DELETE FROM invoice_items WHERE invoice_id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete invoice items: %v", err)
	}

	// Delete invoice
	result, err := tx.Exec("DELETE FROM invoices WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete invoice: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("invoice not found")
	}

	return nil
}

// GenerateInvoiceNumber generates a unique invoice number
func (r *InvoiceRepository) GenerateInvoiceNumber() (string, error) {
	var count int
	query := `SELECT COUNT(*) FROM invoices WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`
	err := r.db.QueryRow(query).Scan(&count)
	if err != nil {
		return "", fmt.Errorf("failed to get invoice count: %v", err)
	}

	year := time.Now().Year()
	invoiceNumber := fmt.Sprintf("PP-%d-%05d", year, count+1)
	return invoiceNumber, nil
}