---
title: "About Pre-Launch (Photographers)"
description: "Cinematic landing page to attract photographers during Kapt pre-launch."
type: "ux"
epic: "creator"
status: "approved"
related_issues: ["80"]
---

## 1. Context & Objective

Create a high-impact ABOUT page for pre-launch, focused on attracting photographers and measuring interest. The experience should be memorable, emotional, and guided by visual storytelling, respecting the Style Guide (actionVolt, asphaltBlack, JetBrains Mono).

## 2. UX Principles

- **Cinematic, yet clear**: visual impact with objective readability.
- **Scroll-led narrative**: chained sections presenting value, proof, and CTA.
- **Performance-aware**: faded videos with static fallback.
- **Accessible**: proper contrast, legibility, visible focus.

## 3. Section Structure (Scroll Story)

1. **Immersive Hero**
   - Background: low-opacity athlete video + subtle grain.
   - Short headline (1 line), subheadline with main benefit.
   - Primary CTA: “Quer fotografar?” (actionVolt).

2. **Visual Manifesto**
   - Short grid text with keywords (ex: Impacto, Alcance, Valor).
   - Staggered reveal animations.

3. **What Kapt Is (For Photographers)**
   - 3 cards with benefits: descoberta, monetização, vitrine.

4. **Social Proof / Mission**
   - Big-number row (ex: eventos, atletas, alcance).
   - Placeholder until real data exists.

5. **Simplified Flow**
   - Visual steps: Capture → Kapt AI → Vendas → Insights.

6. **Final CTA**
   - Direct copy + “Quero fotografar” button.
   - Clean dark background (no video) for focus.

## 4. Animation & Motion

- **Section reveals**: soft fade + slide.
- **Light parallax** on hero/manifesto backgrounds.
- **Stagger** for lists and cards.
- **Optional scroll snap** (evaluate UX impact on mobile).

## 5. Visual Direction

- **Colors**: asphaltBlack base; actionVolt for CTAs and highlights.
- **Typography**: JetBrains Mono for labels and microcopy; headline in bold display style (keep flexible to the project’s existing font).
- **Texture**: subtle grain in the hero.

## 6. Content (PT-BR UI Labels)

- Direct, premium, and technical tone.
- Avoid heavy jargon.

## 7. Success Criteria

- Increase in clicks on “Quero fotografar”.
- Higher average time on page vs. previous versions.
- Smooth UX on mobile and desktop.

## 8. Implementation Notes

- Use `prefers-reduced-motion` to reduce animations.
- Video fallback: static image.
- Sections must be responsive and highly legible.
