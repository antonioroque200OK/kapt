package handler

import (
	// The import path must match the module name defined in your go.mod
	"github.com/kapt/api/internal/repository"
)

// Handler acts as the central orchestrator for HTTP requests,
// holding shared dependencies like the database repository.
type Handler struct {
	repo repository.Querier
}

// NewHandler initializes a new Handler instance with the provided repository.
func NewHandler(repo repository.Querier) *Handler {
	return &Handler{
		repo: repo,
	}
}
