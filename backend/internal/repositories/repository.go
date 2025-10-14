package repositories

import (
	"cleaning-app-backend/internal/database"
	"cleaning-app-backend/internal/models"
	"time"
)

type UserRepository struct{}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	
	err := database.DB.QueryRow(
		query,
		user.Email, user.Password, user.FirstName, user.LastName, user.Phone, user.Role,
		time.Now(), time.Now(),
	).Scan(&user.ID)

	return err
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, email, password_hash, first_name, last_name, phone, role, created_at FROM users WHERE email=$1",
		email,
	).Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.Phone, &user.Role, &user.CreatedAt)

	return &user, err
}

func (r *UserRepository) GetUserByID(id int) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, email, password_hash, first_name, last_name, phone, role, created_at FROM users WHERE id=$1",
		id,
	).Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.Phone, &user.Role, &user.CreatedAt)

	return &user, err
}

type ServiceRepository struct{}

func (r *ServiceRepository) CreateService(service *models.Service) error {
	query := `INSERT INTO services (name, description, base_price, duration_hours, service_type, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`

	err := database.DB.QueryRow(
		query,
		service.Name, service.Description, service.BasePrice, service.Duration, service.ServiceType,
		time.Now(), time.Now(),
	).Scan(&service.ID)

	return err
}

func (r *ServiceRepository) GetServiceByID(id int) (*models.Service, error) {
	var service models.Service
	err := database.DB.QueryRow(
		"SELECT id, name, description, base_price, duration_hours, service_type, created_at FROM services WHERE id=$1",
		id,
	).Scan(&service.ID, &service.Name, &service.Description, &service.BasePrice, &service.Duration, &service.ServiceType, &service.CreatedAt)

	return &service, err
}

func (r *ServiceRepository) GetAllServices() ([]models.ServiceResponse, error) {
	rows, err := database.DB.Query("SELECT id, name, description, base_price, duration_hours, service_type, created_at FROM services ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var services []models.ServiceResponse
	for rows.Next() {
		var service models.ServiceResponse
		err := rows.Scan(&service.ID, &service.Name, &service.Description, &service.BasePrice, &service.Duration, &service.ServiceType, &service.CreatedAt)
		if err != nil {
			return nil, err
		}
		services = append(services, service)
	}

	return services, nil
}

func (r *ServiceRepository) UpdateService(service *models.Service) error {
	query := `UPDATE services SET name=$1, description=$2, base_price=$3, duration_hours=$4, service_type=$5, updated_at=$6 
	          WHERE id=$7`

	_, err := database.DB.Exec(
		query,
		service.Name, service.Description, service.BasePrice, service.Duration, service.ServiceType,
		time.Now(), service.ID,
	)

	return err
}

func (r *ServiceRepository) DeleteService(id int) error {
	_, err := database.DB.Exec("DELETE FROM services WHERE id=$1", id)
	return err
}

type BookingRepository struct{}

func (r *BookingRepository) CreateBooking(booking *models.Booking) error {
	query := `INSERT INTO bookings (user_id, service_id, scheduled_date, scheduled_time, address, square_meters, special_instructions, total_price, status, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`

	err := database.DB.QueryRow(
		query,
		booking.UserID, booking.ServiceID, booking.ScheduledDate, booking.ScheduledTime,
		booking.Address, booking.SquareMeters, booking.SpecialInstructions,
		booking.TotalPrice, booking.Status, time.Now(), time.Now(),
	).Scan(&booking.ID)

	return err
}

func (r *BookingRepository) CreateGuestBooking(booking *models.Booking) error {
	query := `INSERT INTO bookings (user_id, service_id, scheduled_date, scheduled_time, address, square_meters, special_instructions, total_price, status, guest_name, guest_email, guest_phone, is_guest_booking, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`

	err := database.DB.QueryRow(
		query,
		booking.UserID, booking.ServiceID, booking.ScheduledDate, booking.ScheduledTime,
		booking.Address, booking.SquareMeters, booking.SpecialInstructions,
		booking.TotalPrice, booking.Status, booking.GuestName, booking.GuestEmail, 
		booking.GuestPhone, booking.IsGuestBooking, time.Now(), time.Now(),
	).Scan(&booking.ID)

	return err
}

func (r *BookingRepository) GetGuestBooking(bookingID int, email string) (*models.BookingResponse, error) {
	var booking models.BookingResponse
	err := database.DB.QueryRow(
		`SELECT b.id, b.user_id, b.service_id, s.name, b.scheduled_date, b.scheduled_time, 
		         b.address, b.square_meters, b.special_instructions, b.total_price, b.status, 
		         b.guest_name, b.guest_email, b.guest_phone, b.is_guest_booking, b.created_at 
		 FROM bookings b 
		 JOIN services s ON b.service_id = s.id 
		 WHERE b.id = $1 AND b.guest_email = $2 AND b.is_guest_booking = true`,
		bookingID, email,
	).Scan(
		&booking.ID, &booking.UserID, &booking.ServiceID, &booking.ServiceName,
		&booking.ScheduledDate, &booking.ScheduledTime, &booking.Address,
		&booking.SquareMeters, &booking.SpecialInstructions, &booking.TotalPrice,
		&booking.Status, &booking.GuestName, &booking.GuestEmail, &booking.GuestPhone,
		&booking.IsGuestBooking, &booking.CreatedAt,
	)

	return &booking, err
}

func (r *BookingRepository) GetBookingByID(id int) (*models.Booking, error) {
	var booking models.Booking
	err := database.DB.QueryRow(
		`SELECT id, user_id, service_id, scheduled_date, scheduled_time, address, square_meters, 
		 COALESCE(special_instructions, '') as special_instructions, total_price, status,
		 COALESCE(guest_name, '') as guest_name, 
		 COALESCE(guest_email, '') as guest_email, 
		 COALESCE(guest_phone, '') as guest_phone,
		 COALESCE(is_guest_booking, false) as is_guest_booking,
		 created_at FROM bookings WHERE id=$1`,
		id,
	).Scan(&booking.ID, &booking.UserID, &booking.ServiceID, &booking.ScheduledDate, &booking.ScheduledTime, 
		&booking.Address, &booking.SquareMeters, &booking.SpecialInstructions, &booking.TotalPrice, 
		&booking.Status, &booking.GuestName, &booking.GuestEmail, &booking.GuestPhone, 
		&booking.IsGuestBooking, &booking.CreatedAt)

	return &booking, err
}

func (r *BookingRepository) GetBookingsByUserID(userID int) ([]models.BookingResponse, error) {
	rows, err := database.DB.Query(
		`SELECT b.id, b.user_id, b.service_id, s.name, b.scheduled_date, b.scheduled_time, 
		         b.address, b.square_meters, b.special_instructions, b.total_price, b.status, b.created_at 
		 FROM bookings b 
		 JOIN services s ON b.service_id = s.id 
		 WHERE b.user_id = $1 
		 ORDER BY b.created_at DESC`,
		userID,
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
			&booking.Status, &booking.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, booking)
	}

	return bookings, nil
}

func (r *BookingRepository) UpdateBooking(booking *models.Booking) error {
	query := `UPDATE bookings SET scheduled_date=$1, scheduled_time=$2, address=$3, square_meters=$4, special_instructions=$5, total_price=$6, status=$7, updated_at=$8 
	          WHERE id=$9`

	_, err := database.DB.Exec(
		query,
		booking.ScheduledDate, booking.ScheduledTime, booking.Address, booking.SquareMeters,
		booking.SpecialInstructions, booking.TotalPrice, booking.Status, time.Now(), booking.ID,
	)

	return err
}

func (r *BookingRepository) GetAllBookings() ([]models.BookingResponse, error) {
	rows, err := database.DB.Query(
		`SELECT b.id, b.user_id, u.email, b.service_id, s.name, b.scheduled_date, b.scheduled_time, 
		         b.address, b.square_meters, COALESCE(b.special_instructions, '') as special_instructions, 
		         b.total_price, b.status, b.invoice_id,
		         COALESCE(b.guest_name, '') as guest_name, 
		         COALESCE(b.guest_email, '') as guest_email, 
		         COALESCE(b.guest_phone, '') as guest_phone, 
		         b.is_guest_booking, b.created_at 
		 FROM bookings b 
		 JOIN services s ON b.service_id = s.id 
		 LEFT JOIN users u ON b.user_id = u.id
		 ORDER BY b.created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []models.BookingResponse
	for rows.Next() {
		var booking models.BookingResponse
		var userEmail *string
		err := rows.Scan(
			&booking.ID, &booking.UserID, &userEmail, &booking.ServiceID, &booking.ServiceName,
			&booking.ScheduledDate, &booking.ScheduledTime, &booking.Address,
			&booking.SquareMeters, &booking.SpecialInstructions, &booking.TotalPrice,
			&booking.Status, &booking.InvoiceID, &booking.GuestName, &booking.GuestEmail, &booking.GuestPhone,
			&booking.IsGuestBooking, &booking.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		
		bookings = append(bookings, booking)
	}

	return bookings, nil
}