"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Service {
  id: number
  name: string
  icon: LucideIcon
  description: string
  color: string
}

interface ServicesSectionProps {
  services: Service[]
}

export const ServicesSection = ({ services }: ServicesSectionProps) => {
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
        <h2 className="text-2xl font-bold text-gray-800">Our Services</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-purple-600 font-medium flex items-center"
        >
          View All Services
          <ChevronRight className="h-4 w-4 ml-1" />
        </motion.button>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={item}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
