import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ─── Better Auth Tables ───────────────────────────────────────────────────────

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
})

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true, mode: 'date' }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true, mode: 'date' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
})

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).default(sql`now()`),
})

// ─── Formsy Tables ────────────────────────────────────────────────────────────

export const projects = pgTable(
  'projects',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    schema: jsonb('schema').notNull().$type<FieldDefinition[]>(),
    allowedOrigins: text('allowed_origins')
      .array()
      .notNull()
      .default(sql`'{}'`),
    emailNotifications: boolean('email_notifications').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
  },
  (t) => ({
    userIdIdx: index('projects_user_id_idx').on(t.userId),
  })
)

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    data: jsonb('data').notNull().$type<Record<string, unknown>>(),
    ipHash: text('ip_hash'), // SHA-256 of IP — never raw
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
  },
  (t) => ({
    projectIdIdx: index('submissions_project_id_idx').on(t.projectId),
    createdAtIdx: index('submissions_created_at_idx').on(t.createdAt),
  })
)

// ─── Types ───────────────────────────────────────────────────────────────────

export type FieldType = 'text' | 'email' | 'number' | 'boolean' | 'textarea'

export interface FieldDefinition {
  name: string
  type: FieldType
  required: boolean
  label: string
}

export type User = typeof users.$inferSelect
export type Session = typeof sessions.$inferSelect
export type Account = typeof accounts.$inferSelect
export type Verification = typeof verifications.$inferSelect
export type Project = typeof projects.$inferSelect
export type Submission = typeof submissions.$inferSelect
