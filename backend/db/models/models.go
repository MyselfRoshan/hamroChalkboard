package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/golang-jwt/jwt/v5"
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

type UserClaims struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     Role   `json:"role"`
	jwt.RegisteredClaims
}

func NewUserClaims(u User, expiresAt time.Duration) *UserClaims {
	return &UserClaims{
		Username: u.Username,
		Email:    u.Email,
		Role:     u.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiresAt)),
		},
	}
}
func (u *User) NewUserToken(secret []byte, expiresAt time.Duration) (token string, payload *UserClaims, err error) {
	payload = NewUserClaims(*u, expiresAt)
	var jwtToken *jwt.Token = jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
	tokenStr, err := jwtToken.SignedString(secret)
	return tokenStr, payload, err
}
