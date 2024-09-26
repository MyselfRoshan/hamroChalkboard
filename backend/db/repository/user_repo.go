package repository

import (
	"backend/db/models"
	"database/sql"
	"log"
	"time"

	"github.com/google/uuid"
)

// UserRepository defines the interface for user-related operations.
type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserByID(id string) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserByUsername(username string) (*models.User, error)
	GetUserByUsernameOrEmail(emailOrUsername string) (*models.User, error)
	UpdateUser(user *models.User) error
	UpdateUserRefreshToken(username string, refreshToken string) error
	UpdateUserRefreshTokenAndLastLoginTime(id uuid.UUID, refreshToken string, lastLoginAt time.Time) error
	DeleteUser(id string) error
	GetAllUsers() ([]*models.User, error)
}

// CreateUser inserts a new user into the database.
func (r *postgresDBRepo) CreateUser(user *models.User) error {
	query := `INSERT INTO users (username, email, password, role, is_active, created_at, updated_at, refresh_token)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := r.DB.Exec(query, user.Username, user.Email, user.Password, user.Role, user.IsActive, user.CreatedAt, user.UpdatedAt, user.RefreshToken)
	if err != nil {

		log.Println("Error creating user:", err)
	}
	return err
}

// GetUserByID retrieves a user by their ID.
func (r *postgresDBRepo) GetUserByID(id string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, username, email, password, role, is_active, created_at, updated_at, last_login_at, refresh_token
			  FROM users WHERE id=$1`

	err := r.DB.QueryRow(query, id).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role, &user.IsActive, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt, &user.RefreshToken)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		log.Println("Error fetching user by ID:", err)
		return nil, err
	}
	return user, nil
}

// GetUserByEmail retrieves a user by their email.
func (r *postgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, username, email, password, role, is_active, created_at, updated_at, last_login_at, refresh_token
			  FROM users WHERE email=$1`

	err := r.DB.QueryRow(query, email).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role, &user.IsActive, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt, &user.RefreshToken)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		log.Println("Error fetching user by email:", err)
		return nil, err
	}
	return user, nil
}

// GetUserByEmail retrieves a user by their username.
func (r *postgresDBRepo) GetUserByUsername(username string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, username, email, password, role, is_active, created_at, updated_at, last_login_at, refresh_token
			  FROM users WHERE username=$1`

	err := r.DB.QueryRow(query, username).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role, &user.IsActive, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt, &user.RefreshToken)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		log.Println("Error fetching user by username:", err)
		return nil, err
	}
	return user, nil
}

// GetUserByUsernameOrEmail retrieves a user by their email or username.
func (r *postgresDBRepo) GetUserByUsernameOrEmail(emailOrUsername string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, username, email, password, role, is_active, created_at, updated_at, last_login_at, refresh_token
			  FROM users WHERE email=$1 OR username=$2 LIMIT 1`

	err := r.DB.QueryRow(query, emailOrUsername, emailOrUsername).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role, &user.IsActive, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt, &user.RefreshToken)
	if err == sql.ErrNoRows {
		return nil, nil // No user found
	} else if err != nil {
		log.Println("Error fetching user by email or username:", err)
		return nil, err
	}
	return user, nil
}

// UpdateUser updates an existing user in the database.
func (r *postgresDBRepo) UpdateUser(user *models.User) error {
	query := `UPDATE users SET username=$1, email=$2, password=$3, role=$4, is_active=$5, updated_at=$6, last_login_at=$7, refresh_token=$8 WHERE id=$9`

	_, err := r.DB.Exec(query, user.Username, user.Email, user.Password, user.Role, user.IsActive, user.UpdatedAt, user.LastLoginAt, user.RefreshToken, user.ID)
	if err != nil {
		log.Println("Error updating user:", err)
	}
	return err
}

// Update Refresh Token
func (r *postgresDBRepo) UpdateUserRefreshToken(username string, refreshToken string) error {
	query := `UPDATE users SET refresh_token=$1 WHERE username=$2`

	_, err := r.DB.Exec(query, refreshToken, username)
	if err != nil {
		log.Println("Error updating user refresh token:", err)
	}
	return err
}

// Update Refresh Token and Last Login Time
func (r *postgresDBRepo) UpdateUserRefreshTokenAndLastLoginTime(id uuid.UUID, refreshToken string, lastLoginAt time.Time) error {
	query := `UPDATE users SET refresh_token=$1, last_login_at=$2 WHERE id=$3`

	_, err := r.DB.Exec(query, refreshToken, lastLoginAt, id)
	if err != nil {
		log.Println("Error updating user refresh token and last login time:", err)
	}
	return err
}

// DeleteUser deletes a user from the database by ID.
func (r *postgresDBRepo) DeleteUser(id string) error {
	query := `DELETE FROM users WHERE id=$1`

	_, err := r.DB.Exec(query, id)
	if err != nil {
		log.Println("Error deleting user:", err)
	}
	return err
}

// GetAllUsers retrieves all users from the database.
func (r *postgresDBRepo) GetAllUsers() ([]*models.User, error) {
	query := `SELECT id, username, email, password, role, is_active, created_at, updated_at, last_login_at, refresh_token FROM users`
	rows, err := r.DB.Query(query)
	if err != nil {
		log.Println("Error fetching all users:", err)
		return nil, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		user := &models.User{}
		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role, &user.IsActive, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt, &user.RefreshToken); err != nil {
			log.Println("Error scanning user:", err)
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}
