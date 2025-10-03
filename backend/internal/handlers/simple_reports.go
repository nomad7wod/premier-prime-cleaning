package handlers

import (
	"net/http"
	"time"
	"cleaning-app-backend/internal/database"
	"github.com/gin-gonic/gin"
)

// SimpleGetReportsData - Simple reports handler that works
func SimpleGetReportsData(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	client := c.Query("client")

	if startDate == "" || endDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date are required"})
		return
	}

	// Get bookings in date range
	bookingQuery := `
		SELECT b.id, s.name as service_name, b.scheduled_date, b.scheduled_time, b.status, 
		       b.total_price, b.square_meters, b.address, b.special_instructions,
		       COALESCE(u.first_name || ' ' || u.last_name, b.guest_name, 'Guest') as customer_name,
		       b.created_at
		FROM bookings b
		LEFT JOIN services s ON b.service_id = s.id
		LEFT JOIN users u ON b.user_id = u.id
		WHERE b.scheduled_date >= $1 AND b.scheduled_date <= $2
	`

	var bookingArgs []interface{}
	bookingArgs = append(bookingArgs, startDate, endDate)

	if client != "" {
		bookingQuery += " AND (u.first_name || ' ' || u.last_name ILIKE $3 OR b.guest_name ILIKE $3)"
		bookingArgs = append(bookingArgs, "%"+client+"%")
	}
	bookingQuery += " ORDER BY b.scheduled_date DESC"

	bookingRows, err := database.DB.Query(bookingQuery, bookingArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings", "details": err.Error()})
		return
	}
	defer bookingRows.Close()

	var bookings []map[string]interface{}
	var totalRevenue float64

	for bookingRows.Next() {
		var booking = make(map[string]interface{})
		var id int
		var serviceName, status, address, specialInstructions, customerName string
		var totalPrice float64
		var squareMeters int
		var scheduledDate, scheduledTime, createdAt time.Time

		err := bookingRows.Scan(&id, &serviceName, &scheduledDate, &scheduledTime, &status, 
			&totalPrice, &squareMeters, &address, &specialInstructions, &customerName, &createdAt)
		if err != nil {
			continue // Skip problematic rows
		}

		booking["id"] = id
		booking["service_name"] = serviceName
		booking["scheduled_date"] = scheduledDate
		booking["scheduled_time"] = scheduledTime
		booking["status"] = status
		booking["total_price"] = totalPrice
		booking["square_meters"] = squareMeters
		booking["address"] = address
		booking["special_instructions"] = specialInstructions
		booking["customer_name"] = customerName
		booking["created_at"] = createdAt

		bookings = append(bookings, booking)
		if status == "completed" {
			totalRevenue += totalPrice
		}
	}

	// Get invoices in date range
	invoiceQuery := `
		SELECT i.id, i.invoice_number, s.name as service_name, b.scheduled_date as service_date,
		       i.subtotal, i.tax_amount, i.total_amount, i.status,
		       i.created_at, i.payment_date, COALESCE(i.payment_method, '') as payment_method,
		       i.customer_name
		FROM invoices i
		JOIN bookings b ON i.booking_id = b.id
		JOIN services s ON b.service_id = s.id
		WHERE b.scheduled_date >= $1 AND b.scheduled_date <= $2
	`

	var invoiceArgs []interface{}
	invoiceArgs = append(invoiceArgs, startDate, endDate)

	if client != "" {
		invoiceQuery += " AND i.customer_name ILIKE $3"
		invoiceArgs = append(invoiceArgs, "%"+client+"%")
	}
	invoiceQuery += " ORDER BY b.scheduled_date DESC"

	invoiceRows, err := database.DB.Query(invoiceQuery, invoiceArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices", "details": err.Error()})
		return
	}
	defer invoiceRows.Close()

	var invoices []map[string]interface{}
	var totalInvoiced, totalPaid, totalPending, totalOverdue float64

	for invoiceRows.Next() {
		var invoice = make(map[string]interface{})
		var id int
		var invoiceNumber, serviceName, status, paymentMethod, customerName string
		var subtotal, taxAmount, totalAmount float64
		var createdAt, serviceDate time.Time
		var paymentDate *time.Time

		err := invoiceRows.Scan(&id, &invoiceNumber, &serviceName, &serviceDate,
			&subtotal, &taxAmount, &totalAmount, &status, &createdAt, &paymentDate, &paymentMethod, &customerName)
		if err != nil {
			continue // Skip problematic rows
		}

		invoice["id"] = id
		invoice["invoice_number"] = invoiceNumber
		invoice["service_name"] = serviceName
		invoice["service_date"] = serviceDate
		invoice["subtotal"] = subtotal
		invoice["tax_amount"] = taxAmount
		invoice["total_amount"] = totalAmount
		invoice["status"] = status
		invoice["created_at"] = createdAt
		invoice["payment_date"] = paymentDate
		invoice["payment_method"] = paymentMethod
		invoice["customer_name"] = customerName

		invoices = append(invoices, invoice)
		totalInvoiced += totalAmount

		switch status {
		case "paid":
			totalPaid += totalAmount
		case "pending":
			totalPending += totalAmount
		case "overdue":
			totalOverdue += totalAmount
		}
	}

	// Calculate analytics
	analytics := map[string]interface{}{
		"total_bookings":    len(bookings),
		"total_invoices":    len(invoices),
		"total_revenue":     totalRevenue,
		"total_invoiced":    totalInvoiced,
		"total_paid":        totalPaid,
		"total_pending":     totalPending,
		"total_overdue":     totalOverdue,
		"collection_rate":   0.0,
	}

	if totalInvoiced > 0 {
		analytics["collection_rate"] = (totalPaid / totalInvoiced) * 100
	}

	response := map[string]interface{}{
		"bookings":  bookings,
		"invoices":  invoices,
		"analytics": analytics,
		"filters": map[string]interface{}{
			"start_date": startDate,
			"end_date":   endDate,
			"client":     client,
		},
	}

	c.JSON(http.StatusOK, response)
}