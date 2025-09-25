'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { CircleAlert as AlertCircle, Search, Eye, Download, FileText, Users, Calendar, DollarSign, Heart } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface DisabilitySummary {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  position: string
  disabilityType: 'Work Injury' | 'General Illness' | 'Maternity' | 'Occupational Disease' | 'Other'
  startDate: string
  endDate: string
  totalDays: number
  imssPayment: number
  companyPayment: number
  totalPayment: number
  certificateNumber: string
  doctorName: string
  status: 'Active' | 'Completed' | 'Extended' | 'Cancelled'
  returnToWorkDate?: string
  medicalRestrictions?: string
}

export default function ResumenIncapacidadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [disabilities, setDisabilities] = useState<DisabilitySummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchDisabilitySummary()
  }, [session, status, router])

  const fetchDisabilitySummary = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockDisabilities: DisabilitySummary[] = [
        {
          id: 'DS-001',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          position: 'Machine Operator',
          disabilityType: 'Work Injury',
          startDate: '2024-09-15',
          endDate: '2024-09-29',
          totalDays: 14,
          imssPayment: 1680.00,
          companyPayment: 420.00,
          totalPayment: 2100.00,
          certificateNumber: 'IMSS-2024-001234',
          doctorName: 'Dr. Martinez Lopez',
          status: 'Active',
          medicalRestrictions: 'No heavy lifting, limited standing'
        },
        {
          id: 'DS-002',
          employeeCode: 'WC002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          position: 'HR Manager',
          disabilityType: 'General Illness',
          startDate: '2024-09-10',
          endDate: '2024-09-17',
          totalDays: 7,
          imssPayment: 1344.00,
          companyPayment: 336.00,
          totalPayment: 1680.00,
          certificateNumber: 'IMSS-2024-001235',
          doctorName: 'Dr. Ana Gutierrez',
          status: 'Completed',
          returnToWorkDate: '2024-09-18'
        },
        {
          id: 'DS-003',
          employeeCode: 'WC003',
          employeeName: 'Maria Gonzalez',
          department: 'Engineering',
          position: 'Design Engineer',
          disabilityType: 'Maternity',
          startDate: '2024-08-01',
          endDate: '2024-11-01',
          totalDays: 92,
          imssPayment: 22080.00,
          companyPayment: 5520.00,
          totalPayment: 27600.00,
          certificateNumber: 'IMSS-2024-001200',
          doctorName: 'Dr. Carmen Ruiz',
          status: 'Active'
        }
      ]
      
      setDisabilities(mockDisabilities)
    } catch (error) {
      console.error('Error fetching disability summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDisabilities = disabilities.filter(disability => {
    const matchesSearch = disability.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          disability.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || disability.disabilityType === selectedType
    const matchesStatus = !selectedStatus || disability.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const disabilityTypes = Array.from(new Set(disabilities.map(d => d.disabilityType)))
  const activeCount = disabilities.filter(d => d.status === 'Active').length
  const totalDays = disabilities.reduce((sum, d) => sum + d.totalDays, 0)
  const totalPayment = disabilities.reduce((sum, d) => sum + d.totalPayment, 0)

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
              <Heart className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Incapacidad
            </h1>
            <p className="text-gray-600 mt-2">Employee disability leave tracking and IMSS coordination</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900">${totalPayment.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{disabilities.length}</p>
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
              <label className="block text-sm font-medium mb-2">Disability Type</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                {disabilityTypes.map(type => <option key={type} value={type}>{type}</option>)}
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
                <option value="Completed">Completed</option>
                <option value="Extended">Extended</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Disability Summary Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDisabilities.map(disability => (
                  <tr key={disability.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{disability.employeeName}</div>
                      <div className="text-sm text-gray-500">{disability.employeeCode}</div>
                      <div className="text-sm text-gray-500">{disability.department} - {disability.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{disability.disabilityType}</div>
                      <div className="text-sm text-gray-500">Dr. {disability.doctorName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{disability.startDate}</div>
                      <div className="text-sm text-gray-500">to {disability.endDate}</div>
                      {disability.returnToWorkDate && (
                        <div className="text-sm text-green-600">Returned: {disability.returnToWorkDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{disability.totalDays}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">IMSS: ${disability.imssPayment.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">Company: ${disability.companyPayment.toLocaleString()}</div>
                      <div className="text-sm font-medium text-green-600">Total: ${disability.totalPayment.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{disability.certificateNumber}</div>
                      {disability.medicalRestrictions && (
                        <div className="text-xs text-orange-600 mt-1">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          Restrictions
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        disability.status === 'Active' ? 'bg-yellow-100 text-yellow-800' :
                        disability.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        disability.status === 'Extended' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {disability.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <FileText className="h-4 w-4" />
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