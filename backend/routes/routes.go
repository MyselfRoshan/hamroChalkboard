package routes

import (
	"backend/handlers"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Routes() *echo.Echo {
	mux := echo.New()

	// Middlewares
	mux.Use(middleware.Logger())
	// mux.Use(middleware.Recover())
	mux.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://*", "https://*"},
		AllowHeaders: []string{echo.HeaderAccept, echo.HeaderContentType, echo.HeaderAuthorization, echo.HeaderXCSRFToken},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions, http.MethodHead},
	}))
	mux.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, `{"message": "Changing a type is the way to go is it not"}`)
	})
	mux.POST("/register", handlers.RegisterHandler)
	mux.POST("/login", handlers.LoginHandler)

	// Restricted Routes
	restricted := mux.Group("/restricted")
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(handlers.JwtCustomClaims)
		},
		SigningKey: []byte(os.Getenv("SECRET_KEY")),
	}
	restricted.Use(echojwt.WithConfig(config))
	restricted.GET("", handlers.RestrictedHandler)

	return mux
}
