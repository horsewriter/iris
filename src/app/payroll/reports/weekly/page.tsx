'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Download, Filter, Search, Users, DollarSign, 
  Building, TrendingUp, Clock, FileText, ChevronLeft, ChevronRight
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface WeeklyPayrollData {
  weekEnding: string
  totalEmployees: number
  totalGrossPay: number
  totalNetPay: number
  totalTaxes: number
  totalDeductions: number
  departmentBreakdown: {
    department: string
    employees: number
    grossPay: number
    netPay: number
  }[]
  plantBreakdown: {
    plant: string
    employees: number
    grossPay: number
    netPay: number
  }[]
}

export default function WeeklyReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState<WeeklyPayrollData[]>([])
  const [selectedWeek, setSelectedWeek] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchWeeklyReports()
  }, [session, status, router])

  const fetchWeeklyReports = async () => {
    try {
      setLoading(true)
      // Simulate API call with fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: WeeklyPayrollData[] = [
        {
          weekEnding: '2024-01-07',
          totalEmployees: 120,
          totalGrossPay: 180000,
          totalNetPay: 144000,
          totalTaxes: 27000,
          totalDeductions: 9000,
          departmentBreakdown: [
            { department: 'Production', employees: 45, grossPay: 67500, netPay: 54000 },
            { department: 'Quality Control', employees: 25, grossPay: 37500, netPay: 30000 },
            { department: 'Maintenance', employees: 30, grossPay: 45000, netPay: 36000 },
            { department: 'Warehouse', employees: 20, grossPay: 30000, netPay: 24000 }
          ],
          plantBreakdown: [
            { plant: 'Plant A', employees: 50, grossPay: 75000, netPay: 60000 },
            { plant: 'Plant B', employees: 40, grossPay: 60000, netPay: 48000 },
            { plant: 'Plant C', employees: 30, grossPay: 45000, netPay: 36000 }
          ]
        },
        {
          weekEnding: '2024-01-14',
          totalEmployees: 118,
          totalGrossPay: 177000,
          totalNetPay: 141600,
          totalTaxes: 26550,
          totalDeductions: 8850,
          departmentBreakdown: [
            { department: 'Production', employees: 44, grossPay: 66000, netPay: 52800 },
            { department: 'Quality Control', employees: 24, grossPay: 36000, netPay: 28800 },
            { department: 'Maintenance', employees: 30, grossPay: 45000, netPay: 36000 },
            { department: 'Warehouse', employees: 20, grossPay: 30000, netPay: 24000 }
          ],
          plantBreakdown: [
            { plant: 'Plant A', employees: 49, grossPay: 73500, netPay: 58800 },
            { plant: 'Plant B', employees: 39, grossPay: 58500, netPay: 46800 },
            { plant: 'Plant C', employees: 30, grossPay: 45000, netPay: 36000 }
          ]
        }
      ]
      
      setWeeklyData(mockData)
      if (mockData.length > 0) {
        setSelectedWeek(mockData[0].weekEnding)
      }
    } catch (error) {
      console.error('Error fetching weekly reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    try {
      // Simulate report export
      console.log('Exporting weekly payroll report...')
      alert('Report exported successfully!')
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
    return null
  }

  const currentWeekData = weeklyData.find(data => data.weekEnding === selectedWeek)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <PayrollSidebar />
        
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Weekly Payroll Reports</h1>
                <p className="mt-2 text-gray-600">Blue collar employee weekly payroll summaries</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Week Ending</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {weeklyData.map((data) => (
                    <option key={data.weekEnding} value={data.weekEnding}>
                      Week ending {new Date(data.weekEnding).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Departments</option>
                  <option value="Production">Production</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {currentWeekData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-gray-900">{currentWeekData.totalEmployees}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Gross Pay</p>
                      <p className="text-2xl font-bold text-gray-900">${currentWeekData.totalGrossPay.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Net Pay</p>
                      <p className="text-2xl font-bold text-gray-900">${currentWeekData.totalNetPay.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Taxes</p>
                      <p className="text-2xl font-bold text-gray-900">${currentWeekData.totalTaxes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Breakdown */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Department Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Employee</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentWeekData.departmentBreakdown.map((dept) => (
                        <tr key={dept.department} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.employees}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dept.grossPay.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dept.netPay.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(dept.netPay / dept.employees).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Plant Breakdown */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Plant Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Employee</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentWeekData.plantBreakdown.map((plant) => (
                        <tr key={plant.plant} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plant.plant}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plant.employees}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plant.grossPay.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plant.netPay.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(plant.netPay / plant.employees).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}