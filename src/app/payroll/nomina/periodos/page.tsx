'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { Calendar, Download, Search, Eye, Plus, DollarSign, Users, Clock, CircleCheck as CheckCircle } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface WeeklyPeriod {
  id: string
  weekNumber: number
  startDate: string
  endDate: string
  totalEmployees: number
  totalHours: number
  regularHours: number
  overtimeHours: number
  grossPay: number
  netPay: number
  status: 'Active' | 'Closed' | 'Processing'
  cutoffDate: string
  payDate: string
}

export default function PeriodosSemanalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [periods, setPeriods] = useState<WeeklyPeriod[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchWeeklyPeriods()
  }, [session, status, router])

  const fetchWeeklyPeriods = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockPeriods: WeeklyPeriod[] = [
        {
          id: 'WP-001',
          weekNumber: 38,
          startDate: '2024-09-16',
          endDate: '2024-09-22',
          totalEmployees: 120,
          totalHours: 5760,
          regularHours: 4800,
          overtimeHours: 960,
          grossPay: 180000,
          netPay: 144000,
          status: 'Closed',
          cutoffDate: '2024-09-23',
          payDate: '2024-09-25'
        },
        {
          id: 'WP-002',
          weekNumber: 39,
          startDate: '2024-09-23',
          endDate: '2024-09-29',
          totalEmployees: 122,
          totalHours: 5856,
          regularHours: 4880,
          overtimeHours: 976,
          grossPay: 183000,
          netPay: 146400,
          status: 'Processing',
          cutoffDate: '2024-09-30',
          payDate: '2024-10-02'
        },
        {
          id: 'WP-003',
          weekNumber: 40,
          startDate: '2024-09-30',
          endDate: '2024-10-06',
          totalEmployees: 125,
          totalHours: 6000,
          regularHours: 5000,
          overtimeHours: 1000,
          grossPay: 187500,
          netPay: 150000,
          status: 'Active',
          cutoffDate: '2024-10-07',
          payDate: '2024-10-09'
        }
      ]
      
      setPeriods(mockPeriods)
    } catch (error) {
      console.error('Error fetching weekly periods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPeriod = (periodId: string) => {
    alert(`Exporting period ${periodId}...`)
  }

  const filteredPeriods = periods.filter(period => {
    const matchesSearch = period.weekNumber.toString().includes(searchTerm) ||
                          period.startDate.includes(searchTerm) ||
                          period.endDate.includes(searchTerm)
    const matchesStatus = !selectedStatus || period.status === selectedStatus
    return matchesSearch && matchesStatus
  })

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
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Periodos Semanal
            </h1>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" /> New Period
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Periods</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {periods.filter(p => p.status === 'Active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {periods.length > 0 ? Math.max(...periods.map(p => p.totalEmployees)) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {periods.reduce((sum, p) => sum + p.totalHours, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${periods.reduce((sum, p) => sum + p.grossPay, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by week number or date..." 
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
                <option value="Active">Active</option>
                <option value="Processing">Processing</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Periods Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeriods.map(period => (
                  <tr key={period.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">Week {period.weekNumber}</div>
                      <div className="text-sm text-gray-500">Pay Date: {period.payDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{period.startDate}</div>
                      <div className="text-sm text-gray-500">to {period.endDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{period.totalEmployees}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{period.totalHours.toLocaleString()} total</div>
                      <div className="text-sm text-gray-500">
                        Regular: {period.regularHours.toLocaleString()} | OT: {period.overtimeHours.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${period.grossPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        period.status === 'Active' ? 'bg-green-100 text-green-800' :
                        period.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {period.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleExportPeriod(period.id)}
                          className="text-green-600 hover:text-green-900"
                        >
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