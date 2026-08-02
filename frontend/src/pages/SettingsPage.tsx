import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { APP_LIMITS } from '../lib/constants'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { ThemeToggle } from '../components/ui/theme-toggle'

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
    <div className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          Settings &amp; Usage
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account profile, theme appearance, and quota utilization.
        </p>
      </div>

      {/* ─── Profile Card ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">User Profile</CardTitle>
          <CardDescription className="text-xs">
            Authenticated via Better Auth OAuth providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="h-12 w-12 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-bold">
                  {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-foreground">
                  {user?.name ?? 'Developer'}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-2 text-xs self-start sm:self-auto text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Appearance / Theme Toggle Card ──────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Appearance &amp; Palette</CardTitle>
          <CardDescription className="text-xs">
            Switch between Charcoal &amp; Pale Ivory light or dark themes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Theme Mode</p>
            <p className="text-xs text-muted-foreground">
              Select Light (Pale Ivory), Dark (Charcoal), or follow your System preferences.
            </p>
          </div>

          <ThemeToggle variant="dropdown" />
        </CardContent>
      </Card>

      {/* ─── Account Usage & Limits ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Account Quota</CardTitle>
              <CardDescription className="text-xs">
                Free universal capacity limits enforced across your account.
              </CardDescription>
            </div>
            <Badge variant="success" className="gap-1 text-xs">
              <ShieldCheck size={12} /> Production Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Forms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Active Forms</span>
              <span className="font-mono text-muted-foreground font-medium">
                {formsUsed} / {formsLimit} ({formsRemaining} remaining)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  formsPercent >= 100
                    ? 'bg-destructive'
                    : formsPercent >= 80
                    ? 'bg-amber-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${formsPercent}%` }}
              />
            </div>
          </div>

          {/* Monthly Submissions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Monthly Ingestion Quota</span>
              <span className="font-mono text-muted-foreground font-medium">
                {submissionsUsed} / {submissionsLimit} ({submissionsRemaining} remaining)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  submissionsPercent >= 100
                    ? 'bg-destructive'
                    : submissionsPercent >= 80
                    ? 'bg-amber-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${submissionsPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Monthly submission quotas reset automatically on the 1st of every calendar month.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
