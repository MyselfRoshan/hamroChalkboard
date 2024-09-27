package handlers

import (
	"backend/config"
	"backend/db/repository"
	"database/sql"
)

type Repository struct {
	Config *config.AppConfig
	DB     repository.DBRepo
}

// Repo is of type Repository and used by handlers to get access to global app config and datbase
var Repo *Repository

// NewRepo creates a new Repository
func NewRepo(c *config.AppConfig, dB *sql.DB) *Repository {
	return &Repository{
		Config: c,
		DB:     repository.NewPostgresRepo(dB, c),
	}
}

// Assign Repository to Repo for handler to access
func NewHandler(r *Repository) {
	Repo = r
}
