"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

export const CalendarSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-purple-600 font-medium flex items-center"
          >
            Open Calendar
            <ChevronRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2 // Offset to start from previous month
            const isCurrentMonth = day > 0 && day <= 30
            const isToday = day === 15
            const hasEvent = [5, 12, 15, 22].includes(day)

            return (
              <motion.div
                key={i}
                whileHover={isCurrentMonth ? { scale: 1.1, backgroundColor: "#F3F4F6" } : {}}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                  ${!isCurrentMonth ? "text-gray-300" : "text-gray-700 cursor-pointer"}
                  ${isToday ? "bg-purple-100 text-purple-700 font-bold" : ""}
                `}
              >
                <span>{day > 0 ? (day <= 30 ? day : day - 30) : 30 + day}</span>
                {hasEvent && isCurrentMonth && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? "bg-purple-500" : "bg-purple-400"}`}></div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
