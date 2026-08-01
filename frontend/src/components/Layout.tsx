import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderPlus,
  Settings,
  LogOut,
  ArrowRight,
  Layers,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function TopNav() {
  const { user, isAuthenticated, logout, loginWithGithub } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="top-nav">
      {/* Brand Logo */}
      <Link to="/" className="nav-logo">
        <div className="nav-logo-mark">
          <Layers size={18} strokeWidth={2.5} />
        </div>
        <span>Formsy</span>
      </Link>

      {/* Landing Page Navigation Links */}
      {isLandingPage && (
        <div className="nav-links" style={{ marginLeft: 32 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#demo" className="nav-link">Interactive Demo</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </div>
      )}

      <div className="flex-1" />

      {/* Right Actions */}
      {isAuthenticated ? (
        isLandingPage ? (
          <Link to="/dashboard" className="btn btn-primary btn-sm flex items-center gap-xs">
            <span>Dashboard</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <div className="flex items-center gap-md">
            <Link to="/dashboard/projects/new" className="btn btn-secondary btn-sm flex items-center gap-xs">
              <FolderPlus size={14} />
              <span>New form</span>
            </Link>
            <Link to="/dashboard/settings" title="Account settings">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? 'Avatar'}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '2px solid var(--hairline)',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--brand-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0A0D14',
                  }}
                >
                  {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '8px', color: 'var(--steel)' }}
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )
      ) : isLandingPage ? (
        <div className="flex items-center gap-sm">
          <button
            onClick={() => loginWithGithub()}
            className="btn btn-ghost btn-sm"
            style={{ fontWeight: 600 }}
          >
            Sign in
          </button>
          <a href="#cta" className="btn btn-primary btn-sm flex items-center gap-xs">
            <span>Start free</span>
            <ArrowRight size={13} />
          </a>
        </div>
      ) : (
        <button
          onClick={() => loginWithGithub()}
          className="btn btn-primary btn-sm"
        >
          Sign in
        </button>
      )}
    </nav>
  )
}

export function DashboardSidebar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="sidebar">
      <div className="sidebar-section-header">Dashboard</div>
      <nav>
        <Link
          to="/dashboard"
          className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} />
          <span>All Forms</span>
        </Link>
        <Link
          to="/dashboard/projects/new"
          className={`sidebar-item ${isActive('/dashboard/projects/new') ? 'active' : ''}`}
        >
          <FolderPlus size={16} />
          <span>New Form</span>
        </Link>
      </nav>

      <div className="sidebar-section-header" style={{ marginTop: 24 }}>Preferences</div>
      <nav>
        <Link
          to="/dashboard/settings"
          className={`sidebar-item ${isActive('/dashboard/settings') ? 'active' : ''}`}
        >
          <Settings size={16} />
          <span>Settings &amp; Usage</span>
        </Link>
      </nav>
    </aside>
  )
}
