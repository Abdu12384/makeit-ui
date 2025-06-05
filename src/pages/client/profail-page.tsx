import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/client/profail/Sidebar"
import { Menu } from "lucide-react"

interface ProfailLayoutProps {
  children?: React.ReactNode
}

export default function ClientProfailLayout({ children }: ProfailLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white shadow-sm dark:bg-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center ml-auto space-x-4"></div>
        </header>

        {/* Content */}
        <main className="p-1">{children || <Outlet />}</main>
      </motion.div>
    </div>
  )
}
