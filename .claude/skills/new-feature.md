# Skill: new-feature

Enforce the Kapt Spec-Driven Development (SDD) [HARD-GATE] before any implementation.
**Do NOT write any code until every step below is completed and the user has explicitly approved the design.**

---

## Step 1 — Explore Context

1. Read `CLAUDE.md` to refresh domain terminology and business rules.
2. Identify and read all relevant specs in `docs/specification/` (use `@` mentions if the user provided them, otherwise infer from the feature name).
3. If a GitHub issue number was provided, run: `gh issue view <ID>` to fetch requirements, tasks, and related specs.
4. Summarise your understanding of the feature back to the user in 3–5 bullet points before proceeding.

## Step 2 — Ask Clarifying Questions

Ask the user any open questions that would affect the design. Cover at minimum:
- Scope: what is explicitly **in** and **out** of this feature?
- Affected user roles (`seeker`, `promoter`, `photographer`, etc.)?
- Does this touch the database? If yes, which tables?
- Are there LGPD / privacy implications?
- Any hard deadlines or performance constraints?

Do **not** proceed until the user has answered.

## Step 3 — Propose 2–3 Approaches

Present 2 to 3 distinct implementation approaches. For each, include:
- A short name and one-line summary.
- Key trade-offs (complexity, performance, reversibility).
- Your recommended choice and rationale.

## Step 4 — Offer a Visual Companion (if UI-facing)

If the feature involves any UI changes, offer to generate a mockup or wireframe using the Kapt Design System tokens:
- Background: `asphaltBlack` `#0A0A0A`
- Accent: `actionVolt` `#CEFF00`
- Secondary surface: `pavementGray` `#262626`
- Font: `JetBrains Mono`
- UI labels: **always in PT-BR**

## Step 5 — Present the Design

Write a concise design summary covering:
- Component/module breakdown
- Data flow or sequence (use a Mermaid diagram if helpful)
- API contract changes (if any)
- Database changes required (tables, columns, indexes)
- Test strategy (unit, integration, e2e)

Ask the user: **"Do you approve this design? Should I write the spec?"**

## Step 6 — Write the Spec

Only after explicit approval, invoke the `write-spec` skill to create the formal specification document in `docs/specification/`.

## Step 7 — Create the Feature Branch

After the spec is approved and committed:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/<issue-number>-<short-description>
```

Branch naming rules:
- `feat/<issue>-<desc>` for new features
- `fix/<issue>-<desc>` for bug fixes
- `refactor/<issue>-<desc>` for restructuring

## Step 8 — Implement

Only now may you write code. Follow all rules in `CLAUDE.md`:
- Use correct domain terminology (camelCase enforced).
- If any database change is needed, invoke the `database-migration` skill first.
- Every feature MUST include automated tests (unit + integration).
- Run all tests before opening a PR.

## Step 9 — Open a PR

- Use Conventional Commits: `<type>(<scope>): <description>`
- PR target: **always `develop`**, never `main`.
- PR body must reference the issue number and the spec file.
- Wait for user review before merging.
