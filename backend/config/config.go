package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// AppConfig holds the configuration for the application.
type AppConfig struct {
	DB_USER     string
	DB_PASSWORD string
	DB_HOST     string
	DB_PORT     string
	DB_NAME     string
	JWT_SECRET  string
	JWT_EXP     time.Duration
}

// LoadConfig loads configuration from environment variables or defaults.
func LoadConfig() AppConfig {
	// load .env file
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatalf("failed to loaed .env file")
		panic(err)
	}
	log.Println("Loaded .env file successfully!")

	return AppConfig{
		DB_USER:     getEnv("DB_USER", "hc_db"),
		DB_PASSWORD: getEnv("DB_PASSWORD", "hc_db"),
		DB_HOST:     getEnv("DB_HOST", "localhost"),
		DB_PORT:     getEnv("DB_PORT", "5432"),
		DB_NAME:     getEnv("DB_NAME", "hc_db"),
		JWT_SECRET:  getEnv("JWT_SECRET", "secret"),
		JWT_EXP:     getJWTExpiration("JWT_EXPIRATION", 15),
	}
}

func getEnv(key string, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getJWTExpiration(key string, fallback int) time.Duration {
	valueStr := getEnv(key, strconv.Itoa(fallback))
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return time.Duration(fallback) * time.Minute // Default to fallback in minutes
	}
	return time.Duration(value) * time.Minute // Return duration in minutes
}
