---
title: "Kapt Project Intelligence & AI Conventions"
description: "Glossário de domínio, regras de negócio, padrões de desenvolvimento e fluxo de brainstorming para uso do Claude Code no projeto Kapt."
type: "tech"
epic: "platform"
status: "approved"
related_issues: []
---

## 📖 Glossary & Entities (Strict Camel Case Enforced)

### ⚡ Technical Terms

- `occurrence`: The central domain entity. Represents a physical event/cobertura.
- `seeker`: The guest end-user/athlete (end consumer).
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `promoter`: The event organizer/race director.
- `photographer`: The professional "Creator" supplying photos.
- `actionVolt`: Our Design System (Black #000000 + Volt #CEFF00 accent).
- **Kaptured:** A photo successfully processed and identified.
- **Showcase**: The public-facing landing page of an Occurrence, populated by B-roll and opted-in athlete photos.
- **B-roll / Context:** Atmosphere photos (scenery, medals). Bundled into the "Pack de Recordação." and Non-athlete photos (landscape, medals, trophies) used to create the event's "Showcase."
- **Subject**: The primary focus of a photo (athlete's body/face/bib).
- **Auto-Crop (On-the-fly)**: AI-driven 9:16 resizing triggered only upon social sharing.
- **LGPD Bounty**: Fixed reward for photographers completing B-roll requirements.
- **Social Version**: A low-res, auto-cropped photo with a "kapt.life" frame for every 5 purchases.

### 👤 User Roles & States
- **Newbie**: Authenticated user (OTP) without biometrics. A "lead" in the awareness stage.
- **Kaptured Seeker**: User with registered biometrics but zero purchase history.
- **Legacy Seeker**: High-LTV customer with at least one completed purchase.
- **Data Pioneer**: Photographer who uploaded legacy archives to train the Kapt AI during the "Ingestion Phase."
- **Founder Creator**: Early-adopter photographer with 0% fees for 6 months or R$ 5k in sales.

## 🚀 Intelligent Journey Logic (State Check)
After OTP login, the system follows this logic:
1. **Newbie**: Selfie Prompt -> Scan Animation (Volt) -> If photos found, request Email/WhatsApp to save and proceed to checkout.
2. **Kaptured Seeker**: Skip directly to Private Gallery (Zero-Click Discovery) -> Display found photos.
3. **Legacy Seeker**: Personalized "Welcome Back" message -> Display new photos + unpurchased photos from past events (Upsell).
4. **Empty State**: "Nice" encouragement message + Future `occurrence` cards with "Interested" CTA.

## 🎨 Design System & UI Standards

- **Figma Source of Truth**: [Kapt Design Style Guide & Library](https://www.figma.com/make/eFwYWC0REwrqiOKsT2ulOI/Design-Style-Guide-and-Library)
- **Core Tokens**:
  - `actionVolt`: `#CEFF00` (Primary accent color)
  - `asphaltBlack`: `#0A0A0A` (Main background color)
  - `pavementGray`: `#262626` (Secondary background and card color)
- **Typography**:
  - **Family**: `JetBrains Mono` strictly for navigation, technical labels, and numeric data.
- **Strict UI Constraints**:
  - **Hero Proportions**: The "COBERTURAS" header must maintain balanced, proportional sizing relative to the logo. Do NOT allow automated scaling to become oversized or desproportional.
  - **Precedence**: This Style Guide and its associated tokens always override automated AI design inferences.

## 🚀 Business Rules & Core Logic (The "Kapt Constitution")

### 1. Privacy & LGPD Compliance

- **Strict Prohibition:** No public galleries showing identifiable faces.
- **The Wall:** "Kaptured" photos are granted ONLY after Identification and LGPD Opt-in.
- **Zero-Click Discovery:** A logged-in `registeredSeeker` automatically sees their photos under "🔒 Sua Galeria Privada."

### 2. Monetization (DaaS Evolution)

- **DaaS Tiers:** We extract gear wear, brand loyalty, and "wearing" states to sell hyper-segmented insights to brands.
- **Photographer Incentives:** +5% payout bonus for clear gear detection (Paid ONLY if the photo sells).
- **Upsell Rule:** B-roll is never sold solo. It anchors the "Pack de Recordação" price.

### 3. Localization & UI State (PT-BR)

- UI Labels are strictly in Portuguese.
- Status labels: **"Em breve"** (future) or **"Fotos Disponíveis"** (past).

### 4. 🔑 Access & Navigation Policy
- **Freedom of Content**: Access to "Blog", "Sobre", and "Coberturas" (B-roll) is unrestricted for all users, including Newbies.
- **Selective Friction**: The Facial Scan Modal is triggered ONLY when a user attempts to access personalized data via UI labels like "BUSCAR MINHAS FOTOS" or "MINHA ÁREA".
- **Graceful Dismissal**: If a user closes the Selfie Modal, they are returned to their previous public view without forced logout.

### 5. Branch Strategy & Environments

Two long-lived branches:

| Branch | Environment | Purpose |
| --- | --- | --- |
| `feat/<issue>-<desc>` | Local dev | Active feature development |
| `develop` | Development / Staging | Integration and pre-production validation |
| `main` | Production | Live — never touched without explicit release request |

### 6. Pull Request & Commit Flow (Strict Protocol)

- **Test-Driven:** Every feature MUST include automated tests. Run them before opening a PR.
- **Picking up an Issue:** Always create a feature branch from `develop` first:
  `git checkout develop && git checkout -b feat/<issue-number>-<short-description>`
- **PR Target:** Feature branches → `develop`. Never open a PR directly to `main`.
- **docs: / chore: changes:** Commit directly to `develop` — no branch, no PR.
- **Production release:** `develop` → `main` only on explicit user request.
- **PR Process:** Use Conventional Commits, open PR, wait for user review before merging.
- **Fork Sync:** After every merge to `develop` in `Kapt-tech/kapt`, sync the personal fork:

  ```bash
  git fetch upstream develop
  git checkout develop
  git reset --hard upstream/develop
  git push origin develop
  ```

---

## 🧠 Brainstorming & Design ([HARD-GATE])

You MUST use this before any implementation. **Do NOT write code** until a design doc in `docs/specification/` is approved by the user.

1. **Explore context** | 2. **Offer visual companion** | 3. **Ask clarifying questions** | 4. **Propose 2-3 approaches** | 5. **Present design** | 6. **Write design doc**.

---

## 🛠 Development Standards

### 1. Database Migration Rigor ([HARD-GATE])

Every change to a database table or creation of a new one MUST follow this sequence — no exceptions:

1. Create a new numbered migration file in `services/sqlc/migration/` following the pattern `00000X_<name>.sql`
2. Run `sqlc generate` from `services/` to update Go models and queries
3. Include **both** the `.sql` migration file and the resulting generated Go code in the same commit

**Never** perform database schema changes without a corresponding migration file.

Migration file naming: `000001_init_schema.up.sql`, `000002_auth_schema.sql`, `000003_<next>.sql`, etc.

### 2. Commit Convention

Format: `<type>(<scope>): <description>` (feat, fix, docs, style, refactor, test, chore).

### 2. Branch Naming

Format: `<type>/<issue-number>-<short-description>`

| Type | When | Example |
| --- | --- | --- |
| `feat/` | New feature from Kanban issue | `feat/25-selfie-capture` |
| `fix/` | Bug fix or security patch | `fix/38-auth-hardening` |
| `refactor/` | Code restructuring, no behaviour change | `refactor/12-auth-middleware` |
| `test/` | Tests only | `test/25-selfie-coverage` |

- `docs:` and `chore:` changes → commit directly to `develop`, no branch needed.
- Always include the issue number when one exists.

### 2. Documentation Naming

Files in `docs/specification/` must follow: `<category>-<slug>.md` (biz-, tech-, ux-, api-).

### 3. Front Matter Enforcement

All specs MUST have YAML Front Matter. If `status: draft`, do NOT implement.

---

## ⚙️ Kapt Engineering Workflow

### 1. Spec-Driven Development (SDD)

- **Specs**: The HOW and WHY. | **Issues**: The WHAT and WHEN.
- Relationship: 1-to-Many. One spec generates multiple granular issues.

### 2. Issue Mapping Strategy

- Backend/DB: `tech-core.md`
- Infra/Storage: `tech-storage.md`
- UI/UX/Frontend: `ux-[feature].md`
- Business/Pricing: `biz-[feature].md`

### 3. GitHub Issue Template

Issues MUST include: **Objective**, **Tasks for Claude Code**, and **Related Specs**.

---

## 🗺️ System Architecture Reference

For all deep technical schemas, entity relationships, and backend sequence flows, consult [docs/specification/tech-system-design.md](docs/specification/tech-system-design.md).

This file serves as the authoritative source for system architecture documentation, including C4 container diagrams, ERDs, and sequence diagrams for key workflows in the Kapt platform.
