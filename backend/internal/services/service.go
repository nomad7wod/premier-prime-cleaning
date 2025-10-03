package services

import (
	"errors"
	"time"

	"cleaning-app-backend/internal/database"
	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/repositories"
	"cleaning-app-backend/internal/utils"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		repo: &repositories.UserRepository{},
	}
}

func (s *UserService) Register(userReq *models.UserRegisterRequest) (*models.UserResponse, error) {
	// Check if user already exists
	_, err := s.repo.GetUserByEmail(userReq.Email)
	if err == nil {
		return nil, errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(userReq.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := &models.User{
		Email:     userReq.Email,
		Password:  hashedPassword,
		FirstName: userReq.FirstName,
		LastName:  userReq.LastName,
		Phone:     userReq.Phone,
		Role:      "client",
	}

	err = s.repo.CreateUser(user)
	if err != nil {
		return nil, errors.New("failed to create user")
	}

	userResp := &models.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Phone:     user.Phone,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	return userResp, nil
}

func (s *UserService) Login(email, password string) (*models.UserResponse, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if !utils.CheckPassword(password, user.Password) {
		return nil, errors.New("invalid credentials")
	}

	userResp := &models.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Phone:     user.Phone,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	return userResp, nil
}

func (s *UserService) GetProfile(userID int) (*models.UserResponse, error) {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	userResp := &models.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Phone:     user.Phone,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	return userResp, nil
}

type ServiceService struct {
	repo *repositories.ServiceRepository
}

func NewServiceService() *ServiceService {
	return &ServiceService{
		repo: &repositories.ServiceRepository{},
	}
}

func (s *ServiceService) CreateService(serviceReq *models.ServiceRequest) (*models.ServiceResponse, error) {
	service := &models.Service{
		Name:        serviceReq.Name,
		Description: serviceReq.Description,
		BasePrice:   serviceReq.BasePrice,
		Duration:    serviceReq.Duration,
		ServiceType: serviceReq.ServiceType,
	}

	err := s.repo.CreateService(service)
	if err != nil {
		return nil, errors.New("failed to create service")
	}

	serviceResp := &models.ServiceResponse{
		ID:          service.ID,
		Name:        service.Name,
		Description: service.Description,
		BasePrice:   service.BasePrice,
		Duration:    service.Duration,
		ServiceType: service.ServiceType,
		CreatedAt:   time.Now(),
	}

	return serviceResp, nil
}

func (s *ServiceService) GetServiceByID(id int) (*models.Service, error) {
	return s.repo.GetServiceByID(id)
}

func (s *ServiceService) GetAllServices() ([]models.ServiceResponse, error) {
	return s.repo.GetAllServices()
}

func (s *ServiceService) UpdateService(serviceReq *models.Service, id int) error {
	serviceReq.ID = id
	return s.repo.UpdateService(serviceReq)
}

func (s *ServiceService) DeleteService(id int) error {
	return s.repo.DeleteService(id)
}

type BookingService struct {
	repo *repositories.BookingRepository
}

func NewBookingService() *BookingService {
	return &BookingService{
		repo: &repositories.BookingRepository{},
	}
}

func (s *BookingService) CreateBooking(bookingReq *models.BookingRequest) (*models.BookingResponse, error) {
	// Calculate total price based on service base price and square meters
	// This would require getting service details first
	serviceService := NewServiceService()
	service, err := serviceService.GetServiceByID(bookingReq.ServiceID)
	if err != nil {
		return nil, errors.New("service not found")
	}

	// Parse date
	scheduledDate, err := time.Parse("2006-01-02", bookingReq.ScheduledDate)
	if err != nil {
		return nil, errors.New("invalid date format. Use YYYY-MM-DD")
	}

	// Calculate total price based on service base price and square meters
	totalPrice := service.BasePrice * bookingReq.SquareMeters / 50 // Adjust pricing algorithm as needed

	booking := &models.Booking{
		UserID:              bookingReq.UserID,
		ServiceID:           bookingReq.ServiceID,
		ScheduledDate:       scheduledDate,
		ScheduledTime:       bookingReq.ScheduledTime,
		Address:             bookingReq.Address,
		SquareMeters:        bookingReq.SquareMeters,
		SpecialInstructions: bookingReq.SpecialInstructions,
		TotalPrice:          totalPrice,
		Status:              "pending",
	}

	err = s.repo.CreateBooking(booking)
	if err != nil {
		return nil, errors.New("failed to create booking")
	}

	// Get the created booking with service name
	var userID int
	if booking.UserID != nil {
		userID = *booking.UserID
	}
	bookingResp, err := s.GetBookingByID(booking.ID, userID)
	if err != nil {
		return nil, errors.New("failed to retrieve created booking")
	}

	return bookingResp, nil
}

func (s *BookingService) GetBookingByID(id int, userID int) (*models.BookingResponse, error) {
	var booking models.BookingResponse
	err := database.DB.QueryRow(
		`SELECT b.id, b.user_id, b.service_id, s.name, b.scheduled_date, b.scheduled_time, 
		         b.address, b.square_meters, b.special_instructions, b.total_price, b.status, b.created_at 
		 FROM bookings b 
		 JOIN services s ON b.service_id = s.id 
		 WHERE b.id = $1 AND b.user_id = $2`,
		id, userID,
	).Scan(
		&booking.ID, &booking.UserID, &booking.ServiceID, &booking.ServiceName,
		&booking.ScheduledDate, &booking.ScheduledTime, &booking.Address,
		&booking.SquareMeters, &booking.SpecialInstructions, &booking.TotalPrice,
		&booking.Status, &booking.CreatedAt,
	)

	return &booking, err
}

func (s *BookingService) GetBookingsByUserID(userID int) ([]models.BookingResponse, error) {
	return s.repo.GetBookingsByUserID(userID)
}

func (s *BookingService) UpdateBooking(bookingReq *models.Booking, id int, userID int) error {
	// First verify the booking exists and belongs to the user
	// For admin users (userID <= 0), skip ownership check
	var bookingFromDB models.Booking
	var err error
	
	if userID > 0 {
		// Regular user - check ownership
		err = database.DB.QueryRow(
			"SELECT id, user_id FROM bookings WHERE id = $1 AND user_id = $2",
			id, userID,
		).Scan(&bookingFromDB.ID, &bookingFromDB.UserID)
	} else {
		// Admin user - just check if booking exists
		err = database.DB.QueryRow(
			"SELECT id, user_id FROM bookings WHERE id = $1",
			id,
		).Scan(&bookingFromDB.ID, &bookingFromDB.UserID)
	}
	
	if err != nil {
		return errors.New("booking not found")
	}
	
	bookingReq.ID = id
	if userID > 0 {
		bookingReq.UserID = &userID // Ensure we're updating the correct user's booking
	} else {
		bookingReq.UserID = bookingFromDB.UserID // Use the actual booking's user ID for admin updates
	}
	return s.repo.UpdateBooking(bookingReq)
}

func (s *BookingService) AdminUpdateBooking(id int, req *models.AdminBookingUpdateRequest) error {
	// Get the existing booking first
	existingBooking, err := s.repo.GetBookingByID(id)
	if err != nil {
		return errors.New("booking not found")
	}

	// Fix the scheduled_time format if it's in PostgreSQL timestamp format
	existingBooking.ScheduledTime = s.normalizeTimeFormat(existingBooking.ScheduledTime)

	// Only update the fields that are provided
	if req.Status != "" {
		existingBooking.Status = req.Status
	}
	
	if req.ScheduledDate != nil && *req.ScheduledDate != "" {
		scheduledDate, err := time.Parse("2006-01-02", *req.ScheduledDate)
		if err != nil {
			return errors.New("invalid date format. Use YYYY-MM-DD")
		}
		existingBooking.ScheduledDate = scheduledDate
	}
	
	if req.ScheduledTime != nil && *req.ScheduledTime != "" {
		existingBooking.ScheduledTime = s.normalizeTimeFormat(*req.ScheduledTime)
	}
	
	if req.Address != nil {
		existingBooking.Address = *req.Address
	}
	
	if req.SquareMeters != nil {
		existingBooking.SquareMeters = *req.SquareMeters
	}
	
	if req.SpecialInstructions != nil {
		existingBooking.SpecialInstructions = *req.SpecialInstructions
	}
	
	if req.TotalPrice != nil {
		existingBooking.TotalPrice = *req.TotalPrice
	}

	return s.repo.UpdateBooking(existingBooking)
}

// Helper function to normalize time format for database storage
func (s *BookingService) normalizeTimeFormat(timeStr string) string {
	if timeStr == "" {
		return timeStr
	}

	// Handle PostgreSQL timestamp format: "0000-01-01T12:00:00Z"
	if len(timeStr) > 10 && timeStr[10] == 'T' {
		if parsedTime, err := time.Parse("2006-01-02T15:04:05Z", timeStr); err == nil {
			return parsedTime.Format("15:04:05")
		}
	}

	// If it's already in HH:MM:SS format, return as is
	// If it's in HH:MM format, append :00
	if len(timeStr) == 5 && timeStr[2] == ':' {
		return timeStr + ":00"
	}

	return timeStr
}

func (s *BookingService) GetAllBookings() ([]models.BookingResponse, error) {
	bookings, err := s.repo.GetAllBookings()
	if err != nil {
		return nil, err
	}

	// Fix time format for each booking
	for i := range bookings {
		bookings[i].ScheduledTime = s.formatTimeForDisplay(bookings[i].ScheduledTime)
	}

	return bookings, nil
}

// Helper function to format PostgreSQL time for API response
func (s *BookingService) formatTimeForDisplay(timeStr string) string {
	if timeStr == "" {
		return timeStr
	}

	// Handle PostgreSQL timestamp format: "0000-01-01T12:00:00Z"
	if len(timeStr) > 10 && timeStr[10] == 'T' {
		if parsedTime, err := time.Parse("2006-01-02T15:04:05Z", timeStr); err == nil {
			return parsedTime.Format("15:04:05")
		}
	}

	// If it's already in HH:MM:SS or HH:MM format, return as is
	return timeStr
}