import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi, submissionsApi } from '../lib/api'
import {
  ArrowLeft,
  Circle,
  CheckCircle2,
  Download,
  Table,
  ChevronDown,
  ChevronUp,
  Inbox,
} from 'lucide-react'
import { toast } from '../components/Toast'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

interface Submission {
  id: string
  projectId?: string
  projectName?: string
  data: Record<string, unknown>
  ipHash: string
  isRead: boolean
  createdAt: string
}

interface SubmissionsResponse {
  submissions: Submission[]
  total: number
  page: number
  totalPages: number
}

function exportToCsv(submissions: Submission[], projectName: string) {
  if (!submissions.length) return

  const allKeys = Array.from(
    new Set(submissions.flatMap((s) => Object.keys(s.data)))
  )

  const header = ['date', 'status', ...allKeys]
  const rows = submissions.map((s) => [
    new Date(s.createdAt).toISOString(),
    s.isRead ? 'read' : 'unread',
    ...allKeys.map((k) => {
      const val = s.data[k]
      const str = val == null ? '' : String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }),
  ])

  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName}-submissions-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast('CSV exported successfully!')
}

function exportToSheets(submissions: Submission[], projectName: string) {
  if (!submissions.length) return

  const allKeys = Array.from(
    new Set(submissions.flatMap((s) => Object.keys(s.data)))
  )

  const header = ['Date', 'Status', ...allKeys]
  const rows = submissions.map((s) => [
    new Date(s.createdAt).toLocaleString(),
    s.isRead ? 'Read' : 'Unread',
    ...allKeys.map((k) => {
      const val = s.data[k]
      return val == null ? '' : String(val).replace(/\t/g, ' ')
    }),
  ])

  const tsv = [header, ...rows].map((r) => r.join('\t')).join('\n')
  navigator.clipboard.writeText(tsv).then(() => {
    toast('Data copied to clipboard! Paste directly into your new Google Sheet.')
  }).catch(() => {
    toast('Opening Google Sheets…')
  })

  exportToCsv(submissions, projectName)
  window.open('https://sheets.new', '_blank')
}

export default function SubmissionsPage() {
  const { id } = useParams<{ id: string }>()
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterState, setFilterState] = useState<'all' | 'unread' | 'read'>('all')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<SubmissionsResponse>({
    queryKey: ['submissions', id, page],
    queryFn: () => submissionsApi.list(id!, page, 20),
    enabled: !!id,
  })

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id!),
    enabled: !!id,
  })

  const markReadMutation = useMutation({
    mutationFn: (submissionId: string) => submissionsApi.markRead(id!, submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  const submissions = data?.submissions ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const filteredSubmissions = submissions.filter((s) => {
    if (filterState === 'unread') return !s.isRead
    if (filterState === 'read') return s.isRead
    return true
  })

  const formTitle = `${project?.name ?? 'Form'} Submissions`
  const exportSlug = project?.slug ?? 'form'

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to={`/dashboard/projects/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to {project?.name ?? 'Form'}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {formTitle}
              </h1>
              <Badge variant="secondary">
                {total} total
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verified inbound submissions for {project?.name ?? 'endpoint'}
            </p>
          </div>

          {/* Export to CSV and Google Sheets Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={submissions.length === 0}
              onClick={() => exportToCsv(submissions, exportSlug)}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={submissions.length === 0}
              onClick={() => exportToSheets(submissions, exportSlug)}
              className="gap-1.5 h-8 text-xs font-semibold text-[#005DFF] border-[#005DFF]/25 bg-[#F0F5FF]/60 hover:bg-[#E4EEFF]"
            >
              <Table size={13} />
              <span>Export to Sheets</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-lg border border-border w-fit">
        <button
          type="button"
          onClick={() => setFilterState('all')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            filterState === 'all'
              ? 'bg-card text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({total})
        </button>
        <button
          type="button"
          onClick={() => setFilterState('unread')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            filterState === 'unread'
              ? 'bg-card text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Unread
        </button>
        <button
          type="button"
          onClick={() => setFilterState('read')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            filterState === 'read'
              ? 'bg-card text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Read
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSubmissions.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center animate-in fade-in-50">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground/60 stroke-[1.5]" />
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            {filterState === 'all' ? 'No submissions yet' : `No ${filterState} submissions`}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Submissions sent to your endpoint will appear here in real-time.
          </p>
        </div>
      )}

      {/* Submissions List */}
      {!isLoading && filteredSubmissions.length > 0 && (
        <div className="space-y-2">
          {filteredSubmissions.map((sub) => {
            const isExpanded = expandedId === sub.id
            const entries = Object.entries(sub.data || {})
            const dateStr = new Date(sub.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            const formName = sub.projectName || project?.name

            return (
              <Card
                key={sub.id}
                className={`transition-all duration-150 ${
                  !sub.isRead ? 'border-primary/40 bg-card shadow-xs' : 'bg-card/70'
                }`}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        markReadMutation.mutate(sub.id)
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title={sub.isRead ? 'Mark unread' : 'Mark read'}
                    >
                      {sub.isRead ? (
                        <CheckCircle2 size={16} className="text-muted-foreground" />
                      ) : (
                        <Circle size={16} className="text-emerald-500 fill-emerald-500/20" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {String(entries[0]?.[1] ?? 'Submission')}
                        </span>
                        {formName && (
                          <span className="text-[11px] font-medium text-[#005DFF] bg-[#F0F5FF] px-2 py-0.5 rounded">
                            {formName}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground">· {dateStr}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                        {entries.slice(1, 3).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground pl-3">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 bg-secondary/30 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {entries.map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded-lg border border-border bg-card">
                          <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block mb-0.5">
                            {k}
                          </span>
                          <span className="text-foreground font-mono whitespace-pre-wrap break-all">
                            {v == null ? '—' : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-border">
                      <span className="font-mono truncate">
                        IP Digest: {sub.ipHash || 'Anonymized'}
                      </span>
                      <button
                        type="button"
                        onClick={() => markReadMutation.mutate(sub.id)}
                        className="font-medium text-primary hover:underline"
                      >
                        {sub.isRead ? 'Mark as unread' : 'Mark as read'}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
