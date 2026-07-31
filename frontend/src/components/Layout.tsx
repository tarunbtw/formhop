import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderPlus,
  Settings,
  LogOut,
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
      {/* Logo always goes to landing page */}
      <Link to="/" className="nav-logo">
        <span className="nav-logo-dot" />
        Formsy
      </Link>

      <div className="flex-1" />

      {isAuthenticated ? (
        isLandingPage ? (
          // On landing page: show Dashboard button
          <Link to="/dashboard" className="btn btn-primary btn-sm">
            Dashboard
          </Link>
        ) : (
          // In dashboard: show full nav actions
          <div className="flex items-center gap-md">
            <Link to="/dashboard/projects/new" className="btn btn-secondary btn-sm">
              <FolderPlus size={14} />
              New form
            </Link>
            <Link to="/dashboard/settings">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? 'Avatar'}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '2px solid var(--hairline)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--brand-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--primary)',
                  }}
                >
                  {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '6px', color: 'var(--steel)' }}
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )
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

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <aside className="sidebar">
      <div className="sidebar-section-header">Navigation</div>
      <nav>
        <Link
          to="/dashboard"
          className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} />
          All Forms
        </Link>
        <Link
          to="/dashboard/projects/new"
          className={`sidebar-item ${isActive('/dashboard/projects/new') ? 'active' : ''}`}
        >
          <FolderPlus size={16} />
          New Form
        </Link>
      </nav>

      <div className="sidebar-section-header" style={{ marginTop: 24 }}>Account</div>
      <nav>
        <Link
          to="/dashboard/settings"
          className={`sidebar-item ${isActive('/dashboard/settings') ? 'active' : ''}`}
        >
          <Settings size={16} />
          Settings
        </Link>
      </nav>
    </aside>
  )
}
