package handlers

import (
	"backend/helpers"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

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

	accessToken, accessPayload, err := user.NewUserToken(r.Config.JWT_SECRET, r.Config.JWT_EXP)
	if err != nil {
		return err
	}

	refreshToken, _, err := user.NewUserToken(r.Config.JWT_SECRET, r.Config.SESSION_EXP)
	if err != nil {
		return err
	}

	r.DB.UpdateUserRefreshTokenAndLastLoginTime(user.ID, refreshToken)
	log.Println("Saved Refresh Token in DB:", refreshToken)

	return c.JSON(http.StatusOK, echo.Map{
		"token":   accessToken,
		"payload": accessPayload,
	})
}
