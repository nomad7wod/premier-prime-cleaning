package models

import (
	"time"
)

type Booking struct {
	ID                  int       `json:"id" db:"id"`
	UserID              *int      `json:"user_id" db:"user_id"` // Made nullable for guest bookings
	ServiceID           int       `json:"service_id" db:"service_id" validate:"required"`
	ScheduledDate       time.Time `json:"scheduled_date" db:"scheduled_date" validate:"required"`
	ScheduledTime       string    `json:"scheduled_time" db:"scheduled_time" validate:"required"`
	Address             string    `json:"address" db:"address" validate:"required"`
	SquareMeters        float64   `json:"square_meters" db:"square_meters" validate:"required,gt=0"`
	SpecialInstructions string    `json:"special_instructions" db:"special_instructions"`
	TotalPrice          float64   `json:"total_price" db:"total_price" validate:"required,gt=0"`
	Status              string    `json:"status" db:"status" validate:"required,oneof=pending confirmed in_progress completed cancelled"`
	InvoiceID           *int      `json:"invoice_id" db:"invoice_id"` // Link to invoice if one exists
	
	// Guest booking information
	GuestName           string    `json:"guest_name" db:"guest_name"`
	GuestEmail          string    `json:"guest_email" db:"guest_email"`
	GuestPhone          string    `json:"guest_phone" db:"guest_phone"`
	IsGuestBooking      bool      `json:"is_guest_booking" db:"is_guest_booking"`
	
	// Billing Address Information
	BillingAddress      string    `json:"billing_address" db:"billing_address"`
	BillingCity         string    `json:"billing_city" db:"billing_city"`
	BillingState        string    `json:"billing_state" db:"billing_state"`
	BillingZipCode      string    `json:"billing_zip_code" db:"billing_zip_code"`
	BillingCountry      string    `json:"billing_country" db:"billing_country"`
	
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time `json:"updated_at" db:"updated_at"`
}

type BookingRequest struct {
	UserID              *int    `json:"user_id"` // Made nullable for guest bookings
	ServiceID           int     `json:"service_id" validate:"required"`
	ScheduledDate       string  `json:"scheduled_date" validate:"required"`
	ScheduledTime       string  `json:"scheduled_time" validate:"required"`
	Address             string  `json:"address" validate:"required"`
	SquareMeters        float64 `json:"square_meters" validate:"required,gt=0"`
	SpecialInstructions string  `json:"special_instructions"`
	
	// Guest booking fields
	GuestName           string  `json:"guest_name"`
	GuestEmail          string  `json:"guest_email"`
	GuestPhone          string  `json:"guest_phone"`
}

type GuestBookingRequest struct {
	ServiceID           int     `json:"service_id" validate:"required"`
	ScheduledDate       string  `json:"scheduled_date" validate:"required"`
	ScheduledTime       string  `json:"scheduled_time" validate:"required"`
	Address             string  `json:"address" validate:"required"`
	SquareMeters        float64 `json:"square_meters" validate:"required,gt=0"`
	SpecialInstructions string  `json:"special_instructions"`
	GuestName           string  `json:"guest_name" validate:"required"`
	GuestEmail          string  `json:"guest_email" validate:"required,email"`
	GuestPhone          string  `json:"guest_phone" validate:"required"`
	TotalPrice          float64 `json:"total_price" validate:"required,gt=0"`
	
	// Billing Address Information  
	BillingAddress      string  `json:"billing_address" validate:"required"`
	BillingCity         string  `json:"billing_city" validate:"required"`
	BillingState        string  `json:"billing_state" validate:"required"`
	BillingZipCode      string  `json:"billing_zip_code" validate:"required"`
	BillingCountry      string  `json:"billing_country"`
}

type BookingResponse struct {
	ID                  int       `json:"id"`
	UserID              *int      `json:"user_id"`
	ServiceID           int       `json:"service_id"`
	ServiceName         string    `json:"service_name"`
	ScheduledDate       time.Time `json:"scheduled_date"`
	ScheduledTime       string    `json:"scheduled_time"`
	Address             string    `json:"address"`
	SquareMeters        float64   `json:"square_meters"`
	SpecialInstructions string    `json:"special_instructions"`
	TotalPrice          float64   `json:"total_price"`
	Status              string    `json:"status"`
	InvoiceID           *int      `json:"invoice_id,omitempty"` // Link to invoice if one exists
	GuestName           string    `json:"guest_name,omitempty"`
	GuestEmail          string    `json:"guest_email,omitempty"`
	GuestPhone          string    `json:"guest_phone,omitempty"`
	IsGuestBooking      bool      `json:"is_guest_booking"`
	BillingAddress      string    `json:"billing_address,omitempty"`
	BillingCity         string    `json:"billing_city,omitempty"`
	BillingState        string    `json:"billing_state,omitempty"`
	BillingZipCode      string    `json:"billing_zip_code,omitempty"`
	BillingCountry      string    `json:"billing_country,omitempty"`
	CreatedAt           time.Time `json:"created_at"`
}

type BookingUpdateRequest struct {
	Status string `json:"status" validate:"required,oneof=pending confirmed in_progress completed cancelled"`
}

type AdminBookingUpdateRequest struct {
	ScheduledDate       *string  `json:"scheduled_date"`
	ScheduledTime       *string  `json:"scheduled_time"`
	Address             *string  `json:"address"`
	SquareMeters        *float64 `json:"square_meters"`
	SpecialInstructions *string  `json:"special_instructions"`
	TotalPrice          *float64 `json:"total_price"`
	Status              string   `json:"status" validate:"oneof=pending confirmed in_progress completed cancelled"`
}

// New Quote system
type QuoteRequest struct {
	ServiceID           int     `json:"service_id" validate:"required"`
	SquareMeters        float64 `json:"square_meters" validate:"required,gt=0"`
	Address             string  `json:"address"`
	SpecialRequirements string  `json:"special_requirements"`
	PreferredDate       string  `json:"preferred_date"`
	ContactEmail        string  `json:"contact_email" validate:"required,email"`
	ContactName         string  `json:"contact_name" validate:"required"`
	ContactPhone        string  `json:"contact_phone"`
}

type QuoteResponse struct {
	ID                  int     `json:"id"`
	ServiceID           int     `json:"service_id"`
	ServiceName         string  `json:"service_name"`
	SquareMeters        float64 `json:"square_meters"`
	Address             string  `json:"address"`
	SpecialRequirements string  `json:"special_requirements"`
	PreferredDate       string  `json:"preferred_date"`
	ContactEmail        string  `json:"contact_email"`
	ContactName         string  `json:"contact_name"`
	ContactPhone        string  `json:"contact_phone"`
	EstimatedPrice      float64 `json:"estimated_price"`
	Status              string  `json:"status"`
	AdminNotes          string  `json:"admin_notes,omitempty"`
	CreatedAt           time.Time `json:"created_at"`
}

type Quote struct {
	ID                  int       `json:"id" db:"id"`
	ServiceID           int       `json:"service_id" db:"service_id"`
	SquareMeters        float64   `json:"square_meters" db:"square_meters"`
	Address             string    `json:"address" db:"address"`
	SpecialRequirements string    `json:"special_requirements" db:"special_requirements"`
	PreferredDate       string    `json:"preferred_date" db:"preferred_date"`
	ContactEmail        string    `json:"contact_email" db:"contact_email"`
	ContactName         string    `json:"contact_name" db:"contact_name"`
	ContactPhone        string    `json:"contact_phone" db:"contact_phone"`
	EstimatedPrice      float64   `json:"estimated_price" db:"estimated_price"`
	Status              string    `json:"status" db:"status"` // pending, sent, accepted, rejected
	AdminNotes          string    `json:"admin_notes" db:"admin_notes"`
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time `json:"updated_at" db:"updated_at"`
}