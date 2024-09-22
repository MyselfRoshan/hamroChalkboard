package handlers

import (
	"backend/models"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type JwtCustomClaims struct {
	Name string      `json:"name"`
	Role models.Role `json:"role"`
	jwt.RegisteredClaims
}

// Valid implements jwt.Claims.
func (j *JwtCustomClaims) Valid() error {
	panic("unimplemented")
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
		JWT_EXPIRATION = 72
	}
	JWT_EXPIRATION_HOURS := time.Duration(JWT_EXPIRATION) * time.Millisecond
	// fmt.Println(JWT_EXPIRATION_HOURS)
	claims := &JwtCustomClaims{
		"test",
		models.USER,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(JWT_EXPIRATION_HOURS)),
		},
	}

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
