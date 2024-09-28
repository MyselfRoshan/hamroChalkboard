package handlers

import (
	"backend/config"
	"backend/db"
	"backend/db/models"
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestLoginHandler(t *testing.T) {
	// Create a new echo instance
	e := echo.New()

	// Create a new repository instance

	cfg := config.LoadConfig()
	database := db.Connect(cfg)
	// r.Config=&cfg
	r := NewRepo(&cfg, database)

	// Create a new user instance
	user := &models.User{
		ID:       uuid.New(),
		Username: "testuser",
		Email:    "testuser@example.com",
		Password: "testpassword",
	}

	// Mock the database to return the user
	r.DB = &mockDB{
		GetUserByUsernameOrEmailFunc: func(emailOrUsername string) (*models.User, error) {
			return user, nil
		},
	}

	// Test invalid email or username
	req, err := http.NewRequest(echo.POST, "/login", bytes.NewBuffer([]byte(`{"email_or_username": "invalid", "password": "testpassword"}`)))
	assert.NoError(t, err)

	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	err = r.LoginHandler(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusUnauthorized, rec.Code)

	// Test invalid password
	req, err = http.NewRequest(echo.POST, "/login", bytes.NewBuffer([]byte(`{"email_or_username": "testuser", "password": "invalid"}`)))
	assert.NoError(t, err)

	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	err = r.LoginHandler(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusUnauthorized, rec.Code)

	// Test successful login with valid credentials
	req, err = http.NewRequest(echo.POST, "/login", bytes.NewBuffer([]byte(`{"email_or_username": "testuser", "password": "testpassword"}`)))
	assert.NoError(t, err)

	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	err = r.LoginHandler(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Test error when generating access token
	r.Config.JWT_SECRET = []byte("")
	req, err = http.NewRequest(echo.POST, "/login", bytes.NewBuffer([]byte(`{"email_or_username": "testuser", "password": "testpassword"}`)))
	assert.NoError(t, err)

	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	err = r.LoginHandler(c)
	assert.Error(t, err)

	// Test error when generating refresh token
	r.Config.JWT_SECRET = []byte("secret")
	r.Config.SESSION_EXP = 0
	req, err = http.NewRequest(echo.POST, "/login", bytes.NewBuffer([]byte(`{"email_or_username": "testuser", "password": "testpassword"}`)))
	assert.NoError(t, err)

	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	err = r.LoginHandler(c)
	assert.Error(t, err)

	// Test error when updating user refresh token and last login time
	r.Config.SESSION_EXP = 1
	r.DB = &mockDB{
		UpdateUserRefreshTokenAndLastLoginTimeFunc: func(id uuid.UUID, refreshToken string) error {
			return errors.New("test error")
		},
	}
	req, err = http.NewRequest(echo.POST, "/login", bytes.NewBuffer([]byte(`{"email_or_username": "testuser", "password": "testpassword"}`)))
	assert.NoError(t, err)

	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	err = r.LoginHandler(c)
	assert.Error(t, err)
}

type mockDB struct {
	GetUserByUsernameOrEmailFunc               func(emailOrUsername string) (*models.User, error)
	UpdateUserRefreshTokenAndLastLoginTimeFunc func(id uuid.UUID, refreshToken string) error
}

// CreateUser implements repository.DBRepo.
func (m *mockDB) CreateUser(user *models.User) error {
	panic("unimplemented")
}

// DeleteUser implements repository.DBRepo.
func (m *mockDB) DeleteUser(id string) error {
	panic("unimplemented")
}

// GetAllUsers implements repository.DBRepo.
func (m *mockDB) GetAllUsers() ([]*models.User, error) {
	panic("unimplemented")
}

// GetUserByEmail implements repository.DBRepo.
func (m *mockDB) GetUserByEmail(email string) (*models.User, error) {
	panic("unimplemented")
}

// GetUserByID implements repository.DBRepo.
func (m *mockDB) GetUserByID(id string) (*models.User, error) {
	panic("unimplemented")
}

// GetUserByUsername implements repository.DBRepo.
func (m *mockDB) GetUserByUsername(username string) (*models.User, error) {
	panic("unimplemented")
}

// UpdateUser implements repository.DBRepo.
func (m *mockDB) UpdateUser(user *models.User) error {
	panic("unimplemented")
}

// UpdateUserRefreshToken implements repository.DBRepo.
func (m *mockDB) UpdateUserRefreshToken(username string, refreshToken string) error {
	panic("unimplemented")
}

func (m *mockDB) GetUserByUsernameOrEmail(emailOrUsername string) (*models.User, error) {
	return m.GetUserByUsernameOrEmailFunc(emailOrUsername)
}

func (m *mockDB) UpdateUserRefreshTokenAndLastLoginTime(id uuid.UUID, refreshToken string) error {
	return m.UpdateUserRefreshTokenAndLastLoginTimeFunc(id, refreshToken)
}
