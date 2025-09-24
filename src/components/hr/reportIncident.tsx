'use client'

import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'

import {
  FileTextIcon,
  PlusIcon,
  InfoCircledIcon,
  CheckCircledIcon,

} from '@radix-ui/react-icons'

// Type definitions for state and data
enum IncidentStatus {
  ACTIVE = 'Active',
  RESOLVED = 'Resolved',
  PENDING = 'Pending',
}

enum IncidentType {
  ACCIDENT = 'Workplace Accident',
  PROPERTY_DAMAGE = 'Property Damage',
  SAFETY_VIOLATION = 'Safety Violation',
  HARASSMENT = 'Harassment',
  OTHER = 'Other',
}

interface Incident {
  id: string
  reportedBy: string
  date: string
  time: string
  type: IncidentType
  location: string
  description: string
  impact: string
  status: IncidentStatus
  createdAt: string
}

// Mock incident data
const mockIncidents: Incident[] = [
  {
    id: 'inc1',
    reportedBy: 'Juan Pérez (HR)',
    date: '2025-09-23',
    time: '14:30',
    type: IncidentType.ACCIDENT,
    location: 'Plant A, Production Line 3',
    description: 'An employee suffered a minor cut on their hand from a machine. They were attended to by the first aid team.',
    impact: 'Minor injury, machine stopped for 30 minutes.',
    status: IncidentStatus.ACTIVE,
    createdAt: '2025-09-23T14:45:00Z',
  },
  {
    id: 'inc2',
    reportedBy: 'Maintenance Manager',
    date: '2025-09-22',
    time: '09:15',
    type: IncidentType.PROPERTY_DAMAGE,
    location: 'Main Warehouse',
    description: 'A forklift collided with a shelf, causing some products to fall.',
    impact: 'Damage to products valued at $5,000.',
    status: IncidentStatus.RESOLVED,
    createdAt: '2025-09-22T10:00:00Z',
  },
];

const commonClasses = {
  card: 'bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 w-full text-left',
  input:
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  textarea:
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  selectTrigger:
    'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  button:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2',
  buttonPrimary: 'bg-blue-600 text-white shadow hover:bg-blue-700',
  buttonOutline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
};

export default function ReportIncidentPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [loading, setLoading] = useState(false);

  // Incident form state
  const [incidentForm, setIncidentForm] = useState({
    reportedBy: 'Juan Pérez (HR)', // Optional: Current user's name
    date: '',
    time: '',
    type: '' as IncidentType,
    location: '',
    description: '',
    impact: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!incidentForm.type) {
      alert('Please select an incident type.');
      return;
    }

    const newIncident: Incident = {
      id: `inc${Date.now()}`,
      ...incidentForm,
      status: IncidentStatus.ACTIVE,
      createdAt: new Date().toISOString(),
    };

    setIncidents(prev => [newIncident, ...prev]);
    setIncidentForm({
      reportedBy: 'Juan Pérez (HR)',
      date: '',
      time: '',
      type: '' as IncidentType,
      location: '',
      description: '',
      impact: '',
    });
    alert('Incident reported successfully.');
  };

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case IncidentStatus.ACTIVE:
        return <InfoCircledIcon className="h-4 w-4 text-orange-500" />;
      case IncidentStatus.RESOLVED:
        return <CheckCircledIcon className="h-4 w-4 text-green-500" />;
      case IncidentStatus.PENDING:
        return <InfoCircledIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <InfoCircledIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case IncidentStatus.ACTIVE:
        return 'bg-orange-100 text-orange-800';
      case IncidentStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case IncidentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale">
      <div className="mb-8 animate-slide-in-top">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Incident Report</h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Document and track all incidents within the company.
        </p>
      </div>

      <div className="space-y-8 animate-fade-in-scale">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="px-6 py-8 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">New Incident Report</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label.Root className="text-sm font-medium">Incident Date</Label.Root>
                  <input type="date" required value={incidentForm.date} onChange={(e) => setIncidentForm({ ...incidentForm, date: e.target.value })} className={`${commonClasses.input} mt-2`} />
                </div>
                <div>
                  <Label.Root className="text-sm font-medium">Incident Time</Label.Root>
                  <input type="time" required value={incidentForm.time} onChange={(e) => setIncidentForm({ ...incidentForm, time: e.target.value })} className={`${commonClasses.input} mt-2`} />
                </div>
              </div>
              <div>
                <Label.Root className="text-sm font-medium">Incident Type</Label.Root>
                <Select.Root onValueChange={(value) => setIncidentForm({ ...incidentForm, type: value as IncidentType })} value={incidentForm.type}>
                  <Select.Trigger className={`${commonClasses.selectTrigger} mt-2`}>
                    <Select.Value placeholder="Select incident type" />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                      <Select.Viewport className="p-1">
                        {Object.values(IncidentType).map((type) => (
                          <Select.Item key={type} value={type} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground">
                            <Select.ItemText>{type}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              <div>
                <Label.Root className="text-sm font-medium">Location</Label.Root>
                <input type="text" required value={incidentForm.location} onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })} className={`${commonClasses.input} mt-2`} placeholder="e.g., Plant A, Warehouse, Office 201" />
              </div>
              <div>
                <Label.Root className="text-sm font-medium">Description</Label.Root>
                <textarea rows={5} required value={incidentForm.description} onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })} className={`${commonClasses.textarea} mt-2`} placeholder="Describe what happened..." />
              </div>
              <div>
                <Label.Root className="text-sm font-medium">Impact</Label.Root>
                <textarea rows={3} required value={incidentForm.impact} onChange={(e) => setIncidentForm({ ...incidentForm, impact: e.target.value })} className={`${commonClasses.textarea} mt-2`} placeholder="Describe the impact on people, property, or production..." />
              </div>
              <button type="submit" className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Report Incident
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="px-6 py-8 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Incident History</h3>
            <div className="space-y-6">
              {incidents.map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(incident.status)}
                        <h4 className="text-base font-semibold text-gray-900">
                          {incident.type}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mt-2">
                        {new Date(incident.date).toLocaleDateString()} at {incident.time}
                      </p>
                      <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">{incident.description}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(incident.status)} self-start sm:self-center`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="text-center py-16">
                  <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileTextIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-semibold text-lg">No incidents reported yet</p>
                  <p className="text-gray-400 text-sm mt-2">Use the form above to report the first incident</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}