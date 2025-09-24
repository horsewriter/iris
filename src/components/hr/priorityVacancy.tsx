'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Progress from '@radix-ui/react-progress'
import * as Separator from '@radix-ui/react-separator'
import {
  ExclamationTriangleIcon,
  ClockIcon,
  PersonIcon,
  CalendarIcon,
  PinLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeOpenIcon,
  Pencil1Icon,
  TrashIcon,
  LightningBoltIcon,
  TokensIcon, // Replaced DollarSign from lucide-react
} from '@radix-ui/react-icons'

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
  progress: 'h-2 w-full overflow-hidden rounded-full bg-secondary',
}

interface PriorityVacancy {
  id: string
  position: string
  department: string
  location: string
  urgencyLevel: 'critica' | 'alta' | 'media'
  daysOpen: number
  maxDays: number
  reason: string
  impact: string
  budgetImpact: number
  applicantsCount: number
  interviewsScheduled: number
  requiredBy: string
  requestedBy: string
  salaryRange: string
  requirements: string[]
  status: 'abierta' | 'en_proceso' | 'cubierta' | 'pausada'
  lastUpdate: string
  notes?: string
}

const mockVacancies: PriorityVacancy[] = [
  {
    id: '1',
    position: 'Production Manager',
    department: 'Production',
    location: 'Plant A',
    urgencyLevel: 'critica',
    daysOpen: 35,
    maxDays: 30,
    reason: 'Unexpected resignation of previous manager',
    impact: 'Reduced production by 25%, delays in critical deliveries',
    budgetImpact: 150000,
    applicantsCount: 12,
    interviewsScheduled: 3,
    requiredBy: '2024-09-15',
    requestedBy: 'Director of Operations',
    salaryRange: '$80,000 - $95,000',
    requirements: ['MBA or Industrial Engineering', '+8 years experience', 'Lean Manufacturing', 'Leadership of large teams'],
    status: 'en_proceso',
    lastUpdate: '2024-09-23',
    notes: 'Final interviews this week. Two very promising candidates.',
  },
  {
    id: '2',
    position: 'Senior Quality Engineer',
    department: 'Quality Control',
    location: 'Plant B',
    urgencyLevel: 'alta',
    daysOpen: 28,
    maxDays: 45,
    reason: 'New production line requires specialist',
    impact: 'ISO certifications at risk, pending audits',
    budgetImpact: 75000,
    applicantsCount: 8,
    interviewsScheduled: 2,
    requiredBy: '2024-10-01',
    requestedBy: 'Quality Manager',
    salaryRange: '$55,000 - $65,000',
    requirements: ['Industrial/Chemical Engineering', 'Six Sigma Certification', 'ISO 9001', 'Advanced English'],
    status: 'abierta',
    lastUpdate: '2024-09-22',
    notes: 'Active search on LinkedIn and specialized portals.',
  },
  {
    id: '3',
    position: 'Full Stack Developer',
    department: 'IT',
    location: 'Headquarters',
    urgencyLevel: 'alta',
    daysOpen: 42,
    maxDays: 60,
    reason: 'Critical digitalization project',
    impact: 'Delays in ERP system implementation',
    budgetImpact: 200000,
    applicantsCount: 25,
    interviewsScheduled: 5,
    requiredBy: '2024-10-15',
    requestedBy: 'CTO',
    salaryRange: '$60,000 - $75,000',
    requirements: ['React/Node.js', '+5 years experience', 'Databases', 'Agile methodologies'],
    status: 'en_proceso',
    lastUpdate: '2024-09-24',
    notes: 'Large pool of candidates, but few with specific ERP experience.',
  },
  {
    id: '4',
    position: 'Maintenance Supervisor',
    department: 'Maintenance',
    location: 'Plant C',
    urgencyLevel: 'media',
    daysOpen: 20,
    maxDays: 40,
    reason: 'Internal promotion of previous supervisor',
    impact: 'Increase in maintenance response times',
    budgetImpact: 50000,
    applicantsCount: 6,
    interviewsScheduled: 1,
    requiredBy: '2024-10-10',
    requestedBy: 'Maintenance Manager',
    salaryRange: '$45,000 - $55,000',
    requirements: ['Mechanical/Electrical Engineering', '+6 years experience', 'Predictive maintenance', 'Leadership'],
    status: 'abierta',
    lastUpdate: '2024-09-21',
  },
  {
    id: '5',
    position: 'Industrial Safety Specialist',
    department: 'Safety',
    location: 'All Plants',
    urgencyLevel: 'critica',
    daysOpen: 45,
    maxDays: 30,
    reason: 'New government regulations',
    impact: 'Risk of sanctions, pending safety audits',
    budgetImpact: 100000,
    applicantsCount: 4,
    interviewsScheduled: 2,
    requiredBy: '2024-09-30',
    requestedBy: 'Director of Operations',
    salaryRange: '$50,000 - $60,000',
    requirements: ['Industrial/Safety Engineering', 'STPS Certifications', 'Audits', 'Mexican regulations'],
    status: 'abierta',
    lastUpdate: '2024-09-23',
    notes: 'Urgent search. Contacting specialized headhunters.',
  },
]

const urgencyColors = {
  critica: 'bg-red-100 text-red-800 border-red-200',
  alta: 'bg-orange-100 text-orange-800 border-orange-200',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

const statusColors = {
  abierta: 'bg-blue-100 text-blue-800',
  en_proceso: 'bg-yellow-100 text-yellow-800',
  cubierta: 'bg-green-100 text-green-800',
  pausada: 'bg-gray-100 text-gray-800',
}

const urgencyLabels = {
  critica: 'Critical',
  alta: 'High',
  media: 'Medium',
}

const statusLabels = {
  abierta: 'Open',
  en_proceso: 'In Progress',
  cubierta: 'Filled',
  pausada: 'Paused',
}

export default function PriorityVacanciesPage() {
  const [vacancies, setVacancies] = useState<PriorityVacancy[]>(mockVacancies)
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVacancy, setSelectedVacancy] = useState<PriorityVacancy | null>(null)

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch =
      vacancy.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUrgency = urgencyFilter === 'all' || vacancy.urgencyLevel === urgencyFilter
    const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter

    return matchesSearch && matchesUrgency && matchesStatus
  })

  const getProgressPercentage = (daysOpen: number, maxDays: number) => {
    return Math.min((daysOpen / maxDays) * 100, 100)
  }

  const criticalCount = vacancies.filter(v => v.urgencyLevel === 'critica' && v.status !== 'cubierta').length
  const overdue = vacancies.filter(v => v.daysOpen > v.maxDays && v.status !== 'cubierta').length
  const totalBudgetImpact = vacancies.filter(v => v.status !== 'cubierta').reduce((sum, v) => sum + v.budgetImpact, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Priority Vacancies</h1>
          <p className="text-gray-600">Track critical and urgent positions</p>
        </div>
        <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Priority Vacancy
        </button>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${commonClasses.card} border-red-200 bg-red-50`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-900">{criticalCount}</div>
                <p className="text-sm text-red-700">Critical</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`${commonClasses.card} border-orange-200 bg-orange-50`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">{overdue}</div>
                <p className="text-sm text-orange-700">Overdue</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <PersonIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {vacancies.filter(v => v.status !== 'cubierta').length}
                </div>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="flex items-center gap-2">
              <TokensIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(totalBudgetImpact / 1000).toFixed(0)}K
                </div>
                <p className="text-sm text-gray-600">Monthly Impact</p>
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
              <Label.Root htmlFor="search" className="text-sm font-medium">Search Vacancies</Label.Root>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  placeholder="Search by position, department, or location..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${commonClasses.input} pl-10`}
                />
              </div>
            </div>
            <div>
              <Label.Root htmlFor="urgency-filter" className="text-sm font-medium">Urgency</Label.Root>
              <Select.Root value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filter by urgency" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>All Urgencies</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="critica" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Critical</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="alta" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>High</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="media" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Medium</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
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
                      <Select.Item value="abierta" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Open</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="en_proceso" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>In Progress</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="cubierta" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Filled</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="pausada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Paused</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>
      </div>


      {/* Vacancies Table */}
      <div className={commonClasses.card}>
        <div className={commonClasses.cardHeader}>
          <h2 className={commonClasses.cardTitle}>Priority Vacancies ({filteredVacancies.length})</h2>
        </div>
        <div className={commonClasses.cardContent}>
          <div className="w-full overflow-auto">
            <table className={commonClasses.table}>
              <thead className={commonClasses.tableHeader}>
                <tr className={commonClasses.tableRow}>
                  <th className={commonClasses.tableHead}>Position</th>
                  <th className={commonClasses.tableHead}>Urgency</th>
                  <th className={commonClasses.tableHead}>Progress</th>
                  <th className={commonClasses.tableHead}>Applicants</th>
                  <th className={commonClasses.tableHead}>Status</th>
                  <th className={commonClasses.tableHead}>Impact</th>
                  <th className={commonClasses.tableHead}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVacancies.map(vacancy => {
                  const progressPercentage = getProgressPercentage(vacancy.daysOpen, vacancy.maxDays)
                  const isOverdue = vacancy.daysOpen > vacancy.maxDays

                  return (
                    <tr key={vacancy.id} className={`${commonClasses.tableRow} ${isOverdue ? 'bg-red-50' : ''}`}>
                      <td className={commonClasses.tableCell}>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {vacancy.urgencyLevel === 'critica' && <LightningBoltIcon className="h-4 w-4 text-red-500" />}
                            {vacancy.position}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vacancy.department} • {vacancy.location}
                          </div>
                        </div>
                      </td>
                      <td className={commonClasses.tableCell}>
                        <div className={`${commonClasses.badge} ${urgencyColors[vacancy.urgencyLevel]} flex items-center gap-1 w-fit`}>
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          {urgencyLabels[vacancy.urgencyLevel]}
                        </div>
                      </td>
                      <td className={commonClasses.tableCell}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              Days: {vacancy.daysOpen}/{vacancy.maxDays}
                            </span>
                            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                              {progressPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress.Root value={progressPercentage} className={`${commonClasses.progress}`}>
                            <Progress.Indicator
                              className={`h-full w-full flex-1 transition-transform duration-500 ease-in-out ${
                                progressPercentage >= 100
                                  ? 'bg-red-500'
                                  : progressPercentage >= 80
                                  ? 'bg-orange-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
                            />
                          </Progress.Root>
                          {isOverdue && (
                            <div className="text-xs text-red-600 font-medium">
                              Overdue by {vacancy.daysOpen - vacancy.maxDays} days
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={commonClasses.tableCell}>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{vacancy.applicantsCount}</div>
                          <div className="text-xs text-gray-500">{vacancy.interviewsScheduled} interviews</div>
                        </div>
                      </td>
                      <td className={commonClasses.tableCell}>
                        <div className={`${commonClasses.badge} ${statusColors[vacancy.status]}`}>
                          {statusLabels[vacancy.status]}
                        </div>
                      </td>
                      <td className={commonClasses.tableCell}>
                        <div className="text-right">
                          <div className="font-medium text-red-600">${(vacancy.budgetImpact / 1000).toFixed(0)}K/month</div>
                          <div className="text-xs text-gray-500">impact</div>
                        </div>
                      </td>
                      <td className={commonClasses.tableCell}>
                        <Dialog.Root onOpenChange={() => setSelectedVacancy(vacancy)}>
                          <Dialog.Trigger asChild>
                            <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>
                              <EyeOpenIcon className="h-4 w-4" />
                            </button>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:rounded-lg">
                              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                                Priority Vacancy Details
                              </Dialog.Title>
                              <Dialog.Description className="text-sm text-muted-foreground">
                                Full information for the critical position
                              </Dialog.Description>
                              {selectedVacancy && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-3">General Information</h4>
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <div className={`${commonClasses.badge} ${urgencyColors[selectedVacancy.urgencyLevel]} flex items-center gap-1`}>
                                              <ExclamationTriangleIcon className="h-3 w-3" />
                                              {urgencyLabels[selectedVacancy.urgencyLevel]}
                                            </div>
                                            <div className={`${commonClasses.badge} ${statusColors[selectedVacancy.status]}`}>
                                              {statusLabels[selectedVacancy.status]}
                                            </div>
                                          </div>
                                          <div>
                                            <span className="font-medium">Position: </span>
                                            {selectedVacancy.position}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <PinLeftIcon className="h-4 w-4 text-gray-400" />
                                            <span>
                                              {selectedVacancy.department} • {selectedVacancy.location}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            <span>
                                              Required by: {new Date(selectedVacancy.requiredBy).toLocaleDateString('es-MX')}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <TokensIcon className="h-4 w-4 text-gray-400" />
                                            <span>{selectedVacancy.salaryRange}</span>
                                          </div>
                                          <div>
                                            <span className="font-medium">Requested by: </span>
                                            {selectedVacancy.requestedBy}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-3">Progress and Metrics</h4>
                                        <div className="space-y-3">
                                          <div>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                              <span>Time Elapsed</span>
                                              <span className={selectedVacancy.daysOpen > selectedVacancy.maxDays ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                                {selectedVacancy.daysOpen}/{selectedVacancy.maxDays} days
                                              </span>
                                            </div>
                                            <Progress.Root value={getProgressPercentage(selectedVacancy.daysOpen, selectedVacancy.maxDays)} className={`${commonClasses.progress}`}>
                                              <Progress.Indicator
                                                className={`h-full w-full flex-1 transition-transform duration-500 ease-in-out ${
                                                  getProgressPercentage(selectedVacancy.daysOpen, selectedVacancy.maxDays) >= 100
                                                    ? 'bg-red-500'
                                                    : getProgressPercentage(selectedVacancy.daysOpen, selectedVacancy.maxDays) >= 80
                                                    ? 'bg-orange-500'
                                                    : 'bg-green-500'
                                                }`}
                                                style={{
                                                  transform: `translateX(-${100 - getProgressPercentage(selectedVacancy.daysOpen, selectedVacancy.maxDays)}%)`,
                                                }}
                                              />
                                            </Progress.Root>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="text-center p-3 bg-blue-50 rounded">
                                              <div className="text-xl font-bold text-blue-600">{selectedVacancy.applicantsCount}</div>
                                              <div className="text-sm text-blue-700">Applicants</div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded">
                                              <div className="text-xl font-bold text-green-600">{selectedVacancy.interviewsScheduled}</div>
                                              <div className="text-sm text-green-700">Interviews</div>
                                            </div>
                                          </div>
                                          <div className="p-3 bg-red-50 rounded text-center">
                                            <div className="text-xl font-bold text-red-600">${(selectedVacancy.budgetImpact / 1000).toFixed(0)}K</div>
                                            <div className="text-sm text-red-700">Monthly Impact</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-3">Reason for Urgency</h4>
                                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{selectedVacancy.reason}</p>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-3">Business Impact</h4>
                                      <p className="text-gray-600 text-sm bg-red-50 p-3 rounded">{selectedVacancy.impact}</p>
                                    </div>
                                  </div>
                                  <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                  <div>
                                    <h4 className="font-medium mb-3">Job Requirements</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {selectedVacancy.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          <span>{req}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                  {selectedVacancy.notes && (
                                    <div>
                                      <h4 className="font-medium mb-3">Notes and Comments</h4>
                                      <p className="text-gray-600 text-sm bg-yellow-50 p-3 rounded">{selectedVacancy.notes}</p>
                                    </div>
                                  )}

                                  <div className="flex gap-2 pt-4">
                                    <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
                                      <Pencil1Icon className="h-4 w-4 mr-2" />
                                      Edit Vacancy
                                    </button>
                                    <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>
                                      <PersonIcon className="h-4 w-4 mr-2" />
                                      View Applicants
                                    </button>
                                    <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>
                                      <CalendarIcon className="h-4 w-4 mr-2" />
                                      Schedule Interview
                                    </button>
                                  </div>
                                </div>
                              )}
                              <Dialog.Close asChild>
                                <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                  <span className="sr-only">Close</span>
                                </button>
                              </Dialog.Close>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}