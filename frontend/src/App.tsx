import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './components/Toast'
import { TopNav } from './components/Layout'
import LandingPage from './pages/LandingPage'
import DocsPage from './pages/DocsPage'
import DashboardPage from './pages/DashboardPage'
import NewProjectPage from './pages/NewProjectPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import SubmissionsPage from './pages/SubmissionsPage'
import SettingsPage from './pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

// Protected route wrapper
function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#DDE0EE] border-t-[#005DFF] animate-spin" />
        <span className="text-xs text-[#6C6F93]">Loading Formhop…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

// Dashboard clean full-width layout
function DashboardLayout() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background">
      <Outlet />
    </main>
  )
}

function AppRoutes() {

  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:topic" element={<DocsPage />} />

        {/* Protected dashboard routes */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/projects/new" element={<NewProjectPage />} />
            <Route path="/dashboard/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/dashboard/projects/:id/submissions" element={<SubmissionsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
