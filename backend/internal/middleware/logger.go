package middleware

import (
	"os"

	"github.com/gin-gonic/gin"
)

func RequestLogger() gin.HandlerFunc {
	logPath := os.Getenv("LOG_FILE")
	if logPath == "" {
		return gin.Logger()
	}
	f, err := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o640)
	if err != nil {
		return gin.Logger()
	}
	return gin.LoggerWithWriter(f)
}
