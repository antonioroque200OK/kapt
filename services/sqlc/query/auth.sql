-- name: GetSeekerByEmail :one
-- Retrieves a seeker by their unique email address
SELECT *
FROM seekers
WHERE email = $1
LIMIT 1;
-- name: CreateSeeker :one
-- Registers a new seeker in the system
INSERT INTO seekers (email)
VALUES ($1)
RETURNING *;
-- name: UpsertOTP :one
-- Inserts or updates an OTP code for a specific email
INSERT INTO otp_codes (email, code, expires_at)
VALUES ($1, $2, $3)
RETURNING *;
-- name: VerifyOTP :one
-- Validates an OTP code and checks for expiration
SELECT *
FROM otp_codes
WHERE email = $1
    AND code = $2
    AND used = false
    AND expires_at > NOW()
LIMIT 1;
-- name: MarkOTPUsed :exec
-- Marks an OTP code as consumed to prevent replay attacks
UPDATE otp_codes SET used = true WHERE id = $1;