'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import * as Separator from '@radix-ui/react-separator'
import {
  PersonIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'

// Mapped from the original lucide-react icons
const icons = {
  Plus: PlusIcon,
  Search: MagnifyingGlassIcon,
}

// Mimics the styling of shadcn/ui components
const commonClasses = {
  card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  cardHeader: 'flex flex-col space-y-1.5 p-6',
  cardTitle: 'font-semibold leading-none tracking-tight',
  cardDescription: 'text-sm text-muted-foreground',
  cardContent: 'p-4',
  button:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2',
  buttonPrimary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  buttonOutline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  input:
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  selectTrigger:
    'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  table: 'w-full caption-bottom text-sm',
  tableHeader: '[&_tr]:border-b',
  tableRow: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  tableHead: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  tableCell: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
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

const mockEmployees: Employee[] = [
  { id: '1', name: 'Laura Mendoza', payrollNumber: 'P1001', position: 'Developer', department: 'ADDIT', hireDate: '2024-09-20', onboardingStatus: 'in-progress' },
  { id: '2', name: 'José Torres', payrollNumber: 'P1002', position: 'Manager', department: 'QCD', hireDate: '2024-09-18', onboardingStatus: 'pending' },
  { id: '3', name: 'Diana Soto', payrollNumber: 'P1003', position: 'Analyst', department: 'SCD', hireDate: '2024-09-22', onboardingStatus: 'complete' },
  { id: '4', name: 'Miguel Ángel', payrollNumber: 'P1004', position: 'Engineer', department: 'EQD', hireDate: '2024-09-23', onboardingStatus: 'pending' },
]

const onboardingStatusColors = {
  pending: 'bg-red-100 text-red-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  complete: 'bg-green-100 text-green-800',
}

const onboardingStatusLabels = {
  pending: 'Pendiente',
  'in-progress': 'En Proceso',
  complete: 'Completado',
}

const positions = [
  { id: 'developer', title: 'Developer' },
  { id: 'manager', title: 'Manager' },
  { id: 'analyst', title: 'Analyst' },
  { id: 'engineer', title: 'Engineer' },
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
  { name: 'department', label: 'Department', type: 'select', required: true, options: [
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
  ]},
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

const OnboardingForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
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
          type="submit"
          className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
        >
          Add Employee
        </button>
      </div>
    </form>
  );
}

export default function OnboardingPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddNewEmployee = (newEmployeeData: any) => {
    // Logic to add a new employee to the list
    const newEmployee = {
      id: (employees.length + 1).toString(),
      name: newEmployeeData.name,
      payrollNumber: newEmployeeData.payrollNumber,
      position: positions.find(p => p.id === newEmployeeData.positionId)?.title || 'N/A',
      department: newEmployeeData.department,
      hireDate: new Date().toISOString().split('T')[0],
      onboardingStatus: 'pending',
    }
    setEmployees(prev => [...prev, newEmployee])
    setIsDialogOpen(false)
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-gray-600">Track and manage the onboarding process for new hires.</p>
        </div>
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Employee
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
              <Dialog.Title className="text-lg font-semibold">Add New Employee</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Fill in the details to add a new employee to the system.
              </Dialog.Description>
              <OnboardingForm onSubmit={handleAddNewEmployee} />
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 rounded-sm opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className={commonClasses.card}>
        <div className={commonClasses.cardContent}>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <icons.Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search by name, position or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${commonClasses.input} pl-10`}
              />
            </div>
          </div>
        </div>
      </div>



      <div className={commonClasses.card}>
        <div className={commonClasses.cardHeader}>
          <h2 className={commonClasses.cardTitle}>Employees ({filteredEmployees.length})</h2>
        </div>
        <div className={commonClasses.cardContent}>
          <div className="w-full overflow-auto">
            <table className={commonClasses.table}>
              <thead className={commonClasses.tableHeader}>
                <tr className={commonClasses.tableRow}>
                  <th className={commonClasses.tableHead}>Employee</th>
                  <th className={commonClasses.tableHead}>Position</th>
                  <th className={commonClasses.tableHead}>Hire Date</th>
                  <th className={commonClasses.tableHead}>Onboarding Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id} className={commonClasses.tableRow}>
                    <td className={commonClasses.tableCell}>
                      <div className="flex items-center gap-3">
                        <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            {getInitials(employee.name)}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">Payroll #: {employee.payrollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div className="font-medium">{employee.position}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      {new Date(employee.hireDate).toLocaleDateString('es-MX')}
                    </td>
                    <td className={commonClasses.tableCell}>
                      <span className={`${commonClasses.badge} ${onboardingStatusColors[employee.onboardingStatus]}`}>
                        {onboardingStatusLabels[employee.onboardingStatus]}
                      </span>
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