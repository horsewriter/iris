'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Download, Filter, Search, Users, DollarSign, 
  Building, TrendingUp, PiggyBank, FileText, BarChart3,
  Briefcase
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface MonthlyPayrollData {
  month: string
  year: number
  whiteCollarData: {
    totalEmployees: number
    totalGrossPay: number
    totalNetPay: number
    totalTaxes: number
    totalDeductions: number
    savingsFund: number
    savingsBox: number
    vacationAccrued: number
  }
  blueCollarData: {
    totalEmployees: number
    totalGrossPay: number
    totalNetPay: number
    totalTaxes: number
    totalDeductions: number
    savingsFund: number
    savingsBox: number
    vacationAccrued: number
  }
  departmentBreakdown: {
    department: string
    whiteCollar: number
    blueCollar: number
    totalGrossPay: number
    totalNetPay: number
  }[]
  plantBreakdown: {
    plant: string
    whiteCollar: number
    blueCollar: number
    totalGrossPay: number
    totalNetPay: number
  }[]
}

export default function MonthlyReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState<MonthlyPayrollData[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedView, setSelectedView] = useState<'summary' | 'departments' | 'plants'>('summary')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchMonthlyReports()
  }, [session, status, router])

  const fetchMonthlyReports = async () => {
    try {
      setLoading(true)
      // Simulate API call with fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: MonthlyPayrollData[] = [
        {
          month: 'January',
          year: 2024,
          whiteCollarData: {
            totalEmployees: 85,
            totalGrossPay: 680000,
            totalNetPay: 544000,
            totalTaxes: 102000,
            totalDeductions: 34000,
            savingsFund: 68000,
            savingsBox: 68000,
            vacationAccrued: 15300
          },
          blueCollarData: {
            totalEmployees: 120,
            totalGrossPay: 720000,
            totalNetPay: 576000,
            totalTaxes: 108000,
            totalDeductions: 36000,
            savingsFund: 72000,
            savingsBox: 72000,
            vacationAccrued: 21600
          },
          departmentBreakdown: [
            { department: 'Engineering', whiteCollar: 25, blueCollar: 0, totalGrossPay: 250000, totalNetPay: 200000 },
            { department: 'Production', whiteCollar: 15, blueCollar: 45, totalGrossPay: 285000, totalNetPay: 228000 },
            { department: 'Quality Control', whiteCollar: 10, blueCollar: 25, totalGrossPay: 175000, totalNetPay: 140000 },
            { department: 'Maintenance', whiteCollar: 8, blueCollar: 30, totalGrossPay: 190000, totalNetPay: 152000 },
            { department: 'Administration', whiteCollar: 20, blueCollar: 0, totalGrossPay: 200000, totalNetPay: 160000 },
            { department: 'Warehouse', whiteCollar: 7, blueCollar: 20, totalGrossPay: 135000, totalNetPay: 108000 }
          ],
          plantBreakdown: [
            { plant: 'Plant A', whiteCollar: 35, blueCollar: 50, totalGrossPay: 510000, totalNetPay: 408000 },
            { plant: 'Plant B', whiteCollar: 30, blueCollar: 40, totalGrossPay: 420000, totalNetPay: 336000 },
            { plant: 'Plant C', whiteCollar: 20, blueCollar: 30, totalGrossPay: 300000, totalNetPay: 240000 }
          ]
        },
        {
          month: 'December',
          year: 2023,
          whiteCollarData: {
            totalEmployees: 83,
            totalGrossPay: 664000,
            totalNetPay: 531200,
            totalTaxes: 99600,
            totalDeductions: 33200,
            savingsFund: 66400,
            savingsBox: 66400,
            vacationAccrued: 14940
          },
          blueCollarData: {
            totalEmployees: 118,
            totalGrossPay: 708000,
            totalNetPay: 566400,
            totalTaxes: 106200,
            totalDeductions: 35400,
            savingsFund: 70800,
            savingsBox: 70800,
            vacationAccrued: 21240
          },
          departmentBreakdown: [
            { department: 'Engineering', whiteCollar: 24, blueCollar: 0, totalGrossPay: 240000, totalNetPay: 192000 },
            { department: 'Production', whiteCollar: 15, blueCollar: 44, totalGrossPay: 279000, totalNetPay: 223200 },
            { department: 'Quality Control', whiteCollar: 10, blueCollar: 24, totalGrossPay: 170000, totalNetPay: 136000 },
            { department: 'Maintenance', whiteCollar: 8, blueCollar: 30, totalGrossPay: 190000, totalNetPay: 152000 },
            { department: 'Administration', whiteCollar: 19, blueCollar: 0, totalGrossPay: 190000, totalNetPay: 152000 },
            { department: 'Warehouse', whiteCollar: 7, blueCollar: 20, totalGrossPay: 135000, totalNetPay: 108000 }
          ],
          plantBreakdown: [
            { plant: 'Plant A', whiteCollar: 34, blueCollar: 49, totalGrossPay: 498000, totalNetPay: 398400 },
            { plant: 'Plant B', whiteCollar: 29, blueCollar: 39, totalGrossPay: 408000, totalNetPay: 326400 },
            { plant: 'Plant C', whiteCollar: 20, blueCollar: 30, totalGrossPay: 300000, totalNetPay: 240000 }
          ]
        }
      ]
      
      setMonthlyData(mockData)
      if (mockData.length > 0) {
        setSelectedMonth(`${mockData[0].month}-${mockData[0].year}`)
      }
    } catch (error) {
      console.error('Error fetching monthly reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    try {
      console.log('Exporting monthly payroll report...')
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

  const currentMonthData = monthlyData.find(data => `${data.month}-${data.year}` === selectedMonth)

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
                <h1 className="text-3xl font-bold text-gray-900">Monthly Payroll Reports</h1>
                <p className="mt-2 text-gray-600">Comprehensive monthly payroll analysis for all employees</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {monthlyData.map((data) => (
                    <option key={`${data.month}-${data.year}`} value={`${data.month}-${data.year}`}>
                      {data.month} {data.year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="summary">Summary</option>
                  <option value="departments">Departments</option>
                  <option value="plants">Plants</option>
                </select>
              </div>
            </div>
          </div>

          {currentMonthData && (
            <>
              {selectedView === 'summary' && (
                <>
                  {/* Employee Type Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* White Collar Summary */}
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                          <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                          White Collar Employees (Bi-weekly)
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{currentMonthData.whiteCollarData.totalEmployees}</p>
                            <p className="text-sm text-blue-700">Employees</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">${currentMonthData.whiteCollarData.totalNetPay.toLocaleString()}</p>
                            <p className="text-sm text-green-700">Net Pay</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">${currentMonthData.whiteCollarData.savingsFund.toLocaleString()}</p>
                            <p className="text-sm text-purple-700">Savings Fund</p>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{currentMonthData.whiteCollarData.vacationAccrued.toLocaleString()}</p>
                            <p className="text-sm text-orange-700">Vacation Hours</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Blue Collar Summary */}
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-indigo-600" />
                          Blue Collar Employees (Weekly)
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-indigo-50 rounded-lg">
                            <p className="text-2xl font-bold text-indigo-600">{currentMonthData.blueCollarData.totalEmployees}</p>
                            <p className="text-sm text-indigo-700">Employees</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">${currentMonthData.blueCollarData.totalNetPay.toLocaleString()}</p>
                            <p className="text-sm text-green-700">Net Pay</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">${currentMonthData.blueCollarData.savingsFund.toLocaleString()}</p>
                            <p className="text-sm text-purple-700">Savings Fund</p>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{currentMonthData.blueCollarData.vacationAccrued.toLocaleString()}</p>
                            <p className="text-sm text-orange-700">Vacation Hours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Employees</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {currentMonthData.whiteCollarData.totalEmployees + currentMonthData.blueCollarData.totalEmployees}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${(currentMonthData.whiteCollarData.totalNetPay + currentMonthData.blueCollarData.totalNetPay).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <PiggyBank className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Savings</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${(currentMonthData.whiteCollarData.savingsFund + currentMonthData.blueCollarData.savingsFund).toLocaleString()}
                          </p>
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
                          <p className="text-2xl font-bold text-gray-900">
                            ${(currentMonthData.whiteCollarData.totalTaxes + currentMonthData.blueCollarData.totalTaxes).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedView === 'departments' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Department Breakdown</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">White Collar</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blue Collar</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employees</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentMonthData.departmentBreakdown.map((dept) => (
                          <tr key={dept.department} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.whiteCollar}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.blueCollar}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.whiteCollar + dept.blueCollar}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dept.totalGrossPay.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dept.totalNetPay.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedView === 'plants' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Plant Breakdown</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">White Collar</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blue Collar</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employees</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentMonthData.plantBreakdown.map((plant) => (
                          <tr key={plant.plant} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plant.plant}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plant.whiteCollar}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plant.blueCollar}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plant.whiteCollar + plant.blueCollar}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plant.totalGrossPay.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plant.totalNetPay.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}