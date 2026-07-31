import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { auth } from './lib/auth'
import { projectsRouter } from './routes/projects'
import { submitRouter } from './routes/submit'
import { submissionsRouter } from './routes/submissions'

const app = new Hono()

// ─── Global Middleware ──────────────────────────────────────────────────────

app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', trimTrailingSlash())

// CORS — allow frontend origin for dashboard API calls and auth routes
const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposeHeaders: ['Set-Cookie'],
})

app.use('/api/*', corsMiddleware)

// Public submit endpoint needs its own CORS (origin validated per-project in handler)
app.use('/submit/*', cors({ origin: '*', allowMethods: ['POST', 'OPTIONS'] }))

// ─── Better Auth Route ──────────────────────────────────────────────────────

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

// ─── Health Check ───────────────────────────────────────────────────────────

app.get('/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

// ─── Routes ─────────────────────────────────────────────────────────────────

app.route('/api/projects', projectsRouter)
app.route('/submit', submitRouter)
app.route('/api/projects/:id/submissions', submissionsRouter)

// ─── 404 ────────────────────────────────────────────────────────────────────

app.notFound((c) => c.json({ error: 'not_found' }, 404))

// ─── Error Handler ───────────────────────────────────────────────────────────

app.onError((err, c) => {
  console.error('[ERROR]', err)
  const isDev = process.env.NODE_ENV !== 'production'
  return c.json(
    {
      error: 'internal_server_error',
      ...(isDev && { message: err.message, stack: err.stack }),
    },
    500
  )
})

// ─── Start ──────────────────────────────────────────────────────────────────

const port = Number(process.env.PORT ?? 3001)

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Formsy API running on http://localhost:${port}`)
  console.log(`   Health: http://localhost:${port}/health`)
})

export default app
