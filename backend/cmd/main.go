package main

import (
	"cleaning-app-backend/internal/config"
	"cleaning-app-backend/internal/database"
	"cleaning-app-backend/internal/handlers"
	"cleaning-app-backend/internal/middleware"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Debug configuration
	log.Printf("Config loaded - Port: %s, DB Host: %s, DB Port: %s", config.ServerPort, config.DBHost, config.DBPort)

	// Connect to database with retry logic
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		database.Connect(config)
		if database.DB != nil {
			// Test the connection
			err := database.DB.Ping()
			if err == nil {
				log.Println("Database connection established successfully!")
				break
			}
		}
		
		if i == maxRetries-1 {
			log.Fatal("Failed to connect to database after maximum retries")
		}
		
		log.Printf("Database connection attempt %d/%d failed, retrying in 5 seconds...", i+1, maxRetries)
		time.Sleep(5 * time.Second)
	}

	// Set up Gin router
	r := gin.Default()

	// Middleware
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.LoggerToFile())

	// Public routes
	public := r.Group("/api")
	{
		// Authentication
		public.POST("/auth/register", handlers.Register)
		public.POST("/auth/login", handlers.Login)
		public.POST("/auth/refresh", handlers.RefreshToken)
		
		// Public services (no auth required)
		public.GET("/services", handlers.GetServices)
		
		// Guest booking and quotes (no auth required)
		public.POST("/guest/booking", handlers.CreateGuestBooking)
		public.GET("/guest/booking/:id", handlers.GetGuestBooking)
		public.POST("/quote", handlers.RequestQuote)
		public.GET("/quote/estimate", handlers.GetQuoteEstimate)
		
		// Contact and support (no auth required)
		public.POST("/contact", handlers.SubmitContactMessage)
		public.GET("/faq", handlers.GetFAQs)
		
		// Available slots for booking (no auth required)
		public.GET("/available-slots", handlers.GetAvailableSlots)
	}

	// Protected routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// User routes
		protected.GET("/auth/me", handlers.GetProfile)

		// Service routes (authenticated users can view, only admins can modify)
		protected.POST("/services", middleware.AdminMiddleware(), handlers.CreateService)
		protected.PUT("/services/:id", middleware.AdminMiddleware(), handlers.UpdateService)
		protected.DELETE("/services/:id", middleware.AdminMiddleware(), handlers.DeleteService)

		// Booking routes (authenticated users)
		protected.GET("/bookings", handlers.GetBookings)
		protected.GET("/bookings/:id", handlers.GetBooking)
		protected.POST("/bookings", handlers.CreateBooking)
		protected.PUT("/bookings/:id", handlers.UpdateBooking)
		protected.DELETE("/bookings/:id", handlers.CancelBooking)

		// Admin routes
		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			// Booking management
			admin.GET("/bookings", handlers.GetAllBookings)
			admin.PUT("/bookings/:id", handlers.AdminUpdateBooking)
			admin.PUT("/bookings/:id/reschedule", handlers.RescheduleBooking)
			
			// Calendar and scheduling
			admin.GET("/calendar/events", handlers.GetCalendarEvents)
			admin.GET("/calendar/day/:date", handlers.GetDaySchedule)
			admin.GET("/calendar/stats", handlers.GetBookingStats)
			
			// Quote management
			admin.GET("/quotes", handlers.GetQuotes)
			admin.PUT("/quotes/:id", handlers.UpdateQuote)
			
			// Contact message management
			admin.GET("/messages", handlers.GetContactMessages)
			admin.PUT("/messages/:id", handlers.UpdateContactMessage)
			
			// FAQ management
			admin.POST("/faq", handlers.CreateFAQ)
			admin.PUT("/faq/:id", handlers.UpdateFAQ)
			admin.DELETE("/faq/:id", handlers.DeleteFAQ)
			
			// Invoice management (fixed)
			admin.GET("/invoices", handlers.SimpleGetAllInvoices)
			admin.GET("/invoices/:id", handlers.SimpleGetInvoice)
			admin.POST("/invoices", handlers.CreateInvoice)
			admin.POST("/invoices/from-booking/:booking_id", handlers.SimpleGenerateInvoiceFromBooking)
			admin.POST("/invoices/custom", handlers.SimpleCreateCustomInvoice)
			admin.PUT("/invoices/:id", handlers.UpdateInvoice)
			admin.PUT("/invoices/:id/mark-paid", handlers.SimpleMarkAsPaid)
			admin.DELETE("/invoices/:id", handlers.SimpleDeleteInvoice)
			admin.GET("/invoices/date-range", handlers.SimpleGetInvoicesByDateRange)
			
			// Reports and Analytics
			admin.GET("/reports", handlers.SimpleGetReportsData)
		}
	}

	// Start server
	log.Println("Server starting on port", config.ServerPort)
	r.Run(":" + config.ServerPort)
}
