import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import {
  Plus,
  Copy,
  ChevronRight,
  Inbox,
  Check,
  Search,
  Layers,
  Clock,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { toast } from '../components/Toast'
import { APP_LIMITS } from '../lib/constants'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { AnalyticsChart, type TimelineDataPoint } from '../components/ui/analytics-chart'

interface Project {
  id: string
  name: string
  slug: string
  schema: unknown[]
  endpoint_url: string
  submissionCount: number
  emailNotifications: boolean
  createdAt: string
}

interface AnalyticsResponse {
  summary: {
    totalSubmissions: number
    monthlySubmissions: number
    monthlyLimit: number
    activeForms: number
    formLimit: number
    unreadCount: number
    readCount: number
  }
  timeline: TimelineDataPoint[]
  byProject: Array<{
    id: string
    name: string
    slug: string
    count: number
    percentage: number
  }>
  recentSubmissions: Array<{
    id: string
    projectId: string
    projectName: string
    data: Record<string, unknown>
    isRead: boolean
    createdAt: string
  }>
}

export default function DashboardPage() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: projects, isLoading: loadingProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  })

  const { data: analytics, isLoading: loadingAnalytics } = useQuery<AnalyticsResponse>({
    queryKey: ['analytics'],
    queryFn: projectsApi.analytics,
    refetchInterval: 30_000,
  })

  const formCount = projects?.length ?? 0
  const isAtLimit = formCount >= APP_LIMITS.MAX_FORMS_PER_USER

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSlug(slug)
      toast('Copied endpoint URL to clipboard!')
      setTimeout(() => setCopiedSlug(null), 2000)
    })
  }

  const filteredProjects = (projects ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const monthlySubmissions = analytics?.summary.monthlySubmissions ?? 0
  const monthlyLimit = APP_LIMITS.MAX_MONTHLY_SUBMISSIONS_PER_USER
  const totalSubmissions = analytics?.summary.totalSubmissions ?? 0
  const unreadCount = analytics?.summary.unreadCount ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ─── Top Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage form endpoints and monitor inbound submission velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAtLimit ? (
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10 text-xs">
              Limit Reached ({APP_LIMITS.MAX_FORMS_PER_USER}/{APP_LIMITS.MAX_FORMS_PER_USER})
            </Badge>
          ) : (
            <Link to="/dashboard/projects/new">
              <Button size="sm" className="gap-1.5 h-8 text-xs font-semibold">
                <Plus size={14} />
                <span>Create Form</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ─── Limit Banner ────────────────────────────────────────────────── */}
      {isAtLimit && (
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle size={15} className="text-amber-500 shrink-0" />
          <span>
            You have reached the maximum free quota of{' '}
            <strong>{APP_LIMITS.MAX_FORMS_PER_USER} active forms</strong>. Delete an unused form to create a new one.
          </span>
        </div>
      )}

      {/* ─── Minimalist Metrics Stat Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Submissions */}
        <Card className="p-4 sm:p-5">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {loadingAnalytics ? '—' : totalSubmissions.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              All-time events captured
            </p>
          </CardContent>
        </Card>

        {/* Monthly Submissions */}
        <Card className="p-4 sm:p-5">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Monthly Influx
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {monthlySubmissions} <span className="text-xs font-normal text-muted-foreground">/ {monthlyLimit}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {Math.max(0, monthlyLimit - monthlySubmissions)} remaining this month
            </p>
          </CardContent>
        </Card>

        {/* Active Forms */}
        <Card className="p-4 sm:p-5">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Forms
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {formCount} <span className="text-xs font-normal text-muted-foreground">/ {APP_LIMITS.MAX_FORMS_PER_USER}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {Math.max(0, APP_LIMITS.MAX_FORMS_PER_USER - formCount)} slots available
            </p>
          </CardContent>
        </Card>

        {/* Pending Review */}
        <Card className="p-4 sm:p-5">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {loadingAnalytics ? '—' : unreadCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Unread submission records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Forms Section ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Your Forms
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              ({formCount})
            </span>
          </div>

          {formCount > 0 && (
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loadingProjects && (
          <div className="grid gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg border border-border bg-card animate-pulse" />
            ))}
          </div>
        )}

        {/* Pure shadcn Minimal Empty State */}
        {!loadingProjects && formCount === 0 && (
          <div className="rounded-lg border border-dashed border-border p-12 text-center animate-in fade-in-50">
            <Layers className="mx-auto h-8 w-8 text-muted-foreground/60 stroke-[1.5]" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">No forms created</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Create your first form endpoint in seconds. Formsy validates schemas, drops spam with honeypots, and dispatches email alerts.
            </p>
            <div className="mt-4">
              <Link to="/dashboard/projects/new">
                <Button size="sm" className="gap-1.5 h-8 text-xs font-semibold">
                  <Plus size={14} />
                  <span>Create Form</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Forms List (Clean, Tabular / Row Style) */}
        {!loadingProjects && formCount > 0 && (
          <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No forms matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/projects/${project.id}`}
                        className="text-sm font-semibold text-foreground hover:underline truncate"
                      >
                        {project.name}
                      </Link>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        /{project.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(project.endpoint_url, project.slug)}
                        className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy endpoint URL"
                      >
                        <span>{project.endpoint_url}</span>
                        {copiedSlug === project.slug ? (
                          <Check size={12} className="text-emerald-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-foreground">
                        {project.submissionCount} {project.submissionCount === 1 ? 'submission' : 'submissions'}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {project.schema.length} {project.schema.length === 1 ? 'field' : 'fields'} ·{' '}
                        {project.emailNotifications ? 'Email on' : 'Email off'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link to={`/dashboard/projects/${project.id}/submissions`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          Submissions
                        </Button>
                      </Link>
                      <Link to={`/dashboard/projects/${project.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ─── Analytics & Velocity Chart (Rendered when forms exist) ──────── */}
      {formCount > 0 && (
        <div className="space-y-6 pt-2">
          <AnalyticsChart
            data={analytics?.timeline ?? []}
            title="Submissions Velocity (Past 14 Days)"
            description="Daily aggregate submissions across all active endpoint routes"
          />

          {/* Recent Submissions Feed */}
          {analytics?.recentSubmissions && analytics.recentSubmissions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Recent Inbound Events
                </h3>
                <span className="text-xs text-muted-foreground">
                  Latest {analytics.recentSubmissions.length} submissions
                </span>
              </div>

              <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
                {analytics.recentSubmissions.map((sub) => {
                  const dateStr = new Date(sub.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  })
                  const primaryVal = Object.values(sub.data)[0]

                  return (
                    <div
                      key={sub.id}
                      className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            sub.isRead ? 'bg-muted-foreground/40' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-semibold text-foreground truncate">
                          {String(primaryVal ?? 'Empty payload')}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px] truncate">
                          · {sub.projectName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-muted-foreground text-[11px]">
                          {dateStr}
                        </span>
                        <Link
                          to={`/dashboard/projects/${sub.projectId}/submissions`}
                          className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                          title="View form submissions"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
