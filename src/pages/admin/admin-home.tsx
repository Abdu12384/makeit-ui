

import type React from "react"
import { motion } from "framer-motion"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/admin/sidebar/Sidebar"

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="fixed top-0 left-0 w-72 h-screen bg-gray-950 border-r border-gray-800 flex flex-col z-50">
      <Sidebar />
     </div>
      <motion.main
        className="flex-1 ml-72 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}