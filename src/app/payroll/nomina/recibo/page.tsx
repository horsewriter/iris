'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { FileText, Download, Search, Eye, Printer as Print, DollarSign, Calendar, Users, Building } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PayStub {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  department: string
  position: string
  period: string
  payDate: string
  grossPay: number
  netPay: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  otherDeductions: number
  overtimePay: number
  bonuses: number
  vacationPay: number
}

export default function ReciboEmpleadoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payStubs, setPayStubs] = useState<PayStub[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPayStubs()
  }, [session, status, router])

  const fetchPayStubs = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockPayStubs: PayStub[] = [
        {
          id: 'PS-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          employeeCode: 'WC001',
          department: 'Engineering',
          position: 'Senior Engineer',
          period: '2024-09-01 to 2024-09-15',
          payDate: '2024-09-16',
          grossPay: 3846.15,
          netPay: 2282.69,
          federalTax: 769.23,
          stateTax: 192.31,
          socialSecurity: 238.46,
          medicare: 55.77,
          otherDeductions: 307.69,
          overtimePay: 480.00,
          bonuses: 500.00,
          vacationPay: 0
        },
        {
          id: 'PS-002',
          employeeId: 'EMP-002',
          employeeName: 'Carlos Rodriguez',
          employeeCode: 'BC001',
          department: 'Production',
          position: 'Machine Operator',
          period: '2024-09-09 to 2024-09-15',
          payDate: '2024-09-16',
          grossPay: 888.00,
          netPay: 710.40,
          federalTax: 88.80,
          stateTax: 44.40,
          socialSecurity: 55.06,
          medicare: 12.87,
          otherDeductions: 44.40,
          overtimePay: 148.00,
          bonuses: 0,
          vacationPay: 0
        }
      ]
      
      setPayStubs(mockPayStubs)
    } catch (error) {
      console.error('Error fetching pay stubs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPayStub = (payStubId: string) => {
    alert(`Downloading pay stub ${payStubId}...`)
  }

  const handlePrintPayStub = (payStubId: string) => {
    alert(`Printing pay stub ${payStubId}...`)
  }

  const filteredPayStubs = payStubs.filter(stub => {
    const matchesSearch = stub.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stub.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || stub.department === selectedDepartment
    return matchesSearch && matchesDept
  })

  const departments = Array.from(new Set(payStubs.map(s => s.department)))

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
              <FileText className="h-8 w-8 mr-3 text-indigo-600" /> Recibo de Empleado
            </h1>
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

          {/* Pay Stubs Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayStubs.map(stub => (
                  <tr key={stub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{stub.employeeName}</div>
                      <div className="text-sm text-gray-500">{stub.employeeCode}</div>
                      <div className="text-sm text-gray-500">{stub.department} - {stub.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{stub.period}</div>
                      <div className="text-sm text-gray-500">Paid: {stub.payDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${stub.grossPay.toLocaleString()}</div>
                      {stub.overtimePay > 0 && (
                        <div className="text-sm text-green-600">+${stub.overtimePay.toLocaleString()} OT</div>
                      )}
                      {stub.bonuses > 0 && (
                        <div className="text-sm text-blue-600">+${stub.bonuses.toLocaleString()} Bonus</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-red-600">-${(stub.federalTax + stub.stateTax + stub.socialSecurity + stub.medicare + stub.otherDeductions).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        Fed: ${stub.federalTax.toLocaleString()} | State: ${stub.stateTax.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${stub.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDownloadPayStub(stub.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handlePrintPayStub(stub.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Print className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <Eye className="h-4 w-4" />
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