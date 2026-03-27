---
title: "Kapt Project Governance & Context"
description: "Diretrizes primárias de governança, stack e comunicação para a IA."
type: "tech"
epic: "platform"
status: "approved"
---

## Gemini Skill: Kapt Project Governance & Context (v2.0)

## 1. Project Mission & Identity

Kapt is a **high-performance digital platform for the management, distribution, and monetization of official multisport event photography**. Evolving into a **DaaS (Data as a Service)** provider, it delivers hyper-segmented consumer insights based on performance and equipment usage to sports retailers and brands.

## 2. Technical Stack & AI Intelligence

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Backend:** Go (Golang) for high-concurrency API and data processing.
- **AI/ML Engine (Python):** 
  - **Models:** YOLO for object/gear detection; DeepFace/FaceNet for facial recognition; PyTorch/TensorFlow for apparel segmentation.
  - **Orchestration:** n8n manages the pipeline between uploads, AI triggers, and notifications.
- **Infrastructure:** Docker, Portainer, Traefik/Nginx, Neon (PostgreSQL) + PostGIS.

## 3. Official Glossary (Strict Camel Case)

- `seeker`: The athlete/runner (end consumer).
- `registeredSeeker`: A returning athlete with saved biometrics and LGPD opt-in.
- `occurrence`: The sporting event/cobertura.
- `promoter`: The event organizer.
- `photographer`: The professional "Creator" supplying photos.
- `actionVolt`: Our Design System (Table Black #000000, Volt #CEFF00 accent).

## 4. Evolution Roadmap

1. **Phase 1 (Current):** Infrastructure stabilization (Next.js + Go core, basic gallery, OTP auth).
2. **Phase 2 (AI Integration):**
  - **AI-Driven Automated Tagging:**
    - **Facial Recognition:** High-precision identification of athletes across thousands of photos.
    - **Equipment & Brand Detection:** Automatic identification of footwear (running shoes), apparel, and gear (bikes, helmets, watches).
4. **Phase 4 (DaaS Launch):** Predictive analytics and real-time dashboards for retailers.

## 5. Development Standards

- **Methodology:** Spec-Driven Development (SDD). All code must align with `docs/specification/`.
- **UI/UX:** Focus on "Zero-Click Discovery" and premium "Multisport Mosaic" interfaces.
- **Security:** JWT + OTP for passwordless sessions.
- **Localization:** UI labels in PT-BR; technical specs in English.
