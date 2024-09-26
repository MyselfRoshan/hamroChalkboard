package routes

import (
	"backend/config"
	"backend/handlers"
	"net/http"

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
		// AllowOrigins: []string{"http://localhost:3000", "http://*", "https://*"},
		AllowOrigins:     []string{"*"},
		AllowHeaders:     []string{echo.HeaderAccept, echo.HeaderContentType, echo.HeaderAuthorization, echo.HeaderXCSRFToken, echo.HeaderSetCookie, echo.HeaderCookie},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions, http.MethodHead},
		AllowCredentials: true,
	}))
	mux.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, `{"message": "Changing a type is the way to go is it not"}`)
	})
	mux.POST("/register", handlers.Repo.RegisterHandler)
	mux.POST("/login", handlers.Repo.LoginHandler)
	mux.DELETE("/logout", handlers.Repo.LogoutHandler)

	// Restricted Routes
	restricted := mux.Group("")
	config := echojwt.Config{
		NewClaimsFunc: handlers.Repo.NewClaimsFunc,
		SigningKey:    cfg.JWT_SECRET,
		ErrorHandler:  handlers.Repo.JWTErrorHandler,
	}
	restricted.Use(echojwt.WithConfig(config))
	// restricted.Use(echojwt.WithConfig(handlers.NewJWTConfig(cfg)))
	restricted.POST("/access-token", handlers.Repo.AccessTokenHandler)
	// mux.POST("/refresh-token", handlers.Repo.RefreshTokenHandler)
	// restricted.POST("/refresh-token", handlers.RefreshTokenHandler)
	// restricted.GET("/refresh-token", handlers.RefreshTokenHandler)

	return mux
}
