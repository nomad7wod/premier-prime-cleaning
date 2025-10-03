package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"cleaning-app-backend/internal/config"
)

var jwtKey = []byte("my_secret_key") // This should be loaded from config in production

type Claims struct {
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID int, role string, config config.Config) (string, error) {
	expiry, err := time.ParseDuration(config.JWTExpiry)
	if err != nil {
		return "", err
	}

	expirationTime := time.Now().Add(expiry)
	claims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.JWTSecret))
}

func ValidateToken(tokenString string, config config.Config) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

func GenerateRefreshToken(userID int, config config.Config) (string, error) {
	// Refresh token has a longer expiry time
	expirationTime := time.Now().Add(7 * 24 * time.Hour) // 7 days
	claims := &Claims{
		UserID: userID,
		Role:   "", // We don't need role in refresh token, we'll get it from DB
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.JWTSecret))
}