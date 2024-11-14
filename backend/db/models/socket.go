package models

// type Socket struct {
// 	UserID   string `json:"user_id"`
// 	RoomID   string `json:"room_id"`
// 	Username string `json:"username"`
// 	Avatar   string `json:"avatar"`
// }

// type SocketResponse struct {
// 	ID     string `json:"id"`
// 	Name   string `json:"name"`
// 	Avatar string `json:"avatar"`
// }

// type SocketMessage struct {
// 	RoomID   string `json:"room_id"`
// 	UserID   string `json:"user_id"`
// 	Username string `json:"username"`
// 	Content  string `json:"content"`
// }

// Stroke represents a single stroke in the drawing (can be a line or a curve)
type Stroke struct {
	X1, Y1, X2, Y2 float64 // Coordinates of the stroke
	Color          string  // Stroke color
	Width          float64 // Stroke width
}

// Drawing represents the entire drawing in memory
type Drawing struct {
	Strokes []Stroke `json:"strokes"`
}
