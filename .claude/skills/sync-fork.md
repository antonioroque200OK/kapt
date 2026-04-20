# Skill: sync-fork

Run this skill after every merge to `develop` in the upstream `Kapt-tech/kapt` repository.
Its purpose is to keep the personal fork's `develop` branch in perfect sync with upstream.

---

## When to Run This

- After a PR is merged into `develop` on the upstream repository.
- Before starting a new feature branch (to ensure you branch from a fresh `develop`).
- When the user explicitly requests a fork sync.

---

## Step 1 — Verify Remote Configuration

Confirm both remotes exist:

```bash
git remote -v
```

Expected output should include:
- `origin` → your personal fork (e.g., `git@github.com:<your-username>/kapt.git`)
- `upstream` → the canonical repo (e.g., `git@github.com:Kapt-tech/kapt.git`)

If `upstream` is missing, add it:

```bash
git remote add upstream git@github.com:Kapt-tech/kapt.git
```

## Step 2 — Fetch Upstream Changes

```bash
git fetch upstream develop
```

## Step 3 — Switch to develop

```bash
git checkout develop
```

## Step 4 — Hard Reset to Upstream

```bash
git reset --hard upstream/develop
```

> ⚠️ This is a **destructive** operation on the local `develop` branch. Any local commits on `develop` that are not in `upstream/develop` will be lost. This is intentional — `develop` should be a mirror of upstream, not a place for local work.

## Step 5 — Push to Personal Fork

```bash
git push origin develop
```

If the push is rejected (because of the hard reset), force-push:

```bash
git push origin develop --force
```

## Step 6 — Confirm Sync

Verify local and remote are in sync:

```bash
git log --oneline -5
git log --oneline origin/develop -5
```

Both should show the same top 5 commits.

---

## After Syncing

If you are about to start a new feature, proceed with:

```bash
git checkout -b feat/<issue-number>-<short-description>
```

This ensures your feature branch is always based on the latest `develop`.
