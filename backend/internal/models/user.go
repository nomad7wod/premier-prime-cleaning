package models

import (
	"time"
)

type User struct {
	ID        int       `json:"id" db:"id"`
	Email     string    `json:"email" db:"email" validate:"required,email"`
	Password  string    `json:"password,omitempty" db:"password" validate:"required,min=6"`
	FirstName string    `json:"first_name" db:"first_name" validate:"required"`
	LastName  string    `json:"last_name" db:"last_name" validate:"required"`
	Phone     string    `json:"phone" db:"phone"`
	Role      string    `json:"role" db:"role" validate:"required,oneof=client admin"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type UserRegisterRequest struct {
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=6"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Phone     string `json:"phone"`
}

type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserResponse struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}