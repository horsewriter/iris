'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Download, Search, Plus, Edit, 
  TrendingUp, Users, Clock, CheckCircle
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface VacationAccrual {
  id: string
  employeeId: string
  employeeName: string
  department: string
  hireDate: string
  yearsOfService: number
  accrualRate: number
  totalAccrued: number
  totalUsed: number
  currentBalance: number
  pendingRequests: number
  availableBalance: number
  nextAccrualDate: string
  nextAccrualAmount: number
  maxCarryOver: number
  status: 'Active' | 'Suspended' | 'Maxed Out'
}

export default function VacationAccrualPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accruals, setAccruals] = useState<VacationAccrual[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL, Role.HR].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchVacationAccruals()
  }, [session, status, router])

  const fetchVacationAccruals = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockAccruals: VacationAccrual[] = [
        {
          id: 'VA-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          department: 'Engineering',
          hireDate: '2020-03-15',
          yearsOfService: 4.5,
          accrualRate: 1.67, // days per month
          totalAccrued: 90.0,
          totalUsed: 71.5,
          currentBalance: 18.5,
          pendingRequests: 3.0,
          availableBalance: 15.5,
          nextAccrualDate: '2024-10-01',
          nextAccrualAmount: 1.67,
          maxCarryOver: 40,
          status: 'Active'
        },
        {
          id: 'VA-002',
          employeeId: 'EMP-002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          hireDate: '2019-01-10',
          yearsOfService: 5.7,
          accrualRate: 2.0,
          totalAccrued: 136.8,
          totalUsed: 114.8,
          currentBalance: 22.0,
          pendingRequests: 0,
          availableBalance: 22.0,
          nextAccrualDate: '2024-10-01',
          nextAccrualAmount: 2.0,
          maxCarryOver: 40,
          status: 'Active'
        },
        {
          id: 'VA-003',
          employeeId: 'EMP-003',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          hireDate: '2021-03-15',
          yearsOfService: 3.5,
          accrualRate: 1.33,
          totalAccrued: 55.8,
          totalUsed: 43.8,
          currentBalance: 12.0,
          pendingRequests: 5.0,
          availableBalance: 7.0,
          nextAccrualDate: '2024-10-01',
          nextAccrualAmount: 1.33,
          maxCarryOver: 30,
          status: 'Active'
        },
        {
          id: 'VA-004',
          employeeId: 'EMP-004',
          employeeName: 'Maria Garcia',
          department: 'Quality Control',
          hireDate: '2020-01-10',
          yearsOfService: 4.7,
          accrualRate: 1.67,
          totalAccrued: 94.0,
          totalUsed: 54.0,
          currentBalance: 40.0,
          pendingRequests: 0,
          availableBalance: 40.0,
          nextAccrualDate: '2024-10-01',
          nextAccrualAmount: 1.67,
          maxCarryOver: 40,
          status: 'Maxed Out'
        },
        {
          id: 'VA-005',
          employeeId: 'EMP-005',
          employeeName: 'Jose Martinez',
          department: 'Maintenance',
          hireDate: '2022-06-01',
          yearsOfService: 2.3,
          accrualRate: 1.0,
          totalAccrued: 27.6,
          totalUsed: 15.6,
          currentBalance: 12.0,
          pendingRequests: 2.0,
          availableBalance: 10.0,
          nextAccrualDate: '2024-10-01',
          nextAccrualAmount: 1.0,
          maxCarryOver: 20,
          status: 'Active'
        }
      ]

      setAccruals(mockAccruals)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    alert('Vacation accrual data exported successfully!')
  }

  const handleAdjustAccrual = (accrualId: string) => {
    const adjustment = prompt('Enter vacation days adjustment (positive to add, negative to subtract):')
    if (adjustment && !isNaN(Number(adjustment))) {
      setAccruals(prev => prev.map(accrual => 
        accrual.id === accrualId 
          ? { 
              ...accrual, 
              currentBalance: Math.max(0, accrual.currentBalance + Number(adjustment)),
              availableBalance: Math.max(0, accrual.availableBalance + Number(adjustment))
            }
          : accrual
      ))
      alert(`Vacation balance adjusted by ${adjustment} days`)
    }
  }

  const filteredAccruals = accruals.filter(accrual => {
    const matchesSearch = accrual.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          accrual.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || accrual.department === selectedDepartment
    const matchesStatus = !selectedStatus || accrual.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(accruals.map(a => a.department)))

  const totalAccrued = filteredAccruals.reduce((sum, a) => sum + a.totalAccrued, 0)
  const totalUsed = filteredAccruals.reduce((sum, a) => sum + a.totalUsed, 0)
  const totalBalance = filteredAccruals.reduce((sum, a) => sum + a.currentBalance, 0)
  const totalPending = filteredAccruals.reduce((sum, a) => sum + a.pendingRequests, 0)

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
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Vacation Accrual
            </h1>
            <button 
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export Data
            </button>
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
                  <p className="text-sm font-medium text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBalance.toFixed(1)} days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPending.toFixed(1)} days</p>
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
                  placeholder="Search by name or ID..." 
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
                <option value="Suspended">Suspended</option>
                <option value="Maxed Out">Maxed Out</option>
              </select>
            </div>
          </div>

          {/* Vacation Accrual Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service & Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accrued</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Accrual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccruals.map(accrual => (
                  <tr key={accrual.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{accrual.employeeName}</div>
                      <div className="text-sm text-gray-500">{accrual.employeeId}</div>
                      <div className="text-sm text-gray-500">{accrual.department}</div>
                      <div className="text-sm text-gray-500">Hired: {accrual.hireDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{accrual.yearsOfService} years</div>
                      <div className="text-sm text-gray-500">{accrual.accrualRate} days/month</div>
                      <div className="text-sm text-gray-500">Max carry: {accrual.maxCarryOver}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{accrual.totalAccrued.toFixed(1)} days</td>
                    <td className="px-6 py-4 text-sm text-red-600">{accrual.totalUsed.toFixed(1)} days</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{accrual.currentBalance.toFixed(1)} days</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-green-600">{accrual.availableBalance.toFixed(1)} days</div>
                      {accrual.pendingRequests > 0 && (
                        <div className="text-sm text-yellow-600">Pending: {accrual.pendingRequests.toFixed(1)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{accrual.nextAccrualDate}</div>
                      <div className="text-sm text-gray-500">+{accrual.nextAccrualAmount.toFixed(2)} days</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        accrual.status === 'Active' ? 'bg-green-100 text-green-800' :
                        accrual.status === 'Maxed Out' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {accrual.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAdjustAccrual(accrual.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Adjust Balance"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Add Manual Accrual">
                          <Plus className="h-4 w-4" />
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
