# Product Specification: Kapt ⚡

## 1. Executive Summary
Kapt is a specialized marketplace for endurance sports photography (cycling, running, triathlons). The platform solves the friction of finding and purchasing event photos by using AI to connect athletes directly with photographers' content.

## 2. Core Value Proposition
- **For Photographers:** Rapid upload, AI-automated indexing, and an instant storefront to monetize event coverage.
- **For Athletes:** Painless discovery of their photos via Bib Number, Facial Recognition, and GPS/Time correlation.

## 3. User Personas & Journeys

### A. The Photographer
1. **Event Creation:** Creates an event folder (e.g., "Ironman Brasil 2026").
2. **Bulk Upload:** Uploads high-res images to the cloud.
3. **AI Processing:** The system indexes images based on bibs and face features.
4. **Sales:** Monitors sales and triggers automated payouts via n8n/Stripe.

### B. The Athlete
1. **Search:** Enters bib number, uploads a selfie, or syncs Strava data.
2. **Viewing:** Browses watermarked previews optimized for mobile.
3. **Checkout:** Quick purchase via local payment methods (Pix).
4. **Delivery:** Instant access to high-res, unwatermarked files.

## 4. Key Functional Features
- **Hybrid Search Engine:** Combines OCR (Bibs), Facial Match, and PostGIS location data.
- **Action-Volt UX:** A high-contrast, lightning-fast interface for outdoor viewing.
- **n8n Automation:** Triggers WhatsApp notifications when an athlete's photo is found.

## 5. Monetization Strategy
- **Platform Fee:** Percentage-based commission on each photo sold.
- **Subscription:** Optional premium tier for photographers with advanced analytics.