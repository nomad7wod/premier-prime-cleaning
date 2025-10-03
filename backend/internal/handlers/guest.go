package handlers

import (
	"net/http"
	"strconv"

	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/services"

	"github.com/gin-gonic/gin"
)

// CreateGuestBooking allows guests to book without registration
func CreateGuestBooking(c *gin.Context) {
	var req models.GuestBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bookingService := services.NewBookingService()
	booking, err := bookingService.CreateGuestBooking(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"booking": booking,
		"message": "Booking created successfully! You will receive a confirmation email shortly.",
	})
}

// GetGuestBooking allows guests to check their booking status using email and booking ID
func GetGuestBooking(c *gin.Context) {
	bookingID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email parameter is required"})
		return
	}

	bookingService := services.NewBookingService()
	booking, err := bookingService.GetGuestBooking(bookingID, email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"booking": booking})
}

// RequestQuote allows anyone to request a quote without booking
func RequestQuote(c *gin.Context) {
	var req models.QuoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quoteService := services.NewQuoteService()
	quote, err := quoteService.CreateQuote(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create quote request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"quote": quote,
		"message": "Quote request submitted successfully! We'll get back to you within 24 hours.",
	})
}

// GetQuoteEstimate provides instant price estimation
func GetQuoteEstimate(c *gin.Context) {
	serviceID, err := strconv.Atoi(c.Query("service_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid service ID"})
		return
	}

	squareMetersStr := c.Query("square_meters")
	squareMeters, err := strconv.ParseFloat(squareMetersStr, 64)
	if err != nil || squareMeters <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid square meters"})
		return
	}

	quoteService := services.NewQuoteService()
	estimate, err := quoteService.GetInstantEstimate(serviceID, squareMeters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate estimate"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"estimate": estimate,
		"note": "This is an instant estimate. Final price may vary based on specific requirements.",
	})
}

// SubmitContactMessage allows anyone to submit questions or feedback
func SubmitContactMessage(c *gin.Context) {
	var req models.ContactMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contactService := services.NewContactService()
	message, err := contactService.CreateContactMessage(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit message"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": message,
		"response": "Thank you for your message! We'll get back to you as soon as possible.",
	})
}

// GetFAQs returns frequently asked questions
func GetFAQs(c *gin.Context) {
	category := c.Query("category")
	
	contactService := services.NewContactService()
	faqs, err := contactService.GetFAQs(category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve FAQs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"faqs": faqs})
}