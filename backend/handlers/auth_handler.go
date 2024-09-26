package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

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
	return new(JWTUserClaims)
}
func (r *Repository) AccessTokenHandler(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(*JWTUserClaims)
	return c.JSON(http.StatusOK, echo.Map{
		"payload": claims,
	})
}

func (r *Repository) JWTErrorHandler(c echo.Context, err error) error {
	if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenInvalidClaims) {
		username := c.QueryParam("username")
		user, err := r.DB.GetUserByUsername(username)
		fmt.Println(user, err)
		if err != nil {
			// Delete refresh token and logout user
			log.Println("error while authenticating", err)
			r.DB.UpdateUserRefreshToken(username, "")
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "error while authenticating",
			})
		}
		if !isValidToken(user.RefreshToken, r.Config.JWT_SECRET) {
			// Delete refresh token and logout user
			log.Println("refresh token expired or invalid")
			r.DB.UpdateUserRefreshToken(username, "")
			return c.JSON(http.StatusUnauthorized, echo.Map{
				"error": "refresh token expired or invalid",
			})
		}

		// Create new access token claims
		newAccessClaims := &JWTUserClaims{
			Username: user.Username,
			Email:    user.Email,
			Role:     user.Role,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(r.Config.JWT_EXP)),
			},
		}

		// Generate new access token
		accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, newAccessClaims)
		aT, err := accessToken.SignedString(r.Config.JWT_SECRET)
		if err != nil {
			log.Println("could not generate access token", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "could not generate access token",
			})
		}

		log.Println("refreshed token", aT)
		return c.JSON(http.StatusCreated, echo.Map{
			"access_token": aT,
		})
	}
	return nil
}

func isValidToken(tokenString string, signingKey interface{}) bool {
	claims := &JWTUserClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token method is valid
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return signingKey, nil
	})
	return token.Valid && err == nil && token != nil
}
