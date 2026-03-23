---
title: "Kapt - Documento Mestre de Produto (PRD Executivo)"
description: "Visão executiva do modelo de negócios DaaS, monetização e jornadas (B2B/B2C). Documento voltado para leitura humana (Investidores/Sócios)."
type: "presentation"
epic: "platform"
status: "approved"
ai_instruction: "DO NOT use this file for code generation. Refer to the specific /specification/*.md files for SDD."
---

📖 Master Product Requirements Document (PRD) - Kapt

1. Product Vision (Elevator Pitch)
Kapt is not just a sports photography marketplace. It is a B2B DaaS (Data-as-a-Service) platform disguised as a B2C photography e-commerce. We use photo sales as a vehicle to capture, process via AI (Computer Vision), and structure valuable sports retail data (brands, equipment, wear and tear), selling this intelligence to the market.

2. Official Kapt Glossary
To maintain consistency across code and communication, these are the immutable system entities (using Camel Case for technical references):

seeker: The athlete/runner (the end customer who buys the photo).

registeredSeeker: A returning athlete who already has an account, saved biometrics, and LGPD opt-in.

occurrence: The sporting event (e.g., Maratona SP, Corrida de São Luís).

promoter: The event organizer/race director.

photographer: The freelance photographer (our supplier).

actionVolt: Our Design System (UI/UX in Dark Mode with neon/electric details for high contrast and premium aesthetics).

1. Monetization Architecture (How Kapt makes money)
The Base (B2C - Marketplace): Sale of individual photos or the complete package (UI Label: "Pack de Recordação") directly to the seeker.

Tier 1 (B2B - Reports): Providing profile and equipment data to the promoter, allowing them to sell more expensive sponsorship quotas.

Tier 2 (B2B - Targeted Advertising): Kapt sells "Access" to brands (e.g., Asics pays to send a coupon to registeredSeekers who ran with worn-out shoes).

Tier 3 (B2B - Infrastructure/API): Licensing our real-time image processing API to retail giants (e.g., Centauro) to create campaigns in their own apps.

1. Photographer Journey (Supply)
The goal is to retain the supplier through zero friction and financial gamification.

Zero-Touch Upload: The photographer simply drags the folder. The system processes everything in the background.

Post-Upload Report (Dopamine Trigger): At the end of the upload, we display a summary showing how much equipment the AI detected and the potential extra earnings tied to that reading.

Conditional Commission (Cash Protection): The photographer receives the AI bonus (+5%) for photos where equipment was detected only if the photo is purchased by the seeker.

The B-Roll Rule (LGPD Bounty): To ensure the public showcase of the event without violating the LGPD, we pay a fixed micro-bonus (e.g., R$ 5.00) for the first 20 context photos (asphalt, finish line, medals) uploaded.

1. Seeker Journey (Demand)
The goal is maximum conversion with zero unnecessary clicks.

Zero-Click Discovery (The Magic): If the user is a registeredSeeker and logged in, the backend matches their biometrics on page load. Their photos immediately appear at the top of the occurrence page in a section labeled "🔒 Sua Galeria Privada".

Frictionless Onboarding: Passwordless authentication modal (Email/WhatsApp + 4-digit OTP), followed immediately by a selfie request. No long forms.

Upsell Strategy (Pack de Recordação): B-roll is never sold individually. It is used as leverage. The seeker can buy a single photo (e.g., R$ 15.00) or be induced to take all their photos + all the event's B-roll (UI Label: "Pack de Recordação") for an anchored price (e.g., R$ 39.90).

Storage Management: Delivery focuses on the cloud gallery. If the user wants the complete Pack, we send a link to a .zip file via email so we don't crash their mobile device storage.

1. Expansion Strategy (Occurrences)
Kapt owns the calendar to avoid depending on the promoter in the early stages.

Phase 1 (MVP - São Luís): Manual insertion of occurrences by our internal team (Control and Quality).

Phase 2 (Scale): Use of ScrapingBee to pull national calendars (TicketSports, etc.) and automatically populate our database.

Empty States (Contingency): If a race has no B-roll from the photographer, the page collapses the public showcase and the event card gets a dynamic abstract cover based on the sport (UI Fallback).
