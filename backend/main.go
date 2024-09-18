package main

import (
	"backend/routes"
)

func main() {

	router := routes.Routes()
	router.Logger.Fatal(router.Start(":3333"))
}
