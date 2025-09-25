'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  PiggyBank, Download, TrendingUp, DollarSign, Users, 
  Search, Calendar, BarChart3
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface SavingsReport {
  id: string
  employeeId: string
  employeeName: string
  department: string
  savingsFund: number
  savingsBox: number
  monthlyContribution: number
  totalSavings: number
  contributionRate: number
  lastContribution: string
  status: 'Active' | 'Inactive' | 'Suspended'
}

export default function SavingsReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<SavingsReport[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchSavingsReports()
  }, [session, status, router])

  const fetchSavingsReports = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockReports: SavingsReport[] = [
        {
          id: 'SR-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          department: 'Engineering',
          savingsFund: 15000,
          savingsBox: 12000,
          monthlyContribution: 800,
          totalSavings: 27000,
          contributionRate: 8.0,
          lastContribution: '2024-09-15',
          status: 'Active'
        },
        {
          id: 'SR-002',
          employeeId: 'EMP-002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          savingsFund: 18000,
          savingsBox: 15000,
          monthlyContribution: 600,
          totalSavings: 33000,
          contributionRate: 8.0,
          lastContribution: '2024-09-15',
          status: 'Active'
        },
        {
          id: 'SR-003',
          employeeId: 'EMP-003',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          savingsFund: 8000,
          savingsBox: 6500,
          monthlyContribution: 350,
          totalSavings: 14500,
          contributionRate: 7.5,
          lastContribution: '2024-09-15',
          status: 'Active'
        },
        {
          id: 'SR-004',
          employeeId: 'EMP-004',
          employeeName: 'Maria Garcia',
          department: 'Quality Control',
          savingsFund: 12000,
          savingsBox: 10000,
          monthlyContribution: 400,
          totalSavings: 22000,
          contributionRate: 8.0,
          lastContribution: '2024-09-15',
          status: 'Active'
        }
      ]

      setReports(mockReports)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReports = () => {
    alert('Savings reports exported successfully!')
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || report.department === selectedDepartment
    const matchesStatus = !selectedStatus || report.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(reports.map(r => r.department)))

  const totalSavingsFund = filteredReports.reduce((sum, r) => sum + r.savingsFund, 0)
  const totalSavingsBox = filteredReports.reduce((sum, r) => sum + r.savingsBox, 0)
  const totalMonthlyContributions = filteredReports.reduce((sum, r) => sum + r.monthlyContribution, 0)
  const totalSavings = filteredReports.reduce((sum, r) => sum + r.totalSavings, 0)
  const averageContributionRate = filteredReports.length > 0 
    ? filteredReports.reduce((sum, r) => sum + r.contributionRate, 0) / filteredReports.length 
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
              <PiggyBank className="h-8 w-8 mr-3 text-indigo-600" /> Savings Reports
            </h1>
            <button 
              onClick={handleExportReports}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export Reports
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <PiggyBank className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Savings Fund</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSavingsFund.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <PiggyBank className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Savings Box</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSavingsBox.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Contributions</p>
                  <p className="text-2xl font-bold text-gray-900">${totalMonthlyContributions.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSavings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Contribution Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{averageContributionRate.toFixed(1)}%</p>
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
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Savings Reports Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings Box</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Contribution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contribution Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contribution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{report.employeeName}</div>
                      <div className="text-sm text-gray-500">{report.employeeId}</div>
                      <div className="text-sm text-gray-500">{report.department}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">${report.savingsFund.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">${report.savingsBox.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${report.monthlyContribution.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${report.totalSavings.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.contributionRate}%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.lastContribution}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'Active' ? 'bg-green-100 text-green-800' :
                        report.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
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
