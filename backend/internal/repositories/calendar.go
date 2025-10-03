package repositories

import (
	"cleaning-app-backend/internal/database"
	"cleaning-app-backend/internal/models"
	"time"
)

type CalendarRepository struct{}

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

func (r *CalendarRepository) GetBookingsByDateRange(startDate, endDate time.Time) ([]models.BookingResponse, error) {
	rows, err := database.DB.Query(
		`SELECT b.id, b.user_id, b.service_id, s.name, b.scheduled_date, b.scheduled_time, 
		         b.address, b.square_meters, COALESCE(b.special_instructions, '') as special_instructions, 
		         b.total_price, b.status, 
		         COALESCE(b.guest_name, '') as guest_name, COALESCE(b.guest_email, '') as guest_email, 
		         COALESCE(b.guest_phone, '') as guest_phone, b.is_guest_booking, 
		         b.created_at 
		 FROM bookings b 
		 JOIN services s ON b.service_id = s.id 
		 WHERE b.scheduled_date >= $1 AND b.scheduled_date <= $2
		 ORDER BY b.scheduled_date, b.scheduled_time`,
		startDate, endDate,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []models.BookingResponse
	for rows.Next() {
		var booking models.BookingResponse
		err := rows.Scan(
			&booking.ID, &booking.UserID, &booking.ServiceID, &booking.ServiceName,
			&booking.ScheduledDate, &booking.ScheduledTime, &booking.Address,
			&booking.SquareMeters, &booking.SpecialInstructions, &booking.TotalPrice,
			&booking.Status, &booking.GuestName, &booking.GuestEmail, &booking.GuestPhone,
			&booking.IsGuestBooking, &booking.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, booking)
	}

	return bookings, nil
}

func (r *CalendarRepository) GetBookingStats(period string) (*BookingStats, error) {
	stats := &BookingStats{
		Period: period,
	}

	// Get basic counts
	var totalBookings, completedBookings, cancelledBookings, pendingBookings int
	var totalRevenue, avgBookingValue float64

	err := database.DB.QueryRow(
		`SELECT 
			COUNT(*) as total_bookings,
			COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
			COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
			COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
			COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0) as total_revenue,
			COALESCE(AVG(CASE WHEN status = 'completed' THEN total_price END), 0) as avg_booking_value
		 FROM bookings 
		 WHERE created_at >= NOW() - INTERVAL '1 month'`,
	).Scan(&totalBookings, &completedBookings, &cancelledBookings, &pendingBookings, &totalRevenue, &avgBookingValue)

	if err != nil {
		return nil, err
	}

	stats.Data.TotalBookings = totalBookings
	stats.Data.CompletedBookings = completedBookings
	stats.Data.CancelledBookings = cancelledBookings
	stats.Data.PendingBookings = pendingBookings
	stats.Data.TotalRevenue = totalRevenue
	stats.Data.AvgBookingValue = avgBookingValue

	// Get bookings by status
	stats.Data.BookingsByStatus = make(map[string]int)
	statusRows, err := database.DB.Query(
		`SELECT status, COUNT(*) FROM bookings 
		 WHERE created_at >= NOW() - INTERVAL '1 month' 
		 GROUP BY status`,
	)
	if err == nil {
		defer statusRows.Close()
		for statusRows.Next() {
			var status string
			var count int
			statusRows.Scan(&status, &count)
			stats.Data.BookingsByStatus[status] = count
		}
	}

	// Get bookings by service
	stats.Data.BookingsByService = make(map[string]int)
	serviceRows, err := database.DB.Query(
		`SELECT s.name, COUNT(*) FROM bookings b
		 JOIN services s ON b.service_id = s.id
		 WHERE b.created_at >= NOW() - INTERVAL '1 month' 
		 GROUP BY s.name`,
	)
	if err == nil {
		defer serviceRows.Close()
		for serviceRows.Next() {
			var serviceName string
			var count int
			serviceRows.Scan(&serviceName, &count)
			stats.Data.BookingsByService[serviceName] = count
		}
	}

	// Get revenue by month for the last 12 months if period is monthly or yearly
	if period == "monthly" || period == "yearly" {
		revenueRows, err := database.DB.Query(
			`SELECT 
				TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
				SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END) as revenue
			 FROM bookings 
			 WHERE created_at >= NOW() - INTERVAL '12 months'
			 GROUP BY DATE_TRUNC('month', created_at)
			 ORDER BY month`,
		)
		if err == nil {
			defer revenueRows.Close()
			for revenueRows.Next() {
				var monthRevenue struct {
					Month   string  `json:"month"`
					Revenue float64 `json:"revenue"`
				}
				revenueRows.Scan(&monthRevenue.Month, &monthRevenue.Revenue)
				stats.Data.RevenueByMonth = append(stats.Data.RevenueByMonth, monthRevenue)
			}
		}
	}

	return stats, nil
}

func (r *CalendarRepository) RescheduleBooking(bookingID int, newDate, newTime, reason string) error {
	// Parse the new date
	parsedDate, err := time.Parse("2006-01-02", newDate)
	if err != nil {
		return err
	}

	// Update the booking
	_, err = database.DB.Exec(
		`UPDATE bookings SET scheduled_date=$1, scheduled_time=$2, updated_at=$3 WHERE id=$4`,
		parsedDate, newTime, time.Now(), bookingID,
	)

	// TODO: Add notification logic here to inform the customer about the reschedule

	return err
}