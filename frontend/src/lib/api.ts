// In-memory token store (never localStorage)
let accessToken: string | null = null

export function setAccessToken(token: string) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

export function clearAccessToken() {
  accessToken = null
}

interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, unknown>
}

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<{ data: T }> {
  let fullUrl = url
  if (options.params) {
    const searchParams = new URLSearchParams()
    for (const [key, val] of Object.entries(options.params)) {
      if (val !== undefined && val !== null) {
        searchParams.set(key, String(val))
      }
    }
    const query = searchParams.toString()
    if (query) fullUrl += (url.includes('?') ? '&' : '?') + query
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(fullUrl, {
    method: options.method || 'GET',
    headers,
    credentials: 'include', // needed for httpOnly refresh cookie
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  // Handle 401 — attempt token refresh once
  if (response.status === 401 && !url.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Refresh failed')
          const data = await res.json()
          setAccessToken(data.accessToken)
          return data.accessToken
        })
        .catch((err) => {
          clearAccessToken()
          window.location.href = '/?auth_error=session_expired'
          throw err
        })
        .finally(() => {
          isRefreshing = false
          refreshPromise = null
        })
    }

    try {
      const newToken = await refreshPromise
      headers.Authorization = `Bearer ${newToken}`
      const retryResponse = await fetch(fullUrl, {
        method: options.method || 'GET',
        headers,
        credentials: 'include',
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      })

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}))
        const err = new Error(errorData.message || errorData.error || 'Request failed')
        ;(err as unknown as { response: { data: unknown; status: number } }).response = {
          data: errorData,
          status: retryResponse.status,
        }
        throw err
      }
      const data = await retryResponse.json().catch(() => ({}))
      return { data }
    } catch (err) {
      throw err
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const err = new Error(errorData.message || errorData.error || 'Request failed')
    ;(err as unknown as { response: { data: unknown; status: number } }).response = {
      data: errorData,
      status: response.status,
    }
    throw err
  }

  const data = await response.json().catch(() => ({}))
  return { data }
}

export const api = {
  get: <T = unknown>(url: string, config?: { params?: Record<string, unknown> }) =>
    request<T>(url, { method: 'GET', params: config?.params }),
  post: <T = unknown>(url: string, data?: unknown) =>
    request<T>(url, { method: 'POST', body: data }),
  patch: <T = unknown>(url: string, data?: unknown) =>
    request<T>(url, { method: 'PATCH', body: data }),
  delete: <T = unknown>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
}

// ─── API helpers ──────────────────────────────────────────────────────────────

export const authApi = {
  me: () => api.get('/auth/me').then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  refresh: () => api.post<{ accessToken: string }>('/auth/refresh').then((r) => r.data),
}

export const projectsApi = {
  list: () => api.get('/api/projects').then((r) => r.data),
  get: (id: string) => api.get(`/api/projects/${id}`).then((r) => r.data),
  create: (data: unknown) => api.post('/api/projects', data).then((r) => r.data),
  update: (id: string, data: unknown) =>
    api.patch(`/api/projects/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/api/projects/${id}`).then((r) => r.data),
  usage: () => api.get('/api/projects/usage').then((r) => r.data),
}

export const submissionsApi = {
  list: (projectId: string, page = 1, limit = 20) =>
    api
      .get(`/api/projects/${projectId}/submissions`, { params: { page, limit } })
      .then((r) => r.data),
  markRead: (projectId: string, submissionId: string) =>
    api
      .patch(`/api/projects/${projectId}/submissions/${submissionId}/read`)
      .then((r) => r.data),
}

export const billingApi = {
  checkout: (plan: string) =>
    api.get<{ checkoutUrl: string }>(`/api/billing/checkout`, { params: { plan } }).then((r) => r.data),
  portal: () => api.get<{ portalUrl: string }>('/api/billing/portal').then((r) => r.data),
}
