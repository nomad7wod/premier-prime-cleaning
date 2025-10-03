package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"cleaning-app-backend/internal/config"
	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/services"
	"cleaning-app-backend/internal/utils"
)

func Register(c *gin.Context) {
	var req models.UserRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userService := services.NewUserService()
	user, err := userService.Register(&req)
	if err != nil {
		if err.Error() == "user with this email already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	// Generate tokens
	config, err := config.LoadConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load config"})
		return
	}
	
	accessToken, err := utils.GenerateToken(user.ID, user.Role, config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user":          user,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func Login(c *gin.Context) {
	var req models.UserLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userService := services.NewUserService()
	user, err := userService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate tokens
	config, err := config.LoadConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load config"})
		return
	}
	
	accessToken, err := utils.GenerateToken(user.ID, user.Role, config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":          user,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func RefreshToken(c *gin.Context) {
	// Note: In a real application, you would store refresh tokens in a secure store
	// and implement proper refresh token rotation
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Refresh token functionality not fully implemented in this example"})
}

func GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	userService := services.NewUserService()
	user, err := userService.GetProfile(userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}