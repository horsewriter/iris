'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { CircleCheck as CheckCircle, Search, Eye, Download, Calendar, Users, Clock, DollarSign, FileText } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PermissionSummary {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  position: string
  permissionType: 'Medical Appointment' | 'Personal Leave' | 'Bereavement' | 'Jury Duty' | 'Other'
  startDate: string
  endDate: string
  hoursRequested: number
  isPaid: boolean
  payImpact: number
  approvalStatus: 'Approved' | 'Pending' | 'Rejected'
  approvedBy: string
  reason: string
  documentation: boolean
}

export default function ResumenPermisosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<PermissionSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPermissionSummary()
  }, [session, status, router])

  const fetchPermissionSummary = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockPermissions: PermissionSummary[] = [
        {
          id: 'PS-001',
          employeeCode: 'WC001',
          employeeName: 'John Smith',
          department: 'Engineering',
          position: 'Senior Engineer',
          permissionType: 'Medical Appointment',
          startDate: '2024-09-25',
          endDate: '2024-09-25',
          hoursRequested: 4,
          isPaid: true,
          payImpact: 0,
          approvalStatus: 'Approved',
          approvedBy: 'Engineering Manager',
          reason: 'Annual medical checkup',
          documentation: true
        },
        {
          id: 'PS-002',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          permissionType: 'Personal Leave',
          startDate: '2024-09-24',
          endDate: '2024-09-24',
          hoursRequested: 2,
          isPaid: false,
          payImpact: 37.00,
          approvalStatus: 'Approved',
          approvedBy: 'Production Supervisor',
          reason: 'Family emergency',
          documentation: false
        },
        {
          id: 'PS-003',
          employeeCode: 'WC002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          position: 'HR Manager',
          permissionType: 'Bereavement',
          startDate: '2024-09-23',
          endDate: '2024-09-25',
          hoursRequested: 24,
          isPaid: true,
          payImpact: 0,
          approvalStatus: 'Approved',
          approvedBy: 'Director of Operations',
          reason: 'Death of immediate family member',
          documentation: true
        }
      ]
      
      setPermissions(mockPermissions)
    } catch (error) {
      console.error('Error fetching permission summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          permission.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || permission.permissionType === selectedType
    const matchesStatus = !selectedStatus || permission.approvalStatus === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const permissionTypes = Array.from(new Set(permissions.map(p => p.permissionType)))
  const totalHours = permissions.reduce((sum, p) => sum + p.hoursRequested, 0)
  const totalPayImpact = permissions.reduce((sum, p) => sum + p.payImpact, 0)
  const pendingCount = permissions.filter(p => p.approvalStatus === 'Pending').length

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
              <CheckCircle className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Permisos
            </h1>
            <p className="text-gray-600 mt-2">Employee permission requests and approvals tracking</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pay Impact</p>
                  <p className="text-2xl font-bold text-gray-900">${totalPayImpact.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
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
                  placeholder="Search by name or code..." 
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Permission Type</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                {permissionTypes.map(type => <option key={type} value={type}>{type}</option>)}
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
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPermissions.map(permission => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{permission.employeeName}</div>
                      <div className="text-sm text-gray-500">{permission.employeeCode}</div>
                      <div className="text-sm text-gray-500">{permission.department} - {permission.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{permission.permissionType}</div>
                      <div className="text-sm text-gray-500">{permission.reason}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{permission.startDate}</div>
                      {permission.startDate !== permission.endDate && (
                        <div className="text-sm text-gray-500">to {permission.endDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{permission.hoursRequested}h</div>
                      <div className={`text-sm ${permission.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {permission.isPaid ? 'Paid' : 'Unpaid'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${permission.payImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {permission.payImpact > 0 ? `-$${permission.payImpact.toLocaleString()}` : '$0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          permission.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          permission.approvalStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {permission.approvalStatus}
                        </span>
                        {permission.approvedBy && (
                          <div className="text-xs text-gray-500 mt-1">By: {permission.approvedBy}</div>
                        )}
                        {permission.documentation && (
                          <div className="text-xs text-blue-600 mt-1">
                            <FileText className="h-3 w-3 inline mr-1" />
                            Documented
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
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