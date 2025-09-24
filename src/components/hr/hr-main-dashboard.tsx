'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import {
  PersonIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BarChartIcon,
  CalendarIcon,
  CheckCircledIcon,
  FileTextIcon,
  LightningBoltIcon,
  TokensIcon,
  ReaderIcon,
  CubeIcon,
  BellIcon,
  Cross1Icon,
} from '@radix-ui/react-icons'

// Mapped from the original lucide-react icons to Radix UI icons
const icons = {
  Users: PersonIcon,
  TrendingUp: BarChartIcon,
  DollarSign: TokensIcon,
  Calendar: CalendarIcon,
  AlertTriangle: LightningBoltIcon,
  CheckCircle: CheckCircledIcon,
  Clock: ReaderIcon,
  Building: CubeIcon,
  BarChart3: BarChartIcon,
  UserCheck: CheckCircledIcon,
  FileText: FileTextIcon,
  Shield: BellIcon,
  Plus: PlusIcon,
  XCircle: Cross1Icon,
  AlertCircle: LightningBoltIcon,
}

const commonClasses = {
  card: 'bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 w-full text-left',
  cardContent: 'p-6 flex items-center',
  cardBody: 'px-6 py-8',
  cardTitle: 'text-xl font-bold text-gray-900',
  button:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2',
  buttonPrimary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  buttonOutline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  input:
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  selectTrigger:
    'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
};

interface DashboardStats {
  totalEmployees: number
  activeRequests: number
  monthlyPayroll: number
  attendanceRate: number
  incidentCount: number
  approvedRequests: number
}

interface Employee {
  id: string
  name: string
  payrollNumber: string
  position: string
  department: string
  hireDate: string
  onboardingStatus: 'pending' | 'in-progress' | 'complete'
}

const positions = [
  { id: 'developer', title: 'Developer' },
  { id: 'manager', title: 'Manager' },
  { id: 'analyst', title: 'Analyst' },
  { id: 'engineer', title: 'Engineer' },
]

const departments = [
  { id: 'QCD', title: 'QCD' },
  { id: 'SCD', title: 'SCD' },
  { id: 'RDD', title: 'RDD' },
  { id: 'MMD', title: 'MMD' },
  { id: 'ADD', title: 'ADD' },
  { id: 'ADDIT', title: 'ADDIT' },
  { id: 'EQD', title: 'EQD' },
  { id: 'CSD', title: 'CSD' },
  { id: 'ADEHS', title: 'ADEHS' },
  { id: 'AD', title: 'AD' },
  { id: 'HRD', title: 'HRD' },
  { id: 'FD', title: 'FD' }
]

const formFields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'payrollNumber', label: 'Payroll Number', type: 'number', required: true },
  { name: 'positionId', label: 'Position', type: 'select', required: true, options: positions },
  { name: 'shift', label: 'Shift', type: 'text', required: true },
  { name: 'nss', label: 'NSS (Social Security)', type: 'text', required: true, maxLength: 11 },
  { name: 'rfc', label: 'RFC', type: 'text', required: true, maxLength: 13 },
  { name: 'curp', label: 'CURP', type: 'text', required: true, maxLength: 18 },
  { name: 'birthDate', label: 'Birth Date', type: 'date', required: true },
  { name: 'birthPlace', label: 'Birth Place', type: 'text', required: true },
  { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
    { id: 'M', title: 'Male' },
    { id: 'F', title: 'Female' },
    { id: 'Otro', title: 'Other' }
  ]},
  { name: 'bloodType', label: 'Blood Type', type: 'text', required: true },
  { name: 'plant', label: 'Plant', type: 'select', required: true, options: [
    { id: 'PM', title: 'PM' },
    { id: 'SSD', title: 'SSD' },
    { id: 'CHU', title: 'CHU' }
  ]},
  { name: 'department', label: 'Department', type: 'select', required: true, options: departments},
  { name: 'dailySalary', label: 'Daily Salary', type: 'number', required: true, step: '0.01' },
  { name: 'hireDate', label: 'Hire Date', type: 'date', required: true },
  { name: 'payrollType', label: 'Payroll Type', type: 'select', required: true, options: [
    { id: 'CATORCENAL', title: 'Bi-weekly' },
    { id: 'SEMANAL', title: 'Weekly' }
  ]},
  { name: 'source', label: 'Hiring Source', type: 'select', required: true, options: [
    { id: 'BESTJOBS', title: 'BestJobs' },
    { id: 'IMPRO', title: 'IMPRO' }
  ]},
  { name: 'transportRoute', label: 'Transport Route', type: 'select', required: true, options: [
    { id: 'RUTA_1', title: 'Route 1' },
    { id: 'RUTA_2', title: 'Route 2' },
    { id: 'RUTA_3', title: 'Route 3' }
  ]},
  { name: 'transportStop', label: 'Transport Stop', type: 'select', required: true, options: [
    { id: 'PARADA_1', title: 'Stop 1' },
    { id: 'PARADA_2', title: 'Stop 2' },
    { id: 'PARADA_3', title: 'Stop 3' }
  ]},
  { name: 'costCenter', label: 'Cost Center', type: 'text', required: true },
  { name: 'transportType', label: 'Transport Type', type: 'select', required: true, options: [
    { id: 'PROPIO', title: 'Own Transport' },
    { id: 'RUTA', title: 'Company Route' }
  ]},
  { name: 'bankAccount', label: 'Bank Account', type: 'text', required: true },
  { name: 'collarType', label: 'Collar Type', type: 'select', required: true, options: [
    { id: 'BLUECOLLAR', title: 'Blue Collar' },
    { id: 'WHITECOLLAR', title: 'White Collar' },
    { id: 'GREYCOLLAR', title: 'Grey Collar' }
  ]}
]

const OnboardingForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
      {formFields.map(field => (
        <div key={field.name} className="space-y-2">
          <Label.Root htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label.Root>
          {field.type === 'select' ? (
            <Select.Root
              onValueChange={value => handleSelectChange(field.name, value)}
              name={field.name}
            >
              <Select.Trigger className={commonClasses.selectTrigger}>
                <Select.Value placeholder={`Select a ${field.label.toLowerCase()}`} />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                  <Select.Viewport className="p-1">
                    {field.options?.map(option => (
                      <Select.Item
                        key={option.id}
                        value={option.id}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                      >
                        <Select.ItemText>{option.title}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              onChange={handleChange}
              required={field.required}
              className={commonClasses.input}
              maxLength={field.maxLength}
              step={field.step}
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
        >
          Add Employee
        </button>
      </div>
    </form>
  );
}

const EventScheduler = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    duration: '',
    attendees: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const eventTypes = [
    { id: 'interview-call', title: 'Entrevista: Llamada' },
    { id: 'interview-video-hr', title: 'Entrevista: Videollamada (HR)' },
    { id: 'interview-video-final', title: 'Entrevista: Videollamada (Final)' },
    { id: 'general', title: 'General' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
      <div className="space-y-2">
        <Label.Root htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </Label.Root>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className={commonClasses.input}
        />
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="type" className="text-sm font-medium">
          EventType <span className="text-red-500">*</span>
        </Label.Root>
        <Select.Root
          onValueChange={value => handleSelectChange('type', value)}
          value={formData.type}
        >
          <Select.Trigger className={commonClasses.selectTrigger}>
            <Select.Value placeholder="Select the event type" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
              <Select.Viewport className="p-1">
                {eventTypes.map(type => (
                  <Select.Item
                    key={type.id}
                    value={type.id}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                  >
                    <Select.ItemText>{type.title}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label.Root htmlFor="date" className="text-sm font-medium">
            Date <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={commonClasses.input}
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="time" className="text-sm font-medium">
            Start Time <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
            className={commonClasses.input}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="duration" className="text-sm font-medium">
          Duration (min)
        </Label.Root>
        <input
          id="duration"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          className={commonClasses.input}
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="attendees" className="text-sm font-medium">
          Members (separated with ",")
        </Label.Root>
        <input
          id="attendees"
          name="attendees"
          type="text"
          value={formData.attendees}
          onChange={handleChange}
          className={commonClasses.input}
        />
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="description" className="text-sm font-medium">
          Description
        </Label.Root>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`${commonClasses.input} h-24`}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
        >
          Schedule Event
        </button>
      </div>
    </form>
  );
};

export function HrMainDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeRequests: 0,
    monthlyPayroll: 0,
    attendanceRate: 0,
    incidentCount: 0,
    approvedRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false)
  const [isScheduleEventDialogOpen, setIsScheduleEventDialogOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setStats({
        totalEmployees: 156,
        activeRequests: 23,
        monthlyPayroll: 1250000,
        attendanceRate: 94.5,
        incidentCount: 7,
        approvedRequests: 89,
      })
      // Dummy data for employees
      setEmployees([
        { id: '1', name: 'Laura Mendoza', payrollNumber: 'P1001', position: 'Developer', department: 'ADDIT', hireDate: '2024-09-20', onboardingStatus: 'in-progress' },
        { id: '2', name: 'José Torres', payrollNumber: 'P1002', position: 'Manager', department: 'QCD', hireDate: '2024-09-18', onboardingStatus: 'pending' },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewEmployee = (newEmployeeData: any) => {
    const newEmployee = {
      id: (employees.length + 1).toString(),
      name: newEmployeeData.name,
      payrollNumber: newEmployeeData.payrollNumber,
      position: positions.find(p => p.id === newEmployeeData.positionId)?.title || 'N/A',
      department: departments.find(d => d.id === newEmployeeData.department)?.title || 'N/A',
      hireDate: newEmployeeData.hireDate,
      onboardingStatus: 'pending' as const,
    };
    setEmployees(prev => [...prev, newEmployee]);
    setIsAddEmployeeDialogOpen(false);
  }

  const handleCreateEvent = async (eventData: any) => {
    const start_time = eventData.date + 'T' + eventData.time + ':00';
    const duration_str = `PT${eventData.duration}M`;

    // Here you would make a call to the calendar API
    // The call would look something like this:
    // const event = await generic_calendar.create_calendar_event(
    //   title=eventData.title,
    //   start_date=eventData.date,
    //   start_time_of_day=eventData.time + ':00',
    //   duration=duration_str,
    //   description=eventData.description,
    //   attendees=eventData.attendees.split(',').map(s => s.trim())
    // );

    console.log("Creating event with data:", eventData);
    console.log("API Call Mock:", {
      title: eventData.title,
      start_date: eventData.date,
      start_time_of_day: eventData.time + ':00',
      duration: duration_str,
      description: eventData.description,
      attendees: eventData.attendees.split(',').map((s: string) => s.trim()),
    });

    setIsScheduleEventDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Rutas de cada stat
  const statRoutes: Record<string, string> = {
    totalEmployees: '/hr/employees',
    activeRequests: '/hr/requests',
    monthlyPayroll: '/hr/payroll',
    attendanceRate: '/hr/attendance',
    incidentCount: '/incidentDashboard',
    approvedRequests: '/hr/approved-requests',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-scale">
        {/* Header */}
        <div className="mb-8 animate-slide-in-top">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            HR Main Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 font-medium">
            Welcome back, {session?.user?.name}. Here's your system overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {[
            {
              title: 'Total Employees',
              value: stats.totalEmployees,
              icon: icons.Users,
              colorFrom: 'from-blue-500',
              colorTo: 'to-blue-600',
              route: statRoutes.totalEmployees,
            },
            {
              title: 'Active Requests',
              value: stats.activeRequests,
              icon: icons.FileText,
              colorFrom: 'from-green-500',
              colorTo: 'to-green-600',
              route: statRoutes.activeRequests,
            },
            {
              title: 'Attendance Rate',
              value: `${stats.attendanceRate}%`,
              icon: icons.Calendar,
              colorFrom: 'from-purple-500',
              colorTo: 'to-purple-600',
              route: statRoutes.attendanceRate,
            },
            {
              title: 'Incidents',
              value: stats.incidentCount,
              icon: icons.AlertTriangle,
              colorFrom: 'from-red-500',
              colorTo: 'to-red-600',
              route: statRoutes.incidentCount,
            },
            {
              title: 'Approved Requests',
              value: stats.approvedRequests,
              icon: icons.CheckCircle,
              colorFrom: 'from-indigo-500',
              colorTo: 'to-indigo-600',
              route: statRoutes.approvedRequests,
            },
          ].map((stat) => (
            <button
              key={stat.title}
              onClick={() => router.push(stat.route)}
              className={`${commonClasses.card}`}
            >
              <div className={`${commonClasses.cardContent}`}>
                <div className={`h-12 w-12 ${stat.colorFrom} ${stat.colorTo} bg-gradient-to-br rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </button>
          ))}
          
          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 gap-4 col-span-2">
            <button
              onClick={() => router.push('/hr/applicants/priority-vacancies')}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-yellow-200 rounded-xl transition border border-orange-200"
            >
              <icons.AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-700">Priority Vacancies</span>
            </button>
            
            <button
              onClick={() => router.push('/hr/incidents')}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl transition border border-red-200"
            >
              <icons.AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-700">Incident Reports</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Overview */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className={commonClasses.cardBody}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={commonClasses.cardTitle}>
                  System Overview
                </h3>
                <icons.Shield className="h-6 w-6 text-blue-600" />
              </div>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <icons.BarChart3 className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">
                    HR Analytics & Reporting active
                  </span>
                </li>
                <li className="flex items-center">
                  <icons.UserCheck className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">
                    Employee management fully operational
                  </span>
                </li>
                <li className="flex items-center">
                  <icons.Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">
                    Attendance module running smoothly
                  </span>
                </li>
                <li className="flex items-center">
                  <icons.Building className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">
                    Departmental structure synced
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className={commonClasses.cardBody}>
              <h3 className={commonClasses.cardTitle}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Dialog.Root open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
                  <Dialog.Trigger asChild>
                    <button
                      className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition"
                    >
                      <icons.Plus className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-blue-700">
                        Add Employee
                      </span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
                      <Dialog.Title className="text-lg font-semibold">Add New Employee</Dialog.Title>
                      <Dialog.Description className="text-sm text-muted-foreground">
                        Fill in the details to add a new employee to the system.
                      </Dialog.Description>
                      <OnboardingForm onSubmit={handleAddNewEmployee} onCancel={() => setIsAddEmployeeDialogOpen(false)} />
                      <Dialog.Close asChild>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70">
                          <Cross1Icon className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

                <button
                  onClick={() => router.push('/hr/request')}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition"
                >
                  <icons.FileText className="h-6 w-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">
                    New Request
                  </span>
                </button>
                
                <Dialog.Root open={isScheduleEventDialogOpen} onOpenChange={setIsScheduleEventDialogOpen}>
                  <Dialog.Trigger asChild>
                    <button
                      className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition"
                    >
                      <icons.Calendar className="h-6 w-6 text-purple-600 mb-2" />
                      <span className="text-sm font-medium text-purple-700">
                        Schedule Event
                      </span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
                      <Dialog.Title className="text-lg font-semibold">Schedule Event</Dialog.Title>
                      <Dialog.Description className="text-sm text-muted-foreground">
                        Complete the details to Schedule Event.
                      </Dialog.Description>
                      <EventScheduler onSubmit={handleCreateEvent} onCancel={() => setIsScheduleEventDialogOpen(false)} />
                      <Dialog.Close asChild>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70">
                          <Cross1Icon className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

                <button
                  onClick={() => router.push('/hr/incidents/new')}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl transition"
                >
                  <icons.XCircle className="h-6 w-6 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-red-700">
                    Report Incident
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 mb-8">
          <div className={commonClasses.cardBody}>
            <h3 className={commonClasses.cardTitle}>
              Recent System Activity
            </h3>
            <ul className="space-y-4 mt-6">
              <li className="flex items-center">
                <icons.CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">
                  Payroll for September successfully processed.
                </span>
              </li>
              <li className="flex items-center">
                <icons.Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">
                  3 new employees added to the HR system.
                </span>
              </li>
              <li className="flex items-center">
                <icons.AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">
                  2 incidents reported this week.
                </span>
              </li>
              <li className="flex items-center">
                <icons.TrendingUp className="h-5 w-5 text-indigo-600 mr-3" />
                <span className="text-gray-700">
                  Attendance increased by 3% compared to last month.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}