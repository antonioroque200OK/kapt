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
- **\"Wearing\" State & Analytics:** Analysis of brand loyalty, equipment wear-and-tear levels, and color preferences to generate consumer profiles.
- **Multisport Mosaic Interface:** Dynamic, responsive home screen utilizing high-impact "Action Volt" (#CEFF00) aesthetics.
- **Zero-Click Discovery:** Registered athletes receive their private gallery automatically via biometric matching, eliminating manual search.

## 3. Technology Stack & Scalability

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Backend:** Go (Golang) for high-concurrency API and data processing.
- **AI/ML Engine (Python):** YOLO (object/gear detection), DeepFace/FaceNet (facial recognition), PyTorch/TensorFlow (segmentation).
- **Orchestration:** n8n manages the pipeline (uploads -> AI -> notifications).
- **Infrastructure:** Docker, Portainer, Traefik/Nginx, Neon (PostgreSQL) + PostGIS.

## 4. Design Style Guide (Black & Volt)

- **Palette:** Background: Absolute Black (#000000); Accent: Volt (#CEFF00) for CTAs; Secondary: Zinc Grays.
- **Typography:** Brand: Heavy, italicized bold "KAPT"; Functional: JetBrains Mono for technical labels (e.g., "COBERTURAS").

## 5. Evolution Phases

- **Phase 1 (Current):** Infrastructure stabilization. Next.js + Go core, basic gallery, and OTP authentication.
- **Phase 2 (AI Integration):** Implementation of automated facial and bib-number recognition. Launch of the "Creator Dashboard."
- **Phase 3 (Apparel & Gear Analytics):** Deployment of CV models to detect equipment brands and "wearing" states.
- **Phase 4 (DaaS Full Launch & AI Ecosystem):** - **Real-time Insights:** Dashboarding and predictive analytics for retailers.
  - **MCP Server Implementation:** Disponibilização de um servidor **Model Context Protocol (MCP)** para permitir que parceiros de varejo consultem o DaaS do Kapt via agentes de IA, extraindo insights de mercado via linguagem natural de forma segura e padronizada.

## 6. Official Glossary

- `seeker`: The athlete/runner (end consumer).
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `occurrence`: The sporting event.
- `promoter`: The event organizer.
- `photographer`: The professional "Creator" supplying photos.
- `Kaptured`: A photo successfully identified by the AI.
- `Action Volt`: The primary brand color (#CEFF00).

## 🟢 Addendum: Intelligent Journey & Conversion Logic

### 1. Seeker Experience & Gamification
- **Welcome Pioneer (Discount)**: 20% discount on the first purchase. Triggered on first login + selfie + profile validation.
- **Historical Pack (Reward)**: 1 free instagrammable photo (with Kapt seal) upon discovery of photos in past occurrences.
- **Volume Tier (Pack)**: Progressive discount per transaction: 30% for 3-5 photos, 40% for 6-8 photos, 50% for 9+ photos.
- **Zero-Click Discovery**: Upon OTP validation, Newbies are forced into a "Selfie Prompt" to unlock their private gallery.
- **Social Version (Gift Strategy)**: To protect revenue, free downloads are not granted upfront. Instead, a Legacy Seeker receives one "Social Version" (9:16 auto-cropped photo with a minimalist 'kapt.life' frame) for every 5 paid photos in their global history.
- **AI Selection**: The system automatically selects the "best" aesthetic photo (based on focus/framing scores) to be the designated Social Gift, minimizing user decision friction and backend processing.

### 2. 🔑 Access & Navigation Policy
- **Freedom of Content**: Access to "Blog", "Sobre", and "Coberturas" (B-roll) is unrestricted for all users, including Newbies.
- **Selective Friction**: The Facial Scan Modal is triggered ONLY when a user attempts to access personalized data via UI labels like "BUSCAR MINHAS FOTOS" or "MINHA ÁREA".
- **Graceful Dismissal**: If a user closes the Selfie Modal, they are returned to their previous public view without forced logout.

### 3. Creator (Photographer) Tier System
- **Founder Alpha**: Registration within 60 days (Pre-launch) + 20GB photo archive (min 2GB in under 30 days). Benefits: 0% fee during launch, 5% lifetime fee post-launch. Limits: Valid for 60 days of launch or up to R$ 5,000.00 in total sales.
- **Founder Creator**: Registration within 60 days (Pre-launch) + 2GB photo archive in under 30 days. Benefits: 0% fee during launch, 10% lifetime fee post-launch. Limits: Valid for 60 days of launch or up to R$ 5,000.00 in total sales.
- **Standard Creator**: Registration after the official launch window. Benefits: 15% fixed flat fee continuously.
- **B-roll / Showcase Bounty**: A one-time fixed reward (e.g., R$ 5.00) is granted per Occurrence once the photographer completes the "Showcase Mission" (uploading at least 20 valid context photos).

### 4. Infrastructure & AI Efficiency
- **On-the-fly Processing**: 9:16 Story/Reels cropping is triggered only upon download/share requests via serverless functions (e.g., AWS Lambda) to keep GPU costs low.
- **Empty State Design**: Occurrences lacking B-roll will display an "Asphalt Black" hero/mosaic with a 20% opacity KAPT watermark and "Awaiting curation" label to maintain premium branding.