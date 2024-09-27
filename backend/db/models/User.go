package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Role int

const (
	USER Role = iota
	ADMIN
)

type NullTime struct {
	sql.NullTime
}

// MarshalJSON handles the JSON serialization of sql.NullTime.
func (nt NullTime) MarshalJSON() ([]byte, error) {
	if nt.Valid {
		return json.Marshal(nt.Time)
	}
	return json.Marshal(nil)
}

type User struct {
	ID           uuid.UUID `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	Email        string    `json:"email" db:"email"`
	Password     string    `json:"password" db:"password"`
	Role         Role      `json:"role" db:"role"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    NullTime  `json:"updated_at" db:"updated_at"`
	LastLoginAt  NullTime  `json:"last_login_at" db:"last_login_at"`
	RefreshToken string    `json:"refresh_token" db:"refresh_token"`
}
