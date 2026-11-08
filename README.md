Virtual queue buzzer that can be used for any entity (ex. restaurants, clinics, banks, anything with a queue)

The company can generate a QR code for a queue for a particular service, the user can scan that QR code and the user gets tagged in that queue.

The owner of that queue can manage that queue to sort, remove (if the user is done), manage.

The user that gets tagged in that queue can receive notifications through the app or through an SMS. A user can also "view queue" for any queues they are tagged to, they can also view history, and also "estimated call time"

## Structure

- `backend/` — FastAPI + PostgreSQL
- `frontend/` — Next.js App Router UI (see `frontend/README.md`)
- `docs/` — Architecture notes and API feature gaps

## Local development

```bash
# API (docker-compose or local uvicorn on :8000)
docker compose up -d

# Frontend
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

- App: http://localhost:3000
- Admin (optional second process): `npm run dev:admin` → http://localhost:3001
- API: http://localhost:8000
