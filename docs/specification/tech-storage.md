---
title: "Hot/Cold Storage & Image Processing Pipeline"
description: "Arquitetura de armazenamento com Egress Zero, processamento de miniaturas WebP e regras de ciclo de vida (Lifecycle) para Occurrences."
type: "tech"
epic: "infrastructure"
status: "approved"
related_issues: []
---

# Tech Spec: Hot/Cold Storage Architecture

## 1. Cloud Provider & Economics

- **Primary Provider:** Cloudflare R2 (S3-Compatible API).
- **Economic Rationale:** $0 Egress (No bandwidth costs for downloading/serving images).
- **Buckets Setup:**
  - `kapt-vault-cold`: Stores the original High-Res files (e.g., JPEG/RAW, 5MB-20MB). Strictly private.
  - `kapt-cdn-hot`: Stores the processed, watermarked, low-res thumbnails (WebP, < 150KB). Publicly accessible via CDN.

## 2. The Processing Pipeline (Go Backend)

When a `photographer` uploads a batch of photos for an `occurrence`:

1. **Direct Upload:** Files go directly to `kapt-vault-cold` (preventing backend memory overload).
2. **Event Trigger:** The Go backend catches the upload event.
3. **Image Manipulation:**
   - Reads the High-Res file.
   - Resizes the longer edge to max `1200px`.
   - Converts format to `WebP` (Quality 80) for maximum web performance.
   - Overlays the `actionVolt` Kapt Watermark dynamically.
4. **Hot Storage:** The resulting WebP is saved to `kapt-cdn-hot` and its public URL is saved to the PostgreSQL database.

## 3. The Seeker Experience

- **Browsing (Zero-Click Discovery):** The `seeker` mobile app/web interface exclusively loads images from `kapt-cdn-hot`. Fast load times, low mobile data usage.
- **Purchase & Delivery:** Upon successful checkout (single photo or "Pack de Recordação"), the backend generates a secure, time-limited signed URL (valid for 24h) directly to the High-Res file in `kapt-vault-cold`.

## 4. Lifecycle & Retention Rules (Anti-Bankruptcy)

- **Active Phase (0-6 months):** All files remain in their respective buckets.
- **Archive Phase (6-12 months):** Sales drop near zero. Files remain available, but `occurrence` is hidden from the main feed.
- **Purge Phase (> 12 months):** - Automated worker deletes the High-Res originals from `kapt-vault-cold` to save storage costs.
  - Thumbnails in `kapt-cdn-hot` are retained indefinitely for the `registeredSeeker`'s historical "🔒 Sua Galeria Privada", acting as a low-cost historical record.

## 5. Implementation Requirements (Go)

- Use standard AWS SDK for Go (`github.com/aws/aws-sdk-go-v2`), configured with Cloudflare R2 custom endpoints.
- Image processing must use efficient CGO-free libraries or external bindings like `bimg` (libvips) for high-throughput watermarking without memory leaks.
