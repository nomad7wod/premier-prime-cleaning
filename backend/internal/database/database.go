package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
	"cleaning-app-backend/internal/config"
)

var DB *sql.DB

func Connect(config config.Config) {
	var err error
	
	// Debug output
	fmt.Printf("Debug - DB Config: Host=%s, Port=%s, User=%s, DB=%s\n", 
		config.DBHost, config.DBPort, config.DBUser, config.DBName)
	
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.DBHost, config.DBPort, config.DBUser, config.DBPassword, config.DBName)
	
	fmt.Printf("Debug - DSN: %s\n", dsn)
	
	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Printf("Failed to ping database: %v", err)
		log.Printf("Will retry in 5 seconds...")
		time.Sleep(5 * time.Second)
		return
	}

	fmt.Println("Connected to database successfully")
}