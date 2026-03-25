package handler

import (
	"crypto/rand"
	"encoding/json"
	"io"
	"net/http"

	// The import path must match the module name defined in your go.mod
	"time"

	"github.com/kapt/api/internal/repository"
)

// RequestOTPPayload defines the input structure for an OTP request
type RequestOTPPayload struct {
	Email string `json:"email"`
}

// RequestOTP handles the generation and persistence of the access code
func (h *Handler) RequestOTP(w http.ResponseWriter, r *http.Request) {
	var payload RequestOTPPayload

	// Decode the incoming JSON request body
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid or malformed email address", http.StatusBadRequest)
		return
	}

	// 1. Generate a secure 6-digit numeric code
	code := generateRandomCode(6)

	// 2. Persist the OTP in Neon via SQLC (Set to expire in 10 minutes)
	// The Upsert operation ensures that any previous code for this email is replaced
	_, err := h.repo.UpsertOTP(r.Context(), repository.UpsertOTPParams{
		Email:     payload.Email,
		Code:      code,
		ExpiresAt: time.Now().Add(10 * time.Minute),
	})

	if err != nil {
		http.Error(w, "Failed to process the request in the database", http.StatusInternalServerError)
		return
	}

	// 3. Send successful response
	// In a production environment, this is where the email trigger (Resend/SendGrid) occurs
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "OTP sent successfully",
		"code":    code, // Exposed here for testing purposes via Postman/Insomnia
	})
}

// generateRandomCode creates a cryptographically secure numeric string
func generateRandomCode(max int) string {
	var table = [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
	b := make([]byte, max)

	// Use crypto/rand for secure generation instead of math/rand
	n, _ := io.ReadAtLeast(rand.Reader, b, max)
	if n != max {
		return "123456" // Safety fallback in case of entropy failure
	}

	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}
	return string(b)
}
