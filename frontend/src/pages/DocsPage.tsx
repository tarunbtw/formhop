import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Copy, Check, List } from 'lucide-react'

const DOCS_NAV = [
  {
    category: 'Getting Started',
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'quickstart', title: 'Quickstart' },
      { id: 'form-requirements', title: 'What every form needs' },
    ],
  },
  {
    category: 'Frameworks',
    items: [
      { id: 'html', title: 'HTML5 Form' },
      { id: 'react', title: 'React & Next.js' },
      { id: 'curl', title: 'cURL & Shell' },
    ],
  },
  {
    category: 'API Reference',
    items: [{ id: 'api', title: 'POST /submit/:id' }],
  },
]

export default function DocsPage() {
  const { topic } = useParams<{ topic?: string }>()
  const navigate = useNavigate()
  const activeTopic = topic || 'introduction'
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleSelect = (id: string) => {
    navigate(`/docs/${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-white text-[#0E0B3D] selection:bg-[#005DFF] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-10 items-start">
          {/* ─── Left Sidebar Navigation ──────────────────────────────────── */}
          <aside className="w-56 shrink-0 hidden md:block sticky top-20 space-y-6">
            <nav className="space-y-5 text-xs">
              {DOCS_NAV.map((group) => (
                <div key={group.category}>
                  <h5 className="font-semibold text-[#0E0B3D] mb-1.5 px-2">
                    {group.category}
                  </h5>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeTopic === item.id
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(item.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                              isActive
                                ? 'text-[#005DFF] font-semibold bg-[#F0F5FF]'
                                : 'text-[#535479] hover:text-[#0E0B3D] hover:bg-slate-50'
                            }`}
                          >
                            {item.title}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* ─── Center Content Area ─────────────────────────────────────── */}
          <main className="flex-1 max-w-2xl space-y-6 min-w-0">
            {/* ─── PAGE: INTRODUCTION (Formcarry-matched) ───────────────── */}
            {activeTopic === 'introduction' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">
                    Getting Started
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    Introduction
                  </h1>
                </div>

                <div className="space-y-4 text-sm text-[#535479] leading-relaxed">
                  <p className="text-base text-[#0E0B3D] font-medium leading-relaxed">
                    Formhop is one inbox for every form you run.
                  </p>

                  <p>
                    It lets you collect submissions from your own forms <em>without any back-end code</em>.
                    You can get notification emails for submissions, upload files from your form, benefit
                    from best-in-class spam protection, and integrate with other apps.
                  </p>

                  <p>
                    Any form that can send an HTTP POST works: an HTML page, a React app, a Webflow or
                    Framer site, WordPress, or a site an AI tool built.
                  </p>

                  <p>
                    Your browser renders your form, <em>not Formhop</em>, so the styles, behavior, and
                    everything else stay entirely in your control. Formhop just receives what the form
                    sends; there&apos;s no server code to write. An AI coding tool connected over MCP can
                    set the form up and read the submission too.
                  </p>
                </div>

                {/* Section: Endpoint */}
                <section id="endpoint" className="pt-6 space-y-3">
                  <h2 className="text-2xl font-bold text-[#0E0B3D] tracking-tight">
                    Endpoint
                  </h2>
                  <p className="text-sm text-[#535479]">
                    Every form has one endpoint:
                  </p>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#DDE0EE] bg-white font-mono text-xs text-[#0E0B3D] shadow-2xs">
                    <span>https://api.formhop.dev/s/{'{form_id}'}</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard('https://api.formhop.dev/s/{form_id}', 'endpoint-url')
                      }
                      className="p-1 rounded text-[#6C6F93] hover:text-[#005DFF] transition-colors"
                      title="Copy endpoint"
                    >
                      {copiedKey === 'endpoint-url' ? (
                        <Check size={14} className="text-[#005DFF]" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#6C6F93]">
                    After you create a form, you can find your{' '}
                    <code className="bg-slate-100 text-[#0E0B3D] px-1 py-0.5 rounded font-mono text-[11px]">
                      {'{form_id}'}
                    </code>{' '}
                    on the Setup page of the dashboard.
                  </p>
                </section>

                {/* Section: Your First Form */}
                <section id="first-form" className="pt-6 space-y-3">
                  <h2 className="text-2xl font-bold text-[#0E0B3D] tracking-tight">
                    Your first form
                  </h2>
                  <p className="text-sm text-[#535479]">
                    Point your form’s action attribute to your Formhop URL:
                  </p>

                  <div className="rounded-xl bg-[#030122] border border-[#292753] overflow-hidden text-xs font-mono text-[#DDE0EE]">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#0E0B3D]/70 border-b border-[#292753] text-[11px] text-[#AAB0D0]">
                      <span>index.html</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `<form action="https://api.formhop.dev/s/{form_id}" method="POST" enctype="multipart/form-data">
  <input type="email" name="email" placeholder="john@example.com" required>
  <textarea name="message" placeholder="Your message here..." required></textarea>
  <button type="submit">Send</button>
</form>`,
                            'first-form-code'
                          )
                        }
                        className="text-[#AAB0D0] hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === 'first-form-code' ? (
                          <>
                            <Check size={12} className="text-[#005DFF]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto leading-relaxed">
                      <code>{`<form action="https://api.formhop.dev/s/{form_id}" method="POST" enctype="multipart/form-data">
  <input type="email" name="email" placeholder="john@example.com" required>
  <textarea name="message" placeholder="Your message here..." required></textarea>
  <button type="submit">Send</button>
</form>`}</code>
                    </pre>
                  </div>
                </section>

                {/* Section: Where Do I Start? */}
                <section id="where-to-start" className="pt-6 space-y-3">
                  <h2 className="text-2xl font-bold text-[#0E0B3D] tracking-tight">
                    Where do I start?
                  </h2>
                  <p className="text-sm text-[#535479] leading-relaxed">
                    Follow the{' '}
                    <button
                      type="button"
                      onClick={() => handleSelect('quickstart')}
                      className="text-[#005DFF] hover:underline font-semibold"
                    >
                      Quickstart
                    </button>{' '}
                    to set up your first form in under 3 minutes, or check the HTML and React guides.
                  </p>
                </section>

                {/* Section: Support */}
                <section id="support" className="pt-6 space-y-3">
                  <h2 className="text-2xl font-bold text-[#0E0B3D] tracking-tight">
                    Support
                  </h2>
                  <p className="text-sm text-[#535479] leading-relaxed">
                    Have questions? Check our GitHub repository or contact support from your dashboard.
                  </p>
                </section>
              </div>
            )}

            {/* ─── PAGE: QUICKSTART ─────────────────────────────────────── */}
            {activeTopic === 'quickstart' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">Getting Started</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    Quickstart
                  </h1>
                </div>
                <p className="text-sm text-[#535479] leading-relaxed">
                  Start collecting form submissions in 3 steps:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-sm text-[#535479]">
                  <li><strong>Create a Form:</strong> Sign into Formhop and click New Form to generate your endpoint.</li>
                  <li><strong>Add Action:</strong> Set your HTML form <code className="bg-slate-100 text-[#0E0B3D] px-1 py-0.5 rounded font-mono text-xs">action="https://api.formhop.dev/s/{'{form_id}'}"</code> and <code className="bg-slate-100 text-[#0E0B3D] px-1 py-0.5 rounded font-mono text-xs">method="POST"</code>.</li>
                  <li><strong>Test:</strong> Submit the form; submissions land in your inbox and dashboard instantly.</li>
                </ol>
              </div>
            )}

            {/* ─── PAGE: FORM REQUIREMENTS ──────────────────────────────── */}
            {activeTopic === 'form-requirements' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">Getting Started</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    What every form needs
                  </h1>
                </div>
                <ul className="space-y-3 text-sm text-[#535479]">
                  <li>• <strong>Endpoint URL:</strong> Required in the <code className="bg-slate-100 text-[#0E0B3D] px-1 py-0.5 rounded font-mono text-xs">action</code> attribute.</li>
                  <li>• <strong>POST Method:</strong> Forms must submit using <code className="bg-slate-100 text-[#0E0B3D] px-1 py-0.5 rounded font-mono text-xs">method="POST"</code>.</li>
                  <li>• <strong>Input Names:</strong> Inputs without a <code className="bg-slate-100 text-[#0E0B3D] px-1 py-0.5 rounded font-mono text-xs">name</code> attribute are ignored by browsers during submission.</li>
                </ul>
              </div>
            )}

            {/* ─── PAGE: HTML5 ──────────────────────────────────────────── */}
            {activeTopic === 'html' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">Frameworks</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    HTML5 Form
                  </h1>
                </div>
                <p className="text-sm text-[#535479] leading-relaxed">
                  Point your form’s action and method directly. Zero client-side JavaScript required:
                </p>
                <pre className="p-4 rounded-xl bg-[#030122] text-[#DDE0EE] font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{`<form action="https://api.formhop.dev/s/{form_id}" method="POST">
  <input type="email" name="email" required placeholder="you@domain.com">
  <textarea name="message" required placeholder="Your message..."></textarea>
  <!-- Invisible Honeypot Spam Trap -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off">
  <button type="submit">Send Message</button>
</form>`}</code>
                </pre>
              </div>
            )}

            {/* ─── PAGE: REACT & NEXT.JS ─────────────────────────────────── */}
            {activeTopic === 'react' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">Frameworks</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    React &amp; Next.js
                  </h1>
                </div>
                <p className="text-sm text-[#535479] leading-relaxed">
                  Submit via async fetch with JSON responses:
                </p>
                <pre className="p-4 rounded-xl bg-[#030122] text-[#DDE0EE] font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{`'use client'
import { useState } from 'react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('https://api.formhop.dev/s/{form_id}', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(e.currentTarget),
    })
    if (res.ok) setSent(true)
  }

  if (sent) return <p>Thank you! Your message was sent.</p>

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required placeholder="you@domain.com" />
      <textarea name="message" required placeholder="Your message..." />
      <button type="submit">Submit</button>
    </form>
  )
}`}</code>
                </pre>
              </div>
            )}

            {/* ─── PAGE: CURL ───────────────────────────────────────────── */}
            {activeTopic === 'curl' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">Frameworks</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    cURL &amp; Shell
                  </h1>
                </div>
                <p className="text-sm text-[#535479] leading-relaxed">
                  Test your endpoint directly from the command line:
                </p>
                <pre className="p-4 rounded-xl bg-[#030122] text-[#DDE0EE] font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{`curl -X POST https://api.formhop.dev/s/{form_id} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "alex@developer.io",
    "message": "Testing Formhop endpoint"
  }'`}</code>
                </pre>
              </div>
            )}

            {/* ─── PAGE: API REFERENCE ───────────────────────────────────── */}
            {activeTopic === 'api' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#005DFF]">API Reference</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E0B3D] tracking-tight mt-1 mb-4">
                    POST /s/:id
                  </h1>
                </div>
                <p className="text-sm text-[#535479] leading-relaxed">
                  Ingests submissions via JSON or multipart form data.
                </p>
                <div className="p-4 rounded-xl border border-[#DDE0EE] bg-white space-y-3 text-xs">
                  <div className="font-mono font-bold flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#005DFF] text-white">POST</span>
                    <span>https://api.formhop.dev/s/:id</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-[#030122] text-[#DDE0EE] font-mono leading-relaxed">
                    <code>{`{
  "ok": true,
  "id": "sub_7a9c41",
  "status": "delivered",
  "message": "Submission received successfully"
}`}</code>
                  </pre>
                </div>
              </div>
            )}
          </main>

          {/* ─── Right Sidebar: On this page (Matching Formcarry) ─────────── */}
          {activeTopic === 'introduction' && (
            <aside className="w-44 shrink-0 hidden xl:block sticky top-20 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#0E0B3D]">
                <List size={14} className="text-[#6C6F93]" />
                <span>On this page</span>
              </div>
              <ul className="space-y-2 text-[#535479] pl-3 border-l border-[#DDE0EE]">
                <li>
                  <a href="#endpoint" className="hover:text-[#005DFF] transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005DFF]" />
                    <span>Endpoint</span>
                  </a>
                </li>
                <li>
                  <a href="#first-form" className="hover:text-[#005DFF] transition-colors block">
                    Your first form
                  </a>
                </li>
                <li>
                  <a href="#where-to-start" className="hover:text-[#005DFF] transition-colors block">
                    Where do I start?
                  </a>
                </li>
                <li>
                  <a href="#support" className="hover:text-[#005DFF] transition-colors block">
                    Support
                  </a>
                </li>
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
