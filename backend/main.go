package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	fmt.Print("Hey")
	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, `{"message": "I am not saying hello world"}`)
	})
	e.Logger.Fatal(e.Start(":3333"))
}
