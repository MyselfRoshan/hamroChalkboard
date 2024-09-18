package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Routes() *echo.Echo {
	mux := echo.New()
	mux.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, `{"message": "Changing a type is the way to go is it not"}`)
	})

	return mux
}
