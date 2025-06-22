"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { CalendarCheck, FileBarChart2, Home, UserCircle, Menu, X, ChevronDown, LogOut } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useLogoutClient, useSaveClientFCMTokenMutation } from "@/hooks/ClientCustomHooks"
import { useDispatch } from "react-redux"
import { clientLogout } from "@/store/slices/client.slice"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { disconnectSocket } from "@/utils/socket/socket"
import { listenForForegroundMessages, requestNotificationPermission } from "@/services/firebase/messaging"
import NotificationDropdown from "./notification/notification"

interface NavbarProps {
  variant?: "transparent" | "solid"
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export const Navbar: React.FC<NavbarProps> = ({ variant = "solid" }) => {
  const { isLoggedIn, client } = useSelector((state: RootState) => state.client)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const {mutate:saveFCMTokenMutation} = useSaveClientFCMTokenMutation()

  const { mutate: logout } = useLogoutClient()



  const setupFCM = useCallback(async () => {
    if (!isLoggedIn) return;
  
    try {
      // Check if notifications are blocked
      if (Notification.permission === 'denied') {
        console.log('Notifications are blocked by user');
        return;
      }
  
      const cachedToken = localStorage.getItem("fcmToken");
      const token = await requestNotificationPermission();
  
      if (token && token !== cachedToken) {
        saveFCMTokenMutation(token, {
          onSuccess: () => {
            localStorage.setItem("fcmToken", token);
          },
          onError: (err: any) => {
            console.error("Failed to save token:", err);
          },
        });
      }
  
      listenForForegroundMessages();
    } catch (error) {
      console.error('FCM setup error:', error);
    }
  }, [isLoggedIn, saveFCMTokenMutation]);
  
  useEffect(() => {
    setupFCM();
  }, [setupFCM]);

  
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

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (data) => {
        localStorage.removeItem("fcmToken");
        setTimeout(() => {
          dispatch(clientLogout())
           disconnectSocket()
        }, 2000)
        toast.success(data.message)
        setIsProfileDropdownOpen(false)
      },
      onError: (err: any) => {
        toast.error(err.response.data.message)
      },
    })
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Determine navbar background style based on variant and scroll position
  const getNavbarStyle = () => {
    if (variant === "transparent") {
      return isScrolled ? "bg-white/90 backdrop-blur-md shadow-md text-gray-800" : "bg-transparent text-white"
    }
    return "bg-gray-900 text-white"
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyle()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold tracking-tight">
                <span className={variant === "transparent" && !isScrolled ? "text-white" : "text-white"}>Make</span>
                <span className="text-red-500">It</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<Home size={18} />} active={isActive("/")} variant={variant} isScrolled={isScrolled}>
              Home
            </NavLink>
            <NavLink
              to="/events"
              icon={<CalendarCheck size={18} />}
              active={isActive("/events")}
              variant={variant}
              isScrolled={isScrolled}
            >
              Events
            </NavLink>
            <NavLink
              to="/services"
              icon={<FileBarChart2 size={18} />}
              active={isActive("/services")}
              variant={variant}
              isScrolled={isScrolled}
            >
              Services
            </NavLink>
          </div>

          {/* User Auth Section - Desktop */}
          <div className="hidden md:flex items-center">
            {isLoggedIn && (
            <NotificationDropdown />
            )}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                    variant === "transparent" && !isScrolled
                      ? "hover:bg-white/20 text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {client?.profileImage ? (
                        <img
                          src={client.profileImage}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                          {client?.name?.charAt(0).toUpperCase() || <UserCircle size={20} />}
                        </div>
                      )}
                  <span className="font-medium text-sm">{client?.name || "User"}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
                    <Link
                      to="/client/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <UserCircle size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  variant === "transparent" && !isScrolled
                    ? "bg-white text-indigo-600 hover:bg-gray-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                variant === "transparent" && !isScrolled
                  ? "text-white hover:bg-white/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink
              to="/"
              active={isActive("/")}
              icon={<Home size={18} />}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/events"
              active={isActive("/events")}
              icon={<CalendarCheck size={18} />}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </MobileNavLink>
            <MobileNavLink
              to="/services"
              active={isActive("/services")}
              icon={<FileBarChart2 size={18} />}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </MobileNavLink>
          </div>

          {/* Mobile Auth Section */}
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isLoggedIn ? (
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                    {client?.name?.charAt(0) || <UserCircle size={24} />}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{client?.name || "User"}</div>
                    <div className="text-sm font-medium text-gray-400">{client?.email || ""}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/client/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3">
                <button
                  onClick={() => {
                    navigate("/login")
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

interface NavLinkProps {
  children: React.ReactNode
  to: string
  active?: boolean
  icon?: React.ReactNode
  variant?: "transparent" | "solid"
  isScrolled?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  to,
  active = false,
  icon,
  variant = "solid",
  isScrolled = false,
}) => {
  const getNavLinkStyle = () => {
    // For transparent navbar that's not scrolled
    if (variant === "transparent" && !isScrolled) {
      return active ? "bg-white/20 text-white" : "text-white hover:bg-white/10"
    }

    // For solid navbar or transparent navbar that's scrolled
    return active ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
  }

  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${getNavLinkStyle()}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  )
}

interface MobileNavLinkProps {
  children: React.ReactNode
  to: string
  active?: boolean
  icon?: React.ReactNode
  onClick?: () => void
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ children, to, active = false, icon, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
        active ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  )
}

export default Navbar
