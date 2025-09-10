import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--apple-background-secondary)' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', color: 'var(--apple-blue) !important' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="d-flex h-100" style={{ backgroundColor: 'var(--apple-background-secondary)', minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-fill d-flex flex-column" style={{ marginLeft: '280px' }}>
        <Header />
        <main className="flex-fill p-4" style={{ backgroundColor: 'var(--apple-background-secondary)', overflowY: 'auto' }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
