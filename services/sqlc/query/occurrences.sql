-- name: CreatePhotographer :one
INSERT INTO photographers (name, email, bio, stripe_account_id)
VALUES ($1, $2, $3, $4)
RETURNING *;
-- name: CreateOccurrence :one
INSERT INTO occurrences (
        photographer_id,
        title,
        description,
        location_name,
        location_geom,
        start_time,
        end_time,
        status,
        slug
    )
VALUES (
        $1,
        $2,
        $3,
        $4,
        ST_GeomFromText($5::text, 4326),
        -- Explicit cast to text for SQLC mapping
        $6,
        $7,
        $8,
        $9
    )
RETURNING id,
    photographer_id,
    title,
    description,
    location_name,
    ST_AsText(location_geom)::text AS location_geom,
    -- Casting to text ensures string output
    start_time,
    end_time,
    status,
    slug,
    created_at;
-- name: GetOccurrenceBySlug :one
SELECT id,
    photographer_id,
    title,
    description,
    location_name,
    ST_AsText(location_geom)::text AS location_geom,
    start_time,
    end_time,
    status,
    slug,
    created_at
FROM occurrences
WHERE slug = $1
LIMIT 1;
-- name: ListOccurrencesByPhotographer :many
SELECT id,
    photographer_id,
    title,
    description,
    location_name,
    ST_AsText(location_geom)::text AS location_geom,
    start_time,
    end_time,
    status,
    slug,
    created_at
FROM occurrences
WHERE photographer_id = $1
ORDER BY start_time DESC;