package handlers

import (
	"backend/services"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			return origin == "http://localhost:3000" || origin == "http://192.168.10.181:3000"
		},
	}
)

type Subscriber map[string]SubscriberData
type SubscriberData struct {
	Username   string `json:"username"`
	CursorData `json:"cursor"`
}
type CursorData struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (r *Repository) HandlePostSocket(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{})
}

// var manager = services.NewManager()

// func init() {
// 	go manager.Start() // Start the WebSocket manager
// }

// WebSocketHandler handles the WebSocket connections
// func (r *Repository) HandleGetSocket(c echo.Context) error {
// 	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
// 	if err != nil {
// 		return err
// 	}
// 	fmt.Println(c.Param("room-id"))
// 	client := &services.Client{
// 		Conn:     conn,
// 		Send:     make(chan []byte),
// 		Username: c.QueryParam("username"),
// 	}

// 	manager.Register <- client
// 	go client.Read(manager)
// 	go client.Write()

// 	return nil
// }

// func (r *Repository) HandleGetSocket(c echo.Context) error {
// 	// Upgrade the connection to WebSocket
// 	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
// 	if err != nil {
// 		return err
// 	}

// 	// Get the room ID from the URL parameters
// 	roomID := c.Param("room-id")
// 	fmt.Println("Room ID:", roomID)

// 	// Create a new client object
// 	client := &services.Client{
// 		Conn:     conn,
// 		Send:     make(chan []byte),
// 		Username: c.QueryParam("username"),
// 	}

// 	// Register the client for the room (handle room-based manager)
// 	if _, exists := manager.Rooms[roomID]; !exists {
// 		// If no room manager exists, create a new one
// 		manager.Rooms[roomID] = &services.RoomManager{
// 			Clients: make(map[*services.Client]bool),
// 			Register: make(chan *services.Client),
// 			Unregister: make(chan *services.Client),
// 		}
// 	}

// 	// Get the room manager for this room
// 	roomManager := manager.Rooms[roomID]

// 	// Register the client with the room manager
// 	roomManager.Register <- client

// 	// Start listening for incoming messages (from the client)
// 	go client.Read(roomManager)
// 	// Start sending messages to the client
// 	go client.Write()

// 	return nil
// }

func (r *Repository) HandleGetSocket(c echo.Context) error {
	// Upgrade the connection to WebSocket

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	// Get the room ID from the URL parameters
	roomID := c.Param("roomId")
	fmt.Println("Room ID:", roomID)

	// Create a new client object
	client := &services.Client{
		Conn:     conn,
		Send:     make(chan []byte),
		Username: c.QueryParam("username"),
	}

	// Get or create the manager for the specified room
	roomManager := services.GlobalRoomManager.GetOrCreateManager(roomID)

	// Register the client with the room's manager
	roomManager.Register <- client

	fmt.Println("roomManager", roomManager.Clients)

	// Start listening for incoming messages (from the client)
	go client.Read(roomManager)
	// Start sending messages to the client
	go client.Write()

	return nil
}
