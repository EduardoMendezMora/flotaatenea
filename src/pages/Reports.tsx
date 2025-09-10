import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Download, TrendingUp, DollarSign, Car, Users, FileText } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function Reports() {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const [vehiclesRes, clientsRes, contractsRes, paymentsRes, maintenanceRes] = await Promise.all([
        supabase.from('vehicles').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('contracts').select('*, clients(*), vehicles(*)'),
        supabase.from('payments').select('*'),
        supabase.from('maintenance').select('*, vehicles(*)')
      ])

      const vehicles = vehiclesRes.data || []
      const clients = clientsRes.data || []
      const contracts = contractsRes.data || []
      const payments = paymentsRes.data || []
      const maintenance = maintenanceRes.data || []

      // Vehicle utilization
      const vehicleUtilization = vehicles.reduce((acc, vehicle) => {
        acc[vehicle.status] = (acc[vehicle.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Monthly revenue trend (last 6 months)
      const monthlyRevenue = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleDateString('es-ES', { month: 'short' })
        
        const monthlyPayments = payments.filter(p => {
          const paymentDate = new Date(p.payment_date || p.due_date)
          return paymentDate.getMonth() === date.getMonth() && 
                 paymentDate.getFullYear() === date.getFullYear() &&
                 p.status === 'paid'
        })
        
        monthlyRevenue.push({
          month: monthName,
          revenue: monthlyPayments.reduce((sum, p) => sum + p.amount, 0),
          payments: monthlyPayments.length
        })
      }

      // Client distribution
      const clientDistribution = clients.reduce((acc, client) => {
        acc[client.client_type] = (acc[client.client_type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Maintenance costs by type
      const maintenanceCosts = maintenance.reduce((acc, m) => {
        if (m.cost && m.status === 'completed') {
          acc[m.maintenance_type] = (acc[m.maintenance_type] || 0) + m.cost
        }
        return acc
      }, {} as Record<string, number>)

      return {
        vehicleUtilization,
        monthlyRevenue,
        clientDistribution,
        maintenanceCosts,
        totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
        activeContracts: contracts.filter(c => c.status === 'active').length,
        totalVehicles: vehicles.length,
        totalClients: clients.length
      }
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const vehicleChartData = Object.entries(reportData?.vehicleUtilization || {}).map(([status, count]) => ({
    name: status === 'available' ? 'Disponible' : 
          status === 'leased' ? 'Arrendado' :
          status === 'maintenance' ? 'Mantenimiento' :
          status === 'sold' ? 'Vendido' : 'Retirado',
    value: count,
    percentage: ((count / reportData?.totalVehicles) * 100).toFixed(1)
  }))

  const clientChartData = Object.entries(reportData?.clientDistribution || {}).map(([type, count]) => ({
    name: type === 'individual' ? 'Personas Físicas' : 'Empresas',
    value: count
  }))

  const maintenanceChartData = Object.entries(reportData?.maintenanceCosts || {}).map(([type, cost]) => ({
    type,
    cost
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de la flota</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Exportar Reportes</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                ${reportData?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilización de Flota</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData?.vehicleUtilization?.leased && reportData?.totalVehicles 
                  ? Math.round((reportData.vehicleUtilization.leased / reportData.totalVehicles) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData?.activeContracts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Base de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData?.totalClients || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Tendencia de Ingresos (6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Utilization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilización de Vehículos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Costs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Costos de Mantenimiento por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Costo']} />
              <Bar dataKey="cost" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Client Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Clientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clientChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {reportData?.totalVehicles || 0}
            </div>
            <div className="text-sm text-gray-600">Total de Vehículos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {reportData?.vehicleUtilization?.leased || 0}
            </div>
            <div className="text-sm text-gray-600">Vehículos Arrendados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {reportData?.activeContracts || 0}
            </div>
            <div className="text-sm text-gray-600">Contratos Activos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {reportData?.totalClients || 0}
            </div>
            <div className="text-sm text-gray-600">Clientes Registrados</div>
          </div>
        </div>
      </div>
    </div>
  )
}
