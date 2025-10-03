package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"cleaning-app-backend/internal/models"
	"cleaning-app-backend/internal/services"
)

func GetServices(c *gin.Context) {
	serviceService := services.NewServiceService()
	services, err := serviceService.GetAllServices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve services"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"services": services})
}

func CreateService(c *gin.Context) {
	var req models.ServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	serviceService := services.NewServiceService()
	service, err := serviceService.CreateService(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create service"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"service": service})
}

func UpdateService(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid service ID"})
		return
	}

	var req models.ServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := &models.Service{
		Name:        req.Name,
		Description: req.Description,
		BasePrice:   req.BasePrice,
		Duration:    req.Duration,
		ServiceType: req.ServiceType,
	}

	serviceService := services.NewServiceService()
	err = serviceService.UpdateService(service, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update service"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Service updated successfully"})
}

func DeleteService(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid service ID"})
		return
	}

	serviceService := services.NewServiceService()
	err = serviceService.DeleteService(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete service"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Service deleted successfully"})
}