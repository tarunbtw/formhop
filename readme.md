# Formsy

Formsy is a form-as-a-service backend. Define your schema, get an instant POST endpoint, embed it anywhere, and receive submissions in your dashboard and inbox.

---

## Architecture

```
formsy/
├── backend/          # Hono backend on Node.js (Drizzle ORM, PostgreSQL, Better Auth, Upstash Redis)
├── frontend/         # React 18 + Vite dashboard (TanStack Query, React Router, Better Auth Client)
├── sdk/              # Vanilla JS CDN client bundle (Formsy.submit())
├── cli/              # Interactive scaffolding CLI (npx @formsy/init)
├── pnpm-workspace.yaml
└── package.json
```

- **`backend/`**: REST API, dynamic Zod validation, async email alerts, Redis rate-limiting, and Better Auth authentication (GitHub + Google OAuth).
- **`frontend/`**: Developer dashboard to create forms, manage schemas, and view & export submissions.
- **`sdk/`**: <5KB standalone browser client script.
- **`cli/`**: Project generator supporting React, Next.js, Vue, and plain HTML.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL instance (Neon, Supabase, or local)
- Upstash Redis instance

### Installation

```bash
pnpm install
```

### Environment Setup

Copy `.env.example` to `backend/.env` and fill in the required keys:

```bash
cp .env.example backend/.env
```

Key variables needed:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL` & `REDIS_TOKEN`: Upstash Redis credentials
- `BETTER_AUTH_SECRET`: Secret key for session encryption
- `BETTER_AUTH_URL`: Backend URL (`http://localhost:3001`)
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth application
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `RESEND_API_KEY`: Email delivery via Resend

### Database Migration

```bash
pnpm db:migrate
```

### Running Locally

```bash
# Start backend and frontend together
pnpm dev

# Or run separately:
pnpm dev:backend   # API running on http://localhost:3001
pnpm dev:frontend  # UI running on http://localhost:5173
```
