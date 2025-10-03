package handlers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"cleaning-app-backend/internal/services"

	"github.com/gin-gonic/gin"
)

// GetCalendarEvents returns bookings formatted for calendar display
func GetCalendarEvents(c *gin.Context) {
	// Parse date range parameters
	startDateStr := c.Query("start")
	endDateStr := c.Query("end")
	
	var startDate, endDate time.Time
	var err error
	
	if startDateStr != "" {
		startDate, err = time.Parse("2006-01-02", startDateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format. Use YYYY-MM-DD"})
			return
		}
	} else {
		// Default to current month
		now := time.Now()
		startDate = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	}
	
	if endDateStr != "" {
		endDate, err = time.Parse("2006-01-02", endDateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format. Use YYYY-MM-DD"})
			return
		}
	} else {
		// Default to end of month
		endDate = startDate.AddDate(0, 1, -1) // Last day of the month
	}

	calendarService := services.NewCalendarService()
	events, err := calendarService.GetCalendarEvents(startDate, endDate)
	if err != nil {
		log.Printf("Error retrieving calendar events for %s to %s: %v", startDateStr, endDateStr, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve calendar events"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"events": events})
}

// GetDaySchedule returns detailed schedule for a specific day
func GetDaySchedule(c *gin.Context) {
	dateStr := c.Param("date")
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	calendarService := services.NewCalendarService()
	schedule, err := calendarService.GetDaySchedule(date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve day schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"schedule": schedule})
}

// GetAvailableSlots returns available time slots for a specific date
func GetAvailableSlots(c *gin.Context) {
	dateStr := c.Query("date")
	var date time.Time
	var err error
	
	if dateStr == "" {
		// Default to tomorrow if no date provided
		date = time.Now().AddDate(0, 0, 1)
	} else {
		date, err = time.Parse("2006-01-02", dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
			return
		}
	}

	serviceIDStr := c.Query("service_id")
	var serviceID int
	if serviceIDStr != "" {
		serviceID, err = strconv.Atoi(serviceIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid service ID"})
			return
		}
	}

	calendarService := services.NewCalendarService()
	slots, err := calendarService.GetAvailableSlots(date, serviceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve available slots"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"available_slots": slots})
}

// GetBookingStats returns statistics for admin dashboard
func GetBookingStats(c *gin.Context) {
	periodStr := c.Query("period") // daily, weekly, monthly, yearly
	if periodStr == "" {
		periodStr = "monthly"
	}

	calendarService := services.NewCalendarService()
	stats, err := calendarService.GetBookingStats(periodStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve booking statistics"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"stats": stats})
}

// RescheduleBooking allows admins to reschedule bookings from calendar view
func RescheduleBooking(c *gin.Context) {
	bookingID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req struct {
		NewDate string `json:"new_date" validate:"required"`
		NewTime string `json:"new_time" validate:"required"`
		Reason  string `json:"reason"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	calendarService := services.NewCalendarService()
	err = calendarService.RescheduleBooking(bookingID, req.NewDate, req.NewTime, req.Reason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reschedule booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking rescheduled successfully"})
}