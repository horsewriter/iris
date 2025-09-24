'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import * as Separator from '@radix-ui/react-separator'
import {
  CalendarIcon,
  TokensIcon,
  FileTextIcon,
  PlusIcon,
  Cross1Icon,
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  PersonIcon,
} from '@radix-ui/react-icons'

// Type definitions for state and data
enum RequestStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

enum FundType {
  TRAVEL = 'TRAVEL',
  TRAINING = 'TRAINING',
  EQUIPMENT = 'EQUIPMENT',
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

interface VacationRequest {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  daysRequested: number
  reason?: string
  status: RequestStatus
  createdAt: string
}

interface FundRequest {
  id: string
  employeeId: string
  fundType: FundType
  amount: number
  reason: string
  requestType: string
  status: RequestStatus
  createdAt: string
}

interface GeneralRequest {
  id: string
  employeeId: string
  requestType: string
  subject: string
  description: string
  priority: Priority
  status: RequestStatus
  createdAt: string
}

interface Employee {
  id: string
  name: string
  position: string
  email: string
}

const mockEmployees: Employee[] = [
  { id: 'emp1', name: 'Laura Mendoza', position: 'Developer', email: 'laura.m@empresa.com' },
  { id: 'emp2', name: 'José Torres', position: 'Manager', email: 'jose.t@empresa.com' },
  { id: 'emp3', name: 'Diana Soto', position: 'Analyst', email: 'diana.s@empresa.com' },
];

const mockRequests = {
  vacation: [
    { id: 'v1', employeeId: 'emp1', startDate: '2025-12-24', endDate: '2025-12-31', daysRequested: 8, status: RequestStatus.PENDING, createdAt: '2025-09-20T10:00:00Z' },
    { id: 'v2', employeeId: 'emp2', startDate: '2025-11-01', endDate: '2025-11-05', daysRequested: 5, status: RequestStatus.APPROVED, reason: 'Family trip', createdAt: '2025-09-15T12:00:00Z' },
  ],
  fund: [
    { id: 'f1', employeeId: 'emp1', fundType: FundType.TRAVEL, amount: 500.00, reason: 'Conference in NYC', requestType: 'Conference', status: RequestStatus.PENDING, createdAt: '2025-09-22T08:00:00Z' },
  ],
  general: [
    { id: 'g1', employeeId: 'emp3', requestType: 'IT Support', subject: 'Laptop replacement', description: 'My laptop screen is broken and I need a replacement to continue working.', priority: Priority.HIGH, status: RequestStatus.PENDING, createdAt: '2025-09-23T14:30:00Z' },
  ],
};


// Reusable CSS classes
const commonClasses = {
  card: 'bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 w-full text-left',
  tabsList: 'inline-flex h-9 items-center justify-start rounded-lg bg-gray-50/50 p-1',
  tabsTrigger: 'py-3 px-4 sm:px-6 font-semibold text-sm flex items-center space-x-2 rounded-lg transition-all duration-200',
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


export function HrRequestDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vacation' | 'fund' | 'general'>('vacation');
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>(mockRequests.vacation);
  const [fundRequests, setFundRequests] = useState<FundRequest[]>(mockRequests.fund);
  const [generalRequests, setGeneralRequests] = useState<GeneralRequest[]>(mockRequests.general);
  const [loading, setLoading] = useState(false);

  // Form states
  const [vacationForm, setVacationForm] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [fundForm, setFundForm] = useState({
    employeeId: '',
    fundType: 'TRAVEL' as FundType,
    amount: '',
    reason: '',
    requestType: ''
  });
  const [generalForm, setGeneralForm] = useState({
    employeeId: '',
    requestType: '',
    subject: '',
    description: '',
    priority: 'MEDIUM' as Priority
  });

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return <CheckCircledIcon className="h-4 w-4 text-green-500" />;
      case RequestStatus.REJECTED:
        return <CrossCircledIcon className="h-4 w-4 text-red-500" />;
      case RequestStatus.PENDING:
        return <InfoCircledIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <InfoCircledIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case RequestStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case RequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const submitVacationRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      ...vacationForm,
      id: `v${Date.now()}`,
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString(),
      daysRequested: 0,
    };
    setVacationRequests(prev => [newRequest, ...prev]);
    setVacationForm({ employeeId: '', startDate: '', endDate: '', reason: '' });
    alert('Vacation request submitted successfully!');
  };

  const submitFundRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      ...fundForm,
      id: `f${Date.now()}`,
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString(),
      amount: parseFloat(fundForm.amount),
    };
    setFundRequests(prev => [newRequest, ...prev]);
    setFundForm({ employeeId: '', fundType: 'TRAVEL' as FundType, amount: '', reason: '', requestType: '' });
    alert('Fund request submitted successfully!');
  };

  const submitGeneralRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      ...generalForm,
      id: `g${Date.now()}`,
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    setGeneralRequests(prev => [newRequest, ...prev]);
    setGeneralForm({ employeeId: '', requestType: '', subject: '', description: '', priority: 'MEDIUM' as Priority });
    alert('General request submitted successfully!');
  };

  const getEmployeeName = (id: string) => mockEmployees.find(emp => emp.id === id)?.name || 'Unknown';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale">
      <div className="mb-8 animate-slide-in-top">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Employee Request Management</h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Dashboard for HR staff to submit requests on behalf of employees.
        </p>
      </div>

      <div className="border-b border-gray-200/60 mb-8 animate-slide-in-left">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className={commonClasses.tabsList}>
            <Tabs.Trigger value="vacation" className={`${commonClasses.tabsTrigger} ${activeTab === 'vacation' ? 'bg-white text-blue-600 shadow-md border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}`}>
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Vacation</span>
            </Tabs.Trigger>
            <Tabs.Trigger value="fund" className={`${commonClasses.tabsTrigger} ${activeTab === 'fund' ? 'bg-white text-blue-600 shadow-md border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}`}>
              <TokensIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Fund Requests</span>
            </Tabs.Trigger>
            <Tabs.Trigger value="general" className={`${commonClasses.tabsTrigger} ${activeTab === 'general' ? 'bg-white text-blue-600 shadow-md border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}`}>
              <FileTextIcon className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="vacation" className="space-y-8 animate-fade-in-scale mt-8">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Request Vacation Time</h3>
                <form onSubmit={submitVacationRequest} className="space-y-6">
                  <div>
                    <Label.Root className="text-sm font-medium">Employee</Label.Root>
                    <Select.Root onValueChange={(value) => setVacationForm({ ...vacationForm, employeeId: value })} value={vacationForm.employeeId}>
                      <Select.Trigger className={`${commonClasses.selectTrigger} mt-2`}>
                        <Select.Value placeholder="Select an employee" />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                          <Select.Viewport className="p-1">
                            {mockEmployees.map(emp => (
                              <Select.Item key={emp.id} value={emp.id} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground">
                                <Select.ItemText>{emp.name} ({emp.position})</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label.Root className="text-sm font-medium">Start Date</Label.Root>
                      <input type="date" required value={vacationForm.startDate} onChange={(e) => setVacationForm({ ...vacationForm, startDate: e.target.value })} className={`${commonClasses.input} mt-2`} />
                    </div>
                    <div>
                      <Label.Root className="text-sm font-medium">End Date</Label.Root>
                      <input type="date" required value={vacationForm.endDate} onChange={(e) => setVacationForm({ ...vacationForm, endDate: e.target.value })} className={`${commonClasses.input} mt-2`} />
                    </div>
                  </div>
                  <div>
                    <Label.Root className="text-sm font-medium">Reason (Optional)</Label.Root>
                    <textarea rows={4} value={vacationForm.reason} onChange={(e) => setVacationForm({ ...vacationForm, reason: e.target.value })} className={`${commonClasses.textarea} mt-2`} placeholder="Reason for vacation request..." />
                  </div>
                  <button type="submit" className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Vacation Requests</h3>
                <div className="space-y-6">
                  {vacationRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Employee: {getEmployeeName(request.employeeId)}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            {getStatusIcon(request.status)}
                            <h4 className="text-base font-semibold text-gray-900">
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 font-medium mt-2">
                            {request.daysRequested} days • Submitted {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.reason}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} self-start sm:self-center`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="fund" className="space-y-8 animate-fade-in-scale mt-8">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Fund Request</h3>
                <form onSubmit={submitFundRequest} className="space-y-6">
                  <div>
                    <Label.Root className="text-sm font-medium">Employee</Label.Root>
                    <Select.Root onValueChange={(value) => setFundForm({ ...fundForm, employeeId: value })} value={fundForm.employeeId}>
                      <Select.Trigger className={`${commonClasses.selectTrigger} mt-2`}>
                        <Select.Value placeholder="Select an employee" />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                          <Select.Viewport className="p-1">
                            {mockEmployees.map(emp => (
                              <Select.Item key={emp.id} value={emp.id} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground">
                                <Select.ItemText>{emp.name} ({emp.position})</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label.Root className="text-sm font-medium">Fund Type</Label.Root>
                      <Select.Root onValueChange={(value: FundType) => setFundForm({ ...fundForm, fundType: value })} value={fundForm.fundType}>
                        <Select.Trigger className={`${commonClasses.selectTrigger} mt-2`}>
                          <Select.Value placeholder="Select fund type" />
                          <Select.Icon />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                            <Select.Viewport className="p-1">
                              {Object.values(FundType).map((type) => (
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
                      <Label.Root className="text-sm font-medium">Amount</Label.Root>
                      <input type="number" step="0.01" required value={fundForm.amount} onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })} className={`${commonClasses.input} mt-2`} placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <Label.Root className="text-sm font-medium">Request Type</Label.Root>
                    <input type="text" required value={fundForm.requestType} onChange={(e) => setFundForm({ ...fundForm, requestType: e.target.value })} className={`${commonClasses.input} mt-2`} placeholder="e.g., Conference attendance, Equipment purchase" />
                  </div>
                  <div>
                    <Label.Root className="text-sm font-medium">Reason</Label.Root>
                    <textarea rows={4} required value={fundForm.reason} onChange={(e) => setFundForm({ ...fundForm, reason: e.target.value })} className={`${commonClasses.textarea} mt-2`} placeholder="Detailed reason for fund request..." />
                  </div>
                  <button type="submit" className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Fund Requests</h3>
                <div className="space-y-6">
                  {fundRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Employee: {getEmployeeName(request.employeeId)}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            {getStatusIcon(request.status)}
                            <h4 className="text-base font-semibold text-gray-900">
                              {request.fundType} - ${request.amount}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 font-medium mt-2">
                            {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.reason}</p>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} self-start sm:self-center`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="general" className="space-y-8 animate-fade-in-scale mt-8">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">General Request</h3>
                <form onSubmit={submitGeneralRequest} className="space-y-6">
                  <div>
                    <Label.Root className="text-sm font-medium">Employee</Label.Root>
                    <Select.Root onValueChange={(value) => setGeneralForm({ ...generalForm, employeeId: value })} value={generalForm.employeeId}>
                      <Select.Trigger className={`${commonClasses.selectTrigger} mt-2`}>
                        <Select.Value placeholder="Select an employee" />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                          <Select.Viewport className="p-1">
                            {mockEmployees.map(emp => (
                              <Select.Item key={emp.id} value={emp.id} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground">
                                <Select.ItemText>{emp.name} ({emp.position})</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label.Root className="text-sm font-medium">Request Type</Label.Root>
                      <input type="text" required value={generalForm.requestType} onChange={(e) => setGeneralForm({ ...generalForm, requestType: e.target.value })} className={`${commonClasses.input} mt-2`} placeholder="e.g., IT Support, Office Supplies" />
                    </div>
                    <div>
                      <Label.Root className="text-sm font-medium">Priority</Label.Root>
                      <Select.Root onValueChange={(value: Priority) => setGeneralForm({ ...generalForm, priority: value })} value={generalForm.priority}>
                        <Select.Trigger className={`${commonClasses.selectTrigger} mt-2`}>
                          <Select.Value placeholder="Select priority" />
                          <Select.Icon />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                            <Select.Viewport className="p-1">
                              {Object.values(Priority).map((priority) => (
                                <Select.Item key={priority} value={priority} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground">
                                  <Select.ItemText>{priority}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                  </div>
                  <div>
                    <Label.Root className="text-sm font-medium">Subject</Label.Root>
                    <input type="text" required value={generalForm.subject} onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })} className={`${commonClasses.input} mt-2`} placeholder="Brief subject of your request" />
                  </div>
                  <div>
                    <Label.Root className="text-sm font-medium">Description</Label.Root>
                    <textarea rows={5} required value={generalForm.description} onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })} className={`${commonClasses.textarea} mt-2`} placeholder="Detailed description of your request..." />
                  </div>
                  <button type="submit" className={`${commonClasses.button} ${commonClasses.buttonPrimary}`}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent General Requests</h3>
                <div className="space-y-6">
                  {generalRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Employee: {getEmployeeName(request.employeeId)}</p>
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(request.status)}
                            <h4 className="text-base font-semibold text-gray-900">{request.subject}</h4>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              request.priority === Priority.URGENT ? 'bg-red-100 text-red-800' :
                              request.priority === Priority.HIGH ? 'bg-orange-100 text-orange-800' :
                              request.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium mb-3">
                            {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.description}</p>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} self-start`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}