# BuzzQ Frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for the existing FastAPI backend.

## Architecture

Single Next.js application with:

- **Main app** — marketing, staff dashboard, customer join/ticket (`localhost:3000`)
- **Admin app** — `/admin/*` routes; on `localhost:3001` middleware rewrites into `/admin`

Tokens are stored in **httpOnly cookies** via BFF route handlers (`/api/auth/*`). `API_URL` is server-only.

OpenAPI source of truth: [`openapi.json`](./openapi.json).

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Admin host locally:

```bash
npm run dev:admin
```

Requires FastAPI at `API_URL` (default `http://localhost:8000`).

## Key routes

| Route | Purpose |
|---|---|
| `/` | Marketing (ISR) |
| `/login` | Personnel auth → `POST /auth/personnel/token` |
| `/dashboard` | Staff overview |
| `/organizations`, `/queues`, `/clients`, `/personnel` | Management (SSR) |
| `/join/[queueId]` | Customer join (staff session required until public join exists) |
| `/ticket/[queueEntryId]` | Live ticket (public `progress-all` + polling) |
| `/admin/login` | Admin auth → `POST /auth/admins/token` |
| `/admin/*` | Platform admin |

## Design tokens

Navy / slate primary (`#0F172A`, `#1E3A8A`), white surfaces (`#F8FAFC`), electric blue CTA (`#2563EB`), teal highlight (`#0EA5E9`), status greens/ambers/reds as documented in product palette.

## Gaps

See [`../docs/backend-feature-gaps.md`](../docs/backend-feature-gaps.md).
