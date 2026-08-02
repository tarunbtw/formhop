import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FolderPlus,
  LogOut,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ThemeToggle } from './ui/theme-toggle'
import { Button } from './ui/button'

export function TopNav() {
  const { user, isAuthenticated, logout, loginWithGithub } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Clean sticky navbar for Landing Page (Formspree style)
  if (isLandingPage) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              F
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-foreground">Formhop</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">v2.0</span>
            </div>
          </Link>

          {/* Landing Page Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#code-examples" className="hover:text-foreground transition-colors">Code Examples</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle variant="compact" />

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                  <span>Dashboard</span>
                  <ArrowRight size={13} />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loginWithGithub()}
                  className="h-8 text-xs font-semibold"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => loginWithGithub()}
                  className="h-8 gap-1 text-xs font-semibold"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }

  const isOverview = location.pathname === '/dashboard'
  const isSettings = location.pathname.startsWith('/dashboard/settings')

  // Dashboard top header — Clean, single-row minimal navigation (shadcn / Vercel style)
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-card/90 px-4 sm:px-6 backdrop-blur transition-colors">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
            F
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">Formhop</span>
        </Link>

        {/* Minimal Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              isOverview
                ? 'bg-secondary text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/dashboard/settings"
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              isSettings
                ? 'bg-secondary text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            Settings
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle variant="compact" />

        <Link to="/dashboard/projects/new">
          <Button size="sm" className="gap-1.5 h-8 text-xs font-semibold">
            <FolderPlus size={14} />
            <span>New Form</span>
          </Button>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2 text-xs font-medium text-foreground hover:opacity-80 transition-opacity"
              title={user?.email ?? 'Account'}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? 'Avatar'}
                  className="h-7 w-7 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                  {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

// Keep export for backward compatibility if imported anywhere
export function DashboardSidebar() {
  return null
}
