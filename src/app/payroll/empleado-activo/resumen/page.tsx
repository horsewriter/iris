'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Users, Search, Eye, FileText, Calendar,
  DollarSign, Building, Phone, Mail, MapPin
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface EmployeeKardex {
  id: string
  employeeCode: string
  fullName: string
  position: string
  department: string
  hireDate: string
  currentSalary: number
  personalData: {
    email: string
    phone: string
    address: string
    emergencyContact: string
    birthDate: string
    nss: string
    rfc: string
    curp: string
  }
  contractInfo: {
    contractType: string
    workSchedule: string
    payrollType: string
    benefits: string[]
  }
  payrollHistory: {
    period: string
    grossPay: number
    netPay: number
    deductions: number
  }[]
  attendanceStats: {
    presentDays: number
    absentDays: number
    lateDays: number
    overtimeHours: number
    attendanceRate: number
  }
  vacationInfo: {
    accrued: number
    used: number
    remaining: number
  }
}

export default function ResumenEmpleadoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<EmployeeKardex[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeKardex | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchEmployeeKardex()
  }, [session, status, router])

  const fetchEmployeeKardex = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockEmployees: EmployeeKardex[] = [
        {
          id: 'EK-001',
          employeeCode: 'WC001',
          fullName: 'John Smith',
          position: 'Senior Engineer',
          department: 'Engineering',
          hireDate: '2020-03-15',
          currentSalary: 100000,
          personalData: {
            email: 'john.smith@company.com',
            phone: '+1-555-0123',
            address: '123 Main St, City, State 12345',
            emergencyContact: 'Jane Smith - +1-555-0124',
            birthDate: '1985-06-15',
            nss: '12345678901',
            rfc: 'SMJO850615ABC',
            curp: 'SMJO850615HDFRHN01'
          },
          contractInfo: {
            contractType: 'Permanent',
            workSchedule: 'Monday to Friday, 8:00 AM - 5:00 PM',
            payrollType: 'Bi-weekly',
            benefits: ['Health Insurance', 'Dental', 'Vision', '401k Match', 'Vacation Days']
          },
          payrollHistory: [
            { period: '2024-09-01 to 2024-09-15', grossPay: 3846.15, netPay: 2282.69, deductions: 1563.46 },
            { period: '2024-08-16 to 2024-08-31', grossPay: 3846.15, netPay: 2282.69, deductions: 1563.46 },
            { period: '2024-08-01 to 2024-08-15', grossPay: 3846.15, netPay: 2282.69, deductions: 1563.46 }
          ],
          attendanceStats: {
            presentDays: 22,
            absentDays: 2,
            lateDays: 1,
            overtimeHours: 8,
            attendanceRate: 91.7
          },
          vacationInfo: {
            accrued: 18.5,
            used: 5,
            remaining: 13.5
          }
        },
        {
          id: 'EK-002',
          employeeCode: 'BC001',
          fullName: 'Carlos Rodriguez',
          position: 'Machine Operator',
          department: 'Production',
          hireDate: '2021-03-15',
          currentSalary: 46176,
          personalData: {
            email: 'carlos.rodriguez@company.com',
            phone: '+1-555-0125',
            address: '456 Oak Ave, City, State 12345',
            emergencyContact: 'Maria Rodriguez - +1-555-0126',
            birthDate: '1990-08-20',
            nss: '23456789012',
            rfc: 'RODC900820DEF',
            curp: 'RODC900820HDFRRL02'
          },
          contractInfo: {
            contractType: 'Permanent',
            workSchedule: 'Monday to Saturday, 7:00 AM - 4:00 PM',
            payrollType: 'Weekly',
            benefits: ['Health Insurance', 'Life Insurance', 'Savings Fund']
          },
          payrollHistory: [
            { period: '2024-09-16 to 2024-09-22', grossPay: 888.00, netPay: 710.40, deductions: 177.60 },
            { period: '2024-09-09 to 2024-09-15', grossPay: 888.00, netPay: 710.40, deductions: 177.60 },
            { period: '2024-09-02 to 2024-09-08', grossPay: 888.00, netPay: 710.40, deductions: 177.60 }
          ],
          attendanceStats: {
            presentDays: 24,
            absentDays: 1,
            lateDays: 2,
            overtimeHours: 16,
            attendanceRate: 96.0
          },
          vacationInfo: {
            accrued: 12,
            used: 4,
            remaining: 8
          }
        }
      ]
      
      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error fetching employee kardex:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || emp.department === selectedDepartment
    return matchesSearch && matchesDept
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
              <Users className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Empleado
            </h1>
            <p className="text-gray-600 mt-2">Employee kardex with personal data, contract info, and payroll history</p>
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
          </div>

          {/* Employee Selection Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{emp.fullName}</div>
                      <div className="text-sm text-gray-500">{emp.employeeCode}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.hireDate}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${emp.currentSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button 
                        onClick={() => setSelectedEmployee(emp)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Employee Details */}
          {selectedEmployee && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Emergency Contact</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.emergencyContact}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-gray-900">NSS</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.nss}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">RFC</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.rfc}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-900">CURP</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.personalData.curp}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract & Payroll Info */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Contract & Payroll</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contract Type</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contractInfo.contractType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Work Schedule</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contractInfo.workSchedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payroll Type</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contractInfo.payrollType}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-900 mb-2">Benefits</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.contractInfo.benefits.map((benefit, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Attendance Statistics</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedEmployee.attendanceStats.presentDays}</div>
                      <div className="text-sm text-green-700">Present Days</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{selectedEmployee.attendanceStats.absentDays}</div>
                      <div className="text-sm text-red-700">Absent Days</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedEmployee.attendanceStats.lateDays}</div>
                      <div className="text-sm text-yellow-700">Late Days</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedEmployee.attendanceStats.attendanceRate.toFixed(1)}%</div>
                      <div className="text-sm text-blue-700">Attendance Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Payroll History */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Payroll History</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedEmployee.payrollHistory.map((pay, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pay.period}</p>
                          <p className="text-sm text-gray-500">Net: ${pay.netPay.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${pay.grossPay.toLocaleString()}</p>
                          <p className="text-sm text-red-600">-${pay.deductions.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}