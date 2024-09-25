package db

import (
	"backend/config"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq" // PostgreSQL driver
)

type DB struct {
	Con *sql.DB
}

// Connect establishes a connection to the PostgreSQL database.
func Connect(config config.AppConfig) *sql.DB {
	conStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.DB_HOST, config.DB_PORT, config.DB_USER, config.DB_PASSWORD, config.DB_NAME)

	db, err := sql.Open("postgres", conStr)
	if err != nil {
		log.Fatalf("failed to connect to the database: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("failed to ping the database: %v", err)
	}

	log.Println("Connected to the database successfully!")
	return db
}
