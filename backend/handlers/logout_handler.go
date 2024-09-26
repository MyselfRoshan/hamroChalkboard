package handlers

import (
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

func (r *Repository) LogoutHandler(c echo.Context) error {
	body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"error": "Failed to read request body",
		})
	}

	// Convert the byte slice to a string
	username := string(body)
	r.DB.UpdateUserRefreshToken(username, "")
	// fmt.Println("username:", username)

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Logout successfully",
	})
}
