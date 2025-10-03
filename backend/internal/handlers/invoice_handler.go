package handlers

import (
	"net/http"
	"strconv"
	"time"

	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/repositories"
	"cleaning-app-backend/internal/services"
	"cleaning-app-backend/internal/database"

	"github.com/gin-gonic/gin"
)

// CreateInvoice creates a new invoice from a booking
func CreateInvoice(c *gin.Context) {
	var request models.InvoiceCreateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	invoice, err := invoiceService.CreateInvoiceFromBooking(request.BookingID, &request)
	if err != nil {
		if err.Error() == "invoice already exists for booking ID" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Invoice created successfully",
		"invoice": invoice,
	})
}

// GetInvoice retrieves an invoice by ID
func GetInvoice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	invoice, err := invoiceService.GetInvoice(id)
	if err != nil {
		if err.Error() == "invoice not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get invoice", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoice": invoice})
}

// GetAllInvoices retrieves all invoices with pagination
func GetAllInvoices(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	var invoices []models.InvoiceResponse
	var total int
	var err error

	if status != "" {
		invoices, total, err = invoiceService.GetInvoicesByStatus(status, page, limit)
	} else {
		invoices, total, err = invoiceService.GetAllInvoices(page, limit)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get invoices", "details": err.Error()})
		return
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

// UpdateInvoice updates an invoice
func UpdateInvoice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var request models.InvoiceUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	err = invoiceService.UpdateInvoice(id, &request)
	if err != nil {
		if err.Error() == "invoice not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice updated successfully"})
}

// MarkAsPaid marks an invoice as paid
func MarkAsPaid(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var request struct {
		PaymentMethod    string `json:"payment_method" validate:"required"`
		PaymentReference string `json:"payment_reference"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	err = invoiceService.MarkAsPaid(id, request.PaymentMethod, request.PaymentReference)
	if err != nil {
		if err.Error() == "invoice not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark invoice as paid", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice marked as paid successfully"})
}

// DeleteInvoice deletes an invoice
func DeleteInvoice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	err = invoiceService.DeleteInvoice(id)
	if err != nil {
		if err.Error() == "invoice not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete invoice", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted successfully"})
}

// GenerateInvoiceFromBooking creates an invoice from a completed booking
func GenerateInvoiceFromBooking(c *gin.Context) {
	bookingIDStr := c.Param("booking_id")
	bookingID, err := strconv.Atoi(bookingIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var request models.InvoiceCreateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	request.BookingID = bookingID

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	invoice, err := invoiceService.CreateInvoiceFromBooking(bookingID, &request)
	if err != nil {
		if err.Error() == "invoice already exists for booking" {
			c.JSON(http.StatusConflict, gin.H{"error": "Invoice already exists for this booking"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate invoice", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Invoice generated successfully",
		"invoice": invoice,
	})
}

// GetInvoicesByDateRange retrieves invoices within a date range
func GetInvoicesByDateRange(c *gin.Context) {
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if startDateStr == "" || endDateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date parameters are required"})
		return
	}

	// Parse dates (you would want better date parsing in production)
	// For now, assuming ISO format YYYY-MM-DD
	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format"})
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format"})
		return
	}

	// Initialize repositories and services
	invoiceRepo := repositories.NewInvoiceRepository(database.DB)
	bookingRepo := &repositories.BookingRepository{}
	invoiceService := services.NewInvoiceService(invoiceRepo, bookingRepo)

	invoices, err := invoiceService.GetInvoicesByDateRange(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get invoices", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}