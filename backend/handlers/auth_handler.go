package handlers

import (
	"net/http"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo"
)

//	func (h *Handler) Login(c echo.Context) error {
//		return c.String(http.StatusOK, "Login")
//	}
func RestrictedHandler(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*jwtCustomClaims)
	name := claims.Name
	return c.String(http.StatusOK, "Welcome "+name+"!")
}
