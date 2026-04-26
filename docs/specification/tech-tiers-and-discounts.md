---
title: "Photographer Tiers & Seeker Discounts"
description: "Database schema additions to support Founder/Alpha photographer tiers and Seeker discount tracking."
type: "tech"
epic: "platform"
status: "approved"
related_issues: ["39"]
related_specs: ["biz-model.md", "tech-db.md"]
---

# Tech Spec: Photographer Tiers & Seeker Discounts

## 1. Context & Objective

Implement the database columns required to support the KAPT monetization model:

- **Photographer Tiers:**
  - **Founder Alpha**: 0% launch fee / 5% lifetime fee (60 days pre-launch registration + 20GB in < 30 days).
  - **Founder Creator**: 0% launch fee / 10% lifetime fee (60 days pre-launch registration + 2GB in < 30 days).
  - **Standard Creator**: 15% flat fee.
- **Seeker Discounts & Rewards:**
  - **Welcome Pioneer**: 20% discount on first purchase. 
  - **Historical Pack**: 1 free photo for discovering photos in past occurrences.
  - **Volume Tier (Pack)**: Progressive discounts (3-5 photos = 30%, 6-8 photos = 40%, 9+ photos = 50%).

---

## 2. Migration: `000003_tiers_and_discounts.sql`

File: `services/sqlc/migration/000003_tiers_and_discounts.sql`

### Photographer columns

| Column | Type | Default | Purpose |
| --- | --- | --- | --- |
| `is_founder_creator` | `BOOLEAN` | `FALSE` | Founder Creator Tier eligibility |
| `is_founder_alpha` | `BOOLEAN` | `FALSE` | Founder Alpha Tier eligibility |
| `founder_deadline` | `TIMESTAMPTZ` | `NULL` | 60-day launch window cutoff for 0% fee |
| `total_revenue_accumulated` | `NUMERIC(10,2)` | `0.00` | Accumulated revenue; Founder 0% status revoked at R$ 5,000 |
| `commission_rate` | `NUMERIC(5,4)` | `0.1500` | Effective commission rate (overrides default 15%) |

### Seeker columns

| Column | Type | Default | Purpose |
| --- | --- | --- | --- |
| `welcome_discount_used` | `BOOLEAN` | `FALSE` | Prevents multiple uses of the 20% welcome discount |
| `last_facial_scan_at` | `TIMESTAMPTZ` | `NULL` | Timestamp of most recent identity validation |

---

## 3. SQLC Queries

### `GetPhotographerTier` — `:one`

Fetches tier status and commission rate for payout calculation.

```sql
SELECT id, is_founder_creator, is_founder_alpha, founder_deadline,
       total_revenue_accumulated, commission_rate
FROM photographers
WHERE id = $1;
```

### `UpdatePhotographerRevenue` — `:one`

Accumulates revenue after each sale and returns updated row.

```sql
UPDATE photographers
SET total_revenue_accumulated = total_revenue_accumulated + $2,
    updated_at = NOW()
WHERE id = $1
RETURNING id, is_founder_creator, is_founder_alpha, total_revenue_accumulated, commission_rate;
```

---

## 4. Business Rules

- **Founder Alpha:** `is_founder_alpha = TRUE` AND `NOW() < founder_deadline` AND
  `total_revenue_accumulated < 5000.00` → `commission_rate = 0.0000`
  (Once deadline passes or 5k is reached → `commission_rate = 0.0500`)
- **Founder Creator:** `is_founder_creator = TRUE` AND `NOW() < founder_deadline` AND
  `total_revenue_accumulated < 5000.00` → `commission_rate = 0.0000`
  (Once deadline passes or 5k is reached → `commission_rate = 0.1000`)
- **Standard Creator (Default):** `commission_rate = 0.1500`
- `commission_rate` is the authoritative field used at payout time — business logic
  (not the DB) is responsible for setting it correctly when tier status changes.
- `welcome_discount_used` is a one-time flag — once `TRUE`, the 20% discount cannot
  be reapplied regardless of account state.

---

## 5. Files Changed

| File | Action |
| --- | --- |
| `services/sqlc/migration/000003_tiers_and_discounts.sql` | New migration |
| `services/sqlc/query/photographers.sql` | New SQLC queries |
| `services/internal/repository/models.go` | Updated (sqlc generate) |
| `services/internal/repository/photographers.sql.go` | New (sqlc generate) |
| `services/internal/repository/querier.go` | Updated (sqlc generate) |

---

## 6. Success Criteria

- Migration applies cleanly against the existing schema.
- `sqlc generate` completes without errors.
- `Photographer` model in Go includes all 5 tier fields.
- `Seeker` model in Go includes both new fields.
- `go build ./...` passes.
