package routes

import (
	"backend/config"
	"backend/handlers"
	"log"
	"net/http"
	"net/url"

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
	api.POST("/register", handlers.Repo.HandlePostRegister)
	api.POST("/auth", handlers.Repo.HandlePostAuth)

	// Auth Routes
	authBaseUrl, err := url.JoinPath(cfg.API_PREFIX, cfg.API_VERSION)
	if err != nil {
		log.Fatalf("Error getting api url")
	}
	authApi := api.Group(authBaseUrl)
	config := echojwt.Config{
		NewClaimsFunc: handlers.Repo.NewClaimsFunc,
		SigningKey:    cfg.JWT_SECRET,
		ErrorHandler:  handlers.Repo.JWTErrorHandler,
	}
	authApi.Use(echojwt.WithConfig(config))
	authApi.POST("/token", handlers.Repo.HandlePostToken)
	authApi.DELETE("/auth", handlers.Repo.HandleDeleteAuth)

	authApi.GET("/room", handlers.Repo.HandleGetRooms)
	authApi.POST("/room", handlers.Repo.HandlePostRoom)
	authApi.DELETE("/room/:id", handlers.Repo.HandleDeleteRoom)
	authApi.PATCH("/room/:id", handlers.Repo.HandleUpdateRoom)
	// mux.POST("/refresh-token", handlers.Repo.RefreshTokenHandler)
	// restricted.POST("/refresh-token", handlers.RefreshTokenHandler)
	// restricted.GET("/refresh-token", handlers.RefreshTokenHandler)

	return mux
}
