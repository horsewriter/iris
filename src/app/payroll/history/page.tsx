'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  CheckCircle, Download, Search, Calendar, DollarSign, 
  Filter, Eye, FileText, Clock, TrendingUp
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PaymentHistory {
  id: string
  employeeId: string
  employeeName: string
  department: string
  payrollType: 'Weekly' | 'Bi-weekly'
  period: string
  payDate: string
  baseSalary: number
  extraHours: number
  extraHoursPay: number
  bonus: number
  vacationPay: number
  grossPay: number
  deductions: number
  netPay: number
  attendanceDays: number
  absenceDays: number
  paidAbsences: number
  unpaidAbsences: number
  status: 'Paid' | 'Cancelled' | 'Reversed'
  paymentMethod: 'Direct Deposit' | 'Check' | 'Cash'
}

export default function PaymentHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPaymentHistory()
  }, [session, status, router])

  const fetchPaymentHistory = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockPayments: PaymentHistory[] = [
        {
          id: 'PH-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          department: 'Engineering',
          payrollType: 'Bi-weekly',
          period: '2024-08-16 to 2024-08-31',
          payDate: '2024-09-05',
          baseSalary: 3846.15,
          extraHours: 8,
          extraHoursPay: 480.00,
          bonus: 500.00,
          vacationPay: 0,
          grossPay: 4826.15,
          deductions: 1447.85,
          netPay: 3378.30,
          attendanceDays: 10,
          absenceDays: 0,
          paidAbsences: 0,
          unpaidAbsences: 0,
          status: 'Paid',
          paymentMethod: 'Direct Deposit'
        },
        {
          id: 'PH-002',
          employeeId: 'EMP-002',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          payrollType: 'Weekly',
          period: '2024-09-02 to 2024-09-08',
          payDate: '2024-09-12',
          baseSalary: 740.00,
          extraHours: 8,
          extraHoursPay: 148.00,
          bonus: 0,
          vacationPay: 0,
          grossPay: 888.00,
          deductions: 177.60,
          netPay: 710.40,
          attendanceDays: 5,
          absenceDays: 0,
          paidAbsences: 0,
          unpaidAbsences: 0,
          status: 'Paid',
          paymentMethod: 'Direct Deposit'
        },
        {
          id: 'PH-003',
          employeeId: 'EMP-003',
          employeeName: 'Maria Garcia',
          department: 'Quality Control',
          payrollType: 'Weekly',
          period: '2024-09-02 to 2024-09-08',
          payDate: '2024-09-12',
          baseSalary: 800.00,
          extraHours: 5,
          extraHoursPay: 100.00,
          bonus: 0,
          vacationPay: 0,
          grossPay: 900.00,
          deductions: 180.00,
          netPay: 720.00,
          attendanceDays: 5,
          absenceDays: 0,
          paidAbsences: 0,
          unpaidAbsences: 0,
          status: 'Paid',
          paymentMethod: 'Direct Deposit'
        },
        {
          id: 'PH-004',
          employeeId: 'EMP-004',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          payrollType: 'Bi-weekly',
          period: '2024-08-16 to 2024-08-31',
          payDate: '2024-09-05',
          baseSalary: 2884.62,
          extraHours: 0,
          extraHoursPay: 0,
          bonus: 0,
          vacationPay: 576.92,
          grossPay: 3461.54,
          deductions: 1038.46,
          netPay: 2423.08,
          attendanceDays: 8,
          absenceDays: 2,
          paidAbsences: 2,
          unpaidAbsences: 0,
          status: 'Paid',
          paymentMethod: 'Direct Deposit'
        },
        {
          id: 'PH-005',
          employeeId: 'EMP-005',
          employeeName: 'Jose Martinez',
          department: 'Maintenance',
          payrollType: 'Weekly',
          period: '2024-08-26 to 2024-09-01',
          payDate: '2024-09-05',
          baseSalary: 880.00,
          extraHours: 10,
          extraHoursPay: 220.00,
          bonus: 100.00,
          vacationPay: 0,
          grossPay: 1200.00,
          deductions: 240.00,
          netPay: 960.00,
          attendanceDays: 4,
          absenceDays: 1,
          paidAbsences: 0,
          unpaidAbsences: 1,
          status: 'Paid',
          paymentMethod: 'Direct Deposit'
        }
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportHistory = () => {
    alert('Payment history exported successfully!')
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPeriod = !selectedPeriod || payment.period.includes(selectedPeriod)
    const matchesDept = !selectedDepartment || payment.department === selectedDepartment
    const matchesStatus = !selectedStatus || payment.status === selectedStatus
    return matchesSearch && matchesPeriod && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(payments.map(p => p.department)))
  const periods = Array.from(new Set(payments.map(p => p.period.split(' to ')[0].substring(0, 7))))

  const totalGrossPay = filteredPayments.reduce((sum, p) => sum + p.grossPay, 0)
  const totalNetPay = filteredPayments.reduce((sum, p) => sum + p.netPay, 0)
  const totalExtraHoursPay = filteredPayments.reduce((sum, p) => sum + p.extraHoursPay, 0)
  const totalBonuses = filteredPayments.reduce((sum, p) => sum + p.bonus, 0)

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
              <CheckCircle className="h-8 w-8 mr-3 text-indigo-600" /> Payment History
            </h1>
            <button 
              onClick={handleExportHistory}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export History
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Extra Hours Pay</p>
                  <p className="text-2xl font-bold text-gray-900">${totalExtraHoursPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bonuses</p>
                  <p className="text-2xl font-bold text-gray-900">${totalBonuses.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Reversed">Reversed</option>
              </select>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period & Pay Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus & Vacation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{payment.employeeName}</div>
                      <div className="text-sm text-gray-500">{payment.employeeId}</div>
                      <div className="text-sm text-gray-500">{payment.department}</div>
                      <div className="text-sm text-gray-500">{payment.payrollType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.period}</div>
                      <div className="text-sm text-gray-500">Paid: {payment.payDate}</div>
                      <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${payment.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.extraHours} hrs</div>
                      <div className="text-sm text-green-600">${payment.extraHoursPay.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600">Bonus: ${payment.bonus.toLocaleString()}</div>
                      <div className="text-sm text-purple-600">Vacation: ${payment.vacationPay.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-green-600">Present: {payment.attendanceDays}</div>
                      <div className="text-sm text-yellow-600">Paid Abs: {payment.paidAbsences}</div>
                      <div className="text-sm text-red-600">Unpaid Abs: {payment.unpaidAbsences}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${payment.grossPay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${payment.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
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
