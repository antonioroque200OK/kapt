# Tech Spec: Kapt Infrastructure & Engineering

## 1. Monorepo & Package Management
- **Tool:** Turborepo.
- **Manager:** **npm** (as defined for the project root and frontend).
- **Structure:** - `/apps/web`: Next.js 16.1.5 + TypeScript.
  - `/services/api`: Go 1.22+ (isolated module).

## 2. Backend Architecture (Go)
- **Philosophy:** "Standard Library First" using `net/http`.
- **Directory Pattern:** - `cmd/api/main.go`: Entry point and server initialization.
  - `internal/handler`: HTTP request/response logic.
  - `internal/db`: SQLC-generated code for type-safe queries.
- **State Management:** Stateless services designed for containerization.

## 3. Database & Persistence (Neon)
- **Engine:** PostgreSQL (Serverless).
- **Extension:** **PostGIS** for geospatial athlete/photographer matching.
- **Migration:** Atlas or standard SQL migrations.
- **Branching:** Utilizing Neon's branching for feature-specific development environments.

## 4. Automation & Integration
- **Workflow Engine:** **n8n** (Self-hosted or Cloud).
- **Tasks:** Image metadata extraction, payment webhooks, and messaging triggers.

## 5. Performance Targets
- **Lighthouse Score:** 95+ for the web storefront.
- **API Latency:** < 100ms for core search endpoints.
- **Build System:** Utilizing Turborepo's remote caching.