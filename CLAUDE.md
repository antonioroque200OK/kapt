# Kapt Project Intelligence & Brainstorming

## 📖 Glossary & Entities
- **Occurrence:** The central domain entity. Represents a physical event (race, cycling, etc.).
- **Seeker:** The end-user/athlete. Primary customer searching for their own photos.
- **Kaptured:** A photo that has been successfully processed, identified, and is ready for sale.
- **B-roll / Context:** Atmosphere photos (scenery, crowd, medals). Sold as "Pack de Recordação".
- **Identification Engine:** The biometric/logic layer that matches a Seeker to their photos using Selfie or Bib Number.
- **Upstream (Org):** Remote `Kapt-tech/kapt` (The source of truth).
- **Origin (Personal):** Remote `antonioroque200OK/kapt` (Developer's fork).

## 🚀 Business Rules & Core Logic (The "Kapt Constitution")
### 1. Privacy & LGPD Compliance
- **Strict Prohibition:** No public galleries showing identifiable faces. 
- **The Wall:** Access to "Kaptured" photos is granted ONLY after:
    1. Identification (Selfie/Bib).
    2. Explicit LGPD Opt-in.
- **Occurrence Cards:** Must use atmosphere/B-roll images only to avoid unauthorized face exposure.

### 2. Monetization & Retail Insights
- **Replacement Intent:** Computer Vision must flag gear wear and brand loyalty (e.g., "User switched from Mizuno to Nike").
- **Retail Reports:** Real-time market share data is a primary B2B product.
- **Photographer Incentives:** - +5% payout bonus for clear gear/brand detection.
    - Commission on "Pack de Recordação" (B-roll) upsells.

### 3. Localization & UI State (PT-BR)
- Status labels must follow these logic constraints:
    - **"Em breve"**: For future events (`occurrence_date > today`).
    - **"Fotos Disponíveis"**: For past events (`occurrence_date < today`).
    - *Note: "Acontecendo" is currently deprecated/under discussion.*

### 4. Reward System
- **Global Opt-in:** Users who grant permanent biometric consent receive the 1st photo of the next event for free.

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
6. **Write design doc** — save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`.
7. **Transition to implementation** — invoke writing-plans skill.

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
