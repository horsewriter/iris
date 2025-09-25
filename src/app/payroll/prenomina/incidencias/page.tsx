'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  AlertCircle, Search, Eye, Download, Filter,
  Users, Clock, XCircle, CheckCircle
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface PayrollIncident {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  incidentType: 'Late Arrival' | 'Early Departure' | 'Missed Punch' | 'Overtime Discrepancy' | 'Absence'
  date: string
  description: string
  impact: string
  resolution: string
  status: 'Open' | 'Resolved' | 'Pending Review'
  reportedBy: string
  resolvedBy?: string
  createdAt: string
  resolvedAt?: string
}

export default function ResumenIncidenciasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [incidents, setIncidents] = useState<PayrollIncident[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchPayrollIncidents()
  }, [session, status, router])

  const fetchPayrollIncidents = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockIncidents: PayrollIncident[] = [
        {
          id: 'PI-001',
          employeeCode: 'BC001',
          employeeName: 'Carlos Rodriguez',
          department: 'Production',
          incidentType: 'Late Arrival',
          date: '2024-09-23',
          description: 'Employee arrived 30 minutes late due to traffic',
          impact: 'Lost 0.5 hours of regular time',
          resolution: 'Deducted from regular hours, no disciplinary action',
          status: 'Resolved',
          reportedBy: 'Production Supervisor',
          resolvedBy: 'HR Manager',
          createdAt: '2024-09-23T08:30:00Z',
          resolvedAt: '2024-09-23T10:00:00Z'
        },
        {
          id: 'PI-002',
          employeeCode: 'WC002',
          employeeName: 'Sarah Johnson',
          department: 'Administration',
          incidentType: 'Missed Punch',
          date: '2024-09-24',
          description: 'Employee forgot to clock out at end of day',
          impact: 'Unable to calculate exact work hours',
          resolution: 'Manager confirmed 8-hour workday',
          status: 'Resolved',
          reportedBy: 'System Alert',
          resolvedBy: 'Payroll Specialist',
          createdAt: '2024-09-24T18:00:00Z',
          resolvedAt: '2024-09-25T09:15:00Z'
        },
        {
          id: 'PI-003',
          employeeCode: 'BC003',
          employeeName: 'Jose Martinez',
          department: 'Maintenance',
          incidentType: 'Overtime Discrepancy',
          date: '2024-09-25',
          description: 'Overtime hours recorded do not match supervisor approval',
          impact: '2 hours of overtime in question',
          resolution: 'Pending supervisor verification',
          status: 'Pending Review',
          reportedBy: 'Payroll System',
          createdAt: '2024-09-25T17:30:00Z'
        }
      ]
      
      setIncidents(mockIncidents)
    } catch (error) {
      console.error('Error fetching payroll incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { 
        ...inc, 
        status: 'Resolved' as const,
        resolvedBy: session?.user?.name || 'Current User',
        resolvedAt: new Date().toISOString()
      } : inc
    ))
    alert('Incident resolved successfully!')
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          incident.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || incident.incidentType === selectedType
    const matchesStatus = !selectedStatus || incident.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const incidentTypes = Array.from(new Set(incidents.map(i => i.incidentType)))
  const openCount = incidents.filter(i => i.status === 'Open').length
  const pendingCount = incidents.filter(i => i.status === 'Pending Review').length
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length

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
              <AlertCircle className="h-8 w-8 mr-3 text-indigo-600" /> Resumen de Incidencias
            </h1>
            <p className="text-gray-600 mt-2">Track and resolve payroll-related incidents</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Incidents</p>
                  <p className="text-2xl font-bold text-gray-900">{openCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                  <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by employee..." 
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Incident Type</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                {incidentTypes.map(type => <option key={type} value={type}>{type}</option>)}
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
                <option value="Open">Open</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Incidents Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncidents.map(incident => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{incident.employeeName}</div>
                      <div className="text-sm text-gray-500">{incident.employeeCode}</div>
                      <div className="text-sm text-gray-500">{incident.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{incident.incidentType}</div>
                      <div className="text-sm text-gray-500">{incident.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{incident.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{incident.impact}</div>
                      {incident.resolution && (
                        <div className="text-sm text-green-600">{incident.resolution}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        incident.status === 'Open' ? 'bg-red-100 text-red-800' :
                        incident.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {incident.status === 'Pending Review' && (
                          <button 
                            onClick={() => handleResolveIncident(incident.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
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