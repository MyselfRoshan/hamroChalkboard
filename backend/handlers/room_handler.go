package handlers

import (
	"backend/db/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func (r *Repository) HandlePostRoom(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	user := token.Claims.(*models.UserClaims)
	creator, err := r.DB.GetUserByUsername(user.Username)
	if err != nil {
		log.Panicln("Failed to get user:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to create room",
		})
	}

	name := c.FormValue("name")
	room := &models.Room{
		CreatorID: creator.ID,
		Name:      name,
		IsActive:  true,
		CreatedAt: time.Now(),
	}

	err = r.DB.CreateRoom(room)
	if err != nil {
		log.Println("Failed to register user:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to create room",
		})

	}
	fmt.Println("name", name)
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Room with name " + name + " created successfully",
	})
}

func (r *Repository) HandleGetRooms(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	user := token.Claims.(*models.UserClaims)
	creator, err := r.DB.GetUserByUsername(user.Username)
	if err != nil {
		log.Println("Failed to get rooms:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to fetch rooms",
		})
	}
	rooms, err := r.DB.GetRoomsByCreatorID(creator.ID)
	if err != nil {
		log.Println("Failed to get rooms:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to fetch rooms",
		})
	}

	fmt.Println(rooms)
	return c.JSON(http.StatusOK, echo.Map{
		"rooms": rooms,
	})
}

func (r *Repository) HandleDeleteRoom(c echo.Context) error {
	id := c.Param("id")
	if err := r.DB.DeleteRoom(id); err != nil {
		log.Println("Failed to delete room:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to delete room",
		})
	}
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Room with id " + id + " deleted successfully",
	})
}
