'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Search, Download, Edit, Eye, Users
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

type EmployeeType = 'Blue Collar' | 'White Collar'

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

interface WhiteCollarEmployee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  department: string
  plant: string
  position: string
  hireDate: string
  biweeklySalary: number
  annualSalary: number
  savingsFund: number
  savingsBox: number
  vacationDaysAccrued: number
  vacationDaysUsed: number
  taxWithholding: number
  status: 'Active' | 'Inactive' | 'On Leave'
}

type Employee = (BlueCollarEmployee | WhiteCollarEmployee) & { type: EmployeeType }

export default function EmployeesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedPlant, setSelectedPlant] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchEmployees()
  }, [session, status, router])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // simulate network delay

      const blue: Employee[] = [
        {
          id: 'BC-1',
          employeeCode: 'BC001',
          firstName: 'Carlos',
          lastName: 'Rodriguez',
          department: 'Production',
          plant: 'Plant A',
          position: 'Machine Operator',
          hireDate: '2021-03-15',
          hourlyRate: 18.5,
          weeklyHours: 48,
          weeklySalary: 888,
          annualSalary: 46176,
          savingsFund: 8000,
          savingsBox: 6500,
          vacationDaysAccrued: 12,
          vacationDaysUsed: 4,
          taxWithholding: 11544,
          status: 'Active',
          type: 'Blue Collar'
        },
        {
          id: 'BC-2',
          employeeCode: 'BC002',
          firstName: 'Maria',
          lastName: 'Garcia',
          department: 'Quality Control',
          plant: 'Plant A',
          position: 'QC Inspector',
          hireDate: '2020-01-10',
          hourlyRate: 20,
          weeklyHours: 48,
          weeklySalary: 960,
          annualSalary: 49920,
          savingsFund: 12000,
          savingsBox: 10000,
          vacationDaysAccrued: 18,
          vacationDaysUsed: 6,
          taxWithholding: 12480,
          status: 'Active',
          type: 'Blue Collar'
        }
      ]

      const white: Employee[] = [
        {
          id: 'WC-1',
          employeeCode: 'WC001',
          firstName: 'John',
          lastName: 'Smith',
          department: 'Engineering',
          plant: 'Plant A',
          position: 'Senior Engineer',
          hireDate: '2020-03-15',
          biweeklySalary: 3846.15,
          annualSalary: 100000,
          savingsFund: 15000,
          savingsBox: 12000,
          vacationDaysAccrued: 18.5,
          vacationDaysUsed: 5,
          taxWithholding: 25000,
          status: 'Active',
          type: 'White Collar'
        },
        {
          id: 'WC-2',
          employeeCode: 'WC002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          department: 'Administration',
          plant: 'Plant A',
          position: 'HR Manager',
          hireDate: '2019-01-10',
          biweeklySalary: 2884.62,
          annualSalary: 75000,
          savingsFund: 18000,
          savingsBox: 15000,
          vacationDaysAccrued: 22,
          vacationDaysUsed: 8,
          taxWithholding: 18750,
          status: 'Active',
          type: 'White Collar'
        }
      ]

      setEmployees([...blue, ...white])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    alert('Employee data exported successfully!')
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || emp.department === selectedDepartment
    const matchesPlant = !selectedPlant || emp.plant === selectedPlant
    const matchesStatus = !selectedStatus || emp.status === selectedStatus
    return matchesSearch && matchesDept && matchesPlant && matchesStatus
  })

  const departments = Array.from(new Set(employees.map(emp => emp.department)))
  const plants = Array.from(new Set(employees.map(emp => emp.plant)))

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
              <Users className="h-8 w-8 mr-3 text-indigo-600" /> Employees
            </h1>
            <button onClick={handleExportData} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md">
              <Download className="h-4 w-4 mr-2" /> Export Data
            </button>
          </div>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search employees..." className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500">
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Plant</label>
              <select value={selectedPlant} onChange={e => setSelectedPlant(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500">
                <option value="">All Plants</option>
                {plants.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department/Plant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary / Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{emp.type}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-sm text-gray-500">{emp.employeeCode}</div>
                      <div className="text-sm text-gray-500">{emp.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{emp.department}</div>
                      <div className="text-sm text-gray-500">{emp.plant}</div>
                    </td>
                    <td className="px-6 py-4">
                      {'hourlyRate' in emp ? 
                        <div>
                          <div className="text-sm text-gray-900">${emp.hourlyRate}/h</div>
                          <div className="text-sm text-gray-500">${emp.weeklySalary}/week</div>
                          <div className="text-sm text-gray-500">${emp.annualSalary}/year</div>
                        </div>
                        :
                        <div>
                          <div className="text-sm text-gray-900">${emp.annualSalary}/year</div>
                          <div className="text-sm text-gray-500">${emp.biweeklySalary}/bi-weekly</div>
                        </div>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Fund: ${emp.savingsFund.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Box: ${emp.savingsBox.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{emp.vacationDaysAccrued} accrued</div>
                      <div className="text-sm text-gray-500">{emp.vacationDaysUsed} used</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800' :
                        emp.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{emp.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                      <button className="text-green-600 hover:text-green-900"><Edit className="h-4 w-4" /></button>
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
