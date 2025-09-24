'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, UserCheck, MessageSquare, FileText, Calendar,
  BarChart3, Award, GraduationCap, DollarSign, Laptop, Clock,
  Heart, TrendingUp, MessageCircle, AlertCircle, Repeat, CalendarX,
  PieChart, CheckSquare, XCircle, UserPlus, AlertTriangle,
  Clipboard, Bell, Lock,
  ChevronDown, ChevronRight,
  CheckCircle
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  {
    name: 'Dashboard',
    href: '/hr/dashboard',
    icon: BarChart3,
    description: 'General HR view'
  },
  {
    name: 'Incidents',
    href: '/hr/incidents',
    icon: AlertTriangle,
    description: 'Incidents dashboard'
  },
  {
    name: 'Prospect Management',
    icon: Users,
    children: [
      { name: 'Applicants', href: '/hr/applicants', icon: UserCheck, description: 'Applicant tracking' },
      { name: 'Interviews', href: '/hr/applicants/interviews', icon: MessageSquare, description: 'Schedule interviews' },
      { name: 'Priority Vacancies', href: '/hr/applicants/priority-vacancies', icon: AlertCircle, description: 'Critical vacancy tracking' },
      { name: 'Pending Offer Responses', href: '/hr/applicants/pending-offers', icon: Clock, description: 'Follow-up on waiting candidates' },
      { name: 'Psychometric Exam', href: '/hr/applicants/psychometric-exam', icon: CheckSquare, description: 'Results and tracking' },
      { name: 'Onboarding', href: '/hr/applicants/onboarding', icon: UserCheck, description: 'Onboarding process' },
      { name: 'Documents', href: '/hr/applicants/documents', icon: FileText, description: 'Document management' }
    ]
  },
  {
    name: 'Performance Management',
    icon: TrendingUp,
    children: [
      { name: 'Evaluations', href: '/hr/performance', icon: BarChart3, description: 'Performance evaluations' },
      { name: 'Recognitions', href: '/hr/recognition', icon: Award, description: 'Employee recognition' },
      { name: '360° Feedback', href: '/hr/feedback360', icon: MessageSquare, description: 'Competency-based evaluations' },
      { name: 'Work Climate', href: '/hr/work-climate', icon: Heart, description: 'Well-being perception' },
      { name: 'Employee NPS', href: '/hr/nps', icon: TrendingUp, description: 'Employee loyalty' },
      { name: 'Personnel Turnover', href: '/hr/turnover', icon: Repeat, description: 'Turnover rate' },
      { name: 'Absenteeism', href: '/hr/absenteeism', icon: CalendarX, description: 'Absence record' },
      { name: 'Time in Position', href: '/hr/tenure', icon: Clock, description: 'Average tenure' },
      { name: 'Developed Competencies', href: '/hr/skills-matrix', icon: BarChart3, description: 'Skills matrix' }
    ]
  },
  {
    name: 'Benefits and Compensation',
    icon: DollarSign,
    children: [
      { name: 'Benefits Plans', href: '/hr/benefits', icon: Heart, description: 'Administer benefits' },
      { name: 'Compensation', href: '/hr/compensation', icon: DollarSign, description: 'Salaries and bonuses' },
      { name: 'Time Off', href: '/hr/time-off', icon: Calendar, description: 'Vacations and permits' },
      { name: 'Loans and Advances', href: '/hr/loans', icon: DollarSign, description: 'Loan management' },
      { name: 'Overtime', href: '/hr/overtime', icon: Clock, description: 'Overtime control' },
      { name: 'Payroll Costs', href: '/hr/payroll-costs', icon: FileText, description: 'Payroll analysis' },
      { name: 'Payroll Errors', href: '/hr/payroll-errors', icon: XCircle, description: 'Incidents to correct' },
      { name: 'Pending Loans', href: '/hr/pending-loans', icon: DollarSign, description: 'Pending requests' },
      { name: 'Pending Tax Receipts', href: '/hr/pending-receipts', icon: FileText, description: 'CFDI to generate' }
    ]
  },
  {
    name: 'Training and Development',
    icon: GraduationCap,
    children: [
      { name: 'Training Programs', href: '/hr/training', icon: GraduationCap, description: 'Training management' },
      { name: 'Mandatory Courses', href: '/hr/mandatory-training', icon: FileText, description: 'Required training' },
      { name: 'Training Hours', href: '/hr/training-hours', icon: Clock, description: 'Total hours provided' }
    ]
  },
  {
    name: 'HR Operations',
    icon: Laptop,
    children: [
      { name: 'Employee Lists', href: '/hr/employee-lists', icon: Users, description: 'Dynamic lists and emergency contacts' },
      { name: 'Shift Schedule', href: '/hr/shifts', icon: Calendar, description: 'Weekly planning and actual' }
    ]
  },
  {
    name: 'Engagement and Surveys',
    icon: MessageCircle,
    children: [
      { name: 'Surveys', href: '/hr/surveys', icon: MessageCircle, description: 'Employee surveys' },
      { name: 'Survey Participation', href: '/hr/survey-participation', icon: PieChart, description: 'Response rate' },
      { name: 'Results by Area', href: '/hr/survey-results', icon: BarChart3, description: 'Department comparison' }
    ]
  },
  {
    name: 'Alerts and Reminders',
    icon: AlertCircle,
    children: [
      { name: 'Pending Evaluations', href: '/hr/pending-evaluations', icon: Clock, description: 'Upcoming deadlines' },
      { name: 'Expiring Documents', href: '/hr/expiring-documents', icon: FileText, description: 'Contracts and certifications' },
      { name: 'Birthdays and Anniversaries', href: '/hr/reminders', icon: Calendar, description: 'Important dates' },
      { name: 'Excessive Absenteeism', href: '/hr/excessive-absenteeism', icon: CalendarX, description: 'Employees with irregular patterns' },
      { name: 'Budget Exceeded', href: '/hr/budget-exceeded', icon: DollarSign, description: 'Exceeded spending limits' }
    ]
  },
  {
    name: 'Advanced Analytics',
    icon: BarChart3,
    children: [
      { name: 'Turnover Prediction', href: '/hr/turnover-prediction', icon: Repeat, description: 'Employees at risk of leaving' },
      { name: 'Hiring Forecast', href: '/hr/hiring-forecast', icon: UserPlus, description: 'Projected needs' },
      { name: 'Sentiment Analysis', href: '/hr/sentiment-analysis', icon: MessageCircle, description: 'Internal social listening' },
      { name: 'Projected Payroll Cost', href: '/hr/projected-payroll', icon: DollarSign, description: 'Budget prediction' },
      { name: 'Talent at Risk', href: '/hr/talent-at-risk', icon: AlertTriangle, description: 'Vulnerable high performers' },
      { name: 'Salary Benchmarking', href: '/hr/salary-benchmarking', icon: Award, description: 'Market comparison' }
    ]
  },
  {
    name: 'Tools and Quick Access',
    icon: Lock,
    children: [
      { name: 'My Team', href: '/hr/my-team', icon: Users, description: 'Quick view of subordinates' },
      { name: 'Frequent Reports', href: '/hr/frequent-reports', icon: FileText, description: 'Access to saved reports' },
      { name: 'Pending Tasks', href: '/hr/pending-tasks', icon: Clipboard, description: 'Personalized to-do list' },
      { name: 'Notifications', href: '/hr/notifications', icon: Bell, description: 'Alert center' },
      { name: 'Generate Report', href: '/hr/generate-report', icon: FileText, description: 'Instant export' },
      { name: 'Process Payroll', href: '/hr/process-payroll', icon: DollarSign, description: 'Start pay cycle' }
    ]
  }
]


export function EnterpriseSidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

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
        <h2 className="text-lg font-semibold text-gray-900">HR System</h2>
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
                      ? 'bg-blue-50 text-blue-700'
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
                                ? 'bg-blue-100 text-blue-700'
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
                  ? 'bg-blue-100 text-blue-700'
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