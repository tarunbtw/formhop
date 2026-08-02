import { Moon, Sun, Laptop } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../lib/utils'

export function ThemeToggle({ className, variant = 'dropdown' }: { className?: string; variant?: 'dropdown' | 'compact' }) {
  const { theme, setTheme, toggleTheme, resolvedTheme } = useTheme()

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className
        )}
        title={`Current mode: ${theme} (Click to switch)`}
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-4 w-4 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </button>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-border bg-card p-1 shadow-sm',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
          theme === 'light'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        <span>Light</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
          theme === 'dark'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        <span>Dark</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
          theme === 'system'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Laptop className="h-3.5 w-3.5" />
        <span>Auto</span>
      </button>
    </div>
  )
}

