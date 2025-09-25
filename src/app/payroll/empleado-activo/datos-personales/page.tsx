'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Users, Search, Eye, Edit, Download,
  Mail, Phone, MapPin, Calendar, FileText
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface EmployeePersonalData {
  id: string
  employeeCode: string
  fullName: string
  firstName: string
  lastName: string
  birthDate: string
  age: number
  gender: string
  maritalStatus: string
  nationality: string
  contactInfo: {
    email: string
    personalEmail: string
    phone: string
    cellPhone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    address: string
  }
  identification: {
    nss: string
    rfc: string
    curp: string
    ine: string
    passport?: string
  }
  bankInfo: {
    bankName: string
    accountNumber: string
    clabe: string
  }
  lastUpdated: string
}

export default function DatosPersonalesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<EmployeePersonalData[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePersonalData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchEmployeePersonalData()
  }, [session, status, router])

  const fetchEmployeePersonalData = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockEmployees: EmployeePersonalData[] = [
        {
          id: 'EPD-001',
          employeeCode: 'WC001',
          fullName: 'John Smith',
          firstName: 'John',
          lastName: 'Smith',
          birthDate: '1985-06-15',
          age: 39,
          gender: 'Male',
          maritalStatus: 'Married',
          nationality: 'American',
          contactInfo: {
            email: 'john.smith@company.com',
            personalEmail: 'john.smith.personal@gmail.com',
            phone: '+1-555-0123',
            cellPhone: '+1-555-0124',
            address: '123 Main St',
            city: 'San Luis Potosi',
            state: 'SLP',
            zipCode: '78000'
          },
          emergencyContact: {
            name: 'Jane Smith',
            relationship: 'Spouse',
            phone: '+1-555-0125',
            address: '123 Main St, San Luis Potosi, SLP'
          },
          identification: {
            nss: '12345678901',
            rfc: 'SMJO850615ABC',
            curp: 'SMJO850615HDFRHN01',
            ine: 'SMJOHN8506151234',
            passport: 'US123456789'
          },
          bankInfo: {
            bankName: 'BBVA Bancomer',
            accountNumber: '0123456789',
            clabe: '012345678901234567'
          },
          lastUpdated: '2024-09-20T10:30:00Z'
        }
      ]
      
      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error fetching employee personal data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <Users className="h-8 w-8 mr-3 text-indigo-600" /> Datos Personales
            </h1>
            <p className="text-gray-600 mt-2">Employee personal information management</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or employee code..." 
                className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          {/* Employee Selection */}
          <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{emp.fullName}</div>
                      <div className="text-sm text-gray-500">{emp.employeeCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{emp.contactInfo.email}</div>
                      <div className="text-sm text-gray-500">{emp.contactInfo.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Age: {emp.age}</div>
                      <div className="text-sm text-gray-500">{emp.gender} • {emp.maritalStatus}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(emp.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button 
                        onClick={() => setSelectedEmployee(emp)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Employee Details */}
          {selectedEmployee && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">First Name</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Name</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.lastName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Birth Date</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Age</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.age} years</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gender</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Marital Status</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.maritalStatus}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nationality</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.nationality}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Work Email</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Personal Email</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contactInfo.personalEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cell Phone</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.contactInfo.cellPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">
                        {selectedEmployee.contactInfo.address}, {selectedEmployee.contactInfo.city}, {selectedEmployee.contactInfo.state} {selectedEmployee.contactInfo.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Relationship</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.emergencyContact.address}</p>
                  </div>
                </div>
              </div>

              {/* Identification & Banking */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Identification & Banking</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">NSS</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.identification.nss}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">RFC</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.identification.rfc}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">CURP</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.identification.curp}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">INE</p>
                      <p className="text-sm text-gray-600">{selectedEmployee.identification.ine}</p>
                    </div>
                    {selectedEmployee.identification.passport && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Passport</p>
                        <p className="text-sm text-gray-600">{selectedEmployee.identification.passport}</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bank</p>
                        <p className="text-sm text-gray-600">{selectedEmployee.bankInfo.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Number</p>
                        <p className="text-sm text-gray-600">{selectedEmployee.bankInfo.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">CLABE</p>
                        <p className="text-sm text-gray-600">{selectedEmployee.bankInfo.clabe}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}