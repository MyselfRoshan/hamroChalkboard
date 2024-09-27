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
	JWT_SECRET  []byte
	JWT_EXP     time.Duration
	SESSION_EXP time.Duration
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
		DB_USER:     getStrEnv("DB_USER", "hc_db"),
		DB_PASSWORD: getStrEnv("DB_PASSWORD", "hc_db"),
		DB_HOST:     getStrEnv("DB_HOST", "localhost"),
		DB_PORT:     getStrEnv("DB_PORT", "5432"),
		DB_NAME:     getStrEnv("DB_NAME", "hc_db"),
		JWT_SECRET:  getByteArrayEnv("JWT_SECRET", "secret"),
		JWT_EXP:     getDurationEnv("JWT_EXPIRATION", 15, time.Minute),
		SESSION_EXP: getDurationEnv("SESSION_EXPIRATION", 30, 24*time.Hour),
	}
}

func getStrEnv(key string, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getByteArrayEnv(key string, fallback string) []byte {
	value := getStrEnv(key, fallback)
	return []byte(value)
}

// getDurationEnv retrieves a duration value from the environment variable with the given key.
//
// Parameters:
// - key: the key of the environment variable to retrieve.
// - fallback: the default value to use if the environment variable is not set.
// - in: the time.Duration to multiply the retrieved value by.
//
// Returns:
// - time.Duration: the retrieved duration value multiplied by the given time.Duration.
func getDurationEnv(key string, fallback int, in time.Duration) time.Duration {
	valueStr := getStrEnv(key, strconv.Itoa(fallback))
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		// Default to fallback in minutes
		log.Printf("\n%s: %s\n", key, time.Duration(fallback)*in)
		return time.Duration(fallback) * in
	}
	log.Printf("%s: %s\n", key, time.Duration(value)*in)
	// Return duration in minutes
	return time.Duration(value) * in
}
