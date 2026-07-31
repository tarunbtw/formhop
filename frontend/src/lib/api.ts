interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, unknown>
}

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<{ data: T }> {
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

  const response = await fetch(fullUrl, {
    method: options.method || 'GET',
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

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
  get: <T = any>(url: string, config?: { params?: Record<string, unknown> }) =>
    request<T>(url, { method: 'GET', params: config?.params }),
  post: <T = any>(url: string, data?: unknown) =>
    request<T>(url, { method: 'POST', body: data }),
  patch: <T = any>(url: string, data?: unknown) =>
    request<T>(url, { method: 'PATCH', body: data }),
  delete: <T = any>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
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
