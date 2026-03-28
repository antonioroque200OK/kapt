# Kapt ⚡

**O Hub de Alta Performance para Fotografia de Esportes de Endurance.**

Kapt é uma plataforma especializada que conecta atletas a fotógrafos profissionais, utilizando indexação por IA e fluxos de trabalho automatizados.

---

## 🏗 Arquitetura

Monorepo gerenciado pelo **Turborepo** com **npm**.

```text
.
├── apps/
│   ├── web/                # Seeker Dashboard (Next.js 16 + Tailwind)
│   ├── base/               # Landing Page & Design Foundation
│   └── mobile/             # App Mobile (React Native) — Em breve
├── services/               # Backend em Go (net/http, SQLC, Neon Postgres)
│   ├── cmd/api/            # Ponto de entrada (main.go)
│   └── internal/
│       ├── handler/        # Adaptadores HTTP/REST
│       ├── service/        # Regras de Domínio
│       └── repository/     # Persistência (SQLC)
├── docs/specification/     # Fonte única da verdade (Spec-Driven Development)
├── compose.yaml            # Orquestração Docker (DB + Workspace)
└── turbo.json              # Pipeline Turborepo
```

---

## 🚀 Início Rápido

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- Git

> Node.js e Go **não precisam** estar instalados no host — tudo roda dentro do container `kapt_workspace`.

---

### 1. Clonar e subir os containers

```bash
git clone https://github.com/Kapt-tech/kapt.git
cd kapt
docker compose up -d
```

Isso inicia dois serviços:
- `kapt_db_dev` — PostgreSQL + PostGIS na porta `5433`
- `kapt_workspace` — Ambiente de desenvolvimento (Node, Go, npm)

---

### 2. Entrar no workspace

```bash
docker exec -it kapt_workspace bash
```

Todos os comandos a seguir são executados **dentro deste container**.

---

### 3. Instalar dependências

```bash
cd /workspace
npm install
```

---

### 4. Rodar a aplicação Web

```bash
cd /workspace/apps/web
npm run dev
```

Acesse em: **[http://localhost:3000](http://localhost:3000)**

---

### 5. Rodar o backend Go

O backend requer duas variáveis de ambiente:

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_SOURCE` | Connection string do PostgreSQL | `postgresql://kapt_admin:kapt_password@localhost:5432/kapt_local?sslmode=disable` |
| `JWT_SECRET` | Segredo HS256 para assinar JWTs (mínimo 32 chars) | `meu-segredo-super-secreto-kapt!!` |

```bash
cd /workspace/services
DB_SOURCE="postgresql://kapt_admin:kapt_password@localhost:5432/kapt_local?sslmode=disable" \
JWT_SECRET="meu-segredo-super-secreto-kapt!!" \
go run ./cmd/api
```

---

## 🧪 Testes

### Frontend (React Testing Library + Jest)

```bash
cd /workspace/apps/web
npm test
```

### Backend (Go)

```bash
cd /workspace/services
go test ./...
```

---

## 🗄 Banco de Dados

O banco local sobe automaticamente com `docker compose up -d`.

| Campo | Valor |
|---|---|
| Host (fora do container) | `localhost:5433` |
| Host (dentro do container) | `localhost:5432` |
| Usuário | `kapt_admin` |
| Senha | `kapt_password` |
| Database | `kapt_local` |

As migrations ficam em `services/sqlc/migration/`.

---

## 📚 Documentação

- **Specs:** `docs/specification/` — fonte da verdade para todas as features
- **Regras de negócio e convenções de código:** `CLAUDE.md`
- **PRD:** `docs/PRD-Executivo.md`
