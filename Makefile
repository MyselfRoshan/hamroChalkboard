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

frontend:
	docker compose up --watch frontend

stop:
	docker compose down

restartf: stop frontend

# BACKEND
api:
	cd ./backend && ./air

dbstart:
	docker compose up hc_db hc_pgadmin -d

backend: dbstart api