# Skill: open-pr

Open a Pull Request from a completed feature branch into `develop`.
**Never open a PR directly to `main`. Never merge without user review.**

---

## Step 1 — Verify Tests Pass

Before anything else, run the full test suite:

```bash
# Go services
cd services && go test ./...

# Frontend (if applicable)
cd apps/web && npm run test
# or
cd apps/web && npm run lint && npm run build
```

If any test fails, **stop**. Fix the failures before proceeding.

## Step 2 — Review the Diff

Inspect all changes in the branch:

```bash
git diff develop..HEAD --stat
git diff develop..HEAD
```

Check for:
- Accidental debug code or `console.log` / `fmt.Println` left in.
- Hardcoded secrets, tokens, or environment-specific values.
- Hand-edited `*.sql.go` files (these must never be manually modified — regenerate with `sqlc generate`).
- Missing tests for new code paths.
- Any UI labels not in PT-BR.

## Step 3 — Verify Commit History

```bash
git log develop..HEAD --oneline
```

Every commit must follow Conventional Commits format:

```
<type>(<scope>): <description>
```

| Type | When to use |
|------|-------------|
| `feat` | New feature or behaviour |
| `fix` | Bug fix |
| `refactor` | Code change with no behaviour change |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `style` | Formatting, whitespace |
| `chore` | Build system, dependencies |

If any commit message is malformed, squash or amend before opening the PR.

## Step 4 — Push the Branch

```bash
git push origin <branch-name>
```

## Step 5 — Write the PR Body

Use this template for the PR description:

```markdown
## Summary
<2–3 sentences describing what this PR accomplishes and the approach taken.>

## Changes
- <Key change 1>
- <Key change 2>
- <Key change 3>

## Related
- Closes #<issue-number>
- Spec: [`<filename>.md`](docs/specification/<filename>.md)

## Test Plan
- [ ] Unit tests: `go test ./...` passes
- [ ] Integration tests: <describe what was tested>
- [ ] Manual verification: <describe what you checked in the browser/API>

## Screenshots (if UI changes)
<Attach before/after screenshots or screen recordings if any UI changed.>

## Checklist
- [ ] Tests written and passing
- [ ] No hardcoded secrets
- [ ] UI labels in PT-BR
- [ ] Conventional Commits format used
- [ ] PR targets `develop`, not `main`
```

## Step 6 — Open the PR

```bash
gh pr create \
  --base develop \
  --title "<type>(<scope>): <description>" \
  --body "<body from template above>"
```

PR title must also follow Conventional Commits format.

Confirm the PR was created and share the URL with the user:

```bash
gh pr view --web
```

## Step 7 — Wait for User Review

**Do not merge.** Notify the user that the PR is open and awaiting their review.

> "PR is open at <URL>. Please review before merging. I will not merge without your explicit approval."

## Step 8 — After Merge (if requested by user)

Once the user approves and merges, run the `sync-fork` skill to bring the personal fork's `develop` back in sync with upstream.
