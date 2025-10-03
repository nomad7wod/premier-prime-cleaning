package models

import (
	"time"
)

// Contact/Message system for questions and inquiries
type ContactMessage struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Email       string    `json:"email" db:"email"`
	Phone       string    `json:"phone" db:"phone"`
	Subject     string    `json:"subject" db:"subject"`
	Message     string    `json:"message" db:"message"`
	Status      string    `json:"status" db:"status"` // new, read, replied, closed
	Priority    string    `json:"priority" db:"priority"` // low, medium, high, urgent
	Category    string    `json:"category" db:"category"` // general, booking, complaint, compliment, other
	AdminNotes  string    `json:"admin_notes" db:"admin_notes"`
	AssignedTo  *int      `json:"assigned_to" db:"assigned_to"` // admin user ID
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type ContactMessageRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone"`
	Subject  string `json:"subject" validate:"required"`
	Message  string `json:"message" validate:"required"`
	Category string `json:"category" validate:"required,oneof=general booking complaint compliment other"`
}

type ContactMessageResponse struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	Email      string    `json:"email"`
	Phone      string    `json:"phone"`
	Subject    string    `json:"subject"`
	Message    string    `json:"message"`
	Status     string    `json:"status"`
	Priority   string    `json:"priority"`
	Category   string    `json:"category"`
	AdminNotes string    `json:"admin_notes,omitempty"`
	AssignedTo *int      `json:"assigned_to,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type ContactMessageUpdate struct {
	Status     string `json:"status" validate:"oneof=new read replied closed"`
	Priority   string `json:"priority" validate:"oneof=low medium high urgent"`
	AdminNotes string `json:"admin_notes"`
	AssignedTo *int   `json:"assigned_to"`
}

// FAQ System
type FAQ struct {
	ID          int       `json:"id" db:"id"`
	Question    string    `json:"question" db:"question"`
	Answer      string    `json:"answer" db:"answer"`
	Category    string    `json:"category" db:"category"`
	IsActive    bool      `json:"is_active" db:"is_active"`
	DisplayOrder int      `json:"display_order" db:"display_order"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type FAQRequest struct {
	Question     string `json:"question" validate:"required"`
	Answer       string `json:"answer" validate:"required"`
	Category     string `json:"category" validate:"required"`
	DisplayOrder int    `json:"display_order"`
}

type FAQResponse struct {
	ID          int    `json:"id"`
	Question    string `json:"question"`
	Answer      string `json:"answer"`
	Category    string `json:"category"`
	IsActive    bool   `json:"is_active"`
	DisplayOrder int   `json:"display_order"`
}