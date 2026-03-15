-- name: CreateOccurrence :one
INSERT INTO occurrences (
    photographer_id, title, description, location_name, location_geom, start_time, end_time, status, slug
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
) RETURNING *;

-- name: GetOccurrenceBySlug :one
SELECT * FROM occurrences
WHERE slug = $1 LIMIT 1;
