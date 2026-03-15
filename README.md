# Kapt ⚡

**O Hub de Alta Performance para Fotografia de Esportes de Endurance.**

O Kapt é uma plataforma especializada desenvolvida para conectar atletas (ciclistas, corredores) a fotógrafos profissionais, utilizando indexação por IA e fluxos de trabalho automatizados.

## 🏗 Arquitetura

Este projeto é um Monorepo de alta performance gerenciado pelo **Turborepo** utilizando **npm**.

- **`/apps/web`**: Aplicação Web em Next.js 16.1.5 (Action-Volt Design).
- **`/apps/mobile`**: Aplicação Mobile (Expo/React Native).
- **`/services/api`**: Backend em Go (Nativo `net/http`, SQLC, Neon Postgres).
- **`/docs/specification`**: Fonte única da verdade para [Spec-Driven Development](./docs/specification).

## 🏗️ Project Structure (Monorepo)

O projeto utiliza **Turborepo** para gerenciar as aplicações e serviços, garantindo isolamento tecnológico e alta performance no pipeline de build.

```text
.
├── apps/
│   ├── web/                # Seeker Dashboard (Next.js + Tailwind)
│   ├── mobile/             # App do Cidadão (React Native + Nativewind) - [Em breve]
│   └── base/               # Landing Page & Design Foundation
├── services/
│   └── api/                # Backend em Go (Clean Architecture / Hexagonal)
│       ├── cmd/api/        # Ponto de entrada (main.go)
│       ├── internal/       # Lógica de Negócio Encapsulada
│       │   ├── handler/    # Adaptadores de Entrada (HTTP/REST)
│       │   ├── service/    # Regras de Domínio e Casos de Uso
│       │   └── repository/ # Adaptadores de Saída (Persistência/DB)
│       └── sqlc/           # Schemas e Queries SQL (Type-safe)
├── packages/               # Configurações e bibliotecas compartilhadas
│   ├── ui/                 # Componentes de interface compartilhados
│   ├── typescript-config/  # Configurações de TS padronizadas
│   └── eslint-config/      # Regras de Linting do projeto
├── compose.yaml            # Orquestração de containers (DB, API, Web)
└── turbo.json              # Pipeline de execução do Turborepo

## 🚀 Início Rápido
1. Certifique-se de ter o **Docker** instalado.
2. Instale as dependências: `npm install`.
3. Inicie o ambiente de desenvolvimento: `npx turbo dev`.

---
*Documentado com SDD e Gemini Skills para o ambiente Antigravity.*
