package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"cleaning-app-backend/internal/database"
	"github.com/gin-gonic/gin"
)

// SimpleGetAllInvoices retrieves all invoices with pagination using direct SQL
func SimpleGetAllInvoices(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// Base query
	baseQuery := `
		SELECT i.id, i.booking_id, i.invoice_number, i.issue_date, i.due_date,
		       i.customer_name, i.customer_email, COALESCE(i.customer_phone, '') as customer_phone,
		       i.billing_address, i.billing_city, i.billing_state, i.billing_zip_code,
		       i.service_address, i.subtotal, i.tax_amount, i.total_amount,
		       i.status, COALESCE(i.payment_method, '') as payment_method, i.payment_date, 
		       COALESCE(i.payment_reference, '') as payment_reference,
		       i.created_at, b.scheduled_date as service_date, s.name as service_name
		FROM invoices i
		JOIN bookings b ON i.booking_id = b.id
		JOIN services s ON b.service_id = s.id
	`

	countQuery := `SELECT COUNT(*) FROM invoices i
		JOIN bookings b ON i.booking_id = b.id
		JOIN services s ON b.service_id = s.id`

	var whereClause string
	var args []interface{}
	argIndex := 1

	if status != "" {
		whereClause = fmt.Sprintf(" WHERE i.status = $%d", argIndex)
		args = append(args, status)
		argIndex++
	}

	// Count total records
	var total int
	if len(args) == 0 {
		err := database.DB.QueryRow(countQuery+whereClause).Scan(&total) 
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count invoices"})
			return
		}
	} else {
		err := database.DB.QueryRow(countQuery+whereClause, args...).Scan(&total)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count invoices"})
			return
		}
	}

	// Get invoices
	finalQuery := baseQuery + whereClause + fmt.Sprintf(" ORDER BY i.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.DB.Query(finalQuery, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices", "details": err.Error()})
		return
	}
	defer rows.Close()

	var invoices []map[string]interface{}
	for rows.Next() {
		var invoice map[string]interface{} = make(map[string]interface{})
		var id, bookingID int
		var invoiceNumber, customerName, customerEmail, customerPhone string
		var billingAddress, billingCity, billingState, billingZipCode, serviceAddress string
		var subtotal, taxAmount, totalAmount float64
		var status, paymentMethod, paymentReference, serviceName string
		var issueDate, dueDate, createdAt, serviceDate time.Time
		var paymentDate *time.Time

		err := rows.Scan(
			&id, &bookingID, &invoiceNumber, &issueDate, &dueDate,
			&customerName, &customerEmail, &customerPhone,
			&billingAddress, &billingCity, &billingState, &billingZipCode,
			&serviceAddress, &subtotal, &taxAmount, &totalAmount,
			&status, &paymentMethod, &paymentDate, &paymentReference,
			&createdAt, &serviceDate, &serviceName,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan invoice", "details": err.Error()})
			return
		}

		invoice["id"] = id
		invoice["booking_id"] = bookingID
		invoice["invoice_number"] = invoiceNumber
		invoice["issue_date"] = issueDate
		invoice["due_date"] = dueDate
		invoice["customer_name"] = customerName
		invoice["customer_email"] = customerEmail
		invoice["customer_phone"] = customerPhone
		invoice["billing_address"] = billingAddress
		invoice["billing_city"] = billingCity
		invoice["billing_state"] = billingState
		invoice["billing_zip_code"] = billingZipCode
		invoice["service_address"] = serviceAddress
		invoice["subtotal"] = subtotal
		invoice["tax_amount"] = taxAmount
		invoice["total_amount"] = totalAmount
		invoice["status"] = status
		invoice["payment_method"] = paymentMethod
		invoice["payment_date"] = paymentDate
		invoice["payment_reference"] = paymentReference
		invoice["created_at"] = createdAt
		invoice["service_date"] = serviceDate
		invoice["service_name"] = serviceName

		invoices = append(invoices, invoice)
	}

	c.JSON(http.StatusOK, gin.H{
		"invoices": invoices,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": (total + limit - 1) / limit,
		},
	})
}

// SimpleGetInvoice retrieves a single invoice by ID using direct SQL
func SimpleGetInvoice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	query := `
		SELECT i.id, i.invoice_number, i.issue_date, i.due_date,
		       i.customer_name, i.customer_email, COALESCE(i.customer_phone, '') as customer_phone,
		       i.billing_address, i.billing_city, i.billing_state, i.billing_zip_code,
		       i.service_address, i.subtotal, i.tax_amount, i.total_amount,
		       i.status, COALESCE(i.payment_method, '') as payment_method, i.payment_date, 
		       COALESCE(i.payment_reference, '') as payment_reference,
		       i.created_at, b.scheduled_date as service_date, s.name as service_name,
		       COALESCE(i.notes, '') as notes, COALESCE(i.terms, '') as terms
		FROM invoices i
		JOIN bookings b ON i.booking_id = b.id
		JOIN services s ON b.service_id = s.id
		WHERE i.id = $1
	`

	var invoice map[string]interface{} = make(map[string]interface{})
	var invoiceNumber, customerName, customerEmail, customerPhone string
	var billingAddress, billingCity, billingState, billingZipCode, serviceAddress string
	var subtotal, taxAmount, totalAmount float64
	var status, paymentMethod, paymentReference, serviceName string
	var issueDate, dueDate, createdAt, serviceDate time.Time
	var paymentDate *time.Time
	var notes, terms string

	err = database.DB.QueryRow(query, id).Scan(
		&id, &invoiceNumber, &issueDate, &dueDate,
		&customerName, &customerEmail, &customerPhone,
		&billingAddress, &billingCity, &billingState, &billingZipCode,
		&serviceAddress, &subtotal, &taxAmount, &totalAmount,
		&status, &paymentMethod, &paymentDate, &paymentReference,
		&createdAt, &serviceDate, &serviceName, &notes, &terms,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoice", "details": err.Error()})
		}
		return
	}

	invoice["id"] = id
	invoice["invoice_number"] = invoiceNumber
	invoice["issue_date"] = issueDate
	invoice["due_date"] = dueDate
	invoice["customer_name"] = customerName
	invoice["customer_email"] = customerEmail
	invoice["customer_phone"] = customerPhone
	invoice["billing_address"] = billingAddress
	invoice["billing_city"] = billingCity
	invoice["billing_state"] = billingState
	invoice["billing_zip_code"] = billingZipCode
	invoice["service_address"] = serviceAddress
	invoice["subtotal"] = subtotal
	invoice["tax_amount"] = taxAmount
	invoice["total_amount"] = totalAmount
	invoice["status"] = status
	invoice["payment_method"] = paymentMethod
	invoice["payment_date"] = paymentDate
	invoice["payment_reference"] = paymentReference
	invoice["created_at"] = createdAt
	invoice["service_date"] = serviceDate
	invoice["service_name"] = serviceName
	invoice["notes"] = notes
	invoice["terms"] = terms

	c.JSON(http.StatusOK, gin.H{"invoice": invoice})
}

// SimpleGenerateInvoiceFromBooking creates an invoice from a booking using direct SQL
func SimpleGenerateInvoiceFromBooking(c *gin.Context) {
	bookingIDStr := c.Param("booking_id")
	bookingID, err := strconv.Atoi(bookingIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	// Check if invoice already exists
	var existingID int
	err = database.DB.QueryRow("SELECT id FROM invoices WHERE booking_id = $1", bookingID).Scan(&existingID)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Invoice already exists for this booking"})
		return
	}

	// Get booking details
	bookingQuery := `
		SELECT b.id, b.total_price, b.address, 
		       COALESCE(u.first_name || ' ' || u.last_name, b.guest_name) as customer_name,
		       COALESCE(u.email, b.guest_email) as customer_email,
		       COALESCE(u.phone, b.guest_phone) as customer_phone,
		       COALESCE(b.billing_address, b.address) as billing_address,
		       COALESCE(b.billing_city, 'Miami') as billing_city,
		       COALESCE(b.billing_state, 'FL') as billing_state,
		       COALESCE(b.billing_zip_code, '33101') as billing_zip_code
		FROM bookings b
		LEFT JOIN users u ON b.user_id = u.id
		WHERE b.id = $1
	`

	var booking struct {
		ID             int
		TotalPrice     float64
		Address        string
		CustomerName   string
		CustomerEmail  string
		CustomerPhone  string
		BillingAddress string
		BillingCity    string
		BillingState   string
		BillingZipCode string
	}

	err = database.DB.QueryRow(bookingQuery, bookingID).Scan(
		&booking.ID, &booking.TotalPrice, &booking.Address,
		&booking.CustomerName, &booking.CustomerEmail, &booking.CustomerPhone,
		&booking.BillingAddress, &booking.BillingCity, &booking.BillingState, &booking.BillingZipCode,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Generate invoice number
	var maxNum int
	database.DB.QueryRow("SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'PP-INV-[0-9]{4}-[0-9]{2}-([0-9]+)') AS INTEGER)), 0) FROM invoices WHERE invoice_number LIKE 'PP-INV-2025-%'").Scan(&maxNum)
	invoiceNumber := fmt.Sprintf("PP-INV-2025-11-%03d", maxNum+1)

	// Calculate tax (7% Florida sales tax)
	subtotal := booking.TotalPrice
	taxRate := 0.07
	taxAmount := subtotal * taxRate
	totalAmount := subtotal + taxAmount

	// Create invoice
	insertQuery := `
		INSERT INTO invoices (
			booking_id, invoice_number, issue_date, due_date,
			customer_name, customer_email, customer_phone,
			billing_address, billing_city, billing_state, billing_zip_code, billing_country,
			service_address, service_city, service_state, service_zip_code,
			subtotal, tax_rate, tax_amount, total_amount,
			status, florida_tax_id, tax_exempt, terms
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
			$17, $18, $19, $20, $21, $22, $23, $24
		) RETURNING id
	`

	now := time.Now()
	dueDate := now.AddDate(0, 0, 30) // 30 days from now

	var invoiceID int
	err = database.DB.QueryRow(insertQuery,
		bookingID, invoiceNumber, now, dueDate,
		booking.CustomerName, booking.CustomerEmail, booking.CustomerPhone,
		booking.BillingAddress, booking.BillingCity, booking.BillingState, booking.BillingZipCode, "United States",
		booking.Address, "Miami", "FL", "33101",
		subtotal, taxRate, taxAmount, totalAmount,
		"pending", "FL-59-123456789", false, "Payment due within 30 days of invoice date. Late payments subject to 1.5% monthly service charge.",
	).Scan(&invoiceID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Invoice created successfully",
		"invoice_id": invoiceID,
		"invoice_number": invoiceNumber,
	})
}

// SimpleMarkAsPaid marks an invoice as paid using direct SQL
func SimpleMarkAsPaid(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var request struct {
		PaymentMethod    string `json:"payment_method"`
		PaymentReference string `json:"payment_reference"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	query := `
		UPDATE invoices 
		SET status = 'paid', payment_method = $1, payment_reference = $2, payment_date = $3, updated_at = $4
		WHERE id = $5
	`

	result, err := database.DB.Exec(query, request.PaymentMethod, request.PaymentReference, time.Now(), time.Now(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice marked as paid successfully"})
}

// SimpleDeleteInvoice deletes an invoice using direct SQL
func SimpleDeleteInvoice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM invoices WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete invoice"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted successfully"})
}

// SimpleGetInvoicesByDateRange gets invoices by date range using direct SQL
func SimpleGetInvoicesByDateRange(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	if startDate == "" || endDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date are required"})
		return
	}

	query := `
		SELECT i.id, i.invoice_number, i.issue_date, i.due_date,
		       i.customer_name, i.customer_email, i.subtotal, i.tax_amount, i.total_amount,
		       i.status, i.payment_method, i.payment_date,
		       b.scheduled_date as service_date, s.name as service_name
		FROM invoices i
		JOIN bookings b ON i.booking_id = b.id
		JOIN services s ON b.service_id = s.id
		WHERE b.scheduled_date >= $1 AND b.scheduled_date <= $2
		ORDER BY b.scheduled_date DESC
	`

	rows, err := database.DB.Query(query, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
		return
	}
	defer rows.Close()

	var invoices []map[string]interface{}
	for rows.Next() {
		var invoice map[string]interface{} = make(map[string]interface{})
		var id int
		var invoiceNumber, customerName, customerEmail, status, paymentMethod, serviceName string
		var subtotal, taxAmount, totalAmount float64
		var issueDate, dueDate, serviceDate time.Time
		var paymentDate *time.Time

		err := rows.Scan(
			&id, &invoiceNumber, &issueDate, &dueDate,
			&customerName, &customerEmail, &subtotal, &taxAmount, &totalAmount,
			&status, &paymentMethod, &paymentDate, &serviceDate, &serviceName,
		)
		if err != nil {
			continue
		}

		invoice["id"] = id
		invoice["invoice_number"] = invoiceNumber
		invoice["issue_date"] = issueDate
		invoice["due_date"] = dueDate
		invoice["customer_name"] = customerName
		invoice["customer_email"] = customerEmail
		invoice["subtotal"] = subtotal
		invoice["tax_amount"] = taxAmount
		invoice["total_amount"] = totalAmount
		invoice["status"] = status
		invoice["payment_method"] = paymentMethod
		invoice["payment_date"] = paymentDate
		invoice["service_date"] = serviceDate
		invoice["service_name"] = serviceName

		invoices = append(invoices, invoice)
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}