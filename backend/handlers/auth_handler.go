package handlers

import (
	"backend/db/models"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
func (r *Repository) AccessTokenHandler(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(*models.UserClaims)
	return c.JSON(http.StatusOK, echo.Map{
		"payload": claims,
	})
}

func (r *Repository) JWTErrorHandler(c echo.Context, err error) error {
	if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenInvalidClaims) {
		username := c.QueryParam("username")
		user, err := r.DB.GetUserByUsername(username)
		log.Println(user, err)
		if err != nil {
			// Delete refresh token and logout user
			log.Println("error while authenticating ", err)
			r.DB.UpdateUserRefreshToken(username, "")
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "Error while authenticating.",
			})
		}
		if !isValidToken(user.RefreshToken, r.Config.JWT_SECRET) {
			// Delete refresh token and logout user
			log.Println("refresh token expired or invalid")
			r.DB.UpdateUserRefreshToken(username, "")
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "Your session has expired or is invalid. ",
			})
		}

		// Generate new access token
		// accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, newAccessClaims)
		// aT, err := accessToken.SignedString(r.Config.JWT_SECRET)
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

func isValidToken(tokenString string, signingKey interface{}) bool {
	claims := &models.UserClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token method is valid
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Println("Unexpected signing method")
			return nil, errors.New("unexpected signing method")
		}
		return signingKey, nil
	})
	log.Println("Refresh token details in invalid function", token, err)
	return token.Valid && err == nil && token != nil
}
