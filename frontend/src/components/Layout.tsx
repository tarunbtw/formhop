import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FolderPlus,
  LogOut,
  ArrowRight,
  Layers,
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

  // Floating pill navbar for Landing Page
  if (isLandingPage) {
    return (
      <header className="floating-nav-wrapper">
        <nav className="floating-nav">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-decoration-none">
            <div className="w-8 h-8 rounded-lg bg-charcoal dark:bg-ivory flex items-center justify-center text-ivory dark:text-charcoal shadow-sm">
              <Layers size={17} strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] text-foreground tracking-tight">Formhop</span>
              <span className="badge-pill-subtle">v2.0</span>
            </div>
          </Link>

          {/* Landing Page Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle variant="compact" />

            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-pill-dark">
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => loginWithGithub()}
                  className="btn-pill-ghost"
                >
                  Log in
                </button>
                <a href="#cta" className="btn-pill-dark">
                  <span>Get started</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            )}
          </div>
        </nav>
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
