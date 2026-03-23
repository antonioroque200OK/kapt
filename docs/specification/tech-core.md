---
title: "Kapt Infrastructure & Engineering"
description: "Padrões de arquitetura, stack tecnológico, banco de dados e metas de performance."
type: "tech"
epic: "platform"
status: "approved"
related_issues: []
---

# Tech Spec: Kapt Infrastructure & Engineering

## 1. Monorepo & Package Management

- **Tool:** Turborepo.
- **Manager:** **npm** (as defined for the project root and frontend).
- **Structure:** - `/apps/web`: Next.js 16+ + TypeScript (Implementing `actionVolt` design system).
  - `/services/api`: Go 1.22+ (isolated module).

## 2. Backend Architecture (Go)

- **Philosophy:** "Standard Library First" using `net/http`.
- **Directory Pattern:** - `cmd/api/main.go`: Entry point and server initialization.
  - `internal/handler`: HTTP request/response logic.
  - `internal/db`: SQLC-generated code for type-safe queries.
- **Task Automation:** Cron jobs or ScrapingBee integrations for automated `occurrence` generation.

## 3. Database & Persistence (Neon)

- **Engine:** PostgreSQL (Serverless).
- **Extension:** **PostGIS** for geospatial matching.
- **Schema Focus:** Clear distinction in states to identify a `registeredSeeker` vs a guest.
- **Branching:** Utilizing Neon's branching for feature-specific development environments.

## 4. Storage & Delivery

- **Hot/Cold Storage:** S3-compatible buckets.
- **Delivery Strategy:** High-res cloud gallery viewing. Bulk downloads trigger a background job to compress a `.zip` and send via email (protecting mobile device storage).

## 5. Performance Targets

- **Lighthouse Score:** 95+ for the web storefront.
- **API Latency:** < 100ms for core search endpoints.
