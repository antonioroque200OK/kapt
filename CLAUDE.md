---
title: "Kapt Project Intelligence & AI Conventions"
description: "Glossário de domínio, regras de negócio, padrões de desenvolvimento e fluxo de brainstorming para uso do Claude Code no projeto Kapt."
type: "tech"
epic: "platform"
status: "approved"
related_issues: []
---

## 📖 Glossary & Entities (Strict Camel Case Enforced)

- `occurrence`: The central domain entity. Represents a physical event/cobertura.
- `seeker`: The guest end-user/athlete (end consumer).
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `promoter`: The event organizer/race director.
- `photographer`: The professional "Creator" supplying photos.
- `actionVolt`: Our Design System (Black #000000 + Volt #CEFF00 accent).
- **Kaptured:** A photo successfully processed and identified.
- **B-roll / Context:** Atmosphere photos (scenery, medals). Bundled into the "Pack de Recordação."

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

### 4. Testing & Pull Request Flow (Strict Protocol)

- **Test-Driven:** Every feature MUST include automated tests. Run them before staging.
- **No Direct Main Commits:** Always use feature branches (e.g., `feat/seeker-auth`).
- **PR Process:** Use Conventional Commits and wait for user review.

---

## 🧠 Brainstorming & Design (<HARD-GATE>)

You MUST use this before any implementation. **Do NOT write code** until a design doc in `docs/specification/` is approved by the user.

1. **Explore context** | 2. **Offer visual companion** | 3. **Ask clarifying questions** | 4. **Propose 2-3 approaches** | 5. **Present design** | 6. **Write design doc**.

---

## 🛠 Development Standards

### 1. Commit Convention

Format: `<type>(<scope>): <description>` (feat, fix, docs, style, refactor, test, chore).

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

## 📚 AI Prompt Library (Copy-Paste for Humans)

### A. Batch Issue Creation (New Epics)

*Use this to populate the Kanban based on a new specification.*
> "Act as my Technical Product Manager. We are going to batch-create GitHub issues for the **[Epic: NAME]**.
>
> 1. Read specs: `[FILES.md]`.
> 2. Break down into granular tasks using the standard Issue Template.
> 3. Ensure titles start with `[Epic: NAME]`.
> 4. Present drafts for review, then use `gh issue create` upon approval."

### B. Feature Implementation (Task Execution)

*Use this to start coding a specific issue from the "To Do" column.*
> "Read **@CLAUDE.md** and **[MENTION_SPECS_WITH_@]**. Use `gh issue view [ID]` to fetch requirements and create a step-by-step implementation plan for **[FEATURE_NAME]**. Do not write any code until I approve the plan."
