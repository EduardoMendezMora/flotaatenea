import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Filter, Car, MapPin, Calendar, Eye, Edit3, Fuel, Settings } from 'lucide-react'
import { Database } from '@/types/supabase'

type Vehicle = Database['public']['Tables']['vehicles']['Row']

const statusColors = {
  available: 'badge-apple-success',
  leased: 'badge-apple-info',
  maintenance: 'badge-apple-warning',
  sold: 'badge-apple-info',
  retired: 'badge-apple-danger'
}

const statusLabels = {
  available: 'Disponible',
  leased: 'Arrendado',
  maintenance: 'Mantenimiento',
  sold: 'Vendido',
  retired: 'Retirado'
}

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Vehicle[]
    }
  })

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
        <div className="spinner-border" style={{ color: 'var(--apple-blue)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="row g-4">
      {/* Header */}
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 fw-bold mb-2" style={{ color: 'var(--apple-text-primary)', letterSpacing: '-0.5px' }}>Vehículos</h1>
            <p className="mb-0" style={{ color: 'var(--apple-text-secondary)', fontSize: '16px' }}>Gestiona tu flota de vehículos</p>
          </div>
          <button className="btn-apple-primary d-flex align-items-center gap-2">
            <Plus size={18} />
            <span>Agregar Vehículo</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="col-12">
        <div className="apple-card">
          <div className="apple-card-body">
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y ps-3" style={{ pointerEvents: 'none' }}>
                    <Search size={18} style={{ color: 'var(--apple-gray-5)' }} />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por marca, modelo, placa o VIN..."
                    className="form-control-apple ps-5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center gap-2">
                  <Filter size={18} style={{ color: 'var(--apple-gray-5)' }} />
                  <select
                    className="form-control-apple"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="available">Disponible</option>
                    <option value="leased">Arrendado</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="sold">Vendido</option>
                    <option value="retired">Retirado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="col-12">
        <div className="row g-4">
          {filteredVehicles?.map((vehicle) => (
            <div key={vehicle.id} className="col-12 col-md-6 col-lg-4">
              <div className="apple-card h-100">
                {/* Vehicle Image */}
                <div 
                  className="d-flex align-items-center justify-content-center position-relative"
                  style={{ 
                    height: '200px', 
                    backgroundColor: 'var(--apple-gray-1)',
                    borderRadius: 'var(--apple-radius-lg) var(--apple-radius-lg) 0 0'
                  }}
                >
                  <Car size={64} style={{ color: 'var(--apple-gray-4)' }} />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className={`badge-apple ${statusColors[vehicle.status]}`}>
                      {statusLabels[vehicle.status]}
                    </span>
                  </div>
                </div>
                
                {/* Vehicle Info */}
                <div className="apple-card-body">
                  <div className="mb-3">
                    <h3 className="h5 fw-bold mb-1" style={{ color: 'var(--apple-text-primary)' }}>
                      ({vehicle.license_plate || 'N/A'}) {vehicle.make} {vehicle.model} {vehicle.year} - {vehicle.fuel_type || 'Gasolina'}
                    </h3>
                  </div>
                  
                  <div className="row g-2 mb-3" style={{ fontSize: '13px' }}>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Motor:</strong>
                        <span style={{ color: 'var(--apple-text-secondary)' }}>{(vehicle as any).engine_displacement || 'N/A'} cc</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Combustible:</strong>
                        <span style={{ color: 'var(--apple-text-secondary)' }}>{vehicle.fuel_type || 'Gasolina'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Transmisión:</strong>
                        <span style={{ color: 'var(--apple-text-secondary)' }}>{vehicle.transmission || 'Manual'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Tracción:</strong>
                        <span style={{ color: 'var(--apple-text-secondary)' }}>{(vehicle as any).drivetrain || '4X2'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Color:</strong>
                        <span style={{ color: 'var(--apple-text-secondary)' }}>{vehicle.color || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Plazo:</strong>
                        <span style={{ color: 'var(--apple-text-secondary)' }}>{(vehicle as any).lease_term_weeks || 'N/A'} semanas</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Cuota semanal:</strong>
                        <span style={{ color: 'var(--apple-green)', fontWeight: '600' }}>₡{(vehicle as any).weekly_price?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: 'var(--apple-text-primary)' }}>Gastos administrativos:</strong>
                        <span style={{ color: 'var(--apple-blue)', fontWeight: '600' }}>₡{(vehicle as any).administrative_costs?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="d-flex gap-2">
                    <button className="btn-apple-primary flex-fill d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '14px', padding: '8px 12px' }}>
                      <Eye size={16} />
                      <span>Ver</span>
                    </button>
                    <button className="btn-apple-secondary flex-fill d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '14px', padding: '8px 12px' }}>
                      <Edit3 size={16} />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredVehicles?.length === 0 && (
        <div className="col-12">
          <div className="apple-card">
            <div className="apple-card-body text-center py-5">
              <Car size={48} style={{ color: 'var(--apple-gray-4)' }} className="mx-auto mb-3" />
              <h3 className="h5 fw-medium mb-2" style={{ color: 'var(--apple-text-primary)' }}>No hay vehículos</h3>
              <p className="mb-0" style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'No se encontraron vehículos con los filtros aplicados.'
                  : 'Comienza agregando tu primer vehículo a la flota.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="col-12">
        <div className="apple-card">
          <div className="apple-card-header">
            <h3 className="apple-card-title">Resumen de Flota</h3>
          </div>
          <div className="apple-card-body">
            <div className="row g-4">
              {Object.entries(statusLabels).map(([status, label]) => {
                const count = vehicles?.filter(v => v.status === status).length || 0
                return (
                  <div key={status} className="col-6 col-md-2">
                    <div className="text-center">
                      <div 
                        className={`stat-card-apple d-flex align-items-center justify-content-center mx-auto mb-2`}
                        style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                      >
                        <span className="stat-value" style={{ fontSize: '24px' }}>{count}</span>
                      </div>
                      <p className="mb-0" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px' }}>{label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
