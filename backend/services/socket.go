package services

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn     *websocket.Conn
	Send     chan []byte
	Username string
}

type Manager struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	Mutex      sync.Mutex
}

func NewManager() *Manager {
	return &Manager{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
	}
}

func (manager *Manager) Start() {
	for {
		select {
		case client := <-manager.Register:
			manager.Mutex.Lock()
			manager.Clients[client] = true
			manager.Mutex.Unlock()
		case client := <-manager.Unregister:
			manager.Mutex.Lock()
			if _, ok := manager.Clients[client]; ok {
				delete(manager.Clients, client)
				close(client.Send)
			}
			manager.Mutex.Unlock()
		case message := <-manager.Broadcast:
			manager.Mutex.Lock()
			for client := range manager.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(manager.Clients, client)
				}
			}
			manager.Mutex.Unlock()
		}
	}
}

func (client *Client) Read(manager *Manager) {
	defer func() {
		manager.Unregister <- client
		client.Conn.Close()
	}()
	for {
		var message interface{}
		err := client.Conn.ReadJSON(&message)
		if err != nil {
			break
		}
		// Include the username in the message before broadcasting it
		// broadcastMessage := map[string]interface{}{
		// 	"username": client.Username, // Add the username to the message
		// 	"data":     message,         // Keep the drawing data as-is
		// }
		broadcastMessage := make(map[string]interface{})
		broadcastMessage[client.Username] = message
		// broadcastMessage["username"]["data"]=message
		broadcastJSON, err := json.Marshal(broadcastMessage)
		if err != nil {
			log.Println("Error marshalling broadcast message:", err)
			continue
		}

		// Broadcast the message to all connected clients
		manager.Broadcast <- broadcastJSON
	}
}

// Write writes incoming messages to the client's websocket connection.
func (client *Client) Write() {
	defer client.Conn.Close()
	for message := range client.Send {
		if err := client.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			break
		}
	}
}
