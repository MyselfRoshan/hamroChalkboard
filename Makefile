.PHONY: help build start stop restart logs clean

help:
	@echo "Available targets:"
	@echo "  build                  - Build Docker containers"
	@echo "  start                  - Start Docker containers"
	@echo "  start_with_logs        - Start Docker containers"
	@echo "  stop                   - Stop Docker containers"
	@echo "  restart                - Restart Docker containers"
	@echo "  logs                   - View Docker container logs"
	@echo "  clean                  - Remove Docker containers and volumes"

build:
	docker compose build

start:
	docker compose watch

start_with_logs:
	docker compose up --watch

stop:
	docker compose down

restart: stop start

logs:
	docker compose logs -f

clean:
	docker compose down -v --remove-orphans

api_start:
	cd ./backend/bin && ./air

start_with_api: alacritty -e start api_start
