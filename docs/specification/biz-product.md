---
title: "Product Specification"
description: "Definição do produto, personas principais (Fotógrafo e Atleta) e jornadas de uso do Kapt."
type: "biz"
epic: "platform"
status: "approved"
related_issues: []
---

# Product Specification: Kapt ⚡

## 1. Executive Summary

Kapt is a high-performance marketplace for endurance sports photography. It masks a powerful B2B Data-as-a-Service (DaaS) engine behind a frictionless B2C photo purchasing experience.

## 2. User Personas & Journeys

### A. The Photographer (Supply)

1. **Zero-Touch Upload:** Drags and drops a folder of high-res images. The system processes silently in the background.
2. **Dopamine Post-Upload Report:** Views a gamified summary displaying equipment detected and *potential* extra earnings.
3. **LGPD Bounty:** Uploads 20 B-roll/context photos to secure the event's public showcase, earning a fixed micro-bonus (e.g., R$ 5.00).
4. **Conditional Sales:** Earns a standard commission + a 5% AI bonus ONLY when the `seeker` purchases a photo with detected brands.

### B. The Seeker & Registered Seeker (Demand)

1. **Frictionless Onboarding:** A generic `seeker` enters via Passwordless authentication (OTP via WhatsApp/Email) + immediate Selfie capture.
2. **Zero-Click Discovery:** A `registeredSeeker` logs in, and the system instantly matches biometrics, displaying their photos at the top of the page under "🔒 Sua Galeria Privada".
3. **Upsell Checkout:** Chooses an individual photo or is induced to buy the "Pack de Recordação" (which includes all their photos + all B-roll).
4. **Smart Delivery:** Downloads selected photos to mobile, or requests a `.zip` file via email to prevent mobile storage overload.

## 3. Occurrence Expansion Strategy

- **Phase 1 (MVP):** Manual creation of `occurrences` by the internal Kapt team to ensure quality.
- **Phase 2 (Scale):** Automated extraction (via tools like ScrapingBee) from national calendars (TicketSports, etc.) to auto-populate the platform.
- **Empty States (UI Fallback):** If an `occurrence` lacks B-roll, the public showcase collapses and a dynamic `actionVolt` abstract sport cover is applied.
