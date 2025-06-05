"use client"

import { motion } from "framer-motion"
import { BarChart3, Users, DollarSign, Star, ChevronRight } from "lucide-react"

export const WelcomeStats = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={fadeIn} className="mb-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, John!</h1>
            <p className="text-gray-600 mb-6">Here's what's happening with your events today.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-purple-50 rounded-lg p-4 border border-purple-100"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Total Events</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <span>↑ 12% from last month</span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-blue-50 rounded-lg p-4 border border-blue-100"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Total Attendees</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">4,250</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <span>↑ 18% from last month</span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-green-50 rounded-lg p-4 border border-green-100"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Revenue</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">$24,500</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <span>↑ 8% from last month</span>
                </p>
              </motion.div>
            </div>
          </div>

          <div className="md:w-1/3 bg-purple-600 p-8 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-4">Vendor Status</h2>
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-100">Profile Completion</span>
                    <span className="text-purple-100">85%</span>
                  </div>
                  <div className="w-full bg-purple-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-white h-2 rounded-full"
                    ></motion.div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-300 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm">5.0 (42 reviews)</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-white text-purple-600 py-2 px-4 rounded-lg font-medium flex items-center justify-center"
              >
                Complete Your Profile
                <ChevronRight className="h-4 w-4 ml-1" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
