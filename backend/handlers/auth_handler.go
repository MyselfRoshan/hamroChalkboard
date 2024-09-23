package handlers

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

//	func (h *Handler) Login(c echo.Context) error {
//		return c.String(http.StatusOK, "Login")
//	}
func RestrictedHandler(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTUserClaims)
	// name := claims.Name
	return c.JSON(http.StatusOK, claims)
	// return c.String(http.StatusOK, "Welcome "+name+"!")
}
