import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Copy,
  Zap,
  Mail,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
  Shield,
  Lock,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  FormhopIcon,
  FormhopBrandLogo,
  HeadlineLightningIcon,
  HeadlineSubmissionIcon,
} from '../components/FormcarryBrandLogo'

export default function LandingPage() {
  const { isAuthenticated, loginWithGithub } = useAuth()

  // ─── Framework Code Tabs ──────────────────────────────────────────────────
  const [selectedFramework, setSelectedFramework] = useState<
    'html' | 'react' | 'nextjs' | 'vue' | 'ajax' | 'curl'
  >('html')
  const [codeCopied, setCodeCopied] = useState(false)

  // ─── Hero Email Input State ───────────────────────────────────────────────
  const [heroEmail, setHeroEmail] = useState('')

  // ─── Live Playground Interactive Test ────────────────────────────────────
  const [testEmail, setTestEmail] = useState('alex@developer.io')
  const [testMessage, setTestMessage] = useState('Hey Formhop team, testing our endpoint!')
  const [testSubmitting, setTestSubmitting] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  // Handle hero email submission
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginWithGithub()
  }

  // Handle interactive test form submission
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
    setTestMessage('Hey Formhop team, testing our endpoint!')
  }

  // ─── Code Snippets by Framework ──────────────────────────────────────────
  const codeSnippets: Record<
    'html' | 'react' | 'nextjs' | 'vue' | 'ajax' | 'curl',
    { title: string; filename: string; code: string }
  > = {
    html: {
      title: 'HTML Form',
      filename: 'index.html',
      code: `<!-- 1. Just point your form action to your Formhop URL -->
<form action="https://api.formhop.dev/submit/{your-form-id}" method="POST" enctype="multipart/form-data">
  <label for="email">Email</label>
  <input type="email" name="email" id="email" required placeholder="you@domain.com" />

  <label for="message">Message</label>
  <textarea name="message" id="message" required placeholder="Your message here..."></textarea>

  <!-- Honeypot spam trap: hidden from humans, catches bots -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Send Message</button>
</form>`,
    },
    react: {
      title: 'React',
      filename: 'ContactForm.tsx',
      code: `import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const res = await fetch('https://api.formhop.dev/submit/{your-form-id}', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    })

    if (res.ok) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="success-msg">Thank you! Your message was received.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required placeholder="you@domain.com" />
      <textarea name="message" required placeholder="Your message..." />
      <input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}`,
    },
    nextjs: {
      title: 'Next.js (App Router)',
      filename: 'app/contact/page.tsx',
      code: `'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    const res = await fetch('https://api.formhop.dev/submit/{your-form-id}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) setSubmitted(true)
  }

  return submitted ? (
    <div>Message delivered! We will get back to you shortly.</div>
  ) : (
    <form onSubmit={onSubmit}>
      <input name="email" type="email" placeholder="work@company.com" required />
      <textarea name="message" placeholder="Project details..." required />
      <input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} />
      <button type="submit">Submit Request</button>
    </form>
  )
}`,
    },
    vue: {
      title: 'Vue 3',
      filename: 'ContactForm.vue',
      code: `<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const submitted = ref(false)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  const res = await fetch('https://api.formhop.dev/submit/{your-form-id}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, message: message.value }),
  })
  loading.value = false
  if (res.ok) submitted.value = true
}
</script>

<template>
  <div v-if="submitted">Thanks! Submission delivered.</div>
  <form v-else @submit.prevent="handleSubmit">
    <input v-model="email" type="email" required placeholder="you@domain.com" />
    <textarea v-model="message" required placeholder="Your message..."></textarea>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Sending...' : 'Send' }}
    </button>
  </form>
</template>`,
    },
    ajax: {
      title: 'JavaScript / Fetch API',
      filename: 'submit.js',
      code: `const form = document.querySelector('#contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch('https://api.formhop.dev/submit/{your-form-id}', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert('Form submitted successfully! ID: ' + data.id);
      form.reset();
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
});`,
    },
    curl: {
      title: 'cURL / API',
      filename: 'terminal.sh',
      code: `curl -X POST https://api.formhop.dev/submit/{your-form-id} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Sarah Chen",
    "email": "sarah@chen.dev",
    "message": "Testing endpoint submission directly via cURL",
    "_honeypot": ""
  }'`,
    },
  }

  return (
    <div className="min-h-screen bg-white text-[#0E0B3D] selection:bg-[#005DFF] selection:text-white">
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 pb-8 sm:pb-12 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Top Kicker Badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#005DFF]">
              Form API
            </span>
          </div>

          {/* H1 Headline with Lightning & Form Document Icons - strictly 2 lines, refined weight */}
          <h1 className="text-3xl sm:text-[44px] md:text-5xl lg:text-[56px] font-bold text-[#0E0B3D] leading-[1.15] tracking-[-0.03em] max-w-4xl mx-auto">
            <span className="block sm:whitespace-nowrap">
              The form backend <HeadlineLightningIcon /> that sends
            </span>
            <span className="block sm:whitespace-nowrap mt-1 sm:mt-1.5">
              submissions <HeadlineSubmissionIcon /> to your inbox
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-[18px] text-[#535479] mt-6 leading-relaxed max-w-2xl mx-auto font-normal">
            Never worry about the backend of your form again. Create your form in HTML, React, or
            anything else, connect to our form API, get email notifications, and block spam with
            zero server maintenance.
          </p>

          {/* Hero Input & CTA */}
          <div className="mt-9 max-w-md mx-auto">
            <form onSubmit={handleHeroSubmit} className="relative">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl border border-[#DDE0EE] bg-white shadow-xs focus-within:border-[#005DFF] transition-colors">
                <div className="flex items-center gap-2.5 w-full pl-3 pr-2 py-2 sm:py-0">
                  <Mail size={18} className="text-[#6C6F93]" />
                  <input
                    type="email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    placeholder="Enter your work email address"
                    className="w-full text-xs sm:text-sm text-[#0E0B3D] placeholder-[#6C6F93] bg-transparent outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 h-9 sm:h-10 px-5 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-5 text-xs text-[#6C6F93]">
            <div className="flex items-center gap-1.5 font-medium">
              <Check size={14} className="text-[#005DFF]" />
              <span>10 active forms free</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check size={14} className="text-[#005DFF]" />
              <span>100 submissions / month</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check size={14} className="text-[#005DFF]" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section: Integration ─────────────────────────────────────── */}
      <section id="examples" className="pt-8 sm:pt-12 pb-6 sm:pb-8 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#005DFF] mb-2">
              Integration
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E0B3D] tracking-[-0.035em]">
              Easiest way to set up <br className="hidden sm:inline" /> your HTML form.
            </h2>
            <p className="text-base text-[#535479] mt-3.5 leading-relaxed font-normal">
              Don't worry about emails, spam checking, integrations and form issues ever, code your
              front-end, add your unique Formhop URL, and we'll handle the rest. Within literally
              just 3 minutes, you can have a fully functional form for any platform.
            </p>
          </div>

          {/* Framework Switcher Tabs */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-6">
            {(
              [
                { id: 'html', label: 'HTML' },
                { id: 'react', label: 'React' },
                { id: 'nextjs', label: 'Next.js' },
                { id: 'vue', label: 'Vue' },
                { id: 'ajax', label: 'AJAX / Fetch' },
                { id: 'curl', label: 'cURL' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFramework(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFramework === tab.id
                    ? 'bg-[#0E0B3D] text-white shadow-xs'
                    : 'bg-white border border-[#DDE0EE] text-[#6C6F93] hover:text-[#0E0B3D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Viewer Container & Interactive Test Form Side-by-Side (Fixed Size) */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Code Display (Fixed Height, Scrollable) */}
            <div className="lg:col-span-7 h-[420px] rounded-2xl bg-[#030122] border border-[#292753] shadow-fc-card overflow-hidden flex flex-col">
              {/* Topbar */}
              <div className="flex items-center justify-between px-5 h-11 shrink-0 border-b border-[#292753] bg-[#0E0B3D]/70 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-[#AAB0D0]">
                    {codeSnippets[selectedFramework].filename}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(codeSnippets[selectedFramework].code)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#292753] hover:bg-[#3D3A7A] text-[#F7F9FC] text-xs font-medium transition-colors"
                >
                  {codeCopied ? <Check size={13} className="text-[#005DFF]" /> : <Copy size={13} />}
                  <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Pre - Fixed Height Scrollable Area */}
              <div className="p-5 font-mono text-xs leading-relaxed overflow-auto text-[#DDE0EE] flex-1">
                <pre>
                  <code>{codeSnippets[selectedFramework].code}</code>
                </pre>
              </div>
            </div>

            {/* Right Column: Live Interactive Demo (Fixed Matching Height, Clean & Minimal) */}
            <div className="lg:col-span-5 h-[420px] rounded-2xl bg-[#F8FAFC] border border-[#DDE0EE] shadow-xs p-6 flex flex-col justify-between">
              <div>
                {/* Minimal Header (No slop dots, no badges) */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#0E0B3D]">
                    Test submission
                  </h3>
                  <p className="text-xs text-[#6C6F93] mt-0.5">
                    Send a test submission to inspect the endpoint response.
                  </p>
                </div>

                {!testSubmitted ? (
                  <form onSubmit={handleLiveSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-[#0E0B3D] mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        required
                        className="w-full h-9 px-3 rounded-lg border border-[#DDE0EE] bg-white text-xs text-[#0E0B3D] placeholder-[#94A3B8] focus:border-[#005DFF] focus:ring-1 focus:ring-[#005DFF]/20 focus:outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0E0B3D] mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-lg border border-[#DDE0EE] bg-white text-xs text-[#0E0B3D] placeholder-[#94A3B8] focus:border-[#005DFF] focus:ring-1 focus:ring-[#005DFF]/20 focus:outline-none transition-all resize-none shadow-2xs"
                      />
                    </div>

                    {/* Invisible honeypot */}
                    <input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} readOnly />

                    <button
                      type="submit"
                      disabled={testSubmitting}
                      className="w-full h-9 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {testSubmitting ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Dispatching submission...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Test Submission</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3.5 py-1">
                    <div className="flex items-center gap-2 text-[#005DFF] text-xs font-semibold">
                      <CheckCircle2 size={15} />
                      <span>200 OK: Submission Processed!</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#030122] text-[#DDE0EE] font-mono text-[11px] leading-relaxed border border-[#292753] overflow-x-auto max-h-[190px]">
                      <pre>
                        {JSON.stringify(
                          {
                            ok: true,
                            id: 'sub_7a9c41',
                            email: testEmail,
                            status: 'delivered',
                            spam_protection: 'passed (honeypot zero-flag)',
                            email_alert: 'dispatched via Resend',
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={resetLiveTest}
                      className="w-full h-8 rounded-lg border border-[#DDE0EE] bg-white text-xs font-medium text-[#0E0B3D] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <RefreshCw size={12} />
                      <span>Send Another Test</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-center opacity-85">
                <FormhopBrandLogo iconSize={15} textSize="text-[12.5px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section: Features that you need. ──────────────────────────── */}
      <section id="features" className="pt-4 sm:pt-6 pb-6 sm:pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#005DFF] mb-1.5">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E0B3D] tracking-[-0.035em]">
              Features that you need.
            </h2>
            <p className="text-base text-[#535479] mt-3 font-normal">
              Essential form tooling built in, without manual backend code.
            </p>
          </div>

          {/* 4 Feature Cards in One Horizontal Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-white border border-[#DDE0EE] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-4">
                  <UploadCloud size={18} />
                </div>
                <h3 className="text-base font-bold text-[#0E0B3D] mb-1.5">
                  File uploads
                </h3>
                <p className="text-xs text-[#535479] leading-relaxed">
                  Accept file attachments directly from any form with zero S3 or IAM bucket configuration.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-white border border-[#DDE0EE] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-4">
                  <Zap size={18} />
                </div>
                <h3 className="text-base font-bold text-[#0E0B3D] mb-1.5">
                  Instant alerts
                </h3>
                <p className="text-xs text-[#535479] leading-relaxed">
                  Real-time email notifications via Resend the second a user submits an entry.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-white border border-[#DDE0EE] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-4">
                  <FileCheck2 size={18} />
                </div>
                <h3 className="text-base font-bold text-[#0E0B3D] mb-1.5">
                  Input validation
                </h3>
                <p className="text-xs text-[#535479] leading-relaxed">
                  Enforce email formats and field lengths before entries reach your inbox or database.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-white border border-[#DDE0EE] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-4">
                  <Mail size={18} />
                </div>
                <h3 className="text-base font-bold text-[#0E0B3D] mb-1.5">
                  Auto-responses
                </h3>
                <p className="text-xs text-[#535479] leading-relaxed">
                  Send automated branded confirmation emails back to submitters immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section: Best in class spam protection. ──────────────────── */}
      <section className="pt-4 sm:pt-6 pb-6 sm:pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#005DFF] mb-2">
              Spam Protection
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E0B3D] tracking-[-0.035em]">
              Best in class spam protection.
            </h2>
            <p className="text-base text-[#535479] mt-4 font-normal">
              We handle spam submissions and keep your inbox safe with a 98.6% accuracy rate, without frustrating users with puzzle captchas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-white border border-[#DDE0EE] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-5">
                <Shield size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0E0B3D] mb-2">
                Invisible Honeypot
              </h3>
              <p className="text-xs sm:text-sm text-[#535479] leading-relaxed">
                Automated bot scrapers blindly fill hidden form fields that real users never see.
                Formhop detects and drops them silently.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#DDE0EE] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-5">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0E0B3D] mb-2">
                Redis Rate Limiting
              </h3>
              <p className="text-xs sm:text-sm text-[#535479] leading-relaxed">
                Upstash Redis distributed rate limiting caps abusive spam bursts to 60 requests/min
                per hashed IP, preventing DDoS flooding.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#DDE0EE] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0F5FF] text-[#005DFF] flex items-center justify-center mb-5">
                <Lock size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0E0B3D] mb-2">
                SHA-256 IP Privacy
              </h3>
              <p className="text-xs sm:text-sm text-[#535479] leading-relaxed">
                Submitter IP addresses are hashed using SHA-256 with a private salt solely for spam
                prevention. We never store plain text IPs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section: Final CTA Banner (Hassle Free Forms) ─────────────── */}
      <section className="pt-4 sm:pt-6 pb-12 sm:pb-16 text-center relative overflow-hidden bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-[-0.035em] mb-4">
            Hassle Free Forms
          </h2>
          <p className="text-base text-[#535479] mb-7 font-normal">
            Create an account and start collecting submissions in 3 minutes. Zero setup fees, 10
            forms completely free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button
                  type="button"
                  className="w-full sm:w-auto h-10 px-6 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={15} />
                </button>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => loginWithGithub()}
                className="w-full sm:w-auto h-10 px-6 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Get Started Free</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Compact Lineless Footer ────────────────────────────────────── */}
      <footer className="bg-white py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {/* Brand Column */}
            <div className="col-span-2">
              <FormhopIcon size={26} />
              <p className="mt-3 text-xs text-[#535479] max-w-sm leading-relaxed">
                Formhop is the form backend and form API for modern developers. Connect HTML, React,
                or mobile forms in minutes.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-medium text-[#005DFF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005DFF]" />
                <span>All systems operational</span>
              </div>
            </div>

            {/* Column: Product */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#0E0B3D] mb-2.5">
                Product
              </h5>
              <ul className="space-y-1.5 text-xs text-[#6C6F93]">
                <li><a href="#examples" className="hover:text-[#005DFF]">Examples</a></li>
                <li><a href="#features" className="hover:text-[#005DFF]">Features</a></li>
                <li><Link to="/docs" className="hover:text-[#005DFF]">Docs</Link></li>
              </ul>
            </div>

            {/* Column: Resources */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#0E0B3D] mb-2.5">
                Resources
              </h5>
              <ul className="space-y-1.5 text-xs text-[#6C6F93]">
                <li><a href="https://github.com/tarunbtw/formhop" target="_blank" rel="noreferrer" className="hover:text-[#005DFF]">GitHub</a></li>
                <li><span className="hover:text-[#005DFF] cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-[#005DFF] cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6C6F93]">
            <p>© {new Date().getFullYear()} Formhop Inc. All rights reserved.</p>
            <p>Made for developers with high standards.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
