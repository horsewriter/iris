'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Search, Filter, Download, Edit, Eye, Users,
  DollarSign, Calendar, PiggyBank, Building, Clock
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface BlueCollarEmployee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  department: string
  plant: string
  position: string
  hireDate: string
  hourlyRate: number
  weeklyHours: number
  weeklySalary: number
  annualSalary: number
  savingsFund: number
  savingsBox: number
  vacationDaysAccrued: number
  vacationDaysUsed: number
  taxWithholding: number
  status: 'Active' | 'Inactive' | 'On Leave'
}

export default function BlueCollarEmployeesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<BlueCollarEmployee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedPlant, setSelectedPlant] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchBlueCollarEmployees()
  }, [session, status, router])

  const fetchBlueCollarEmployees = async () => {
    try {
      setLoading(true)
      // Simulate API call with fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockEmployees: BlueCollarEmployee[] = [
        {
          id: '1',
          employeeCode: 'BC001',
          firstName: 'Carlos',
          lastName: 'Rodriguez',
          department: 'Production',
          plant: 'Plant A',
          position: 'Machine Operator',
          hireDate: '2021-03-15',
          hourlyRate: 18.50,
          weeklyHours: 48,
          weeklySalary: 888,
          annualSalary: 46176,
          savingsFund: 8000,
          savingsBox: 6500,
          vacationDaysAccrued: 12,
          vacationDaysUsed: 4,
          taxWithholding: 11544,
          status: 'Active'
        },
        {
          id: '2',
          employeeCode: 'BC002',
          firstName: 'Maria',
          lastName: 'Garcia',
          department: 'Quality Control',
          plant: 'Plant A',
          position: 'QC Inspector',
          hireDate: '2020-01-10',
          hourlyRate: 20.00,
          weeklyHours: 48,
          weeklySalary: 960,
          annualSalary: 49920,
          savingsFund: 12000,
          savingsBox: 10000,
          vacationDaysAccrued: 18,
          vacationDaysUsed: 6,
          taxWithholding: 12480,
          status: 'Active'
        },
        {
          id: '3',
          employeeCode: 'BC003',
          firstName: 'James',
          lastName: 'Wilson',
          department: 'Maintenance',
          plant: 'Plant B',
          position: 'Maintenance Technician',
          hireDate: '2019-06-01',
          hourlyRate: 22.00,
          weeklyHours: 48,
          weeklySalary: 1056,
          annualSalary: 54912,
          savingsFund: 15000,
          savingsBox: 12500,
          vacationDaysAccrued: 22,
          vacationDaysUsed: 8,
          taxWithholding: 13728,
          status: 'Active'
        },
        {
          id: '4',
          employeeCode: 'BC004',
          firstName: 'Lisa',
          lastName: 'Thompson',
          department: 'Warehouse',
          plant: 'Plant C',
          position: 'Forklift Operator',
          hireDate: '2022-02-14',
          hourlyRate: 16.50,
          weeklyHours: 48,
          weeklySalary: 792,
          annualSalary: 41184,
          savingsFund: 4000,
          savingsBox: 3200,
          vacationDaysAccrued: 8,
          vacationDaysUsed: 2,
          taxWithholding: 10296,
          status: 'Active'
        },
        {
          id: '5',
          employeeCode: 'BC005',
          firstName: 'Robert',
          lastName: 'Johnson',
          department: 'Production',
          plant: 'Plant A',
          position: 'Assembly Worker',
          hireDate: '2018-09-20',
          hourlyRate: 19.25,
          weeklyHours: 48,
          weeklySalary: 924,
          annualSalary: 48048,
          savingsFund: 18000,
          savingsBox: 15000,
          vacationDaysAccrued: 25,
          vacationDaysUsed: 10,
          taxWithholding: 12012,
          status: 'Active'
        },
        {
          id: '6',
          employeeCode: 'BC006',
          firstName: 'Ana',
          lastName: 'Martinez',
          department: 'Quality Control',
          plant: 'Plant B',
          position: 'Lab Technician',
          hireDate: '2021-11-05',
          hourlyRate: 21.00,
          weeklyHours: 48,
          weeklySalary: 1008,
          annualSalary: 52416,
          savingsFund: 6000,
          savingsBox: 4800,
          vacationDaysAccrued: 10,
          vacationDaysUsed: 3,
          taxWithholding: 13104,
          status: 'Active'
        }
      ]
      
      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error fetching blue collar employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      console.log('Exporting blue collar employee data...')
      alert('Employee data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment
    const matchesPlant = !selectedPlant || employee.plant === selectedPlant
    const matchesStatus = !selectedStatus || employee.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesPlant && matchesStatus
  })

  const departments = Array.from(new Set(employees.map(emp => emp.department)))
  const plants = Array.from(new Set(employees.map(emp => emp.plant)))

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <PayrollSidebar />
        
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="h-8 w-8 mr-3 text-indigo-600" />
                  Blue Collar Employees
                </h1>
                <p className="mt-2 text-gray-600">Weekly wage employees - {filteredEmployees.length} total</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Hourly Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(employees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / employees.length).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PiggyBank className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${employees.reduce((sum, emp) => sum + emp.savingsFund + emp.savingsBox, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Vacation Days</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(employees.reduce((sum, emp) => sum + emp.vacationDaysAccrued, 0) / employees.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plant</label>
                <select
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Plants</option>
                  {plants.map((plant) => (
                    <option key={plant} value={plant}>{plant}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department/Plant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{employee.employeeCode}</div>
                          <div className="text-sm text-gray-500">{employee.position}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.department}</div>
                        <div className="text-sm text-gray-500">{employee.plant}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${employee.hourlyRate}/hour</div>
                        <div className="text-sm text-gray-500">${employee.weeklySalary}/week ({employee.weeklyHours}h)</div>
                        <div className="text-sm text-gray-500">${employee.annualSalary.toLocaleString()}/year</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Fund: ${employee.savingsFund.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Box: ${employee.savingsBox.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.vacationDaysAccrued} accrued</div>
                        <div className="text-sm text-gray-500">{employee.vacationDaysUsed} used</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                          employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
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
    </div>
  )
}