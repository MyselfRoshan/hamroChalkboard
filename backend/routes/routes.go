package routes

import (
	"backend/config"
	"backend/handlers"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Routes(cfg *config.AppConfig) *echo.Echo {
	mux := echo.New()

	// Middlewares
	mux.Use(middleware.Logger())
	mux.Use(middleware.Recover())
	mux.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://*", "https://*"},
		// AllowOrigins:     []string{"*"},
		AllowHeaders:     []string{echo.HeaderAccept, echo.HeaderContentType, echo.HeaderAuthorization, echo.HeaderXCSRFToken, echo.HeaderSetCookie, echo.HeaderCookie},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions, http.MethodHead},
		AllowCredentials: true,
	}))
	mux.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, `{"message": "Changing a type is the way to go is it not"}`)
	})
	mux.POST("/register", handlers.Repo.RegisterHandler)
	mux.POST("/login", handlers.Repo.LoginHandler)
	mux.POST("/refresh-token", handlers.RefreshTokenHandler)

	// Restricted Routes
	restricted := mux.Group("")
	// config := echojwt.Config{
	// 	NewClaimsFunc: func(c echo.Context) jwt.Claims {
	// 		return new(handlers.JWTUserClaims)
	// 	},
	// 	SigningKey: []byte(os.Getenv("JWT_SECRET")),
	// }
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(handlers.JWTUserClaims)
		},

		// func(c echo.Context) jwt.Claims {
		// 	return new(jwtCustomClaims)
		// },
		SigningKey: []byte(cfg.JWT_SECRET),
	}
	restricted.Use(echojwt.WithConfig(config))
	restricted.GET("/authenticated", handlers.RestrictedHandler)
	restricted.POST("/refresh-token", handlers.RefreshTokenHandler)
	restricted.GET("/refresh-token", handlers.RefreshTokenHandler)

	return mux
}
