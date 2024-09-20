package main

import (
	"backend/routes"

	"github.com/joho/godotenv"
)

func main() {
	// load .env file
	if err := godotenv.Load("../.env"); err != nil {
		panic(err)
	}

	router := routes.Routes()
	router.Logger.Fatal(router.Start(":3333"))
}
