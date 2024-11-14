package handlers

import (
	"backend/services"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			return origin == "http://localhost:3000" || origin == "http://192.168.30.210:3000"
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

// func (r *Repository) HandleGetSocket(c echo.Context) error {
// 	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
// 	if err != nil {
// 		return err
// 	}
// 	defer ws.Close()

// 	for {

// 		// Read
// 		// _, msg, err := ws.ReadJSON()
// 		// var msg interface{}
// 		var cursorData CursorData
// 		username := c.QueryParam("username")
// 		suscribers := make(Subscriber)
// 		err = ws.ReadJSON(&cursorData)
// 		suscribers[username] = SubscriberData{
// 			Username:   username,
// 			CursorData: cursorData,
// 		}
// 		if err != nil {
// 			c.Logger().Error(err)
// 		}
// 		// Write
// 		err := ws.WriteJSON(suscribers)
// 		if err != nil {
// 			c.Logger().Error(err)
// 		}
// 		fmt.Printf("%v\n", suscribers)
// 	}
// }

var manager = services.NewManager()

func init() {
	go manager.Start() // Start the WebSocket manager
}

// WebSocketHandler handles the WebSocket connections
func (r *Repository) HandleGetSocket(c echo.Context) error {
	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	client := &services.Client{
		Conn:     conn,
		Send:     make(chan []byte),
		Username: c.QueryParam("username"),
	}

	manager.Register <- client
	go client.Read(manager)
	go client.Write()

	return nil
}
