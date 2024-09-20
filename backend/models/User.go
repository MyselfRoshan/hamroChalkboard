package models

import (
	"database/sql"
	"time"
)

type Role int

const (
	USER Role = iota
	ADMIN
)

type User struct {
	ID          string       `json:"id"`
	Username    string       `json:"username"`
	Email       string       `json:"email"`
	Password    string       `json:"password"`
	Role        Role         `json:"role"`
	IsActive    bool         `json:"is_active"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
	LastLoginAt sql.NullTime `json:"last_login_at"`
}
