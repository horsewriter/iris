'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import * as Tabs from '@radix-ui/react-tabs'
import * as Separator from '@radix-ui/react-separator'
import {
  MagnifyingGlassIcon,
  DownloadIcon,
  EyeOpenIcon,
  CalendarIcon,
  EnvelopeClosedIcon,
  MobileIcon,
  PersonIcon,
  PinTopIcon,
} from '@radix-ui/react-icons'

// Common styling classes, mimicking shadcn/ui
const commonClasses = {
  card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  cardHeader: 'flex flex-col space-y-1.5 p-6',
  cardTitle: 'font-semibold leading-none tracking-tight',
  cardDescription: 'text-sm text-muted-foreground',
  cardContent: 'p-6 pt-0',
  button:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  buttonPrimary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  buttonOutline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  input:
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  table: 'w-full caption-bottom text-sm',
  tableHeader: '[&_tr]:border-b',
  tableRow: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  tableHead: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  tableCell: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
}

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  appliedDate: string
  experience: string
  location: string
  avatar?: string
  resume: string
  notes: string
  salary: string
}

const mockApplicants: Applicant[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+52 444 123 4567',
    position: 'Software Engineer',
    department: 'Engineering',
    status: 'shortlisted',
    appliedDate: '2024-09-20',
    experience: '5 years',
    location: 'San Luis Potosí',
    resume: 'maria_gonzalez_resume.pdf',
    notes: 'Strong technical background in React and Node.js',
    salary: '$45,000 - $55,000',
  },
  {
    id: '2',
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@email.com',
    phone: '+52 444 234 5678',
    position: 'Production Manager',
    department: 'Production',
    status: 'reviewing',
    appliedDate: '2024-09-18',
    experience: '8 years',
    location: 'León, Guanajuato',
    resume: 'carlos_ramirez_resume.pdf',
    notes: 'Extensive experience in manufacturing processes',
    salary: '$60,000 - $70,000',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+52 444 345 6789',
    position: 'Quality Analyst',
    department: 'Quality Control',
    status: 'new',
    appliedDate: '2024-09-22',
    experience: '3 years',
    location: 'San Luis Potosí',
    resume: 'ana_martinez_resume.pdf',
    notes: 'Detail-oriented with ISO certification',
    salary: '$35,000 - $40,000',
  },
  {
    id: '4',
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    phone: '+52 444 456 7890',
    position: 'Maintenance Technician',
    department: 'Maintenance',
    status: 'hired',
    appliedDate: '2024-09-15',
    experience: '6 years',
    location: 'Aguascalientes',
    resume: 'roberto_silva_resume.pdf',
    notes: 'Specialized in industrial equipment maintenance',
    salary: '$40,000 - $45,000',
  },
  {
    id: '5',
    name: 'Laura Hernández',
    email: 'laura.hernandez@email.com',
    phone: '+52 444 567 8901',
    position: 'HR Coordinator',
    department: 'Administration',
    status: 'rejected',
    appliedDate: '2024-09-16',
    experience: '4 years',
    location: 'Querétaro',
    resume: 'laura_hernandez_resume.pdf',
    notes: 'Good interpersonal skills but lacks specific experience',
    salary: '$38,000 - $42,000',
  },
]

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-purple-100 text-purple-800',
}

const statusLabels = {
  new: 'New',
  reviewing: 'In Review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || applicant.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const updateApplicantStatus = (id: string, newStatus: Applicant['status']) => {
    setApplicants(prev => prev.map(applicant => (applicant.id === id ? { ...applicant, status: newStatus } : applicant)))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const statusCounts = {
    total: applicants.length,
    new: applicants.filter(a => a.status === 'new').length,
    reviewing: applicants.filter(a => a.status === 'reviewing').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    hired: applicants.filter(a => a.status === 'hired').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="p-6 space-y-6">
        
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
          <p className="text-gray-600">Manage the recruitment and selection process</p>
        </div>
        <div className="flex gap-2">
          <button className={`${commonClasses.button} ${commonClasses.buttonOutline} px-3 py-2`}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className={`${commonClasses.button} ${commonClasses.buttonPrimary} px-3 py-2`}>
            <PersonIcon className="h-4 w-4 mr-2" />
            New Candidate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {/* Stats Cards */}
        <div className={`${commonClasses.card}`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
        <div className={`${commonClasses.card}`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.new}</div>
            <p className="text-sm text-gray-600">New</p>
          </div>
        </div>
        <div className={`${commonClasses.card}`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.reviewing}</div>
            <p className="text-sm text-gray-600">In Review</p>
          </div>
        </div>
        <div className={`${commonClasses.card}`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="text-2xl font-bold text-green-600">{statusCounts.shortlisted}</div>
            <p className="text-sm text-gray-600">Shortlisted</p>
          </div>
        </div>
        <div className={`${commonClasses.card}`}>
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="text-2xl font-bold text-purple-600">{statusCounts.hired}</div>
            <p className="text-sm text-gray-600">Hired</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className={`${commonClasses.cardContent} p-4`}>
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>
      </div>


      {/* Filters */}
      <div className={`${commonClasses.card}`}>
        <div className={`${commonClasses.cardContent} p-4`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label.Root htmlFor="search" className="text-sm font-medium">
                Search Candidates
              </Label.Root>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  placeholder="Search by name, email or position..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${commonClasses.input} pl-10`}
                />
              </div>
            </div>
            <div>
              <Label.Root htmlFor="status-filter" className="text-sm font-medium">
                Status
              </Label.Root>
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
                      <Select.Item value="new" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>New</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="reviewing" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>In Review</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="shortlisted" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Shortlisted</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="hired" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Hired</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="rejected" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Rejected</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            <div>
              <Label.Root htmlFor="department-filter" className="text-sm font-medium">
                Department
              </Label.Root>
              <Select.Root value={departmentFilter} onValueChange={setDepartmentFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filter by department" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>All Departments</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="Engineering" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Engineering</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="Production" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Production</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="Quality Control" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Quality Control</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="Maintenance" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Maintenance</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="Administration" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Administration</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className={`${commonClasses.card}`}>
        <div className={`${commonClasses.cardHeader}`}>
          <h2 className={`${commonClasses.cardTitle}`}>Candidates ({filteredApplicants.length})</h2>
        </div>
        <div className={`${commonClasses.cardContent}`}>
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Candidate
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Position
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Department
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Application Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Experience
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredApplicants.map(applicant => (
                  <tr key={applicant.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <div className="flex items-center gap-3">
                        <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          {applicant.avatar && <Avatar.Image className="aspect-square h-full w-full" src={applicant.avatar} />}
                          <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            {getInitials(applicant.name)}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{applicant.position}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{applicant.department}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Select.Root
                        value={applicant.status}
                        onValueChange={value => updateApplicantStatus(applicant.id, value as Applicant['status'])}
                      >
                        <Select.Trigger className={`${commonClasses.input} w-[140px] flex justify-between`}>
                          <span className={`${commonClasses.badge} ${statusColors[applicant.status]}`}>
                            {statusLabels[applicant.status]}
                          </span>
                          <Select.Icon />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                            <Select.Viewport className="p-1">
                              <Select.Item value="new" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Select.ItemText>New</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="reviewing" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Select.ItemText>In Review</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="shortlisted" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Select.ItemText>Shortlisted</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="hired" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Select.ItemText>Hired</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="rejected" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Select.ItemText>Rejected</Select.ItemText>
                              </Select.Item>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{new Date(applicant.appliedDate).toLocaleDateString('es-MX')}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{applicant.experience}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Dialog.Root onOpenChange={() => setSelectedApplicant(applicant)}>
                        <Dialog.Trigger asChild>
                          <button className={`${commonClasses.button} ${commonClasses.buttonOutline} h-9 w-9 p-0`}>
                            <EyeOpenIcon className="h-4 w-4" />
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:rounded-lg">
                            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                              Candidate Details
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-muted-foreground">
                              Full information of the selected candidate
                            </Dialog.Description>
                            {selectedApplicant && (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <Avatar.Root className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full">
                                    {selectedApplicant.avatar && <Avatar.Image className="aspect-square h-full w-full" src={selectedApplicant.avatar} />}
                                    <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-lg">
                                      {getInitials(selectedApplicant.name)}
                                    </Avatar.Fallback>
                                  </Avatar.Root>
                                  <div>
                                    <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                                    <p className="text-gray-600">{selectedApplicant.position}</p>
                                    <span className={`${commonClasses.badge} ${statusColors[selectedApplicant.status]}`}>
                                      {statusLabels[selectedApplicant.status]}
                                    </span>
                                  </div>
                                </div>
                                <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <EnvelopeClosedIcon className="h-4 w-4 text-gray-400" />
                                      <span>{selectedApplicant.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MobileIcon className="h-4 w-4 text-gray-400" />
                                      <span>{selectedApplicant.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <PinTopIcon className="h-4 w-4 text-gray-400" />
                                      <span>{selectedApplicant.location}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <span className="font-medium">Experience: </span>
                                      {selectedApplicant.experience}
                                    </div>
                                    <div>
                                      <span className="font-medium">Department: </span>
                                      {selectedApplicant.department}
                                    </div>
                                    <div>
                                      <span className="font-medium">Expected Salary: </span>
                                      {selectedApplicant.salary}
                                    </div>
                                  </div>
                                </div>
                                <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                <div>
                                  <h4 className="font-medium mb-2">Notes</h4>
                                  <p className="text-gray-600 text-sm">{selectedApplicant.notes}</p>
                                </div>
                                <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
                                <div>
                                  <h4 className="font-medium mb-2">Resume</h4>
                                  <button className={`${commonClasses.button} ${commonClasses.buttonOutline} px-3 py-2`}>
                                    <DownloadIcon className="h-4 w-4 mr-2" />
                                    Download {selectedApplicant.resume}
                                  </button>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <button
                                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'shortlisted')}
                                    disabled={selectedApplicant.status === 'shortlisted'}
                                    className={`${commonClasses.button} ${commonClasses.buttonPrimary} px-3 py-2`}
                                  >
                                    Shortlist
                                  </button>
                                  <button
                                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                                    disabled={selectedApplicant.status === 'rejected'}
                                    className={`${commonClasses.button} ${commonClasses.buttonOutline} px-3 py-2`}
                                  >
                                    Reject
                                  </button>
                                  <button className={`${commonClasses.button} ${commonClasses.buttonOutline} px-3 py-2`}>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}