import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Filter, User, Building, Phone, Mail, Eye, Edit3, Star } from 'lucide-react'
import { Database } from '@/types/supabase'

type Client = Database['public']['Tables']['clients']['Row']

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Client[]
    }
  })

  const filteredClients = clients?.filter(client => {
    const searchFields = [
      client.first_name,
      client.last_name,
      client.business_name,
      client.email,
      client.phone,
      client.national_id,
      client.tax_id
    ].filter(Boolean).join(' ').toLowerCase()
    
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || client.client_type === typeFilter
    
    return matchesSearch && matchesType
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
            <h1 className="h2 fw-bold mb-2" style={{ color: 'var(--apple-text-primary)', letterSpacing: '-0.5px' }}>Clientes</h1>
            <p className="mb-0" style={{ color: 'var(--apple-text-secondary)', fontSize: '16px' }}>Gestiona tu base de clientes</p>
          </div>
          <button className="btn-apple-primary d-flex align-items-center gap-2">
            <Plus size={18} />
            <span>Agregar Cliente</span>
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
                    placeholder="Buscar por nombre, email, teléfono o documento..."
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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="individual">Persona Física</option>
                    <option value="business">Empresa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="col-12">
        <div className="apple-card">
          <div className="table-responsive">
            <table className="table-apple">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Score Crediticio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients?.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: client.client_type === 'individual' ? 'var(--apple-green-light)' : 'var(--apple-blue-light)'
                          }}
                        >
                          {client.client_type === 'individual' ? (
                            <User size={20} style={{ color: 'var(--apple-green)' }} />
                          ) : (
                            <Building size={20} style={{ color: 'var(--apple-blue)' }} />
                          )}
                        </div>
                        <div>
                          <div className="fw-medium" style={{ color: 'var(--apple-text-primary)', fontSize: '14px' }}>
                            {client.client_type === 'individual' 
                              ? `${client.first_name} ${client.last_name}`
                              : client.business_name
                            }
                          </div>
                          <div style={{ color: 'var(--apple-text-secondary)', fontSize: '12px' }}>
                            {client.client_type === 'individual' 
                              ? client.national_id
                              : client.tax_id
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-apple ${
                        client.client_type === 'individual' 
                          ? 'badge-apple-success' 
                          : 'badge-apple-info'
                      }`}>
                        {client.client_type === 'individual' ? 'Persona Física' : 'Empresa'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1" style={{ fontSize: '13px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <Mail size={14} style={{ color: 'var(--apple-gray-5)' }} />
                          <span style={{ color: 'var(--apple-text-secondary)' }}>{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="d-flex align-items-center gap-2">
                            <Phone size={14} style={{ color: 'var(--apple-gray-5)' }} />
                            <span style={{ color: 'var(--apple-text-secondary)' }}>{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: 'var(--apple-text-secondary)' }}>
                        {client.city && client.state && (
                          <div>{client.city}, {client.state}</div>
                        )}
                        {client.country && (
                          <div>{client.country}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      {client.credit_score ? (
                        <span className={`badge-apple ${
                          client.credit_score >= 750 ? 'badge-apple-success' :
                          client.credit_score >= 650 ? 'badge-apple-warning' :
                          'badge-apple-danger'
                        }`}>
                          {client.credit_score}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--apple-gray-4)', fontSize: '13px' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn-apple-primary-sm d-flex align-items-center gap-1">
                          <Eye size={14} />
                          <span>Ver</span>
                        </button>
                        <button className="btn-apple-secondary-sm d-flex align-items-center gap-1">
                          <Edit3 size={14} />
                          <span>Editar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredClients?.length === 0 && (
        <div className="col-12">
          <div className="apple-card">
            <div className="apple-card-body text-center py-5">
              <User size={48} style={{ color: 'var(--apple-gray-4)' }} className="mx-auto mb-3" />
              <h3 className="h5 fw-medium mb-2" style={{ color: 'var(--apple-text-primary)' }}>No hay clientes</h3>
              <p className="mb-0" style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>
                {searchTerm || typeFilter !== 'all' 
                  ? 'No se encontraron clientes con los filtros aplicados.'
                  : 'Comienza agregando tu primer cliente.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="col-12">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="apple-card h-100">
              <div className="apple-card-body d-flex align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--apple-green-light)'
                  }}
                >
                  <User size={24} style={{ color: 'var(--apple-green)' }} />
                </div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px', fontWeight: '500' }}>Personas Físicas</p>
                  <p className="mb-0 h4 fw-bold" style={{ color: 'var(--apple-text-primary)' }}>
                    {clients?.filter(c => c.client_type === 'individual').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div className="apple-card h-100">
              <div className="apple-card-body d-flex align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--apple-blue-light)'
                  }}
                >
                  <Building size={24} style={{ color: 'var(--apple-blue)' }} />
                </div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px', fontWeight: '500' }}>Empresas</p>
                  <p className="mb-0 h4 fw-bold" style={{ color: 'var(--apple-text-primary)' }}>
                    {clients?.filter(c => c.client_type === 'business').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div className="apple-card h-100">
              <div className="apple-card-body d-flex align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--apple-orange-light)'
                  }}
                >
                  <Star size={24} style={{ color: 'var(--apple-orange)' }} />
                </div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px', fontWeight: '500' }}>Score Promedio</p>
                  <p className="mb-0 h4 fw-bold" style={{ color: 'var(--apple-text-primary)' }}>
                    {clients?.length ? Math.round(
                      clients.filter(c => c.credit_score).reduce((sum, c) => sum + (c.credit_score || 0), 0) / 
                      clients.filter(c => c.credit_score).length
                    ) || 0 : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
