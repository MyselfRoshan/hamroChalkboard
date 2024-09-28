package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (r *Repository) NotFoundHandler(c echo.Context) error {
	return c.JSON(http.StatusNotFound, echo.Map{
		"message": "Page not found",
	})
}
