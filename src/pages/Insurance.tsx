import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Filter, Shield, Calendar, DollarSign, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/supabase'

type Insurance = Database['public']['Tables']['insurance']['Row'] & {
  vehicles: Database['public']['Tables']['vehicles']['Row']
}

export default function Insurance() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: insuranceRecords, isLoading } = useQuery({
    queryKey: ['insurance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance')
        .select(`
          *,
          vehicles (*)
        `)
        .order('end_date', { ascending: true })
      
      if (error) throw error
      return data as Insurance[]
    }
  })

  const filteredInsurance = insuranceRecords?.filter(insurance => {
    const searchFields = [
      insurance.policy_number,
      insurance.insurance_company,
      insurance.vehicles.make,
      insurance.vehicles.model,
      insurance.vehicles.license_plate || '',
      insurance.policy_type
    ].join(' ').toLowerCase()
    
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    
    const isExpired = new Date(insurance.end_date) < new Date()
    const isExpiringSoon = new Date(insurance.end_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    let matchesStatus = true
    if (statusFilter === 'active') matchesStatus = !!insurance.is_active && !isExpired
    else if (statusFilter === 'expired') matchesStatus = isExpired
    else if (statusFilter === 'expiring') matchesStatus = isExpiringSoon && !isExpired
    else if (statusFilter === 'inactive') matchesStatus = !insurance.is_active
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguros</h1>
          <p className="text-gray-600">Gestiona las pólizas de seguro de la flota</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Nueva Póliza</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por póliza, aseguradora, vehículo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todas las pólizas</option>
              <option value="active">Activas</option>
              <option value="expiring">Por vencer (30 días)</option>
              <option value="expired">Vencidas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insurance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Póliza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aseguradora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInsurance?.map((insurance) => {
                const vehicleInfo = `${insurance.vehicles.year} ${insurance.vehicles.make} ${insurance.vehicles.model}`
                const isExpired = new Date(insurance.end_date) < new Date()
                const isExpiringSoon = new Date(insurance.end_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                
                return (
                  <tr key={insurance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicleInfo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {insurance.vehicles.license_plate || 'Sin placa'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {insurance.policy_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {insurance.policy_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {insurance.insurance_company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(insurance.start_date).toLocaleDateString()}
                          </div>
                          <div className={`text-sm ${
                            isExpired ? 'text-red-600 font-medium' : 
                            isExpiringSoon ? 'text-yellow-600 font-medium' : 
                            'text-gray-500'
                          }`}>
                            hasta {new Date(insurance.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            ${insurance.premium_amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Cobertura: ${insurance.coverage_amount?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isExpired ? 'bg-red-100 text-red-800' :
                          isExpiringSoon ? 'bg-yellow-100 text-yellow-800' :
                          insurance.is_active ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {isExpired ? 'Vencida' :
                           isExpiringSoon ? 'Por vencer' :
                           insurance.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                        {(isExpired || isExpiringSoon) && (
                          <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Ver Detalles
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Editar
                        </button>
                        {(isExpired || isExpiringSoon) && (
                          <button className="text-green-600 hover:text-green-900">
                            Renovar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredInsurance?.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pólizas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'No se encontraron pólizas con los filtros aplicados.'
              : 'Comienza agregando la primera póliza de seguro.'
            }
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pólizas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {insuranceRecords?.filter(i => i.is_active && new Date(i.end_date) >= new Date()).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Por Vencer (30 días)</p>
              <p className="text-2xl font-bold text-gray-900">
                {insuranceRecords?.filter(i => {
                  const endDate = new Date(i.end_date)
                  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  return endDate <= thirtyDaysFromNow && endDate >= new Date()
                }).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {insuranceRecords?.filter(i => new Date(i.end_date) < new Date()).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Primas Anuales</p>
              <p className="text-2xl font-bold text-gray-900">
                ${insuranceRecords?.filter(i => i.is_active)
                  .reduce((sum, i) => sum + i.premium_amount, 0)
                  .toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
