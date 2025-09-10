import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  CreditCard, 
  Wrench, 
  Shield, 
  BarChart3,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vehículos', href: '/vehicles', icon: Car },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Contratos', href: '/contracts', icon: FileText },
  { name: 'Pagos', href: '/payments', icon: CreditCard },
  { name: 'Mantenimiento', href: '/maintenance', icon: Wrench },
  { name: 'Seguros', href: '/insurance', icon: Shield },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const { signOut, profile } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="sidebar-apple">
      {/* Logo */}
      <div 
        className="d-flex align-items-center justify-content-center py-4 px-3"
        style={{ 
          background: 'var(--apple-blue)',
          borderBottom: '1px solid var(--apple-gray-2)'
        }}
      >
        <h1 
          className="h4 fw-bold mb-0"
          style={{ 
            color: 'white',
            fontSize: '20px',
            letterSpacing: '-0.5px'
          }}
        >
          FlotaAtenea
        </h1>
      </div>

      {/* User Info */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--apple-gray-2)' }}>
        <div className="d-flex align-items-center">
          <div 
            className="d-flex align-items-center justify-content-center fw-semibold"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--apple-blue)',
              borderRadius: '50%',
              color: 'white',
              fontSize: '16px'
            }}
          >
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="ms-3">
            <p 
              className="mb-1 fw-medium"
              style={{ 
                color: 'var(--apple-text-primary)',
                fontSize: '14px'
              }}
            >
              {profile?.full_name || 'Usuario'}
            </p>
            <p 
              className="mb-0 text-capitalize"
              style={{ 
                color: 'var(--apple-text-secondary)',
                fontSize: '12px'
              }}
            >
              {profile?.role || 'viewer'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-fill py-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-decoration-none ${
                isActive ? 'active' : ''
              }`
            }
          >
            <item.icon size={18} />
            <span style={{ fontSize: '15px' }}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4" style={{ borderTop: '1px solid var(--apple-gray-2)' }}>
        <button
          onClick={handleSignOut}
          className="btn w-100 d-flex align-items-center justify-content-start p-3 border-0 bg-transparent"
          style={{
            color: 'var(--apple-text-secondary)',
            borderRadius: 'var(--apple-radius-md)',
            fontSize: '15px',
            fontWeight: '500'
          }}
        >
          <LogOut size={18} className="me-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
