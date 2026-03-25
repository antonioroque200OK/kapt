package handler

import (
	// The import path must match the module name defined in your go.mod
	"github.com/kapt/api/internal/repository"
)

// Handler acts as the central orchestrator for HTTP requests,
// holding shared dependencies like the database repository.
type Handler struct {
	repo *repository.Queries
}

// NewHandler initializes a new Handler instance with the provided repository.
func NewHandler(repo *repository.Queries) *Handler {
	return &Handler{
		repo: repo,
	}
}
