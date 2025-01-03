package handlers

import (
	"backend/db/models"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
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
		"message": fmt.Sprintf("Room with name '%s' created successfully", name),
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

	// fmt.Println(rooms)
	return c.JSON(http.StatusOK, echo.Map{
		"rooms": rooms,
	})
}

func (r *Repository) HandleDeleteRoom(c echo.Context) error {
	id := c.Param("id")
	err := r.DB.DeleteRoom(id)
	if err != nil {
		log.Println("Failed to delete room:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to delete room",
		})
	}
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Room with id " + id + " deleted successfully",
	})
}

func (r *Repository) HandleUpdateRoom(c echo.Context) error {

	name := c.FormValue("new_name")
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Println("Failed to update room:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to update room",
		})
	}
	err = r.DB.UpdateRoom(&models.Room{
		ID:        id,
		Name:      name,
		IsActive:  true,
		UpdatedAt: models.NullTime{NullTime: sql.NullTime{Time: time.Now(), Valid: true}},
	})
	if err != nil {
		log.Println("Failed to update room:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Failed to update room",
		})
	}
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Room with id " + id.String() + " updated successfully",
		"name":    name,
	})
}

func (r *Repository) HandleCheckRoomExists(c echo.Context) error {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Println("Failed to check room exists:", err)
		return echo.NewHTTPError(http.StatusNotFound, echo.Map{
			"error": "Room not found",
		})
	}
	room, err := r.DB.GetRoomByID(id)
	if err != nil {
		log.Println("Failed to check room exists:", err)
		return echo.NewHTTPError(http.StatusInternalServerError, echo.Map{
			"error": "Room not found",
		})
	}
	if room == nil {
		return c.JSON(http.StatusNotFound, echo.Map{
			"error": "Room not found",
		})
	}
	return c.JSON(http.StatusOK, echo.Map{
		"exists": true,
	})
}
