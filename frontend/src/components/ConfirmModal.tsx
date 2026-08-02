import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg text-foreground animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={18}
            className={`shrink-0 mt-0.5 ${danger ? 'text-destructive' : 'text-muted-foreground'}`}
          />

          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-none">{title}</h3>
            <p className="text-sm text-muted-foreground pt-1.5">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={danger ? 'destructive' : 'default'}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="gap-2"
          >
            {loading && <RefreshCw size={13} className="animate-spin" />}
            <span>{confirmLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
