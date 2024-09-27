package services

import (
	"backend/db/models"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	secretKey string
}

// NewAuthService creates a new AuthService with the given secret key
func NewAuthService(secretKey string) *AuthService {
	return &AuthService{secretKey: secretKey}
}

// GenerateToken generates a new JWT token for a user
func (s *AuthService) GenerateToken(user *models.User) (string, error) {
	if user == nil {
		return "", errors.New("user cannot be nil")
	}

	claims := jwt.MapClaims{
		"sub":  user.ID,
		"exp":  time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
		"role": user.Role,                             // Assuming you have a Role field in your User model
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(s.secretKey))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// ValidateToken validates a JWT token and returns the claims if valid
func (s *AuthService) ValidateToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure that the token's signing method is what we expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.secretKey), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		return claims, nil
	}

	return nil, errors.New("could not parse claims")
}
