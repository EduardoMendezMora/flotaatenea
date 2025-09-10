import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Car, Users, FileText, AlertTriangle, DollarSign, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['var(--apple-blue)', 'var(--apple-green)', 'var(--apple-orange)', 'var(--apple-red)', '#8B5CF6']

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [vehiclesRes, clientsRes, contractsRes, paymentsRes] = await Promise.all([
        supabase.from('vehicles').select('status'),
        supabase.from('clients').select('id'),
        supabase.from('contracts').select('status, monthly_payment'),
        supabase.from('payments').select('status, amount, due_date')
      ])

      const vehicles = vehiclesRes.data || []
      const clients = clientsRes.data || []
      const contracts = contractsRes.data || []
      const payments = paymentsRes.data || []

      // Vehicle status distribution
      const vehicleStats = vehicles.reduce((acc, vehicle) => {
        acc[vehicle.status] = (acc[vehicle.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Contract status distribution
      const contractStats = contracts.reduce((acc, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Payment stats
      const overduePayments = payments.filter(p => 
        p.status === 'overdue' || 
        (p.status === 'pending' && new Date(p.due_date) < new Date())
      ).length

      const monthlyRevenue = contracts
        .filter(c => c.status === 'active')
        .reduce((sum, c) => sum + (c.monthly_payment || 0), 0)

      return {
        totalVehicles: vehicles.length,
        totalClients: clients.length,
        totalContracts: contracts.length,
        activeContracts: contractStats.active || 0,
        overduePayments,
        monthlyRevenue,
        vehicleStats,
        contractStats
      }
    }
  })

  // Recent activity
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      return data || []
    }
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

  const vehicleChartData = Object.entries(stats?.vehicleStats || {}).map(([status, count]) => ({
    name: status === 'available' ? 'Disponible' : 
          status === 'leased' ? 'Arrendado' :
          status === 'maintenance' ? 'Mantenimiento' :
          status === 'sold' ? 'Vendido' : 'Retirado',
    value: count
  }))

  const monthlyData = [
    { month: 'Ene', revenue: 125000, contracts: 15 },
    { month: 'Feb', revenue: 142000, contracts: 18 },
    { month: 'Mar', revenue: 138000, contracts: 17 },
    { month: 'Abr', revenue: 156000, contracts: 20 },
    { month: 'May', revenue: stats?.monthlyRevenue || 0, contracts: stats?.activeContracts || 0 },
  ]

  return (
    <div className="row g-4">
      {/* Header */}
      <div className="col-12">
        <div className="mb-4">
          <h1 className="h2 fw-bold mb-2" style={{ color: 'var(--apple-text-primary)', letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p className="mb-0" style={{ color: 'var(--apple-text-secondary)', fontSize: '16px' }}>Resumen general de la flota de vehículos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="col-12">
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card-apple">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}>
                  <Car size={24} style={{ color: 'var(--apple-blue)' }} />
                </div>
                <div className="ms-4">
                  <p className="stat-label mb-1">Total Vehículos</p>
                  <p className="stat-value mb-0">{stats?.totalVehicles || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card-apple">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}>
                  <Users size={24} style={{ color: 'var(--apple-green)' }} />
                </div>
                <div className="ms-4">
                  <p className="stat-label mb-1">Total Clientes</p>
                  <p className="stat-value mb-0">{stats?.totalClients || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card-apple">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}>
                  <FileText size={24} style={{ color: 'var(--apple-orange)' }} />
                </div>
                <div className="ms-4">
                  <p className="stat-label mb-1">Contratos Activos</p>
                  <p className="stat-value mb-0">{stats?.activeContracts || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card-apple">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}>
                  <AlertTriangle size={24} style={{ color: 'var(--apple-red)' }} />
                </div>
                <div className="ms-4">
                  <p className="stat-label mb-1">Pagos Vencidos</p>
                  <p className="stat-value mb-0">{stats?.overduePayments || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="col-12">
        <div className="row g-4">
          {/* Revenue Chart */}
          <div className="col-12 col-lg-6">
            <div className="apple-card">
              <div className="apple-card-header">
                <h3 className="apple-card-title">Ingresos Mensuales</h3>
              </div>
              <div className="apple-card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--apple-gray-3)" />
                    <XAxis dataKey="month" stroke="var(--apple-text-secondary)" fontSize={12} />
                    <YAxis stroke="var(--apple-text-secondary)" fontSize={12} />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                      contentStyle={{
                        backgroundColor: 'var(--apple-background)',
                        border: '1px solid var(--apple-gray-3)',
                        borderRadius: 'var(--apple-radius-md)',
                        boxShadow: 'var(--apple-shadow-md)'
                      }}
                    />
                    <Bar dataKey="revenue" fill="var(--apple-blue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Vehicle Status Chart */}
          <div className="col-12 col-lg-6">
            <div className="apple-card">
              <div className="apple-card-header">
                <h3 className="apple-card-title">Estado de Vehículos</h3>
              </div>
              <div className="apple-card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vehicleChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--apple-background)',
                        border: '1px solid var(--apple-gray-3)',
                        borderRadius: 'var(--apple-radius-md)',
                        boxShadow: 'var(--apple-shadow-md)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="col-12">
        <div className="row g-4">
          {/* Recent Activity */}
          <div className="col-12 col-lg-6">
            <div className="apple-card">
              <div className="apple-card-header">
                <h3 className="apple-card-title">Actividad Reciente</h3>
              </div>
              <div className="apple-card-body">
                <div className="d-flex flex-column gap-3">
                  {recentActivity?.map((notification) => (
                    <div key={notification.id} className="d-flex align-items-start gap-3">
                      <div 
                        className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', minWidth: '32px', height: '32px' }}
                      >
                        <Calendar size={16} style={{ color: 'var(--apple-blue)' }} />
                      </div>
                      <div className="flex-fill">
                        <p className="fw-medium mb-1" style={{ color: 'var(--apple-text-primary)', fontSize: '14px' }}>
                          {notification.title}
                        </p>
                        <p className="mb-1" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px' }}>
                          {notification.message}
                        </p>
                        <p className="mb-0" style={{ color: 'var(--apple-text-tertiary)', fontSize: '12px' }}>
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!recentActivity || recentActivity.length === 0) && (
                    <p className="text-center py-4" style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>
                      No hay actividad reciente
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-12 col-lg-6">
            <div className="apple-card">
              <div className="apple-card-header">
                <h3 className="apple-card-title">Resumen Financiero</h3>
              </div>
              <div className="apple-card-body">
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <DollarSign size={20} style={{ color: 'var(--apple-green)' }} className="me-3" />
                      <span style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>Ingresos Mensuales</span>
                    </div>
                    <span className="fw-semibold" style={{ color: 'var(--apple-text-primary)', fontSize: '18px' }}>
                      ${(stats?.monthlyRevenue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FileText size={20} style={{ color: 'var(--apple-blue)' }} className="me-3" />
                      <span style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>Contratos Totales</span>
                    </div>
                    <span className="fw-semibold" style={{ color: 'var(--apple-text-primary)', fontSize: '18px' }}>
                      {stats?.totalContracts || 0}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <AlertTriangle size={20} style={{ color: 'var(--apple-red)' }} className="me-3" />
                      <span style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>Pagos Pendientes</span>
                    </div>
                    <span className="fw-semibold" style={{ color: 'var(--apple-red)', fontSize: '18px' }}>
                      {stats?.overduePayments || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
