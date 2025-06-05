"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, CreditCard, MoreHorizontal, Wallet } from "lucide-react"

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

interface FilterPeriod {
  day: "day"
  week: "week"
  month: "month"
}

interface WalletTransactionGraphProps {
  transactions: Transaction[]
  period: keyof FilterPeriod
  theme?: "dark" | "light"
}

export const WalletTransactionGraph: React.FC<WalletTransactionGraphProps> = ({
  transactions,
  period = "week",
  theme = "light",
}) => {
  const processTransactionData = () => {
    const now = new Date()
    const labels: string[] = []
    const creditData: number[] = []
    const debitData: number[] = []

    // Generate labels and initialize data arrays
    if (period === "day") {
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now)
        hour.setHours(now.getHours() - i, 0, 0, 0)
        labels.push(hour.getHours().toString().padStart(2, "0") + ":00")
        creditData.push(0)
        debitData.push(0)
      }
    } else if (period === "week") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now)
        day.setDate(now.getDate() - i)
        day.setHours(0, 0, 0, 0)
        labels.push(day.toLocaleDateString("en-US", { weekday: "short" }))
        creditData.push(0)
        debitData.push(0)
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now)
        month.setMonth(now.getMonth() - i, 1)
        month.setHours(0, 0, 0, 0)
        labels.push(month.toLocaleDateString("en-US", { month: "short" }))
        creditData.push(0)
        debitData.push(0)
      }
    }

    // Process transactions with improved logic
    transactions.forEach((transaction) => {
      // Validate transaction date
      const transactionDate = new Date(transaction.date)
      if (isNaN(transactionDate.getTime())) {
        console.warn("Invalid transaction date:", transaction.date)
        return
      }

      let index = -1

      if (period === "day") {
        // Group by hour
        const hourStart = new Date(now)
        hourStart.setHours(now.getHours() - 23, 0, 0, 0)

        if (transactionDate >= hourStart && transactionDate <= now) {
          const hoursDiff = Math.floor((transactionDate.getTime() - hourStart.getTime()) / (1000 * 60 * 60))
          index = Math.min(23, Math.max(0, hoursDiff))
        }
      } else if (period === "week") {
        // Group by day
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - 6)
        weekStart.setHours(0, 0, 0, 0)

        if (transactionDate >= weekStart && transactionDate <= now) {
          const daysDiff = Math.floor((transactionDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))
          index = Math.min(6, Math.max(0, daysDiff))
        }
      } else {
        // Group by month
        const monthStart = new Date(now)
        monthStart.setMonth(now.getMonth() - 11, 1)
        monthStart.setHours(0, 0, 0, 0)

        if (transactionDate >= monthStart && transactionDate <= now) {
          const monthsDiff =
            (transactionDate.getFullYear() - monthStart.getFullYear()) * 12 +
            (transactionDate.getMonth() - monthStart.getMonth())
          index = Math.min(11, Math.max(0, monthsDiff))
        }
      }

      // Add transaction to appropriate bucket
      if (index >= 0 && index < labels.length) {
        if (transaction.paymentStatus === "credit") {
          creditData[index] += transaction.amount
        } else if (transaction.paymentStatus === "debit") {
          debitData[index] += transaction.amount
        }
      }
    })

    return { labels, creditData, debitData }
  }

  const { labels, creditData, debitData } = processTransactionData()
  const maxValue = Math.max(...creditData, ...debitData, 100) // Minimum scale of 100

  const totalCredits = creditData.reduce((sum, val) => sum + val, 0)
  const totalDebits = debitData.reduce((sum, val) => sum + val, 0)
  const netAmount = totalCredits - totalDebits

  const baseClasses =
    theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"

  // Chart dimensions and spacing
  const chartWidth = 800
  const chartHeight = 200
  const leftMargin = 60
  const rightMargin = 20
  const topMargin = 10
  const bottomMargin = 30
  const plotWidth = chartWidth - leftMargin - rightMargin
  const plotHeight = chartHeight - topMargin - bottomMargin

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-6 border shadow-sm ${baseClasses}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-green-500/20" : "bg-green-100"}`}>
            <Wallet size={20} className="text-green-500" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Wallet Transactions
            </h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {period === "day" ? "Last 24 hours" : period === "week" ? "Last 7 days" : "Last 12 months"}
            </p>
          </div>
        </div>
        <button
          className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight size={16} className="text-green-500" />
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Credits
            </span>
          </div>
          <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            ₹{totalCredits.toLocaleString()}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft size={16} className="text-red-500" />
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Debits
            </span>
          </div>
          <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            ₹{totalDebits.toLocaleString()}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} className={netAmount >= 0 ? "text-green-500" : "text-red-500"} />
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Net</span>
          </div>
          <p className={`text-xl font-bold ${netAmount >= 0 ? "text-green-500" : "text-red-500"}`}>
            {netAmount >= 0 ? "+" : ""}₹{Math.abs(netAmount).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Credits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Debits</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <svg className="w-full h-64" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={leftMargin}
              y1={topMargin + (i * plotHeight) / 4}
              x2={chartWidth - rightMargin}
              y2={topMargin + (i * plotHeight) / 4}
              stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x={leftMargin - 10}
              y={topMargin + (i * plotHeight) / 4 + 4}
              fill={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              fontSize="10"
              textAnchor="end"
              dominantBaseline="middle"
            >
              ₹{((maxValue * (4 - i)) / 4).toLocaleString()}
            </text>
          ))}

          {/* Bars and X-axis labels */}
          {labels.map((label, index) => {
            const barGroupWidth = plotWidth / labels.length
            const barWidth = Math.max(8, barGroupWidth * 0.6) // Minimum bar width of 8px
            const barSpacing = 2
            const groupCenterX = leftMargin + (index + 0.5) * barGroupWidth

            const creditBarX = groupCenterX - barWidth / 2 - barSpacing / 2
            const debitBarX = groupCenterX + barSpacing / 2

            const creditHeight = Math.max(2, (creditData[index] / maxValue) * plotHeight)
            const debitHeight = Math.max(2, (debitData[index] / maxValue) * plotHeight)

            return (
              <g key={index}>
                {/* Credit bar */}
                <motion.rect
                  initial={{ height: 0, y: chartHeight - bottomMargin }}
                  animate={{
                    height: creditHeight,
                    y: chartHeight - bottomMargin - creditHeight,
                  }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                  x={creditBarX}
                  width={barWidth / 2}
                  fill="#10B981"
                  rx="2"
                />

                {/* Debit bar */}
                <motion.rect
                  initial={{ height: 0, y: chartHeight - bottomMargin }}
                  animate={{
                    height: debitHeight,
                    y: chartHeight - bottomMargin - debitHeight,
                  }}
                  transition={{ duration: 1, delay: index * 0.05 + 0.1 }}
                  x={debitBarX}
                  width={barWidth / 2}
                  fill="#EF4444"
                  rx="2"
                />

                {/* X-axis label */}
                <text
                  x={groupCenterX}
                  y={chartHeight - bottomMargin + 15}
                  fill={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {label}
                </text>

                {/* Hover tooltip area */}
                <rect
                  x={creditBarX}
                  y={topMargin}
                  width={barWidth + barSpacing}
                  height={plotHeight}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                >
                  <title>
                    {`${label}\nCredits: ₹${creditData[index].toLocaleString()}\nDebits: ₹${debitData[index].toLocaleString()}`}
                  </title>
                </rect>
              </g>
            )
          })}

          {/* X-axis line */}
          <line
            x1={leftMargin}
            y1={chartHeight - bottomMargin}
            x2={chartWidth - rightMargin}
            y2={chartHeight - bottomMargin}
            stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
            strokeWidth="1"
          />

          {/* Y-axis line */}
          <line
            x1={leftMargin}
            y1={topMargin}
            x2={leftMargin}
            y2={chartHeight - bottomMargin}
            stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Debug info (remove in production) */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
        <p>Debug: Found {transactions.length} transactions</p>
        <p>
          Period: {period} | Total Credits: ₹{totalCredits} | Total Debits: ₹{totalDebits}
        </p>
      </div>
    </motion.div>
  )
}
