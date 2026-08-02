import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import {
  Copy,
  Trash2,
  Inbox,
  Check,
  ArrowLeft,
  Pencil,
  X,
  Plus,
  Mail,
} from 'lucide-react'
import { toast } from '../components/Toast'
import { ConfirmModal } from '../components/ConfirmModal'
import { type FieldType, FIELD_TYPES } from '../lib/constants'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'

interface Field {
  name: string
  label: string
  type: FieldType
  required: boolean
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editFields, setEditFields] = useState<Field[]>([])
  const [editEmailNotifications, setEditEmailNotifications] = useState(false)
  const [activeCodeTab, setActiveCodeTab] = useState<'fetch' | 'html' | 'curl'>('fetch')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id!),
    enabled: !!id,
  })

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

  if (isLoading) {
    return (
      <div className="flex-1 p-8 max-w-5xl mx-auto space-y-4">
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

  const fetchCode = `fetch('${project.endpoint_url}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
${(project.schema as Field[])
  .map((f) => `    ${f.name}: "value"`)
  .join(',\n')}
  })
})`

  const htmlCode = `<form action="${project.endpoint_url}" method="POST">
  <!-- Invisible honeypot trap -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />
${(project.schema as Field[])
  .map(
    (f) => `  <label for="${f.name}">${f.label}</label>
  <input id="${f.name}" name="${f.name}" type="${f.type === 'email' ? 'email' : 'text'}" ${f.required ? 'required ' : ''}/>`
  )
  .join('\n')}
  <button type="submit">Submit</button>
</form>`

  const curlCode = `curl -X POST ${project.endpoint_url} \\
  -H "Content-Type: application/json" \\
  -d '{
${(project.schema as Field[])
  .map((f) => `    "${f.name}": "sample"`)
  .join(',\n')}
  }'`

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Navigation & Header */}
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
                {(project.schema as Field[]).length} fields
              </Badge>
              {project.emailNotifications ? (
                <Badge variant="success" className="gap-1 text-xs">
                  <Mail size={12} /> Alerts Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-xs opacity-70">
                  <Mail size={12} /> Alerts Muted
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Created on {new Date(project.createdAt).toLocaleDateString()} · Endpoint ID: <code className="font-mono">{project.slug}</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/dashboard/projects/${project.id}/submissions`}>
              <Button size="sm" variant="default" className="gap-2">
                <Inbox size={15} />
                <span>Inbox ({project.submissionCount})</span>
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              onClick={isEditing ? () => setIsEditing(false) : openEdit}
              className="gap-1.5"
            >
              {isEditing ? <X size={14} /> : <Pencil size={14} />}
              <span>{isEditing ? 'Cancel Edit' : 'Edit Schema'}</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-9 w-9 p-0"
              title="Delete Form"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Endpoint Bar Card */}
      <Card className="p-4 bg-secondary/40 border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Badge variant="secondary" className="font-mono text-[11px] shrink-0">
              POST
            </Badge>
            <code className="text-xs sm:text-sm font-mono text-foreground truncate select-all">
              {project.endpoint_url}
            </code>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={copyEndpoint}
            className="gap-1.5 shrink-0 self-start sm:self-auto h-8 text-xs"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Endpoint'}</span>
          </Button>
        </div>
      </Card>

      {/* Editing Mode */}
      {isEditing ? (
        <Card className="border-ring/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Edit Form Schema &amp; Notifications</CardTitle>
            <CardDescription className="text-xs">
              Update field names, requirements, and Resend notification toggles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Form Name
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Form Name"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Email Notifications via Resend</p>
                  <p className="text-[11px] text-muted-foreground">Receive instant alerts on your verified account email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={editEmailNotifications}
                onChange={(e) => setEditEmailNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Fields</span>
                <Button type="button" variant="outline" size="sm" onClick={addField} className="h-7 text-xs gap-1">
                  <Plus size={12} /> Add Field
                </Button>
              </div>

              {editFields.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-lg border border-border bg-card p-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                    <Input
                      placeholder="key (e.g. email)"
                      value={f.name}
                      onChange={(e) => updateField(i, { name: e.target.value })}
                      className="font-mono text-xs"
                    />
                    <Input
                      placeholder="label (e.g. Email)"
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
        /* Schema Read-only Inspector */
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Schema Definition</CardTitle>
            <CardDescription className="text-xs">
              Incoming JSON submissions are validated against these types by Zod before persisting.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border border-t border-border">
              {(project.schema as Field[]).map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between p-4 text-xs hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <code className="font-mono font-semibold text-foreground bg-secondary px-2 py-1 rounded-md">
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
        </Card>
      )}

      {/* Integration Code Snippets Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Integration Snippets</CardTitle>
            <CardDescription className="text-xs">
              Copy-paste ready implementation code for your stack.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveCodeTab('fetch')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeCodeTab === 'fetch'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Fetch / React
            </button>
            <button
              onClick={() => setActiveCodeTab('html')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeCodeTab === 'html'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              HTML Form
            </button>
            <button
              onClick={() => setActiveCodeTab('curl')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeCodeTab === 'curl'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              cURL
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg bg-charcoal text-ivory p-4 font-mono text-xs overflow-x-auto border border-border">
            <button
              onClick={() => {
                const code =
                  activeCodeTab === 'fetch'
                    ? fetchCode
                    : activeCodeTab === 'html'
                    ? htmlCode
                    : curlCode
                navigator.clipboard.writeText(code)
                toast('Code snippet copied!')
              }}
              className="absolute right-3 top-3 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors"
            >
              Copy
            </button>
            <pre className="m-0 leading-relaxed">
              {activeCodeTab === 'fetch'
                ? fetchCode
                : activeCodeTab === 'html'
                ? htmlCode
                : curlCode}
            </pre>
          </div>
        </CardContent>
      </Card>

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
