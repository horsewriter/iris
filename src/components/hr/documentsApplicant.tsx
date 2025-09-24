'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import * as Select from '@radix-ui/react-select'
import * as Separator from '@radix-ui/react-separator'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeOpenIcon,
  DownloadIcon,
  TrashIcon,
  FileIcon,
} from '@radix-ui/react-icons'

// Íconos personalizados
const PdfFileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 4h7v4h4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
  </svg>
)

const ImageFileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM5 19V5h14l.001 14H5zm5-10l-3 4h10l-3-4-2.001 3L10 9z" />
  </svg>
)

// Estilos comunes
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
  position: string
  payrollNumber: string
}

interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadDate: string
}

interface EmployeeWithDocuments extends Employee {
  documents: Document[]
}

const mockEmployeesWithDocs: EmployeeWithDocuments[] = [
  {
    id: '1',
    name: 'Laura Mendoza',
    position: 'Developer',
    payrollNumber: 'P1001',
    documents: [
      { id: 'd1', name: 'Contrato Laura Mendoza.pdf', type: 'PDF', url: '#', uploadDate: '2024-09-21' },
      { id: 'd2', name: 'INE Laura Mendoza.jpg', type: 'JPG', url: '#', uploadDate: '2024-09-20' },
    ],
  },
  {
    id: '2',
    name: 'José Torres',
    position: 'Manager',
    payrollNumber: 'P1002',
    documents: [{ id: 'd3', name: 'Contrato José Torres.pdf', type: 'PDF', url: '#', uploadDate: '2024-09-19' }],
  },
  {
    id: '3',
    name: 'Diana Soto',
    position: 'Analyst',
    payrollNumber: 'P1003',
    documents: [],
  },
  {
    id: '4',
    name: 'Miguel Ángel',
    position: 'Engineer',
    payrollNumber: 'P1004',
    documents: [],
  },
]

export default function EmployeeDocumentsPage() {
  const [employees, setEmployees] = useState<EmployeeWithDocuments[]>(mockEmployeesWithDocs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithDocuments | null>(null)
  const [uploadEmployeeId, setUploadEmployeeId] = useState<string | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')

  const filteredEmployees = employees.filter(
    employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadEmployeeId || !fileToUpload || !documentType) {
      alert('Por favor, completa todos los campos para subir el documento.')
      return
    }

    const newDocument: Document = {
      id: `d${Date.now()}`,
      name: fileToUpload.name,
      type: documentType,
      url: URL.createObjectURL(fileToUpload),
      uploadDate: new Date().toISOString().split('T')[0],
    }

    setEmployees(prev =>
      prev.map(emp => (emp.id === uploadEmployeeId ? { ...emp, documents: [...emp.documents, newDocument] } : emp))
    )

    setUploadEmployeeId(null)
    setFileToUpload(null)
    setDocumentType('')
  }

  const handleDeleteDocument = (employeeId: string, documentId: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId ? { ...emp, documents: emp.documents.filter(doc => doc.id !== documentId) } : emp
      )
    )
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee(prev => ({ ...prev!, documents: prev!.documents.filter(doc => doc.id !== documentId) }))
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <PdfFileIcon />
      case 'JPG':
        return <ImageFileIcon />
      default:
        return <FileIcon />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-gray-600">Sube y visualiza documentos de cada empleado.</p>
        </div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Subir Documento
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
              <Dialog.Title className="text-lg font-semibold">Subir Nuevo Documento</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Selecciona el empleado y el archivo a subir.
              </Dialog.Description>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label.Root htmlFor="employee-select" className="text-sm font-medium">
                    Empleado
                  </Label.Root>
                  <Select.Root onValueChange={setUploadEmployeeId} value={uploadEmployeeId || ''}>
                    <Select.Trigger id="employee-select" className={commonClasses.selectTrigger}>
                      <Select.Value placeholder="Selecciona un empleado" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <Select.Viewport className="p-1">
                          {employees.map(employee => (
                            <Select.Item
                              key={employee.id}
                              value={employee.id}
                              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                            >
                              <Select.ItemText>
                                {employee.name} ({employee.position})
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div className="space-y-2">
                  <Label.Root htmlFor="document-type" className="text-sm font-medium">
                    Tipo de Documento
                  </Label.Root>
                  <Select.Root onValueChange={setDocumentType} value={documentType}>
                    <Select.Trigger id="document-type" className={commonClasses.selectTrigger}>
                      <Select.Value placeholder="Selecciona el tipo de documento" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <Select.Viewport className="p-1">
                          <Select.Item value="INE" className="relative flex items-center py-1.5 pl-2 pr-8 text-sm">
                            INE
                          </Select.Item>
                          <Select.Item value="Contrato" className="relative flex items-center py-1.5 pl-2 pr-8 text-sm">
                            Contrato
                          </Select.Item>
                          <Select.Item value="CURP" className="relative flex items-center py-1.5 pl-2 pr-8 text-sm">
                            CURP
                          </Select.Item>
                          <Select.Item value="Otro" className="relative flex items-center py-1.5 pl-2 pr-8 text-sm">
                            Otro
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div className="space-y-2">
                  <Label.Root htmlFor="file-upload" className="text-sm font-medium">
                    Archivo
                  </Label.Root>
                  <input
                    id="file-upload"
                    type="file"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    onChange={e => setFileToUpload(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="submit"
                    className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
                    disabled={!uploadEmployeeId || !fileToUpload || !documentType}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Subir Documento
                  </button>
                </div>
              </form>
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 rounded-sm opacity-70">
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
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                placeholder="Buscar por nombre o posición..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`${commonClasses.input} pl-10`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={commonClasses.card}>
        <div className={commonClasses.cardHeader}>
          <h2 className={commonClasses.cardTitle}>Empleados ({filteredEmployees.length})</h2>
        </div>
        <div className={commonClasses.cardContent}>
          <div className="w-full overflow-auto">
            <table className={commonClasses.table}>
              <thead className={commonClasses.tableHeader}>
                <tr className={commonClasses.tableRow}>
                  <th className={commonClasses.tableHead}>Empleado</th>
                  <th className={commonClasses.tableHead}>Posición</th>
                  <th className={commonClasses.tableHead}>Documentos</th>
                  <th className={commonClasses.tableHead}>Acciones</th>
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
                          <div className="text-sm text-gray-500">{employee.payrollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div className="font-medium">{employee.position}</div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <span className="font-medium">{employee.documents.length}</span>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div className="flex gap-2">
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button
                              className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              <EyeOpenIcon className="h-4 w-4 mr-2" />
                              Ver
                            </button>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
                            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
                              <Dialog.Title className="text-lg font-semibold">
                                Documentos de {selectedEmployee?.name}
                              </Dialog.Title>
                              <Dialog.Description className="text-sm text-muted-foreground">
                                Lista de todos los documentos subidos para este empleado.
                              </Dialog.Description>
                              {selectedEmployee && selectedEmployee.documents.length > 0 ? (
                                <ul className="space-y-4">
                                  {selectedEmployee.documents.map(doc => (
                                    <li
                                      key={doc.id}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        {getFileIcon(doc.type)}
                                        <div>
                                          <div className="font-medium">{doc.name}</div>
                                          <div className="text-xs text-gray-500">
                                            Subido: {new Date(doc.uploadDate).toLocaleDateString('es-MX')}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <a
                                          href={doc.url}
                                          download
                                          className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
                                        >
                                          <DownloadIcon className="h-4 w-4 mr-2" />
                                          Descargar
                                        </a>
                                        <button
                                          onClick={() => handleDeleteDocument(selectedEmployee.id, doc.id)}
                                          className={`${commonClasses.button} bg-red-500 text-white hover:bg-red-600`}
                                        >
                                          <TrashIcon className="h-4 w-4 mr-2" />
                                          Eliminar
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500">No hay documentos disponibles.</p>
                              )}
                              <Dialog.Close asChild>
                                <button className="absolute right-4 top-4 rounded-sm opacity-70">
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
                                </button>
                              </Dialog.Close>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>
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
  )
}
