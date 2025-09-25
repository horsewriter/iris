'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Play, Clock, CheckCircle, AlertCircle, 
  Users, DollarSign, Calculator, FileText
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface WeeklyPayrollEmployee {
  id: string
  employeeCode: string
  name: string
  department: string
  hoursWorked: number
  hourlyRate: number
  regularPay: number
  overtimePay: number
  grossPay: number
  deductions: number
  netPay: number
  status: 'Ready' | 'Processing' | 'Completed' | 'Error'
}

export default function WeeklyPayrollProcessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<WeeklyPayrollEmployee[]>([])
  const [processing, setProcessing] = useState(false)
  const [currentWeek, setCurrentWeek] = useState('')
  const [processedCount, setProcessedCount] = useState(0)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    
    // Set current week
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    setCurrentWeek(`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`)
    
    fetchWeeklyEmployees()
  }, [session, status, router])

  const fetchWeeklyEmployees = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockEmployees: WeeklyPayrollEmployee[] = [
        {
          id: 'WP-001',
          employeeCode: 'BC001',
          name: 'Carlos Rodriguez',
          department: 'Production',
          hoursWorked: 48,
          hourlyRate: 18.5,
          regularPay: 740,
          overtimePay: 148,
          grossPay: 888,
          deductions: 177.6,
          netPay: 710.4,
          status: 'Ready'
        },
        {
          id: 'WP-002',
          employeeCode: 'BC002',
          name: 'Maria Garcia',
          department: 'Quality Control',
          hoursWorked: 45,
          hourlyRate: 20,
          regularPay: 800,
          overtimePay: 100,
          grossPay: 900,
          deductions: 180,
          netPay: 720,
          status: 'Ready'
        },
        {
          id: 'WP-003',
          employeeCode: 'BC003',
          name: 'Jose Martinez',
          department: 'Maintenance',
          hoursWorked: 50,
          hourlyRate: 22,
          regularPay: 880,
          overtimePay: 220,
          grossPay: 1100,
          deductions: 220,
          netPay: 880,
          status: 'Ready'
        },
        {
          id: 'WP-004',
          employeeCode: 'BC004',
          name: 'Ana Lopez',
          department: 'Shipping',
          hoursWorked: 42,
          hourlyRate: 17,
          regularPay: 714,
          overtimePay: 51,
          grossPay: 765,
          deductions: 153,
          netPay: 612,
          status: 'Ready'
        }
      ]

      setEmployees(mockEmployees)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const processPayroll = async () => {
    setProcessing(true)
    setProcessedCount(0)

    for (let i = 0; i < employees.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEmployees(prev => prev.map((emp, index) => 
        index === i ? { ...emp, status: 'Processing' } : emp
      ))
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setEmployees(prev => prev.map((emp, index) => 
        index === i ? { ...emp, status: 'Completed' } : emp
      ))
      
      setProcessedCount(i + 1)
    }

    setProcessing(false)
    alert('Weekly payroll processing completed successfully!')
  }

  const totalGrossPay = employees.reduce((sum, emp) => sum + emp.grossPay, 0)
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions, 0)
  const totalNetPay = employees.reduce((sum, emp) => sum + emp.netPay, 0)
  const totalHours = employees.reduce((sum, emp) => sum + emp.hoursWorked, 0)

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
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Weekly Payroll Processing
            </h1>
            <div className="text-sm text-gray-600">
              Week: {currentWeek}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Blue Collar Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Net Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Control */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payroll Processing Status</h3>
                <p className="text-sm text-gray-600">
                  {processing 
                    ? `Processing... ${processedCount}/${employees.length} completed`
                    : 'Ready to process weekly payroll for blue collar employees'
                  }
                </p>
              </div>
              <button
                onClick={processPayroll}
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 rounded-md font-medium ${
                  processing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white transition-colors`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Process Payroll
                  </>
                )}
              </button>
            </div>
            
            {processing && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(processedCount / employees.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Employee Processing Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.employeeCode}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.hoursWorked}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${employee.hourlyRate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${employee.regularPay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${employee.overtimePay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${employee.grossPay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${employee.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${employee.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                        employee.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        employee.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.status === 'Processing' && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-800 mr-1"></div>
                        )}
                        {employee.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {employee.status === 'Error' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {employee.status}
                      </span>
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
