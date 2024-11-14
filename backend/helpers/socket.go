package helpers

import (
	"context"
	"encoding/json"
	"log"

	"github.com/coder/websocket"
	"github.com/coder/websocket/wsjson"
)

var Connections = make(map[string]*websocket.Conn)
var Users = make(map[string]*User)

type User struct {
	Username string
	State    map[string]interface{}
}

func HandleMessage(ctx context.Context, msg map[string]interface{}, userUUID string) {
	user := Users[userUUID]
	user.State = msg
	broadcast(ctx)

	log.Printf("%s updated their state: %v\n", user.Username, user.State)
}

func HandleClose(ctx context.Context, userUUID string) {
	user := Users[userUUID]
	log.Printf("%s disconnected\n", user.Username)
	delete(Connections, userUUID)
	delete(Users, userUUID)
	broadcast(ctx)
}

func broadcast(ctx context.Context) {
	for _, conn := range Connections {
		message, err := json.Marshal(Users)
		if err != nil {
			log.Println("Error marshalling users:", err)
			continue
		}
		wsjson.Write(ctx, conn, message)
	}
}

// func wsHandler(c echo.Context) error {
// 	username := c.QueryParam("username")
// 	if username == "" {
// 		return c.String(http.StatusBadRequest, "Username is required")
// 	}

// 	conn, err := websocket.Accept(c.Response(), c.Request(), &websocket.AcceptOptions{
// 		OriginPatterns: []string{"localhost:3000"},
// 	})
// 	if err != nil {
// 		log.Println("Error accepting WebSocket connection:", err)
// 		return err
// 	}

// 	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
// 	defer cancel()
// 	userUUID := uuid.New().String()
// 	connections[userUUID] = conn
// 	Users[userUUID] = &User{
// 		Username: username,
// 		State:    make(map[string]interface{}),
// 	}

// 	log.Printf("%s connected\n", username)

// 	// Handle incoming messages from the client
// 	var msg map[string]interface{}
// 	go func() {
// 		for {
// 			err := wsjson.Read(ctx, conn, &msg)
// 			if err != nil {
// 				log.Println("Error reading message:", err)
// 				handleClose(ctx, userUUID)
// 				return
// 			}
// 			handleMessage(ctx, msg, userUUID)
// 		}
// 	}()

// 	// conn.cl

// 	// // Handle connection closure
// 	// conn.SetCloseHandler(func(code int, text string) error {
// handleClose(userUUID)
// 	// 	return nil
// 	// })

// 	return nil
// }
