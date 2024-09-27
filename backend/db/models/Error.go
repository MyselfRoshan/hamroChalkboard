package models

import "errors"

var (
	ErrBadEmailOrPassword       = errors.New("bad username or password")
	ErrUserAlreadyExists        = errors.New("duplicate key value violates unique constraint \"users_pkey\"")
	ErrDemoRequestAlreadyExists = errors.New("a demo request already exists for this email")
)
