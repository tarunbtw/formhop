import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Mail,
  Database,
  Code2,
  Terminal,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function LandingPage() {
  const { isAuthenticated, loginWithGithub } = useAuth()

  // ─── Hero Code & Live Test Tabs ──────────────────────────────────────────
  const [heroTab, setHeroTab] = useState<'html' | 'react' | 'curl' | 'live'>('html')
  const [heroCopied, setHeroCopied] = useState(false)

  // ─── Hero Live Test Form State ───────────────────────────────────────────
  const [testEmail, setTestEmail] = useState('alex@developer.io')
  const [testMessage, setTestMessage] = useState('Hey Formhop team, testing the endpoint.')
  const [testSubmitting, setTestSubmitting] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)

  // ─── Code Playground Tabs ────────────────────────────────────────────────
  const [playgroundTab, setPlaygroundTab] = useState<'html' | 'react' | 'astro' | 'curl'>('html')
  const [playgroundCopied, setPlaygroundCopied] = useState(false)

  // ─── FAQ Accordion State ─────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Copy helper
  const handleCopy = (text: string, isPlayground = false) => {
    navigator.clipboard.writeText(text)
    if (isPlayground) {
      setPlaygroundCopied(true)
      setTimeout(() => setPlaygroundCopied(false), 2000)
    } else {
      setHeroCopied(true)
      setTimeout(() => setHeroCopied(false), 2000)
    }
  }

  // Handle Hero Live Test Submit
  const handleLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTestSubmitting(true)
    setTimeout(() => {
      setTestSubmitting(false)
      setTestSubmitted(true)
    }, 550)
  }

  const resetLiveTest = () => {
    setTestSubmitted(false)
    setTestEmail('alex@developer.io')
    setTestMessage('Hey Formhop team, testing the endpoint.')
  }

  // Hero Snippets
  const heroHtmlSnippet = `<!-- Just add action="https://api.formhop.dev/submit/demo-contact" -->
<form action="https://api.formhop.dev/submit/demo-contact" method="POST">
  <label for="email">Your email</label>
  <input id="email" type="email" name="email" required placeholder="you@domain.com" />

  <label for="message">Your message</label>
  <textarea id="message" name="message" required placeholder="How can we help?"></textarea>

  <!-- Invisible honeypot spam protection -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Send Message</button>
</form>`

  const heroReactSnippet = `import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const data = Object.fromEntries(new FormData(e.currentTarget))
    const res = await fetch('https://api.formhop.dev/submit/demo-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) setStatus('success')
  }

  if (status === 'success') return <p>Message received! Thanks.</p>

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required placeholder="you@domain.com" />
      <textarea name="message" required placeholder="Your message..." />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}`

  const heroCurlSnippet = `curl -X POST https://api.formhop.dev/submit/demo-contact \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "alex@developer.io",
    "message": "Testing endpoint via cURL",
    "_honeypot": ""
  }'`

  // Playground Snippets
  const playgroundSnippets: Record<string, { title: string; filename: string; code: string }> = {
    html: {
      title: 'Plain HTML5 Form',
      filename: 'index.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Contact Us</title>
</head>
<body>
  <!-- Standard HTML Form submitting directly to Formhop -->
  <form action="https://api.formhop.dev/submit/contact-sales" method="POST">
    <label>
      Work Email
      <input type="email" name="email" required placeholder="alex@company.com" />
    </label>

    <label>
      Project Details
      <textarea name="details" rows="4" required></textarea>
    </label>

    <!-- Invisible honeypot traps automated bots -->
    <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

    <button type="submit">Submit Request</button>
  </form>
</body>
</html>`,
    },
    react: {
      title: 'React / Next.js Client Form',
      filename: 'ContactForm.tsx',
      code: `'use client'

import { useState } from 'react'

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('https://api.formhop.dev/submit/contact-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 font-medium">
        Thank you! Your message was delivered.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input name="email" type="email" required placeholder="you@domain.com" />
      <textarea name="message" required placeholder="How can we help?" />
      <input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Send Message'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}`,
    },
    astro: {
      title: 'Astro / Jamstack Form',
      filename: 'contact.astro',
      code: `---
// In Astro, static forms work right out of the box with zero client JS
---
<section class="max-w-md mx-auto py-12">
  <h1 class="text-2xl font-bold">Get in Touch</h1>
  
  <form action="https://api.formhop.dev/submit/inbound-leads" method="POST" class="mt-6 space-y-4">
    <div>
      <label class="block text-sm font-medium">Your Name</label>
      <input type="text" name="name" required class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm font-medium">Work Email</label>
      <input type="email" name="email" required class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm font-medium">Message</label>
      <textarea name="message" required rows="4" class="w-full border rounded px-3 py-2"></textarea>
    </div>

    <!-- Honeypot -->
    <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

    <button type="submit" class="bg-black text-white px-4 py-2 rounded">
      Send Message
    </button>
  </form>
</section>`,
    },
    curl: {
      title: 'cURL / Shell CLI',
      filename: 'submit.sh',
      code: `#!/usr/bin/env bash

# Submit directly to Formhop via cURL
curl -s -X POST https://api.formhop.dev/submit/contact-sales \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sarah Chen",
    "email": "sarah@chen.dev",
    "company": "Acme Corp",
    "message": "Looking for custom integration details",
    "_honeypot": ""
  }' | jq .`,
    },
  }

  // FAQ Items
  const faqItems = [
    {
      q: 'Do I need to host a server or write backend code?',
      a: 'No. Formhop handles the entire backend pipeline. Simply create an endpoint in your Formhop dashboard and point your HTML form action attribute or JavaScript fetch call to your generated HTTPS URL. Submissions are parsed, spam-filtered, and stored automatically.',
    },
    {
      q: 'How does honeypot spam protection work without CAPTCHAs?',
      a: 'Formhop inspects hidden honeypot fields that automated scrapers and bots fill out automatically, but legitimate human users never see. Combined with Upstash Redis IP rate limiting (60 req/min) and SHA-256 IP anonymization, spam is filtered silently without forcing users to solve frustrating puzzles.',
    },
    {
      q: 'What are the exact limits on the free plan?',
      a: 'Formhop is genuinely developer-friendly. You get 10 active form endpoints and up to 100 submissions every calendar month completely free. There are no credit card requirements, trial expirations, or paywalls.',
    },
    {
      q: 'Can I redirect users to a custom "Thank You" page after submission?',
      a: 'Yes. For plain HTML forms, you can configure a custom redirect URL in your form settings, or provide a _next hidden input field. For AJAX and fetch submissions, Formhop returns a standard 200 OK JSON response so you can render in-page state changes.',
    },
    {
      q: 'How does Formhop handle privacy and IP addresses?',
      a: 'We respect developer and user privacy. Submitter IP addresses are hashed using SHA-256 with a private salt solely for rate limiting and spam prevention. We never store plain text IP addresses or sell submission data.',
    },
    {
      q: 'Can I export submissions to CSV or spreadsheets?',
      a: 'Yes. You can review all submissions inside your Formhop dashboard with complete JSON payloads, search by keyword, or export the entire submission history to CSV in one click.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* ─── Hero Section (Formspree Split Layout) ────────────────────────── */}
      <section className="relative border-b border-border/60 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/80 text-foreground text-xs font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>Formhop 2.0 · The developer form backend</span>
              </div>

              <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-[54px] tracking-tight text-foreground leading-[1.12]">
                The form backend, API, and email service for HTML & JavaScript forms.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-xl">
                Point your custom HTML form or JavaScript fetch to our endpoint. We handle spam
                filtering, instant Resend email alerts, and schema validation. Zero server code
                required.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mt-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="h-11 px-6 font-semibold gap-2 shadow-xs">
                      <span>Go to Dashboard</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => loginWithGithub()}
                    className="h-11 px-6 font-semibold gap-2 shadow-xs"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={16} />
                  </Button>
                )}

                <a href="#code-examples">
                  <Button variant="outline" size="lg" className="h-11 px-5 font-semibold">
                    <span>View Code Examples</span>
                  </Button>
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 pt-6 border-t border-border/80 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>10 active forms free</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>100 submissions / month</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Formspree Interactive Code & Live Form */}
            <div className="lg:col-span-5">
              <Card className="border border-border bg-card shadow-xs rounded-xl overflow-hidden">
                {/* Window Topbar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 text-muted-foreground hidden sm:inline">formhop-endpoint</span>
                  </div>

                  {/* Switcher Tabs */}
                  <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => setHeroTab('html')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        heroTab === 'html'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroTab('react')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        heroTab === 'react'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      React
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroTab('curl')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        heroTab === 'curl'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroTab('live')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                        heroTab === 'live'
                          ? 'bg-emerald-600 text-white'
                          : 'text-emerald-700 dark:text-emerald-400 hover:text-foreground'
                      }`}
                    >
                      <Sparkles size={11} />
                      <span>Live Test</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-0">
                  {heroTab === 'html' && (
                    <div className="relative">
                      <pre className="p-4 sm:p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/90 bg-card">
                        <code>{heroHtmlSnippet}</code>
                      </pre>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(heroHtmlSnippet)}
                        className="absolute top-3 right-3 h-7 px-2 text-[11px] gap-1 shadow-xs border border-border"
                      >
                        {heroCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{heroCopied ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>
                  )}

                  {heroTab === 'react' && (
                    <div className="relative">
                      <pre className="p-4 sm:p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/90 bg-card">
                        <code>{heroReactSnippet}</code>
                      </pre>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(heroReactSnippet)}
                        className="absolute top-3 right-3 h-7 px-2 text-[11px] gap-1 shadow-xs border border-border"
                      >
                        {heroCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{heroCopied ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>
                  )}

                  {heroTab === 'curl' && (
                    <div className="relative">
                      <pre className="p-4 sm:p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/90 bg-card">
                        <code>{heroCurlSnippet}</code>
                      </pre>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(heroCurlSnippet)}
                        className="absolute top-3 right-3 h-7 px-2 text-[11px] gap-1 shadow-xs border border-border"
                      >
                        {heroCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{heroCopied ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>
                  )}

                  {heroTab === 'live' && (
                    <div className="p-5">
                      {!testSubmitted ? (
                        <form onSubmit={handleLiveSubmit} className="space-y-4 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Interactive Test Form
                            </span>
                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              Endpoint Ready
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Work Email</label>
                            <input
                              type="email"
                              value={testEmail}
                              onChange={(e) => setTestEmail(e.target.value)}
                              required
                              className="w-full text-xs font-mono px-3 py-2 rounded-md border border-border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Message</label>
                            <textarea
                              rows={3}
                              value={testMessage}
                              onChange={(e) => setTestMessage(e.target.value)}
                              required
                              className="w-full text-xs font-mono px-3 py-2 rounded-md border border-border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          {/* Invisible honeypot */}
                          <input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} readOnly />

                          <Button
                            type="submit"
                            disabled={testSubmitting}
                            className="w-full h-8 text-xs font-semibold gap-1.5"
                          >
                            {testSubmitting ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Submitting to Formhop...</span>
                              </>
                            ) : (
                              <>
                                <span>Test Submit</span>
                                <ArrowRight size={13} />
                              </>
                            )}
                          </Button>
                        </form>
                      ) : (
                        <div className="space-y-3 py-2 text-left">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 size={16} />
                            <span>200 OK — Submission Processed</span>
                          </div>

                          <div className="p-3 rounded-md bg-secondary/60 border border-border text-[11px] font-mono leading-relaxed">
                            <pre className="text-foreground/90">
                              {JSON.stringify(
                                {
                                  ok: true,
                                  id: 'sub_9b3e1f',
                                  email: testEmail,
                                  status: 'delivered',
                                  spam_check: 'passed (honeypot clean)',
                                  resend_alert: 'dispatched',
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetLiveTest}
                            className="w-full h-7 text-xs font-semibold gap-1.5"
                          >
                            <RefreshCw size={12} />
                            <span>Test Another Submission</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Endpoint Bar */}
                  <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span className="truncate">https://api.formhop.dev/submit/demo-contact</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Platform Compatibility Bar ──────────────────────────────────── */}
      <section className="border-b border-border/60 bg-secondary/30 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Works with any frontend framework, static site generator, or plain HTML
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono font-medium text-foreground/80">
            {['HTML5', 'Next.js', 'React', 'Astro', 'Vue.js', 'SvelteKit', 'Remix', 'WordPress', 'Webflow', 'cURL'].map(
              (stack) => (
                <span
                  key={stack}
                  className="px-3 py-1 rounded-md border border-border bg-background shadow-2xs hover:border-foreground/30 transition-colors"
                >
                  {stack}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── How Formhop Works (3 Steps) ─────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
              Simple Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How Formhop works
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Three steps from a static HTML form to a complete transactional submission pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-muted-foreground">STEP 01</span>
                <h3 className="text-lg font-bold text-foreground mt-2">Create an endpoint</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Register a form in Formhop with a single click. No databases to manage, no serverless cold
                  starts, and zero SMTP credentials to configure.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/80">
                <code className="text-[11px] font-mono text-muted-foreground block bg-secondary/60 p-2 rounded border border-border">
                  POST /projects → slug: &quot;contact-sales&quot;
                </code>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-muted-foreground">STEP 02</span>
                <h3 className="text-lg font-bold text-foreground mt-2">Point your form</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Paste the generated endpoint URL directly into your HTML <code className="text-xs">&lt;form action=&quot;...&quot;&gt;</code> or client-side <code className="text-xs">fetch()</code> call. Keep your own styling and layout.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/80">
                <code className="text-[11px] font-mono text-muted-foreground block bg-secondary/60 p-2 rounded border border-border">
                  action=&quot;https://api.formhop.dev/submit/...&quot;
                </code>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-muted-foreground">STEP 03</span>
                <h3 className="text-lg font-bold text-foreground mt-2">Receive submissions</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Formhop checks honeypots, anonymizes IPs, validates fields with Zod, dispatches instant Resend
                  email alerts, and stores entries in your dashboard.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/80">
                <code className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 block bg-secondary/60 p-2 rounded border border-border">
                  200 OK → Resend alert dispatched
                </code>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 border-b border-border/60 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
              Developer First
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything you need to handle forms
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Engineered for developers who want reliability, speed, and zero backend maintenance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs">
              <div className="text-foreground mb-4">
                <Zap size={22} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground">Zero Server Code</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Works anywhere. Point your HTML action or client fetch to our endpoint. No serverless functions,
                no database to provision, and zero devops.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs">
              <div className="text-foreground mb-4">
                <Shield size={22} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground">Triple-Guard Spam Defense</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Invisible honeypots trap automated bots, while Upstash Redis rate-limits high-volume abuse (60
                req/min) without annoying CAPTCHAs.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs">
              <div className="text-foreground mb-4">
                <Mail size={22} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground">Instant Resend Email Alerts</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Receive instant notifications dispatched right to your inbox when users submit. Configurable
                per form with a simple toggle switch.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs">
              <div className="text-foreground mb-4">
                <FileSpreadsheet size={22} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground">Submissions Inbox & CSV Export</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Review every submission in a searchable dashboard, inspect complete JSON payloads, and export
                all records to CSV in one click.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs">
              <div className="text-foreground mb-4">
                <Code2 size={22} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground">Strict Schema Validation</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Enforce field types, required constraints, and data integrity with runtime Zod schemas before
                submissions ever touch your inbox.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="border border-border bg-card p-6 rounded-xl shadow-xs">
              <div className="text-foreground mb-4">
                <Database size={22} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground">100% Free Developer Tier</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                10 active forms and 100 submissions every calendar month. No surprise fees, no paywalls, and
                no credit card required.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Interactive Code Playground ─────────────────────────────────── */}
      <section id="code-examples" className="py-20 sm:py-28 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
              Integration Code
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Integrate in seconds
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Copy and paste ready-to-use code for your framework of choice.
            </p>
          </div>

          <Card className="border border-border bg-card rounded-xl shadow-xs overflow-hidden max-w-4xl mx-auto">
            {/* Playground Tab Bar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40 text-xs">
              <div className="flex items-center gap-1.5">
                <Terminal size={14} className="text-muted-foreground" />
                <span className="font-mono font-medium text-foreground">
                  {playgroundSnippets[playgroundTab].filename}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {(['html', 'react', 'astro', 'curl'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPlaygroundTab(tab)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      playgroundTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="relative">
              <pre className="p-5 sm:p-6 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto text-foreground/90 bg-card">
                <code>{playgroundSnippets[playgroundTab].code}</code>
              </pre>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(playgroundSnippets[playgroundTab].code, true)}
                className="absolute top-4 right-4 h-8 px-3 text-xs gap-1.5 shadow-xs border border-border"
              >
                {playgroundCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{playgroundCopied ? 'Copied to clipboard' : 'Copy Code'}</span>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── Frequently Asked Questions ──────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-28 border-b border-border/60 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Everything you need to know about Formhop endpoints, spam defense, and privacy.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="border border-border bg-card rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-muted-foreground shrink-0 ml-4" />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground shrink-0 ml-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Pre-Footer Call to Action ───────────────────────────────────── */}
      <section id="cta" className="py-20 sm:py-24 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Ready to collect submissions in minutes?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
            Point your HTML form to Formhop and start collecting data today. Zero server maintenance required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-11 px-7 font-semibold gap-2 shadow-xs">
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => loginWithGithub()}
                className="h-11 px-7 font-semibold gap-2 shadow-xs"
              >
                <span>Get Started Free with GitHub</span>
                <ArrowRight size={16} />
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Free tier includes 10 active forms and 100 submissions/month. No credit card required.
          </p>
        </div>
      </section>

      {/* ─── Clean Minimal Footer ────────────────────────────────────────── */}
      <footer className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              F
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">Formhop</span>
            <span className="text-xs text-muted-foreground ml-2">
              © {new Date().getFullYear()} Formhop. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#code-examples" className="hover:text-foreground transition-colors">Code Examples</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a
              href="https://github.com/tarunbtw/formhop"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
