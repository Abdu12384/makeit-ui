"use client"

import { motion } from "framer-motion"
import { Calendar, Users, Clock, ChevronRight } from "lucide-react"

interface Event {
  id: number
  name: string
  date: string
  location: string
  status: string
  attendees: number
  image: string
}

interface EventsSectionProps {
  events: Event[]
}

export const EventsSection = ({ events }: EventsSectionProps) => {
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
    <motion.section initial="hidden" animate="visible" variants={fadeIn} className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-purple-600 font-medium flex items-center"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </motion.button>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={item}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="relative h-40">
              <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
              <div
                className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.status}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{event.name}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.attendees} Attendees</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">9:00 AM - 5:00 PM</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 rounded-lg font-medium transition-colors"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
