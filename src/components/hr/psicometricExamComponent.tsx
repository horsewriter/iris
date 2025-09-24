'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import * as Progress from '@radix-ui/react-progress'
import * as Separator from '@radix-ui/react-separator'
import {
  LightningBoltIcon,
  CheckCircledIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ActivityLogIcon,
  BarChartIcon,
  EyeOpenIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DownloadIcon,
} from '@radix-ui/react-icons'

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
  badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  table: 'w-full caption-bottom text-sm',
  tableHeader: '[&_tr]:border-b',
  tableRow: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  tableHead: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  tableCell: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
  progressRoot: 'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
  progressIndicator: 'h-full w-full flex-1 transition-transform duration-500 ease-in-out',
}

interface PsychometricResult {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  department: string
  examDate: string
  examType: 'disc' | 'cleaver' | 'kostick' | 'wartegg' | 'terman' | 'completo'
  status: 'programado' | 'en_progreso' | 'completado' | 'no_presentado'
  overallScore: number
  results: {
    cognitiveAbility: number
    personality: number
    leadership: number
    teamwork: number
    adaptability: number
    stressManagement: number
  }
  interpretation: string
  recommendation: 'altamente_recomendado' | 'recomendado' | 'recomendado_con_reservas' | 'no_recomendado'
  notes: string
  examiner: string
  duration: number
}

const mockPsychometricResults: PsychometricResult[] = [
  {
    id: '1',
    candidateName: 'María González',
    candidateEmail: 'maria.gonzalez@email.com',
    position: 'Software Engineer',
    department: 'Engineering',
    examDate: '2024-09-23',
    examType: 'completo',
    status: 'completado',
    overallScore: 87,
    results: {
      cognitiveAbility: 92,
      personality: 85,
      leadership: 78,
      teamwork: 90,
      adaptability: 88,
      stressManagement: 82,
    },
    interpretation: 'Candidato con excelentes habilidades cognitivas y alta capacidad de trabajo en equipo. Muestra gran adaptabilidad y potencial de crecimiento.',
    recommendation: 'altamente_recomendado',
    notes: 'Perfil ideal para roles técnicos con componente colaborativo',
    examiner: 'Dra. Patricia López',
    duration: 180,
  },
  {
    id: '2',
    candidateName: 'Carlos Ramírez',
    candidateEmail: 'carlos.ramirez@email.com',
    position: 'Production Manager',
    department: 'Production',
    examDate: '2024-09-22',
    examType: 'disc',
    status: 'completado',
    overallScore: 91,
    results: {
      cognitiveAbility: 85,
      personality: 95,
      leadership: 93,
      teamwork: 87,
      adaptability: 89,
      stressManagement: 96,
    },
    interpretation: 'Perfil de liderazgo muy sólido con excelente manejo del estrés. Ideal para posiciones gerenciales en entornos demandantes.',
    recommendation: 'altamente_recomendado',
    notes: 'Liderazgo natural, muy recomendado para gestión de equipos grandes',
    examiner: 'Psic. Roberto Méndez',
    duration: 120,
  },
  {
    id: '3',
    candidateName: 'Ana Martínez',
    candidateEmail: 'ana.martinez@email.com',
    position: 'Quality Analyst',
    department: 'Quality Control',
    examDate: '2024-09-25',
    examType: 'terman',
    status: 'programado',
    overallScore: 0,
    results: {
      cognitiveAbility: 0,
      personality: 0,
      leadership: 0,
      teamwork: 0,
      adaptability: 0,
      stressManagement: 0,
    },
    interpretation: '',
    recommendation: 'recomendado',
    notes: 'Examen programado para mañana',
    examiner: 'Dra. Patricia López',
    duration: 150,
  },
  {
    id: '4',
    candidateName: 'Roberto Silva',
    candidateEmail: 'roberto.silva@email.com',
    position: 'Maintenance Technician',
    department: 'Maintenance',
    examDate: '2024-09-21',
    examType: 'cleaver',
    status: 'completado',
    overallScore: 73,
    results: {
      cognitiveAbility: 75,
      personality: 80,
      leadership: 65,
      teamwork: 78,
      adaptability: 70,
      stressManagement: 74,
    },
    interpretation: 'Candidato con habilidades técnicas adecuadas. Perfil estable y confiable, aunque con menor orientación al liderazgo.',
    recommendation: 'recomendado',
    notes: 'Excelente para trabajo técnico especializado',
    examiner: 'Psic. Roberto Méndez',
    duration: 90,
  },
  {
    id: '5',
    candidateName: 'Laura Hernández',
    candidateEmail: 'laura.hernandez@email.com',
    position: 'HR Coordinator',
    department: 'Administration',
    examDate: '2024-09-20',
    examType: 'kostick',
    status: 'completado',
    overallScore: 68,
    results: {
      cognitiveAbility: 70,
      personality: 75,
      leadership: 60,
      teamwork: 82,
      adaptability: 65,
      stressManagement: 58,
    },
    interpretation: 'Buen perfil para trabajo en equipo, aunque muestra algunas dificultades en el manejo del estrés y liderazgo.',
    recommendation: 'recomendado_con_reservas',
    notes: 'Recomendado para roles de apoyo, requiere acompañamiento inicial',
    examiner: 'Dra. Patricia López',
    duration: 110,
  },
]

const statusColors = {
  programado: 'bg-blue-100 text-blue-800',
  en_progreso: 'bg-yellow-100 text-yellow-800',
  completado: 'bg-green-100 text-green-800',
  no_presentado: 'bg-red-100 text-red-800',
}

const recommendationColors = {
  altamente_recomendado: 'bg-green-100 text-green-800',
  recomendado: 'bg-blue-100 text-blue-800',
  recomendado_con_reservas: 'bg-yellow-100 text-yellow-800',
  no_recomendado: 'bg-red-100 text-red-800',
}

const statusLabels = {
  programado: 'Programado',
  en_progreso: 'En Progreso',
  completado: 'Completado',
  no_presentado: 'No Presentado',
}

const recommendationLabels = {
  altamente_recomendado: 'Altamente Recomendado',
  recomendado: 'Recomendado',
  recomendado_con_reservas: 'Con Reservas',
  no_recomendado: 'No Recomendado',
}

const examTypeLabels = {
  disc: 'DISC',
  cleaver: 'Cleaver',
  kostick: 'Kostick',
  wartegg: 'Wartegg',
  terman: 'Terman',
  completo: 'Batería Completa',
}

function ExamResultDetails({ result }: { result: PsychometricResult }) {
  if (result.status !== 'completado') {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Examen Pendiente</h3>
          <p className="text-gray-600">Este examen aún no ha sido completado.</p>
          <div className="mt-4 space-y-2">
            <div>
              <strong>Fecha programada:</strong> {new Date(result.examDate).toLocaleDateString('es-MX')}
            </div>
            <div>
              <strong>Tipo de examen:</strong> {examTypeLabels[result.examType]}
            </div>
            <div>
              <strong>Duración estimada:</strong> {result.duration} minutos
            </div>
            <div>
              <strong>Evaluador:</strong> {result.examiner}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const competencies = [
    { name: 'Habilidad Cognitiva', value: result.results.cognitiveAbility, key: 'cognitiveAbility' },
    { name: 'Personalidad', value: result.results.personality, key: 'personality' },
    { name: 'Liderazgo', value: result.results.leadership, key: 'leadership' },
    { name: 'Trabajo en Equipo', value: result.results.teamwork, key: 'teamwork' },
    { name: 'Adaptabilidad', value: result.results.adaptability, key: 'adaptability' },
    { name: 'Manejo del Estrés', value: result.results.stressManagement, key: 'stressManagement' },
  ]

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-600'
    if (value >= 70) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Información General</h4>
          <div className="space-y-2">
            <div>
              <strong>Candidato:</strong> {result.candidateName}
            </div>
            <div>
              <strong>Posición:</strong> {result.position}
            </div>
            <div>
              <strong>Tipo de examen:</strong> {examTypeLabels[result.examType]}
            </div>
            <div>
              <strong>Fecha:</strong> {new Date(result.examDate).toLocaleDateString('es-MX')}
            </div>
            <div>
              <strong>Duración:</strong> {result.duration} minutos
            </div>
            <div>
              <strong>Evaluador:</strong> {result.examiner}
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Resultado General</h4>
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-3xl font-bold text-gray-900 mb-2">{result.overallScore}</div>
            <div className="text-sm text-gray-600 mb-3">Puntuación Global</div>
            <span className={`${commonClasses.badge} ${recommendationColors[result.recommendation]}`}>
              {recommendationLabels[result.recommendation]}
            </span>
          </div>
        </div>
      </div>
      <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
      <div>
        <h4 className="font-medium mb-4">Competencias Evaluadas</h4>
        <div className="space-y-4">
          {competencies.map(competency => (
            <div key={competency.key} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{competency.name}</span>
                <span
                  className={`text-sm font-medium ${
                    competency.value >= 80 ? 'text-green-600' : competency.value >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}
                >
                  {competency.value}%
                </span>
              </div>
              <Progress.Root value={competency.value} className={commonClasses.progressRoot}>
                <Progress.Indicator
                  className={`${commonClasses.progressIndicator} ${getProgressColor(competency.value)}`}
                  style={{ transform: `translateX(-${100 - competency.value}%)` }}
                />
              </Progress.Root>
            </div>
          ))}
        </div>
      </div>
      <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
      <div>
        <h4 className="font-medium mb-3">Interpretación Psicológica</h4>
        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg text-sm leading-relaxed">{result.interpretation}</p>
      </div>
      {result.notes && (
        <>
          <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
          <div>
            <h4 className="font-medium mb-3">Notas Adicionales</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded text-sm">{result.notes}</p>
          </div>
        </>
      )}
      <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
      <div className="flex gap-2 pt-4">
        <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Descargar Reporte
        </button>
        <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>
          <BarChartIcon className="h-4 w-4 mr-2" />
          Ver Análisis Detallado
        </button>
      </div>
    </div>
  )
}

export default function PsychometricExamPage() {
  const [results, setResults] = useState<PsychometricResult[]>(mockPsychometricResults)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [examTypeFilter, setExamTypeFilter] = useState('all')
  const [selectedResult, setSelectedResult] = useState<PsychometricResult | null>(null)

  const filteredResults = results.filter(result => {
    const matchesSearch =
      result.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter
    const matchesExamType = examTypeFilter === 'all' || result.examType === examTypeFilter

    return matchesSearch && matchesStatus && matchesExamType
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const completedCount = results.filter(r => r.status === 'completado').length
  const scheduledCount = results.filter(r => r.status === 'programado').length
  const highlyRecommended = results.filter(r => r.recommendation === 'altamente_recomendado').length
  const averageScore = results.filter(r => r.status === 'completado').reduce((sum, r) => sum + r.overallScore, 0) / completedCount || 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exámenes Psicométricos</h1>
          <p className="text-gray-600">Resultados y seguimiento de evaluaciones psicológicas</p>
        </div>
        <div className="flex gap-2">
          <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Exportar Resultados
          </button>
          <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Programar Examen
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                <p className="text-sm text-gray-600">Completados</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{scheduledCount}</div>
                <p className="text-sm text-gray-600">Programados</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <ActivityLogIcon className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{averageScore.toFixed(0)}</div>
                <p className="text-sm text-gray-600">Promedio</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <LightningBoltIcon className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{highlyRecommended}</div>
                <p className="text-sm text-gray-600">Altamente Recomendados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className={commonClasses.card}>
        <div className={commonClasses.cardContent}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label.Root htmlFor="search" className="text-sm font-medium">Buscar resultados</Label.Root>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  placeholder="Buscar por candidato, posición o departamento..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${commonClasses.input} pl-10`}
                />
              </div>
            </div>
            <div>
              <Label.Root htmlFor="status-filter" className="text-sm font-medium">Estado</Label.Root>
              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filtrar por estado" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Todos los estados</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="programado" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Programados</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="en_progreso" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>En Progreso</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="completado" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Completados</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="no_presentado" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>No Presentados</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            <div>
              <Label.Root htmlFor="exam-type-filter" className="text-sm font-medium">Tipo de Examen</Label.Root>
              <Select.Root value={examTypeFilter} onValueChange={setExamTypeFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filtrar por tipo" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Todos los tipos</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="disc" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>DISC</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="cleaver" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Cleaver</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="kostick" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Kostick</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="wartegg" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Wartegg</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="terman" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Terman</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="completo" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Batería Completa</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Table */}
      <div className={commonClasses.card}>
        <div className={commonClasses.cardHeader}>
          <h2 className={commonClasses.cardTitle}>Resultados de Exámenes ({filteredResults.length})</h2>
        </div>
        <div className={commonClasses.cardContent}>
          <div className="w-full overflow-auto">
            <table className={commonClasses.table}>
              <thead className={commonClasses.tableHeader}>
                <tr className={commonClasses.tableRow}>
                  <th className={commonClasses.tableHead}>Candidato</th>
                  <th className={commonClasses.tableHead}>Posición</th>
                  <th className={commonClasses.tableHead}>Tipo de Examen</th>
                  <th className={commonClasses.tableHead}>Fecha</th>
                  <th className={commonClasses.tableHead}>Estado</th>
                  <th className={commonClasses.tableHead}>Puntuación</th>
                  <th className={commonClasses.tableHead}>Recomendación</th>
                  <th className={commonClasses.tableHead}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(result => (
                  <tr key={result.id} className={commonClasses.tableRow}>
                    <td className={commonClasses.tableCell}>
                      <div className="flex items-center gap-3">
                        <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            {getInitials(result.candidateName)}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div>
                          <div className="font-medium">{result.candidateName}</div>
                          <div className="text-sm text-gray-500">{result.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div>
                        <div className="font-medium">{result.position}</div>
                        <div className="text-sm text-gray-500">{result.department}</div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <span className={`${commonClasses.badge} ${commonClasses.buttonOutline}`}>
                        {examTypeLabels[result.examType]}
                      </span>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{new Date(result.examDate).toLocaleDateString('es-MX')}</span>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <span className={`${commonClasses.badge} ${statusColors[result.status]}`}>
                        {statusLabels[result.status]}
                      </span>
                    </td>
                    <td className={commonClasses.tableCell}>
                      {result.status === 'completado' ? (
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(result.overallScore)}`}>
                            {result.overallScore}
                          </div>
                          <div className="text-xs text-gray-500">/ 100</div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">-</div>
                      )}
                    </td>
                    <td className={commonClasses.tableCell}>
                      {result.status === 'completado' ? (
                        <span className={`${commonClasses.badge} ${recommendationColors[result.recommendation]}`}>
                          {recommendationLabels[result.recommendation]}
                        </span>
                      ) : (
                        <span className={`${commonClasses.badge} ${commonClasses.buttonOutline}`}>Pendiente</span>
                      )}
                    </td>
                    <td className={commonClasses.tableCell}>
                      <Dialog.Root onOpenChange={() => setSelectedResult(result)}>
                        <Dialog.Trigger asChild>
                          <button className={`${commonClasses.button} ${commonClasses.buttonOutline} h-9 w-9 p-0`}>
                            <EyeOpenIcon className="h-4 w-4" />
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:rounded-lg">
                            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                              Detalles del Examen Psicométrico
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-muted-foreground">
                              Resultados completos de la evaluación psicológica
                            </Dialog.Description>
                            {selectedResult && <ExamResultDetails result={selectedResult} />}
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
                                <span className="sr-only">Cerrar</span>
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