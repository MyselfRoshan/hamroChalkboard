package models

import (
	"database/sql"
)

type User struct {
	ID          string       `json:"id"`
	Username    string       `json:"username"`
	Password    string       `json:"password"`
	Role        int          `json:"role"`
	IsActive    bool         `json:"is_active"`
	CreatedAt   sql.NullTime `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
	LastLoginAt sql.NullTime `json:"last_login_at"`
}
