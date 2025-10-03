package services

import (
	"time"

	"cleaning-app-backend/internal/repositories"
)

type CalendarService struct {
	repo *repositories.CalendarRepository
}

func NewCalendarService() *CalendarService {
	return &CalendarService{
		repo: &repositories.CalendarRepository{},
	}
}

type CalendarEvent struct {
	ID             int       `json:"id"`
	Title          string    `json:"title"`
	Start          time.Time `json:"start"`
	End            time.Time `json:"end"`
	Color          string    `json:"color"`
	Status         string    `json:"status"`
	ServiceName    string    `json:"service_name"`
	CustomerName   string    `json:"customer_name"`
	CustomerEmail  string    `json:"customer_email"`
	CustomerPhone  string    `json:"customer_phone"`
	Address        string    `json:"address"`
	SquareMeters   float64   `json:"square_meters"`
	TotalPrice     float64   `json:"total_price"`
	IsGuestBooking bool      `json:"is_guest_booking"`
}

type DaySchedule struct {
	Date     string          `json:"date"`
	Bookings []CalendarEvent `json:"bookings"`
	Stats    struct {
		TotalBookings int     `json:"total_bookings"`
		Revenue       float64 `json:"revenue"`
		AvgDuration   float64 `json:"avg_duration"`
	} `json:"stats"`
}

type AvailableSlot struct {
	Time        string `json:"time"`
	Available   bool   `json:"available"`
	Duration    int    `json:"duration"` // in minutes
	ServiceType string `json:"service_type,omitempty"`
}

type BookingStats struct {
	Period string `json:"period"`
	Data   struct {
		TotalBookings     int     `json:"total_bookings"`
		CompletedBookings int     `json:"completed_bookings"`
		CancelledBookings int     `json:"cancelled_bookings"`
		PendingBookings   int     `json:"pending_bookings"`
		TotalRevenue      float64 `json:"total_revenue"`
		AvgBookingValue   float64 `json:"avg_booking_value"`
		BookingsByStatus  map[string]int `json:"bookings_by_status"`
		BookingsByService map[string]int `json:"bookings_by_service"`
		RevenueByMonth    []struct {
			Month   string  `json:"month"`
			Revenue float64 `json:"revenue"`
		} `json:"revenue_by_month,omitempty"`
	} `json:"data"`
}

func (s *CalendarService) GetCalendarEvents(startDate, endDate time.Time) ([]CalendarEvent, error) {
	bookings, err := s.repo.GetBookingsByDateRange(startDate, endDate)
	if err != nil {
		return nil, err
	}

	events := make([]CalendarEvent, len(bookings))
	for i, booking := range bookings {
		// Parse the scheduled time - handle PostgreSQL time format
		var startTime time.Time
		var err error
		
		// PostgreSQL time field comes as "0000-01-01T09:00:00Z" format
		// Try parsing as full timestamp first
		startTime, err = time.Parse("2006-01-02T15:04:05Z", booking.ScheduledTime)
		if err != nil {
			// Try parsing as HH:MM:SS
			startTime, err = time.Parse("15:04:05", booking.ScheduledTime)
			if err != nil {
				// Fallback to HH:MM format
				startTime, err = time.Parse("15:04", booking.ScheduledTime)
				if err != nil {
					// If still fails, default to 9 AM
					startTime, _ = time.Parse("15:04", "09:00")
				}
			}
		}
		
		// Create time with UTC timezone for consistent API responses
		start := time.Date(
			booking.ScheduledDate.Year(),
			booking.ScheduledDate.Month(),
			booking.ScheduledDate.Day(),
			startTime.Hour(),
			startTime.Minute(),
			0, 0,
			time.UTC, // Use UTC for consistent API responses
		)

		// Estimate end time based on service duration
		var duration time.Duration
		switch booking.ServiceName {
		case "Basic House Cleaning":
			duration = 2 * time.Hour
		case "Deep House Cleaning":
			duration = 4 * time.Hour
		case "Office Cleaning":
			duration = 3 * time.Hour
		default:
			duration = 2 * time.Hour // Default duration
		}

		end := start.Add(duration)

		// Determine color based on status
		color := s.getStatusColor(booking.Status)

		// Customer name - either from user or guest
		customerName := booking.GuestName
		if !booking.IsGuestBooking && customerName == "" {
			customerName = "Registered User" // We'd need to join with users table for actual name
		}

		events[i] = CalendarEvent{
			ID:             booking.ID,
			Title:          booking.ServiceName + " - " + customerName,
			Start:          start,
			End:            end,
			Color:          color,
			Status:         booking.Status,
			ServiceName:    booking.ServiceName,
			CustomerName:   customerName,
			CustomerEmail:  booking.GuestEmail,
			CustomerPhone:  booking.GuestPhone,
			Address:        booking.Address,
			SquareMeters:   booking.SquareMeters,
			TotalPrice:     booking.TotalPrice,
			IsGuestBooking: booking.IsGuestBooking,
		}
	}

	return events, nil
}

func (s *CalendarService) GetDaySchedule(date time.Time) (*DaySchedule, error) {
	events, err := s.GetCalendarEvents(date, date)
	if err != nil {
		return nil, err
	}

	schedule := &DaySchedule{
		Date:     date.Format("2006-01-02"),
		Bookings: events,
	}

	// Calculate stats
	schedule.Stats.TotalBookings = len(events)
	totalRevenue := 0.0
	totalDuration := 0.0

	for _, event := range events {
		totalRevenue += event.TotalPrice
		totalDuration += event.End.Sub(event.Start).Hours()
	}

	schedule.Stats.Revenue = totalRevenue
	if len(events) > 0 {
		schedule.Stats.AvgDuration = totalDuration / float64(len(events))
	}

	return schedule, nil
}

func (s *CalendarService) GetAvailableSlots(date time.Time, serviceID int) ([]AvailableSlot, error) {
	// Get existing bookings for the date
	events, err := s.GetCalendarEvents(date, date)
	if err != nil {
		return nil, err
	}

	// Define business hours (9 AM to 6 PM)
	businessStart := 9
	businessEnd := 18
	slotDuration := 60 // minutes

	slots := make([]AvailableSlot, 0)

	for hour := businessStart; hour < businessEnd; hour++ {
		slotTime := time.Date(date.Year(), date.Month(), date.Day(), hour, 0, 0, 0, date.Location())
		
		// Check if this slot conflicts with existing bookings
		available := true
		for _, event := range events {
			if slotTime.Before(event.End) && slotTime.Add(time.Hour).After(event.Start) {
				available = false
				break
			}
		}

		slots = append(slots, AvailableSlot{
			Time:      slotTime.Format("15:04"),
			Available: available,
			Duration:  slotDuration,
		})
	}

	return slots, nil
}

func (s *CalendarService) GetBookingStats(period string) (*BookingStats, error) {
	repoStats, err := s.repo.GetBookingStats(period)
	if err != nil {
		return nil, err
	}

	// Convert repository BookingStats to service BookingStats
	stats := &BookingStats{
		Period: repoStats.Period,
	}
	stats.Data = repoStats.Data

	return stats, nil
}

func (s *CalendarService) RescheduleBooking(bookingID int, newDate, newTime, reason string) error {
	return s.repo.RescheduleBooking(bookingID, newDate, newTime, reason)
}

func (s *CalendarService) getStatusColor(status string) string {
	switch status {
	case "pending":
		return "#FFA500" // Orange
	case "confirmed":
		return "#4CAF50" // Green
	case "in_progress":
		return "#2196F3" // Blue
	case "completed":
		return "#8BC34A" // Light Green
	case "cancelled":
		return "#F44336" // Red
	default:
		return "#9E9E9E" // Gray
	}
}