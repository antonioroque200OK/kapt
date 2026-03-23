---
title: "Kapt Project Intelligence & AI Conventions"
description: "Glossário de domínio, regras de negócio, padrões de desenvolvimento e fluxo de brainstorming para uso do Claude Code no projeto Kapt."
type: "tech"
epic: "platform"
status: "approved"
related_issues: []
---

## Kapt Project Intelligence & Brainstorming

## 📖 Glossary & Entities (Strict Camel Case Enforced)

- `occurrence`: The central domain entity. Represents a physical event (race, cycling, etc.).
- `seeker`: The guest end-user/athlete searching for photos.
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `promoter`: The event organizer/race director (B2B target).
- `photographer`: The freelance supplier of photos.
- `actionVolt`: Our Design System (Dark mode, electric neon, high contrast).
- **Kaptured:** A photo successfully processed and identified.
- **B-roll / Context:** Atmosphere photos (scenery, medals). Bundled into the "Pack de Recordação" (UI Label).

## 🚀 Business Rules & Core Logic (The "Kapt Constitution")

### 1. Privacy & LGPD Compliance

- **Strict Prohibition:** No public galleries showing identifiable faces.
- **The Wall:** "Kaptured" photos are granted ONLY after Identification and LGPD Opt-in.
- **Zero-Click Discovery:** A logged-in `registeredSeeker` automatically sees their photos under "🔒 Sua Galeria Privada".

### 2. Monetization (DaaS Architecture)

- **DaaS Tiers:** We extract gear wear and brand loyalty to sell B2B reports (Tier 1), Ads (Tier 2), and APIs (Tier 3).
- **Photographer Incentives:** - +5% payout bonus for clear gear detection (Paid ONLY if the photo sells).
  - Fixed LGPD Bounty (e.g., R$ 5.00) for uploading the first 20 B-roll photos.
- **Upsell Rule:** B-roll is never sold solo. It is used to anchor the "Pack de Recordação" price.

### 3. Localization & UI State (PT-BR)

- UI Labels are strictly in Portuguese.
- Status labels:
  - **"Em breve"**: For future events (`occurrence_date > today`).
  - **"Fotos Disponíveis"**: For past events (`occurrence_date < today`).

---

name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design and get user approval.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. Assumptions are the enemy of SDD (Specification-Driven Development).

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Explore project context** — check files, docs, recent commits.
2. **Offer visual companion** — dedicated message for UI/Layout topics.
3. **Ask clarifying questions** — one at a time.
4. **Propose 2-3 approaches** — with trade-offs and recommendation.
5. **Present design** — section by section, getting approval.
6. **Write design doc** — save to `docs/specification/<category>-<slug>.md` (e.g., `biz-rewards.md`, `tech-auth.md`).
7. **Transition to implementation** — invoke writing-plans skill.

## 🛠 Development Standards

### 1. Commit Convention (Conventional Commits)

Format: `<type>(<scope>): <description>`

- `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

### 2. Documentation Naming

Files in `docs/specification/` must follow the format: `<category>-<slug>.md`

- `biz-`, `tech-`, `ux-`, `api-`.

### 3. Specification Front Matter & Hard Gate Enforcement

All files in `docs/specification/` MUST include a YAML Front Matter block at the top.

**CRITICAL RULE FOR AI CODE AGENTS:** Before writing ANY implementation code, you must read the related `.md` spec. If the `status` in the Front Matter is `draft` or `in-review`, you MUST STOP and refuse to write code until the user changes it to `approved`. This is the `<HARD-GATE>` in action.

## Process Flow (DOT)

```dot
digraph brainstorming {
    "Explore project context" -> "Visual questions ahead?";
    "Visual questions ahead?" -> "Offer Visual Companion\n(own message, no other content)" [label="yes"];
    "Visual questions ahead?" -> "Ask clarifying questions" [label="no"];
    "Offer Visual Companion\n(own message, no other content)" -> "Ask clarifying questions";
    "Ask clarifying questions" -> "Propose 2-3 approaches";
    "Propose 2-3 approaches" -> "Present design sections";
    "Present design sections" -> "User approves design?";
    "User approves design?" -> "Write design doc" [label="yes"];
    "Write design doc" -> "Invoke writing-plans skill";
}
