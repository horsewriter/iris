'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  TrendingUp, Download, Calendar, DollarSign, FileText, 
  Filter, Search, Eye, Calculator
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface TaxReport {
  id: string
  employeeId: string
  employeeName: string
  department: string
  period: string
  grossPay: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  totalTaxes: number
  netPay: number
  status: 'Processed' | 'Pending' | 'Review'
}

export default function TaxReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<TaxReport[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchTaxReports()
  }, [session, status, router])

  const fetchTaxReports = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockReports: TaxReport[] = [
        {
          id: 'TR-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          department: 'Engineering',
          period: '2024-09',
          grossPay: 8333.33,
          federalTax: 1666.67,
          stateTax: 416.67,
          socialSecurity: 516.67,
          medicare: 120.83,
          totalTaxes: 2720.84,
          netPay: 5612.49,
          status: 'Processed'
        },
        {
          id: 'TR-002',
          employeeId: 'EMP-002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          period: '2024-09',
          grossPay: 6250.00,
          federalTax: 1250.00,
          stateTax: 312.50,
          socialSecurity: 387.50,
          medicare: 90.63,
          totalTaxes: 2040.63,
          netPay: 4209.37,
          status: 'Processed'
        },
        {
          id: 'TR-003',
          employeeId: 'EMP-003',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          period: '2024-09',
          grossPay: 3846.15,
          federalTax: 576.92,
          stateTax: 192.31,
          socialSecurity: 238.46,
          medicare: 55.77,
          totalTaxes: 1063.46,
          netPay: 2782.69,
          status: 'Review'
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
    alert('Tax reports exported successfully!')
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPeriod = !selectedPeriod || report.period === selectedPeriod
    const matchesDept = !selectedDepartment || report.department === selectedDepartment
    return matchesSearch && matchesPeriod && matchesDept
  })

  const periods = Array.from(new Set(reports.map(r => r.period)))
  const departments = Array.from(new Set(reports.map(r => r.department)))

  const totalGrossPay = filteredReports.reduce((sum, r) => sum + r.grossPay, 0)
  const totalTaxes = filteredReports.reduce((sum, r) => sum + r.totalTaxes, 0)
  const totalNetPay = filteredReports.reduce((sum, r) => sum + r.netPay, 0)

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
              <TrendingUp className="h-8 w-8 mr-3 text-indigo-600" /> Tax Reports
            </h1>
            <button 
              onClick={handleExportReports}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export Reports
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Taxes</p>
                  <p className="text-2xl font-bold text-gray-900">${totalTaxes.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
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
              <label className="block text-sm font-medium mb-2">Period</label>
              <select 
                value={selectedPeriod} 
                onChange={e => setSelectedPeriod(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Periods</option>
                {periods.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
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

          {/* Tax Reports Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Federal Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FICA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Taxes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 text-sm text-gray-900">{report.period}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${report.grossPay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${report.federalTax.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${report.stateTax.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">SS: ${report.socialSecurity.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Med: ${report.medicare.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${report.totalTaxes.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">${report.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'Processed' ? 'bg-green-100 text-green-800' :
                        report.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
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
