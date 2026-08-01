import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { APP_LIMITS } from '../lib/constants'

interface UsageData {
  forms: { used: number; limit?: number; remaining?: number }
  submissions: { used: number; limit?: number; remaining?: number }
}

export default function SettingsPage() {
  const { user, logout } = useAuth()

  const { data: usage } = useQuery<UsageData>({
    queryKey: ['usage'],
    queryFn: projectsApi.usage,
    refetchInterval: 30_000,
  })

  const formsUsed = usage?.forms?.used ?? 0
  const formsLimit = usage?.forms?.limit ?? APP_LIMITS.MAX_FORMS_PER_USER
  const formsPercent = Math.min(100, Math.round((formsUsed / formsLimit) * 100))
  const formsRemaining = Math.max(0, formsLimit - formsUsed)

  const submissionsUsed = usage?.submissions?.used ?? 0
  const submissionsLimit = usage?.submissions?.limit ?? APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER
  const submissionsPercent = Math.min(100, Math.round((submissionsUsed / submissionsLimit) * 100))
  const submissionsRemaining = Math.max(0, submissionsLimit - submissionsUsed)

  return (
    <div style={{ flex: 1, padding: 'var(--space-xxl)', maxWidth: 640 }}>
      <div style={{ marginBottom: 'var(--space-xxl)' }}>
        <h1 className="text-heading-3" style={{ color: 'var(--ink)' }}>Settings</h1>
        <p className="text-body-sm" style={{ color: 'var(--steel)', marginTop: 4 }}>
          Manage your account profile and view usage limits.
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
          Account Limits &amp; Usage
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Active Forms */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span className="text-body-sm-med" style={{ color: 'var(--ink)' }}>Active Forms</span>
              <span className="text-body-sm" style={{ color: formsPercent >= 100 ? 'var(--brand-error)' : 'var(--charcoal)', fontWeight: 600 }}>
                {formsUsed} / {formsLimit}
              </span>
            </div>
            <div style={{ height: 6, width: '100%', background: 'var(--surface)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
              <div
                style={{
                  width: `${formsPercent}%`,
                  height: '100%',
                  background: formsPercent >= 100 ? 'var(--brand-error)' : formsPercent >= 80 ? 'var(--brand-warning)' : 'var(--brand-green-deep)',
                  borderRadius: 9999,
                  transition: 'width 250ms ease',
                }}
              />
            </div>
            <p className="text-caption" style={{ color: 'var(--steel)', marginTop: 6 }}>
              {formsPercent >= 100
                ? 'Limit reached. Delete an existing form to create a new one.'
                : `${formsRemaining} form${formsRemaining !== 1 ? 's' : ''} remaining`}
            </p>
          </div>

          {/* Submissions */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span className="text-body-sm-med" style={{ color: 'var(--ink)' }}>Monthly Submissions</span>
              <span className="text-body-sm" style={{ color: submissionsPercent >= 100 ? 'var(--brand-error)' : 'var(--charcoal)', fontWeight: 600 }}>
                {submissionsUsed} / {submissionsLimit}
              </span>
            </div>
            <div style={{ height: 6, width: '100%', background: 'var(--surface)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
              <div
                style={{
                  width: `${submissionsPercent}%`,
                  height: '100%',
                  background: submissionsPercent >= 100 ? 'var(--brand-error)' : submissionsPercent >= 80 ? 'var(--brand-warning)' : 'var(--brand-green-deep)',
                  borderRadius: 9999,
                  transition: 'width 250ms ease',
                }}
              />
            </div>
            <p className="text-caption" style={{ color: 'var(--steel)', marginTop: 6 }}>
              {submissionsPercent >= 100
                ? 'Monthly limit reached. Resets on the 1st of next month.'
                : `${submissionsRemaining} submission${submissionsRemaining !== 1 ? 's' : ''} remaining this month · Resets on the 1st`}
            </p>
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
