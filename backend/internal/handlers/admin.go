package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/services"
)

func GetAllBookings(c *gin.Context) {
	bookingService := services.NewBookingService()
	bookings, err := bookingService.GetAllBookings()
	if err != nil {
		log.Printf("Error retrieving bookings: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

func AdminUpdateBooking(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req models.AdminBookingUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status if provided
	if req.Status != "" {
		validStatuses := map[string]bool{
			"pending":     true,
			"confirmed":   true,
			"in_progress": true,
			"completed":   true,
			"cancelled":   true,
		}
		if !validStatuses[req.Status] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
			return
		}
	}

	bookingService := services.NewBookingService()
	err = bookingService.AdminUpdateBooking(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking updated successfully"})
}

// Quote management handlers
func GetQuotes(c *gin.Context) {
	quoteService := services.NewQuoteService()
	quotes, err := quoteService.GetAllQuotes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve quotes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"quotes": quotes})
}

func UpdateQuote(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid quote ID"})
		return
	}

	var req struct {
		EstimatedPrice float64 `json:"estimated_price"`
		Status         string  `json:"status" validate:"oneof=pending sent accepted rejected"`
		AdminNotes     string  `json:"admin_notes"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quoteService := services.NewQuoteService()
	err = quoteService.UpdateQuote(id, req.EstimatedPrice, req.Status, req.AdminNotes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update quote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Quote updated successfully"})
}

// Contact message management handlers
func GetContactMessages(c *gin.Context) {
	contactService := services.NewContactService()
	messages, err := contactService.GetAllContactMessages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

func UpdateContactMessage(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
		return
	}

	var req models.ContactMessageUpdate
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contactService := services.NewContactService()
	err = contactService.UpdateContactMessage(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contact message updated successfully"})
}

// FAQ management handlers
func CreateFAQ(c *gin.Context) {
	var req models.FAQRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contactService := services.NewContactService()
	faq, err := contactService.CreateFAQ(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create FAQ"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"faq": faq})
}

func UpdateFAQ(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid FAQ ID"})
		return
	}

	var req models.FAQRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contactService := services.NewContactService()
	err = contactService.UpdateFAQ(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update FAQ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "FAQ updated successfully"})
}

func DeleteFAQ(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid FAQ ID"})
		return
	}

	contactService := services.NewContactService()
	err = contactService.DeleteFAQ(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete FAQ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "FAQ deleted successfully"})
}