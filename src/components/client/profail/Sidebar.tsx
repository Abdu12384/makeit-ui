"use client"
import { motion, AnimatePresence } from "framer-motion"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { User, Calendar, Home, ChevronLeft, Wallet, Ticket, MessageCircle } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useState, useEffect } from "react"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const client = useSelector((root: RootState) => root.client)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { icon: User, label: "Profile", path: "/client/profile" },
    { icon: Calendar, label: "Bookings", path: "/client/bookings" },
    { icon: Wallet, label: "Wallet", path: "/client/wallet" },
    { icon: Ticket, label: "My Tickets", path: "/client/my-tickets" },
    { icon: MessageCircle, label: "Chat", path: "/client/chat" },
  ]

  // Sidebar variants for animation
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  // Item variants for staggered animation
  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { x: -20, opacity: 0 },
  }

  // Determine if an item is active
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-y-0 left-0 z-30 w-72 border-r lg:static
              ${
                isScrolled
                  ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/70 dark:border-gray-700/70"
                  : "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
              }`}
          >
            {/* Header with profile */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="relative h-24 px-6 flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent z-0"></div>

              <div className="flex items-center space-x-3 z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    {client.client?.profileImage ? (
                      <img
                        src={`${CLOUDINARY_BASE_URL}/${client.client.profileImage}`}
                        alt="User avatar"
                        className="w-11 h-11 rounded-full object-cover border-2 border-white"
                        onClick={() => navigate("/")}
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 dark:text-white">{client.client?.name || "User"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {client.client?.email || "user@example.com"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 p-1.5 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-sm hover:bg-white dark:hover:bg-gray-700 lg:hidden transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>

            {/* Navigation */}
            <div className="px-3 py-6">
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <motion.div
                      key={item.path}
                      variants={itemVariants}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <NavLink
                        to={item.path}
                        className="block relative"
                        onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                      >
                        <motion.div
                          animate={{
                            x: hoveredItem === item.path ? 5 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`flex items-center px-4 py-3 rounded-xl transition-all
                            ${
                              active
                                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
                            }`}
                        >
                          <item.icon
                            className={`w-5 h-5 mr-3 ${active ? "text-white" : "text-gray-500 dark:text-gray-400"}`}
                          />
                          <span className="font-medium">{item.label}</span>

                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                          )}
                        </motion.div>
                      </NavLink>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="absolute bottom-0 w-full p-4">
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Home className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Back to Home</span>
                </button>
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
