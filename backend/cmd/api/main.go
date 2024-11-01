package main

import (
	"backend/config"
	"backend/db"
	"backend/handlers"
	"backend/helpers"
	"backend/routes"
)

func main() {
	cfg := config.LoadConfig()

	// Connect to the database
	database := db.Connect(cfg)

	// Run migrations
	db.Migrate(database)

	// Initialize handlers
	repo := handlers.NewRepo(&cfg, database)
	handlers.NewHandler(repo)

	// Initialize helper functions
	helpers.NewHelpers(&cfg)

	// Start server
	router := routes.Routes(&cfg)
	router.Logger.Fatal(router.Start(":3333"))
}
