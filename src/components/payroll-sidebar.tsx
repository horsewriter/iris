'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart3, DollarSign, Users, Calendar, FileText,
  Calculator, PiggyBank, TrendingUp, Clock, AlertCircle,
  CheckCircle, Briefcase, Settings, ChevronRight, PanelLeft
} from 'lucide-react'
import { useState, useEffect } from 'react'
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    // Si la ruta activa es un hijo, expande el menú padre al cargar
    const activeSection = navigation.find(item =>
      item.children?.some(child => pathname === child.href)
    )
    if (activeSection) {
      setActiveMenu(activeSection.name)
    }
  }, [pathname])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    if (!isCollapsed) {
      setActiveMenu(null)
    }
  }

  const isNavLinkActive = (href: string) => pathname === href

  const isParentActive = (children: any[]) => children.some(child => pathname === child.href)

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col bg-white border-r border-gray-200 h-screen overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 flex items-center p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-900 truncate mr-auto">
            Payroll
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          title={isCollapsed ? "Expandir" : "Contraer"}
        >
          <PanelLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-2">
        {navigation.map((item) => {
          const isActive = isNavLinkActive(item.href || '')
          const isActiveParent = item.children && isParentActive(item.children)

          return (
            <div key={item.name} className="relative">
              {!item.children ? (
                // Enlace regular
                <Link
                  href={item.href || ''}
                  className={cn(
                    "flex items-center rounded-md text-sm font-medium transition-colors duration-200",
                    isCollapsed ? 'p-2 justify-center' : 'p-2',
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={item.description}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              ) : (
                // Elemento de menú desplegable
                <div
                  onMouseEnter={() => isCollapsed && setActiveMenu(item.name)}
                  onMouseLeave={() => isCollapsed && setActiveMenu(null)}
                >
                  <button
                    onClick={() => setActiveMenu(activeMenu === item.name ? null : item.name)}
                    className={cn(
                      "flex items-center w-full rounded-md text-sm font-medium transition-colors duration-200",
                      isCollapsed ? 'p-2 justify-center' : 'p-2 justify-between',
                      (isActiveParent || activeMenu === item.name) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <ChevronRight
                        className={cn("h-4 w-4 transition-transform duration-200", activeMenu === item.name && "rotate-90")}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isCollapsed && activeMenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full top-0 ml-2 z-50 w-60 bg-white rounded-md shadow-lg p-2 border border-gray-200"
                      >
                        <h4 className="text-xs font-semibold text-gray-500 p-2 border-b border-gray-200 mb-2">
                          {item.name}
                        </h4>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                              isNavLinkActive(child.href)
                                ? 'bg-blue-200 text-blue-800'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                            title={child.description}
                          >
                            <child.icon className="mr-3 h-4 w-4" />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}

                    {!isCollapsed && activeMenu === item.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center pl-10 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
                                isNavLinkActive(child.href)
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              )}
                              title={child.description}
                            >
                              <child.icon className="mr-3 h-4 w-4" />
                              <span className="truncate">{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/settings"
          className={cn(
            "flex items-center p-2 text-sm font-medium rounded-md transition-colors",
            isCollapsed ? 'justify-center' : '',
            isNavLinkActive('/settings') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
          title="Settings"
        >
          <Settings className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && (
            <span>Settings</span>
          )}
        </Link>
      </div>
    </motion.div>
  )
}