# Skill: start-issue

Pick up a specific GitHub issue from the Kanban "To Do" column and prepare everything needed before writing a single line of code.
**Do NOT write any code until the implementation plan is approved by the user.**

---

## Step 1 — Fetch the Issue

```bash
gh issue view <ID>
```

Read the full issue body carefully. Identify:
- Objective
- Tasks for Claude Code
- Related Specs
- Acceptance Criteria

## Step 2 — Sync the Fork First

Before creating a branch, ensure `develop` is up to date. Run the `sync-fork` skill:

```bash
git fetch upstream develop
git checkout develop
git reset --hard upstream/develop
git push origin develop
```

## Step 3 — Read All Related Specs

For each spec listed in the issue's "Related Specs" section:
1. Open the file in `docs/specification/`.
2. Confirm `status: approved` — if `status: draft`, **stop and notify the user** before proceeding.
3. Extract relevant business rules, UI constraints, and technical requirements.

Also re-read `CLAUDE.md` to refresh:
- Domain terminology (use exact camelCase terms).
- LGPD and privacy constraints if the issue touches photos, biometrics, or personal data.
- Design system tokens if the issue is UI-facing.

## Step 4 — Understand the Current Codebase

Explore the relevant code areas before planning:
- Which files/packages will be touched?
- Are there existing patterns you should follow (handlers, middleware, queries)?
- Are there existing tests to extend?
- Does this issue require a database change? If yes, the `database-migration` skill must be invoked during implementation.

## Step 5 — Create an Implementation Plan

Write a step-by-step plan covering:

1. **Branch**: name following `<type>/<issue>-<desc>` format.
2. **Files to create or modify**: list each file and what changes.
3. **Database changes**: list any new migrations needed (invoke `database-migration` skill when implementing).
4. **API changes**: new endpoints or modified contracts.
5. **Test plan**: what unit, integration, and/or e2e tests will be written.
6. **Open questions**: anything ambiguous that needs user clarification.

Present the plan clearly and ask: **"Do you approve this plan? Should I start implementing?"**

## Step 6 — Create the Feature Branch

Only after explicit approval:

```bash
git checkout develop
git checkout -b <type>/<issue-number>-<short-description>
```

Branch naming:
| Type | When | Example |
|------|------|---------|
| `feat/` | New feature | `feat/25-selfie-capture` |
| `fix/` | Bug fix or security patch | `fix/38-auth-hardening` |
| `refactor/` | Code restructuring | `refactor/12-auth-middleware` |
| `test/` | Tests only | `test/25-selfie-coverage` |

Always include the issue number.

## Step 7 — Implement

Work through each task in the issue's "Tasks for Claude Code" checklist:
- Check off tasks as you complete them.
- Follow domain terminology strictly.
- Invoke `database-migration` skill if any schema change is needed.
- Write tests as you go — do not leave them to the end.

## Step 8 — Verify Before PR

Run all relevant tests:

```bash
# Go services
cd services && go test ./...

# Frontend (if applicable)
cd apps/web && npm run test
```

Confirm every Acceptance Criterion in the issue is met before proceeding to open a PR.
Then invoke the `open-pr` skill.
