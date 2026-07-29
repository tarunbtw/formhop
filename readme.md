# Formsy

Formsy is a lightweight form backend SaaS. Define your schema, get an instant POST endpoint, embed it anywhere, and receive submissions in your dashboard and inbox.

---

## Architecture

- **`apps/api`**: Hono backend on Node.js (PostgreSQL + Drizzle ORM, Upstash Redis rate limiting, pg-boss email worker queue, Polar.sh billing, GitHub OAuth + JWT).
- **`apps/web`**: React 18 + Vite frontend with TanStack Query, React Router, and a custom Mintlify-inspired design system.
- **`packages/db`**: Drizzle schema and migrations for PostgreSQL.
- **`packages/schemas`**: Shared Zod validation schemas and plan limits.
- **`packages/sdk`**: Standalone Vanilla JS client bundle (`Formsy.submit()`).
- **`packages/cli`**: Interactive scaffolding CLI (`npx @formsy/init`) for React, Next.js, Vue, and HTML.

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

Copy `.env.example` to `apps/api/.env` and fill in the required keys:

```bash
cp .env.example apps/api/.env
```

Key variables needed:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL` & `REDIS_TOKEN`: Upstash Redis credentials
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth app
- `JWT_SECRET`: 64-char hex string (`openssl rand -hex 32`)
- `RESEND_API_KEY` (and optional `BREVO_API_KEY`): Email delivery
- `POLAR_ACCESS_TOKEN` & `POLAR_WEBHOOK_SECRET`: Billing (Polar.sh)

### Database Migration

```bash
pnpm --filter @formsy/db run db:migrate
```

### Running Locally

```bash
# Start all apps and packages in dev mode
pnpm dev

# Or run specific workspaces:
pnpm --filter @formsy/api dev   # API on http://localhost:3001
pnpm --filter @formsy/web dev   # Web UI on http://localhost:5173
```
