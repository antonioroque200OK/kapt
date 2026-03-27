---
title: "Kapt - Documento Mestre de Produto (PRD Executivo)"
description: "Visão executiva do modelo de negócios DaaS, monetização e jornadas (B2B/B2C). Documento voltado para leitura humana (Investidores/Sócios)."
type: "presentation"
epic: "platform"
status: "approved"
ai_instruction: "DO NOT use this file for code generation. Refer to the specific /specification/*.md files for SDD."
---

## Master Product Requirements Document (PRD) - Kapt (v2.0)

## 1. Project Identity & Mission Statement

Kapt is a high-performance digital platform for the management, distribution, and monetization of official multisport event photography. By leveraging Computer Vision (CV) and AI, Kapt automates the bridge between professional "Creators" (photographers) and athletes. Its ultimate evolution is a **Data as a Service (DaaS)** provider, delivering hyper-segmented consumer insights—based on actual performance and equipment usage—to sports retailers and brands.

## 2. Core Features & AI Capabilities

- **AI-Driven Automated Tagging:**
    - **Facial Recognition:** High-precision identification of athletes across thousands of photos.
    - **Equipment & Brand Detection:** Automatic identification of footwear (running shoes), apparel, and gear (bikes, helmets, watches).
- **"Wearing" State & Analytics:** Analysis of brand loyalty, equipment wear-and-tear levels, and color preferences to generate consumer profiles.
- **Multisport Mosaic Interface:** Dynamic, responsive home screen utilizing high-density image grids for active "Coberturas."
- **Secure OTP Authentication:** Passwordless, friction-free login flow via email/mobile.
- **DaaS Market Intelligence:** Aggregated data on brand dominance, gear lifespan, and demographic equipment trends.

## 3. Technical Stack & Architecture

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Backend:** Go (Golang) for high-concurrency API and data processing.
- **AI/ML Engine (Python):** YOLO (object/gear detection), DeepFace/FaceNet (facial recognition), PyTorch/TensorFlow (segmentation).
- **Orchestration:** n8n manages the pipeline (uploads -> AI -> notifications).
- **Infrastructure:** Docker, Portainer, Traefik/Nginx, Neon (PostgreSQL) + PostGIS.

## 4. Design Style Guide (Black & Volt)

- **Palette:** Background: Absolute Black (#000000); Accent: Volt (#CEFF00) for CTAs; Secondary: Zinc Grays.
- **Typography:** Brand: Heavy, italicized bold "KAPT"; Functional: Monospaced for technical labels (e.g., "COBERTURAS").

## 5. Evolution Phases

- **Phase 1 (Current):** Infrastructure stabilization. Next.js + Go core, basic gallery, and OTP authentication.
- **Phase 2 (AI Integration):** Implementation of automated facial and bib-number recognition. Launch of the "Creator Dashboard."
- **Phase 3 (Apparel & Gear Analytics):** Deployment of CV models to detect equipment brands and "wearing" states.
- **Phase 4 (DaaS Full Launch):** Real-time dashboarding and predictive analytics for retailers.

## 6. Official Glossary

- `seeker`: The athlete/runner (end consumer).
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `occurrence`: The sporting event.
- `promoter`: The event organizer.
- `photographer`: The professional "Creator" supplying photos.
- `actionVolt`: Our Design System (Table Black + Volt accent).
