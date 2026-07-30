# Formsy

Formsy is a form-as-a-service backend. Define your schema, get an instant POST endpoint, embed it anywhere, and receive submissions in your dashboard and inbox.

---

## Architecture

```
formsy/
├── backend/          # Hono backend on Node.js (Drizzle ORM, PostgreSQL, Upstash Redis, pg-boss, Polar.sh)
├── frontend/         # React 18 + Vite dashboard (TanStack Query, React Router, Mintlify-inspired design system)
├── sdk/              # Vanilla JS CDN client bundle (Formsy.submit())
├── cli/              # Interactive scaffolding CLI (npx @formsy/init)
├── pnpm-workspace.yaml
└── package.json
```

- **`backend/`**: REST API, dynamic Zod validation, pg-boss email worker queue, Redis rate-limiting and monthly quotas, GitHub OAuth + JWT, and Polar.sh billing.
- **`frontend/`**: Developer dashboard to create forms, manage schemas, view & export submissions, and manage subscriptions.
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
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth application
- `JWT_SECRET`: 64-character hex secret (`openssl rand -hex 32`)
- `RESEND_API_KEY` (and optional `BREVO_API_KEY`): Email delivery
- `POLAR_ACCESS_TOKEN` & `POLAR_WEBHOOK_SECRET`: Billing (Polar.sh)

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
