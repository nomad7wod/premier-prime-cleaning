package handlers

import (
	"net/http"
	"strconv"

	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetBookings(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	bookingService := services.NewBookingService()
	bookings, err := bookingService.GetBookingsByUserID(userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

func GetBooking(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	bookingService := services.NewBookingService()
	booking, err := bookingService.GetBookingByID(id, userID.(int))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"booking": booking})
}

func CreateBooking(c *gin.Context) {
	var req models.BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDInt := userID.(int)
	req.UserID = &userIDInt

	bookingService := services.NewBookingService()
	booking, err := bookingService.CreateBooking(&req)
	if err != nil {
		if err.Error() == "service not found" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"booking": booking})
}

func UpdateBooking(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	// Check if booking belongs to user
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	var req models.BookingUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Only allow updating status to 'cancelled' for user-initiated changes
	if req.Status != "cancelled" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Users can only cancel their own bookings"})
		return
	}

	// In a real application, we would check if booking belongs to user
	// But for this example, we'll proceed with the update

	booking := &models.Booking{
		ID:     id,
		Status: req.Status,
	}

	bookingService := services.NewBookingService()
	err = bookingService.UpdateBooking(booking, id, userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking updated successfully"})
}

func CancelBooking(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	// Get user ID from context to verify booking ownership
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	booking := &models.Booking{
		ID:     id,
		Status: "cancelled",
	}

	bookingService := services.NewBookingService()
	err = bookingService.UpdateBooking(booking, id, userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled successfully"})
}
