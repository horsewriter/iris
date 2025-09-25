'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Play, Clock, CheckCircle, AlertCircle, 
  Users, DollarSign, Calculator, Briefcase
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface BiweeklyPayrollEmployee {
  id: string
  employeeCode: string
  name: string
  department: string
  position: string
  biweeklySalary: number
  grossPay: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  savingsContribution: number
  totalDeductions: number
  netPay: number
  status: 'Ready' | 'Processing' | 'Completed' | 'Error'
}

export default function BiweeklyPayrollProcessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<BiweeklyPayrollEmployee[]>([])
  const [processing, setProcessing] = useState(false)
  const [currentPeriod, setCurrentPeriod] = useState('')
  const [processedCount, setProcessedCount] = useState(0)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    
    // Set current bi-weekly period
    const today = new Date()
    const startOfPeriod = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfPeriod = new Date(today.getFullYear(), today.getMonth(), 15)
    setCurrentPeriod(`${startOfPeriod.toLocaleDateString()} - ${endOfPeriod.toLocaleDateString()}`)
    
    fetchBiweeklyEmployees()
  }, [session, status, router])

  const fetchBiweeklyEmployees = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockEmployees: BiweeklyPayrollEmployee[] = [
        {
          id: 'BP-001',
          employeeCode: 'WC001',
          name: 'John Smith',
          department: 'Engineering',
          position: 'Senior Engineer',
          biweeklySalary: 3846.15,
          grossPay: 3846.15,
          federalTax: 769.23,
          stateTax: 192.31,
          socialSecurity: 238.46,
          medicare: 55.77,
          savingsContribution: 307.69,
          totalDeductions: 1563.46,
          netPay: 2282.69,
          status: 'Ready'
        },
        {
          id: 'BP-002',
          employeeCode: 'WC002',
          name: 'Sarah Johnson',
          department: 'Administration',
          position: 'HR Manager',
          biweeklySalary: 2884.62,
          grossPay: 2884.62,
          federalTax: 576.92,
          stateTax: 144.23,
          socialSecurity: 178.85,
          medicare: 41.83,
          savingsContribution: 230.77,
          totalDeductions: 1172.60,
          netPay: 1712.02,
          status: 'Ready'
        },
        {
          id: 'BP-003',
          employeeCode: 'WC003',
          name: 'Michael Davis',
          department: 'Finance',
          position: 'Financial Analyst',
          biweeklySalary: 2307.69,
          grossPay: 2307.69,
          federalTax: 461.54,
          stateTax: 115.38,
          socialSecurity: 143.08,
          medicare: 33.46,
          savingsContribution: 184.62,
          totalDeductions: 938.08,
          netPay: 1369.61,
          status: 'Ready'
        },
        {
          id: 'BP-004',
          employeeCode: 'WC004',
          name: 'Emily Wilson',
          department: 'Marketing',
          position: 'Marketing Manager',
          biweeklySalary: 2692.31,
          grossPay: 2692.31,
          federalTax: 538.46,
          stateTax: 134.62,
          socialSecurity: 166.92,
          medicare: 39.04,
          savingsContribution: 215.38,
          totalDeductions: 1094.42,
          netPay: 1597.89,
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
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setEmployees(prev => prev.map((emp, index) => 
        index === i ? { ...emp, status: 'Completed' } : emp
      ))
      
      setProcessedCount(i + 1)
    }

    setProcessing(false)
    alert('Bi-weekly payroll processing completed successfully!')
  }

  const totalGrossPay = employees.reduce((sum, emp) => sum + emp.grossPay, 0)
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.totalDeductions, 0)
  const totalNetPay = employees.reduce((sum, emp) => sum + emp.netPay, 0)
  const totalSavingsContributions = employees.reduce((sum, emp) => sum + emp.savingsContribution, 0)

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
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Bi-weekly Payroll Processing
            </h1>
            <div className="text-sm text-gray-600">
              Period: {currentPeriod}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">White Collar Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                  <p className="text-2xl font-bold text-gray-900">${totalDeductions.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-orange-600" />
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
                    : 'Ready to process bi-weekly payroll for white collar employees'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total Savings Contributions: ${totalSavingsContributions.toLocaleString()}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bi-weekly Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Federal Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FICA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deductions</th>
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
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${employee.biweeklySalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${employee.federalTax.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${employee.stateTax.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">SS: ${employee.socialSecurity.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Med: ${employee.medicare.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600">${employee.savingsContribution.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">${employee.totalDeductions.toLocaleString()}</td>
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
