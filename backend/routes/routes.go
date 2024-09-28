package routes

import (
	"backend/config"
	"backend/config"
	"backend/handlers"
	"net/http"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Routes(cfg *config.AppConfig) *echo.Echo {
func Routes(cfg *config.AppConfig) *echo.Echo {
	mux := echo.New()

	// Middlewares
	mux.Use(middleware.Logger())
	mux.Use(middleware.Recover())
	mux.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000", "http://*", "https://*"},
		AllowHeaders:     []string{echo.HeaderAccept, echo.HeaderContentType, echo.HeaderAuthorization, echo.HeaderXCSRFToken, echo.HeaderSetCookie, echo.HeaderCookie},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions, http.MethodHead},
		AllowCredentials: true,
	}))
	mux.HTTPErrorHandler = func(err error, c echo.Context) {
		if he, ok := err.(*echo.HTTPError); ok {
			if he.Code == http.StatusNotFound {
				handlers.Repo.NotFoundHandler(c)
				return
			}
		}
		// Default error handler
		c.String(http.StatusInternalServerError, "500 Internal Server Error")
	}
	// Routes
	api := mux.Group("")
	api.POST("/register", handlers.Repo.RegisterHandler)
	api.POST("/auth", handlers.Repo.LoginHandler)

	// Auth Routes
	authApi := api.Group("")
	config := echojwt.Config{
		NewClaimsFunc: handlers.Repo.NewClaimsFunc,
		SigningKey:    cfg.JWT_SECRET,
		ErrorHandler:  handlers.Repo.JWTErrorHandler,
	}
	authApi.Use(echojwt.WithConfig(config))
	// restricted.Use(echojwt.WithConfig(handlers.NewJWTConfig(cfg)))
	authApi.POST("/access-token", handlers.Repo.AccessTokenHandler)
	authApi.DELETE("/auth", handlers.Repo.LogoutHandler)
	// mux.POST("/refresh-token", handlers.Repo.RefreshTokenHandler)
	// restricted.POST("/refresh-token", handlers.RefreshTokenHandler)
	// restricted.GET("/refresh-token", handlers.RefreshTokenHandler)

	return mux
}
