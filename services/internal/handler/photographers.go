package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/kapt/api/internal/repository"
	"github.com/shopspring/decimal"
)

type photographerResponse struct {
	ID                      uuid.UUID        `json:"id"`
	Name                    string           `json:"name"`
	Email                   string           `json:"email"`
	Bio                     *string          `json:"bio"`
	StripeAccountID         *string          `json:"stripe_account_id"`
	CreatedAt               time.Time        `json:"created_at"`
	UpdatedAt               time.Time        `json:"updated_at"`
	IsFounderCreator        bool             `json:"is_founder_creator"`
	IsFounderAlpha          bool             `json:"is_founder_alpha"`
	FounderDeadline         *time.Time       `json:"founder_deadline"`
	TotalRevenueAccumulated decimal.Decimal  `json:"total_revenue_accumulated"`
	CommissionRate          decimal.Decimal  `json:"commission_rate"`
}

func toPhotographerResponse(p repository.Photographer) photographerResponse {
	r := photographerResponse{
		ID:                      p.ID,
		Name:                    p.Name,
		Email:                   p.Email,
		CreatedAt:               p.CreatedAt,
		UpdatedAt:               p.UpdatedAt,
		IsFounderCreator:        p.IsFounderCreator,
		IsFounderAlpha:          p.IsFounderAlpha,
		TotalRevenueAccumulated: p.TotalRevenueAccumulated,
		CommissionRate:          p.CommissionRate,
	}
	if p.Bio.Valid {
		r.Bio = &p.Bio.String
	}
	if p.StripeAccountID.Valid {
		r.StripeAccountID = &p.StripeAccountID.String
	}
	if p.FounderDeadline.Valid {
		r.FounderDeadline = &p.FounderDeadline.Time
	}
	return r
}

func (h *Handler) ListPhotographers(w http.ResponseWriter, r *http.Request) {
	photographers, err := h.repo.ListPhotographers(r.Context())
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	resp := make([]photographerResponse, len(photographers))
	for i, p := range photographers {
		resp[i] = toPhotographerResponse(p)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}

type createPhotographerPayload struct {
	Name            string `json:"name"`
	Email           string `json:"email"`
	Bio             string `json:"bio"`
	StripeAccountID string `json:"stripe_account_id"`
}

func (h *Handler) CreatePhotographer(w http.ResponseWriter, r *http.Request) {
	var payload createPhotographerPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.Name == "" || payload.Email == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "name and email are required"}); err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
		}
		return
	}

	params := repository.CreatePhotographerParams{
		Name:  payload.Name,
		Email: payload.Email,
	}
	if payload.Bio != "" {
		params.Bio = sql.NullString{String: payload.Bio, Valid: true}
	}
	if payload.StripeAccountID != "" {
		params.StripeAccountID = sql.NullString{String: payload.StripeAccountID, Valid: true}
	}

	photographer, err := h.repo.CreatePhotographer(r.Context(), params)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(toPhotographerResponse(photographer)); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}
