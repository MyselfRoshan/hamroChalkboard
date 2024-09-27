package helpers

import (
	"backend/config"

	"golang.org/x/crypto/bcrypt"
)

var app *config.AppConfig

// NewHelpers sets up access to gloabal app config
func NewHelpers(a *config.AppConfig) {
	app = a
}

func HashedPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func CheckPasswordHash(password, hashPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashPassword), []byte(password))
	return err == nil
}
