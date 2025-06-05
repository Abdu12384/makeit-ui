"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar, Users, TrendingUp, DollarSign, MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export const Dashboard: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-medium mr-4">
          JD
        </div>
        <div>
          <h1 className="text-2xl font-bold">Welcome back, John Doe!</h1>
          <p className="text-gray-400">Here's what's happening with your events today.</p>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 flex items-start"
          variants={itemVariants}
        >
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4">
            <Calendar size={24} className="text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">42</div>
            <div className="text-sm text-gray-400 mb-2">Upcoming Events</div>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight size={16} />
              <span>12.5% from last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-xl p-6 flex items-start"
          variants={itemVariants}
        >
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4">
            <Users size={24} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">1,248</div>
            <div className="text-sm text-gray-400 mb-2">Total Attendees</div>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight size={16} />
              <span>8.3% from last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-xl p-6 flex items-start"
          variants={itemVariants}
        >
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mr-4">
            <TrendingUp size={24} className="text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">78.4%</div>
            <div className="text-sm text-gray-400 mb-2">Attendance Rate</div>
            <div className="flex items-center text-red-500 text-xs">
              <ArrowDownRight size={16} />
              <span>3.2% from last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-xl p-6 flex items-start"
          variants={itemVariants}
        >
          <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mr-4">
            <DollarSign size={24} className="text-pink-500" />
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">$65.4K</div>
            <div className="text-sm text-gray-400 mb-2">Revenue</div>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight size={16} />
              <span>15.3% from last month</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Event Name</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-700">
                  <td className="py-3">Tech Conference 2025</td>
                  <td className="py-3">May 15, 2025</td>
                  <td className="py-3">San Francisco, CA</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                      Confirmed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Music Festival</td>
                  <td className="py-3">June 2, 2025</td>
                  <td className="py-3">Austin, TX</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-500">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Product Launch</td>
                  <td className="py-3">June 10, 2025</td>
                  <td className="py-3">New York, NY</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                      Confirmed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Charity Gala</td>
                  <td className="py-3">June 25, 2025</td>
                  <td className="py-3">Chicago, IL</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-500">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3">Corporate Retreat</td>
                  <td className="py-3">July 5, 2025</td>
                  <td className="py-3">Miami, FL</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                      Cancelled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Top Vendors</h2>
            <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-medium mr-3">
                CS
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Catering Services Inc.</h4>
                <p className="text-xs text-gray-400">Food & Beverages</p>
              </div>
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">
                4.9
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-medium mr-3">
                AV
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">AudioVisual Pro</h4>
                <p className="text-xs text-gray-400">Equipment & Technology</p>
              </div>
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">
                4.8
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-medium mr-3">
                ED
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Event Decorators</h4>
                <p className="text-xs text-gray-400">Decor & Design</p>
              </div>
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">
                4.7
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 font-medium mr-3">
                SE
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Security Experts</h4>
                <p className="text-xs text-gray-400">Security Services</p>
              </div>
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">
                4.6
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="bg-gray-800 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Monthly Revenue</h2>
          <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>
        <div className="h-64 w-full">
          <div className="h-[90%] flex items-end justify-between px-4">
            {[15, 40, 30, 50, 25, 20, 35, 45, 15].map((height, index) => (
              <motion.div
                key={index}
                className="w-6 bg-indigo-500 rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              ></motion.div>
            ))}
          </div>
          <div className="flex justify-between px-4 mt-2 text-xs text-gray-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
