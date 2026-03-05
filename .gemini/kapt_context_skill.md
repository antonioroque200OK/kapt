# Gemini Skill: Kapt Project Governance & Context

## 1. Project Mission
Kapt is a high-performance marketplace for endurance sports photography, connecting athletes and photographers through AI-driven search (OCR, Facial Recognition, PostGIS).

## 2. Technical Stack & Standards
- **Monorepo:** Turborepo with **npm** as the package manager.
- **Frontend:** Next.js 16 (located in `/apps/web`).
- **Backend:** Go 1.22+ using native `net/http` (located in `/services/api`).
- **Database:** Neon (PostgreSQL) + PostGIS + SQLC for type-safe queries.
- **Methodology:** Spec-Driven Development (SDD). All code must align with `/.spec`.

## 3. Directory Governance
- Always use the `cmd/api` and `internal/` pattern for Go services.
- Keep the project root clean; orchestration files only.
- Documentation resides in `/.spec` (English) and `README.md` (Portuguese).

## 4. Communication Guidelines (Bilingual)
- **Technical Specs:** Always in English for precision.
- **General Documentation/README:** Portuguese (target market: Brazil).
- **Tone:** Professional, "cool", rich vocabulary, and performance-oriented.

## 5. Decision Log (Audit Trail)
- **Package Manager:** Strictly `npm` (decided Feb 2026).
- **Environment:** Distro-agnostic (Docker/Dev Container) but optimized for high-performance kernels like CachyOS.
- **Workflow:** Always check `product_spec.md` before proposing features.