package handlers

import (
	"backend/db/models"
	"backend/helpers"
	"fmt"
	"log"
	"net/http"
	"os"
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

// func (r *Repository) LoginHandler(c echo.Context) error {
// func (r *Repository) LoginHandler(c echo.Context) error {
func (r *Repository) LoginHandler(c echo.Context) error {
	emailOrUsername := c.FormValue("email_or_username")
	password := c.FormValue("password")

	user, _ := r.DB.GetByEmailOrUsername(emailOrUsername)
	if user == nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{
			"error": "Invalid email or username",
		})
	}
	if !helpers.CheckPasswordHash(password, user.Password) {
		return c.JSON(http.StatusUnauthorized, echo.Map{
			"error": "Invalid password",
		})
	}

	// Create JWT claims
	// JWT_EXPIRATION := r.Config.JWT_EXP * time.Minute
	// For testing
	JWT_EXPIRATION := r.Config.JWT_EXP * time.Second
	fmt.Println(JWT_EXPIRATION)
	accessClaims := &JWTUserClaims{
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(JWT_EXPIRATION)),
		},
	}

	refreshClaims := &JWTUserClaims{
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
		},
	}

	// Generate Access Token
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	aT, err := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return err
	}
	fmt.Println(os.Getenv("JWT_SECRET"))
	// Generate Refresh Token
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	rT, err := refreshToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return err
	}

	r.DB.UpdateUserRefreshTokenAndLastLoginTime(user.ID, rT, time.Now())
	log.Println("Saved Refresh Token in DB:", rT)

	return c.JSON(http.StatusOK, echo.Map{
		"access_token": aT,
	})
}
