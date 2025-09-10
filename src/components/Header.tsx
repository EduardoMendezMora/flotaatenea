import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { profile } = useAuth()

  return (
    <header className="navbar-apple sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between px-4 py-3">
        <div className="d-flex align-items-center flex-grow-1">
          <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="position-absolute top-50 start-0 translate-middle-y ps-3" style={{ pointerEvents: 'none' }}>
              <Search size={18} style={{ color: 'var(--apple-gray-5)' }} />
            </div>
            <input
              type="search"
              className="form-control-apple ps-5"
              placeholder="Buscar vehículos, clientes, contratos..."
              style={{ 
                paddingLeft: '2.5rem',
                fontSize: '15px',
                height: '40px'
              }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <button 
            className="btn p-2 position-relative border-0 bg-transparent"
            style={{ 
              color: 'var(--apple-gray-5)',
              borderRadius: 'var(--apple-radius-md)'
            }}
          >
            <Bell size={20} />
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{ 
                backgroundColor: 'var(--apple-red)',
                width: '8px',
                height: '8px',
                padding: '0',
                border: '2px solid white'
              }}
            ></span>
          </button>

          {/* User info */}
          <div className="d-flex align-items-center">
            <span 
              className="fw-medium"
              style={{ 
                color: 'var(--apple-text-primary)',
                fontSize: '15px'
              }}
            >
              Bienvenido, {profile?.full_name?.split(' ')[0] || 'Usuario'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
