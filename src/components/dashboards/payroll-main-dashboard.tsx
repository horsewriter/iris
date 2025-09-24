'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Building,
  Clock,
  PiggyBank,
  FileText,
  Calculator,
  Briefcase,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { PayrollSidebar } from '../payroll-sidebar'

interface PayrollStats {
  totalPayroll: number
  whiteCollarEmployees: number
  blueCollarEmployees: number
  totalDepartments: number
  totalPlants: number
  pendingPayments: number
  savingsFunds: number
  vacationLiability: number
}

export function PayrollMainDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<PayrollStats>({
    totalPayroll: 0,
    whiteCollarEmployees: 0,
    blueCollarEmployees: 0,
    totalDepartments: 0,
    totalPlants: 0,
    pendingPayments: 0,
    savingsFunds: 0,
    vacationLiability: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayrollData()
  }, [])

  const fetchPayrollData = async () => {
    try {
      // Simulate API call with fake data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalPayroll: 2450000,
        whiteCollarEmployees: 85,
        blueCollarEmployees: 120,
        totalDepartments: 8,
        totalPlants: 3,
        pendingPayments: 12,
        savingsFunds: 1250000,
        vacationLiability: 450000
      })
    } catch (error) {
      console.error('Error fetching payroll data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Routes for each stat
  const statRoutes: Record<string, string> = {
    totalPayroll: '/payroll/reports/monthly',
    whiteCollarEmployees: '/payroll/employees/white-collar',
    blueCollarEmployees: '/payroll/employees/blue-collar',
    totalDepartments: '/payroll/departments',
    totalPlants: '/payroll/plants',
    pendingPayments: '/payroll/pending',
    savingsFunds: '/payroll/savings',
    vacationLiability: '/payroll/vacation-liability'
  }

  // Quick Actions routes
  const quickActionRoutes: Record<string, string> = {
    processPayroll: '/payroll/process',
    generateReports: '/payroll/reports',
    manageSavings: '/payroll/savings/manage',
    calculateTaxes: '/payroll/taxes'
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0 bg-white min-h-screen">
        <PayrollSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-scale">
        {/* Header */}
        <div className="mb-8 animate-slide-in-top">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Payroll Management Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 font-medium">
            Welcome back, {session?.user?.name}. Manage payroll operations and reports.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Monthly Payroll',
              value: `$${stats.totalPayroll.toLocaleString()}`,
              icon: DollarSign,
              colorFrom: 'from-green-500',
              colorTo: 'to-green-600',
              route: statRoutes.totalPayroll
            },
            {
              title: 'White Collar Employees',
              value: stats.whiteCollarEmployees,
              icon: Briefcase,
              colorFrom: 'from-blue-500',
              colorTo: 'to-blue-600',
              route: statRoutes.whiteCollarEmployees,
              subtitle: 'Bi-weekly pay'
            },
            {
              title: 'Blue Collar Employees',
              value: stats.blueCollarEmployees,
              icon: Users,
              colorFrom: 'from-indigo-500',
              colorTo: 'to-indigo-600',
              route: statRoutes.blueCollarEmployees,
              subtitle: 'Weekly pay'
            },
            {
              title: 'Departments',
              value: stats.totalDepartments,
              icon: Building,
              colorFrom: 'from-purple-500',
              colorTo: 'to-purple-600',
              route: statRoutes.totalDepartments
            },
            {
              title: 'Plants',
              value: stats.totalPlants,
              icon: Building,
              colorFrom: 'from-orange-500',
              colorTo: 'to-orange-600',
              route: statRoutes.totalPlants
            },
            {
              title: 'Pending Payments',
              value: stats.pendingPayments,
              icon: Clock,
              colorFrom: 'from-yellow-500',
              colorTo: 'to-yellow-600',
              route: statRoutes.pendingPayments
            },
            {
              title: 'Savings Funds',
              value: `$${stats.savingsFunds.toLocaleString()}`,
              icon: PiggyBank,
              colorFrom: 'from-teal-500',
              colorTo: 'to-teal-600',
              route: statRoutes.savingsFunds
            },
            {
              title: 'Vacation Liability',
              value: `$${stats.vacationLiability.toLocaleString()}`,
              icon: Calendar,
              colorFrom: 'from-red-500',
              colorTo: 'to-red-600',
              route: statRoutes.vacationLiability
            }
          ].map((stat) => (
            <button
              key={stat.title}
              onClick={() => router.push(stat.route)}
              className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 w-full text-left card-hover"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`h-12 w-12 ${stat.colorFrom} ${stat.colorTo} bg-gradient-to-br rounded-xl flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-semibold text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payroll Overview */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Payroll Overview</h3>
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Monthly Payroll</p>
                      <p className="text-xs text-green-700">All employees combined</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-800">
                    ${stats.totalPayroll.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <PiggyBank className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Employee Savings</p>
                      <p className="text-xs text-blue-700">Total accumulated funds</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-800">
                    ${stats.savingsFunds.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">Vacation Liability</p>
                      <p className="text-xs text-orange-700">Accrued vacation days value</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-orange-800">
                    ${stats.vacationLiability.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
            <div className="px-6 py-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push(quickActionRoutes.processPayroll)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition border border-green-200"
                >
                  <Calculator className="h-6 w-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">Process Payroll</span>
                </button>
                
                <button
                  onClick={() => router.push(quickActionRoutes.generateReports)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition border border-blue-200"
                >
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-700">Generate Reports</span>
                </button>
                
                <button
                  onClick={() => router.push(quickActionRoutes.manageSavings)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition border border-purple-200"
                >
                  <PiggyBank className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-700">Manage Savings</span>
                </button>
                
                <button
                  onClick={() => router.push(quickActionRoutes.calculateTaxes)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition border border-orange-200"
                >
                  <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-700">Calculate Taxes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Payroll Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'success', message: 'Weekly payroll processed for Blue Collar employees (120 employees)', time: '2 hours ago', icon: CheckCircle, color: 'green' },
                { type: 'info', message: 'Bi-weekly payroll scheduled for White Collar employees', time: '4 hours ago', icon: Clock, color: 'blue' },
                { type: 'warning', message: '12 pending payment approvals require attention', time: '6 hours ago', icon: AlertCircle, color: 'yellow' },
                { type: 'success', message: 'Monthly savings fund contributions processed', time: '1 day ago', icon: PiggyBank, color: 'purple' },
                { type: 'info', message: 'Vacation accrual calculations updated for all employees', time: '2 days ago', icon: Calendar, color: 'teal' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 border border-gray-200/50">
                  <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                    <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}