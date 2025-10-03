package handlers

import (
	"cleaning-app-backend/internal/database"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetReportsData returns comprehensive data for reports with date filtering
func GetReportsData(c *gin.Context) {
	// Get query parameters
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	client := c.Query("client")

	// Set default date range if not provided (last 30 days)
	if startDate == "" {
		startDate = time.Now().AddDate(0, 0, -30).Format("2006-01-02")
	}
	if endDate == "" {
		endDate = time.Now().Format("2006-01-02")
	}

	// Parse dates
	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
		return
	}

	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
		return
	}

	// Add 24 hours to end date to include the entire day
	end = end.Add(24 * time.Hour)

	// Build base queries with correct column names
	bookingQuery := `
		SELECT b.id, s.name as service_name, b.scheduled_date, b.scheduled_time, b.status, 
		       b.total_price, b.square_meters, b.address, b.special_instructions,
		       COALESCE(u.first_name || ' ' || u.last_name, b.guest_name, 'Guest') as customer_name,
		       b.created_at
		FROM bookings b
		LEFT JOIN services s ON b.service_id = s.id
		LEFT JOIN users u ON b.user_id = u.id
		WHERE b.scheduled_date >= ? AND b.scheduled_date <= ?
	`
	
	invoiceQuery := `
		SELECT i.id, i.invoice_number, s.name as service_name, b.scheduled_date as service_date, b.scheduled_time as service_time,
		       i.subtotal, i.tax_amount, i.total_amount, i.status, i.billing_address,
		       i.created_at, i.payment_date, i.payment_method
		FROM invoices i
		JOIN bookings b ON i.booking_id = b.id
		JOIN services s ON b.service_id = s.id
		WHERE b.scheduled_date >= ? AND b.scheduled_date <= ?
	`

	// Add client filter if specified
	if client != "" {
		bookingQuery += " AND (u.first_name || ' ' || u.last_name = ? OR b.guest_name = ?)"
		invoiceQuery += " AND i.customer_name LIKE ?"
	}

	bookingQuery += " ORDER BY b.scheduled_date DESC"
	invoiceQuery += " ORDER BY b.scheduled_date DESC"

	// Execute queries
	var bookings []map[string]interface{}
	var invoices []map[string]interface{}

	// Query bookings
	if client != "" {
		rows, err := database.DB.Query(bookingQuery, start, end, client, client)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
			return
		}
		defer rows.Close()

		columns, _ := rows.Columns()
		for rows.Next() {
			values := make([]interface{}, len(columns))
			valuePtrs := make([]interface{}, len(columns))
			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			rows.Scan(valuePtrs...)

			booking := make(map[string]interface{})
			for i, col := range columns {
				val := values[i]
				if b, ok := val.([]byte); ok {
					booking[col] = string(b)
				} else {
					booking[col] = val
				}
			}
			bookings = append(bookings, booking)
		}
	} else {
		rows, err := database.DB.Query(bookingQuery, start, end)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
			return
		}
		defer rows.Close()

		columns, _ := rows.Columns()
		for rows.Next() {
			values := make([]interface{}, len(columns))
			valuePtrs := make([]interface{}, len(columns))
			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			rows.Scan(valuePtrs...)

			booking := make(map[string]interface{})
			for i, col := range columns {
				val := values[i]
				if b, ok := val.([]byte); ok {
					booking[col] = string(b)
				} else {
					booking[col] = val
				}
			}
			bookings = append(bookings, booking)
		}
	}

	// Query invoices
	if client != "" {
		clientPattern := "%" + client + "%"
		rows, err := database.DB.Query(invoiceQuery, start, end, clientPattern)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
			return
		}
		defer rows.Close()

		columns, _ := rows.Columns()
		for rows.Next() {
			values := make([]interface{}, len(columns))
			valuePtrs := make([]interface{}, len(columns))
			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			rows.Scan(valuePtrs...)

			invoice := make(map[string]interface{})
			for i, col := range columns {
				val := values[i]
				if b, ok := val.([]byte); ok {
					invoice[col] = string(b)
				} else {
					invoice[col] = val
				}
			}
			invoices = append(invoices, invoice)
		}
	} else {
		rows, err := database.DB.Query(invoiceQuery, start, end)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
			return
		}
		defer rows.Close()

		columns, _ := rows.Columns()
		for rows.Next() {
			values := make([]interface{}, len(columns))
			valuePtrs := make([]interface{}, len(columns))
			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			rows.Scan(valuePtrs...)

			invoice := make(map[string]interface{})
			for i, col := range columns {
				val := values[i]
				if b, ok := val.([]byte); ok {
					invoice[col] = string(b)
				} else {
					invoice[col] = val
				}
			}
			invoices = append(invoices, invoice)
		}
	}

	// Calculate analytics
	totalRevenue := 0.0
	pendingRevenue := 0.0
	totalTax := 0.0
	serviceStats := make(map[string]map[string]interface{})
	clientStats := make(map[string]map[string]interface{})

	// Process invoices for revenue analytics
	for _, invoice := range invoices {
		if total, ok := invoice["total_amount"].(float64); ok {
			if status, ok := invoice["status"].(string); ok && status == "paid" {
				totalRevenue += total
				if tax, ok := invoice["tax_amount"].(float64); ok {
					totalTax += tax
				}
			} else if status == "pending" {
				pendingRevenue += total
			}
		}
	}

	// Process bookings for service and client analytics
	for _, booking := range bookings {
		serviceName := ""
		if sn, ok := booking["service_name"].(string); ok {
			serviceName = sn
		}

		customerName := ""
		if cn, ok := booking["customer_name"].(string); ok {
			customerName = cn
		}

		totalPrice := 0.0
		if tp, ok := booking["total_price"].(float64); ok {
			totalPrice = tp
		}

		// Service stats
		if serviceName != "" {
			if _, exists := serviceStats[serviceName]; !exists {
				serviceStats[serviceName] = map[string]interface{}{
					"count":   0,
					"revenue": 0.0,
				}
			}
			serviceStats[serviceName]["count"] = serviceStats[serviceName]["count"].(int) + 1
			serviceStats[serviceName]["revenue"] = serviceStats[serviceName]["revenue"].(float64) + totalPrice
		}

		// Client stats
		if customerName != "" {
			if _, exists := clientStats[customerName]; !exists {
				clientStats[customerName] = map[string]interface{}{
					"bookings":    0,
					"revenue":     0.0,
					"lastService": nil,
				}
			}
			clientStats[customerName]["bookings"] = clientStats[customerName]["bookings"].(int) + 1
			clientStats[customerName]["revenue"] = clientStats[customerName]["revenue"].(float64) + totalPrice
			
			if scheduledDate, ok := booking["scheduled_date"].(time.Time); ok {
				if clientStats[customerName]["lastService"] == nil {
					clientStats[customerName]["lastService"] = scheduledDate
				} else if lastService, ok := clientStats[customerName]["lastService"].(time.Time); ok {
					if scheduledDate.After(lastService) {
						clientStats[customerName]["lastService"] = scheduledDate
					}
				}
			}
		}
	}

	response := gin.H{
		"bookings": bookings,
		"invoices": invoices,
		"analytics": gin.H{
			"totalRevenue":   totalRevenue,
			"pendingRevenue": pendingRevenue,
			"totalTax":       totalTax,
			"averageInvoice": func() float64 {
				count := 0
				for _, invoice := range invoices {
					if status, ok := invoice["status"].(string); ok && status == "paid" {
						count++
					}
				}
				if count > 0 {
					return totalRevenue / float64(count)
				}
				return 0.0
			}(),
			"serviceStats": serviceStats,
			"clientStats":  clientStats,
		},
		"filters": gin.H{
			"startDate": startDate,
			"endDate":   endDate[:10], // Remove the added 24 hours for display
			"client":    client,
		},
	}

	c.JSON(http.StatusOK, response)
}