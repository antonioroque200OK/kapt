# Skill: new-github-issue

Create one or more GitHub issues following the Kapt issue template and Kanban conventions.
All issues must be traceable to a spec in `docs/specification/`.

---

## Step 1 — Identify the Source Spec

Every issue must originate from an approved spec. Confirm:
- Which spec file does this issue relate to? (e.g., `ux-selfie-capture.md`, `tech-auth-otp-verify.md`)
- Is the spec `status: approved`? If it is `status: draft`, **do not create issues** — the spec must be approved first.

```bash
head -10 docs/specification/<filename>.md
```

## Step 2 — Determine the Epic and Scope

From the spec front matter and `CLAUDE.md`, identify:
- **Epic name** (e.g., `creator`, `seeker`, `platform`, `monetisation`)
- **Issue mapping category**:
  - Backend/DB → relates to `tech-core.md`
  - Infra/Storage → relates to `tech-storage.md`
  - UI/UX/Frontend → relates to `ux-[feature].md`
  - Business/Pricing → relates to `biz-[feature].md`

## Step 3 — Break Down into Granular Tasks

Decompose the spec into the smallest independently-deliverable issues. Good issues:
- Can be completed in a single feature branch.
- Have a clear, verifiable definition of done.
- Are not blocked by more than one other issue.

Present the list of proposed issues to the user for review before creating any.

**Issue title format:** `[Epic: <NAME>] <Action> <Subject>`
- Example: `[Epic: Creator] Implement OTP authentication endpoint`
- Example: `[Epic: Seeker] Add selfie capture modal with LGPD consent`

## Step 4 — Draft Each Issue Using the Standard Template

For each issue, prepare the following body:

```markdown
## Objective
<One paragraph describing what this issue accomplishes and why it matters to the product.>

## Tasks for Claude Code
- [ ] <Specific, actionable implementation task>
- [ ] <Another task>
- [ ] Write unit tests for <component>
- [ ] Write integration tests for <flow>
- [ ] Update relevant documentation

## Related Specs
- [`<filename>.md`](docs/specification/<filename>.md)

## Acceptance Criteria
- [ ] <Verifiable outcome 1>
- [ ] <Verifiable outcome 2>
```

Rules:
- Always include at least one test task.
- Always link to the related spec file.
- Keep "Tasks for Claude Code" concrete enough that I can act on them without guessing.

## Step 5 — Review with User

Present all drafted issues in a table:

| # | Title | Labels | Spec |
|---|-------|--------|------|
| 1 | [Epic: X] ... | `feat`, `backend` | `tech-x.md` |

Ask: **"Do you approve these issues? Should I create them on GitHub?"**

## Step 6 — Create Issues on GitHub

Only after explicit approval, create each issue:

```bash
gh issue create \
  --title "[Epic: <NAME>] <Title>" \
  --body "<body from template above>" \
  --label "<label1>,<label2>"
```

Common labels: `feat`, `fix`, `refactor`, `test`, `backend`, `frontend`, `database`, `infra`, `blocked`.

After creation, note the issue numbers and update `related_issues` in the spec front matter:

```bash
# Edit docs/specification/<filename>.md to add issue numbers
git add docs/specification/<filename>.md
git commit -m "docs(<category>): link issues to <slug> spec"
```

## Step 7 — Batch Creation (For New Epics)

When populating the Kanban for an entire epic at once:
1. Read all relevant spec files for the epic.
2. Identify all cross-cutting concerns (auth, DB, UI, tests).
3. Check for dependencies between proposed issues and order them.
4. Present the full batch for review before creating any.
