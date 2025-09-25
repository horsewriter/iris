'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  TrendingUp, Download, Search, DollarSign, 
  Calendar, AlertTriangle, BarChart3, Users
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface VacationLiability {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  currentSalary: number
  dailyRate: number
  vacationBalance: number
  liabilityAmount: number
  maxLiability: number
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  lastVacationDate: string
  projectedAccrual: number
  projectedLiability: number
  recommendedAction: string
}

export default function VacationLiabilityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [liabilities, setLiabilities] = useState<VacationLiability[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedRisk, setSelectedRisk] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL, Role.HR].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchVacationLiabilities()
  }, [session, status, router])

  const fetchVacationLiabilities = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockLiabilities: VacationLiability[] = [
        {
          id: 'VL-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          department: 'Engineering',
          position: 'Senior Engineer',
          currentSalary: 100000,
          dailyRate: 384.62,
          vacationBalance: 18.5,
          liabilityAmount: 7115.47,
          maxLiability: 15384.80,
          riskLevel: 'Medium',
          lastVacationDate: '2024-06-15',
          projectedAccrual: 20.0,
          projectedLiability: 7692.40,
          recommendedAction: 'Encourage vacation usage'
        },
        {
          id: 'VL-002',
          employeeId: 'EMP-002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          position: 'HR Manager',
          currentSalary: 75000,
          dailyRate: 288.46,
          vacationBalance: 22.0,
          liabilityAmount: 6346.12,
          maxLiability: 11538.40,
          riskLevel: 'Medium',
          lastVacationDate: '2024-07-20',
          projectedAccrual: 24.0,
          projectedLiability: 6923.04,
          recommendedAction: 'Monitor closely'
        },
        {
          id: 'VL-003',
          employeeId: 'EMP-003',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          currentSalary: 46176,
          dailyRate: 177.60,
          vacationBalance: 12.0,
          liabilityAmount: 2131.20,
          maxLiability: 5328.00,
          riskLevel: 'Low',
          lastVacationDate: '2024-08-10',
          projectedAccrual: 13.3,
          projectedLiability: 2362.08,
          recommendedAction: 'No action needed'
        },
        {
          id: 'VL-004',
          employeeId: 'EMP-004',
          employeeName: 'Maria Garcia',
          department: 'Quality Control',
          position: 'QC Inspector',
          currentSalary: 49920,
          dailyRate: 192.00,
          vacationBalance: 40.0,
          liabilityAmount: 7680.00,
          maxLiability: 7680.00,
          riskLevel: 'Critical',
          lastVacationDate: '2023-12-20',
          projectedAccrual: 40.0,
          projectedLiability: 7680.00,
          recommendedAction: 'Mandatory vacation required'
        },
        {
          id: 'VL-005',
          employeeId: 'EMP-005',
          employeeName: 'Michael Davis',
          department: 'Finance',
          position: 'Financial Analyst',
          currentSalary: 60000,
          dailyRate: 230.77,
          vacationBalance: 35.0,
          liabilityAmount: 8076.95,
          maxLiability: 9230.80,
          riskLevel: 'High',
          lastVacationDate: '2024-01-15',
          projectedAccrual: 37.0,
          projectedLiability: 8538.49,
          recommendedAction: 'Schedule vacation immediately'
        }
      ]

      setLiabilities(mockLiabilities)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    alert('Vacation liability data exported successfully!')
  }

  const filteredLiabilities = liabilities.filter(liability => {
    const matchesSearch = liability.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          liability.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || liability.department === selectedDepartment
    const matchesRisk = !selectedRisk || liability.riskLevel === selectedRisk
    return matchesSearch && matchesDept && matchesRisk
  })

  const departments = Array.from(new Set(liabilities.map(l => l.department)))

  const totalLiability = filteredLiabilities.reduce((sum, l) => sum + l.liabilityAmount, 0)
  const totalProjectedLiability = filteredLiabilities.reduce((sum, l) => sum + l.projectedLiability, 0)
  const highRiskCount = filteredLiabilities.filter(l => l.riskLevel === 'High' || l.riskLevel === 'Critical').length
  const averageDailyRate = filteredLiabilities.length > 0 
    ? filteredLiabilities.reduce((sum, l) => sum + l.dailyRate, 0) / filteredLiabilities.length 
    : 0

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
              <TrendingUp className="h-8 w-8 mr-3 text-indigo-600" /> Vacation Liability
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
                <DollarSign className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Liability</p>
                  <p className="text-2xl font-bold text-gray-900">${totalLiability.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projected Liability</p>
                  <p className="text-2xl font-bold text-gray-900">${totalProjectedLiability.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Risk Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{highRiskCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Daily Rate</p>
                  <p className="text-2xl font-bold text-gray-900">${averageDailyRate.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Alert Banner */}
          {highRiskCount > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Attention:</strong> {highRiskCount} employee(s) have high vacation liability. 
                    Consider implementing mandatory vacation policies to reduce financial risk.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <label className="block text-sm font-medium mb-2">Risk Level</label>
              <select 
                value={selectedRisk} 
                onChange={e => setSelectedRisk(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Risk Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Vacation Liability Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary & Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacation Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Liability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Vacation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLiabilities.map(liability => (
                  <tr key={liability.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{liability.employeeName}</div>
                      <div className="text-sm text-gray-500">{liability.employeeId}</div>
                      <div className="text-sm text-gray-500">{liability.department}</div>
                      <div className="text-sm text-gray-500">{liability.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">${liability.currentSalary.toLocaleString()}/year</div>
                      <div className="text-sm text-gray-500">${liability.dailyRate.toFixed(2)}/day</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">{liability.vacationBalance.toFixed(1)} days</div>
                      <div className="text-sm text-gray-500">Projected: {liability.projectedAccrual.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-red-600">${liability.liabilityAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Max: ${liability.maxLiability.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-orange-600">${liability.projectedLiability.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        {((liability.projectedLiability - liability.liabilityAmount) >= 0 ? '+' : '')}
                        ${(liability.projectedLiability - liability.liabilityAmount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        liability.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                        liability.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                        liability.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {liability.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{liability.lastVacationDate}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{liability.recommendedAction}</div>
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
