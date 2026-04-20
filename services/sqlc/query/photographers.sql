-- name: ListPhotographers :many
SELECT id, name, email, bio, stripe_account_id, created_at, updated_at,
    is_founder, is_pioneer, founder_deadline, total_revenue_accumulated, commission_rate
FROM photographers
ORDER BY created_at DESC;

-- name: GetPhotographerTier :one
-- Fetches tier status and effective commission rate for payout calculation
SELECT id, is_founder, is_pioneer, founder_deadline,
    total_revenue_accumulated, commission_rate
FROM photographers
WHERE id = $1
LIMIT 1;

-- name: UpdatePhotographerRevenue :one
-- Accumulates revenue after each sale and returns the updated tier row
UPDATE photographers
SET total_revenue_accumulated = total_revenue_accumulated + $2,
    updated_at                = NOW()
WHERE id = $1
RETURNING id, is_founder, is_pioneer, total_revenue_accumulated, commission_rate;
