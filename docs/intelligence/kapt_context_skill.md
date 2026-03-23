---
title: "Kapt Project Governance & Context"
description: "Diretrizes primárias de governança, stack e comunicação para a IA."
type: "tech"
epic: "platform"
status: "approved"
---

# Gemini Skill: Kapt Project Governance & Context

## 1. Project Mission & Identity

Kapt is a **B2B DaaS (Data-as-a-Service) platform disguised as a B2C sports photography e-commerce**. It connects athletes and photographers through AI-driven search (OCR, Facial Recognition, PostGIS), while structuring valuable retail data (brands, gear wear) to sell to the market.

## 2. Technical Stack & Standards

- **Monorepo:** Turborepo with **npm** as the package manager.
- **Frontend:** Next.js 16 (located in `/apps/web`).
- **Backend:** Go 1.22+ using native `net/http` (located in `/services/api`).
- **Database:** Neon (PostgreSQL) + PostGIS + SQLC for type-safe queries.
- **Methodology:** Spec-Driven Development (SDD). All code must align with `/.spec`.

## 3. Official Glossary (Strict Camel Case for Code)

- `seeker`: The athlete/runner (first-time or anonymous). NEVER use generic "User".
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `occurrence`: The sporting event. NEVER use "Event", "Race" or "Match".
- `promoter`: The event organizer/race director.
- `photographer`: The freelance photographer supplying the photos.
- `actionVolt`: Our Design System (Dark mode, neon/electric details, premium high-contrast).

## 4. Product & UX Philosophy

- **Zero-Click Discovery:** A `registeredSeeker` must find their photos magically via biometrics on page load, with zero friction.
- **Cash Protection:** Photographer AI bonuses are paid ONLY upon the photo's sale.
- **Upsell Leverage:** B-roll context photos are NEVER sold individually. They are bundled into the "Pack de Recordação" to increase AOV (Average Order Value).

## 5. Directory Governance & Communication

- Always use the `cmd/api` and `internal/` pattern for Go services.
- Keep the project root clean; orchestration files only.
- **Technical Specs:** Always in English for precision.
- **UI Labels:** Always in Portuguese (target market: Brazil).
- **Tone:** Professional, "cool", rich vocabulary, and performance-oriented.
