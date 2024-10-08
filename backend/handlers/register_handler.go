package handlers

import (
	"backend/db/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

func (r *Repository) HandlePostRegister(c echo.Context) error {
	username := c.FormValue("username")
	email := c.FormValue("email")
	password := c.FormValue("password")

	// Hash the password before saving it to the database
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Panicln("Failed to hash password")
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"error": "Faild to create user",
		})
	}

	// Create a new user object
	user := &models.User{
		Username:  username,
		Email:     email,
		Password:  string(hashedPassword), // Store the hashed password
		Role:      models.USER,            // Assuming USER is a predefined role
		IsActive:  true,
		CreatedAt: time.Now(),
	}

	// Insert the user into the database
	err = r.DB.CreateUser(user)
	if err != nil {

		if pqErr, ok := err.(*pq.Error); ok {
			fmt.Println(pqErr.Code)
			if pqErr.Code == "23505" {
				return c.JSON(http.StatusConflict, echo.Map{
					"error": "User already exists",
				})
			}
			log.Println("Failed to register user:", err)
			return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
				"error": "Failed to register user",
			})
		}
	}

	log.Printf("Registered User %v\n", user)
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Registration successful",
		"name":    username,
		"email":   email,
	})
}
