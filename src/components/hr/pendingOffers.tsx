'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import * as Separator from '@radix-ui/react-separator'
import {
  ExclamationTriangleIcon,
  ClockIcon,
  EnvelopeClosedIcon,
  CalendarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ChatBubbleIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
  EyeOpenIcon,
  MobileIcon, // Replaced Phone from lucide-react
  PersonIcon,
  PinLeftIcon,
  DownloadIcon as RadixDownloadIcon, // Alias to avoid conflict
} from '@radix-ui/react-icons'

// Common styling classes, mimicking shadcn/ui
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
  textarea:
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  table: 'w-full caption-bottom text-sm',
  tableHeader: '[&_tr]:border-b',
  tableRow: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  tableHead: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  tableCell: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
}

interface PendingOffer {
  id: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  position: string
  department: string
  offerDate: string
  responseDeadline: string
  daysRemaining: number
  offerAmount: number
  status: 'enviada' | 'vista' | 'negociando' | 'aceptada' | 'rechazada' | 'vencida'
  priority: 'alta' | 'media' | 'baja'
  lastContact: string
  contactAttempts: number
  notes: string
  benefits: string[]
  startDate: string
}

const mockPendingOffers: PendingOffer[] = [
  {
    id: '1',
    candidateName: 'María González',
    candidateEmail: 'maria.gonzalez@email.com',
    candidatePhone: '+52 444 123 4567',
    position: 'Software Engineer',
    department: 'Engineering',
    status: 'vista',
    priority: 'alta',
    offerDate: '2024-09-20',
    responseDeadline: '2024-09-27',
    daysRemaining: 3,
    offerAmount: 65000,
    lastContact: '2024-09-23',
    contactAttempts: 2,
    notes: 'Very interested candidate, asked about additional benefits',
    benefits: ['Major medical insurance', 'Performance bonuses', '2 days of home office'],
    startDate: '2024-10-15',
  },
  {
    id: '2',
    candidateName: 'Carlos Ramírez',
    candidateEmail: 'carlos.ramirez@email.com',
    candidatePhone: '+52 444 234 5678',
    position: 'Production Manager',
    department: 'Production',
    status: 'negociando',
    priority: 'alta',
    offerDate: '2024-09-18',
    responseDeadline: '2024-09-25',
    daysRemaining: 1,
    offerAmount: 85000,
    lastContact: '2024-09-24',
    contactAttempts: 4,
    notes: 'Requested a 10% salary increase. Waiting for management approval.',
    benefits: ['Major medical insurance', 'Company car', 'Quarterly bonuses'],
    startDate: '2024-10-01',
  },
  {
    id: '3',
    candidateName: 'Ana Martínez',
    candidateEmail: 'ana.martinez@email.com',
    candidatePhone: '+52 444 345 6789',
    position: 'Quality Analyst',
    department: 'Quality Control',
    status: 'vencida',
    priority: 'media',
    offerDate: '2024-09-15',
    responseDeadline: '2024-09-22',
    daysRemaining: -2,
    offerAmount: 42000,
    lastContact: '2024-09-21',
    contactAttempts: 3,
    notes: 'Has not responded to calls or emails. Possible lack of interest.',
    benefits: ['Health insurance', 'Grocery vouchers', 'Certified training'],
    startDate: '2024-09-30',
  },
  {
    id: '4',
    candidateName: 'Roberto Silva',
    candidateEmail: 'roberto.silva@email.com',
    candidatePhone: '+52 444 456 7890',
    position: 'Maintenance Technician',
    department: 'Maintenance',
    status: 'enviada',
    priority: 'media',
    offerDate: '2024-09-22',
    responseDeadline: '2024-09-29',
    daysRemaining: 5,
    offerAmount: 38000,
    lastContact: '2024-09-22',
    contactAttempts: 0,
    notes: 'Offer recently sent',
    benefits: ['Health insurance', 'Uniforms', 'Specialized tools'],
    startDate: '2024-10-10',
  },
  {
    id: '5',
    candidateName: 'Laura Hernández',
    candidateEmail: 'laura.hernandez@email.com',
    candidatePhone: '+52 444 567 8901',
    position: 'HR Coordinator',
    department: 'Administration',
    status: 'aceptada',
    priority: 'baja',
    offerDate: '2024-09-19',
    responseDeadline: '2024-09-26',
    daysRemaining: 2,
    offerAmount: 48000,
    lastContact: '2024-09-24',
    contactAttempts: 1,
    notes: 'Offer accepted. Contract signing pending.',
    benefits: ['Health insurance', 'Additional vacation days', 'Corporate discounts'],
    startDate: '2024-10-05',
  },
]

const statusColors = {
  enviada: 'bg-blue-100 text-blue-800',
  vista: 'bg-yellow-100 text-yellow-800',
  negociando: 'bg-orange-100 text-orange-800',
  aceptada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
  vencida: 'bg-gray-100 text-gray-800',
}

const priorityColors = {
  alta: 'bg-red-100 text-red-800',
  media: 'bg-yellow-100 text-yellow-800',
  baja: 'bg-green-100 text-green-800',
}

const statusLabels = {
  enviada: 'Sent',
  vista: 'Viewed',
  negociando: 'Negotiating',
  aceptada: 'Accepted',
  rechazada: 'Rejected',
  vencida: 'Expired',
}

function OfferDetailsContent({
  offer,
  onUpdateStatus,
  onAddContact,
}: {
  offer: PendingOffer
  onUpdateStatus: (id: string, status: PendingOffer['status']) => void
  onAddContact: (id: string, notes: string) => void
}) {
  const [contactNotes, setContactNotes] = useState('')

  const handleAddContact = () => {
    if (contactNotes.trim()) {
      onAddContact(offer.id, contactNotes)
      setContactNotes('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Candidate Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar.Root className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-lg">
                    {offer.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <div className="font-medium">{offer.candidateName}</div>
                  <div className="text-sm text-gray-500">{offer.position}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeClosedIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{offer.candidateEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MobileIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{offer.candidatePhone}</span>
              </div>
              <div>
                <span className="font-medium">Department: </span>
                <span className="text-sm">{offer.department}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Offer Details</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600">${(offer.offerAmount / 1000).toFixed(0)}K annually</div>
                <div className="text-sm text-green-700">Offered Salary</div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Start Date: {new Date(offer.startDate).toLocaleDateString('es-MX')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Expires: {new Date(offer.responseDeadline).toLocaleDateString('es-MX')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${commonClasses.badge} ${statusColors[offer.status]}`}>{statusLabels[offer.status]}</span>
                <span className={`${commonClasses.badge} ${priorityColors[offer.priority]}`}>{offer.priority.charAt(0).toUpperCase() + offer.priority.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
      <div>
        <h4 className="font-medium mb-3">Included Benefits</h4>
        <div className="grid grid-cols-2 gap-2">
          {offer.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
      <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
      <div>
        <h4 className="font-medium mb-3">Contact History</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Contact Attempts:</span>
            <span className={`${commonClasses.badge} ${commonClasses.buttonOutline}`}>{offer.contactAttempts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Last Contact:</span>
            <span className="text-sm text-gray-600">
              {new Date(offer.lastContact).toLocaleDateString('es-MX')}
            </span>
          </div>
          <div>
            <span className="font-medium text-sm">Current Notes:</span>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded mt-1">{offer.notes}</p>
          </div>
        </div>
      </div>
      {(offer.status === 'enviada' || offer.status === 'vista' || offer.status === 'negociando') && (
        <>
          <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
          <div className="pt-4">
            <h4 className="font-medium mb-3">Log Contact</h4>
            <div className="space-y-3">
              <textarea
                placeholder="Add contact notes..."
                value={contactNotes}
                onChange={e => setContactNotes(e.target.value)}
                className={commonClasses.textarea}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddContact}
                  disabled={!contactNotes.trim()}
                  className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
                >
                  <ChatBubbleIcon className="h-4 w-4 mr-2" />
                  Log Contact
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <Separator.Root className="shrink-0 bg-border h-[1px] w-full" />
      <div className="flex gap-2 pt-4">
        {offer.status === 'enviada' && (
          <button
            onClick={() => onUpdateStatus(offer.id, 'vista')}
            className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
          >
            Mark as Viewed
          </button>
        )}
        {(offer.status === 'vista' || offer.status === 'enviada') && (
          <button
            onClick={() => onUpdateStatus(offer.id, 'negociando')}
            className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
          >
            Start Negotiation
          </button>
        )}
        {offer.status === 'negociando' && (
          <>
            <button
              onClick={() => onUpdateStatus(offer.id, 'aceptada')}
              className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}
            >
              Mark as Accepted
            </button>
            <button
              onClick={() => onUpdateStatus(offer.id, 'rechazada')}
              className={`${commonClasses.button} ${commonClasses.buttonOutline}`}
            >
              Mark as Rejected
            </button>
          </>
        )}
        <button className={`${commonClasses.button} ${commonClasses.buttonOutline}`}>
          <EnvelopeClosedIcon className="h-4 w-4 mr-2" />
          Resend Offer
        </button>
      </div>
    </div>
  )
}

export default function PendingOffersPage() {
  const [offers, setOffers] = useState<PendingOffer[]>(mockPendingOffers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedOffer, setSelectedOffer] = useState<PendingOffer | null>(null)

  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || offer.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const updateOfferStatus = (id: string, newStatus: PendingOffer['status']) => {
    setOffers(prev => prev.map(offer => (offer.id === id ? { ...offer, status: newStatus } : offer)))
  }

  const addContactAttempt = (id: string, notes: string) => {
    setOffers(prev =>
      prev.map(offer =>
        offer.id === id
          ? {
              ...offer,
              contactAttempts: offer.contactAttempts + 1,
              lastContact: new Date().toISOString().split('T')[0],
              notes: notes,
            }
          : offer,
      ),
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getDaysRemainingBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return (
        <span className={`${commonClasses.badge} bg-red-100 text-red-800`}>Expired</span>
      )
    } else if (daysRemaining <= 1) {
      return (
        <span className={`${commonClasses.badge} bg-red-100 text-red-800`}>Urgent</span>
      )
    } else if (daysRemaining <= 3) {
      return (
        <span className={`${commonClasses.badge} bg-orange-100 text-orange-800`}>Approaching</span>
      )
    } else {
      return (
        <span className={`${commonClasses.badge} bg-green-100 text-green-800`}>{daysRemaining} days</span>
      )
    }
  }

  const urgentOffers = offers.filter(o => o.daysRemaining <= 1 && o.status !== 'aceptada' && o.status !== 'rechazada').length
  const pendingResponse = offers.filter(o => ['enviada', 'vista', 'negociando'].includes(o.status)).length
  const acceptedOffers = offers.filter(o => o.status === 'aceptada').length
  const expiredOffers = offers.filter(o => o.status === 'vencida').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Offers</h1>
          <p className="text-gray-600">Track and manage in-progress job offers</p>
        </div>
        <button className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
          <PaperPlaneIcon className="h-4 w-4 mr-2" />
          New Offer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${commonClasses.card} border-orange-200 bg-orange-50`}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">{urgentOffers}</div>
                <p className="text-sm text-orange-700">Urgent</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{pendingResponse}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{acceptedOffers}</div>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </div>
          </div>
        </div>
        <div className={commonClasses.card}>
          <div className={commonClasses.cardContent}>
            <div className="flex items-center gap-2">
              <CrossCircledIcon className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{expiredOffers}</div>
                <p className="text-sm text-gray-600">Expired</p>
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
              <Label.Root htmlFor="search" className="text-sm font-medium">Search Offers</Label.Root>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  placeholder="Search by candidate, position or department..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${commonClasses.input} pl-10`}
                />
              </div>
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
                      <Select.Item value="enviada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Sent</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="vista" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Viewed</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="negociando" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Negotiating</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="aceptada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Accepted</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="rechazada" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Rejected</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="vencida" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Expired</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            <div>
              <Label.Root htmlFor="priority-filter" className="text-sm font-medium">Priority</Label.Root>
              <Select.Root value={priorityFilter} onValueChange={setPriorityFilter}>
                <Select.Trigger className={`${commonClasses.input} w-[180px] flex justify-between`}>
                  <Select.Value placeholder="Filter by priority" />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <Select.Viewport className="p-1">
                      <Select.Item value="all" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>All Priorities</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="alta" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>High</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="media" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Medium</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="baja" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Select.ItemText>Low</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className={commonClasses.card}>
        <div className={commonClasses.cardHeader}>
          <h2 className={commonClasses.cardTitle}>Pending Offers ({filteredOffers.length})</h2>
        </div>
        <div className={commonClasses.cardContent}>
          <div className="w-full overflow-auto">
            <table className={commonClasses.table}>
              <thead className={commonClasses.tableHeader}>
                <tr className={commonClasses.tableRow}>
                  <th className={commonClasses.tableHead}>Candidate</th>
                  <th className={commonClasses.tableHead}>Position</th>
                  <th className={commonClasses.tableHead}>Offer</th>
                  <th className={commonClasses.tableHead}>Time Remaining</th>
                  <th className={commonClasses.tableHead}>Status</th>
                  <th className={commonClasses.tableHead}>Contacts</th>
                  <th className={commonClasses.tableHead}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map(offer => (
                  <tr key={offer.id} className={commonClasses.tableRow}>
                    <td className={commonClasses.tableCell}>
                      <div className="flex items-center gap-3">
                        <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            {getInitials(offer.candidateName)}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div>
                          <div className="font-medium">{offer.candidateName}</div>
                          <div className="text-sm text-gray-500">{offer.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div>
                        <div className="font-medium">{offer.position}</div>
                        <div className="text-sm text-gray-500">{offer.department}</div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div>
                        <div className="font-medium">${(offer.offerAmount / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-500">annually</div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>{getDaysRemainingBadge(offer.daysRemaining)}</td>
                    <td className={commonClasses.tableCell}>
                      <span className={`${commonClasses.badge} ${statusColors[offer.status]}`}>{statusLabels[offer.status]}</span>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div className="text-center">
                        <div className="font-medium">{offer.contactAttempts}</div>
                        <div className="text-xs text-gray-500">attempts</div>
                      </div>
                    </td>
                    <td className={commonClasses.tableCell}>
                      <div className="flex items-center gap-2">
                        <Dialog.Root onOpenChange={() => setSelectedOffer(offer)}>
                          <Dialog.Trigger asChild>
                            <button className={`${commonClasses.button} ${commonClasses.buttonOutline} h-9 w-9 p-0`}>
                              <EyeOpenIcon className="h-4 w-4" />
                            </button>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:rounded-lg">
                              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                                Offer Details
                              </Dialog.Title>
                              <Dialog.Description className="text-sm text-muted-foreground">
                                Full information of the job offer
                              </Dialog.Description>
                              {selectedOffer && (
                                <OfferDetailsContent
                                  offer={selectedOffer}
                                  onUpdateStatus={updateOfferStatus}
                                  onAddContact={addContactAttempt}
                                />
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
                        {(offer.status === 'enviada' || offer.status === 'vista') && (
                          <button className={`${commonClasses.button} ${commonClasses.buttonOutline} h-9 w-9 p-0`}>
                            <MobileIcon className="h-4 w-4" />
                          </button>
                        )}
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