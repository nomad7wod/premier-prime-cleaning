package middleware

import (
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func LoggerToFile() gin.HandlerFunc {
	// Set up logger to write to a file
	logPath := "/root/logs/server.log"
	// For local development, use current directory if logs folder doesn't exist
	if _, err := os.Stat("/root/logs"); os.IsNotExist(err) {
		logPath = "server.log"
	}
	
	file, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Error().Err(err).Msg("Failed to open log file")
	}

	zerolog.SetGlobalLevel(zerolog.InfoLevel)
	log.Logger = log.Output(file)

	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		end := time.Now()

		log.Info().
			Str("method", c.Request.Method).
			Str("path", c.Request.URL.Path).
			Int("status", c.Writer.Status()).
			Str("client_ip", c.ClientIP()).
			Dur("latency", end.Sub(start)).
			Msg("Request completed")
	}
}