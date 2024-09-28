package handlers

import (
	"backend/db/models"
	"log"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func (r *Repository) LogoutHandler(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	user := token.Claims.(*models.UserClaims)

	// Delete refresh token
	log.Println("Deleting refresh token", token)
	r.DB.UpdateUserRefreshToken(user.Username, "")

	log.Printf("User %v logged out.\n", user.Username)
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Successfully logged out.",
	})
}
