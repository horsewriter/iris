'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { Calendar, Download, Search, Eye, ListFilter as Filter, Users, Clock, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface DailyAttendance {
  id: string
  date: string
  totalEmployees: number
  presentEmployees: number
  absentEmployees: number
  lateEmployees: number
  overtimeEmployees: number
  attendanceRate: number
  totalHours: number
  regularHours: number
  overtimeHours: number
  departmentBreakdown: {
    department: string
    present: number
    absent: number
    late: number
    total: number
  }[]
}

export default function AsistenciaDiariaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendanceData] = useState<DailyAttendance[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchDailyAttendance()
  }, [session, status, router])

  const fetchDailyAttendance = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockAttendance: DailyAttendance[] = [
        {
          id: 'DA-001',
          date: '2024-09-23',
          totalEmployees: 205,
          presentEmployees: 195,
          absentEmployees: 8,
          lateEmployees: 12,
          overtimeEmployees: 45,
          attendanceRate: 95.1,
          totalHours: 1950,
          regularHours: 1560,
          overtimeHours: 390,
          departmentBreakdown: [
            { department: 'Production', present: 85, absent: 3, late: 5, total: 90 },
            { department: 'Quality Control', present: 28, absent: 2, late: 2, total: 30 },
            { department: 'Engineering', present: 32, absent: 1, late: 2, total: 35 },
            { department: 'Maintenance', present: 22, absent: 1, late: 2, total: 25 },
            { department: 'Administration', present: 18, absent: 1, late: 1, total: 20 }
          ]
        },
        {
          id: 'DA-002',
          date: '2024-09-24',
          totalEmployees: 205,
          presentEmployees: 198,
          absentEmployees: 5,
          lateEmployees: 8,
          overtimeEmployees: 52,
          attendanceRate: 96.6,
          totalHours: 1980,
          regularHours: 1584,
          overtimeHours: 396,
          departmentBreakdown: [
            { department: 'Production', present: 88, absent: 1, late: 3, total: 90 },
            { department: 'Quality Control', present: 29, absent: 1, late: 1, total: 30 },
            { department: 'Engineering', present: 34, absent: 1, late: 2, total: 35 },
            { department: 'Maintenance', present: 24, absent: 1, late: 1, total: 25 },
            { department: 'Administration', present: 19, absent: 1, late: 1, total: 20 }
          ]
        }
      ]
      
      setAttendanceData(mockAttendance)
    } catch (error) {
      console.error('Error fetching daily attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportAttendance = (date: string) => {
    alert(`Exporting attendance for ${date}...`)
  }

  const filteredAttendance = attendanceData.filter(data => {
    const matchesDate = !selectedDate || data.date === selectedDate
    return matchesDate
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Resumen Diario de Asistencia
            </h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select 
                value={selectedDepartment} 
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Departments</option>
                <option value="Production">Production</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Engineering">Engineering</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
          </div>

          {/* Daily Attendance Cards */}
          {filteredAttendance.map(data => (
            <div key={data.id} className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {new Date(data.date).toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button 
                  onClick={() => handleExportAttendance(data.date)}
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Download className="h-4 w-4 mr-1" /> Export
                </button>
              </div>
              
              {/* Summary Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{data.presentEmployees}</div>
                    <div className="text-sm text-green-700">Present</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{data.absentEmployees}</div>
                    <div className="text-sm text-red-700">Absent</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{data.lateEmployees}</div>
                    <div className="text-sm text-yellow-700">Late</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{data.overtimeEmployees}</div>
                    <div className="text-sm text-blue-700">Overtime</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{data.attendanceRate.toFixed(1)}%</div>
                    <div className="text-sm text-purple-700">Rate</div>
                  </div>
                </div>

                {/* Department Breakdown */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.departmentBreakdown.map(dept => (
                        <tr key={dept.department} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{dept.department}</td>
                          <td className="px-4 py-2 text-sm text-green-600">{dept.present}</td>
                          <td className="px-4 py-2 text-sm text-red-600">{dept.absent}</td>
                          <td className="px-4 py-2 text-sm text-yellow-600">{dept.late}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{dept.total}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {((dept.present / dept.total) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}