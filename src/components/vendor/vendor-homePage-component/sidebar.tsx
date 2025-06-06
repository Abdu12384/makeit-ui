import { useLogoutVendor } from "@/hooks/VendorCustomHooks"
import { vendorLogout } from "@/store/slices/vendor.slice"
import { RootState } from "@/store/store"
import { disconnectSocket } from "@/utils/socket/socket"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  LogOut,
  User,
  MessageSquare,
  HelpCircle,
  Shield,
  Calendar,
} from "lucide-react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}






export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
  }

  const overlayVariants = {
    open: { opacity: 0.5, display: "block" },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: "none",
      },
    },
  }

  // Staggered sidebar item variants
  const sidebarItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  const dispatch = useDispatch()
  const { mutate: logout } = useLogoutVendor();
  const navigate = useNavigate()
  const {vendor} = useSelector((state:RootState) => state.vendor)

  
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (data) => {
        disconnectSocket()
        setTimeout(() => {
          dispatch(vendorLogout())
        }, 2000);
				toast.success(data.message);
			},
			onError: (err: any) => {
				toast.error(err.response.data.message);
			},
		});
	};




  return (
    <>
      {/* Overlay for sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Animated Sidebar with Glassmorphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-80 bg-white/80 backdrop-blur-xl shadow-2xl z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={sidebarItemVariants}
                  className="text-xl font-bold text-gray-800"
                >
                  Profile
                </motion.h2>
                <motion.button
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={sidebarItemVariants}
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              </div>

              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={sidebarItemVariants}
                className="flex flex-col items-center mb-8"
              >
                <div className="h-24 w-24 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-2xl mb-4">
                {vendor?.profileImage ? (
                    <img
                    src={vendor?.profileImage}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />):(
                    vendor?.name.slice(0,1)
                    )
                } 
                </div>
                <h3 className="text-xl font-bold text-gray-800">{vendor?.name}</h3>

                <div className="mt-4 flex space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    onClick={()=>navigate("/vendor/chat")}
                    whileTap={{ scale: 0.9 }}
                    className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 cursor-pointer"
                  >
                    <MessageSquare size={16} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={()=>navigate("/vendor/profile")}
                    className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 cursor-pointer"
                  >
                    <User size={16} />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={sidebarItemVariants}
                className="space-y-1 mb-6"
              >
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Settings</h3>

                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={()=>navigate("/vendor/profile")}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Edit Profile</span>
                </motion.div>

                {/* <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Notifications</span>
                </motion.a> */}

                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Privacy & Security</span>
                </motion.a>
              </motion.div>

              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={sidebarItemVariants}
                className="space-y-1 mb-6"
              >
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Quick Actions</h3>

                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Update Availability</span>
                </motion.a>

                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Help & Support</span>
                </motion.a>
              </motion.div>

              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={sidebarItemVariants}
                className="pt-4 border-t"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
