'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { Clock, Search, Eye, Download, CircleCheck as CheckCircle, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface OvertimeSummary {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  position: string
  regularHours: number
  overtimeHours: number
  doubleTimeHours: number
  holidayHours: number
  totalExtraHours: number
  overtimeRate: number
  overtimePay: number
  approvalStatus: 'Approved' | 'Pending' | 'Rejected'
  approvedBy: string
  weekEnding: string
}

export default function ResumenHorasExtraPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [overtime, setOvertime] = useState<OvertimeSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchOvertimeSummary()
  }, [session, status, router])

  const fetchOvertimeSummary = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockOvertime: OvertimeSummary[] = [
        {
          id: 'OS-001',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          regularHours: 40,
          overtimeHours: 8,
          doubleTimeHours: 0,
          holidayHours: 0,
          totalExtraHours: 8,
          overtimeRate: 27.75,
          overtimePay: 222.00,
          approvalStatus: 'Approved',
          approvedBy: 'Production Manager',
          weekEnding: '2024-09-22'
        },
        {
          id: 'OS-002',
          employeeCode: 'WC001',
          employeeName: 'John Smith',
          department: 'Engineering',
          position: 'Senior Engineer',
          regularHours: 80,
          overtimeHours: 8,
          doubleTimeHours: 0,
          holidayHours: 0,
          totalExtraHours: 8,
          overtimeRate: 72.12,
          overtimePay: 576.96,
          approvalStatus: 'Approved',
          approvedBy: 'Engineering Manager',
          weekEnding: '2024-09-15'
        },
        {
          id: 'OS-003',
          employeeCode: 'BC003',
          employeeName: 'Jose Martinez',
          department: 'Maintenance',
          position: 'Maintenance Technician',
          regularHours: 40,
          overtimeHours: 12,
          doubleTimeHours: 4,
          holidayHours: 0,
          totalExtraHours: 16,
          overtimeRate: 33.00,
          overtimePay: 528.00,
          approvalStatus: 'Pending',
          approvedBy: '',
          weekEnding: '2024-09-22'
        }
      ]
      
      setOvertime(mockOvertime)
    } catch (error) {
      console.error('Error fetching overtime summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveOvertime = (overtimeId: string) => {
    setOvertime(prev => prev.map(ot => 
      ot.id === overtimeId ? { 
        ...ot, 
        approvalStatus: 'Approved' as const,
        approvedBy: session?.user?.name || 'Current User'
      } : ot
    ))
    alert('Overtime approved successfully!')
  }

  const filteredOvertime = overtime.filter(ot => {
    const matchesSearch = ot.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ot.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || ot.department === selectedDepartment
    const matchesStatus = !selectedStatus || ot.approvalStatus === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(overtime.map(o => o.department)))
  const totalOvertimeHours = overtime.reduce((sum, o) => sum + o.totalExtraHours, 0)
  const totalOvertimePay = overtime.reduce((sum, o) => sum + o.overtimePay, 0)
  const pendingApproval = overtime.filter(o => o.approvalStatus === 'Pending').length

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
              <Clock className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Horas Extra
            </h1>
            <p className="text-gray-600 mt-2">Overtime hours tracking and approval management</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total OT Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOvertimeHours}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total OT Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalOvertimePay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingApproval}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employees with OT</p>
                  <p className="text-2xl font-bold text-gray-900">{overtime.length}</p>
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
              <label className="block text-sm font-medium mb-2">Approval Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Overtime Summary Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Ending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Breakdown</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOvertime.map(ot => (
                  <tr key={ot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ot.employeeName}</div>
                      <div className="text-sm text-gray-500">{ot.employeeCode}</div>
                      <div className="text-sm text-gray-500">{ot.department} - {ot.position}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ot.weekEnding}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Regular: {ot.regularHours}h</div>
                      <div className="text-sm text-blue-600">Overtime: {ot.overtimeHours}h</div>
                      {ot.doubleTimeHours > 0 && (
                        <div className="text-sm text-purple-600">Double: {ot.doubleTimeHours}h</div>
                      )}
                      {ot.holidayHours > 0 && (
                        <div className="text-sm text-orange-600">Holiday: {ot.holidayHours}h</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${ot.overtimeRate}/hr</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${ot.overtimePay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ot.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          ot.approvalStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ot.approvalStatus}
                        </span>
                        {ot.approvedBy && (
                          <div className="text-xs text-gray-500 mt-1">By: {ot.approvedBy}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {ot.approvalStatus === 'Pending' && (
                          <button 
                            onClick={() => handleApproveOvertime(ot.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
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