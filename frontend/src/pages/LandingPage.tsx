import { Link, useSearchParams } from 'react-router-dom'
import { Zap, Shield, Mail, Code2, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant endpoint',
    desc: 'Define your schema and get a POST endpoint in seconds. No backend required.',
  },
  {
    icon: Shield,
    title: 'Spam protection',
    desc: 'Built-in rate limiting, CORS allowlist, and honeypot field filtering.',
  },
  {
    icon: Mail,
    title: 'Email alerts',
    desc: 'Get notified instantly on every new submission via Resend.',
  },
  {
    icon: Code2,
    title: 'CDN snippet',
    desc: 'Drop in a 5KB script tag. Works with any site — no framework needed.',
  },
]

export default function LandingPage() {
  const [searchParams] = useSearchParams()
  const authError = searchParams.get('auth_error')
  const { isAuthenticated, isLoading, loginWithGithub, loginWithGoogle } = useAuth()

  return (
    <div style={{ background: 'var(--canvas)' }}>
      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--hero-sky-from) 0%, var(--canvas) 100%)',
          padding: '120px var(--space-xxl) 96px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(0,212,164,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div className="badge badge-green" style={{ marginBottom: 24, fontSize: 12 }}>
            Form Backend SaaS
          </div>

          {authError && (
            <div style={{
              background: 'rgba(229,62,62,0.08)',
              border: '1px solid rgba(229,62,62,0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 20px',
              color: 'var(--brand-error)',
              fontSize: 14,
              marginBottom: 24,
            }}>
              {authError === 'session_expired' ? 'Your session expired. Please sign in again.' : 'Authentication failed. Please try again.'}
            </div>
          )}

          <h1
            className="text-hero-display"
            style={{ color: 'var(--ink)', marginBottom: 24 }}
          >
            Your form backend,{' '}
            <span style={{ color: 'var(--brand-green)' }}>instant.</span>
          </h1>

          <p
            className="text-subtitle"
            style={{ color: 'var(--slate)', maxWidth: 540, margin: '0 auto 40px' }}
          >
            Define a schema, get a POST endpoint, embed it anywhere. Submissions
            land in your dashboard and your inbox.
          </p>

          <div className="flex items-center gap-md" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isLoading && isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <LayoutDashboard size={16} />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <button onClick={() => loginWithGithub()} className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </button>
                <button onClick={() => loginWithGoogle()} className="btn btn-secondary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  Sign in with Google
                </button>
              </>
            )}
          </div>
        </div>

        {/* ─── Code preview ──────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 680,
            margin: '64px auto 0',
            textAlign: 'left',
            boxShadow: 'var(--shadow-3)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--hairline-soft)',
          }}
        >
          <div className="code-block-header" style={{ background: '#1e1e1e', borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="code-block-header-label">Example integration</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
            </div>
          </div>
          <div className="code-block-body" style={{ background: '#1e1e1e' }}>
            <pre style={{ fontSize: 13 }}>{`<script src="https://cdn.formsy.dev/v1/formsy.min.js"></script>

<script>
  Formsy.submit('your-slug', {
    name:    form.name.value,
    email:   form.email.value,
    message: form.message.value,
  })
  .then(() => alert('Sent!'))
  .catch(console.error)
</script>`}</pre>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-section) var(--space-xxl)', borderTop: '1px solid var(--hairline-soft)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="text-heading-2" style={{ color: 'var(--ink)', marginBottom: 12 }}>
              Everything you need for forms
            </h2>
            <p className="text-body-md" style={{ color: 'var(--slate)' }}>
              Stop reinventing the wheel. Formsy handles submission intake so you can focus on building.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-xl)',
            }}
          >
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="card" style={{ padding: 'var(--space-xl)' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--brand-green-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} color="var(--brand-green-deep)" />
                  </div>
                  <h3 className="text-heading-4" style={{ color: 'var(--ink)', marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p className="text-body-sm" style={{ color: 'var(--steel)' }}>
                    {f.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--hairline)',
          padding: 'var(--space-xxl)',
          textAlign: 'center',
        }}
      >
        <p className="text-body-sm" style={{ color: 'var(--steel)' }}>
          © Formsy · Clean, instant form backends.
        </p>
      </footer>
    </div>
  )
}
