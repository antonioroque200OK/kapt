-- +goose Up

-- Photographer tier columns: Founder/Pioneer program and financial tracking
ALTER TABLE photographers
    ADD COLUMN IF NOT EXISTS is_founder_creator          BOOLEAN       NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_founder_alpha            BOOLEAN       NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS founder_deadline            TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS total_revenue_accumulated   NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS commission_rate             NUMERIC(5,2)  NOT NULL DEFAULT 15.00;

-- Seeker discount columns: welcome offer and facial scan tracking
ALTER TABLE seekers
    ADD COLUMN IF NOT EXISTS welcome_discount_used  BOOLEAN     NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS last_facial_scan_at    TIMESTAMPTZ;

-- +goose Down

ALTER TABLE seekers
    DROP COLUMN IF EXISTS last_facial_scan_at,
    DROP COLUMN IF EXISTS welcome_discount_used;

ALTER TABLE photographers
    DROP COLUMN IF EXISTS commission_rate,
    DROP COLUMN IF EXISTS total_revenue_accumulated,
    DROP COLUMN IF EXISTS founder_deadline,
    DROP COLUMN IF EXISTS is_founder_alpha,
    DROP COLUMN IF EXISTS is_founder_creator;
