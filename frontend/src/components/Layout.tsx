import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FolderPlus,
  LogOut,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { FormhopBrandLogo } from './FormcarryBrandLogo'

export function TopNav() {
  const { user, isAuthenticated, logout, loginWithGithub } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isDocsPage = location.pathname.startsWith('/docs')
  const isApiRef = location.pathname.includes('/api')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // ─── Dedicated Formcarry-Style Docs Header (Clean, Zero Clutter) ──────
  if (isDocsPage) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-[#DDE0EE] bg-white transition-all">
        <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group transition-transform group-hover:opacity-90">
            <FormhopBrandLogo iconSize={23} />
          </Link>

          {/* Center Pill Switcher: Documentation / API Reference */}
          <div className="flex items-center p-1 rounded-full bg-slate-100 border border-[#DDE0EE]/80 text-xs font-medium">
            <Link
              to="/docs/introduction"
              className={`px-3.5 py-1 rounded-full transition-all ${
                !isApiRef
                  ? 'bg-white text-[#0E0B3D] font-semibold shadow-2xs'
                  : 'text-[#6C6F93] hover:text-[#0E0B3D]'
              }`}
            >
              Documentation
            </Link>
            <Link
              to="/docs/api"
              className={`px-3.5 py-1 rounded-full transition-all ${
                isApiRef
                  ? 'bg-white text-[#0E0B3D] font-semibold shadow-2xs'
                  : 'text-[#6C6F93] hover:text-[#0E0B3D]'
              }`}
            >
              API Reference
            </Link>
          </div>

          {/* Right Action: Dashboard Button */}
          <div className="flex items-center gap-2.5">
            <Link to="/dashboard">
              <button
                type="button"
                className="h-8 px-4 rounded-full bg-[#EBF3FF] hover:bg-[#DDEBFF] text-[#005DFF] text-xs font-semibold transition-all"
              >
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  // ─── Gapped Navbar for Landing Page (Suspended from top, non-sticky) ───
  if (isLandingPage) {
    return (
      <header className="relative z-40 w-full pt-6 sm:pt-8 pb-3 bg-white transition-all">
        <div className="max-w-6xl mx-auto flex h-11 sm:h-12 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group transition-transform group-hover:opacity-90">
            <FormhopBrandLogo iconSize={24} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-[#0E0B3D]/80">
            <a href="/#examples" className="hover:text-[#005DFF] transition-colors">
              Examples
            </a>
            <a href="/#features" className="hover:text-[#005DFF] transition-colors">
              Features
            </a>
            <Link
              to="/docs"
              className="hover:text-[#005DFF] transition-colors"
            >
              Docs
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white font-medium text-xs shadow-xs transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={13} />
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loginWithGithub()}
                  className="h-8 px-3 text-xs font-medium text-[#0E0B3D] hover:text-[#005DFF] transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => loginWithGithub()}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white font-medium text-xs shadow-xs transition-all"
                >
                  <span>Sign up</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-[#0E0B3D] hover:bg-black/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white/95 backdrop-blur-md px-5 py-3 space-y-2 border-b border-[#DDE0EE]/60 shadow-lg mt-2">
            <a
              href="/#examples"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-[#0E0B3D] py-1.5"
            >
              Examples
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-[#0E0B3D] py-1.5"
            >
              Features
            </a>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-[#0E0B3D] py-1.5"
            >
              Docs
            </Link>

            <div className="pt-2 border-t border-[#DDE0EE]/60 flex flex-col gap-1.5">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg bg-[#005DFF] text-white font-medium text-xs"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight size={13} />
                  </button>
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      loginWithGithub()
                    }}
                    className="w-full h-8 rounded-lg border border-[#DDE0EE] text-xs font-medium text-[#0E0B3D]"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      loginWithGithub()
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg bg-[#005DFF] text-white font-medium text-xs"
                  >
                    <span>Sign up</span>
                    <ArrowRight size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    )
  }

  const isOverview = location.pathname === '/dashboard'
  const isSettings = location.pathname.startsWith('/dashboard/settings')

  // ─── Dashboard Top Header ─────────────────────────────────────────────
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#DDE0EE] bg-white px-4 sm:px-6 transition-colors">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center group">
          <FormhopBrandLogo iconSize={22} />
        </Link>

        {/* Minimal Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isOverview
                ? 'bg-[#F0F5FF] text-[#005DFF] font-semibold'
                : 'text-[#6C6F93] hover:text-[#0E0B3D]'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/dashboard/settings"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isSettings
                ? 'bg-[#F0F5FF] text-[#005DFF] font-semibold'
                : 'text-[#6C6F93] hover:text-[#0E0B3D]'
            }`}
          >
            Settings
          </Link>
          <Link
            to="/docs"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6C6F93] hover:text-[#0E0B3D] transition-colors"
          >
            Docs
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/dashboard/projects/new">
          <Button size="sm" className="gap-1.5 h-8 rounded-lg bg-[#005DFF] hover:bg-[#1463FF] text-white text-xs font-semibold shadow-xs">
            <FolderPlus size={14} />
            <span>New Form</span>
          </Button>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#DDE0EE]">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2 text-xs font-medium text-[#0E0B3D] hover:opacity-80 transition-opacity"
              title={user?.email ?? 'Account'}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? 'Avatar'}
                  className="h-7 w-7 rounded-full border border-[#DDE0EE] object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005DFF] text-white font-bold text-xs">
                  {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#6C6F93] hover:bg-black/5 hover:text-[#0E0B3D] transition-colors"
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

export function DashboardSidebar() {
  return null
}
