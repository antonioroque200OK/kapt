# Skill: write-spec

Create a formal specification document in `docs/specification/` following Kapt's Spec-Driven Development (SDD) conventions.
**Do NOT create a spec with `status: draft` and then immediately implement it. A spec in draft requires explicit user approval before any implementation begins.**

---

## Step 1 — Determine the Spec Category and Name

Choose the correct category prefix based on the content:

| Prefix | Use for |
|--------|---------|
| `ux-`  | UI/UX flows, screen designs, user journeys |
| `tech-`| Backend architecture, APIs, infrastructure, data models |
| `biz-` | Business rules, pricing, monetisation, go-to-market |
| `api-` | HTTP API contracts, request/response schemas, auth flows |

Name format: `<category>-<slug>.md`
- Use lowercase kebab-case for the slug.
- Be descriptive but concise (2–4 words max).
- Examples: `ux-selfie-capture.md`, `tech-auth-otp-verify.md`, `biz-photographer-incentives.md`

Confirm the name with the user before creating the file if there is any ambiguity.

## Step 2 — Check for an Existing Spec

```bash
ls docs/specification/
```

If a related spec already exists, consider whether to extend it rather than creating a new file. Avoid duplication.

## Step 3 — Create the File with YAML Front Matter

Every spec MUST begin with valid YAML front matter. Use this template:

```yaml
---
title: "<Human-readable title>"
description: "<One-sentence summary of what this spec covers>"
type: "<ux | tech | biz | api>"
epic: "<epic name, e.g. creator, seeker, platform, monetisation>"
status: "draft"
related_issues: []
---
```

Rules:
- `status` is always `"draft"` when first created.
- `related_issues` is an array of GitHub issue numbers (strings), e.g. `["42", "77"]`. Leave empty if unknown.
- Do **not** set `status: approved` yourself — only the user may do that.

## Step 4 — Write the Spec Body

Use the following section structure, adapting to the spec type. Omit irrelevant sections.

### For `ux-` specs:
```markdown
## 1. Context & Objective
## 2. UX Principles
## 3. Section / Screen Structure
## 4. Animation & Motion
## 5. Visual Direction
## 6. Content (PT-BR UI Labels)
## 7. Success Criteria
## 8. Implementation Notes
```

### For `tech-` specs:
```markdown
## 1. Context & Objective
## 2. Architecture Overview
## 3. Data Model (ERD or table definitions)
## 4. API Contract (endpoints, request/response)
## 5. Sequence Flow (Mermaid diagram recommended)
## 6. Security & LGPD Considerations
## 7. Error Handling
## 8. Test Strategy
## 9. Open Questions
```

### For `biz-` specs:
```markdown
## 1. Context & Objective
## 2. Business Rules
## 3. User Roles Affected
## 4. Metrics & Success Criteria
## 5. Edge Cases & Exceptions
## 6. Open Questions
```

### For `api-` specs:
```markdown
## 1. Context & Objective
## 2. Endpoints
## 3. Authentication & Authorization
## 4. Request / Response Schemas
## 5. Error Codes
## 6. Rate Limiting
## 7. Open Questions
```

## Step 5 — Language and Terminology

- Use **English** for all spec prose.
- Use the exact domain terms from `CLAUDE.md`: `occurrence`, `seeker`, `promoter`, `photographer`, `registeredSeeker`, etc.
- UI label examples must be written in **PT-BR** (they represent what the user sees on screen).

## Step 6 — Present the Draft to the User

After writing the spec, present a summary and ask:

> "The spec has been saved to `docs/specification/<filename>.md` with `status: draft`. Please review it. Once approved, update `status` to `approved` and we can open GitHub issues and begin implementation."

## Step 7 — Commit the Spec

Once the user approves the content (they may update `status: approved` themselves), commit with:

```bash
git add docs/specification/<filename>.md
git commit -m "docs(<category>): add <slug> spec"
```

Commit directly to `develop` (no feature branch needed for `docs:` changes, per `CLAUDE.md`).
