---
title: "OTP Verification & JWT Issuance"
description: "Spec for the POST /auth/verify endpoint: validates a one-time password and returns a signed JWT for seeker authentication."
type: "tech"
epic: "seeker"
status: "approved"
related_issues: []
---

# Tech Spec: OTP Verification & JWT Issuance

## 1. Context & Objective

The `POST /auth/request` endpoint (already implemented) generates a 6-digit OTP and
persists it in `otp_codes`. This spec defines the complementary endpoint that **consumes**
that OTP and returns a signed JWT so the frontend can authenticate subsequent requests.

Frontend contract: `handleAuthSuccess(token: string)` stores the value under
`localStorage.kapt_token`. The endpoint must return exactly `{ "token": "<jwt>" }`.

---

## 2. Endpoint Contract

| Field    | Value                        |
|----------|------------------------------|
| Method   | POST                         |
| Path     | `/auth/verify`               |
| Auth     | None (public)                |
| Content  | `application/json`           |

### Request Body

```json
{ "email": "seeker@example.com", "code": "482931" }
```

### Success Response — 200 OK

```json
{ "token": "<signed_jwt>" }
```

### Error Responses

| Status | Body                                      | Condition                          |
|--------|-------------------------------------------|------------------------------------|
| 400    | `{ "error": "invalid request" }`          | Malformed JSON or missing fields   |
| 401    | `{ "error": "invalid or expired code" }` | OTP not found, used, or expired    |
| 500    | `{ "error": "internal server error" }`   | DB or signing failure              |

---

## 3. Data Flow

```
Client
  │  POST /auth/verify { email, code }
  ▼
Handler.VerifyOTP
  ├─ 1. Decode & validate request body
  ├─ 2. repo.VerifyOTP(email, code)          → 401 on sql.ErrNoRows
  ├─ 3. repo.MarkOTPUsed(otp.ID)             → mark consumed (idempotency)
  ├─ 4. repo.GetSeekerByEmail(email)
  │       └─ sql.ErrNoRows → repo.CreateSeeker(email)
  ├─ 5. jwt.NewWithClaims(HS256, claims)     → sign with JWT_SECRET env var
  └─ 6. JSON response { "token": "..." }
```

---

## 4. JWT Specification

- **Algorithm:** HS256
- **Library:** `github.com/golang-jwt/jwt/v5`
- **Secret:** `os.Getenv("JWT_SECRET")` (required; server must refuse to start if empty)
- **Claims:**

```json
{
  "sub":   "<seeker UUID>",
  "email": "seeker@example.com",
  "exp":   "<now + 24h>",
  "iat":   "<now>"
}
```

---

## 5. New SQL Query Required

A `MarkOTPUsed` query is missing from the current SQLC surface. It must be added to
`services/sqlc/query/auth.sql` and the generated code hand-written (or regenerated)
in `services/internal/repository/auth.sql.go` and `querier.go`:

```sql
-- name: MarkOTPUsed :exec
-- Marks an OTP code as consumed to prevent replay attacks
UPDATE otp_codes SET used = true WHERE id = $1;
```

---

## 6. Files to Change

| File | Action |
|------|--------|
| `services/sqlc/query/auth.sql` | Add `MarkOTPUsed` query |
| `services/internal/repository/auth.sql.go` | Add generated `MarkOTPUsed` method |
| `services/internal/repository/querier.go` | Add `MarkOTPUsed` to interface |
| `services/internal/handler/auth.go` | Add `VerifyOTP` handler method |
| `services/cmd/api/main.go` | Register `POST /auth/verify` route + start HTTP server |
| `services/go.mod` / `go.sum` | Add `golang-jwt/jwt/v5` |

---

## 7. Security Considerations

- OTP is **single-use**: `MarkOTPUsed` is called immediately after a match, before JWT
  issuance, preventing replay within the same request's failure window.
- `JWT_SECRET` must be at least 32 bytes (enforced at startup).
- `code` is exposed in `POST /auth/request` responses **only for testing** (Postman/Insomnia).
  This must be removed before any production deployment.
- No rate-limiting is in scope for this spec; it is tracked separately.

---

## 8. Success Criteria

- `POST /auth/verify` with a valid, non-expired OTP returns 200 + a verifiable JWT.
- The OTP row is marked `used = true` after one successful verification.
- A second request with the same code returns 401.
- A new `seeker` row is created on first login; existing seekers are reused.
- All handler tests pass (`go test ./...`).
