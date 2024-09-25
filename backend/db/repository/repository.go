package repository

import (
	"backend/config"
	"database/sql"
)

type DBRepo interface {
	UserRepository
}

type postgresDBRepo struct {
	Config *config.AppConfig
	DB     *sql.DB
}

func NewPostgresRepo(con *sql.DB, c *config.AppConfig) DBRepo {
	return &postgresDBRepo{
		Config: c,
		DB:     con,
	}
}
