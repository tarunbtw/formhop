import { useState, useEffect, useRef, Fragment } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi, submissionsApi } from '../lib/api'
import {
  Copy,
  Trash2,
  Check,
  ArrowLeft,
  Pencil,
  X,
  Plus,
  Download,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle2,
  Search,
  Mail,
  Inbox,
} from 'lucide-react'
import { toast } from '../components/Toast'
import { ConfirmModal } from '../components/ConfirmModal'
import { type FieldType, FIELD_TYPES } from '../lib/constants'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table'

interface Field {
  name: string
  label: string
  type: FieldType
  required: boolean
}

interface Submission {
  id: string
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

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [copied, setCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  // Schema Accordion State (default collapsed for a minimal, clean overview)
  const [isSchemaExpanded, setIsSchemaExpanded] = useState(false)

  // Schema Editing State
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editFields, setEditFields] = useState<Field[]>([])
  const [editEmailNotifications, setEditEmailNotifications] = useState(false)

  // Submissions Table State
  const [filterState, setFilterState] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null)

  // Close export dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false)
      }
    }
    if (exportOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [exportOpen])

  // Fetch Project
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id!),
    enabled: !!id,
  })

  // Fetch Submissions
  const { data: submissionsData, isLoading: loadingSubmissions } = useQuery<SubmissionsResponse>({
    queryKey: ['submissions', id],
    queryFn: () => submissionsApi.list(id!, 1, 100),
    enabled: !!id,
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => projectsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      toast('Form deleted', 'success')
      navigate('/dashboard')
    },
    onError: () => toast('Failed to delete form', 'error'),
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; schema?: Field[]; email_notifications?: boolean }) =>
      projectsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      setIsEditing(false)
      toast('Form updated successfully!', 'success')
    },
    onError: () => toast('Failed to update form', 'error'),
  })

  // Mark Read Mutation
  const markReadMutation = useMutation({
    mutationFn: (subId: string) => submissionsApi.markRead(id!, subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', id] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  function openEdit() {
    if (!project) return
    setEditName(project.name)
    setEditFields((project.schema as Field[]).map((f) => ({ ...f })))
    setEditEmailNotifications(project.emailNotifications ?? false)
    setIsEditing(true)
  }

  function addField() {
    setEditFields((prev) => [
      ...prev,
      { name: '', label: '', type: 'text', required: false },
    ])
  }

  function removeField(i: number) {
    setEditFields((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateField(i: number, patch: Partial<Field>) {
    setEditFields((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f))
    )
  }

  function saveEdit() {
    if (!editName.trim()) return toast('Form name is required', 'error')
    if (editFields.length === 0) return toast('At least one field is required', 'error')
    for (const f of editFields) {
      if (!f.name.trim() || !f.label.trim()) return toast('All fields need a name and label', 'error')
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(f.name))
        return toast(`Field key "${f.name}" must be alphanumeric (letters, numbers, _)`, 'error')
    }

    updateMutation.mutate({
      name: editName.trim(),
      schema: editFields,
      email_notifications: editEmailNotifications,
    })
  }

  const copyEndpoint = () => {
    if (!project) return
    navigator.clipboard.writeText(project.endpoint_url).then(() => {
      setCopied(true)
      toast('Endpoint URL copied!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const allSubmissions = submissionsData?.submissions ?? []

  const handleExportCsv = () => {
    setExportOpen(false)
    if (!allSubmissions.length) {
      toast('No submissions recorded for this form yet')
      return
    }
    const allKeys = Array.from(new Set(allSubmissions.flatMap((s) => Object.keys(s.data || {})))) as string[]
    const header = ['date', 'status', ...allKeys]
    const rows = allSubmissions.map((s) => [
      new Date(s.createdAt).toISOString(),
      s.isRead ? 'read' : 'unread',
      ...allKeys.map((k) => {
        const val = s.data?.[k]
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
    a.download = `${project?.slug ?? 'form'}-submissions.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast('CSV downloaded successfully!')
  }

  const handleExportSheets = () => {
    setExportOpen(false)
    if (!allSubmissions.length) {
      toast('No submissions recorded for this form yet')
      return
    }
    const allKeys = Array.from(new Set(allSubmissions.flatMap((s) => Object.keys(s.data || {})))) as string[]
    const header = ['Date', 'Status', ...allKeys]
    const rows = allSubmissions.map((s) => [
      new Date(s.createdAt).toLocaleString(),
      s.isRead ? 'Read' : 'Unread',
      ...allKeys.map((k) => {
        const val = s.data?.[k]
        return val == null ? '' : String(val).replace(/\t/g, ' ')
      }),
    ])
    const tsv = [header, ...rows].map((r) => r.join('\t')).join('\n')
    navigator.clipboard.writeText(tsv).then(() => {
      toast('Copied data to clipboard! Paste directly into your new Google Sheet.')
    }).catch(() => {
      toast('Opening Google Sheets…')
    })
    handleExportCsv()
    window.open('https://sheets.new', '_blank')
  }

  if (loadingProject) {
    return (
      <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-40 bg-card rounded-md animate-pulse" />
        <div className="h-48 rounded-xl bg-card border border-border animate-pulse" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex-1 p-8 text-center max-w-md mx-auto my-20 space-y-4">
        <p className="text-muted-foreground text-sm">Form not found or has been deleted.</p>
        <Link to="/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const schemaFields = (project.schema as Field[]) || []

  // Filter submissions by read state and search query
  const filteredSubmissions = allSubmissions.filter((s) => {
    if (filterState === 'unread' && s.isRead) return false
    if (filterState === 'read' && !s.isRead) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matches = Object.values(s.data || {}).some((v) =>
        String(v).toLowerCase().includes(q)
      )
      if (!matches) return false
    }
    return true
  })

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* ─── Top Navigation & Header ────────────────────────────────────────── */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Forms
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {project.name}
              </h1>
              <Badge variant="outline" className="font-mono text-xs">
                {schemaFields.length} {schemaFields.length === 1 ? 'field' : 'fields'}
              </Badge>
              {project.emailNotifications ? (
                <Badge variant="success" className="text-xs">
                  Alerts Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs opacity-70">
                  Alerts Muted
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Created on {new Date(project.createdAt).toLocaleDateString()} · Endpoint ID: <code className="font-mono">{project.slug}</code>
            </p>
          </div>

          {/* ─── Compact Action Row: Export Dropdown, Edit Schema, Delete ─────── */}
          <div className="flex items-center gap-2">
            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportOpen(!exportOpen)}
                className="gap-1.5 h-8 text-xs font-semibold"
              >
                <Download size={13} />
                <span>Export</span>
                <ChevronDown size={13} className="text-muted-foreground" />
              </Button>

              {exportOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-popover shadow-md py-1 z-30 animate-in fade-in-50 zoom-in-95">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                  >
                    <Download size={13} className="text-muted-foreground" />
                    <span>Export to CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportSheets}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                  >
                    <TableIcon size={13} className="text-[#005DFF]" />
                    <span>Export to Sheets</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit Schema */}
            <Button
              size="sm"
              variant="outline"
              onClick={isEditing ? () => setIsEditing(false) : openEdit}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              {isEditing ? <X size={14} /> : <Pencil size={14} />}
              <span>{isEditing ? 'Cancel Edit' : 'Edit Schema'}</span>
            </Button>

            {/* Delete Form */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 h-8 px-2.5 text-xs font-semibold"
              title="Delete Form"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Endpoint Bar Card ──────────────────────────────────────────────── */}
      <Card className="p-3.5 bg-secondary/40 border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Badge variant="secondary" className="font-mono text-[11px] shrink-0 font-bold">
              POST
            </Badge>
            <code className="text-xs font-mono text-foreground truncate select-all">
              {project.endpoint_url}
            </code>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={copyEndpoint}
            className="gap-1.5 shrink-0 self-start sm:self-auto h-7 text-xs font-medium"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Endpoint'}</span>
          </Button>
        </div>
      </Card>

      {/* ─── Schema Editing Form (Visible during active edit) ────────────────── */}
      {isEditing ? (
        <Card className="border-ring/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Edit Form Schema &amp; Notifications</CardTitle>
            <CardDescription className="text-xs">
              Update field names, requirements, and notification toggles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Form Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Contact Form"
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Email Notifications</p>
                  <p className="text-[11px] text-muted-foreground">Receive instant alerts for each inbound submission</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={editEmailNotifications}
                onChange={(e) => setEditEmailNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Fields</label>
                <button
                  type="button"
                  onClick={addField}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                >
                  <Plus size={13} /> Add Field
                </button>
              </div>

              {editFields.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-lg border border-border bg-card"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="key (e.g. email)"
                      value={f.name}
                      onChange={(e) => updateField(i, { name: e.target.value })}
                      className="text-xs font-mono"
                    />
                    <Input
                      placeholder="Label (e.g. Work Email)"
                      value={f.label}
                      onChange={(e) => updateField(i, { label: e.target.value })}
                      className="text-xs"
                    />
                    <select
                      value={f.type}
                      onChange={(e) => updateField(i, { type: e.target.value as FieldType })}
                      className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) => updateField(i, { required: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-ring"
                      />
                      <span>Required</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(i)}
                      className="text-muted-foreground hover:text-red-500 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveEdit} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* ─── Schema Definition Accordion (Collapsible) ─────────────────────── */
        <Card className="overflow-hidden border-border bg-card">
          <button
            type="button"
            onClick={() => setIsSchemaExpanded(!isSchemaExpanded)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-foreground">Schema Definition</span>
              <Badge variant="outline" className="font-mono text-[10px]">
                {schemaFields.length} {schemaFields.length === 1 ? 'field' : 'fields'}
              </Badge>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                — Validated schema types
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span>{isSchemaExpanded ? 'Collapse' : 'Expand'}</span>
              {isSchemaExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {isSchemaExpanded && (
            <CardContent className="p-0 border-t border-border">
              <div className="divide-y divide-border">
                {schemaFields.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between px-4 py-3 text-xs hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <code className="font-mono font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                        {f.name}
                      </code>
                      <span className="text-muted-foreground">{f.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {f.type}
                      </Badge>
                      {f.required ? (
                        <Badge variant="destructive" className="text-[10px]">Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] opacity-75">Optional</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* ─── Submissions Table (shadcn ui) ─────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Submissions
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              ({allSubmissions.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-secondary/60 p-0.5 rounded-md border border-border">
              <button
                type="button"
                onClick={() => setFilterState('all')}
                className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                  filterState === 'all'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterState('unread')}
                className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
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
                className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                  filterState === 'read'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Read
              </button>
            </div>

            {/* Search Input */}
            {allSubmissions.length > 0 && (
              <div className="relative w-44">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-7 pl-8 pr-2.5 text-xs rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loadingSubmissions && (
          <div className="rounded-lg border border-border bg-card p-6 space-y-2 animate-pulse">
            <div className="h-8 bg-muted rounded" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-8 bg-muted rounded" />
          </div>
        )}

        {/* Empty State */}
        {!loadingSubmissions && allSubmissions.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-10 text-center animate-in fade-in-50">
            <Inbox className="mx-auto h-7 w-7 text-muted-foreground/60 stroke-[1.5]" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No submissions yet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Submissions posted to <code className="font-mono text-foreground font-semibold">{project.slug}</code> will populate this table automatically.
            </p>
          </div>
        )}

        {/* shadcn UI Table */}
        {!loadingSubmissions && allSubmissions.length > 0 && (
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">Status</TableHead>
                  <TableHead className="w-36">Date</TableHead>
                  {schemaFields.slice(0, 4).map((f) => (
                    <TableHead key={f.name}>{f.label || f.name}</TableHead>
                  ))}
                  <TableHead className="w-16 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={schemaFields.slice(0, 4).length + 3}
                      className="text-center py-8 text-xs text-muted-foreground"
                    >
                      No records matching your search query.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isExpanded = expandedSubId === sub.id
                    const dateStr = new Date(sub.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    return (
                      <Fragment key={sub.id}>
                        <TableRow
                          onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                          className="cursor-pointer hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="text-center py-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                markReadMutation.mutate(sub.id)
                              }}
                              className="text-muted-foreground hover:text-foreground p-0.5 transition-colors"
                              title={sub.isRead ? 'Mark as unread' : 'Mark as read'}
                            >
                              {sub.isRead ? (
                                <CheckCircle2 size={15} className="text-muted-foreground/60" />
                              ) : (
                                <Circle size={15} className="text-emerald-500 fill-emerald-500/20" />
                              )}
                            </button>
                          </TableCell>

                          <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {dateStr}
                          </TableCell>

                          {schemaFields.slice(0, 4).map((f) => {
                            const val = sub.data?.[f.name]
                            return (
                              <TableCell key={f.name} className="truncate max-w-[180px]">
                                {val == null || val === '' ? (
                                  <span className="text-muted-foreground/40 font-mono text-[11px]">—</span>
                                ) : (
                                  <span className="font-medium text-foreground">
                                    {String(val)}
                                  </span>
                                )}
                              </TableCell>
                            )
                          })}

                          <TableCell className="text-right">
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                              title={isExpanded ? 'Collapse payload' : 'Expand full payload'}
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Payload Inspector */}
                        {isExpanded && (
                          <TableRow className="bg-secondary/30 hover:bg-secondary/40 border-b border-border">
                            <TableCell colSpan={schemaFields.slice(0, 4).length + 3} className="p-4">
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                  {Object.entries(sub.data || {}).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="p-2.5 rounded-md border border-border bg-card text-xs"
                                    >
                                      <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block mb-0.5">
                                        {key}
                                      </span>
                                      <span className="text-foreground font-mono whitespace-pre-wrap break-all">
                                        {value == null ? '—' : String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-muted-foreground">
                                  <span className="font-mono">
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
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Form Endpoint?"
        message={`Are you sure you want to delete "${project.name}"? All associated submission records will be permanently removed.`}
        confirmLabel="Delete Form"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
