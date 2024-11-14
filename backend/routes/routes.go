package routes

import (
	"backend/config"
	"backend/handlers"
	"net/http"
	"net/url"

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
		AllowOrigins:     []string{"http://localhost:3000", "ws://localhost:3000", "*"},
		AllowHeaders:     []string{echo.HeaderAccept, echo.HeaderContentType, echo.HeaderAuthorization, echo.HeaderXCSRFToken, echo.HeaderSetCookie, echo.HeaderCookie, echo.HeaderOrigin},
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
	config := echojwt.Config{
		NewClaimsFunc: handlers.Repo.NewClaimsFunc,
		SigningKey:    cfg.JWT_SECRET,
		ErrorHandler:  handlers.Repo.JWTErrorHandler,
	}
	authApi := api.Group("/auth")
	authApi.Use(echojwt.WithConfig(config))
	authApi.POST("/token", handlers.Repo.HandlePostToken)
	authApi.DELETE("", handlers.Repo.HandleDeleteAuth)

	apiVersionedStr, err := url.JoinPath(cfg.API_PREFIX, cfg.API_VERSION)
	if err != nil {
		panic(err)
	}
	apiVersioned := mux.Group(apiVersionedStr)
	// Room Routes
	// fmt.Println(apiVersioned, apiVersionedStr)
	roomApi := apiVersioned.Group("/room")
	roomApi.Use(echojwt.WithConfig(config))
	roomApi.GET("", handlers.Repo.HandleGetRooms)
	roomApi.POST("", handlers.Repo.HandlePostRoom)
	roomApi.DELETE("/:id", handlers.Repo.HandleDeleteRoom)
	roomApi.PATCH("/:id", handlers.Repo.HandleUpdateRoom)

	roomApi.GET("/exists/:id", handlers.Repo.HandleCheckRoomExists)

	// Websocket Routes
	socketApi := apiVersioned.Group("/ws")
	// fmt.Println(socketApi)
	// socketApi.Use(echojwt.WithConfig(config))
	// cs := handlers.Repo.NewRoomServer()
	// socketApi.GET("/:room-id", cs.SubscribeHandler)
	socketApi.GET("/:roomId", handlers.Repo.HandleGetSocket)
	return mux
}
