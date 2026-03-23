---
title: "Seeker Identification & Privacy Flow"
description: "Fluxo arquitetural de busca por biometria/bib e implementação da barreira de privacidade (LGPD)."
type: "ux"
epic: "seeker"
status: "approved"
related_issues: ["UC02", "UC03"]
---

# Spec: Seeker Identification & Privacy Flow

## 1. Context & Objectives

Implement a secure, LGPD-compliant entry point for Seekers, emphasizing Zero-Click Discovery for returning users and frictionless onboarding for new ones.

## 2. Architecture & Data Flow

1. **Occurrence Landing:** Displays public B-roll imagery (The Vitrine). If no B-roll exists, an `actionVolt` abstract fallback cover is used.
2. **Identification Engine:**
   - **New `seeker`:** Passwordless OTP modal -> Selfie upload -> LGPD Opt-in.
   - **`registeredSeeker`:** Zero-Click Discovery. Biometrics match on page load.
3. **Private Gallery:** Matches appear in an exclusive UI container titled **"🔒 Sua Galeria Privada"**, segregated from public B-roll.
4. **Checkout (The Upsell):** B-roll is NEVER sold individually. Users are prompted with a choice: buy single photos or the complete "Pack de Recordação" (All user photos + All B-roll).

## 3. Business Rules Implementation

- **Dynamic Tags (UI):**
  - Future: "Em breve"
  - Past: "Fotos Disponíveis"
- **Monetization & Incentives:**
  - **Global Opt-in:** Rewards user with 1st free photo in the subsequent event.
  - **Brand Detection:** +5% conditional payout bonus for photographers.

## 4. Success Criteria

- Zero unauthorized exposure of third-party faces.
- Flawless execution of Zero-Click Discovery for authenticated `registeredSeekers`.
