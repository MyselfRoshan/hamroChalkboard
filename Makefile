#!make

include .env

DB_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?sslmode=disable

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
.PHONY: build
build:
	docker compose build

.PHONY: logs
logs:
	docker compose logs -f

.PHONY: clean
clean:
	docker compose down -v --remove-orphans

.PHONY: frontend
frontend:
	cd ./frontend && pnpm dev

.PHONY: stop
stop:
	docker compose down

.PHONY: restartf
restartf: stop frontend

# BACKEND
.PHONY: api
api:
	cd ./backend && air

.PHONY: dbstart
dbstart:
	docker compose up hc_db hc_pgadmin -d

.PHONY: backend
backend: stop dbstart api

# Migrations
.PHONY: migrate
migrateUp:
	@migrate -path $(MIGRATION_PATH) -database $(DB_URL) -verbose up

.PHONY: migrateDown
migrateDown:
	@migrate -path $(MIGRATIONS_PATH) -database $(DB_URL) -verbose down

.PHONY: migrateForce
migrateForce:
	@migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" force $(filter-out $@,$(MAKECMDGOALS))

.PHONY: migration
migration:
	@migrate create -ext sql -dir $(MIGRATION_PATH) -seq $(filter-out $@,$(MAKECMDGOALS))