'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  FileText, Download, Search, Filter, Eye, 
  DollarSign, Calendar, Users, TrendingUp
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PayrollSummary {
  id: string
  period: string
  totalEmployees: number
  grossPay: number
  netPay: number
  totalTaxes: number
  totalDeductions: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  status: 'Processed' | 'Pending' | 'Draft'
  processedDate: string
}

export default function ResumenNominaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<PayrollSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPayrollSummaries()
  }, [session, status, router])

  const fetchPayrollSummaries = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockSummaries: PayrollSummary[] = [
        {
          id: 'PS-001',
          period: '2024-09-01 to 2024-09-15',
          totalEmployees: 205,
          grossPay: 1250000,
          netPay: 875000,
          totalTaxes: 312500,
          totalDeductions: 62500,
          federalTax: 250000,
          stateTax: 62500,
          socialSecurity: 77500,
          medicare: 18125,
          status: 'Processed',
          processedDate: '2024-09-16'
        },
        {
          id: 'PS-002',
          period: '2024-08-16 to 2024-08-31',
          totalEmployees: 203,
          grossPay: 1225000,
          netPay: 857500,
          totalTaxes: 306250,
          totalDeductions: 61250,
          federalTax: 245000,
          stateTax: 61250,
          socialSecurity: 75950,
          medicare: 17763,
          status: 'Processed',
          processedDate: '2024-09-01'
        },
        {
          id: 'PS-003',
          period: '2024-09-16 to 2024-09-30',
          totalEmployees: 207,
          grossPay: 1275000,
          netPay: 892500,
          totalTaxes: 318750,
          totalDeductions: 63750,
          federalTax: 255000,
          stateTax: 63750,
          socialSecurity: 79050,
          medicare: 18488,
          status: 'Pending',
          processedDate: '2024-10-01'
        }
      ]
      
      setSummaries(mockSummaries)
    } catch (error) {
      console.error('Error fetching payroll summaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportSummary = (summaryId: string) => {
    alert(`Exporting payroll summary ${summaryId}...`)
  }

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.period.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPeriod = !selectedPeriod || summary.period.includes(selectedPeriod)
    return matchesSearch && matchesPeriod
  })

  const periods = Array.from(new Set(summaries.map(s => s.period.split(' to ')[0].substring(0, 7))))

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
              <FileText className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Nomina
            </h1>
            <button 
              onClick={() => handleExportSummary('all')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export All
            </button>
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
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${summaries.reduce((sum, s) => sum + s.grossPay, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Taxes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${summaries.reduce((sum, s) => sum + s.totalTaxes, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Periods Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{summaries.length}</p>
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
          </div>

          {/* Payroll Summaries Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSummaries.map(summary => (
                  <tr key={summary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{summary.period}</div>
                      <div className="text-sm text-gray-500">Processed: {summary.processedDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{summary.totalEmployees}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${summary.grossPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">${summary.totalTaxes.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        Fed: ${summary.federalTax.toLocaleString()} | State: ${summary.stateTax.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${summary.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        summary.status === 'Processed' ? 'bg-green-100 text-green-800' :
                        summary.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {summary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleExportSummary(summary.id)}
                          className="text-green-600 hover:text-green-900"
                        >
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