'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { Circle as XCircle, Search, Eye, Download, TriangleAlert as AlertTriangle, Users, Calendar, DollarSign, TrendingDown } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface AbsenceSummary {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  position: string
  totalAbsences: number
  excusedAbsences: number
  unexcusedAbsences: number
  absenceRate: number
  payDeduction: number
  lastAbsenceDate: string
  absencePattern: string
  status: 'Normal' | 'Warning' | 'Critical'
  disciplinaryAction: string
}

export default function ResumenFaltasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [absences, setAbsences] = useState<AbsenceSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchAbsenceSummary()
  }, [session, status, router])

  const fetchAbsenceSummary = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockAbsences: AbsenceSummary[] = [
        {
          id: 'AS-001',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          totalAbsences: 3,
          excusedAbsences: 1,
          unexcusedAbsences: 2,
          absenceRate: 11.5,
          payDeduction: 555.00,
          lastAbsenceDate: '2024-09-20',
          absencePattern: 'Monday pattern detected',
          status: 'Warning',
          disciplinaryAction: 'Verbal warning issued'
        },
        {
          id: 'AS-002',
          employeeCode: 'WC002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          position: 'HR Manager',
          totalAbsences: 1,
          excusedAbsences: 1,
          unexcusedAbsences: 0,
          absenceRate: 4.2,
          payDeduction: 0,
          lastAbsenceDate: '2024-09-15',
          absencePattern: 'No pattern',
          status: 'Normal',
          disciplinaryAction: 'None'
        },
        {
          id: 'AS-003',
          employeeCode: 'BC003',
          employeeName: 'Jose Martinez',
          department: 'Maintenance',
          position: 'Maintenance Technician',
          totalAbsences: 6,
          excusedAbsences: 2,
          unexcusedAbsences: 4,
          absenceRate: 23.1,
          payDeduction: 1320.00,
          lastAbsenceDate: '2024-09-24',
          absencePattern: 'Friday pattern detected',
          status: 'Critical',
          disciplinaryAction: 'Written warning - final notice'
        }
      ]
      
      setAbsences(mockAbsences)
    } catch (error) {
      console.error('Error fetching absence summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAbsences = absences.filter(absence => {
    const matchesSearch = absence.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          absence.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || absence.department === selectedDepartment
    const matchesStatus = !selectedStatus || absence.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(absences.map(a => a.department)))
  const criticalCount = absences.filter(a => a.status === 'Critical').length
  const warningCount = absences.filter(a => a.status === 'Warning').length
  const totalDeductions = absences.reduce((sum, a) => sum + a.payDeduction, 0)

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
              <XCircle className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Faltas
            </h1>
            <p className="text-gray-600 mt-2">Employee absence tracking and disciplinary management</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Warning Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Absences</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {absences.reduce((sum, a) => sum + a.totalAbsences, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pay Deductions</p>
                  <p className="text-2xl font-bold text-gray-900">${totalDeductions.toLocaleString()}</p>
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
                <option value="Normal">Normal</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Absence Summary Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absences</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAbsences.map(absence => (
                  <tr key={absence.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{absence.employeeName}</div>
                      <div className="text-sm text-gray-500">{absence.employeeCode}</div>
                      <div className="text-sm text-gray-500">{absence.department} - {absence.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Total: {absence.totalAbsences}</div>
                      <div className="text-sm text-green-600">Excused: {absence.excusedAbsences}</div>
                      <div className="text-sm text-red-600">Unexcused: {absence.unexcusedAbsences}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${
                        absence.absenceRate > 15 ? 'text-red-600' :
                        absence.absenceRate > 8 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {absence.absenceRate.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-red-600">-${absence.payDeduction.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Last: {absence.lastAbsenceDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{absence.absencePattern}</div>
                      <div className="text-sm text-gray-500">{absence.disciplinaryAction}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        absence.status === 'Normal' ? 'bg-green-100 text-green-800' :
                        absence.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {absence.status}
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