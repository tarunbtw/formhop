// ─── Default base URL ─────────────────────────────────────────────────────────
// Can be overridden with Formhop.init({ baseUrl: '...' }) before calling submit.
// Defaults to localhost:3001 (dev) — set to https://api.formhop.dev in production.

let _baseUrl = 'http://localhost:3001'

/**
 * Configure the SDK before using it.
 *
 * @example
 * // Production
 * Formhop.init({ baseUrl: 'https://api.formhop.dev' })
 *
 * @example
 * // Local dev (default)
 * Formhop.init({ baseUrl: 'http://localhost:3001' })
 */
function init(config: { baseUrl: string }) {
  _baseUrl = config.baseUrl.replace(/\/$/, '') // strip trailing slash
}

/**
 * Submit form data to a Formhop endpoint.
 *
 * @param slug  - Your project slug (from the Formhop dashboard)
 * @param data  - Key/value pairs matching your form schema
 *
 * @example
 * Formhop.submit('V0HJr2mw0D', { name: 'Jane', email: 'jane@example.com' })
 *   .then(res => console.log('Submitted!', res.id))
 *   .catch(err => console.error(err))
 */
async function submit(
  slug: string,
  data: Record<string, unknown>
): Promise<{ ok: boolean; id: string }> {
  const res = await fetch(`${_baseUrl}/submit/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw json
  }

  return json
}

export const Formhop = { init, submit }
export const Formsy = Formhop

// UMD global for <script> tag usage
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).Formhop = Formhop
  ;(window as unknown as Record<string, unknown>).Formsy = Formhop
}
