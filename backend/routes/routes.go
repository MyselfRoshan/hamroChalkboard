package routes

import (
	"backend/config"
	"backend/handlers"
	"fmt"
	"net/http"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Routes(cfg *config.AppConfig) *echo.Echo {
	mux := echo.New()

	// Middlewares
	mux.Pre(middleware.RemoveTrailingSlash())
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
	authBaseUrl := fmt.Sprintf("/%s/%s", cfg.API_PREFIX, cfg.API_VERSION)
	config := echojwt.Config{
		NewClaimsFunc: handlers.Repo.NewClaimsFunc,
		SigningKey:    cfg.JWT_SECRET,
		ErrorHandler:  handlers.Repo.JWTErrorHandler,
	}
	authApi := api.Group(authBaseUrl)
	authApi.Use(echojwt.WithConfig(config))
	authApi.POST("/token", handlers.Repo.HandlePostToken)
	authApi.DELETE("/auth", handlers.Repo.HandleDeleteAuth)

	// Room Routes
	roomApi := authApi.Group("/room")
	roomApi.GET("/", handlers.Repo.HandleGetRooms)
	roomApi.POST("/", handlers.Repo.HandlePostRoom)
	roomApi.DELETE("/:id", handlers.Repo.HandleDeleteRoom)
	roomApi.PATCH("/:id", handlers.Repo.HandleUpdateRoom)

	roomApi.GET("/exists/:id", handlers.Repo.HandleCheckRoomExists)

	// mux.POST("/refresh-token", handlers.Repo.RefreshTokenHandler)
	// restricted.POST("/refresh-token", handlers.RefreshTokenHandler)
	// restricted.GET("/refresh-token", handlers.RefreshTokenHandler)

	return mux
}
