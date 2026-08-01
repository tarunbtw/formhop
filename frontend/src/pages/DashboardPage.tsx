import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../lib/api'
import {
  FolderPlus,
  Copy,
  FileText,
  ChevronRight,
  Mail,
  AlertCircle,
} from 'lucide-react'
import { toast } from '../components/Toast'
import { APP_LIMITS } from '../lib/constants'

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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!'))
}

export default function DashboardPage() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  })

  const formCount = projects?.length ?? 0
  const isAtLimit = formCount >= APP_LIMITS.MAX_FORMS_PER_USER

  return (
    <div style={{ flex: 1, padding: 'var(--space-xxl)' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xxl)' }}>
        <div>
          <h1 className="text-heading-3" style={{ color: 'var(--ink)' }}>Your Forms</h1>
          <p className="text-body-sm" style={{ color: 'var(--steel)', marginTop: 4 }}>
            {formCount} / {APP_LIMITS.MAX_FORMS_PER_USER} forms active
          </p>
        </div>
        {isAtLimit ? (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
            onClick={() => toast(`Form limit reached (${APP_LIMITS.MAX_FORMS_PER_USER}/${APP_LIMITS.MAX_FORMS_PER_USER}). Delete an existing form to create a new one.`, 'error')}
          >
            <FolderPlus size={16} />
            Limit reached
          </button>
        ) : (
          <Link to="/dashboard/projects/new" className="btn btn-primary">
            <FolderPlus size={16} />
            New form
          </Link>
        )}
      </div>

      {/* Limit banner if at max */}
      {isAtLimit && (
        <div
          className="flex items-center gap-sm"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: 'var(--space-xl)',
            color: 'var(--slate)',
            fontSize: 13,
          }}
        >
          <AlertCircle size={16} color="var(--brand-warning)" style={{ flexShrink: 0 }} />
          <span>
            You have reached the maximum limit of <strong>{APP_LIMITS.MAX_FORMS_PER_USER} active forms</strong>. To create a new form, delete an unused one.
          </span>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 96, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && formCount === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={24} />
          </div>
          <h3 className="text-heading-5" style={{ color: 'var(--ink)' }}>No forms yet</h3>
          <p className="text-body-sm" style={{ color: 'var(--steel)', maxWidth: 360 }}>
            Create your first form to get a submission endpoint.
          </p>
          <Link to="/dashboard/projects/new" className="btn btn-primary">
            <FolderPlus size={16} />
            Create your first form
          </Link>
        </div>
      )}

      {/* Project cards */}
      {!isLoading && projects && projects.length > 0 && (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                padding: 'var(--space-lg) var(--space-xl)',
                transition: 'box-shadow 150ms ease',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: 'var(--brand-green-soft)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-green-deep)',
                  flexShrink: 0,
                }}
              >
                <FileText size={20} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-sm" style={{ marginBottom: 4 }}>
                  <h3
                    className="text-body-md-med"
                    style={{ color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {project.name}
                  </h3>
                  <span className="badge badge-surface">{project.schema.length} fields</span>
                  {project.emailNotifications ? (
                    <span className="badge badge-success flex items-center gap-xs" style={{ fontSize: 11 }}>
                      <Mail size={11} /> Alerts ON
                    </span>
                  ) : (
                    <span className="badge badge-surface flex items-center gap-xs" style={{ fontSize: 11, opacity: 0.65 }}>
                      <Mail size={11} /> Alerts OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-sm">
                  <code
                    className="code-inline"
                    style={{ fontSize: 12, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                  >
                    {project.endpoint_url}
                  </code>
                  <button
                    className="btn-ghost"
                    style={{ padding: 4, borderRadius: 4, color: 'var(--steel)' }}
                    onClick={() => copyToClipboard(project.endpoint_url)}
                    title="Copy endpoint URL"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span className="text-body-sm-med" style={{ color: 'var(--ink)' }}>
                  {project.submissionCount.toLocaleString()}
                </span>
                <span className="text-caption" style={{ color: 'var(--steel)' }}>submissions</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-xs" style={{ flexShrink: 0 }}>
                <Link
                  to={`/dashboard/projects/${project.id}/submissions`}
                  className="btn btn-secondary btn-sm"
                >
                  Inbox
                </Link>
                <Link
                  to={`/dashboard/projects/${project.id}`}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px 10px' }}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
