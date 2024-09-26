package handlers

import (
	"backend/db/models"
	"backend/helpers"
	"log"
	"net/http"
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

	user, _ := r.DB.GetUserByUsernameOrEmail(emailOrUsername)
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
	accessClaims := &JWTUserClaims{
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(r.Config.JWT_EXP)),
		},
	}

	refreshClaims := &JWTUserClaims{
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			// ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute)),
		},
	}

	// Generate Access Token
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	aT, err := accessToken.SignedString(r.Config.JWT_SECRET)
	if err != nil {
		return err
	}
	// Generate Refresh Token
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	rT, err := refreshToken.SignedString(r.Config.JWT_SECRET)
	if err != nil {
		return err
	}

	r.DB.UpdateUserRefreshTokenAndLastLoginTime(user.ID, rT, time.Now())
	log.Println("Saved Refresh Token in DB:", rT)

	return c.JSON(http.StatusOK, echo.Map{
		"access_token": aT,
	})
}
