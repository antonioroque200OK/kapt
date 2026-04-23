---
title: "Kapt Prompt Library"
description: "Templates práticos para uso com Skills no desenvolvimento do Kapt."
type: "tooling"
epic: "platform"
status: "active"
related_issues: []
---

## 📌 Purpose

Reusable prompt templates for interacting with Claude Code using Kapt Skills.

This file is for HUMAN use.

---

## 🧩 Prompt Master

```text
Use the appropriate Kapt skill.

Task:
<describe clearly>

Relevant specs:
- docs/specification/<file>.md

Constraints:
- <constraints>

Focus:
- <focus>

---

## Example of Use

### 🧱 Occurrence Status (Backend + UX)

```text
Use skill new-feature.

Task:
Design and implement the Occurrence status lifecycle to support the Home experience before public photos are widely available.

Relevant specs:
- docs/specification/tech-core.md
- docs/specification/tech-system-design.md
- docs/specification/ux-sobre-prelaunch.md

Constraints:
- do not introduce DB enums yet
- keep compatibility with sqlc
- do not add multiple boolean flags prematurely
- do not refactor unrelated parts of the system
- must support launch with little or no public photos
- respect LGPD constraints (no identifiable public faces)

Focus:
- define a clear set of statuses for Occurrence
- map backend status → UI labels (PT-BR)
- ensure incremental adoption (no breaking changes)
- support Home grid behavior without relying on photo volume