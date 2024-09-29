package models

import (
	"time"

	"github.com/google/uuid"
)

type Room struct {
	ID           uuid.UUID     `db:"id" json:"id"`
	CreatorID    uuid.UUID     `db:"creator_id" json:"creator_id"`
	Name         string        `db:"name" json:"name"`
	IsActive     bool          `db:"is_active" json:"is_active"`
	CreatedAt    time.Time     `db:"created_at" json:"created_at"`
	UpdatedAt    NullTime      `db:"updated_at" json:"updated_at"`
	Participants []Participant `json:"participants"`
}

type Participant struct {
	ID       uuid.UUID  `db:"id" json:"id"`
	RoomID   uuid.UUID  `db:"room_id" json:"room_id"`
	UserID   uuid.UUID  `db:"user_id" json:"user_id"`
	JoinedAt time.Time  `db:"joined_at" json:"joined_at"`
	LeftAt   *time.Time `db:"left_at" json:"left_at,omitempty"`
}

// Response
type RoomResponse struct {
	ID           uuid.UUID             `json:"id"`
	Name         string                `json:"name"`
	Participants []ParticipantResponse `json:"participants"`
	CreatedAt    time.Time             `json:"created_at"`
	Creator      CreatorResponse       `json:"creator"`
}

type ParticipantResponse struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`   // This will be the username
	Avatar string    `json:"avatar"` // Placeholder for avatar URL
}

// CreatorResponse represents the creator details sent to the frontend.
type CreatorResponse struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`   // This will be the username
	Avatar string    `json:"avatar"` // Placeholder for avatar URL
}
