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
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'

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
      { key: 'cover_note', label: 'Why Formhop?', type: 'textarea', placeholder: 'Experience building full-stack applications...' },
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
    return `curl -X POST https://api.formhop.dev/submit/${activeTemplate.slug} \\
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

    const res = await fetch('https://api.formhop.dev/submit/${activeTemplate.slug}', {
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
        <label className="text-xs font-semibold text-foreground/80">${f.label}</label>
        <input name="${f.key}" type="${f.type === 'select' ? 'text' : f.type}" ${f.required ? 'required ' : ''}className="w-full border rounded-lg px-3 py-2" />
      </div>`
  )
  .join('\n')}
      <button type="submit" disabled={status === 'loading'} className="bg-primary text-primary-foreground rounded-full px-5 py-2">
        {status === 'loading' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}`
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* ─── Top Floating Pill Navigation (Fillout Style) ────────────────── */}
      <header className="sticky top-4 z-50 px-4 mb-[-72px] pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6 rounded-full border border-border/80 bg-background/85 dark:bg-card/85 backdrop-blur-md shadow-lg pointer-events-auto transition-all">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-base text-foreground group">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
              F
            </div>
            <span className="tracking-tight text-foreground font-bold">Formhop</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
              v2.0
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {!isLoading && isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" className="rounded-full shadow-xs gap-1.5 text-xs font-semibold">
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => loginWithGithub()}
                  className="text-xs font-semibold px-3 py-1.5 text-foreground/80 hover:text-foreground transition-colors"
                >
                  Sign in
                </button>
                <Button
                  size="sm"
                  onClick={() => loginWithGithub()}
                  className="rounded-full shadow-xs gap-1 text-xs font-semibold"
                >
                  <span>Start free</span>
                  <ArrowRight size={13} />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section with Fillout Aesthetic & Pinterest Art Cover ───── */}
      <section className="hero-cover-section">
        <div className="hero-cover-overlay" />

        <div className="hero-cover-content">
          {authError && (
            <div className="max-w-md mx-auto mb-5 p-3 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold shadow-lg">
              {authError === 'session_expired'
                ? 'Your session expired. Please sign in again.'
                : 'Authentication failed. Please try again.'}
            </div>
          )}

          {/* Main Hero Headline */}
          <h1 className="hero-title-white">Forms that do it all</h1>

          {/* Subtitle */}
          <p className="hero-subtitle-white">
            Describe the form you need and go live in minutes. Zero backend required.
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Form attachment / schema options"
                  onClick={() => setPromptText('Waitlist signup with name, work email, and referral source')}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <Paperclip size={16} />
                </button>
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  Schema-validated endpoint
                </span>
              </div>

              <div className="flex items-center gap-2">
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
            Prefer custom code? Explore live interactive demo &darr;
          </a>
        </div>
      </section>

      {/* ─── Floating Feature Category Dock (Fillout Style Dock) ─────────── */}
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="feature-dock">
          <div className="dock-item">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Type Validation</span>
          </div>
          <div className="dock-item">
            <Shield size={16} className="text-indigo-500" />
            <span>Spam Fortress</span>
          </div>
          <div className="dock-item">
            <Mail size={16} className="text-pink-500" />
            <span>Resend Alerts</span>
          </div>
          <div className="dock-item">
            <Zap size={16} className="text-amber-500" />
            <span>Rate Limiting</span>
          </div>
          <div className="dock-item">
            <Code2 size={16} className="text-sky-500" />
            <span>0.5KB Embed</span>
          </div>
          <div className="dock-item">
            <Download size={16} className="text-emerald-500" />
            <span>CSV Submissions</span>
          </div>
        </div>
      </div>

      {/* ─── Interactive Product Preview ─────────────────────────────────── */}
      <section id="demo" className="py-20 md:py-24 bg-background transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section Heading */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Interactive Sandbox
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Live interactive endpoint preview
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Try submitting below. Formhop validates fields, blocks honeypot spam, records the payload, and notifies via Resend.
            </p>
          </div>

          {/* Browser Mockup Centerpiece */}
          <div className="browser-mockup">
            {/* Top Chrome Bar */}
            <div className="browser-topbar">
              <div className="browser-dots">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>

              <div className="browser-address">
                <Lock size={11} className="text-emerald-500" />
                <span>https://api.formhop.dev/submit/{activeTemplate.slug}</span>
              </div>

              <div className="flex items-center gap-1">
                {(['form', 'react', 'curl', 'inbox'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPreviewTab(tab)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                      previewTab === tab
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'form'
                      ? 'Live Form'
                      : tab === 'react'
                      ? 'React'
                      : tab === 'curl'
                      ? 'cURL'
                      : 'Inbox (Live)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Body of Mockup */}
            <div className="bg-card p-6 sm:p-8">
              {previewTab === 'form' && (
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs font-semibold">
                          {activeTemplate.badge}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Active Form Endpoint</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {activeTemplate.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                      POST /submit/{activeTemplate.slug}
                    </span>
                  </div>

                  {!submitted ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {activeTemplate.fields.map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            {field.label} {field.required && <span className="text-destructive">*</span>}
                          </label>

                          {field.type === 'textarea' ? (
                            <textarea
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              rows={3}
                              placeholder={field.placeholder}
                              value={formInputs[field.key] ?? ''}
                              onChange={(e) =>
                                setFormInputs({ ...formInputs, [field.key]: e.target.value })
                              }
                            />
                          ) : field.type === 'select' ? (
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                            <Input
                              type={field.type}
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

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Lock size={12} className="text-emerald-500" />
                          Honeypot trap &amp; Redis rate-limit active
                        </span>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isSubmitting}
                          className="gap-1.5 w-full sm:w-auto"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Validating payload...</span>
                            </>
                          ) : (
                            <>
                              <Send size={13} />
                              <span>Submit to endpoint</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="rounded-xl border border-border bg-secondary/30 p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={26} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-foreground">
                          Submission Received &amp; Validated!
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Payload matched schema types. IP rate limiter OK. Resend alert dispatched.
                        </p>
                      </div>

                      <div className="bg-charcoal text-emerald-400 rounded-lg p-3 text-left font-mono text-xs overflow-x-auto shadow-inner border border-charcoal-700">
                        <pre className="m-0">
{`HTTP/1.1 200 OK
{
  "ok": true,
  "id": "sub_live_${Math.random().toString(36).slice(2, 9)}",
  "project": "${activeTemplate.slug}",
  "data": ${JSON.stringify(formInputs, null, 2)},
  "email_alert": "Dispatched via Resend",
  "monthly_quota": "1/100 used"
}`}
                        </pre>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmitted(false)}
                        >
                          Submit another entry
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setPreviewTab('inbox')}
                          className="gap-1.5"
                        >
                          <span>View in inbox</span>
                          <ArrowRight size={13} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {previewTab === 'react' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      ContactForm.tsx (Zero external dependencies)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copySnippet(getReactCode())}
                      className="gap-1.5 text-xs h-8"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied' : 'Copy React'}</span>
                    </Button>
                  </div>
                  <div className="bg-charcoal text-ivory rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto border border-charcoal-700">
                    <pre className="m-0">{getReactCode()}</pre>
                  </div>
                </div>
              )}

              {previewTab === 'curl' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      terminal / bash
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copySnippet(getCurlCode())}
                      className="gap-1.5 text-xs h-8"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied' : 'Copy cURL'}</span>
                    </Button>
                  </div>
                  <div className="bg-charcoal text-ivory rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto border border-charcoal-700">
                    <pre className="m-0">{getCurlCode()}</pre>
                  </div>
                </div>
              )}

              {previewTab === 'inbox' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Submissions Inbox (Simulated)</h4>
                      <p className="text-xs text-muted-foreground">Showing inbound submissions received by this endpoint</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert('Simulated CSV export ready')}
                      className="gap-1.5 text-xs h-8"
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                    </Button>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border text-muted-foreground">
                          <th className="py-2.5 px-3 font-semibold">Date</th>
                          <th className="py-2.5 px-3 font-semibold">Primary Field</th>
                          <th className="py-2.5 px-3 font-semibold">Email</th>
                          <th className="py-2.5 px-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-secondary/20 transition-colors">
                          <td className="py-2.5 px-3 text-muted-foreground">Just now</td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            {formInputs.name || formInputs.attendee_name || formInputs.full_name || 'Alex Morgan'}
                          </td>
                          <td className="py-2.5 px-3 text-foreground">{formInputs.email || 'alex@company.com'}</td>
                          <td className="py-2.5 px-3">
                            <Badge variant="success" className="text-[10px]">Verified</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-secondary/20 transition-colors">
                          <td className="py-2.5 px-3 text-muted-foreground">12 mins ago</td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">Dev Team Lead</td>
                          <td className="py-2.5 px-3 text-foreground">lead@startup.co</td>
                          <td className="py-2.5 px-3">
                            <Badge variant="success" className="text-[10px]">Verified</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-secondary/20 transition-colors">
                          <td className="py-2.5 px-3 text-muted-foreground">1 hour ago</td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">Product Designer</td>
                          <td className="py-2.5 px-3 text-foreground">designer@creative.studio</td>
                          <td className="py-2.5 px-3">
                            <Badge variant="success" className="text-[10px]">Verified</Badge>
                          </td>
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
      <section id="features" className="py-20 bg-secondary/30 transition-colors border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
              Everything Included
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Built for speed. Hardened for production.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Never spin up an Express server, database migration, or SMTP transport just to intake a contact form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Visual Schema Validation */}
            <Card className="md:col-span-12 lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Visual Schema Validation</h3>
                    <span className="text-xs text-muted-foreground">Powered by dynamic Zod schemas</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Define strict types for your form keys. Formhop automatically validates email syntax, number ranges, required inputs, and sanitizes unwanted fields before they touch your database.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/60">
                  <div className="flex items-center gap-2.5">
                    <code className="text-xs font-mono font-bold text-foreground">email</code>
                    <span className="text-xs text-muted-foreground">User Email</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">email</Badge>
                    <Badge variant="destructive" className="text-[10px]">Required</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/60">
                  <div className="flex items-center gap-2.5">
                    <code className="text-xs font-mono font-bold text-foreground">budget</code>
                    <span className="text-xs text-muted-foreground">Project Budget</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">number</Badge>
                    <span className="text-[11px] text-muted-foreground">Optional</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/60">
                  <div className="flex items-center gap-2.5">
                    <code className="text-xs font-mono font-bold text-foreground">newsletter</code>
                    <span className="text-xs text-muted-foreground">Subscribe to updates</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">boolean</Badge>
                    <span className="text-[11px] text-muted-foreground">Optional</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bento Card 2: Spam & Rate Limiting */}
            <Card className="md:col-span-12 lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Triple-Guard Spam Shield</h3>
                    <span className="text-xs text-muted-foreground">Zero spam in your database</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Includes built-in honeypot field traps, 60 req/min Upstash Redis rate limiting, and CORS origin restrictions.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/40 border border-border/60 text-xs font-medium text-foreground">
                  <Check size={15} className="text-emerald-500 shrink-0" />
                  <span>Honeypot trap: Auto-drops bots silently</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/40 border border-border/60 text-xs font-medium text-foreground">
                  <Check size={15} className="text-emerald-500 shrink-0" />
                  <span>SHA-256 IP hashing: Zero PII logged</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/40 border border-border/60 text-xs font-medium text-foreground">
                  <Check size={15} className="text-emerald-500 shrink-0" />
                  <span>CORS protection: Restrict by allowed domains</span>
                </div>
              </div>
            </Card>

            {/* Bento Card 3: Resend Email Alerts */}
            <Card className="md:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Mail size={20} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Resend Email Alerts</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Receive instant formatted email alerts when someone submits. Controlled per form and turned off by default to protect your quota.
                </p>
              </div>
              <Badge variant="outline" className="w-fit text-[11px]">
                Instant Resend API Integration
              </Badge>
            </Card>

            {/* Bento Card 4: 0.5KB Embed */}
            <Card className="md:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Zap size={20} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">0.5KB Drop-in Script</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Add one &lt;script&gt; tag or use standard fetch(). Works seamlessly with Astro, Next.js, Webflow, Framer, and plain HTML.
                </p>
              </div>
              <Badge variant="outline" className="w-fit text-[11px]">
                Zero Framework Lock-in
              </Badge>
            </Card>

            {/* Bento Card 5: Free Universal Limits */}
            <Card className="md:col-span-12 lg:col-span-4 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Free Universal Tier</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Every user gets up to {APP_LIMITS.MAX_FORMS_PER_USER} active forms and {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} submissions/month free. No credit card required.
                </p>
              </div>
              <Badge variant="success" className="w-fit text-[11px]">
                {APP_LIMITS.MAX_FORMS_PER_USER} Forms · {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} Submissions/Mo
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Framework Trust Stack ─────────────────────────────────────────── */}
      <section className="py-12 bg-background border-b border-border transition-colors">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-5">
            Works with any frontend stack or static site generator
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {['Next.js', 'React', 'Astro', 'SvelteKit', 'Remix', 'Vite', 'HTML5 & Fetch'].map((item) => (
              <span
                key={item}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-card text-foreground shadow-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works (3-Step Workflow) ────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-background transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Simple 3-Step Setup
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              From idea to live endpoint in 60 seconds
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              No server setup, no SMTP configurations, no database queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">Create Form &amp; Schema</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Set your form name and add the fields you require. Formhop sets up strict Zod type validation automatically.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">Point Your Form Endpoint</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy your unique endpoint URL into your React fetch call or HTML <code className="bg-secondary px-1 py-0.5 rounded text-[11px]">&lt;form action="..."&gt;</code>. Done.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">Receive Submissions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                View clean submissions in your dashboard, download full CSV reports, and receive real-time email alerts via Resend.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Developer Code Sandbox ────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30 transition-colors border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
              Developer Friendly
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Integrates with your existing workflow
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              No heavyweight client library required. Standard HTTP POST requests work everywhere.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-charcoal-700 bg-charcoal text-ivory shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-700 bg-charcoal-900/60">
              <div className="flex items-center gap-1.5">
                {(['react', 'curl', 'html'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSandboxTab(tab)}
                    className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                      sandboxTab === tab
                        ? 'bg-ivory/15 text-emerald-400'
                        : 'text-ivory/60 hover:text-ivory'
                    }`}
                  >
                    {tab === 'react' ? 'React / Next.js' : tab === 'curl' ? 'cURL' : 'HTML5 Form'}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const code =
                    sandboxTab === 'react'
                      ? getReactCode()
                      : sandboxTab === 'curl'
                      ? getCurlCode()
                      : `<form action="https://api.formhop.dev/submit/contact" method="POST">\n  <input type="text" name="name" required />\n  <input type="email" name="email" required />\n  <button type="submit">Submit</button>\n</form>`
                  copySnippet(code, true)
                }}
                className="text-ivory/70 hover:text-ivory hover:bg-ivory/10 gap-1.5 text-xs h-7"
              >
                {copiedSandbox ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedSandbox ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>

            <div className="p-5 overflow-x-auto font-mono text-xs leading-relaxed text-ivory/90">
              <pre className="m-0">
                {sandboxTab === 'react'
                  ? getReactCode()
                  : sandboxTab === 'curl'
                  ? getCurlCode()
                  : `<!-- Zero JS required: standard browser submission -->
<form action="https://api.formhop.dev/submit/${activeTemplate.slug}" method="POST">
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
      </section>

      {/* ─── FAQ Accordion ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 bg-background transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Questions &amp; Answers
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Frequently asked questions
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Everything you need to know about Formhop's zero-config form endpoints.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What are the limits on the free plan?',
                a: `Every user can create up to ${APP_LIMITS.MAX_FORMS_PER_USER} active forms and receive up to ${APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} submissions per calendar month free. We have no hidden tiers or paid upgrades.`,
              },
              {
                q: 'How does Formhop prevent spam submissions?',
                a: 'Formhop employs a 3-layer security system: an invisible honeypot field trap that silently catches automated bots, Upstash Redis IP rate-limiting (60 req/min), and optional allowed CORS origins so only your domain can POST to your endpoint.',
              },
              {
                q: 'How do email alerts work?',
                a: 'You can enable email notifications on any of your forms from the project settings. When enabled, Formhop uses Resend to immediately forward the submission details to your verified account email address.',
              },
              {
                q: 'Can I use Formhop with React, Next.js, or plain HTML?',
                a: 'Yes! Formhop is standard HTTP POST compatible. You can submit using native fetch() in React/Next.js/Astro, or simply point a standard HTML <form action="..."> tag to your Formhop endpoint.',
              },
              {
                q: 'Is my data private and secure?',
                a: 'Yes. All submission data is stored encrypted in Postgres, IP addresses are anonymized via SHA-256 hashing (no raw PII retained), and endpoints require schema verification before saving.',
              },
            ].map((faq, idx) => (
              <Card
                key={faq.q}
                className="overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-semibold text-sm text-foreground hover:bg-secondary/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={16} className="text-muted-foreground shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground shrink-0 ml-4" />
                  )}
                </button>
                {openFaq === idx && (
                  <CardContent className="px-4 sm:px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                    {faq.a}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pre-Footer CTA Banner ─────────────────────────────────────────── */}
      <section id="cta" className="py-20 bg-secondary/40 border-t border-border transition-colors">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Get Started Today
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Ready to collect submissions without a backend?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Create your first form in 60 seconds. Free {APP_LIMITS.MAX_FORMS_PER_USER} forms &amp; {APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER} monthly submissions.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            {!isLoading && isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="rounded-full gap-2 shadow-sm">
                  <LayoutDashboard size={18} />
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => loginWithGithub()}
                  className="rounded-full gap-2 shadow-sm"
                >
                  <Terminal size={18} />
                  <span>Continue with GitHub</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => loginWithGoogle()}
                  className="rounded-full gap-2 bg-card hover:bg-secondary shadow-xs"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            No credit card required &middot; Instant setup &middot; Universal free tier
          </p>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-10 bg-background border-t border-border transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm text-foreground">Formhop</span>
              <span className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Formhop Inc. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>All systems operational</span>
              </div>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
