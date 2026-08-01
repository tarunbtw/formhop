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
  Paperclip,
  Sparkles,
  Sliders,
  Send,
  RefreshCw,
  Download,
  Code2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { APP_LIMITS } from '../lib/constants'

type TemplateKey = 'feedback' | 'event' | 'job'

interface FormField {
  key: string
  label: string
  type: 'text' | 'email' | 'select' | 'textarea' | 'url'
  placeholder: string
  required?: boolean
  options?: string[]
}

interface TemplateConfig {
  name: string
  slug: string
  prompt: string
  badge: string
  fields: FormField[]
  sampleData: Record<string, string>
}

const TEMPLATES: Record<TemplateKey, TemplateConfig> = {
  feedback: {
    name: 'Customer Feedback Survey',
    slug: 'customer-feedback',
    prompt: 'Customer feedback survey with satisfaction rating, product feedback, and email address',
    badge: 'Feedback Survey',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Alex Morgan', required: true },
      { key: 'email', label: 'Work Email', type: 'email', placeholder: 'alex@company.com', required: true },
      {
        key: 'rating',
        label: 'Satisfaction Score',
        type: 'select',
        placeholder: '5 - Exceeded expectations',
        options: ['5 - Exceeded expectations', '4 - Great experience', '3 - Met expectations', '2 - Needs improvement'],
      },
      { key: 'feedback', label: 'What could we improve?', type: 'textarea', placeholder: 'Loved the fast endpoint setup...' },
    ],
    sampleData: {
      name: 'Alex Morgan',
      email: 'alex@company.com',
      rating: '5 - Exceeded expectations',
      feedback: 'Setup took literally 45 seconds.',
    },
  },
  event: {
    name: 'Event Registration Form',
    slug: 'event-registration',
    prompt: 'Event registration form with attendee name, company email, ticket tier, and dietary notes',
    badge: 'Event RSVP',
    fields: [
      { key: 'attendee_name', label: 'Attendee Name', type: 'text', placeholder: 'Jordan Lee', required: true },
      { key: 'email', label: 'Work Email', type: 'email', placeholder: 'jordan@devcon.io', required: true },
      {
        key: 'ticket_tier',
        label: 'Pass Type',
        type: 'select',
        placeholder: 'Developer Pass (In-Person)',
        options: ['Developer Pass (In-Person)', 'VIP Keynote Pass', 'Virtual Livestream'],
      },
      { key: 'notes', label: 'Dietary or Accessibility Needs', type: 'textarea', placeholder: 'Vegetarian lunch please' },
    ],
    sampleData: {
      attendee_name: 'Jordan Lee',
      email: 'jordan@devcon.io',
      ticket_tier: 'Developer Pass (In-Person)',
      notes: 'Vegetarian lunch please',
    },
  },
  job: {
    name: 'Job Application Form',
    slug: 'job-application',
    prompt: 'Job application form with applicant name, portfolio URL, resume link, and cover note',
    badge: 'Hiring Inbound',
    fields: [
      { key: 'full_name', label: 'Candidate Name', type: 'text', placeholder: 'Sarah Chen', required: true },
      { key: 'email', label: 'Contact Email', type: 'email', placeholder: 'sarah@chen.dev', required: true },
      { key: 'portfolio', label: 'GitHub / Portfolio URL', type: 'url', placeholder: 'https://github.com/sarahchen', required: true },
      { key: 'cover_note', label: 'Why Formsy?', type: 'textarea', placeholder: 'Experience building full-stack applications...' },
    ],
    sampleData: {
      full_name: 'Sarah Chen',
      email: 'sarah@chen.dev',
      portfolio: 'https://github.com/sarahchen',
      cover_note: 'Passionate about high-velocity developer tools.',
    },
  },
}

export default function LandingPage() {
  const [searchParams] = useSearchParams()
  const authError = searchParams.get('auth_error')
  const { isAuthenticated, isLoading, loginWithGithub, loginWithGoogle } = useAuth()

  // ─── Hero Prompt & Template State ───────────────────────────────────────────
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('event')
  const [promptText, setPromptText] = useState(
    'Event registration form with attendee name, company email, ticket tier, and dietary notes'
  )

  // ─── Interactive Preview State ─────────────────────────────────────────────
  const [previewTab, setPreviewTab] = useState<'form' | 'react' | 'curl' | 'inbox'>('form')
  const [formInputs, setFormInputs] = useState<Record<string, string>>({
    attendee_name: 'Jordan Lee',
    email: 'jordan@devcon.io',
    ticket_tier: 'Developer Pass (In-Person)',
    notes: 'Vegetarian lunch please',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // ─── Developer Sandbox State ───────────────────────────────────────────────
  const [sandboxTab, setSandboxTab] = useState<'react' | 'curl' | 'html'>('react')
  const [copiedSandbox, setCopiedSandbox] = useState(false)

  // ─── FAQ Open State ────────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const activeTemplate = TEMPLATES[selectedTemplate]

  const handleSelectTemplate = (key: TemplateKey) => {
    setSelectedTemplate(key)
    setPromptText(TEMPLATES[key].prompt)
    setFormInputs(TEMPLATES[key].sampleData)
    setSubmitted(false)
  }

  const handlePromptCreate = () => {
    const el = document.getElementById('demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 650)
  }

  const copySnippet = (code: string, isSandbox = false) => {
    navigator.clipboard.writeText(code)
    if (isSandbox) {
      setCopiedSandbox(true)
      setTimeout(() => setCopiedSandbox(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  const getCurlCode = () => {
    return `curl -X POST https://api.formsy.dev/submit/${activeTemplate.slug} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(formInputs, null, 2)}'`
  }

  const getReactCode = () => {
    return `import { useState } from 'react'

export function ${activeTemplate.name.replace(/\s+/g, '')}() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    const res = await fetch('https://api.formsy.dev/submit/${activeTemplate.slug}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  if (status === 'success') {
    return <div className="text-emerald-600 font-medium">Submission received!</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Invisible spam honeypot */}
      <input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
${activeTemplate.fields
  .map(
    (f) => `      <div>
        <label className="text-xs font-semibold text-slate-700">${f.label}</label>
        <input name="${f.key}" type="${f.type === 'select' ? 'text' : f.type}" ${f.required ? 'required ' : ''}className="w-full border rounded-lg px-3 py-2" />
      </div>`
  )
  .join('\n')}
      <button type="submit" disabled={status === 'loading'} className="bg-slate-900 text-white rounded-full px-5 py-2">
        {status === 'loading' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}`
  }

  return (
    <div style={{ background: '#FFFFFF', color: 'var(--ink)' }}>
      {/* ─── Hero Section with Fillout Aesthetic & Pinterest Art Cover ───── */}
      <section className="hero-cover-section">
        <div className="hero-cover-overlay" />

        <div className="hero-cover-content">
          {authError && (
            <div
              style={{
                maxWidth: 480,
                margin: '0 auto 20px',
                background: 'rgba(239, 68, 68, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px 16px',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              {authError === 'session_expired'
                ? 'Your session expired. Please sign in again.'
                : 'Authentication failed. Please try again.'}
            </div>
          )}

          {/* Main Hero Headline */}
          <h1 className="hero-title-white">Forms that do it all</h1>

          {/* Subtitle */}
          <p className="hero-subtitle-white">
            Describe the form you need and go live in minutes.
          </p>

          {/* ─── Hero AI Prompt Creation Card (Fillout Signature Box) ───────── */}
          <div className="hero-prompt-card">
            <textarea
              className="hero-prompt-input"
              rows={2}
              placeholder="Describe the form you want to create..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />

            <div className="hero-prompt-footer">
              <div className="flex items-center gap-xs">
                <button
                  type="button"
                  title="Form attachment / schema options"
                  onClick={() => setPromptText('Waitlist signup with name, work email, and referral source')}
                  style={{
                    color: '#64748B',
                    padding: 6,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Paperclip size={17} />
                </button>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  Schema-validated endpoint
                </span>
              </div>

              <div className="flex items-center gap-sm">
                <button
                  type="button"
                  onClick={handlePromptCreate}
                  className="hero-prompt-btn"
                >
                  <span>Create form</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ─── Suggestion Pills ───────────────────────────────────────────── */}
          <div className="hero-suggestion-pills">
            <button
              type="button"
              onClick={() => handleSelectTemplate('feedback')}
              className={`suggestion-pill ${selectedTemplate === 'feedback' ? 'active' : ''}`}
            >
              Customer feedback survey
            </button>
            <button
              type="button"
              onClick={() => handleSelectTemplate('event')}
              className={`suggestion-pill ${selectedTemplate === 'event' ? 'active' : ''}`}
            >
              Event registration form
            </button>
            <button
              type="button"
              onClick={() => handleSelectTemplate('job')}
              className={`suggestion-pill ${selectedTemplate === 'job' ? 'active' : ''}`}
            >
              Job application form
            </button>
          </div>

          {/* Sub Link */}
          <a href="#demo" className="hero-blank-link">
            Prefer drag and drop? Start a blank form &rarr;
          </a>
        </div>
      </section>

      {/* ─── Floating Feature Category Dock (Fillout Style Dock) ─────────── */}
      <div className="container" style={{ position: 'relative' }}>
        <div className="feature-dock">
          <div className="dock-item">
            <CheckCircle2 size={16} color="var(--brand-green-deep)" />
            <span>Type Validation</span>
          </div>
          <div className="dock-item">
            <Shield size={16} color="#6366F1" />
            <span>Spam Fortress</span>
          </div>
          <div className="dock-item">
            <Mail size={16} color="#EC4899" />
            <span>Resend Alerts</span>
          </div>
          <div className="dock-item">
            <Zap size={16} color="#F59E0B" />
            <span>Rate Limiting</span>
          </div>
          <div className="dock-item">
            <Code2 size={16} color="#0EA5E9" />
            <span>0.5KB Embed</span>
          </div>
          <div className="dock-item">
            <Download size={16} color="#10B981" />
            <span>CSV Submissions</span>
          </div>
        </div>
      </div>

      {/* ─── Interactive Product Preview (Sliding Up Into View) ───────────── */}
      <section id="demo" style={{ paddingTop: 80, paddingBottom: 60, background: '#FFFFFF' }}>
        <div className="container">
          {/* Section Heading */}
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Interactive Sandbox
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 12 }}>
              Live interactive endpoint preview
            </h2>
            <p className="text-subtitle">
              Try submitting below. Formsy validates fields, blocks honeypot spam, records the payload, and notifies via Resend.
            </p>
          </div>

          {/* Browser Mockup Centerpiece */}
          <div className="browser-mockup" style={{ maxWidth: 960, margin: '0 auto' }}>
            {/* Top Chrome Bar */}
            <div className="browser-topbar">
              <div className="browser-dots">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="browser-address">
                <Lock size={11} color="var(--brand-green-deep)" />
                <span>https://api.formsy.dev/submit/{activeTemplate.slug}</span>
              </div>
              <div className="flex items-center gap-xs">
                <button
                  onClick={() => setPreviewTab('form')}
                  className="btn btn-sm"
                  style={{
                    background: previewTab === 'form' ? '#FFFFFF' : 'transparent',
                    color: previewTab === 'form' ? 'var(--ink)' : 'var(--steel)',
                    boxShadow: previewTab === 'form' ? 'var(--shadow-xs)' : 'none',
                    padding: '5px 12px',
                    fontSize: 12,
                  }}
                >
                  Live Form
                </button>
                <button
                  onClick={() => setPreviewTab('react')}
                  className="btn btn-sm"
                  style={{
                    background: previewTab === 'react' ? '#FFFFFF' : 'transparent',
                    color: previewTab === 'react' ? 'var(--ink)' : 'var(--steel)',
                    boxShadow: previewTab === 'react' ? 'var(--shadow-xs)' : 'none',
                    padding: '5px 12px',
                    fontSize: 12,
                  }}
                >
                  React
                </button>
                <button
                  onClick={() => setPreviewTab('curl')}
                  className="btn btn-sm"
                  style={{
                    background: previewTab === 'curl' ? '#FFFFFF' : 'transparent',
                    color: previewTab === 'curl' ? 'var(--ink)' : 'var(--steel)',
                    boxShadow: previewTab === 'curl' ? 'var(--shadow-xs)' : 'none',
                    padding: '5px 12px',
                    fontSize: 12,
                  }}
                >
                  cURL
                </button>
                <button
                  onClick={() => setPreviewTab('inbox')}
                  className="btn btn-sm"
                  style={{
                    background: previewTab === 'inbox' ? '#FFFFFF' : 'transparent',
                    color: previewTab === 'inbox' ? 'var(--ink)' : 'var(--steel)',
                    boxShadow: previewTab === 'inbox' ? 'var(--shadow-xs)' : 'none',
                    padding: '5px 12px',
                    fontSize: 12,
                  }}
                >
                  Inbox (Live)
                </button>
              </div>
            </div>

            {/* Body of Mockup */}
            <div style={{ background: '#FFFFFF', padding: '28px' }}>
              {previewTab === 'form' && (
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                    <div>
                      <div className="flex items-center gap-xs" style={{ marginBottom: 4 }}>
                        <span className="badge badge-green">{activeTemplate.badge}</span>
                        <span style={{ fontSize: 12, color: 'var(--steel)' }}>Active Form Endpoint</span>
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>
                        {activeTemplate.name}
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--steel)' }}>
                      POST /submit/{activeTemplate.slug}
                    </span>
                  </div>

                  {!submitted ? (
                    <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: 16 }}>
                      {activeTemplate.fields.map((field) => (
                        <div key={field.key}>
                          <label className="label" style={{ fontSize: 13 }}>
                            {field.label} {field.required && <span style={{ color: 'var(--brand-error)' }}>*</span>}
                          </label>

                          {field.type === 'textarea' ? (
                            <textarea
                              className="input"
                              rows={3}
                              placeholder={field.placeholder}
                              value={formInputs[field.key] ?? ''}
                              onChange={(e) =>
                                setFormInputs({ ...formInputs, [field.key]: e.target.value })
                              }
                            />
                          ) : field.type === 'select' ? (
                            <select
                              className="input"
                              value={formInputs[field.key] ?? ''}
                              onChange={(e) =>
                                setFormInputs({ ...formInputs, [field.key]: e.target.value })
                              }
                            >
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              className="input"
                              placeholder={field.placeholder}
                              required={field.required}
                              value={formInputs[field.key] ?? ''}
                              onChange={(e) =>
                                setFormInputs({ ...formInputs, [field.key]: e.target.value })
                              }
                            />
                          )}
                        </div>
                      ))}

                      {/* Honeypot field (hidden from legitimate users) */}
                      <input name="_honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                      <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--steel)' }}>
                          🔒 Honeypot &amp; Redis rate-limit active
                        </span>
                        <button
                          type="submit"
                          className="btn btn-accent btn-sm flex items-center gap-xs"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={13} className="spinner" />
                              <span>Validating payload...</span>
                            </>
                          ) : (
                            <>
                              <Send size={13} />
                              <span>Submit to endpoint</span>
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
                        borderRadius: 'var(--radius-xl)',
                        padding: 28,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px',
                        }}
                      >
                        <CheckCircle2 size={26} />
                      </div>
                      <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                        Submission Received &amp; Validated!
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--steel)', marginBottom: 18 }}>
                        Payload matched schema types. IP rate limiter OK. Resend alert dispatched.
                      </p>

                      <div
                        style={{
                          background: '#0B0F17',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 18px',
                          textAlign: 'left',
                          fontFamily: 'Geist Mono, monospace',
                          fontSize: 12,
                          color: '#00D4A4',
                          marginBottom: 18,
                        }}
                      >
                        <pre style={{ margin: 0 }}>
{`HTTP/1.1 200 OK
{
  "ok": true,
  "id": "sub_${Math.random().toString(36).slice(2, 10)}",
  "project": "${activeTemplate.slug}",
  "data": ${JSON.stringify(formInputs, null, 2)},
  "email_alert": "Dispatched via Resend",
  "monthly_quota": "1/100 used"
}`}
                        </pre>
                      </div>

                      <div className="flex items-center justify-center gap-sm">
                        <button
                          onClick={() => setSubmitted(false)}
                          className="btn btn-secondary btn-sm"
                        >
                          Submit another entry
                        </button>
                        <button
                          onClick={() => setPreviewTab('inbox')}
                          className="btn btn-primary btn-sm flex items-center gap-xs"
                        >
                          <span>View in inbox</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {previewTab === 'react' && (
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--steel)', fontFamily: 'Geist Mono, monospace' }}>
                      ContactForm.tsx (Zero external dependencies)
                    </span>
                    <button
                      onClick={() => copySnippet(getReactCode())}
                      className="btn btn-ghost btn-sm flex items-center gap-xs"
                      style={{ fontSize: 12 }}
                    >
                      {copiedCode ? <Check size={13} color="var(--brand-green-deep)" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied' : 'Copy React'}</span>
                    </button>
                  </div>
                  <div
                    style={{
                      background: '#0B0F17',
                      borderRadius: 'var(--radius-lg)',
                      padding: 20,
                      color: '#E2E8F0',
                      fontFamily: 'Geist Mono, monospace',
                      fontSize: 13,
                      lineHeight: 1.6,
                      overflowX: 'auto',
                    }}
                  >
                    <pre style={{ margin: 0 }}>{getReactCode()}</pre>
                  </div>
                </div>
              )}

              {previewTab === 'curl' && (
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--steel)', fontFamily: 'Geist Mono, monospace' }}>
                      terminal / bash
                    </span>
                    <button
                      onClick={() => copySnippet(getCurlCode())}
                      className="btn btn-ghost btn-sm flex items-center gap-xs"
                      style={{ fontSize: 12 }}
                    >
                      {copiedCode ? <Check size={13} color="var(--brand-green-deep)" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <div
                    style={{
                      background: '#0B0F17',
                      borderRadius: 'var(--radius-lg)',
                      padding: 20,
                      color: '#E2E8F0',
                      fontFamily: 'Geist Mono, monospace',
                      fontSize: 13,
                      lineHeight: 1.6,
                      overflowX: 'auto',
                    }}
                  >
                    <pre style={{ margin: 0 }}>{getCurlCode()}</pre>
                  </div>
                </div>
              )}

              {previewTab === 'inbox' && (
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 700 }}>Submissions Inbox (Simulated)</h4>
                      <p style={{ fontSize: 12, color: 'var(--steel)' }}>Showing live submissions received by this endpoint</p>
                    </div>
                    <button
                      onClick={() => alert('Simulated CSV download')}
                      className="btn btn-secondary btn-sm flex items-center gap-xs"
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--hairline)', color: 'var(--steel)' }}>
                          <th style={{ padding: '10px 14px' }}>Date</th>
                          <th style={{ padding: '10px 14px' }}>Primary Field</th>
                          <th style={{ padding: '10px 14px' }}>Email</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                          <td style={{ padding: '10px 14px', color: 'var(--steel)' }}>Just now</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{formInputs.name || formInputs.attendee_name || formInputs.full_name || 'Alex Morgan'}</td>
                          <td style={{ padding: '10px 14px' }}>{formInputs.email || 'alex@company.com'}</td>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-success">Verified</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                          <td style={{ padding: '10px 14px', color: 'var(--steel)' }}>12 mins ago</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>Dev Team lead</td>
                          <td style={{ padding: '10px 14px' }}>lead@startup.co</td>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-success">Verified</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 14px', color: 'var(--steel)' }}>1 hour ago</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>Product Designer</td>
                          <td style={{ padding: '10px 14px' }}>designer@creative.studio</td>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-success">Verified</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid: Everything Included ───────────────────────────────── */}
      <section id="features" style={{ padding: 'var(--space-section) 0', background: 'var(--canvas-subtle)' }}>
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
            {/* Bento Card 1: Visual Schema Validation */}
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

            {/* Bento Card 2: Spam & Rate Limiting */}
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
                Includes built-in honeypot field traps, 60 req/min Upstash Redis rate limiting, and CORS origin restrictions.
              </p>
              <div style={{ display: 'grid', gap: 10, marginTop: 'auto' }}>
                <div className="flex items-center gap-sm" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                  <Check size={16} color="var(--brand-green-deep)" />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Honeypot trap: Auto-drops bots silently</span>
                </div>
                <div className="flex items-center gap-sm" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                  <Check size={16} color="var(--brand-green-deep)" />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>SHA-256 IP hashing: Zero PII logged</span>
                </div>
                <div className="flex items-center gap-sm" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                  <Check size={16} color="var(--brand-green-deep)" />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>CORS protection: Restrict by allowed domains</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Resend Email Alerts */}
            <div className="bento-card" style={{ gridColumn: 'span 4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', marginBottom: 14 }}>
                <Mail size={20} />
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Resend Email Alerts</h3>
              <p className="text-body-sm" style={{ color: 'var(--slate)', marginBottom: 16 }}>
                Receive instant formatted email alerts when someone submits. Controlled per form and turned off by default to protect your quota.
              </p>
              <div className="badge badge-surface" style={{ width: 'fit-content', marginTop: 'auto' }}>
                Instant Resend API Integration
              </div>
            </div>

            {/* Bento Card 4: 0.5KB Embed */}
            <div className="bento-card" style={{ gridColumn: 'span 4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: 14 }}>
                <Zap size={20} />
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>0.5KB Drop-in Script</h3>
              <p className="text-body-sm" style={{ color: 'var(--slate)', marginBottom: 16 }}>
                Add one `&lt;script&gt;` tag or use standard `fetch()`. Works seamlessly with Astro, Next.js, Webflow, Framer, and plain HTML.
              </p>
              <div className="badge badge-surface" style={{ width: 'fit-content', marginTop: 'auto' }}>
                Zero Framework Lock-in
              </div>
            </div>

            {/* Bento Card 5: Free Universal Limits */}
            <div className="bento-card" style={{ gridColumn: 'span 4' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', marginBottom: 14 }}>
                <Sparkles size={20} />
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Free Universal Tier</h3>
              <p className="text-body-sm" style={{ color: 'var(--slate)', marginBottom: 16 }}>
                Every user gets up to {APP_LIMITS.MAX_FORMS_PER_USER} active forms and {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} submissions/month free. No credit card required.
              </p>
              <div className="badge badge-green" style={{ width: 'fit-content', marginTop: 'auto' }}>
                {APP_LIMITS.MAX_FORMS_PER_USER} Forms · {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} Submissions/Mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Framework Trust Stack ─────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', background: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="text-micro-upper" style={{ color: 'var(--steel)', marginBottom: 20 }}>
            Works with any frontend stack or static site generator
          </p>
          <div className="flex items-center justify-center gap-xl" style={{ flexWrap: 'wrap', opacity: 0.85 }}>
            {['Next.js', 'React', 'Astro', 'SvelteKit', 'Remix', 'Vite', 'HTML5 & Fetch'].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--slate)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works (3-Step Workflow) ────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: 'var(--space-section) 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 52px' }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Simple 3-Step Setup
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 14 }}>
              From idea to live endpoint in 60 seconds
            </h2>
            <p className="text-subtitle">
              No server setup, no SMTP configurations, no database queries.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="card" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 20 }}>
                1
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Create Form &amp; Schema</h3>
              <p className="text-body-sm" style={{ color: 'var(--slate)' }}>
                Set your form name and add the fields you require. Formsy sets up strict Zod type validation automatically.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 20 }}>
                2
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Point Your Form Endpoint</h3>
              <p className="text-body-sm" style={{ color: 'var(--slate)' }}>
                Copy your unique endpoint URL into your React fetch call or HTML <code>&lt;form action="..."&gt;</code>. Done.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 20 }}>
                3
              </div>
              <h3 className="text-heading-4" style={{ marginBottom: 8 }}>Receive Submissions</h3>
              <p className="text-body-sm" style={{ color: 'var(--slate)' }}>
                View clean submissions in your dashboard, download full CSV reports, and receive real-time email alerts via Resend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Developer Code Sandbox ────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-section) 0', background: 'var(--canvas-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span className="badge badge-green" style={{ marginBottom: 12 }}>
                Developer Friendly
              </span>
              <h2 className="text-display-lg" style={{ marginBottom: 14 }}>
                Integrates with your existing workflow
              </h2>
              <p className="text-subtitle">
                No heavyweight client library required. Standard HTTP POST requests work everywhere.
              </p>
            </div>

            <div style={{ background: '#0B0F17', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#111827' }}>
                <div className="flex items-center gap-xs">
                  <button
                    onClick={() => setSandboxTab('react')}
                    className="btn btn-sm"
                    style={{
                      background: sandboxTab === 'react' ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: sandboxTab === 'react' ? '#00D4A4' : '#94A3B8',
                      fontSize: 13,
                      padding: '5px 14px',
                    }}
                  >
                    React / Next.js
                  </button>
                  <button
                    onClick={() => setSandboxTab('curl')}
                    className="btn btn-sm"
                    style={{
                      background: sandboxTab === 'curl' ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: sandboxTab === 'curl' ? '#00D4A4' : '#94A3B8',
                      fontSize: 13,
                      padding: '5px 14px',
                    }}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setSandboxTab('html')}
                    className="btn btn-sm"
                    style={{
                      background: sandboxTab === 'html' ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: sandboxTab === 'html' ? '#00D4A4' : '#94A3B8',
                      fontSize: 13,
                      padding: '5px 14px',
                    }}
                  >
                    HTML5 Form
                  </button>
                </div>

                <button
                  onClick={() => {
                    const code =
                      sandboxTab === 'react'
                        ? getReactCode()
                        : sandboxTab === 'curl'
                        ? getCurlCode()
                        : `<form action="https://api.formsy.dev/submit/contact" method="POST">\n  <input type="text" name="name" required />\n  <input type="email" name="email" required />\n  <button type="submit">Submit</button>\n</form>`
                    copySnippet(code, true)
                  }}
                  className="btn btn-ghost btn-sm flex items-center gap-xs"
                  style={{ color: '#94A3B8', fontSize: 12 }}
                >
                  {copiedSandbox ? <Check size={13} color="var(--brand-green)" /> : <Copy size={13} />}
                  <span>{copiedSandbox ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{ padding: 24, overflowX: 'auto', color: '#E2E8F0', fontFamily: 'Geist Mono, monospace', fontSize: 13, lineHeight: 1.6 }}>
                <pre style={{ margin: 0 }}>
                  {sandboxTab === 'react'
                    ? getReactCode()
                    : sandboxTab === 'curl'
                    ? getCurlCode()
                    : `<!-- Zero JS required: standard browser submission -->
<form action="https://api.formsy.dev/submit/${activeTemplate.slug}" method="POST">
  <!-- Invisible Honeypot Spam Trap -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Send</button>
</form>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordion ─────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: 'var(--space-section) 0', background: '#FFFFFF' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>
              Questions &amp; Answers
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 12 }}>
              Frequently asked questions
            </h2>
            <p className="text-subtitle">
              Everything you need to know about Formsy's zero-config form endpoints.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              {
                q: 'What are the limits on the free plan?',
                a: `Every user can create up to ${APP_LIMITS.MAX_FORMS_PER_USER} active forms and receive up to ${APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} submissions per calendar month free. We have no hidden tiers or paid upgrades.`,
              },
              {
                q: 'How does Formsy prevent spam submissions?',
                a: 'Formsy employs a 3-layer security system: an invisible honeypot field trap that silently catches automated bots, Upstash Redis IP rate-limiting (60 req/min), and optional allowed CORS origins so only your domain can POST to your endpoint.',
              },
              {
                q: 'How do email alerts work?',
                a: 'You can enable email notifications on any of your forms from the project settings. When enabled, Formsy uses Resend to immediately forward the submission details to your verified account email address.',
              },
              {
                q: 'Can I use Formsy with React, Next.js, or plain HTML?',
                a: 'Yes! Formsy is standard HTTP POST compatible. You can submit using native fetch() in React/Next.js/Astro, or simply point a standard HTML <form action="..."> tag to your Formsy endpoint.',
              },
              {
                q: 'Is my data private and secure?',
                a: 'Yes. All submission data is stored encrypted in Postgres, IP addresses are anonymized via SHA-256 hashing (no raw PII retained), and endpoints require schema verification before saving.',
              },
            ].map((faq, idx) => (
              <div
                key={faq.q}
                style={{
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: openFaq === idx ? 'var(--canvas-subtle)' : '#FFFFFF',
                  transition: 'background 150ms ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--ink)',
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} color="var(--steel)" /> : <ChevronDown size={18} color="var(--steel)" />}
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 20px 20px', fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pre-Footer CTA Banner ─────────────────────────────────────────── */}
      <section id="cta" style={{ padding: '80px 0', background: 'var(--canvas-subtle)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <span className="badge badge-green" style={{ marginBottom: 14 }}>
              Get Started Today
            </span>
            <h2 className="text-display-lg" style={{ marginBottom: 16 }}>
              Ready to collect submissions without a backend?
            </h2>
            <p className="text-subtitle" style={{ marginBottom: 32 }}>
              Create your first form in 60 seconds. Free {APP_LIMITS.MAX_FORMS_PER_USER} forms &amp; {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} monthly submissions.
            </p>

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
                    <Terminal size={18} />
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

            <p style={{ fontSize: 13, color: 'var(--steel)' }}>
              No credit card required · Instant setup · Universal free tier
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ padding: '40px 0', background: '#FFFFFF', borderTop: '1px solid var(--hairline)' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 20 }}>
            <div className="flex items-center gap-sm">
              <span style={{ fontWeight: 800, fontSize: 16 }}>Formsy</span>
              <span style={{ fontSize: 13, color: 'var(--steel)' }}>© {new Date().getFullYear()} Formsy Inc. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-lg" style={{ fontSize: 13, color: 'var(--steel)' }}>
              <div className="flex items-center gap-xs">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-green-deep)', display: 'inline-block' }} />
                <span>All systems operational</span>
              </div>
              <a href="#features" style={{ color: 'inherit' }}>Features</a>
              <a href="#demo" style={{ color: 'inherit' }}>Demo</a>
              <a href="#faq" style={{ color: 'inherit' }}>FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
