package handlers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

//	func (h *Handler) Login(c echo.Context) error {
//		return c.String(http.StatusOK, "Login")
//	}
func RestrictedHandler(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTUserClaims)
	name := claims.Username
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

// func RefreshTokenHandler(c echo.Context) error {
// 	// c.Response().G
// 	// fmt.Println("claims", claims.ExpiresAt.Time)
// 	// cookie, err := c.Cookie("refresh_token")
// 	// if err != nil {
// 	// 	return err
// 	// }
// 	// // if time.Now().After(claims.ExpiresAt.Time) {

// 	// // }
// 	// return c.JSON(http.StatusOK, cookie.Value)

// 	cookie, err := c.Cookie("refresh_token")
// 	if err != nil {
// 		return echo.NewHTTPError(http.StatusUnauthorized, "No refresh token found")
// 	}

// 	// Validate the refresh token (here just checking if it exists)
// 	if cookie.Value == "" {
// 		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
// 	}

// 	// Generate new access token
// 	// user := cookie.Value.(*jwt.Token)
// 	token, err := jwt.ParseWithClaims(cookie.Value, &JWTUserClaims{}, func(token *jwt.Token) (interface{}, error) {
// 		return []byte(os.Getenv("JWT_SECRET")), nil
// 	})
// 	if err != nil {
// 		return echo.NewHTTPError(http.StatusInternalServerError, "Could not generate access token")
// 	}
// 	refreshClaims := token.Claims.(*JWTUserClaims)
// 	if token.Valid {
// 		accessClaims := &JWTUserClaims{
// 			Username: refreshClaims.Username,
// 			Email:    refreshClaims.Email,
// 			Role:     refreshClaims.Role,
// 			RegisteredClaims: jwt.RegisteredClaims{
// 				IssuedAt:  jwt.NewNumericDate(time.Now()),
// 				ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Second * 60)),
// 			},
// 		}
// 		accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
// 		aT, err := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
// 		if err != nil {
// 			return echo.NewHTTPError(http.StatusInternalServerError, "Could not generate access token")
// 		}
// 		return c.JSON(http.StatusOK, echo.Map{
// 			"access_token": aT,
// 		})
// 	}
// 	return echo.NewHTTPError(http.StatusInternalServerError, "Could not generate access token")

// 	// return c.JSON(http.StatusInternalServerError, echo.Map{
// 	// 	"message": "Invalid refresh token",
// 	// })
// }

func RefreshTokenHandler(c echo.Context) error {
	// Access the refresh token from the cookie
	cookie, err := c.Cookie("refresh.token")
	fmt.Println("cookie", cookie)
	for _, cookie := range c.Cookies() {
		fmt.Println(cookie.Name)
		fmt.Println(cookie.Value)
	}
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "No refresh token found")
	}

	// Validate the refresh token (you can also decode and verify it)
	refreshToken := cookie.Value
	if refreshToken == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
	}

	// Parse the refresh token (this should include your verification logic)
	claims := &JWTUserClaims{}
	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is what you expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, echo.NewHTTPError(http.StatusUnauthorized, "Unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
	}

	// Generate a new access token
	accessClaims := &JWTUserClaims{
		Username: claims.Username,
		Email:    claims.Email,
		Role:     claims.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Second * 60)), // Your expiration time
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	a_t, err := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"access_token": a_t,
	})
}
