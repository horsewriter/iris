'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Calendar, Search, Eye, Download, Edit,
  Users, Clock, Building, CheckCircle
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface WeeklySchedule {
  id: string
  weekOf: string
  department: string
  shift: string
  totalEmployees: number
  scheduleType: 'Standard' | 'Rotating' | 'Flexible' | 'Overtime'
  monday: { start: string; end: string; employees: number }
  tuesday: { start: string; end: string; employees: number }
  wednesday: { start: string; end: string; employees: number }
  thursday: { start: string; end: string; employees: number }
  friday: { start: string; end: string; employees: number }
  saturday: { start: string; end: string; employees: number }
  sunday: { start: string; end: string; employees: number }
  totalHours: number
  status: 'Draft' | 'Published' | 'Active' | 'Completed'
  createdBy: string
  lastModified: string
}

export default function HorariosSemanalesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [schedules, setSchedules] = useState<WeeklySchedule[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchWeeklySchedules()
  }, [session, status, router])

  const fetchWeeklySchedules = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockSchedules: WeeklySchedule[] = [
        {
          id: 'WS-001',
          weekOf: '2024-09-23',
          department: 'Production',
          shift: 'Day Shift',
          totalEmployees: 45,
          scheduleType: 'Standard',
          monday: { start: '07:00', end: '15:00', employees: 45 },
          tuesday: { start: '07:00', end: '15:00', employees: 45 },
          wednesday: { start: '07:00', end: '15:00', employees: 45 },
          thursday: { start: '07:00', end: '15:00', employees: 45 },
          friday: { start: '07:00', end: '15:00', employees: 45 },
          saturday: { start: '07:00', end: '15:00', employees: 45 },
          sunday: { start: 'OFF', end: 'OFF', employees: 0 },
          totalHours: 2160,
          status: 'Active',
          createdBy: 'Production Manager',
          lastModified: '2024-09-20T14:30:00Z'
        },
        {
          id: 'WS-002',
          weekOf: '2024-09-23',
          department: 'Engineering',
          shift: 'Standard',
          totalEmployees: 25,
          scheduleType: 'Flexible',
          monday: { start: '08:00', end: '17:00', employees: 25 },
          tuesday: { start: '08:00', end: '17:00', employees: 25 },
          wednesday: { start: '08:00', end: '17:00', employees: 25 },
          thursday: { start: '08:00', end: '17:00', employees: 25 },
          friday: { start: '08:00', end: '17:00', employees: 25 },
          saturday: { start: 'OFF', end: 'OFF', employees: 0 },
          sunday: { start: 'OFF', end: 'OFF', employees: 0 },
          totalHours: 1000,
          status: 'Published',
          createdBy: 'Engineering Manager',
          lastModified: '2024-09-19T16:00:00Z'
        }
      ]
      
      setSchedules(mockSchedules)
    } catch (error) {
      console.error('Error fetching weekly schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublishSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(sched => 
      sched.id === scheduleId ? { ...sched, status: 'Published' as const } : sched
    ))
    alert('Schedule published successfully!')
  }

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.shift.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || schedule.department === selectedDepartment
    const matchesStatus = !selectedStatus || schedule.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const departments = Array.from(new Set(schedules.map(s => s.department)))
  const activeSchedules = schedules.filter(s => s.status === 'Active').length
  const totalEmployeesScheduled = schedules.reduce((sum, s) => sum + s.totalEmployees, 0)

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
              <Calendar className="h-8 w-8 mr-3 text-indigo-600" /> Horarios Semanales
            </h1>
            <p className="text-gray-600 mt-2">Weekly schedule management and planning</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSchedules}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employees Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmployeesScheduled}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schedules.reduce((sum, s) => sum + s.totalHours, 0).toLocaleString()}
                  </p>
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
                  placeholder="Search by department or shift..." 
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
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Weekly Schedules */}
          {filteredSchedules.map(schedule => (
            <div key={schedule.id} className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {schedule.department} - {schedule.shift}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Week of {new Date(schedule.weekOf).toLocaleDateString('es-MX')} • {schedule.totalEmployees} employees
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    schedule.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    schedule.status === 'Published' ? 'bg-blue-100 text-blue-800' :
                    schedule.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {schedule.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4">
                  {[
                    { day: 'Monday', data: schedule.monday },
                    { day: 'Tuesday', data: schedule.tuesday },
                    { day: 'Wednesday', data: schedule.wednesday },
                    { day: 'Thursday', data: schedule.thursday },
                    { day: 'Friday', data: schedule.friday },
                    { day: 'Saturday', data: schedule.saturday },
                    { day: 'Sunday', data: schedule.sunday }
                  ].map(({ day, data }) => (
                    <div key={day} className="text-center p-4 border rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">{day}</div>
                      {data.start === 'OFF' ? (
                        <div className="text-gray-400">OFF</div>
                      ) : (
                        <>
                          <div className="text-sm text-gray-600">{data.start} - {data.end}</div>
                          <div className="text-sm font-medium text-blue-600">{data.employees} emp</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Schedule Type:</span> {schedule.scheduleType}
                  </div>
                  <div>
                    <span className="font-medium">Total Hours:</span> {schedule.totalHours.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Created by:</span> {schedule.createdBy}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}