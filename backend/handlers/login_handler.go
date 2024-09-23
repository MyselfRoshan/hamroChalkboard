package handlers

import (
	"backend/models"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type JWTUserClaims struct {
	ID       int         `json:"id"`
	Username string      `json:"username"`
	Email    string      `json:"email"`
	Role     models.Role `json:"role"`
	jwt.RegisteredClaims
}

func LoginHandler(c echo.Context) error {
	emailOrUsername := c.FormValue("email_or_username")
	password := c.FormValue("password")

	if emailOrUsername != "test" || password != "test" {
		return echo.ErrUnauthorized
	}
	JWT_EXPIRATION, err := strconv.Atoi(os.Getenv("JWT_EXPIRATION"))
	if err != nil {
		log.Println("JWT_EXPIRATION is not a valid number; defaulting to 72 hours.")
		JWT_EXPIRATION = 48
	}
	// JWT_EXPIRATION_HOURS := time.Duration(JWT_EXPIRATION) * time.Millisecond
	JWT_EXPIRATION_HOURS := time.Duration(JWT_EXPIRATION) * time.Millisecond
	// fmt.Println(JWT_EXPIRATION_HOURS)
	claims := &JWTUserClaims{
		// ID:       1,
		Username: "test",
		Email:    "test@test.com",
		Role:     1,
		//  jwt.RegisteredClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(JWT_EXPIRATION_HOURS)),
		},
		// },
	}
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		log.Fatalf("failed to generate secret: %v", err)
	}

	// Encode in base64
	base64Secret := base64.RawURLEncoding.EncodeToString(secret)
	fmt.Println("Base64 Encoded Secret:", base64Secret)

	// Encode in hexadecimal
	hexSecret := hex.EncodeToString(secret)
	fmt.Println("Hex Encoded Secret:", hexSecret)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	fmt.Println(os.Getenv("SECRET_KEY"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}
