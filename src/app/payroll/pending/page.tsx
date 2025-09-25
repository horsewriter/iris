'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Clock, CheckCircle, XCircle, Eye, DollarSign, 
  Calendar, Users, AlertCircle, Filter
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PendingPayment {
  id: string
  employeeId: string
  employeeName: string
  department: string
  payrollType: 'Weekly' | 'Bi-weekly'
  period: string
  grossAmount: number
  netAmount: number
  submittedDate: string
  dueDate: string
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Processing'
  approver?: string
  notes?: string
  priority: 'High' | 'Medium' | 'Low'
}

export default function PendingPaymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPendingPayments()
  }, [session, status, router])

  const fetchPendingPayments = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockPayments: PendingPayment[] = [
        {
          id: 'PP-001',
          employeeId: 'EMP-001',
          employeeName: 'John Smith',
          department: 'Engineering',
          payrollType: 'Bi-weekly',
          period: '2024-09-01 to 2024-09-15',
          grossAmount: 3846.15,
          netAmount: 2282.69,
          submittedDate: '2024-09-16',
          dueDate: '2024-09-20',
          status: 'Pending Approval',
          priority: 'High',
          notes: 'Overtime hours included'
        },
        {
          id: 'PP-002',
          employeeId: 'EMP-002',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          payrollType: 'Weekly',
          period: '2024-09-09 to 2024-09-15',
          grossAmount: 888.00,
          netAmount: 710.40,
          submittedDate: '2024-09-16',
          dueDate: '2024-09-18',
          status: 'Approved',
          approver: 'Sarah Johnson',
          priority: 'Medium'
        },
        {
          id: 'PP-003',
          employeeId: 'EMP-003',
          employeeName: 'Maria Garcia',
          department: 'Quality Control',
          payrollType: 'Weekly',
          period: '2024-09-09 to 2024-09-15',
          grossAmount: 900.00,
          netAmount: 720.00,
          submittedDate: '2024-09-16',
          dueDate: '2024-09-18',
          status: 'Processing',
          approver: 'Sarah Johnson',
          priority: 'Medium'
        },
        {
          id: 'PP-004',
          employeeId: 'EMP-004',
          employeeName: 'Emily Wilson',
          department: 'Marketing',
          payrollType: 'Bi-weekly',
          period: '2024-09-01 to 2024-09-15',
          grossAmount: 2692.31,
          netAmount: 1597.89,
          submittedDate: '2024-09-16',
          dueDate: '2024-09-20',
          status: 'Pending Approval',
          priority: 'Low'
        },
        {
          id: 'PP-005',
          employeeId: 'EMP-005',
          employeeName: 'Jose Martinez',
          department: 'Maintenance',
          payrollType: 'Weekly',
          period: '2024-09-09 to 2024-09-15',
          grossAmount: 1100.00,
          netAmount: 880.00,
          submittedDate: '2024-09-15',
          dueDate: '2024-09-17',
          status: 'Rejected',
          approver: 'Sarah Johnson',
          priority: 'High',
          notes: 'Hours verification required'
        }
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'Approved' as const, approver: session?.user?.name || 'Current User' }
        : payment
    ))
    alert('Payment approved successfully!')
  }

  const handleReject = (paymentId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: 'Rejected' as const, 
              approver: session?.user?.name || 'Current User',
              notes: reason
            }
          : payment
      ))
      alert('Payment rejected successfully!')
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = !selectedStatus || payment.status === selectedStatus
    const matchesType = !selectedType || payment.payrollType === selectedType
    const matchesPriority = !selectedPriority || payment.priority === selectedPriority
    return matchesStatus && matchesType && matchesPriority
  })

  const totalPendingAmount = filteredPayments
    .filter(p => p.status === 'Pending Approval')
    .reduce((sum, p) => sum + p.netAmount, 0)

  const pendingCount = filteredPayments.filter(p => p.status === 'Pending Approval').length
  const approvedCount = filteredPayments.filter(p => p.status === 'Approved').length
  const processingCount = filteredPayments.filter(p => p.status === 'Processing').length

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <Clock className="h-8 w-8 mr-3 text-indigo-600" /> Pending Payments
            </h1>
            <p className="text-gray-600 mt-2">Review and approve payroll payments awaiting authorization</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{processingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${totalPendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Processing">Processing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payroll Type</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select 
                value={selectedPriority} 
                onChange={e => setSelectedPriority(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Pending Payments Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.payrollType}</div>
                      <div className="text-sm text-gray-500">{payment.period}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Gross: ${payment.grossAmount.toLocaleString()}</div>
                      <div className="text-sm font-medium text-green-600">Net: ${payment.netAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Submitted: {payment.submittedDate}</div>
                      <div className="text-sm text-gray-500">Due: {payment.dueDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.priority === 'High' ? 'bg-red-100 text-red-800' :
                        payment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {payment.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'Pending Approval' && <Clock className="h-3 w-3 mr-1" />}
                        {payment.status === 'Approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'Processing' && <Users className="h-3 w-3 mr-1" />}
                        {payment.status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {payment.status}
                      </span>
                      {payment.approver && (
                        <div className="text-xs text-gray-500 mt-1">By: {payment.approver}</div>
                      )}
                      {payment.notes && (
                        <div className="text-xs text-gray-500 mt-1" title={payment.notes}>
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          Notes available
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {payment.status === 'Pending Approval' && (
                          <>
                            <button 
                              onClick={() => handleApprove(payment.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(payment.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
