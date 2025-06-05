"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

interface Notification {
  id: number
  message: string
  time: string
  isNew: boolean
}

interface NotificationsSectionProps {
  notifications: Notification[]
}

export const NotificationsSection = ({ notifications }: NotificationsSectionProps) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={fadeIn}>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-purple-600 font-medium flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={item}
              className={`p-4 rounded-lg border ${notification.isNew ? "border-purple-100 bg-purple-50" : "border-gray-100"}`}
            >
              <div className="flex justify-between">
                <p className="text-gray-800 font-medium">{notification.message}</p>
                {notification.isNew && (
                  <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">New</span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
