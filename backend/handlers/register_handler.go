package handlers

import (
	"backend/models"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func RegisterHandler(c echo.Context) error {
	name := c.FormValue("name")
	email := c.FormValue("email")

	fmt.Println(name, email)
	user := &models.User{
		Username:    c.FormValue("name"),
		Email:       c.FormValue("email"),
		Password:    c.FormValue("password"),
		Role:        models.USER,
		IsActive:    true,
		CreatedAt:   time.Now(),
		UpdatedAt:   sql.NullTime{},
		LastLoginAt: sql.NullTime{},
	}
	log.Println("Registered User", user)
	// For demonstration, we just send a response back
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Registration successful",
		"name":    name,
		"email":   email,
	})
}
