import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { user, logout } = useAuth()

  const { data: usage } = useQuery<{
    forms: { used: number }
    submissions: { used: number }
  }>({
    queryKey: ['usage'],
    queryFn: projectsApi.usage,
    refetchInterval: 30_000,
  })

  return (
    <div style={{ flex: 1, padding: 'var(--space-xxl)', maxWidth: 640 }}>
      <div style={{ marginBottom: 'var(--space-xxl)' }}>
        <h1 className="text-heading-3" style={{ color: 'var(--ink)' }}>Settings</h1>
        <p className="text-body-sm" style={{ color: 'var(--steel)', marginTop: 4 }}>
          Manage your account profile and view usage.
        </p>
      </div>

      {/* ─── Profile ──────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xxl)' }}>
        <h2 className="text-body-sm-med" style={{ color: 'var(--steel)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>
          Profile
        </h2>
        <div className="card flex items-center gap-lg">
          {user?.image ? (
            <img
              src={user.image}
              alt="Avatar"
              style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--hairline)' }}
            />
          ) : (
            <div
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--brand-green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 600, color: 'var(--primary)',
              }}
            >
              {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-body-md-med" style={{ color: 'var(--ink)' }}>
              {user?.name ?? '—'}
            </p>
            <p className="text-body-sm" style={{ color: 'var(--steel)' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Usage ────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xxl)' }}>
        <h2 className="text-body-sm-med" style={{ color: 'var(--steel)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>
          Usage
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flex items-center justify-between">
            <span className="text-body-sm" style={{ color: 'var(--charcoal)' }}>Active Forms</span>
            <span className="text-body-sm-med" style={{ color: 'var(--ink)' }}>{usage?.forms.used ?? 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-sm" style={{ color: 'var(--charcoal)' }}>Submissions this month</span>
            <span className="text-body-sm-med" style={{ color: 'var(--ink)' }}>{usage?.submissions.used ?? 0}</span>
          </div>
        </div>
      </section>

      {/* ─── Account / Sign out ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-body-sm-med" style={{ color: 'var(--steel)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>
          Account
        </h2>
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-body-sm-med" style={{ color: 'var(--ink)' }}>Sign out</p>
            <p className="text-caption" style={{ color: 'var(--steel)' }}>Sign out of your account on this device.</p>
          </div>
          <button onClick={() => logout()} className="btn btn-secondary btn-sm">
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}
