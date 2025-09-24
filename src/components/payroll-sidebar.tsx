'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  BarChart3, DollarSign, Users, Building, Calendar, FileText,
  Calculator, PiggyBank, TrendingUp, Clock, AlertCircle, 
  CheckCircle, Briefcase, Settings, Home,
  ChevronDown, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  {
    name: 'Dashboard',
    href: '/payroll/dashboard',
    icon: BarChart3,
    description: 'Payroll overview and statistics'
  },
  {
    name: 'Employee Management',
    icon: Users,
    children: [
      { name: 'White Collar Employees', href: '/payroll/employees/white-collar', icon: Briefcase, description: 'Bi-weekly salary employees' },
      { name: 'Blue Collar Employees', href: '/payroll/employees/blue-collar', icon: Users, description: 'Weekly wage employees' },
      { name: 'All Employees', href: '/payroll/employees/', icon: Users, description: 'Complete employee list' },
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: FileText,
    children: [
      { name: 'Weekly Reports', href: '/payroll/reports/weekly', icon: Calendar, description: 'Weekly payroll summaries' },
      { name: 'Monthly Reports', href: '/payroll/reports/monthly', icon: Calendar, description: 'Monthly payroll summaries' },
      { name: 'Tax Reports', href: '/payroll/reports/taxes', icon: TrendingUp, description: 'Tax calculations and reports' },
      { name: 'Savings Reports', href: '/payroll/reports/savings', icon: PiggyBank, description: 'Employee savings analysis' }
    ]
  },
  {
    name: 'Payroll Processing',
    icon: Calculator,
    children: [
      { name: 'Process Weekly Payroll', href: '/payroll/process/weekly', icon: Calendar, description: 'Blue collar weekly processing' },
      { name: 'Process Bi-weekly Payroll', href: '/payroll/process/biweekly', icon: Calendar, description: 'White collar bi-weekly processing' },
      { name: 'Pending Payments', href: '/payroll/pending', icon: Clock, description: 'Payments awaiting approval' },
      { name: 'Payment History', href: '/payroll/history', icon: CheckCircle, description: 'Historical payment records' }
    ]
  },
  {
    name: 'Savings Management',
    icon: PiggyBank,
    children: [
      { name: 'Savings Fund Overview', href: '/payroll/savings/overview', icon: PiggyBank, description: 'Total savings fund status' },
      { name: 'Savings Box Management', href: '/payroll/savings/box', icon: PiggyBank, description: 'Individual savings boxes' },
      { name: 'Fund Contributions', href: '/payroll/savings/contributions', icon: DollarSign, description: 'Monthly contribution tracking' },
      { name: 'Withdrawal Requests', href: '/payroll/savings/withdrawals', icon: AlertCircle, description: 'Pending withdrawal requests' }
    ]
  },
  {
    name: 'Vacation & Benefits',
    icon: Calendar,
    children: [
      { name: 'Vacation Accrual', href: '/payroll/vacation/accrual', icon: Calendar, description: 'Vacation days accumulation' },
      { name: 'Vacation Liability', href: '/payroll/vacation/liability', icon: TrendingUp, description: 'Financial vacation liability' },
      { name: 'Benefits Overview', href: '/payroll/benefits', icon: CheckCircle, description: 'Employee benefits summary' }
    ]
  },
  {
    name: 'Tax Management',
    icon: TrendingUp,
    children: [
      { name: 'Tax Calculations', href: '/payroll/taxes/calculations', icon: Calculator, description: 'Employee tax calculations' },
      { name: 'Tax Withholdings', href: '/payroll/taxes/withholdings', icon: DollarSign, description: 'Tax withholding management' },
      { name: 'Tax Reports', href: '/payroll/taxes/reports', icon: FileText, description: 'Tax reporting and compliance' }
    ]
  },
  {
    name: 'Compliance & Audit',
    icon: CheckCircle,
    children: [
      { name: 'Audit Trail', href: '/payroll/audit/trail', icon: FileText, description: 'Payroll audit history' },
      { name: 'Compliance Reports', href: '/payroll/audit/compliance', icon: CheckCircle, description: 'Regulatory compliance' },
      { name: 'Error Logs', href: '/payroll/audit/errors', icon: AlertCircle, description: 'System error tracking' }
    ]
  }
]

export function PayrollSidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Employee Management'])

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Payroll System</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedSections.includes(item.name)
            const hasActiveChild = item.children.some(child => pathname === child.href)

            return (
              <div key={item.name} className="mb-1">
                <button
                  onClick={() => toggleSection(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    hasActiveChild || isExpanded
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 transition-transform duration-300" /> : <ChevronRight className="h-4 w-4 transition-transform duration-300" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 overflow-hidden"
                    >
                      {item.children.map((child) => {
                        const isActive = pathname === child.href
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                              isActive
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                            title={child.description}
                          >
                            <child.icon className="mr-3 h-4 w-4" />
                            {child.name}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mb-1',
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={item.description}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}