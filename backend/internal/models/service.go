package models

import (
	"time"
)

type Service struct {
	ID          int     `json:"id" db:"id"`
	Name        string  `json:"name" db:"name" validate:"required"`
	Description string  `json:"description" db:"description"`
	BasePrice   float64 `json:"base_price" db:"base_price" validate:"required,gt=0"`
	Duration    float64 `json:"duration_hours" db:"duration_hours" validate:"required,gt=0"`
	ServiceType string  `json:"service_type" db:"service_type" validate:"required,oneof=residential commercial"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type ServiceRequest struct {
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description"`
	BasePrice   float64 `json:"base_price" validate:"required,gt=0"`
	Duration    float64 `json:"duration_hours" validate:"required,gt=0"`
	ServiceType string  `json:"service_type" validate:"required,oneof=residential commercial"`
}

type ServiceResponse struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	BasePrice   float64 `json:"base_price"`
	Duration    float64 `json:"duration_hours"`
	ServiceType string  `json:"service_type"`
	CreatedAt   time.Time `json:"created_at"`
}