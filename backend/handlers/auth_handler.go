package handlers

import (
	"backend/db/models"
	"backend/helpers"
	"errors"
	"log"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

//	func NewJWTConfig(cfg *config.AppConfig) echojwt.Config {
//		return echojwt.Config{
//			SigningKey:    []byte(cfg.JWT_SECRET),
//			NewClaimsFunc: Repo.NewClaimsFunc,
//			ErrorHandler:  Repo.RefreshHandler,
//		}
//	}
func (r *Repository) NewClaimsFunc(c echo.Context) jwt.Claims {
	return new(models.UserClaims)
}

// HandlePostToken handles the access token request.
//
// Parameters:
//
//	c (echo.Context): the Echo context.
//
// Returns:
//
//	error: an error response if the token cannot be retrieved or returned.
func (r *Repository) HandlePostToken(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(*models.UserClaims)
	return c.JSON(http.StatusOK, echo.Map{
		"payload": claims,
	})
}

// JWTErrorHandler handles JWT errors by checking for expired or invalid claims,
// and refreshes the access token if the refresh token is valid.
//
// Parameters:
//
//	c (echo.Context): the Echo context.
//	err (error): the error encountered.
//
// Returns:
//
//	error: an error response if the token is expired, invalid, or cannot be refreshed.
// func (r *Repository) JWTErrorHandler(c echo.Context, err error) error {
// 	if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenInvalidClaims) {
// 		username := c.QueryParam("username")
// 		user, err := r.DB.GetUserByUsername(username)
// 		log.Println(user, err, username)
// 		if err != nil {
// 			// Delete refresh token and logout user
// 			log.Println("error while authenticating ", err)
// 			r.DB.UpdateUserRefreshToken(username, "")
// 			return c.JSON(http.StatusUnauthorized, echo.Map{
// 				"error": "Error while authenticating.",
// 			})
// 		}
// 		if !helpers.IsValidToken(user.RefreshToken, r.Config.JWT_SECRET) {
// 			// Delete refresh token and logout user
// 			log.Println("refresh token expired or invalid")
// 			r.DB.UpdateUserRefreshToken(username, "")
// 			return c.JSON(http.StatusUnauthorized, echo.Map{
// 				"error": "Your session has expired or is invalid. ",
// 			})
// 		}

// 		// Generate new access token
// 		accessToken, accessPayload, err := user.NewUserToken(r.Config.JWT_SECRET, r.Config.JWT_EXP)
// 		if err != nil {
// 			log.Println("could not generate access token", err)
// 			return c.JSON(http.StatusInternalServerError, echo.Map{
// 				"error": "error while authenticating.",
// 			})
// 		}

// 		log.Println("refreshed token", accessToken)
// 		return c.JSON(http.StatusCreated, echo.Map{
// 			"token":   accessToken,
// 			"payload": accessPayload,
// 		})
// 	}
// 	return nil
// }

func (r *Repository) JWTErrorHandler(c echo.Context, err error) error {
	if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenInvalidClaims) {
		username := c.QueryParam("username")

		if r.DB == nil {
			log.Println("Database connection is nil")
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "Internal server error.",
			})
		}

		user, err := r.DB.GetUserByUsername(username)
		log.Println(user, err, username)

		if err != nil {
			log.Println("error while authenticating ", err)
			r.DB.UpdateUserRefreshToken(username, "")
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "Error while authenticating.",
			})
		}

		if user == nil {
			log.Println("User not found for username:", username)
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "User not found.",
			})
		}

		if user.RefreshToken == "" {
			log.Println("Refresh token is empty for user:", username)
			r.DB.UpdateUserRefreshToken(username, "")
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "Your session has expired or is invalid.",
			})
		}

		// Generate new access token
		accessToken, accessPayload, err := user.NewUserToken(r.Config.JWT_SECRET, r.Config.JWT_EXP)
		if err != nil {
			log.Println("could not generate access token", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "error while authenticating.",
			})
		}

		log.Println("refreshed token", accessToken)
		return c.JSON(http.StatusCreated, echo.Map{
			"token":   accessToken,
			"payload": accessPayload,
		})
	}
	return nil
}

// HandlePostAuth handles the login request by authenticating the user credentials and generating access and refresh tokens.
//
// Parameters:
//
//	c (echo.Context): the Echo context.
//
// Returns:
//
//	error: an error response if the login process fails.
func (r *Repository) HandlePostAuth(c echo.Context) error {
	emailOrUsername := c.FormValue("email_or_username")
	password := c.FormValue("password")

	user, _ := r.DB.GetUserByUsernameOrEmail(emailOrUsername)
	if user == nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{
			"error": "Invalid email or username",
		})
	}
	if !helpers.CheckPasswordHash(password, user.Password) {
		return c.JSON(http.StatusUnauthorized, echo.Map{
			"error": "Invalid password",
		})
	}

	accessToken, accessPayload, err := user.NewUserToken(r.Config.JWT_SECRET, r.Config.JWT_EXP)
	if err != nil {
		return err
	}

	refreshToken, _, err := user.NewUserToken(r.Config.JWT_SECRET, r.Config.SESSION_EXP)
	if err != nil {
		return err
	}

	r.DB.UpdateUserRefreshTokenAndLastLoginTime(user.ID, refreshToken)
	log.Println("Saved Refresh Token in DB:", refreshToken)

	return c.JSON(http.StatusOK, echo.Map{
		"token":   accessToken,
		"payload": accessPayload,
	})
}

// HandleDeleteAuth handles the logout request by deleting the refresh token and returning a success message.
//
// Parameters:
//
//	c (echo.Context): the Echo context.
//
// Returns:
//
//	error: an error response if the logout process fails.
func (r *Repository) HandleDeleteAuth(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	user := token.Claims.(*models.UserClaims)

	// Delete refresh token
	log.Println("Deleting refresh token", token)
	r.DB.UpdateUserRefreshToken(user.Username, "")

	log.Printf("User %v logged out.\n", user.Username)
	return c.JSON(http.StatusOK, echo.Map{
		"message": "Successfully logged out.",
	})
}
