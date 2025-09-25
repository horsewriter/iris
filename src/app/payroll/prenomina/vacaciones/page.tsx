'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Search, Eye, Download, CheckCircle,
  Users, Clock, DollarSign, TrendingUp
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface VacationSummary {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  position: string
  vacationDaysAccrued: number
  vacationDaysUsed: number
  vacationDaysRemaining: number
  vacationPayOwed: number
  lastVacationDate: string
  nextAccrualDate: string
  accrualRate: number
  status: 'Active' | 'Maxed Out' | 'Suspended'
}

export default function ResumenVacacionesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [vacations, setVacations] = useState<VacationSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchVacationSummary()
  }, [session, status, router])

  const fetchVacationSummary = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockVacations: VacationSummary[] = [
        {
          id: 'VS-001',
          employeeCode: 'WC001',
          employeeName: 'John Smith',
          department: 'Engineering',
          position: 'Senior Engineer',
          vacationDaysAccrued: 18.5,
          vacationDaysUsed: 5,
          vacationDaysRemaining: 13.5,
          vacationPayOwed: 5192.31,
          lastVacationDate: '2024-07-15',
          nextAccrualDate: '2024-10-01',
          accrualRate: 1.67,
          status: 'Active'
        },
        {
          id: 'VS-002',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          vacationDaysAccrued: 12,
          vacationDaysUsed: 4,
          vacationDaysRemaining: 8,
          vacationPayOwed: 1480.00,
          lastVacationDate: '2024-08-10',
          nextAccrualDate: '2024-10-01',
          accrualRate: 1.0,
          status: 'Active'
        },
        {
          id: 'VS-003',
          employeeCode: 'WC002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          position: 'HR Manager',
          vacationDaysAccrued: 25,
          vacationDaysUsed: 8,
          vacationDaysRemaining: 17,
          vacationPayOwed: 4903.85,
          lastVacationDate: '2024-06-20',
          nextAccrualDate: '2024-10-01',
          accrualRate: 2.0,
          status: 'Active'
        }
      ]
      
      setVacations(mockVacations)
    } catch (error) {
      console.error('Error fetching vacation summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVacations = vacations.filter(vacation => {
    const matchesSearch = vacation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vacation.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || vacation.department === selectedDepartment
    const matchesStatus = !selectedStatus || vacation.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(vacations.map(v => v.department)))
  const totalAccrued = vacations.reduce((sum, v) => sum + v.vacationDaysAccrued, 0)
  const totalUsed = vacations.reduce((sum, v) => sum + v.vacationDaysUsed, 0)
  const totalOwed = vacations.reduce((sum, v) => sum + v.vacationPayOwed, 0)

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Vacaciones
            </h1>
            <p className="text-gray-600 mt-2">Employee vacation tracking and liability management</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Accrued</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAccrued.toFixed(1)} days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Used</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsed.toFixed(1)} days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">{(totalAccrued - totalUsed).toFixed(1)} days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Liability</p>
                  <p className="text-2xl font-bold text-gray-900">${totalOwed.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium mb-2">Department</label>
              <select 
                value={selectedDepartment} 
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Maxed Out">Maxed Out</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Vacation Summary Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accrued</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Owed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Vacation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVacations.map(vacation => (
                  <tr key={vacation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{vacation.employeeName}</div>
                      <div className="text-sm text-gray-500">{vacation.employeeCode}</div>
                      <div className="text-sm text-gray-500">{vacation.department} - {vacation.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">{vacation.vacationDaysAccrued.toFixed(1)} days</div>
                      <div className="text-sm text-gray-500">{vacation.accrualRate} days/month</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">{vacation.vacationDaysUsed.toFixed(1)} days</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">{vacation.vacationDaysRemaining.toFixed(1)} days</td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">${vacation.vacationPayOwed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{vacation.lastVacationDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        vacation.status === 'Active' ? 'bg-green-100 text-green-800' :
                        vacation.status === 'Maxed Out' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vacation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
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