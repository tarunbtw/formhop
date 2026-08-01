import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Zap,
  Shield,
  Mail,
  Terminal,
  ArrowRight,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  Layers,
  Send,
  RefreshCw,
  Sliders,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { APP_LIMITS } from '../lib/constants'

export default function LandingPage() {
  const [searchParams] = useSearchParams()
  const authError = searchParams.get('auth_error')
  const { isAuthenticated, isLoading, loginWithGithub, loginWithGoogle } = useAuth()

  // ─── Hero Interactive State ────────────────────────────────────────────────
  const [activeHeroTab, setActiveHeroTab] = useState<'form' | 'curl' | 'react' | 'spam'>('form')
  const [copiedHeroCode, setCopiedHeroCode] = useState(false)
  const [formName, setFormName] = useState('Jane Doe')
  const [formEmail, setFormEmail] = useState('jane@example.com')
  const [formType, setFormType] = useState('Custom Illustration')
  const [formMessage, setFormMessage] = useState('Looking for a studio illustration and cover art for our upcoming release.')
  const [isSubmittingHero, setIsSubmittingHero] = useState(false)
  const [heroSubmitted, setHeroSubmitted] = useState(false)

  // ─── Interactive Sandbox State ─────────────────────────────────────────────
  const [sandboxTab, setSandboxTab] = useState<'react' | 'curl' | 'html'>('react')
  const [copiedSandbox, setCopiedSandbox] = useState(false)

  // ─── FAQ Open State ────────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingHero(true)
    setTimeout(() => {
      setIsSubmittingHero(false)
      setHeroSubmitted(true)
    }, 700)
  }

  const copyHeroCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedHeroCode(true)
    setTimeout(() => setCopiedHeroCode(false), 2000)
  }

  const copySandboxCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSandbox(true)
    setTimeout(() => setCopiedSandbox(false), 2000)
  }

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div style={{ background: '#FFFFFF', color: 'var(--ink)' }}>
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 60px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        }}
      >
        {/* Ambient Top Glows */}
        <div
          style={{
            position: 'absolute',
            top: -140,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 500,
            background: 'radial-gradient(ellipse at center, rgba(0, 212, 164, 0.16) 0%, rgba(248, 250, 252, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          {/* Top Announcement Pill */}
          <div style={{ display: 'inline-flex', marginBottom: 24 }}>
            <div className="pill-badge">
              <span className="pill-dot" />
              <span>Formsy 2.0 · Zero-config form backends for modern developers</span>
            </div>
          </div>

          {authError && (
            <div
              style={{
                maxWidth: 520,
                margin: '0 auto 24px',
                background: 'var(--brand-error-soft)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 18px',
                color: 'var(--brand-error)',
                fontSize: 14,
              }}
            >
              {authError === 'session_expired'
                ? 'Your session expired. Please sign in again.'
                : 'Authentication failed. Please try again.'}
            </div>
          )}

          {/* Headline */}
          <h1 className="text-hero-display" style={{ maxWidth: 840, margin: '0 auto 22px' }}>
            Forms that do it all.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #00D4A4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zero backend required.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-subtitle" style={{ maxWidth: 620, margin: '0 auto 36px' }}>
            Define a schema, get an instant HTTPS endpoint, and embed anywhere in minutes.
            Formsy validates types, traps spam, and sends Resend email alerts straight to your inbox.
          </p>

          {/* CTA Group */}
          <div className="flex items-center justify-center gap-md" style={{ flexWrap: 'wrap', marginBottom: 20 }}>
            {!isLoading && isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg flex items-center gap-sm">
                <LayoutDashboard size={18} />
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => loginWithGithub()}
                  className="btn btn-primary btn-lg flex items-center gap-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
                <button
                  onClick={() => loginWithGoogle()}
                  className="btn btn-secondary btn-lg flex items-center gap-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </>
            )}
          </div>

          {/* Micro Trust Indicators */}
          <div className="flex items-center justify-center gap-lg" style={{ color: 'var(--steel)', fontSize: 13, flexWrap: 'wrap' }}>
            <span className="flex items-center gap-xs">
              <Check size={14} color="var(--brand-green-deep)" strokeWidth={3} />
              {APP_LIMITS.MAX_FORMS_PER_USER} active forms free
            </span>
            <span className="flex items-center gap-xs">
              <Check size={14} color="var(--brand-green-deep)" strokeWidth={3} />
              {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} submissions / month
            </span>
            <span className="flex items-center gap-xs">
              <Check size={14} color="var(--brand-green-deep)" strokeWidth={3} />
              No credit card required
            </span>
          </div>

          {/* ─── Hero Centerpiece: Interactive Product Mockup ───────────────── */}
          <div style={{ maxWidth: 940, margin: '54px auto 0', textAlign: 'left' }}>
            <div className="browser-mockup">
              {/* Chrome Topbar */}
              <div className="browser-topbar">
                <div className="browser-dots">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="browser-address">
                  <Lock size={11} color="var(--brand-green-deep)" />
                  <span>https://api.formsy.dev/submit/studio-inquiry-demo</span>
                </div>
                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-xs">
                  <button
                    onClick={() => setActiveHeroTab('form')}
                    className="btn btn-sm"
                    style={{
                      background: activeHeroTab === 'form' ? '#FFFFFF' : 'transparent',
                      color: activeHeroTab === 'form' ? 'var(--ink)' : 'var(--steel)',
                      boxShadow: activeHeroTab === 'form' ? 'var(--shadow-xs)' : 'none',
                      padding: '5px 12px',
                      fontSize: 12,
                    }}
                  >
                    Live Preview
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('curl')}
                    className="btn btn-sm"
                    style={{
                      background: activeHeroTab === 'curl' ? '#FFFFFF' : 'transparent',
                      color: activeHeroTab === 'curl' ? 'var(--ink)' : 'var(--steel)',
                      boxShadow: activeHeroTab === 'curl' ? 'var(--shadow-xs)' : 'none',
                      padding: '5px 12px',
                      fontSize: 12,
                    }}
                  >
                    cURL / Fetch
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('react')}
                    className="btn btn-sm"
                    style={{
                      background: activeHeroTab === 'react' ? '#FFFFFF' : 'transparent',
                      color: activeHeroTab === 'react' ? 'var(--ink)' : 'var(--steel)',
                      boxShadow: activeHeroTab === 'react' ? 'var(--shadow-xs)' : 'none',
                      padding: '5px 12px',
                      fontSize: 12,
                    }}
                  >
                    React
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('spam')}
                    className="btn btn-sm"
                    style={{
                      background: activeHeroTab === 'spam' ? '#FFFFFF' : 'transparent',
                      color: activeHeroTab === 'spam' ? 'var(--ink)' : 'var(--steel)',
                      boxShadow: activeHeroTab === 'spam' ? 'var(--shadow-xs)' : 'none',
                      padding: '5px 12px',
                      fontSize: 12,
                    }}
                  >
                    Security
                  </button>
                </div>
              </div>

              {/* Mockup Body Content */}
              <div style={{ background: '#FFFFFF', padding: '24px' }}>
                {activeHeroTab === 'form' && (
                  <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    {/* Visual Cover Art (Pinterest Ref) */}
                    <div
                      style={{
                        position: 'relative',
                        height: 180,
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        marginBottom: 20,
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <img
                        src="/hero-art.jpg"
                        alt="Studio Cover Art"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 40%',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(10,13,20,0.75) 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 14,
                          left: 18,
                          color: '#FFFFFF',
                        }}
                      >
                        <span className="badge badge-green" style={{ marginBottom: 4 }}>
                          Formsy Studio Embed
                        </span>
                        <h3 style={{ fontSize: 18, fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                          Studio Inquiry &amp; Custom Brief
                        </h3>
                      </div>
                    </div>

                    {!heroSubmitted ? (
                      <form onSubmit={handleHeroSubmit} style={{ display: 'grid', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label className="label" style={{ fontSize: 12 }}>Client Name *</label>
                            <input
                              className="input"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="label" style={{ fontSize: 12 }}>Email Address *</label>
                            <input
                              type="email"
                              className="input"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="label" style={{ fontSize: 12 }}>Project Category</label>
                          <select
                            className="input"
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                          >
                            <option value="Custom Illustration">Custom Illustration &amp; Art</option>
                            <option value="Brand Identity">Brand Identity &amp; System</option>
                            <option value="Product UI">Product UI &amp; Web Design</option>
                            <option value="Backend Integration">Backend API Integration</option>
                          </select>
                        </div>

                        <div>
                          <label className="label" style={{ fontSize: 12 }}>Project Brief &amp; Timeline</label>
                          <textarea
                            className="input"
                            rows={3}
                            value={formMessage}
                            onChange={(e) => setFormMessage(e.target.value)}
                          />
                        </div>

                        {/* Honeypot Field Simulator */}
                        <input name="_honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                        <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
                          <span style={{ fontSize: 12, color: 'var(--steel)' }}>
                            ⚡️ Direct POST to Formsy endpoint
                          </span>
                          <button
                            type="submit"
                            className="btn btn-accent btn-sm flex items-center gap-xs"
                            disabled={isSubmittingHero}
                          >
                            {isSubmittingHero ? (
                              <>
                                <RefreshCw size={13} className="spinner" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <Send size={13} />
                                <span>Test Submit</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid var(--hairline)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 24,
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                          }}
                        >
                          <CheckCircle2 size={24} />
                        </div>
                        <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                          Submission Received &amp; Validated!
                        </h4>
                        <p style={{ fontSize: 13, color: 'var(--steel)', marginBottom: 16 }}>
                          Input validated against project schema. Honeypot check passed. Resend email alert triggered.
                        </p>

                        {/* JSON Response preview */}
                        <div
                          style={{
                            background: '#0B0F17',
                            borderRadius: 'var(--radius-md)',
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontFamily: 'Geist Mono, monospace',
                            fontSize: 12,
                            color: '#00D4A4',
                            marginBottom: 16,
                          }}
                        >
                          <pre style={{ margin: 0 }}>
{`HTTP/1.1 200 OK
{
  "ok": true,
  "id": "sub_8f29d74a",
  "data": {
    "client": "${formName}",
    "email": "${formEmail}",
    "type": "${formType}"
  },
  "email_alert": "Dispatched via Resend",
  "ip_hash": "e3b0c44298fc1c149afbf4c8996fb924",
  "monthly_quota": "1/100 used"
}`}
                          </pre>
                        </div>

                        <button
                          onClick={() => setHeroSubmitted(false)}
                          className="btn btn-secondary btn-sm"
                        >
                          Submit another test response
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeHeroTab === 'curl' && (
                  <div style={{ position: 'relative' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: 'var(--steel)', fontFamily: 'Geist Mono, monospace' }}>
                        bash / terminal
                      </span>
                      <button
                        onClick={() =>
                          copyHeroCode(
`curl -X POST https://api.formsy.dev/submit/studio-demo \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello from Formsy!"
  }'`
                          )
                        }
                        className="btn btn-ghost btn-sm flex items-center gap-xs"
                        style={{ fontSize: 12 }}
                      >
                        {copiedHeroCode ? <Check size={13} color="var(--brand-green-deep)" /> : <Copy size={13} />}
                        <span>{copiedHeroCode ? 'Copied' : 'Copy cURL'}</span>
                      </button>
                    </div>
                    <div
                      style={{
                        background: '#0B0F17',
                        borderRadius: 'var(--radius-md)',
                        padding: 18,
                        color: '#E2E8F0',
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: 13,
                        lineHeight: 1.6,
                        overflowX: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`curl -X POST https://api.formsy.dev/submit/studio-demo \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello from Formsy!"
  }'`}
                      </pre>
                    </div>
                  </div>
                )}

                {activeHeroTab === 'react' && (
                  <div style={{ position: 'relative' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: 'var(--steel)', fontFamily: 'Geist Mono, monospace' }}>
                        ContactForm.tsx
                      </span>
                      <button
                        onClick={() =>
                          copyHeroCode(
`export default function ContactForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    
    await fetch('https://api.formsy.dev/submit/your-slug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    alert('Submitted!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit">Submit</button>
    </form>
  )
}`
                          )
                        }
                        className="btn btn-ghost btn-sm flex items-center gap-xs"
                        style={{ fontSize: 12 }}
                      >
                        {copiedHeroCode ? <Check size={13} color="var(--brand-green-deep)" /> : <Copy size={13} />}
                        <span>{copiedHeroCode ? 'Copied' : 'Copy React'}</span>
                      </button>
                    </div>
                    <div
                      style={{
                        background: '#0B0F17',
                        borderRadius: 'var(--radius-md)',
                        padding: 18,
                        color: '#E2E8F0',
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: 13,
                        lineHeight: 1.6,
                        overflowX: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`export default function ContactForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    
    await fetch('https://api.formsy.dev/submit/your-slug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    alert('Submitted!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      {/* Invisible honeypot traps bots */}
      <input name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit">Submit</button>
    </form>
  )
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {activeHeroTab === 'spam' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                    <div className="card" style={{ padding: 18, background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Shield size={16} color="var(--brand-green-deep)" />
                        <span style={{ fontSize: 13, fontWeight: 700 }}>Honeypot Trap</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--steel)', lineHeight: 1.5 }}>
                        Invisible input traps automated bots silently without burning your monthly quota.
                      </p>
                    </div>
                    <div className="card" style={{ padding: 18, background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Zap size={16} color="var(--brand-green-deep)" />
                        <span style={{ fontSize: 13, fontWeight: 700 }}>Upstash Rate Limiting</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--steel)', lineHeight: 1.5 }}>
                        Built-in 60 req/min limit per IP prevents DDoS attacks and spam flooding.
                      </p>
                    </div>
                    <div className="card" style={{ padding: 18, background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Lock size={16} color="var(--brand-green-deep)" />
                        <span style={{ fontSize: 13, fontWeight: 700 }}>SHA-256 Privacy Hash</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--steel)', lineHeight: 1.5 }}>
                        Client IP addresses are hashed instantly with SHA-256 for strict privacy compliance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Developer Trust Stack Bar ──────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: '28px 0', background: '#FAFAFB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 16 }}>
            Compatible with any framework or static site generator
          </p>
          <div className="flex items-center justify-center gap-md" style={{ flexWrap: 'wrap', opacity: 0.85 }}>
            {['Next.js', 'React', 'Astro', 'SvelteKit', 'Vue 3', 'Remix', 'Vite', 'HTML5', 'Tailwind', 'Cloudflare Pages', 'Vercel'].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                  background: '#FFFFFF',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bento Grid: Engineered for Developer Velocity ──────────────────── */}
      <section id="features" style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Everything Included
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 16 }}>
              Built for speed. Hardened for production.
            </h2>
            <p className="text-subtitle">
              Never spin up an Express server, database migration, or SMTP transport just to intake a contact form.
            </p>
          </div>

          <div className="bento-grid">
            {/* Bento Card 1 (Large - Schema Builder) */}
            <div className="bento-card" style={{ gridColumn: 'span 7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--brand-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green-deep)' }}>
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="text-heading-4">Visual Schema Validation</h3>
                  <span style={{ fontSize: 12, color: 'var(--steel)' }}>Powered by dynamic Zod schemas</span>
                </div>
              </div>
              <p className="text-body-md" style={{ color: 'var(--slate)', marginBottom: 24 }}>
                Define strict types for your form keys. Formsy automatically validates email syntax, number ranges, required inputs, and sanitizes unwanted fields before they touch your database.
              </p>

              {/* Mini visual mockup of schema editor */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 16,
                  display: 'grid',
                  gap: 8,
                }}
              >
                <div className="flex items-center justify-between" style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)' }}>
                  <div className="flex items-center gap-sm">
                    <code className="code-inline">email</code>
                    <span style={{ fontSize: 13, color: 'var(--slate)' }}>User Email</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="badge badge-surface">email</span>
                    <span className="badge badge-error">Required</span>
                  </div>
                </div>

                <div className="flex items-center justify-between" style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)' }}>
                  <div className="flex items-center gap-sm">
                    <code className="code-inline">budget</code>
                    <span style={{ fontSize: 13, color: 'var(--slate)' }}>Project Budget</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="badge badge-surface">number</span>
                    <span style={{ fontSize: 12, color: 'var(--stone)' }}>Optional</span>
                  </div>
                </div>

                <div className="flex items-center justify-between" style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)' }}>
                  <div className="flex items-center gap-sm">
                    <code className="code-inline">newsletter</code>
                    <span style={{ fontSize: 13, color: 'var(--slate)' }}>Subscribe to updates</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="badge badge-surface">boolean</span>
                    <span style={{ fontSize: 12, color: 'var(--stone)' }}>Optional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (Spam & Rate Limiting) */}
            <div className="bento-card" style={{ gridColumn: 'span 5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-error)' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-heading-4">Triple-Guard Spam Shield</h3>
                  <span style={{ fontSize: 12, color: 'var(--steel)' }}>Zero spam in your database</span>
                </div>
              </div>
              <p className="text-body-md" style={{ color: 'var(--slate)', marginBottom: 20 }}>
                Includes built-in honeypot field traps, 60 requests/minute Upstash Redis IP rate limiting, and CORS origin restrictions.
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="flex items-center gap-sm" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)', fontSize: 13 }}>
                  <CheckCircle2 size={16} color="var(--brand-green-deep)" />
                  <span>Honeypot trap discards bots silently</span>
                </div>
                <div className="flex items-center gap-sm" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)', fontSize: 13 }}>
                  <CheckCircle2 size={16} color="var(--brand-green-deep)" />
                  <span>CORS origin domain allowlist</span>
                </div>
                <div className="flex items-center gap-sm" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)', fontSize: 13 }}>
                  <CheckCircle2 size={16} color="var(--brand-green-deep)" />
                  <span>60 req/min Upstash Redis limiter</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (Resend Email Notifications) */}
            <div className="bento-card" style={{ gridColumn: 'span 4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--brand-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green-deep)', marginBottom: 14 }}>
                <Mail size={20} />
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Resend Email Delivery</h3>
              <p className="text-body-sm" style={{ color: 'var(--steel)', marginBottom: 18 }}>
                Off by default to prevent unwanted inbox noise. Turn it on with one switch to get instantaneous, formatted HTML emails whenever someone submits.
              </p>
              <div className="flex items-center justify-between" style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Email alerts</span>
                <span className="badge badge-success">Instant toggle</span>
              </div>
            </div>

            {/* Bento Card 4 (0.5KB CDN SDK) */}
            <div className="bento-card" style={{ gridColumn: 'span 4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--brand-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green-deep)', marginBottom: 14 }}>
                <Zap size={20} />
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Under 0.5KB SDK</h3>
              <p className="text-body-sm" style={{ color: 'var(--steel)', marginBottom: 18 }}>
                Drop in a single script tag or use standard <code>fetch()</code>. Zero heavy dependencies, zero external tracking, loads in under 10ms.
              </p>
              <div style={{ padding: '10px 12px', background: '#0B0F17', borderRadius: 'var(--radius-md)', fontFamily: 'Geist Mono, monospace', fontSize: 11, color: '#00D4A4', marginTop: 'auto' }}>
                Formsy.submit('slug', data)
              </div>
            </div>

            {/* Bento Card 5 (Submission Inbox & CSV) */}
            <div className="bento-card" style={{ gridColumn: 'span 4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--brand-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green-deep)', marginBottom: 14 }}>
                <Terminal size={20} />
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Submissions &amp; CSV Export</h3>
              <p className="text-body-sm" style={{ color: 'var(--steel)', marginBottom: 18 }}>
                Inspect raw payloads, track read/unread states, and export your entire dataset into a CSV spreadsheet in a single click.
              </p>
              <div className="flex items-center justify-between" style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Export data</span>
                <span className="badge badge-surface">1-Click CSV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Code Generator Section ─────────────────────────────── */}
      <section id="demo" style={{ padding: 'var(--space-section) 0', background: '#F8FAFC', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Interactive Sandbox
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 14 }}>
              Copy, paste, and ship.
            </h2>
            <p className="text-subtitle">
              Select your favorite framework and see how clean the integration is.
            </p>
          </div>

          <div style={{ maxWidth: 840, margin: '0 auto', background: '#FFFFFF', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            {/* Tabs */}
            <div className="flex items-center justify-between" style={{ padding: '14px 20px', borderBottom: '1px solid var(--hairline)', background: '#FAFAFB' }}>
              <div className="flex items-center gap-xs">
                {(['react', 'curl', 'html'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSandboxTab(tab)}
                    className="btn btn-sm"
                    style={{
                      background: sandboxTab === tab ? '#0F172A' : 'transparent',
                      color: sandboxTab === tab ? '#FFFFFF' : 'var(--steel)',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 16px',
                      fontSize: 13,
                    }}
                  >
                    {tab === 'react' ? 'React / Next.js' : tab === 'curl' ? 'cURL Terminal' : 'HTML5 & CDN'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  let codeToCopy = ''
                  if (sandboxTab === 'react') {
                    codeToCopy = `import { useState } from 'react'

export default function FormsyContact() {
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    const res = await fetch('https://api.formsy.dev/submit/abc123xyz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) setSent(true)
  }

  if (sent) return <p>Thanks! We will be in touch soon.</p>

  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your message..." />
      <input name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit">Send Message</button>
    </form>
  )
}`
                  } else if (sandboxTab === 'curl') {
                    codeToCopy = `curl -X POST https://api.formsy.dev/submit/abc123xyz \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex Smith",
    "email": "alex@company.com",
    "message": "We would like to book a demo."
  }'`
                  } else {
                    codeToCopy = `<script src="https://cdn.formsy.dev/v1/formsy.min.js"></script>

<form id="contact-form">
  <input name="name" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <textarea name="message" placeholder="Message"></textarea>
  <input name="_honeypot" style="display:none" tabindex="-1">
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    await Formsy.submit('abc123xyz', data)
    alert('Submission successful!')
  })
</script>`
                  }
                  copySandboxCode(codeToCopy)
                }}
                className="btn btn-secondary btn-sm flex items-center gap-xs"
              >
                {copiedSandbox ? <Check size={13} color="var(--brand-green-deep)" /> : <Copy size={13} />}
                <span>{copiedSandbox ? 'Copied' : 'Copy code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div style={{ background: '#0B0F17', padding: 24, overflowX: 'auto', color: '#E2E8F0', fontFamily: 'Geist Mono, monospace', fontSize: 13, lineHeight: 1.65 }}>
              {sandboxTab === 'react' && (
                <pre style={{ margin: 0 }}>
{`import { useState } from 'react'

export default function FormsyContact() {
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    const res = await fetch('https://api.formsy.dev/submit/abc123xyz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) setSent(true)
  }

  if (sent) return <p>Thanks! We will be in touch soon.</p>

  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your message..." />
      {/* Invisible honeypot traps bots */}
      <input name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit">Send Message</button>
    </form>
  )
}`}
                </pre>
              )}

              {sandboxTab === 'curl' && (
                <pre style={{ margin: 0 }}>
{`curl -X POST https://api.formsy.dev/submit/abc123xyz \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex Smith",
    "email": "alex@company.com",
    "message": "We would like to book a demo."
  }'`}
                </pre>
              )}

              {sandboxTab === 'html' && (
                <pre style={{ margin: 0 }}>
{`<!-- Include the 0.5KB script -->
<script src="https://cdn.formsy.dev/v1/formsy.min.js"></script>

<form id="contact-form">
  <input name="name" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <textarea name="message" placeholder="Message"></textarea>
  <input name="_honeypot" style="display:none" tabindex="-1">
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    await Formsy.submit('abc123xyz', data)
    alert('Submission successful!')
  })
</script>`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Workflow
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 14 }}>
              Live in three simple steps.
            </h2>
            <p className="text-subtitle">
              From zero to working submission pipeline in under sixty seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--brand-green-deep)', marginBottom: 16 }}>
                01
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Name &amp; Define Fields</h3>
              <p className="text-body-md" style={{ color: 'var(--steel)' }}>
                Add text, email, number, textarea, or boolean fields in the visual schema editor. Formsy builds the validation rules automatically.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--brand-green-deep)', marginBottom: 16 }}>
                02
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Copy Your Endpoint</h3>
              <p className="text-body-md" style={{ color: 'var(--steel)' }}>
                You get a unique, high-throughput HTTPS POST URL. Point your form's action attribute or fetch request directly to it.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--brand-green-deep)', marginBottom: 16 }}>
                03
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Collect &amp; Automate</h3>
              <p className="text-body-md" style={{ color: 'var(--steel)' }}>
                Submissions stream into your dashboard in real-time. Optional Resend alerts notify you instantly without any backend maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ───────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: 'var(--space-section) 0', background: '#F8FAFC', borderTop: '1px solid var(--hairline)' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Questions &amp; Answers
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 12 }}>
              Frequently Asked Questions
            </h2>
            <p className="text-subtitle">
              Clear answers to common questions about Formsy.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {[
              {
                q: 'What are the limits on Formsy?',
                a: `Every user gets a hard limit of up to ${APP_LIMITS.MAX_FORMS_PER_USER} active forms and ${APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} submissions per month completely free. There are zero paid tiers or surprise credit card charges.`,
              },
              {
                q: 'How does email delivery work with Resend?',
                a: 'Email notifications are OFF by default on every new form. When you want instant alerts, toggle it ON in your form settings. When someone submits, a formatted HTML alert is dispatched via Resend to your registered account email.',
              },
              {
                q: 'Do bot submissions consume my monthly quota?',
                a: 'No. Formsy includes automated honeypot field detection. If a bot fills out the hidden honeypot field, the request is safely discarded without touching your database or consuming your monthly 100-submission limit.',
              },
              {
                q: 'Can I restrict submissions to only my domain?',
                a: 'Yes! You can specify an allowed origins list (e.g. https://yourdomain.com). Requests originating from unapproved domains are rejected with a 403 Forbidden error.',
              },
              {
                q: 'Can I export my submissions data?',
                a: 'Yes. At any time, you can open any form in your dashboard and click "Export CSV" to download all historical submissions.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: openFaq === idx ? '1px solid var(--brand-green-deep)' : '1px solid var(--hairline)',
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between">
                  <h4 style={{ fontSize: 16, fontWeight: 600 }}>{faq.q}</h4>
                  {openFaq === idx ? <ChevronUp size={18} color="var(--brand-green-deep)" /> : <ChevronDown size={18} color="var(--steel)" />}
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: 12, fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pre-Footer CTA Banner ─────────────────────────────────────────── */}
      <section id="cta" style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0A0D14 0%, #161F30 100%)',
              borderRadius: 'var(--radius-2xl)',
              padding: '64px 32px',
              textAlign: 'center',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Subtle glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                height: 300,
                background: 'radial-gradient(ellipse, rgba(0,212,164,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
              <span className="badge badge-green" style={{ marginBottom: 16 }}>
                Get Started in 60 Seconds
              </span>
              <h2 className="text-display-lg" style={{ color: '#FFFFFF', marginBottom: 16 }}>
                Start collecting form responses today.
              </h2>
              <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 32, lineHeight: 1.6 }}>
                Up to 10 forms and 100 submissions every month. Sign in with GitHub or Google and copy your first endpoint in seconds.
              </p>

              <div className="flex items-center justify-center gap-md" style={{ flexWrap: 'wrap' }}>
                {!isLoading && isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-accent btn-lg flex items-center gap-sm">
                    <LayoutDashboard size={18} />
                    <span>Go to Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => loginWithGithub()}
                      className="btn btn-accent btn-lg flex items-center gap-sm"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>Continue with GitHub</span>
                    </button>
                    <button
                      onClick={() => loginWithGoogle()}
                      className="btn btn-secondary btn-lg flex items-center gap-sm"
                      style={{ background: '#FFFFFF', color: '#0F172A' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--hairline)', padding: '54px 0 36px', background: '#FAFAFB' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 24, marginBottom: 36 }}>
            <div className="flex items-center gap-sm">
              <div className="nav-logo-mark">
                <Layers size={16} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>Formsy</span>
              <span className="badge badge-surface" style={{ marginLeft: 8 }}>v2.0</span>
            </div>

            <div className="flex items-center gap-lg" style={{ fontSize: 13, color: 'var(--steel)' }}>
              <a href="#features" className="nav-link">Features</a>
              <a href="#demo" className="nav-link">Demo</a>
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>

            <div className="flex items-center gap-xs" style={{ fontSize: 13, color: 'var(--slate)' }}>
              <span className="pill-dot" />
              <span>All systems operational</span>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--hairline)', paddingTop: 24, fontSize: 13, color: 'var(--stone)' }}>
            <p>© {new Date().getFullYear()} Formsy · Instant form backend platform.</p>
            <p>Designed for speed, privacy, and simplicity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
