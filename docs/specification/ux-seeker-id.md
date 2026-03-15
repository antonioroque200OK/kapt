# Spec: Seeker Identification & Privacy Flow

## 1. Context & Objectives
Implement a secure, LGPD-compliant entry point for Seekers to access their photos while capturing retail-relevant data.

## 2. Architecture & Data Flow
1. **Occurrence Landing:** Displays metadata and atmosphere (B-roll) imagery only.
2. **Identification Engine:**
   - **Methods:** Selfie upload or Event Organizer Bib Number.
   - **Privacy Wall:** Mandatory LGPD Opt-in (Global or Event-specific) required before displaying any matched results.
3. **Private Gallery:** Renders "Kaptured" photos exclusive to the identified Seeker.
4. **Checkout:** Transactional flow including coupons and "Pack de Recordação" (B-roll) upsell.

## 3. Business Rules Implementation
- **Dynamic Tags (UI):**
  - Future: "Em breve"
  - Past: "Fotos Disponíveis"
  - *Note: "Acontecendo" status is currently deprecated.*
- **Monetization & Incentives:**
  - **Global Opt-in:** Rewards user with 1st free photo in the subsequent event.
  - **Brand Detection:** +5% payout bonus for photographers on clear gear/brand visibility.

## 4. Success Criteria
- Zero unauthorized exposure of third-party faces.
- Accurate persistent storage of Opt-in status in PostgreSQL.
