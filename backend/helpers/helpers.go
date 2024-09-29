package helpers

import (
	"backend/config"
	"backend/db/models"
	"errors"
	"log"

	"github.com/golang-jwt/jwt/v5"
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

func IsValidToken(tokenString string, signingKey interface{}) bool {
	claims := &models.UserClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token method is valid
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Println("Unexpected signing method")
			return nil, errors.New("unexpected signing method")
		}
		return signingKey, nil
	})
	log.Println("Refresh token details in invalid function", token, err)
	return token.Valid && err == nil && token != nil
}
