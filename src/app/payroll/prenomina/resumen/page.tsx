'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  FileText, Download, Search, Eye, Calculator,
  DollarSign, Users, Clock, TrendingUp
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PrePayrollSummary {
  id: string
  period: string
  cutoffDate: string
  totalEmployees: number
  regularHours: number
  overtimeHours: number
  totalHours: number
  estimatedGrossPay: number
  estimatedDeductions: number
  estimatedNetPay: number
  pendingAdjustments: number
  status: 'Draft' | 'Review' | 'Approved' | 'Processed'
  lastUpdated: string
}

export default function ResumenPrenominaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<PrePayrollSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPrePayrollSummaries()
  }, [session, status, router])

  const fetchPrePayrollSummaries = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockSummaries: PrePayrollSummary[] = [
        {
          id: 'PPS-001',
          period: '2024-09-23 to 2024-09-29',
          cutoffDate: '2024-09-30',
          totalEmployees: 205,
          regularHours: 8200,
          overtimeHours: 1230,
          totalHours: 9430,
          estimatedGrossPay: 295000,
          estimatedDeductions: 73750,
          estimatedNetPay: 221250,
          pendingAdjustments: 12,
          status: 'Draft',
          lastUpdated: '2024-09-24T10:30:00Z'
        },
        {
          id: 'PPS-002',
          period: '2024-09-16 to 2024-09-22',
          cutoffDate: '2024-09-23',
          totalEmployees: 203,
          regularHours: 8120,
          overtimeHours: 1180,
          totalHours: 9300,
          estimatedGrossPay: 290000,
          estimatedDeductions: 72500,
          estimatedNetPay: 217500,
          pendingAdjustments: 0,
          status: 'Processed',
          lastUpdated: '2024-09-23T16:45:00Z'
        }
      ]
      
      setSummaries(mockSummaries)
    } catch (error) {
      console.error('Error fetching pre-payroll summaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPrePayroll = (summaryId: string) => {
    setSummaries(prev => prev.map(sum => 
      sum.id === summaryId ? { ...sum, status: 'Review' as const } : sum
    ))
    alert('Pre-payroll moved to review status!')
  }

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.period.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || summary.status === selectedStatus
    return matchesSearch && matchesStatus
  })

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
              <FileText className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Prenomina
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaries.length > 0 ? summaries[0].totalEmployees : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaries.reduce((sum, s) => sum + s.totalHours, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estimated Gross</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${summaries.reduce((sum, s) => sum + s.estimatedGrossPay, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estimated Net</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${summaries.reduce((sum, s) => sum + s.estimatedNetPay, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Period</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by period..." 
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Review">Review</option>
                <option value="Approved">Approved</option>
                <option value="Processed">Processed</option>
              </select>
            </div>
          </div>

          {/* Pre-Payroll Summaries Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSummaries.map(summary => (
                  <tr key={summary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{summary.period}</div>
                      <div className="text-sm text-gray-500">Cutoff: {summary.cutoffDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{summary.totalEmployees}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{summary.totalHours.toLocaleString()} total</div>
                      <div className="text-sm text-gray-500">
                        Regular: {summary.regularHours.toLocaleString()} | OT: {summary.overtimeHours.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${summary.estimatedGrossPay.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Net: ${summary.estimatedNetPay.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        summary.pendingAdjustments > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {summary.pendingAdjustments} pending
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        summary.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        summary.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                        summary.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {summary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {summary.status === 'Draft' && (
                          <button 
                            onClick={() => handleProcessPrePayroll(summary.id)}
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