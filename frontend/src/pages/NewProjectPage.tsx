import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import {
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Mail,
  Send,
} from 'lucide-react'
import { toast } from '../components/Toast'
import { FIELD_TYPES, APP_LIMITS, type FieldType } from '../lib/constants'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

interface Field {
  id: string
  name: string
  type: FieldType
  required: boolean
  label: string
}

function newField(): Field {
  return {
    id: Math.random().toString(36).slice(2),
    name: '',
    type: 'text',
    required: false,
    label: '',
  }
}

const TEMPLATES: Record<string, { name: string; fields: Array<Omit<Field, 'id'>> }> = {
  contact: {
    name: 'Contact Form',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Full Name' },
      { name: 'email', type: 'email', required: true, label: 'Email Address' },
      { name: 'message', type: 'text', required: true, label: 'Message' },
    ],
  },
  waitlist: {
    name: 'Waitlist Form',
    fields: [
      { name: 'email', type: 'email', required: true, label: 'Email Address' },
      { name: 'role', type: 'text', required: false, label: 'Job Title / Role' },
      { name: 'referral', type: 'text', required: false, label: 'Referral Source' },
    ],
  },
  feedback: {
    name: 'Feedback Survey',
    fields: [
      { name: 'email', type: 'email', required: true, label: 'User Email' },
      { name: 'score', type: 'number', required: true, label: 'NPS Rating (1-10)' },
      { name: 'improvements', type: 'text', required: false, label: 'Suggestions' },
    ],
  },
}

export default function NewProjectPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: projectsApi.usage,
  })

  const formCount = usage?.forms?.used ?? 0
  const isAtLimit = formCount >= APP_LIMITS.MAX_FORMS_PER_USER

  const [name, setName] = useState('')
  const [fields, setFields] = useState<Field[]>([newField()])
  const [allowedOrigins, setAllowedOrigins] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      toast('Form created successfully!', 'success')
      navigate(`/dashboard/projects/${project.id}`)
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Failed to create form'
      toast(msg, 'error')
    },
  })

  function applyPreset(key: keyof typeof TEMPLATES) {
    const tmpl = TEMPLATES[key]
    setName(tmpl.name)
    setFields(
      tmpl.fields.map((f) => ({
        ...f,
        id: Math.random().toString(36).slice(2),
      }))
    )
    toast(`Applied ${tmpl.name} preset!`)
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Form name is required'
    fields.forEach((f, i) => {
      if (!f.name.trim()) errs[`field_name_${i}`] = 'Field key is required'
      if (!f.label.trim()) errs[`field_label_${i}`] = 'Label is required'
      if (f.name && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(f.name))
        errs[`field_name_${i}`] = 'Use letters, numbers, underscores (start with a letter)'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isAtLimit) {
      toast(
        `Form limit reached (${APP_LIMITS.MAX_FORMS_PER_USER}/${APP_LIMITS.MAX_FORMS_PER_USER}). Please delete an existing form.`,
        'error'
      )
      return
    }
    if (!validate()) return

    const origins = allowedOrigins
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    createMutation.mutate({
      name: name.trim(),
      schema: fields.map(({ id: _id, ...f }) => f),
      allowed_origins: origins,
      email_notifications: emailNotifications,
    })
  }

  function updateField(id: string, patch: Partial<Field>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  function addField() {
    setFields((prev) => [...prev, newField()])
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          Create New Form
        </h1>
        <p className="text-sm text-muted-foreground">
          Define your schema fields to provision an instant HTTPS ingestion endpoint.
        </p>
      </div>

      {isAtLimit && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <span>
            You have reached the maximum free limit of <strong>{APP_LIMITS.MAX_FORMS_PER_USER} active forms</strong>. Delete an existing form to proceed.
          </span>
        </div>
      )}

      {/* Preset Starter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
          Quick Starters:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('contact')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border bg-card text-foreground hover:bg-secondary transition-colors"
        >
          <Sparkles size={12} className="text-primary" />
          <span>Contact Form</span>
        </button>
        <button
          type="button"
          onClick={() => applyPreset('waitlist')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border bg-card text-foreground hover:bg-secondary transition-colors"
        >
          <Sparkles size={12} className="text-primary" />
          <span>Beta Waitlist</span>
        </button>
        <button
          type="button"
          onClick={() => applyPreset('feedback')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border bg-card text-foreground hover:bg-secondary transition-colors"
        >
          <Sparkles size={12} className="text-primary" />
          <span>Feedback Survey</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Form Details</CardTitle>
            <CardDescription className="text-xs">
              Give your form a recognizable name and configure delivery parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Form Name *
              </label>
              <Input
                placeholder="e.g. Website Contact Form"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                }}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Allowed CORS Origins (Optional)
              </label>
              <Input
                placeholder="https://mysite.com, https://app.mysite.com (comma separated)"
                value={allowedOrigins}
                onChange={(e) => setAllowedOrigins(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Leave empty to accept submissions from any client domain.
              </p>
            </div>

            {/* Email Notifications toggle */}
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
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schema Fields Builder Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Schema Fields</CardTitle>
              <CardDescription className="text-xs">
                Configure strictly typed fields. Payload inputs will be dynamically validated by Zod.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addField}
              className="gap-1.5 text-xs h-8"
            >
              <Plus size={13} />
              <span>Add Field</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map((field, i) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Field Key *
                    </label>
                    <Input
                      placeholder="e.g. email"
                      value={field.name}
                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                      className="font-mono text-xs mt-1"
                    />
                    {errors[`field_name_${i}`] && (
                      <p className="text-[11px] text-red-500 mt-1">{errors[`field_name_${i}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Label *
                    </label>
                    <Input
                      placeholder="e.g. Work Email"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="text-xs mt-1"
                    />
                    {errors[`field_label_${i}`] && (
                      <p className="text-[11px] text-red-500 mt-1">{errors[`field_label_${i}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                      className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center pt-2 sm:pt-4">
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-ring"
                    />
                    <span>Required</span>
                  </label>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Remove field"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || isAtLimit}
              className="gap-2"
            >
              <Send size={14} />
              <span>{createMutation.isPending ? 'Provisioning...' : 'Deploy Endpoint'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
