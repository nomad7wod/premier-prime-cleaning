package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"cleaning-app-backend/internal/config"
)

var DB *sql.DB

func Connect(cfg config.Config) {
	var err error

	DB, err = sql.Open("postgres", config.GetDSN(cfg))
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Printf("Failed to ping database: %v", err)
		return
	}

	log.Println("Connected to database successfully")
}
