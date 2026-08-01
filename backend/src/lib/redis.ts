import { Redis } from '@upstash/redis'
import { db, submissions, projects } from '../db'
import { count, eq, and, gte } from 'drizzle-orm'

let _redis: Redis | null = null

export function getRedis(): Redis | null {
  if (_redis) return _redis

  const url = process.env.REDIS_URL
  const token = process.env.REDIS_TOKEN

  if (!url || !token) {
    return null
  }

  _redis = new Redis({ url, token })
  return _redis
}

// ─── Rate limit helpers ───────────────────────────────────────────────────────

export async function checkIpRateLimit(ip: string): Promise<boolean> {
  try {
    const redis = getRedis()
    if (!redis) return true // fail open if no Redis configured

    const key = `rl:ip:${ip}`
    const reqCount = await redis.incr(key)
    if (reqCount === 1) {
      await redis.expire(key, 60) // 1 minute window
    }
    return reqCount <= 60 // 60 req/min per IP
  } catch (err) {
    console.warn('[REDIS] Rate limit check failed, failing open:', err)
    return true
  }
}

export async function getMonthlySubmissionCount(userId: string): Promise<number> {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const key = `quota:user:${userId}:${month}`

  // 1. Try reading from Redis cache
  try {
    const redis = getRedis()
    if (redis) {
      const val = await redis.get<number>(key)
      if (val !== null && val !== undefined) {
        return Number(val)
      }
    }
  } catch (err) {
    console.warn('[REDIS] Cache read failed, falling back to database:', err)
  }

  // 2. Fallback to PostgreSQL database (source of truth)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const [{ value: dbCount }] = await db
    .select({ value: count() })
    .from(submissions)
    .innerJoin(projects, eq(submissions.projectId, projects.id))
    .where(and(eq(projects.userId, userId), gte(submissions.createdAt, startOfMonth)))

  const total = Number(dbCount)

  // 3. Populate Redis cache if available
  try {
    const redis = getRedis()
    if (redis) {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 2)
      const secondsUntilExpiry = Math.floor((endOfMonth.getTime() - now.getTime()) / 1000)
      await redis.set(key, total, { ex: Math.max(secondsUntilExpiry, 60) })
    }
  } catch {
    // Ignore cache write error
  }

  return total
}

export async function incrementMonthlySubmissionCount(userId: string): Promise<number> {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const key = `quota:user:${userId}:${month}`

  try {
    const redis = getRedis()
    if (redis) {
      const newCount = await redis.incr(key)
      if (newCount === 1) {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 2)
        const secondsUntilExpiry = Math.floor((endOfMonth.getTime() - now.getTime()) / 1000)
        await redis.expire(key, Math.max(secondsUntilExpiry, 60))
      }
      return Number(newCount)
    }
  } catch (err) {
    console.warn('[REDIS] Cache increment failed:', err)
  }

  // If Redis unavailable, read fresh count from database
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const [{ value: dbCount }] = await db
    .select({ value: count() })
    .from(submissions)
    .innerJoin(projects, eq(submissions.projectId, projects.id))
    .where(and(eq(projects.userId, userId), gte(submissions.createdAt, startOfMonth)))

  return Number(dbCount)
}
