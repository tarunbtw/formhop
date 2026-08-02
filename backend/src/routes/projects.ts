import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db, projects, submissions } from '../db'
import { eq, and, count, sql, gte } from 'drizzle-orm'
import { randomBytes } from 'crypto'
import { CreateProjectSchema, UpdateProjectSchema } from '../schemas'
import { authMiddleware } from '../middleware/auth'
import { getMonthlySubmissionCount } from '../lib/redis'
import { APP_LIMITS } from '../config/limits'

export const projectsRouter = new Hono()

// All routes require auth
projectsRouter.use('*', authMiddleware)

// Build endpoint URL from the incoming request
function endpointUrl(slug: string, c: { req: { url: string; header(name: string): string | undefined } }) {
  const override = process.env.API_BASE_URL
  if (override) return `${override.replace(/\/$/, '')}/submit/${slug}`
  const url = new URL(c.req.url)
  return `${url.protocol}//${url.host}/submit/${slug}`
}

// ─── GET /api/projects/usage ────────────────────────────────────────────────
// Returns the user's current usage stats and hard limits

projectsRouter.get('/usage', async (c) => {
  const { userId } = c.get('user')

  // Count active forms
  const [{ value: formCount }] = await db
    .select({ value: count() })
    .from(projects)
    .where(eq(projects.userId, userId))

  const formsUsed = Number(formCount)

  // Monthly submission count from Redis / PostgreSQL
  const monthlySubmissions = await getMonthlySubmissionCount(userId)

  return c.json({
    forms: {
      used: formsUsed,
      limit: APP_LIMITS.MAX_FORMS_PER_USER,
      remaining: Math.max(0, APP_LIMITS.MAX_FORMS_PER_USER - formsUsed),
    },
    submissions: {
      used: monthlySubmissions,
      limit: APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER,
      remaining: Math.max(0, APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER - monthlySubmissions),
    },
  })
})

// ─── GET /api/projects/analytics ─────────────────────────────────────────────
// Aggregated submission trends, forms performance, and real-time activity feed

projectsRouter.get('/analytics', async (c) => {
  const { userId } = c.get('user')

  // 1. Get user forms with submission counts
  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      submissionCount: count(submissions.id),
    })
    .from(projects)
    .leftJoin(submissions, eq(submissions.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .groupBy(projects.id)

  const totalSubmissions = userProjects.reduce((acc, p) => acc + Number(p.submissionCount), 0)

  // 2. Daily breakdown for the last 14 days
  const dailyRows = await db
    .select({
      day: sql<string>`TO_CHAR(DATE_TRUNC('day', ${submissions.createdAt}), 'YYYY-MM-DD')`,
      count: count(submissions.id),
    })
    .from(submissions)
    .innerJoin(projects, eq(submissions.projectId, projects.id))
    .where(
      and(
        eq(projects.userId, userId),
        gte(submissions.createdAt, sql`NOW() - INTERVAL '14 days'`)
      )
    )
    .groupBy(sql`DATE_TRUNC('day', ${submissions.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day', ${submissions.createdAt}) ASC`)

  // Fill in all 14 days so charts render smoothly
  const timeline: Array<{ date: string; label: string; count: number }> = []
  const dailyMap = new Map<string, number>()
  for (const row of dailyRows) {
    dailyMap.set(row.day, Number(row.count))
  }

  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const ymd = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    timeline.push({
      date: ymd,
      label,
      count: dailyMap.get(ymd) ?? 0,
    })
  }

  // 3. Count unread submissions
  const [{ value: unreadCount }] = await db
    .select({ value: count() })
    .from(submissions)
    .innerJoin(projects, eq(submissions.projectId, projects.id))
    .where(and(eq(projects.userId, userId), eq(submissions.isRead, false)))

  // 4. Recent submissions stream
  const recentSubmissions = await db
    .select({
      id: submissions.id,
      projectId: submissions.projectId,
      projectName: projects.name,
      data: submissions.data,
      isRead: submissions.isRead,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(projects, eq(submissions.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .orderBy(sql`${submissions.createdAt} DESC`)
    .limit(6)

  const monthlySubmissions = await getMonthlySubmissionCount(userId)

  return c.json({
    summary: {
      totalSubmissions,
      monthlySubmissions,
      monthlyLimit: APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER,
      activeForms: userProjects.length,
      formLimit: APP_LIMITS.MAX_FORMS_PER_USER,
      unreadCount: Number(unreadCount),
      readCount: Math.max(0, totalSubmissions - Number(unreadCount)),
    },
    timeline,
    byProject: userProjects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      count: Number(p.submissionCount),
      percentage: totalSubmissions > 0 ? Math.round((Number(p.submissionCount) / totalSubmissions) * 100) : 0,
    })),
    recentSubmissions,
  })
})

// ─── GET /api/projects ────────────────────────────────────────────────────────

projectsRouter.get('/', async (c) => {
  const { userId } = c.get('user')

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      schema: projects.schema,
      allowedOrigins: projects.allowedOrigins,
      emailNotifications: projects.emailNotifications,
      createdAt: projects.createdAt,
      submissionCount: count(submissions.id),
    })
    .from(projects)
    .leftJoin(submissions, eq(submissions.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .groupBy(projects.id)
    .orderBy(sql`${projects.createdAt} DESC`)

  return c.json(
    rows.map((p) => ({
      ...p,
      submissionCount: Number(p.submissionCount),
      endpoint_url: endpointUrl(p.slug, c),
    }))
  )
})

// ─── POST /api/projects ───────────────────────────────────────────────────────

projectsRouter.post(
  '/',
  zValidator('json', CreateProjectSchema),
  async (c) => {
    const { userId } = c.get('user')
    const body = c.req.valid('json')

    // Enforce hard limit of 10 forms per user
    const [{ value: formCount }] = await db
      .select({ value: count() })
      .from(projects)
      .where(eq(projects.userId, userId))

    if (Number(formCount) >= APP_LIMITS.MAX_FORMS_PER_USER) {
      return c.json(
        {
          error: 'form_limit_reached',
          message: `You have reached the limit of ${APP_LIMITS.MAX_FORMS_PER_USER} forms. Please delete an existing form before creating a new one.`,
          limit: APP_LIMITS.MAX_FORMS_PER_USER,
          used: Number(formCount),
        },
        403
      )
    }

    // Generate unique slug
    let slug = randomBytes(8).toString('base64url').slice(0, 10)
    let attempts = 0
    while (attempts < 3) {
      const [existing] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.slug, slug))
      if (!existing) break
      slug = randomBytes(8).toString('base64url').slice(0, 10)
      attempts++
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId,
        name: body.name,
        slug,
        schema: body.schema,
        allowedOrigins: body.allowed_origins,
        emailNotifications: body.email_notifications ?? false,
      })
      .returning()

    return c.json({ ...project, endpoint_url: endpointUrl(project.slug, c) }, 201)
  }
)

// ─── GET /api/projects/:id ────────────────────────────────────────────────────

projectsRouter.get('/:id', async (c) => {
  const { userId } = c.get('user')
  const id = c.req.param('id')
  if (!id) return c.json({ error: 'not_found' }, 404)

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))

  if (!project) return c.json({ error: 'not_found' }, 404)

  const [{ value: submissionCount }] = await db
    .select({ value: count() })
    .from(submissions)
    .where(eq(submissions.projectId, id))

  return c.json({
    ...project,
    endpoint_url: endpointUrl(project.slug, c),
    submission_count: Number(submissionCount),
  })
})

// ─── PATCH /api/projects/:id ──────────────────────────────────────────────────

projectsRouter.patch(
  '/:id',
  zValidator('json', UpdateProjectSchema),
  async (c) => {
    const { userId } = c.get('user')
    const id = c.req.param('id')
    if (!id) return c.json({ error: 'not_found' }, 404)
    const body = c.req.valid('json')

    // Verify ownership
    const [existing] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))

    if (!existing) return c.json({ error: 'not_found' }, 404)

    const updateData: Partial<typeof projects.$inferInsert> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.schema !== undefined) updateData.schema = body.schema
    if (body.allowed_origins !== undefined) updateData.allowedOrigins = body.allowed_origins
    if (body.email_notifications !== undefined)
      updateData.emailNotifications = body.email_notifications

    const [updated] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning()

    return c.json({ ...updated, endpoint_url: endpointUrl(updated.slug, c) })
  }
)

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────

projectsRouter.delete('/:id', async (c) => {
  const { userId } = c.get('user')
  const id = c.req.param('id')
  if (!id) return c.json({ error: 'not_found' }, 404)

  const [existing] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))

  if (!existing) return c.json({ error: 'not_found' }, 404)

  await db.delete(projects).where(eq(projects.id, id))

  return c.json({ ok: true })
})
