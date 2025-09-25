'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Users, Search, Eye, Calculator, Download,
  DollarSign, Clock, Calendar, Building
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface EmployeePrePayroll {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  position: string
  payrollType: 'Weekly' | 'Bi-weekly'
  regularHours: number
  overtimeHours: number
  totalHours: number
  hourlyRate: number
  regularPay: number
  overtimePay: number
  bonuses: number
  grossPay: number
  deductions: number
  netPay: number
  attendanceDays: number
  absentDays: number
  vacationDays: number
  status: 'Draft' | 'Review' | 'Approved'
}

export default function PrenominaPorEmpleadoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<EmployeePrePayroll[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedPayrollType, setSelectedPayrollType] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchEmployeePrePayroll()
  }, [session, status, router])

  const fetchEmployeePrePayroll = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockEmployees: EmployeePrePayroll[] = [
        {
          id: 'EPP-001',
          employeeCode: 'WC001',
          employeeName: 'John Smith',
          department: 'Engineering',
          position: 'Senior Engineer',
          payrollType: 'Bi-weekly',
          regularHours: 80,
          overtimeHours: 8,
          totalHours: 88,
          hourlyRate: 48.08,
          regularPay: 3846.15,
          overtimePay: 576.92,
          bonuses: 500.00,
          grossPay: 4923.07,
          deductions: 1476.92,
          netPay: 3446.15,
          attendanceDays: 10,
          absentDays: 0,
          vacationDays: 0,
          status: 'Draft'
        },
        {
          id: 'EPP-002',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          payrollType: 'Weekly',
          regularHours: 40,
          overtimeHours: 8,
          totalHours: 48,
          hourlyRate: 18.50,
          regularPay: 740.00,
          overtimePay: 222.00,
          bonuses: 0,
          grossPay: 962.00,
          deductions: 192.40,
          netPay: 769.60,
          attendanceDays: 6,
          absentDays: 0,
          vacationDays: 0,
          status: 'Review'
        }
      ]
      
      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error fetching employee pre-payroll:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveEmployee = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status: 'Approved' as const } : emp
    ))
    alert('Employee pre-payroll approved!')
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || emp.department === selectedDepartment
    const matchesPayrollType = !selectedPayrollType || emp.payrollType === selectedPayrollType
    return matchesSearch && matchesDept && matchesPayrollType
  })

  const departments = Array.from(new Set(employees.map(e => e.department)))

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
              <Users className="h-8 w-8 mr-3 text-indigo-600" /> Prenomina por Empleado
            </h1>
            <p className="text-gray-600 mt-2">Individual employee pre-payroll calculations and review</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${employees.reduce((sum, e) => sum + e.grossPay, 0).toLocaleString()}
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
                    {employees.reduce((sum, e) => sum + e.totalHours, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {employees.filter(e => e.status === 'Draft').length}
                  </p>
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
              <label className="block text-sm font-medium mb-2">Payroll Type</label>
              <select 
                value={selectedPayrollType} 
                onChange={e => setSelectedPayrollType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
              </select>
            </div>
          </div>

          {/* Employee Pre-Payroll Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{emp.employeeName}</div>
                      <div className="text-sm text-gray-500">{emp.employeeCode}</div>
                      <div className="text-sm text-gray-500">{emp.department} - {emp.position}</div>
                      <div className="text-sm text-gray-500">{emp.payrollType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{emp.totalHours} total</div>
                      <div className="text-sm text-gray-500">
                        Regular: {emp.regularHours} | OT: {emp.overtimeHours}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${emp.regularPay.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">${emp.hourlyRate}/hr</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-green-600">${emp.overtimePay.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{emp.overtimeHours} hrs</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${emp.grossPay.toLocaleString()}</div>
                      {emp.bonuses > 0 && (
                        <div className="text-sm text-blue-600">+${emp.bonuses.toLocaleString()} bonus</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${emp.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        emp.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {emp.status === 'Review' && (
                          <button 
                            onClick={() => handleApproveEmployee(emp.id)}
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