import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'
import * as schema from '../db/schema'

function normalizeUrl(url?: string, defaultUrl = 'http://localhost:3001'): string {
  if (!url) return defaultUrl
  let trimmed = url.trim()
  if (!trimmed) return defaultUrl
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = trimmed.startsWith('localhost') || trimmed.startsWith('127.0.0.1')
      ? `http://${trimmed}`
      : `https://${trimmed}`
  }
  return trimmed.replace(/\/$/, '')
}

const rawAuthUrl =
  process.env.BETTER_AUTH_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : undefined)

const baseURL = normalizeUrl(rawAuthUrl, 'http://localhost:3001')

const rawFrontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
  .map((o) => normalizeUrl(o, 'http://localhost:5173'))

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  trustedOrigins: Array.from(
    new Set([
      ...rawFrontendOrigins,
      'http://localhost:5173',
      'http://localhost:3001',
      'https://formhop.vercel.app',
      baseURL,
    ])
  ),
})
