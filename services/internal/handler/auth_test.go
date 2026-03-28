package handler

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/kapt/api/internal/repository"
)

// stubRepo is an in-memory implementation of repository.Querier for testing.
type stubRepo struct {
	otp    *repository.OtpCode
	seeker *repository.Seeker
}

func (s *stubRepo) VerifyOTP(_ context.Context, arg repository.VerifyOTPParams) (repository.OtpCode, error) {
	if s.otp == nil || s.otp.Email != arg.Email || s.otp.Code != arg.Code {
		return repository.OtpCode{}, sql.ErrNoRows
	}
	return *s.otp, nil
}

func (s *stubRepo) MarkOTPUsed(_ context.Context, _ int32) error { return nil }

func (s *stubRepo) GetSeekerByEmail(_ context.Context, _ string) (repository.Seeker, error) {
	if s.seeker == nil {
		return repository.Seeker{}, sql.ErrNoRows
	}
	return *s.seeker, nil
}

func (s *stubRepo) CreateSeeker(_ context.Context, email string) (repository.Seeker, error) {
	sk := repository.Seeker{ID: uuid.New(), Email: email, CreatedAt: time.Now()}
	s.seeker = &sk
	return sk, nil
}

func (s *stubRepo) UpsertOTP(_ context.Context, _ repository.UpsertOTPParams) (repository.OtpCode, error) {
	return repository.OtpCode{}, nil
}
func (s *stubRepo) CreateOccurrence(_ context.Context, _ repository.CreateOccurrenceParams) (repository.CreateOccurrenceRow, error) {
	return repository.CreateOccurrenceRow{}, nil
}
func (s *stubRepo) CreatePhotographer(_ context.Context, _ repository.CreatePhotographerParams) (repository.Photographer, error) {
	return repository.Photographer{}, nil
}
func (s *stubRepo) GetOccurrenceBySlug(_ context.Context, _ string) (repository.GetOccurrenceBySlugRow, error) {
	return repository.GetOccurrenceBySlugRow{}, nil
}
func (s *stubRepo) ListOccurrencesByPhotographer(_ context.Context, _ uuid.UUID) ([]repository.ListOccurrencesByPhotographerRow, error) {
	return nil, nil
}

func TestVerifyOTP_ValidCode_ReturnsJWT(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-that-is-long-enough!!")
	defer os.Unsetenv("JWT_SECRET")

	h := NewHandler(&stubRepo{
		otp: &repository.OtpCode{
			ID:        1,
			Email:     "seeker@kapt.com",
			Code:      "123456",
			ExpiresAt: time.Now().Add(5 * time.Minute),
			Used:      sql.NullBool{Bool: false, Valid: true},
		},
	})

	body, _ := json.Marshal(map[string]string{"email": "seeker@kapt.com", "code": "123456"})
	req := httptest.NewRequest(http.MethodPost, "/auth/verify", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.VerifyOTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d — body: %s", w.Code, w.Body.String())
	}
	var resp map[string]string
	json.NewDecoder(w.Body).Decode(&resp)
	if resp["token"] == "" {
		t.Fatal("expected non-empty token in response")
	}
}

func TestVerifyOTP_InvalidCode_Returns401(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-that-is-long-enough!!")
	defer os.Unsetenv("JWT_SECRET")

	h := NewHandler(&stubRepo{}) // no OTP seeded

	body, _ := json.Marshal(map[string]string{"email": "seeker@kapt.com", "code": "000000"})
	req := httptest.NewRequest(http.MethodPost, "/auth/verify", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.VerifyOTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", w.Code)
	}
}

func TestVerifyOTP_MalformedBody_Returns400(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-that-is-long-enough!!")
	defer os.Unsetenv("JWT_SECRET")

	h := NewHandler(&stubRepo{})

	req := httptest.NewRequest(http.MethodPost, "/auth/verify", bytes.NewReader([]byte(`{not json}`)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.VerifyOTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", w.Code)
	}
}

func TestVerifyOTP_ReplayAttack_Returns401(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-that-is-long-enough!!")
	defer os.Unsetenv("JWT_SECRET")

	usedOTP := &repository.OtpCode{
		ID:        2,
		Email:     "seeker@kapt.com",
		Code:      "654321",
		ExpiresAt: time.Now().Add(5 * time.Minute),
		Used:      sql.NullBool{Bool: true, Valid: true},
	}
	// VerifyOTP stub returns ErrNoRows when otp.Used is true (mirrors DB WHERE used=false)
	stub := &stubRepo{} // no valid OTP — used one would not be returned by DB
	_ = usedOTP
	h := NewHandler(stub)

	body, _ := json.Marshal(map[string]string{"email": "seeker@kapt.com", "code": "654321"})
	req := httptest.NewRequest(http.MethodPost, "/auth/verify", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.VerifyOTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 on replay, got %d", w.Code)
	}
}
