'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import * as Tabs from '@radix-ui/react-tabs'
import * as Separator from '@radix-ui/react-separator'
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  PinLeftIcon,
  PersonIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  MobileIcon,
} from '@radix-ui/react-icons'

// Tailwind CSS classes to replicate the shadcn/ui design
const commonClasses = {
  card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  cardHeader: 'flex flex-col space-y-1.5 p-6',
  cardTitle: 'font-semibold leading-none tracking-tight',
  cardDescription: 'text-sm text-muted-foreground',
  cardContent: 'p-6 pt-0',
  button:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  buttonPrimary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2',
  buttonOutline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2',
  input:
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  table: 'w-full caption-bottom text-sm',
  tableHeader: '[&_tr]:border-b',
  tableRow: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  tableHead: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  tableCell: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
  tabsList: 'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
  tabsTrigger: 'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
}

interface Interview {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  department: string
  date: string
  time: string
  duration: number
  type: 'presencial' | 'virtual' | 'telefonica'
  status: 'programada' | 'completada' | 'cancelada' | 'reprogramada'
  interviewer: string
  location?: string
  meetingLink?: string
  notes?: string
  rating?: number
  feedback?: string
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'María González',
    candidateEmail: 'maria.gonzalez@email.com',
    position: 'Software Engineer',
    department: 'Engineering',
    date: '2024-09-25',
    time: '10:00',
    duration: 60,
    type: 'virtual',
    status: 'programada',
    interviewer: 'Juan Pérez',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'First technical interview - review portfolio',
  },
  {
    id: '2',
    candidateName: 'Carlos Ramírez',
    candidateEmail: 'carlos.ramirez@email.com',
    position: 'Production Manager',
    department: 'Production',
    date: '2024-09-24',
    time: '14:30',
    duration: 90,
    type: 'presencial',
    status: 'completada',
    interviewer: 'Ana Martín',
    location: 'Meeting Room A',
    rating: 4,
    feedback: 'Excellent experience in production management. Highly recommended.',
    notes: 'Final interview - check references',
  },
  {
    id: '3',
    candidateName: 'Ana Martínez',
    candidateEmail: 'ana.martinez@email.com',
    position: 'Quality Analyst',
    department: 'Quality Control',
    date: '2024-09-26',
    time: '09:00',
    duration: 45,
    type: 'telefonica',
    status: 'programada',
    interviewer: 'Roberto Silva',
    notes: 'Initial screening interview',
  },
  {
    id: '4',
    candidateName: 'Luis García',
    candidateEmail: 'luis.garcia@email.com',
    position: 'Maintenance Technician',
    department: 'Maintenance',
    date: '2024-09-23',
    time: '11:00',
    duration: 60,
    type: 'presencial',
    status: 'cancelada',
    interviewer: 'Patricia López',
    location: 'Maintenance Workshop',
    notes: 'Candidate canceled due to illness',
  },
  {
    id: '5',
    candidateName: 'Elena Rodríguez',
    candidateEmail: 'elena.rodriguez@email.com',
    position: 'HR Coordinator',
    department: 'Administration',
    date: '2024-09-27',
    time: '16:00',
    duration: 60,
    type: 'virtual',
    status: 'reprogramada',
    interviewer: 'Carmen Sánchez',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/xyz',
    notes: 'Rescheduled due to scheduling conflict',
  },
]

const statusColors = {
  programada: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  reprogramada: 'bg-yellow-100 text-yellow-800',
}

const statusIcons = {
  programada: ClockIcon,
  completada: CheckCircledIcon,
  cancelada: CrossCircledIcon,
  reprogramada: ExclamationTriangleIcon,
}

const typeIcons = {
  presencial: PinLeftIcon,
  virtual: VideoIcon,
  telefonica: PersonIcon,
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [activeTab, setActiveTab] = useState('upcoming')

  const today = new Date().toISOString().split('T')[0]

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter
    const matchesType = typeFilter === 'all' || interview.type === typeFilter

    const isUpcoming = interview.date >= today && interview.status === 'programada'
    const isPast = interview.date < today || interview.status === 'completada'

    let matchesTab = true
    if (activeTab === 'upcoming') {
      matchesTab = isUpcoming || interview.status === 'reprogramada'
    } else if (activeTab === 'past') {
      matchesTab = isPast || interview.status === 'cancelada'
    }

    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const updateInterviewStatus = (id: string, newStatus: Interview['status']) => {
    setInterviews(prev => prev.map(interview => (interview.id === id ? { ...interview, status: newStatus } : interview)))
  }

  const addFeedback = (id: string, rating: number, feedback: string) => {
    setInterviews(prev => prev.map(interview => (interview.id === id ? { ...interview, rating, feedback, status: 'completada' } : interview)))
  }

  const upcomingCount = interviews.filter(i => i.date >= today && i.status === 'programada').length
  const todayCount = interviews.filter(i => i.date === today && i.status === 'programada').length
  const completedCount = interviews.filter(i => i.status === 'completada').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600">Schedule and manage interviews with candidates</p>
        </div>
        <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Interview
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={commonClasses.card}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{upcomingCount}</div>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{todayCount}</div>
                <p className="text-sm text-gray-600">Today</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <VideoIcon className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {interviews.filter(i => i.type === 'virtual').length}
                </div>
                <p className="text-sm text-gray-600">Virtual</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Filters */}
      <div className={commonClasses.card}>
        <div className={`${commonClasses.cardContent} p-4`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label.Root htmlFor="search" className="text-sm font-medium">Search Interviews</Label.Root>
              <input
                id="search"
                placeholder="Search by candidate, position, or interviewer..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={commonClasses.input}
              />
            </div>
            <div>
              <Label.Root htmlFor="status-filter" className="text-sm font-medium">Status</Label.Root>
              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filter by status" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>All Statuses</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="programada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Scheduled</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="completada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Completed</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="cancelada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Canceled</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="reprogramada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Rescheduled</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            <div>
              <Label.Root htmlFor="type-filter" className="text-sm font-medium">Type</Label.Root>
              <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filter by type" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>All Types</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="presencial" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>In-person</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="virtual" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Virtual</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="telefonica" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Phone</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className={commonClasses.tabsList}>
          <Tabs.Trigger value="upcoming" className={commonClasses.tabsTrigger}>
            Upcoming ({upcomingCount + interviews.filter(i => i.status === 'reprogramada').length})
          </Tabs.Trigger>
          <Tabs.Trigger value="past" className={commonClasses.tabsTrigger}>
            History ({completedCount + interviews.filter(i => i.status === 'cancelada').length})
          </Tabs.Trigger>
          <Tabs.Trigger value="all" className={commonClasses.tabsTrigger}>
            All ({interviews.length})
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value={activeTab} className="mt-4">
          <div className={commonClasses.card}>
            <div className={commonClasses.cardHeader}>
              <h2 className={commonClasses.cardTitle}>Interviews ({filteredInterviews.length})</h2>
            </div>
            <div className={commonClasses.cardContent}>
              <div className="w-full overflow-auto">
                <table className={commonClasses.table}>
                  <thead className={commonClasses.tableHeader}>
                    <tr className={commonClasses.tableRow}>
                      <th className={commonClasses.tableHead}>Candidate</th>
                      <th className={commonClasses.tableHead}>Position</th>
                      <th className={commonClasses.tableHead}>Date & Time</th>
                      <th className={commonClasses.tableHead}>Type</th>
                      <th className={commonClasses.tableHead}>Status</th>
                      <th className={commonClasses.tableHead}>Interviewer</th>
                      <th className={commonClasses.tableHead}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterviews.map(interview => {
                      const StatusIcon = statusIcons[interview.status]
                      const TypeIcon = typeIcons[interview.type]

                      return (
                        <tr key={interview.id} className={commonClasses.tableRow}>
                          <td className={commonClasses.tableCell}>
                            <div className="flex items-center gap-3">
                              <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                  {getInitials(interview.candidateName)}
                                </Avatar.Fallback>
                              </Avatar.Root>
                              <div>
                                <div className="font-medium">{interview.candidateName}</div>
                                <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className={commonClasses.tableCell}>
                            <div>
                              <div className="font-medium">{interview.position}</div>
                              <div className="text-sm text-gray-500">{interview.department}</div>
                            </div>
                          </td>
                          <td className={commonClasses.tableCell}>
                            <div>
                              <div className="font-medium">{new Date(interview.date).toLocaleDateString('es-MX')}</div>
                              <div className="text-sm text-gray-500">
                                {interview.time} ({interview.duration} min)
                              </div>
                            </div>
                          </td>
                          <td className={commonClasses.tableCell}>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-4 w-4 text-gray-500" />
                              <span className="capitalize">{interview.type}</span>
                            </div>
                          </td>
                          <td className={commonClasses.tableCell}>
                            <div className={`${commonClasses.badge} ${statusColors[interview.status]} flex items-center gap-1 w-fit`}>
                              <StatusIcon className="h-3 w-3" />
                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                            </div>
                          </td>
                          <td className={commonClasses.tableCell}>{interview.interviewer}</td>
                          <td className={commonClasses.tableCell}>
                            <div className="flex items-center gap-2">
                              <Dialog.Root onOpenChange={() => setSelectedInterview(interview)}>
                                <Dialog.Trigger asChild>
                                  <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>View</button>
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                  <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                                  <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:rounded-lg">
                                    <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                                      Interview Details
                                    </Dialog.Title>
                                    <Dialog.Description className="text-sm text-muted-foreground">
                                      Full information of the scheduled interview
                                    </Dialog.Description>
                                    {selectedInterview && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-4">
                                            <div>
                                              <h4 className="font-medium mb-2">Candidate Information</h4>
                                              <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                  <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                                    <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                                      {getInitials(selectedInterview.candidateName)}
                                                    </Avatar.Fallback>
                                                  </Avatar.Root>
                                                  <div>
                                                    <div className="font-medium">{selectedInterview.candidateName}</div>
                                                    <div className="text-sm text-gray-500">{selectedInterview.candidateEmail}</div>
                                                  </div>
                                                </div>
                                                <div>
                                                  <span className="font-medium">Position: </span>
                                                  {selectedInterview.position}
                                                </div>
                                                <div>
                                                  <span className="font-medium">Department: </span>
                                                  {selectedInterview.department}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="space-y-4">
                                            <div>
                                              <h4 className="font-medium mb-2">Interview Details</h4>
                                              <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                                  <span>{new Date(selectedInterview.date).toLocaleDateString('es-MX')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <ClockIcon className="h-4 w-4 text-gray-400" />
                                                  <span>
                                                    {selectedInterview.time} ({selectedInterview.duration} min)
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <TypeIcon className="h-4 w-4 text-gray-400" />
                                                  <span className="capitalize">{selectedInterview.type}</span>
                                                </div>
                                                {selectedInterview.location && (
                                                  <div className="flex items-center gap-2">
                                                    <PinLeftIcon className="h-4 w-4 text-gray-400" />
                                                    <span>{selectedInterview.location}</span>
                                                  </div>
                                                )}
                                                {selectedInterview.meetingLink && (
                                                  <div className="flex items-center gap-2">
                                                    <VideoIcon className="h-4 w-4 text-gray-400" />
                                                    <a
                                                      href={selectedInterview.meetingLink}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-blue-600 hover:underline text-sm"
                                                    >
                                                      Join Meeting
                                                    </a>
                                                  </div>
                                                )}
                                                <div>
                                                  <span className="font-medium">Interviewer: </span>
                                                  {selectedInterview.interviewer}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                        {selectedInterview.notes && (
                                          <div>
                                            <h4 className="font-medium mb-2">Notes</h4>
                                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                                              {selectedInterview.notes}
                                            </p>
                                          </div>
                                        )}
                                        {selectedInterview.status === 'completada' && selectedInterview.feedback && (
                                          <div>
                                            <h4 className="font-medium mb-2">Evaluation</h4>
                                            <div className="space-y-2">
                                              <div className="flex items-center gap-2">
                                                <span className="font-medium">Rating:</span>
                                                <div className="flex items-center">
                                                  {[1, 2, 3, 4, 5].map(star => (
                                                    <div
                                                      key={star}
                                                      className={`h-4 w-4 ${
                                                        star <= (selectedInterview.rating || 0)
                                                          ? 'text-yellow-400 fill-current'
                                                          : 'text-gray-300'
                                                      }`}
                                                    >
                                                      ★
                                                    </div>
                                                  ))}
                                                  <span className="ml-2 text-sm text-gray-600">
                                                    {selectedInterview.rating}/5
                                                  </span>
                                                </div>
                                              </div>
                                              <div>
                                                <span className="font-medium">Comments:</span>
                                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded mt-1">
                                                  {selectedInterview.feedback}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {selectedInterview.status === 'programada' && (
                                          <div className="flex gap-2 pt-4">
                                            <button
                                              onClick={() => updateInterviewStatus(selectedInterview.id, 'completada')}
                                              className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
                                            >
                                              Mark as Complete
                                            </button>
                                            <button
                                              onClick={() => updateInterviewStatus(selectedInterview.id, 'reprogramada')}
                                              className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
                                            >
                                              Reschedule
                                            </button>
                                            <button
                                              onClick={() => updateInterviewStatus(selectedInterview.id, 'cancelada')}
                                              className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        )}
                                        {selectedInterview.status === 'completada' && !selectedInterview.feedback && (
                                          <div className="space-y-4 pt-4 border-t">
                                            <h4 className="font-medium">Add Evaluation</h4>
                                            <div className="space-y-3">
                                              <div>
                                                <Label.Root htmlFor="rating" className="text-sm font-medium">Rating (1-5)</Label.Root>
                                                <Select.Root
                                                  onValueChange={value => {
                                                    const rating = parseInt(value)
                                                    const feedback = 'Evaluation pending'
                                                    addFeedback(selectedInterview.id, rating, feedback)
                                                  }}
                                                >
                                                  <Select.Trigger className={`${commonClasses.input} flex justify-between`}>
                                                    <Select.Value placeholder="Select rating" />
                                                    <Select.Icon />
                                                  </Select.Trigger>
                                                  <Select.Portal>
                                                    <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                                                      <Select.Viewport className="p-1">
                                                        <Select.Item value="1" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                          <Select.ItemText>1 - Very bad</Select.ItemText>
                                                        </Select.Item>
                                                        <Select.Item value="2" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                          <Select.ItemText>2 - Bad</Select.ItemText>
                                                        </Select.Item>
                                                        <Select.Item value="3" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                          <Select.ItemText>3 - Fair</Select.ItemText>
                                                        </Select.Item>
                                                        <Select.Item value="4" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                          <Select.ItemText>4 - Good</Select.ItemText>
                                                        </Select.Item>
                                                        <Select.Item value="5" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                          <Select.ItemText>5 - Excellent</Select.ItemText>
                                                        </Select.Item>
                                                      </Select.Viewport>
                                                    </Select.Content>
                                                  </Select.Portal>
                                                </Select.Root>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <Dialog.Close asChild>
                                      <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                        <span className="sr-only">Close</span>
                                      </button>
                                    </Dialog.Close>
                                  </Dialog.Content>
                                </Dialog.Portal>
                              </Dialog.Root>
                              {interview.status === 'programada' && (
                                <button className={`${commonClasses.button} ${commonClasses.buttonOutline} h-9 w-9 p-0`}>
                                  <Pencil1Icon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}