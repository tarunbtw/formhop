import type { MiddlewareHandler } from 'hono'
import { auth } from '../lib/auth'

export interface AuthUser {
  userId: string
  email: string
  name: string
  image?: string | null
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session?.user) {
    return c.json({ error: 'unauthorized' }, 401)
  }

  c.set('user', {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  })

  await next()
}
