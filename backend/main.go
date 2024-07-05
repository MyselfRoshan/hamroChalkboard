package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, `{"message": "Changing a type is the way to go is it not"}`)
	})
	e.Logger.Fatal(e.Start(":3333"))
}
