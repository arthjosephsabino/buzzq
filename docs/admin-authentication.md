# Admin authentication

Admin auth is a **username + password login** that returns a **JWT**. Later requests prove identity by sending that JWT as `Authorization: Bearer <token>`. FastAPI does not remember the admin between requests; each protected call is checked again.

There are two HTTP flows:

1. **Login** — public. `POST /auth/admin/token`
2. **Authenticated request** — private. Any route under `/admins`, which uses `Depends(get_current_active_admin)`

---

## Layers

| Layer | Files | Role |
| --- | --- | --- |
| Router | `backend/app/routers/auth.py`, `backend/app/routers/admin.py` | HTTP in/out. No JWT logic. |
| Dependencies | `backend/app/core/dependencies.py` | FastAPI wiring: DB session, services, Bearer token extraction |
| Service | `backend/app/services/auth_admin.py` | Verify password, create JWT, decode JWT, load admin |
| Repository | `backend/app/repositories/admin.py` | SQL lookup by username |
| Model / schema | `backend/app/models/admin.py`, `backend/app/models/token.py`, `backend/app/schemas/admin.py` | DB row vs request/response shapes |
| Crypto | `backend/app/utils/password.py`, `backend/app/core/config.py` | bcrypt + JWT secret/algorithm |

FastAPI `Depends()` belongs in routers and `dependencies.py`. `AuthAdminService` is ordinary Python.

---

## Flow 1 — Login (`POST /auth/admin/token`)

This route is **not** behind the lock. Anyone can call it.

### Step 1 — Request

Swagger Authorize and this endpoint use **form data**, not JSON:

```http
POST /auth/admin/token
Content-Type: application/x-www-form-urlencoded

username=ada&password=secret
```

That comes from:

```python
form_data: Annotated[AdminLogin, Form()]
```

`AdminLogin` is only `username` and `password`. Extra OAuth2 fields (`grant_type`, `scope`, and similar) that Swagger may send are ignored.

### Step 2 — Build `AuthAdminService`

```python
db: Annotated[AuthAdminService, Depends(get_auth_admin_service)]
```

Chain:

1. `get_auth_admin_service` depends on `get_db`
2. `get_db` opens a SQLAlchemy session
3. `AuthAdminService(session)` is constructed
4. The service constructs `AdminRepository(session)`

### Step 3 — Verify credentials

```python
admin = db.authenticate_admin(form_data.username, form_data.password)
```

Inside `authenticate_admin`:

1. `AdminRepository.get_admin_by_username(username)` runs `SELECT ... FROM admins WHERE username = :username`
2. Missing user → `None` (same as a bad password, so the response does not reveal which field failed)
3. `verify_password(plain, admin.password)` uses bcrypt `checkpw`
4. Hash mismatch → `None`
5. Match → `Admin` row

Passwords in the DB are **hashes** from `get_password_hash` in `AdminService.create`, not plaintext.

If `admin` is `None`, the router returns **401 Invalid credentials**.

### Step 4 — Create the JWT

```python
access_token = db.create_admin_access_token(data={"sub": admin.username})
```

The payload starts as `{"sub": "<username>"}`. The service adds `exp` (now UTC + 30 minutes), then signs with PyJWT:

- secret: `settings.JWT_SECRET_KEY`
- algorithm: `settings.JWT_ALGORITHM` (typically `HS256`)

The token is three Base64url parts: `header.payload.signature`. The signature is what stops clients from forging `sub` or `exp`.

### Step 5 — Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

That matches the `Token` model. The client must send this token on later requests. The server stores nothing in a session cookie.

---

## Flow 2 — Protected route (for example `GET /admins`)

`admin.py` locks the **whole router**:

```python
router = APIRouter(
    prefix="/admins",
    tags=["admins"],
    dependencies=[Depends(get_current_active_admin)],
)
```

Every `/admins` route runs this **before** the handler. If it fails, `get_all_admins` / `create` never run.

### Step 1 — Client sends the token

```http
GET /admins
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2 — Dependency chain (inside-out)

FastAPI resolves nested `Depends()` like this:

```text
get_current_active_admin
  └── get_current_admin
        ├── admin_oauth2_scheme   → raw token string
        └── get_auth_admin_service
              └── get_db          → Session → AuthAdminService
```

### Step 3 — `admin_oauth2_scheme` (the lock icon)

```python
admin_oauth2_scheme = get_bearer_scheme("/auth/admin/token")
# OAuth2PasswordBearer(tokenUrl="/auth/admin/token")
```

On each request it:

1. Reads the `Authorization` header
2. Requires `Bearer <token>`
3. Returns the token string, or **401** if missing/malformed

This object is also what OpenAPI uses:

- `tokenUrl` tells Swagger where Authorize should POST username/password
- Using it via `Depends(admin_oauth2_scheme)` (through `get_current_admin`) is why `/admins` shows a lock

`POST /auth/admin/token` does **not** depend on this scheme, so it has no lock. That is correct: login must stay public.

### Step 4 — `get_current_admin`

```python
def get_current_admin(
    token: Annotated[str, Depends(admin_oauth2_scheme)],
    auth_admin_service: Annotated[AuthAdminService, Depends(get_auth_admin_service)],
) -> Admin:
    return auth_admin_service.get_admin_from_token(token)
```

This is the adapter: FastAPI extracted the token; the service interprets it.

### Step 5 — `get_admin_from_token`

1. `jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])`
   - wrong secret / tampered token / unknown alg → `InvalidTokenError` → **401**
   - expired `exp` → **401**
2. Read `sub`. Missing → **401**
3. Wrap in `TokenData(username=...)`
4. Load admin with `get_admin_by_username`
5. User deleted after the token was issued → **401**
6. Otherwise return the `Admin` row

A valid signature is not enough: the username must still exist.

### Step 6 — `get_current_active_admin`

```python
def get_current_active_admin(
    current_admin: Annotated[Admin, Depends(get_current_admin)],
) -> Admin:
    return current_admin
```

Today this is a pass-through. `Admin` has no `is_active` (or similar) field. This is the place to reject disabled accounts later.

Because the dependency is on the **router**, handlers do not receive `current_admin` unless they also declare it as a parameter. The check still runs.

### Step 7 — Handler runs

Only then does `get_all_admins` / `create` run, with a fresh `AdminService` from `get_admin_service`.

---

## What happens in Swagger

1. `/docs` sees `OAuth2PasswordBearer` on `/admins` → lock + Authorize.
2. Authorize POSTs form `username` + `password` to `/auth/admin/token` (Flow 1).
3. Swagger stores `access_token`.
4. Try it out on `/admins` sends `Authorization: Bearer ...` (Flow 2).

---

## Request sequence

```text
Client                         FastAPI                         DB
  |                               |                             |
  | POST /auth/admin/token        |                             |
  | username + password (form)    |                             |
  |------------------------------>| get_db + AuthAdminService   |
  |                               | SELECT admin by username    |
  |                               |---------------------------->|
  |                               | bcrypt checkpw              |
  |                               | sign JWT (sub, exp)         |
  |  { access_token, bearer }     |                             |
  |<------------------------------|                             |
  |                               |                             |
  | GET /admins                   |                             |
  | Authorization: Bearer <jwt>   |                             |
  |------------------------------>| OAuth2PasswordBearer        |
  |                               | jwt.decode + verify sig     |
  |                               | SELECT admin by sub         |
  |                               |---------------------------->|
  |                               | get_current_active_admin    |
  |                               | GET /admins handler         |
  |  200 [admins]                 |                             |
  |<------------------------------|                             |
```

---

## Why this split

| Put here | Why |
| --- | --- |
| `OAuth2PasswordBearer` in `dependencies.py` | FastAPI must call it per request; that is what creates the lock |
| `get_current_admin` in `dependencies.py` | Needs `Depends()` to receive the token and the service |
| `get_admin_from_token(token: str)` on the service | Testable without FastAPI; no `Depends()` on class methods |

A class method like `def get_current_admin(self, token: Annotated[str, Depends(...)])` is never injected. FastAPI only injects into callables it invokes as dependencies or routes.

---

## Config

From `.env` via `backend/app/core/config.py`:

- `JWT_SECRET_KEY` — HMAC secret. Compromise means anyone can mint admin tokens.
- `JWT_ALGORITHM` — must match encode and decode (`HS256`).

Tokens last 30 minutes (`timedelta(minutes=30)`). After that, log in again. There is no refresh token and no server-side revoke list: to kill a token early you would need a shorter expiry, a denylist, or a password/secret rotation.

---

## Mental model

- **Login** answers: “Are these credentials a real admin?” → JWT
- **Bearer scheme** answers: “Did this request include a token?”
- **`get_admin_from_token`** answers: “Is this token valid, and does that admin still exist?”
- **Router `dependencies=`** answers: “Must that check pass before this group of endpoints runs?”

The lock icon is not a special docs flag. It appears because `/admins` depends on `admin_oauth2_scheme` through `get_current_active_admin` → `get_current_admin`.
