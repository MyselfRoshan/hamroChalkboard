#!make

include .env

DB_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?sslmode=disable

.PHONY: help build logs frontend stop restartf api dbstart backend

help:
	@echo "Available targets:"
	@echo "  build       - Build Docker containers"
	@echo "  frontend    - Start Frontend"
	@echo "  stop        - Stop Docker containers"
	@echo "  restartf    - Restart Frontend and Database"
	@echo "  logs        - View Docker container logs"
	@echo "  clean       - Remove Docker containers and volumes"
	@echo "  dbstart     - Start Database and pgAdmin containers"
	@echo "  api         - Run API (assuming 'air' command in backend folder)"
	@echo "  backend     - Start Database and Run API"

# FRONTEND
build:
	docker compose build

logs:
	docker compose logs -f

clean:
	docker compose down -v --remove-orphans

# frontend:
# 	docker compose up --watch frontend
frontend:
	cd ./frontend && pnpm dev

stop:
	docker compose down

restartf: stop frontend

# BACKEND
api:
	cd ./backend && air

dbstart:
	docker compose up hc_db hc_pgadmin -d

backend: dbstart api

# Migrations
migrateUp:
	migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" -verbose up

migrateDown:
	migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" -verbose down

migrateForce:
	migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" force $(version)

migrateCreate:
	migrate create -ext sql -dir "${MIGRATION_PATH}" -seq $(fileName)