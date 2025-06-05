"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, User, Briefcase, ImageIcon, Calendar, Clock, Key, Wallet, Menu, ChevronRight, Ticket, LayoutDashboard, MessageCircle, User2 } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface CircularSidebarProps {
  children?: React.ReactNode
}

const menuItems = [
  { id: "profile", label: "My Profile", icon: User, path: "/vendor/profile" },
  { id: "services", label: "Services", icon: Briefcase, path: "/vendor/services" },
  { id: "samples", label: "Work Samples", icon: ImageIcon, path: "/vendor/work-sample" },
  { id: "bookings", label: "Bookings", icon: Calendar, path: "/vendor/bookings" },
  { id: "events", label: "Events", icon: Clock, path: "/vendor/events" },
  { id: "booked-events", label: "Booked Events", icon: Ticket, path: "/vendor/booked-events" },
  { id: "chat", label: "Chat", icon: MessageCircle, path: "/vendor/chat" },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "/vendor/wallet" },
]

export const CircularSidebar: React.FC<CircularSidebarProps> = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const navigate = useNavigate()
  
  const {vendor} = useSelector((state: RootState) => state.vendor)
  


  useEffect(() => {
    const currentPath = location.pathname
    const index = menuItems.findIndex((item) => item.path === currentPath)
    if (index !== -1) {
      setActiveSection(index)
    }
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isOpen) {
        e.preventDefault()
        setActiveSection((prev) =>
          e.deltaY > 0 ? (prev + 1) % menuItems.length : (prev - 1 + menuItems.length) % menuItems.length,
        )
      }
    }

    const el = menuRef.current
    if (el) el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el?.removeEventListener("wheel", handleWheel)
  }, [isOpen])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Container */}
      <div className="relative" ref={menuRef}>
        {/* Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed top-1/2 left-6 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg"
        >
          {isOpen ? <ChevronRight size={24} /> : <Menu size={24} />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-1/2 left-0 -translate-y-1/2 z-40"
            >
              {/* Circular Background */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-[300px] h-[300px] rounded-full bg-indigo-600 fixed top-1/2 left-0 -translate-y-1/2"
                style={{ filter: "blur(0px)" }}
              />

              {/* Profile Image and Info */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed top-1/2 left-[150px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-50"
              >
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                  <div onClick={()=>navigate('/vendor/home')} className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {vendor?.profileImage ? (
                      <img
                        src={vendor?.profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <User2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <h3 className="font-bold text-white">{vendor?.name}</h3>
                </div>
              </motion.div>

              {/* Menu Items */}
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeSection === index

                // Calculate positions in a semi-circle on the left side
                const totalItems = menuItems.length
                const angle = (index / (totalItems - 1)) * Math.PI - Math.PI / 2
                const radius = 150
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.div
                    key={item.id}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                      x: x + 150,
                      y: y + 0,
                      opacity: 1,
                      scale: isActive ? 1.2 : 1,
                      zIndex: isActive ? 20 : 10,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.05,
                    }}
                    className="fixed top-1/2 left-0 -translate-y-1/2 cursor-pointer"
                  >
                    <NavLink to={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg relative ${
                          isActive ? "bg-white text-indigo-600" : "bg-indigo-500 text-white"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        {item?.badge && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                            !
                          </div>
                        )}
                      </motion.div>
                    </NavLink>

                    {/* Active Label */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="absolute top-1/2 left-16 -translate-y-1/2 bg-white rounded-lg shadow-md px-3 py-1.5 text-sm font-medium text-gray-800 whitespace-nowrap z-50"
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
