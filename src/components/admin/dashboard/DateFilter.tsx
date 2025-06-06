"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  ChevronDown, Filter } from "lucide-react"

export type FilterPeriod = "day" | "week" | "month"

interface DateFilterProps {
  selectedPeriod: FilterPeriod
  onPeriodChange: (period: FilterPeriod) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  theme?: "dark" | "light"
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  theme = "light",
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const periods = [
    { value: "day" as FilterPeriod, label: "Daily", desc: "View daily metrics" },
    { value: "week" as FilterPeriod, label: "Weekly", desc: "View weekly trends" },
    { value: "month" as FilterPeriod, label: "Monthly", desc: "View monthly overview" },
  ]



  const baseClasses =
    theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"

  const buttonClasses =
    theme === "dark"
      ? "hover:bg-gray-700 text-gray-300 hover:text-white"
      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"

  return (
    <div className="flex items-center gap-4">
      {/* Period Selector */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${baseClasses} ${buttonClasses}`}
        >
          <Filter size={16} />
          <span className="font-medium">{periods.find((p) => p.value === selectedPeriod)?.label}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute top-full right-10 mt-2 w-64 rounded-lg border shadow-lg z-50 ${baseClasses}`}
            >
              <div className="p-2">
                {periods.map((period) => (
                  <motion.button
                    key={period.value}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      onPeriodChange(period.value)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedPeriod === period.value
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                        : buttonClasses
                    }`}
                  >
                    <div className="font-medium">{period.label}</div>
                    <div
                      className={`text-sm ${
                        selectedPeriod === period.value
                          ? theme === "dark"
                            ? "text-blue-200"
                            : "text-blue-500"
                          : theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {period.desc}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </div>
  )
}

export default DateFilter
