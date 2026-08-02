# Formhop

Formhop is a self-contained form backend service and developer dashboard. It provides programmatic submission endpoints backed by runtime schema validation, sliding-window rate limiting, honeypot bot defense, SHA-256 IP hashing, asynchronous email notifications, and an inbox management dashboard.

The service eliminates boilerplate backend code, custom database migrations, and SMTP server configuration for applications requiring form capture.

---

## Architecture and Monorepo Structure

The repository is configured as a pnpm workspace with isolated domains:

```
formhop/
├── backend/          # Hono HTTP server running on Node.js (Drizzle ORM, PostgreSQL, Better Auth, Upstash Redis)
├── frontend/         # Single-page application built with React 18, Vite, and TanStack Query
├── sdk/              # Client runtime bundle (0.50KB gzipped vanilla JS)
├── cli/              # Scaffolding utility (@formhop/init)
├── pnpm-workspace.yaml
└── package.json
```

| Package | Path | Runtime | Purpose |
| :--- | :--- | :--- | :--- |
| `@formhop/backend` | `backend/` | Node.js 20+ | Ingestion engine, REST API, Zod compilation, Drizzle ORM, Redis rate limiter, Better Auth session broker. |
| `@formhop/frontend` | `frontend/` | Browser (Vite SPA) | Visual form builder, submissions inbox, CSV exporter, OAuth authentication, account metrics. |
| `@formhop/sdk` | `sdk/` | Browser CDN | Drop-in form handler intercepting submissions with built-in validation and honeypot injection. |
| `@formhop/init` | `cli/` | Node.js CLI | Interactive component scaffolder for React, Next.js, Vue, and vanilla HTML. |

---

## Submission Pipeline

Every payload dispatched to `POST /submit/:slug` traverses a deterministic nine-stage execution pipeline:

```
Incoming POST Request
 │
 ├── 1. Project & Owner Lookup (Single inner-join query on slug)
 │
 ├── 2. CORS Verification (Evaluates Origin header against project.allowed_origins)
 │
 ├── 3. Edge Rate Limiting (Upstash Redis sliding window: 60 requests/minute per client IP)
 │
 ├── 4. Account Quota Verification (Redis cache / PostgreSQL audit: 100 submissions/month ceiling)
 │
 ├── 5. Content-Type & Payload Bounds (Enforces application/json and 50KB payload cap)
 │
 ├── 6. Honeypot Filter (Checks _honeypot field; drops automated scrapers with HTTP 200 silently)
 │
 ├── 7. Dynamic Zod Compilation & Validation (Compiles stored schema into runtime Zod validator)
 │
 ├── 8. Cryptographic Anonymization & Persistence (Hashes IP via SHA-256, writes JSONB to PostgreSQL)
 │
 └── 9. Non-Blocking Event Dispatch (Asynchronously fires Resend notification if enabled)
```

The pipeline fails fast at every evaluation step. Malformed JSON returns 400, unauthorized origins return 403, rate-limited clients return 429, oversized payloads return 413, and schema violations return 422 with a structured field-level error dictionary.

---

## Security Model and Countermeasures

### Honeypot Bot Counter-Intelligence
Automated scrapers target hidden form fields indiscriminately. When a submission contains a non-empty `_honeypot` attribute, Formhop bypasses database persistence, skips quota decrements, and returns an immediate HTTP 200 with `{"ok": true, "id": "honeypot"}`. Scrapers perceive success, while zero invalid data reaches production storage.

### Sliding-Window Rate Limiting
Rate limiting is backed by Upstash Redis using the atomic `INCR` and `EXPIRE` pattern on `rl:ip:<ip>` keys with a sixty-second TTL. The threshold allows sixty requests per minute per IP address. If Redis is unavailable or unconfigured, the middleware fails open to ensure zero downtime on public forms.

### Zero PII Retention
Client IP addresses are never written to disk in plain text. Incoming addresses from the `x-forwarded-for` header are converted into SHA-256 hexadecimal digests before persistence. This permits duplicate identification and pattern tracking while guaranteeing absolute privacy compliance.

### Origin Restrictions
Projects can declare an array of allowed origins. When populated, Formhop validates incoming `Origin` headers and rejects cross-site forgeries with HTTP 403 before payload parsing.

---

## Database Schema and Relational Model

PostgreSQL persistence is managed via Drizzle ORM. The relational model is partitioned between Better Auth authentication primitives and Formhop business tables.

### Formhop Domain Tables

#### `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  schema JSONB NOT NULL,
  allowed_origins TEXT[] NOT NULL DEFAULT '{}',
  email_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX projects_user_id_idx ON projects(user_id);
```

#### `submissions`
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  ip_hash TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX submissions_project_id_idx ON submissions(project_id);
CREATE INDEX submissions_created_at_idx ON submissions(created_at);
```

### Better Auth Domain Tables
Authentication state is maintained across four tables: `user`, `session`, `account`, and `verification`. OAuth identity mapping (GitHub and Google) is established in the `account` relation, linked by foreign key cascades to `user`.

---

## Platform Limits and Quotas

Formhop operates under hard account constraints enforced at the API layer:

| Resource | Hard Limit | Enforcement Strategy |
| :--- | :--- | :--- |
| Active Forms per Account | 10 forms | Pre-insert count query in `POST /api/projects`. Blocks creation when `forms >= 10`. |
| Submissions per Account | 100 submissions / month | Cached in Redis key `quota:user:<userId>:<YYYY-MM>`, verified against PostgreSQL. Rejection via HTTP 429 when cap is met. |
| Payload Size | 50 KB | Evaluated against `Content-Length` header prior to body parsing. |
| Ingestion Rate Limit | 60 req / min / IP | Atomic sliding window in Upstash Redis. |
| Notification Delivery | Off by default | Configured per project; requires explicit user enablement in project settings. |

---

## API Specification

### Ingestion API (Public)

#### `POST /submit/:slug`
Ingests, validates, and stores a form payload.

Headers:
```http
Content-Type: application/json
Origin: https://client-domain.com
```

Request Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Project brief",
  "_honeypot": ""
}
```

Success Response (`200 OK`):
```json
{
  "ok": true,
  "id": "e4b95393-78d1-4df2-a39c-4dc478ff4b8e"
}
```

Validation Error (`422 Unprocessable Entity`):
```json
{
  "error": "validation_failed",
  "fields": {
    "email": ["Invalid email"],
    "name": ["Required"]
  }
}
```

Quota Exceeded Error (`429 Too Many Requests`):
```json
{
  "error": "monthly_limit_reached",
  "message": "This form has reached its monthly submission limit of 100 submissions.",
  "limit": 100
}
```

---

### Management API (Authenticated)

All management endpoints require session validation via Better Auth Bearer token or browser cookie.

#### `GET /api/projects/usage`
Returns utilization metrics and capacity limits for the authenticated user.

Response (`200 OK`):
```json
{
  "forms": {
    "used": 3,
    "limit": 10,
    "remaining": 7
  },
  "submissions": {
    "used": 42,
    "limit": 100,
    "remaining": 58
  }
}
```

#### `GET /api/projects`
Retrieves all forms owned by the user, ordered by creation date descending, including live submission counts.

#### `POST /api/projects`
Creates a new form and compiles its schema.

Request Body:
```json
{
  "name": "Beta Waitlist",
  "schema": [
    { "name": "email", "type": "email", "required": true, "label": "Work Email" },
    { "name": "role", "type": "text", "required": false, "label": "Job Title" }
  ],
  "allowed_origins": ["https://mycompany.com"],
  "email_notifications": false
}
```

#### `GET /api/projects/:id`
Retrieves project details, schema definition, and endpoint URL.

#### `PUT /api/projects/:id`
Updates form name, allowed origins, schema fields, or email alert state.

#### `DELETE /api/projects/:id`
Deletes a form and cascades deletion across all associated submissions.

#### `GET /api/projects/:id/submissions`
Returns paginated submissions for a specific form.

Query Parameters: `page` (default 1), `limit` (default 20, max 100).

Response (`200 OK`):
```json
{
  "submissions": [
    {
      "id": "27680efd-512b-42e1-85b2-32a2f8c5b026",
      "data": { "email": "dev@company.com", "role": "Staff Engineer" },
      "ipHash": "8f481a7b480b0e50...3f2",
      "isRead": false,
      "createdAt": "2026-08-01T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### `PATCH /api/projects/:id/submissions/:subId/read`
Toggles the read status of an individual submission.

---

## Integration Patterns

### 1. Native Browser Fetch

```typescript
async function submitInquiry(payload: { name: string; email: string; brief: string }) {
  const response = await fetch('https://api.formhop.dev/submit/v1-inquiry-slug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Submission failed')
  }

  return response.json()
}
```

### 2. Standard HTML5 Submission

```html
<form action="https://api.formhop.dev/submit/v1-inquiry-slug" method="POST">
  <!-- Invisible Honeypot Field -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Send</button>
</form>
```

### 3. Standalone CDN Client (`@formhop/sdk`)

Add the minified 0.50KB bundle to your markup. It automatically binds to forms containing `data-formhop="<slug>"`:

```html
<form data-formhop="v1-inquiry-slug">
  <input name="email" type="email" required />
  <button type="submit">Submit</button>
</form>

<script src="https://cdn.formhop.dev/formhop.min.js" async></script>
```

Programmatic SDK execution:

```javascript
window.Formhop.submit('v1-inquiry-slug', {
  email: 'client@studio.com',
  notes: 'Custom integration inquiry'
}).then(res => {
  console.log('Ingested with ID:', res.id)
})
```

### 4. Interactive Scaffolding CLI

```bash
npx @formhop/init
```

The interactive CLI inspects the target workspace and generates validated form components for React, Next.js, Vue, or static HTML.

---

## Environment Configuration

Configuration variables are resolved from system environments or `.env` files:

### Backend Variables (`backend/.env`)

| Variable | Type | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | String | PostgreSQL connection string (`postgres://user:pass@host:5432/db?sslmode=require`). |
| `REDIS_URL` | String | Upstash Redis REST endpoint (`https://...upstash.io`). |
| `REDIS_TOKEN` | String | Upstash Redis authorization token. |
| `BETTER_AUTH_SECRET` | String | 32-byte secret key used for session cryptographic signing. |
| `BETTER_AUTH_URL` | String | Base canonical URL of the auth server (`http://localhost:3001`). |
| `GITHUB_CLIENT_ID` | String | GitHub OAuth Application Client ID. |
| `GITHUB_CLIENT_SECRET` | String | GitHub OAuth Application Client Secret. |
| `GOOGLE_CLIENT_ID` | String | Google Cloud OAuth Client ID. |
| `GOOGLE_CLIENT_SECRET` | String | Google Cloud OAuth Client Secret. |
| `RESEND_API_KEY` | String | API key for transactional email delivery (`re_...`). |
| `API_BASE_URL` | String | Optional public URL override for generated endpoint links. |
| `PORT` | Number | Server port (default: `3001`). |

### Frontend Variables (`frontend/.env`)

| Variable | Type | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | String | Base backend API URL (`http://localhost:3001` or `/api` via reverse proxy). |

---

## Local Development and Operations

Prerequisites: Node.js 20 or higher, pnpm 9 or higher, active PostgreSQL database, Upstash Redis instance.

### Installation

```bash
pnpm install
```

### Database Migrations

Generate schema diffs and execute pending migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

Launch the interactive schema GUI:

```bash
pnpm db:studio
```

### Development Server

Run backend and frontend concurrently:

```bash
pnpm dev
```

Run services individually:

```bash
pnpm dev:backend   # HTTP engine active on http://localhost:3001
pnpm dev:frontend  # Vite server active on http://localhost:5173
```

### Quality Assurance and Production Build

Execute strict typechecking across all workspace packages:

```bash
pnpm typecheck
```

Compile all artifacts for production deployment:

```bash
pnpm build
```
