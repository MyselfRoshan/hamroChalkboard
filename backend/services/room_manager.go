package services

import "sync"

// RoomManager is a manager that holds a map of clients for a particular room
type RoomManager struct {
	Managers map[string]*Manager // Map of roomID to Manager
	Mutex    sync.RWMutex
}

// NewRoomManager creates a new RoomManager instance
func NewRoomManager() *RoomManager {
	return &RoomManager{
		Managers: make(map[string]*Manager),
	}
}

// GetOrCreateManager retrieves the existing manager for a room, or creates a new one
func (rm *RoomManager) GetOrCreateManager(roomID string) *Manager {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	if manager, exists := rm.Managers[roomID]; exists {
		return manager
	}

	// Create a new manager for the room
	manager := NewManager()
	rm.Managers[roomID] = manager
	go manager.Start() // Start the room manager
	return manager
}
