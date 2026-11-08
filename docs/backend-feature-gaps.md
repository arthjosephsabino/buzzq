# Backend feature gaps

Features implied by the BuzzQ product vision that are **not** exposed by the current FastAPI OpenAPI contract. The frontend documents these instead of inventing endpoints.

---

## Public customer join (anonymous)

| | |
|---|---|
| **Feature** | Customer scans QR and joins a queue without signing in |
| **Current API support** | `POST /clients` and `POST /queue_entry` both require OAuth2 (`admin` or `personnel`). `GET /queue/{id}` also requires auth |
| **Required endpoint** | e.g. `POST /public/queues/{queue_id}/join` |
| **Suggested request** | `{ "name": string, "phone": string }` |
| **Suggested response** | `{ "queue_entry": QueueEntryResponse, "queue": QueueResponse }` |
| **Frontend dependency** | `/join/[queueId]` and `/api/join` — currently staff-session / kiosk only |

---

## Customer authentication / identity

| | |
|---|---|
| **Feature** | Persistent customer accounts and “my queues” |
| **Current API support** | None — `Client` has `id`, `name`, `phone` only |
| **Required endpoint** | Customer auth + session, e.g. OTP via phone |
| **Suggested request** | Phone + verification code |
| **Suggested response** | Token + client profile |
| **Frontend dependency** | No customer login UI implemented |

---

## Queue mutation operations

| | |
|---|---|
| **Feature** | Call next, skip, complete, remove, reorder |
| **Current API support** | `GET`/`POST` queue & queue_entry only — no PATCH/PUT/status transitions |
| **Required endpoint** | e.g. `POST /queue/{id}/next`, `POST /queue_entry/{id}/complete`, `POST /queue_entry/{id}/skip` |
| **Suggested request** | Path id; optional reason |
| **Suggested response** | Updated `QueueEntryResponse` / queue snapshot |
| **Frontend dependency** | Queue detail shows **disabled** Call next / Skip / Complete buttons |

---

## Queue lifecycle operations

| | |
|---|---|
| **Feature** | Pause / resume / activate queue |
| **Current API support** | `QueueStatus` exists (`NEW`, `IN_PROGRESS`, `INACTIVE`) but no mutation endpoint |
| **Required endpoint** | e.g. `PATCH /queue/{id}` with `{ "status": "IN_PROGRESS" }` |
| **Suggested request** | Status enum |
| **Suggested response** | `QueueResponse` |
| **Frontend dependency** | Status is display-only |

---

## Notifications (app / SMS)

| | |
|---|---|
| **Feature** | Notify customer when nearly their turn |
| **Current API support** | None |
| **Required endpoint** | Preferences + send/webhook APIs |
| **Suggested request** | Channel, client/entry id, template |
| **Suggested response** | Delivery status |
| **Frontend dependency** | Copy states notifications are not available |

---

## Estimated call time

| | |
|---|---|
| **Feature** | Show ~N minutes wait |
| **Current API support** | None — progress from `progress-all` only |
| **Required endpoint** | Include `estimated_wait_seconds` on entry or progress payload |
| **Suggested request** | N/A (derived server-side) |
| **Suggested response** | Number + confidence |
| **Frontend dependency** | Not shown; explicitly called out on ticket page |

---

## Queue history

| | |
|---|---|
| **Feature** | Historical completed queues for staff/customers |
| **Current API support** | `DONE` entries appear in list endpoints; no dedicated history filter/API |
| **Required endpoint** | e.g. `GET /queue/{id}/history?from=&to=` |
| **Suggested request** | Date range query |
| **Suggested response** | `QueueEntryResponse[]` |
| **Frontend dependency** | No history route implemented |

---

## Queue-specific public access

| | |
|---|---|
| **Feature** | Public read of queue name / now serving without auth |
| **Current API support** | Only `GET /queue_entry/{id}` and `…/progress-all` are public |
| **Required endpoint** | e.g. `GET /public/queues/{queue_id}` |
| **Suggested request** | Path id |
| **Suggested response** | Safe subset of queue + current ticket |
| **Frontend dependency** | Join page shows limited info unless staff session present |

---

## Real-time updates

| | |
|---|---|
| **Feature** | WebSocket / SSE push for ticket status |
| **Current API support** | None |
| **Required endpoint** | e.g. `GET /queue_entry/{id}/events` (SSE) or WS channel |
| **Suggested request** | Subscribe by entry id |
| **Suggested response** | Stream of `QueueEntryResponse` |
| **Frontend dependency** | Client polls `/api/queue-entry/{id}/progress` every 8s |

---

## Customer identity/session after join

| | |
|---|---|
| **Feature** | Recover ticket later without bookmarking UUID URL |
| **Current API support** | Ticket URL uses `queue_entry_id` only |
| **Required endpoint** | Lookup by phone + queue, or signed magic link |
| **Suggested request** | Phone / token |
| **Suggested response** | Entry id(s) |
| **Frontend dependency** | Ticket page is deep-link only |
