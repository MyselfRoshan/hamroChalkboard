package services

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

var GlobalRoomManager = NewRoomManager()

type Client struct {
	Conn     *websocket.Conn
	Send     chan []byte
	Username string
}

type Manager struct {
	Clients      map[*Client]bool
	ClientsCount int
	Broadcast    chan []byte
	Register     chan *Client
	Unregister   chan *Client
	Mutex        sync.Mutex
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

		// Prepare message to broadcast (can add more details like username, etc.)
		broadcastMessage := make(map[string]interface{})
		broadcastMessage[client.Username] = message

		broadcastJSON, err := json.Marshal(broadcastMessage)
		if err != nil {
			log.Println("Error marshalling broadcast message:", err)
			continue
		}

		manager.Broadcast <- broadcastJSON
	}
}

func (client *Client) Write() {
	defer client.Conn.Close()
	for message := range client.Send {
		if err := client.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			break
		}
	}
}
