# Kapt ⚡

**O Hub de Alta Performance para Fotografia de Esportes de Endurance.**

O Kapt é uma plataforma especializada desenvolvida para conectar atletas (ciclistas, corredores) a fotógrafos profissionais, utilizando indexação por IA e fluxos de trabalho automatizados.

## 🏗 Arquitetura
Este projeto é um Monorepo de alta performance gerenciado pelo **Turborepo** utilizando **npm**.

- **`/apps/web`**: Aplicação Web em Next.js 16.1.5 (Action-Volt Design).
- **`/apps/app`**: Aplicação Mobile (Expo/React Native).
- **`/services/api`**: Backend em Go (Nativo `net/http`, SQLC, Neon Postgres).
- **`/.spec`**: Fonte única da verdade para [Spec-Driven Development](./.spec).

## 🚀 Início Rápido
1. Certifique-se de ter o **Docker** instalado.
2. Instale as dependências: `npm install`.
3. Inicie o ambiente de desenvolvimento: `npx turbo dev`.

---
*Documentado com SDD e Gemini Skills para o ambiente Antigravity.*