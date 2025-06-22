import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Menu, X } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import VendorNotificationDropdown from "./notifcation"

interface HeaderProps {
  currentTime: Date
  isLiveIndicatorVisible: boolean
  openSidebar: () => void
}

export const Header = ({ isLiveIndicatorVisible, openSidebar }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
   const {vendor} = useSelector((state:RootState) => state.vendor)


  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
            MI
          </div>
          <span className="text-xl font-bold text-purple-600">MakeIT</span>
        </motion.div>

        {/* Real-time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-2"
        >
          <div className="flex items-center">
            <motion.div
              animate={{
                scale: isLiveIndicatorVisible ? [1, 1.2, 1] : 1,
                opacity: isLiveIndicatorVisible ? [1, 0.8, 1] : 1,
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:flex items-center space-x-8"
        >
          <div className="font-medium text-purple-600">
            Home
          </div>
          
        </motion.nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >

          <VendorNotificationDropdown/>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openSidebar}
            className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-medium cursor-pointer"
          >
          {vendor?.profileImage ? (
             <img
             src={vendor?.profileImage}
             alt="Profile"
             className="h-full w-full rounded-full object-cover"
           />):(
             vendor?.name.slice(0,1)
            )
         } 
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <a href="#" className="font-medium text-purple-600 py-2">
                Home
              </a>
              <div className="flex items-center space-x-2 py-2">
                <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-medium text-sm">
                  JD
                </div>
                <span className="font-medium">John Doe</span>
              </div>
              <a href="#" className="flex items-center space-x-2 text-red-500 py-2">
                <LogOut size={18} />
                <span>Logout</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
