'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  PiggyBank, Download, TrendingUp, DollarSign, 
  Users, BarChart3, Calendar, Target
} from 'lucide-react'
import { PayrollSidebar } from '@/components/payroll-sidebar'
import { Navigation } from '@/components/navigation'

interface SavingsOverview {
  totalFund: number
  totalBox: number
  totalSavings: number
  monthlyContributions: number
  activeParticipants: number
  totalParticipants: number
  averageBalance: number
  fundGrowthRate: number
  monthlyGrowth: number
  yearToDateGrowth: number
}

interface DepartmentSavings {
  department: string
  participants: number
  totalSavings: number
  averageContribution: number
  participationRate: number
}

interface MonthlySavings {
  month: string
  fundContributions: number
  boxContributions: number
  totalContributions: number
  withdrawals: number
  netGrowth: number
}

export default function SavingsOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<SavingsOverview | null>(null)
  const [departmentData, setDepartmentData] = useState<DepartmentSavings[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlySavings[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || ![Role.ADMIN, Role.PAYROLL].includes(session.user.role as Role)) {
      router.push('/general/dashboard')
      return
    }
    fetchSavingsOverview()
  }, [session, status, router])

  const fetchSavingsOverview = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockOverview: SavingsOverview = {
        totalFund: 485000,
        totalBox: 387500,
        totalSavings: 872500,
        monthlyContributions: 28750,
        activeParticipants: 45,
        totalParticipants: 52,
        averageBalance: 16826,
        fundGrowthRate: 8.5,
        monthlyGrowth: 3.2,
        yearToDateGrowth: 12.8
      }

      const mockDepartmentData: DepartmentSavings[] = [
        {
          department: 'Engineering',
          participants: 12,
          totalSavings: 285000,
          averageContribution: 950,
          participationRate: 92.3
        },
        {
          department: 'Production',
          participants: 18,
          totalSavings: 234000,
          averageContribution: 650,
          participationRate: 85.7
        },
        {
          department: 'Administration',
          participants: 8,
          totalSavings: 156000,
          averageContribution: 780,
          participationRate: 88.9
        },
        {
          department: 'Quality Control',
          participants: 6,
          totalSavings: 98500,
          averageContribution: 550,
          participationRate: 75.0
        },
        {
          department: 'Maintenance',
          participants: 5,
          totalSavings: 67000,
          averageContribution: 480,
          participationRate: 83.3
        },
        {
          department: 'Finance',
          participants: 3,
          totalSavings: 32000,
          averageContribution: 420,
          participationRate: 100.0
        }
      ]

      const mockMonthlyData: MonthlySavings[] = [
        {
          month: '2024-03',
          fundContributions: 15200,
          boxContributions: 12800,
          totalContributions: 28000,
          withdrawals: 5500,
          netGrowth: 22500
        },
        {
          month: '2024-04',
          fundContributions: 15800,
          boxContributions: 13200,
          totalContributions: 29000,
          withdrawals: 3200,
          netGrowth: 25800
        },
        {
          month: '2024-05',
          fundContributions: 16100,
          boxContributions: 13400,
          totalContributions: 29500,
          withdrawals: 7800,
          netGrowth: 21700
        },
        {
          month: '2024-06',
          fundContributions: 15900,
          boxContributions: 13100,
          totalContributions: 29000,
          withdrawals: 4500,
          netGrowth: 24500
        },
        {
          month: '2024-07',
          fundContributions: 16300,
          boxContributions: 13600,
          totalContributions: 29900,
          withdrawals: 6200,
          netGrowth: 23700
        },
        {
          month: '2024-08',
          fundContributions: 15700,
          boxContributions: 12900,
          totalContributions: 28600,
          withdrawals: 2800,
          netGrowth: 25800
        }
      ]

      setOverview(mockOverview)
      setDepartmentData(mockDepartmentData)
      setMonthlyData(mockMonthlyData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    alert('Savings overview data exported successfully!')
  }

  if (status === 'loading' || loading || !overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <PayrollSidebar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <PiggyBank className="h-8 w-8 mr-3 text-indigo-600" /> Savings Fund Overview
            </h1>
            <button 
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> Export Data
            </button>
          </div>

          {/* Main Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <PiggyBank className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Savings Fund</p>
                  <p className="text-2xl font-bold text-gray-900">${overview.totalFund.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <PiggyBank className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Savings Box</p>
                  <p className="text-2xl font-bold text-gray-900">${overview.totalBox.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Combined Total</p>
                  <p className="text-2xl font-bold text-gray-900">${overview.totalSavings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Contributions</p>
                  <p className="text-2xl font-bold text-gray-900">${overview.monthlyContributions.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.activeParticipants}/{overview.totalParticipants}</p>
                  <p className="text-sm text-gray-500">{((overview.activeParticipants / overview.totalParticipants) * 100).toFixed(1)}% participation</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-cyan-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${overview.averageBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fund Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.fundGrowthRate}%</p>
                  <p className="text-sm text-gray-500">Annual target</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">YTD Growth</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.yearToDateGrowth}%</p>
                  <p className="text-sm text-green-600">+{overview.monthlyGrowth}% this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Savings by Department</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {departmentData.map(dept => (
                    <div key={dept.department} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                          <span className="text-sm text-gray-500">{dept.participants} participants</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">${dept.totalSavings.toLocaleString()}</span>
                          <span className="text-sm text-green-600">{dept.participationRate}% participation</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(dept.totalSavings / 285000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Monthly Contribution Trends</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {monthlyData.slice(-6).map(month => (
                    <div key={month.month} className="border-b border-gray-100 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{month.month}</span>
                        <span className="text-sm font-bold text-green-600">${month.totalContributions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                        <span>Fund: ${month.fundContributions.toLocaleString()}</span>
                        <span>Box: ${month.boxContributions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="text-red-600">Withdrawals: ${month.withdrawals.toLocaleString()}</span>
                        <span className="text-green-600">Net: +${month.netGrowth.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Key Performance Indicators</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{((overview.totalFund / overview.totalSavings) * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Fund vs Total Ratio</div>
                  <div className="text-xs text-gray-500 mt-1">Optimal range: 55-65%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${(overview.monthlyContributions / overview.activeParticipants).toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Avg Monthly Contribution</div>
                  <div className="text-xs text-gray-500 mt-1">Per active participant</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{overview.fundGrowthRate}%</div>
                  <div className="text-sm text-gray-600">Annual Growth Target</div>
                  <div className="text-xs text-green-500 mt-1">On track: {overview.yearToDateGrowth}% YTD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
