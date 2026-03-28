---
title: "Kapt Database Schema Specification"
description: "Schema design, entities, relationships, and constraints for the Kapt PostgreSQL database. Authoritative reference for SQLC query authoring."
type: "tech"
epic: "platform"
status: "approved"
related_issues: []
related_specs: ["tech-core.md", "ux-seeker-id.md", "biz-model.md"]
---

## Tech Spec: Database Schema — Kapt

> **Claude Code Instruction:** All queries MUST be written as `.sql` files and compiled with `sqlc generate`. Never write raw SQL strings in Go. Never use an ORM. All code lives in `internal/db/`. Use Neon branching for feature environments.

---

## 1. Database Rules & Constraints

- **Engine:** PostgreSQL (Neon Serverless)
- **Extension Required:** `PostGIS` (for geospatial queries on `occurrence` location)
- **Naming Convention:** `snake_case` for all tables and columns.
- **Primary Keys:** `UUID` (v4) for all entities.
- **Timestamps:** All tables must include `created_at TIMESTAMPTZ DEFAULT NOW()` and `updated_at TIMESTAMPTZ DEFAULT NOW()`.
- **Soft Deletes:** Use `deleted_at TIMESTAMPTZ` (nullable) instead of hard deletes for all core entities.
- **LGPD Compliance:** Biometric data MUST be stored in an isolated table with explicit opt-in consent tracking.

---

## 2. Entity Schema

### 2.1 `seeker`

Represents any user who has authenticated (OTP) on the platform.

```sql
CREATE TABLE seeker (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE,
  phone           TEXT UNIQUE,
  is_registered   BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE = registeredSeeker
  lgpd_opt_in     BOOLEAN NOT NULL DEFAULT FALSE,
  lgpd_opt_in_at  TIMESTAMPTZ,
  global_opt_in   BOOLEAN NOT NULL DEFAULT FALSE,  -- Loyalty: 1 free photo next event
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
```

> `is_registered = TRUE` is the flag for **Zero-Click Discovery**. A `seeker` becomes `registeredSeeker` only after LGPD opt-in AND biometrics submission.

---

### 2.2 `seeker_biometric`

Isolated table for biometric data (LGPD boundary). Only populated after opt-in.

```sql
CREATE TABLE seeker_biometric (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id   UUID NOT NULL REFERENCES seeker(id) ON DELETE CASCADE,
  face_vector BYTEA NOT NULL,  -- Encoded biometric vector from CV pipeline
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.3 `promoter`

Represents a B2B event organizer.

```sql
CREATE TABLE promoter (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  company_name TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);
```

---

### 2.4 `photographer`

Represents a freelance supplier of photos.

```sql
CREATE TABLE photographer (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

---

### 2.5 `occurrence`

The central domain entity. Represents a physical sporting event.

```sql
CREATE TABLE occurrence (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id      UUID REFERENCES promoter(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  sport_type       TEXT NOT NULL,                        -- e.g. 'running', 'cycling'
  occurrence_date  DATE NOT NULL,
  location_name    TEXT,
  location         GEOGRAPHY(Point, 4326),               -- PostGIS geospatial column
  has_broll        BOOLEAN NOT NULL DEFAULT FALSE,       -- UI fallback trigger
  status           TEXT NOT NULL DEFAULT 'scheduled',    -- 'scheduled' | 'active' | 'closed'
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

-- Index for geospatial queries
CREATE INDEX idx_occurrence_location ON occurrence USING GIST (location);
-- Index for date-based tag queries ('Em breve' / 'Fotos Disponíveis')
CREATE INDEX idx_occurrence_date ON occurrence (occurrence_date);
```

---

### 2.6 `photo`

A single photo asset associated with an occurrence.

```sql
CREATE TABLE photo (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_id      UUID NOT NULL REFERENCES occurrence(id) ON DELETE CASCADE,
  photographer_id    UUID NOT NULL REFERENCES photographer(id) ON DELETE RESTRICT,
  storage_url        TEXT NOT NULL,                       -- S3-compatible URL (hot storage)
  is_broll           BOOLEAN NOT NULL DEFAULT FALSE,      -- B-roll / Context photo
  ai_brand_detected  BOOLEAN NOT NULL DEFAULT FALSE,      -- CV pipeline result
  ai_gear_data       JSONB,                               -- Detected brands/gear metadata
  price_cents        INTEGER NOT NULL DEFAULT 0,          -- Price in BRL cents
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at         TIMESTAMPTZ
);

CREATE INDEX idx_photo_occurrence ON photo (occurrence_id);
CREATE INDEX idx_photo_broll ON photo (occurrence_id, is_broll);
```

---

### 2.7 `photo_seeker_match`

Maps which photos biometrically match a `registeredSeeker`. Populated by the CV pipeline.

```sql
CREATE TABLE photo_seeker_match (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id    UUID NOT NULL REFERENCES photo(id) ON DELETE CASCADE,
  seeker_id   UUID NOT NULL REFERENCES seeker(id) ON DELETE CASCADE,
  confidence  FLOAT NOT NULL,                             -- CV match confidence score (0.0 - 1.0)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (photo_id, seeker_id)
);

CREATE INDEX idx_match_seeker ON photo_seeker_match (seeker_id);
```

---

### 2.8 `order`

Records a purchase transaction by a `seeker`.

```sql
CREATE TABLE "order" (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id      UUID NOT NULL REFERENCES seeker(id) ON DELETE RESTRICT,
  occurrence_id  UUID NOT NULL REFERENCES occurrence(id) ON DELETE RESTRICT,
  is_pack        BOOLEAN NOT NULL DEFAULT FALSE,          -- TRUE = "Pack de Recordação"
  total_cents    INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',         -- 'pending' | 'paid' | 'failed'
  zip_download_url TEXT,                                  -- Populated by background job after purchase
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.9 `order_item`

Line items within an `order` (individual photos).

```sql
CREATE TABLE order_item (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  photo_id              UUID NOT NULL REFERENCES photo(id) ON DELETE RESTRICT,
  photographer_payout_cents INTEGER NOT NULL,              -- Base payout
  ai_bonus_cents        INTEGER NOT NULL DEFAULT 0,        -- +5% if ai_brand_detected = TRUE
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.10 `broll_bounty`

Tracks the LGPD B-roll bounty paid to photographers (first 20 B-roll photos per occurrence).

```sql
CREATE TABLE broll_bounty (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id  UUID NOT NULL REFERENCES photographer(id) ON DELETE RESTRICT,
  occurrence_id    UUID NOT NULL REFERENCES occurrence(id) ON DELETE RESTRICT,
  photo_id         UUID NOT NULL REFERENCES photo(id) ON DELETE RESTRICT,
  bounty_cents     INTEGER NOT NULL,                       -- e.g. 500 = R$ 5.00
  paid_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (photographer_id, occurrence_id, photo_id)
);
```

---

## 3. Key Business Logic Queries (to be implemented in SQLC)

| Query Name                              | Purpose                                                                                                  |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------|
| `GetRegisteredSeekerPhotosByOccurrence` | Powers **Zero-Click Discovery** — returns matched photos for a `registeredSeeker` at a given occurrence. |
| `GetBrollByOccurrence`                  | Returns all B-roll photos for the public showcase of an occurrence.                                      |
| `GetOccurrencesNear`                    | Uses **PostGIS** `ST_DWithin` to find occurrences near a geographic point.                               |
| `CountBrollByPhotographer`              | Determines eligibility for LGPD B-roll bounty (max 20 per occurrence).                                   |
| `GetOccurrencesByStatus`                | Used for UI tags — filters by `occurrence_date` vs. current date.                                        |
| `CreateOrderWithItems`                  | Transactional insert for an `order` + its `order_items`.                                                 |

---

## 4. SQLC Configuration Reference

All `.sql` query files live in `internal/db/queries/`. Generated code lives in `internal/db/`. Do not edit generated files manually.

```yaml
# sqlc.yaml (reference)
version: "2"
sql:
  - engine: "postgresql"
    queries: "internal/db/queries/"
    schema: "internal/db/schema/"
    gen:
      go:
        package: "db"
        out: "internal/db"
```
