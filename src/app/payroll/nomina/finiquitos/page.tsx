'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calculator, Download, Search, Eye, Plus,
  DollarSign, Calendar, Users, AlertTriangle
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface SeveranceSimulation {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  department: string
  position: string
  hireDate: string
  terminationDate: string
  yearsOfService: number
  dailySalary: number
  lastSalary: number
  severancePay: number
  vacationPay: number
  christmasBonus: number
  salarySavings: number
  totalAmount: number
  reason: string
  status: 'Draft' | 'Calculated' | 'Approved' | 'Paid'
}

export default function SimulacionFiniquitosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [simulations, setSimulations] = useState<SeveranceSimulation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchSeveranceSimulations()
  }, [session, status, router])

  const fetchSeveranceSimulations = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockSimulations: SeveranceSimulation[] = [
        {
          id: 'SS-001',
          employeeId: 'EMP-001',
          employeeName: 'Carlos Rodriguez',
          employeeCode: 'BC001',
          department: 'Production',
          position: 'Machine Operator',
          hireDate: '2021-03-15',
          terminationDate: '2024-10-15',
          yearsOfService: 3.6,
          dailySalary: 185.00,
          lastSalary: 46176,
          severancePay: 19980.00,
          vacationPay: 2220.00,
          christmasBonus: 3848.00,
          salarySavings: 1540.00,
          totalAmount: 27588.00,
          reason: 'Voluntary resignation',
          status: 'Draft'
        },
        {
          id: 'SS-002',
          employeeId: 'EMP-002',
          employeeName: 'Maria Garcia',
          employeeCode: 'WC002',
          department: 'Quality Control',
          position: 'QC Inspector',
          hireDate: '2020-01-10',
          terminationDate: '2024-09-30',
          yearsOfService: 4.7,
          dailySalary: 200.00,
          lastSalary: 49920,
          severancePay: 23460.00,
          vacationPay: 3600.00,
          christmasBonus: 4160.00,
          salarySavings: 2080.00,
          totalAmount: 33300.00,
          reason: 'Company restructuring',
          status: 'Calculated'
        }
      ]
      
      setSimulations(mockSimulations)
    } catch (error) {
      console.error('Error fetching severance simulations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateSeverance = (simulationId: string) => {
    setSimulations(prev => prev.map(sim => 
      sim.id === simulationId ? { ...sim, status: 'Calculated' as const } : sim
    ))
    alert('Severance calculation completed!')
  }

  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch = sim.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sim.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || sim.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalSeveranceAmount = filteredSimulations.reduce((sum, s) => sum + s.totalAmount, 0)
  const draftCount = filteredSimulations.filter(s => s.status === 'Draft').length
  const calculatedCount = filteredSimulations.filter(s => s.status === 'Calculated').length

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <PayrollSidebar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <Calculator className="h-8 w-8 mr-3 text-indigo-600" /> Simulacion de Finiquitos
            </h1>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" /> New Simulation
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Severance</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSeveranceAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft Simulations</p>
                  <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Calculated</p>
                  <p className="text-2xl font-bold text-gray-900">{calculatedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Simulations</p>
                  <p className="text-2xl font-bold text-gray-900">{simulations.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Employee</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name or code..." 
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Calculated">Calculated</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Severance Simulations Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severance Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSimulations.map(sim => (
                  <tr key={sim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{sim.employeeName}</div>
                      <div className="text-sm text-gray-500">{sim.employeeCode}</div>
                      <div className="text-sm text-gray-500">{sim.department} - {sim.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{sim.yearsOfService.toFixed(1)} years</div>
                      <div className="text-sm text-gray-500">
                        {sim.hireDate} to {sim.terminationDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${sim.severancePay.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Daily: ${sim.dailySalary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Vacation: ${sim.vacationPay.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Bonus: ${sim.christmasBonus.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Savings: ${sim.salarySavings.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${sim.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sim.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        sim.status === 'Calculated' ? 'bg-blue-100 text-blue-800' :
                        sim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {sim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {sim.status === 'Draft' && (
                          <button 
                            onClick={() => handleCalculateSeverance(sim.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Calculator className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-purple-600 hover:text-purple-900">
                          <Download className="h-4 w-4" />
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
    </div>
  )
}