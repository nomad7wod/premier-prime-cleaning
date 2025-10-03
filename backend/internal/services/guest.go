package services

import (
	"errors"
	"time"

	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/repositories"
)

type QuoteService struct {
	repo *repositories.QuoteRepository
}

func NewQuoteService() *QuoteService {
	return &QuoteService{
		repo: &repositories.QuoteRepository{},
	}
}

func (s *QuoteService) CreateQuote(quoteReq *models.QuoteRequest) (*models.QuoteResponse, error) {
	// Calculate estimated price
	serviceService := NewServiceService()
	service, err := serviceService.GetServiceByID(quoteReq.ServiceID)
	if err != nil {
		return nil, errors.New("service not found")
	}

	// Basic pricing calculation - can be enhanced with more complex logic
	basePrice := service.BasePrice
	sizeMultiplier := quoteReq.SquareMeters / 50.0 // Base rate per 50 sqm
	if sizeMultiplier < 1 {
		sizeMultiplier = 1
	}
	
	estimatedPrice := basePrice * sizeMultiplier
	
	// Add complexity factors
	if len(quoteReq.SpecialRequirements) > 100 {
		estimatedPrice *= 1.2 // 20% increase for complex requirements
	}

	quote := &models.Quote{
		ServiceID:           quoteReq.ServiceID,
		SquareMeters:        quoteReq.SquareMeters,
		Address:             quoteReq.Address,
		SpecialRequirements: quoteReq.SpecialRequirements,
		PreferredDate:       quoteReq.PreferredDate,
		ContactEmail:        quoteReq.ContactEmail,
		ContactName:         quoteReq.ContactName,
		ContactPhone:        quoteReq.ContactPhone,
		EstimatedPrice:      estimatedPrice,
		Status:              "pending",
	}

	err = s.repo.CreateQuote(quote)
	if err != nil {
		return nil, errors.New("failed to create quote")
	}

	quoteResp := &models.QuoteResponse{
		ID:                  quote.ID,
		ServiceID:           quote.ServiceID,
		ServiceName:         service.Name,
		SquareMeters:        quote.SquareMeters,
		Address:             quote.Address,
		SpecialRequirements: quote.SpecialRequirements,
		PreferredDate:       quote.PreferredDate,
		ContactEmail:        quote.ContactEmail,
		ContactName:         quote.ContactName,
		ContactPhone:        quote.ContactPhone,
		EstimatedPrice:      quote.EstimatedPrice,
		Status:              quote.Status,
		CreatedAt:           quote.CreatedAt,
	}

	return quoteResp, nil
}

func (s *QuoteService) GetInstantEstimate(serviceID int, squareMeters float64) (float64, error) {
	serviceService := NewServiceService()
	service, err := serviceService.GetServiceByID(serviceID)
	if err != nil {
		return 0, errors.New("service not found")
	}

	// Simple estimation algorithm
	basePrice := service.BasePrice
	sizeMultiplier := squareMeters / 50.0
	if sizeMultiplier < 1 {
		sizeMultiplier = 1
	}

	estimate := basePrice * sizeMultiplier

	return estimate, nil
}

func (s *QuoteService) GetAllQuotes() ([]models.QuoteResponse, error) {
	return s.repo.GetAllQuotes()
}

func (s *QuoteService) UpdateQuote(id int, estimatedPrice float64, status, adminNotes string) error {
	quote := &models.Quote{
		ID:             id,
		EstimatedPrice: estimatedPrice,
		Status:         status,
		AdminNotes:     adminNotes,
	}
	return s.repo.UpdateQuote(quote)
}

type ContactService struct {
	repo *repositories.ContactRepository
}

func NewContactService() *ContactService {
	return &ContactService{
		repo: &repositories.ContactRepository{},
	}
}

func (s *ContactService) CreateContactMessage(messageReq *models.ContactMessageRequest) (*models.ContactMessageResponse, error) {
	message := &models.ContactMessage{
		Name:     messageReq.Name,
		Email:    messageReq.Email,
		Phone:    messageReq.Phone,
		Subject:  messageReq.Subject,
		Message:  messageReq.Message,
		Status:   "new",
		Priority: "medium", // Default priority
		Category: messageReq.Category,
	}

	err := s.repo.CreateContactMessage(message)
	if err != nil {
		return nil, errors.New("failed to create contact message")
	}

	messageResp := &models.ContactMessageResponse{
		ID:        message.ID,
		Name:      message.Name,
		Email:     message.Email,
		Phone:     message.Phone,
		Subject:   message.Subject,
		Message:   message.Message,
		Status:    message.Status,
		Priority:  message.Priority,
		Category:  message.Category,
		CreatedAt: message.CreatedAt,
		UpdatedAt: message.UpdatedAt,
	}

	return messageResp, nil
}

func (s *ContactService) GetFAQs(category string) ([]models.FAQResponse, error) {
	return s.repo.GetFAQs(category)
}

func (s *ContactService) GetAllContactMessages() ([]models.ContactMessageResponse, error) {
	return s.repo.GetAllContactMessages()
}

func (s *ContactService) UpdateContactMessage(id int, update *models.ContactMessageUpdate) error {
	message := &models.ContactMessage{
		ID:         id,
		Status:     update.Status,
		Priority:   update.Priority,
		AdminNotes: update.AdminNotes,
		AssignedTo: update.AssignedTo,
	}
	return s.repo.UpdateContactMessage(message)
}

func (s *ContactService) CreateFAQ(faqReq *models.FAQRequest) (*models.FAQResponse, error) {
	faq := &models.FAQ{
		Question:     faqReq.Question,
		Answer:       faqReq.Answer,
		Category:     faqReq.Category,
		IsActive:     true,
		DisplayOrder: faqReq.DisplayOrder,
	}

	err := s.repo.CreateFAQ(faq)
	if err != nil {
		return nil, errors.New("failed to create FAQ")
	}

	faqResp := &models.FAQResponse{
		ID:           faq.ID,
		Question:     faq.Question,
		Answer:       faq.Answer,
		Category:     faq.Category,
		IsActive:     faq.IsActive,
		DisplayOrder: faq.DisplayOrder,
	}

	return faqResp, nil
}

func (s *ContactService) UpdateFAQ(id int, faqReq *models.FAQRequest) error {
	faq := &models.FAQ{
		ID:           id,
		Question:     faqReq.Question,
		Answer:       faqReq.Answer,
		Category:     faqReq.Category,
		DisplayOrder: faqReq.DisplayOrder,
		IsActive:     true,
	}
	return s.repo.UpdateFAQ(faq)
}

func (s *ContactService) DeleteFAQ(id int) error {
	return s.repo.DeleteFAQ(id)
}

// Enhanced booking service methods for guest bookings
func (s *BookingService) CreateGuestBooking(bookingReq *models.GuestBookingRequest) (*models.BookingResponse, error) {
	// Get service details
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

	// Calculate total price
	totalPrice := service.BasePrice * bookingReq.SquareMeters / 50
	if totalPrice < service.BasePrice {
		totalPrice = service.BasePrice // Minimum price
	}

	booking := &models.Booking{
		UserID:              nil, // Guest booking
		ServiceID:           bookingReq.ServiceID,
		ScheduledDate:       scheduledDate,
		ScheduledTime:       bookingReq.ScheduledTime,
		Address:             bookingReq.Address,
		SquareMeters:        bookingReq.SquareMeters,
		SpecialInstructions: bookingReq.SpecialInstructions,
		TotalPrice:          totalPrice,
		Status:              "pending",
		GuestName:           bookingReq.GuestName,
		GuestEmail:          bookingReq.GuestEmail,
		GuestPhone:          bookingReq.GuestPhone,
		IsGuestBooking:      true,
	}

	err = s.repo.CreateGuestBooking(booking)
	if err != nil {
		return nil, errors.New("failed to create booking")
	}

	// Get the created booking with service name
	bookingResp := &models.BookingResponse{
		ID:                  booking.ID,
		UserID:              booking.UserID,
		ServiceID:           booking.ServiceID,
		ServiceName:         service.Name,
		ScheduledDate:       booking.ScheduledDate,
		ScheduledTime:       booking.ScheduledTime,
		Address:             booking.Address,
		SquareMeters:        booking.SquareMeters,
		SpecialInstructions: booking.SpecialInstructions,
		TotalPrice:          booking.TotalPrice,
		Status:              booking.Status,
		GuestName:           booking.GuestName,
		GuestEmail:          booking.GuestEmail,
		GuestPhone:          booking.GuestPhone,
		IsGuestBooking:      booking.IsGuestBooking,
		CreatedAt:           booking.CreatedAt,
	}

	return bookingResp, nil
}

func (s *BookingService) GetGuestBooking(bookingID int, email string) (*models.BookingResponse, error) {
	return s.repo.GetGuestBooking(bookingID, email)
}