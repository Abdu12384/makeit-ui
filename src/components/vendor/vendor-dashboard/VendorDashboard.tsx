"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import { useGetDashboardDataMutation } from "@/hooks/VendorCustomHooks"
import { WalletTransactionGraph } from "@/components/common/dashboard-tracking/RevenewTracking"

// You can create a simple DateFilter component or import your existing one
interface FilterPeriod {
  day: "day"
  week: "week"
  month: "month"
}

interface DateFilterProps {
  selectedPeriod: keyof FilterPeriod
  onPeriodChange: (period: keyof FilterPeriod) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  theme?: "dark" | "light"
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  theme = "light",
}) => {
  const periods = [
    { key: "day" as const, label: "Today" },
    { key: "week" as const, label: "This Week" },
    { key: "month" as const, label: "This Month" },
  ]

  return (
    <div className="flex items-center gap-2">
      {periods.map((period) => (
        <button
          key={period.key}
          onClick={() => onPeriodChange(period.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPeriod === period.key
              ? theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700"
              : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend: "up" | "down"
  color: string
  emoji: string
}

interface VendorDashboardData {
  totalEventsHosted: number
  totalTicketsSold: number
  totalRevenue: number
  totalBookings: number
  transactions?: Transaction[]
  recentBookings?: RecentBooking[]
  recentTickets?: RecentTicket[]
}

interface Transaction {
  _id: string
  amount: number
  currency: string
  paymentStatus: "credit" | "debit"
  paymentType: string
  walletId: string
  date: string
  createdAt: string
  updatedAt: string
}

interface RecentBooking {
  _id: string
  eventName: string
  clientName: string
  bookingDate: string
  amount: number
  status: "confirmed" | "pending" | "cancelled"
  service?: {
    serviceTitle: string
  }
  date?: string[]
}

interface RecentTicket {
  _id: string
  eventName: string
  ticketsSold: number
  saleDate: string
  revenue: number
}

// Default empty data structure
const getDefaultDashboardData = (): VendorDashboardData => ({
  totalEventsHosted: 0,
  totalTicketsSold: 0,
  totalRevenue: 0,
  totalBookings: 0,
  transactions: [],
  recentBookings: [],
  recentTickets: [],
})

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend, color, emoji }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change > 0 ? "+" : ""}
          {change}%
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        </div>
        <p className="text-gray-900 text-2xl font-bold">{value}</p>
      </div>
      <div className="mt-4 h-8 flex items-end gap-1">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${trend === "up" ? "bg-green-200" : "bg-red-200"}`}
            style={{ height: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.7 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// No Data Component
const NoDataMessage: React.FC<{ message: string; icon: React.ReactNode }> = ({ message, icon }) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
    <div className="p-4 rounded-full bg-gray-100 mb-3">
      {icon}
    </div>
    <p className="text-sm font-medium">{message}</p>
  </div>
)

export const VendorDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof FilterPeriod>("week")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dashboardData, setDashboardData] = useState<VendorDashboardData>(getDefaultDashboardData())
  const getDashboardDataMutation = useGetDashboardDataMutation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API call with proper error handling and default values
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      getDashboardDataMutation.mutate(
        selectedPeriod,
        {
          onSuccess: (data) => {
            console.log("data", data)
            
            // Set data with fallback to 0 for numeric values and empty arrays for lists
            setDashboardData({
              totalEventsHosted: data?.data?.totalEvents || 0,
              totalTicketsSold: data?.data?.totalTickets || 0,
              totalRevenue: data?.data?.totalRevenue || 0,
              totalBookings: data?.data?.totalBookings || 0,
              transactions: data?.data?.transactions || [],
              recentBookings: data?.data?.recentBookings || [],
              recentTickets: data?.data?.recentTickets || [],
            })
            setLoading(false)
          },
          onError: (error) => {
            console.log("Dashboard API Error:", error)
            setError("Failed to load dashboard data")
            // Set default values on error
            setDashboardData(getDefaultDashboardData())
            setLoading(false)
          }
        }
      )
    }

    fetchDashboardData()
  }, [selectedPeriod])

  const formatValue = (value: number, type: "currency" | "number" = "number") => {
    // Handle null, undefined, or NaN values
    const safeValue = value || 0
    
    if (type === "currency") {
      if (safeValue >= 1000000) return `₹${(safeValue / 1000000).toFixed(1)}M`
      if (safeValue >= 1000) return `₹${(safeValue / 1000).toFixed(1)}K`
      return `₹${safeValue}`
    }

    if (safeValue >= 1000000) return `${(safeValue / 1000000).toFixed(1)}M`
    if (safeValue >= 1000) return `${(safeValue / 1000).toFixed(1)}K`
    return safeValue.toString()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats: StatCardProps[] = [
    {
      title: "Total Events Hosted",
      value: formatValue(dashboardData.totalEventsHosted),
      change: dashboardData.totalEventsHosted > 0 ? 12 : 0,
      trend: dashboardData.totalEventsHosted > 0 ? "up" : "up", // Keep positive UI even for 0
      icon: <Calendar size={24} className="text-blue-600" />,
      color: "bg-blue-50",
      emoji: "🗓️",
    },
    {
      title: "Total Tickets Sold",
      value: formatValue(dashboardData.totalTicketsSold),
      change: dashboardData.totalTicketsSold > 0 ? 8 : 0,
      trend: dashboardData.totalTicketsSold > 0 ? "up" : "up",
      icon: <Ticket size={24} className="text-green-600" />,
      color: "bg-green-50",
      emoji: "🎟️",
    },
    {
      title: "Total Revenue",
      value: formatValue(dashboardData.totalRevenue, "currency"),
      change: dashboardData.totalRevenue > 0 ? 15 : 0,
      trend: dashboardData.totalRevenue > 0 ? "up" : "up",
      icon: <IndianRupee size={24} className="text-yellow-600" />,
      color: "bg-yellow-50",
      emoji: "💸",
    },
    {
      title: "Total Bookings",
      value: formatValue(dashboardData.totalBookings),
      change: dashboardData.totalBookings > 0 ? 5 : 0,
      trend: dashboardData.totalBookings > 0 ? "up" : "up",
      icon: <Users size={24} className="text-purple-600" />,
      color: "bg-purple-50",
      emoji: "👥",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <DateFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            theme="light"
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          key={`stats-${selectedPeriod}-${selectedDate.getTime()}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              emoji={stat.emoji}
            />
          ))}
        </motion.div>

        {/* Wallet Transaction Graph */}
        <WalletTransactionGraph 
          transactions={dashboardData.transactions || []} 
          period={selectedPeriod} 
          theme="light" 
        />

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Users size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                  <p className="text-sm text-gray-600">Latest event bookings</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                dashboardData.recentBookings.map((booking) => (
                  <div key={booking?._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Calendar size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {booking?.service?.serviceTitle || booking?.eventName || "Untitled Event"}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{booking?.clientName || "Unknown Client"}</span>
                          <span>•</span>
                          <span>{formatDate(booking?.date?.[0] || booking?.bookingDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {booking?.amount && (
                        <div className="font-bold text-gray-900">₹{booking.amount.toLocaleString()}</div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking?.status)}`}>
                        {booking?.status || "pending"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <NoDataMessage 
                  message="No recent bookings found" 
                  icon={<Users size={24} className="text-gray-400" />}
                />
              )}
            </div>

            <button className="w-full mt-4 py-2 text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-2">
              <Eye size={16} />
              View All Bookings
            </button>
          </motion.div>

          {/* Recent Ticket Sales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Ticket size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Ticket Sales</h3>
                  <p className="text-sm text-gray-600">Latest ticket transactions</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentTickets && dashboardData.recentTickets.length > 0 ? (
                dashboardData.recentTickets.map((ticket) => (
                  <div key={ticket?._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Ticket size={16} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{ticket?.eventName || "Untitled Event"}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{ticket?.ticketsSold || 0} tickets</span>
                          <span>•</span>
                          <span>{formatDate(ticket?.saleDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{(ticket?.revenue || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{ticket?.ticketsSold || 0} sold</div>
                    </div>
                  </div>
                ))
              ) : (
                <NoDataMessage 
                  message="No recent ticket sales found" 
                  icon={<Ticket size={24} className="text-gray-400" />}
                />
              )}
            </div>

            <button className="w-full mt-4 py-2 text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2">
              <Eye size={16} />
              View All Sales
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}