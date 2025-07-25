"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  Check,
  Calendar,
  ArrowUpDown,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Eye,
  RefreshCw,
  CalendarDays,
  Tag,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChangeBookingStatusMutation, useGetAllBookingsMutation } from "@/hooks/VendorCustomHooks"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import BookingDetails from "./VendorBookingDetails"
import RejectReasonDialog from "./RejectResonBox"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import BookedDatesCalendar from "./BookedDates"

interface Booking {
  _id: string
  bookingId: string
  serviceName: string
  clientName: string
  clientId: string
  email: string
  phone: string
  date: string[]
  status: string
  service: {
    _id: string
    serviceTitle: string
  }
  paymentStatus: string
  vendorApproval: string
  isComplete: boolean
  createdAt: string
  updatedAt: string
  client?: { name: string }
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
    Failed: "bg-rose-50 text-rose-700 border-rose-200",
  }

  const icons = {
    Confirmed: CheckCircle,
    Approved: CheckCircle,
    Paid: CheckCircle,
    Pending: Clock,
    Cancelled: AlertCircle,
    Rejected: AlertCircle,
    Failed: AlertCircle,
  }

  const Icon = icons[status as keyof typeof icons] || Info
  const colorClass = colors[status as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200"

  return (
    <Badge className={`${colorClass} font-medium px-2 py-0.5 flex items-center text-xs`} variant="outline">
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </Badge>
  )
}

const BookingSkeleton = () => (
  <Card className="overflow-hidden border border-slate-200 shadow-sm rounded-xl">
    <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-emerald-50 border-b border-slate-100">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="pb-3 pt-4">
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </CardContent>
    <CardFooter className="border-t border-slate-100 pt-4">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
)

const BookingList = ({ isLoading = false }: { isLoading?: boolean }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [localBookings, setLocalBookings] = useState<Booking[]>([])
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectingBookingId, setRejectingBookingId] = useState("")
  const [showBookedDates, setShowBookedDates] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("pending")
  const limit = 9

  const changeBookingStatusMutation = useChangeBookingStatusMutation()
  const getAllBookingsMutation = useGetAllBookingsMutation()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

 const getAllBookings = () =>  getAllBookingsMutation.mutate(
    { page: currentPage, limit , status:activeTab},
    {
      onSuccess: (response) => {
        setLocalBookings(response.bookings.bookings)
        setTotalPages(response.bookings.total)
      },
      onError: (error) => {
        console.error(error)
      },
    },
  )

  useEffect(() => {
    getAllBookings()
  }, [currentPage,activeTab])

  const handleVendorApprovalChange = (bookingId: string, newStatus: "Approved" | "Rejected") => {
    if (newStatus === "Rejected") {
      setRejectingBookingId(bookingId)
      setShowRejectDialog(true)
      return
    }

    changeBookingStatusMutation.mutate(
      { bookingId, status: newStatus },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          setLocalBookings((prev) =>
            prev.map((booking) =>
              booking.bookingId === bookingId ? { ...booking, vendorApproval: newStatus } : booking,
            ),
          )
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update status")
        },
      },
    )
  }

  const handleRejectWithReason = (reason: string) => {
    changeBookingStatusMutation.mutate(
      { bookingId: rejectingBookingId, status: "Rejected", reason },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          setLocalBookings((prev) =>
            prev.map((booking) =>
              booking.bookingId === rejectingBookingId ? { ...booking, vendorApproval: "Rejected" } : booking,
            ),
          )
          setShowRejectDialog(false)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject booking")
          setShowRejectDialog(false)
        },
      },
    )
  }


  const handleComplete = async (bookingId: string) => {
    changeBookingStatusMutation.mutate(
      { bookingId, status: "Completed" },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          setLocalBookings((prev) =>
            prev.map((booking) =>
              booking.bookingId === bookingId ? { ...booking, isComplete: true, status: "Completed" } : booking,
            ),
          )
        },
        onError: (error) => toast.error(error.message || "Failed to complete booking"),
      },
    )
  }

  const handleChat = (clientId: string) => {
    window.location.href = `/vendor/chat/${clientId}`
  }


  const counts = {
    pending: localBookings.filter((b) => b.vendorApproval === "Pending" || b.status === "Pending").length,
    approved: localBookings.filter((b) => b.vendorApproval === "Approved" && b.status !== "Cancelled").length,
    confirmed: localBookings.filter((b) => b.vendorApproval === "Confirmed").length,
    completed: localBookings.filter((b) => b.isComplete).length,
    rejected: localBookings.filter((b) => b.vendorApproval === "Rejected" || b.status === "Cancelled").length,
  }

  if (selectedBooking) {
    return (
      <BookingDetails
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
        onCancel={()=>setSelectedBooking(null)}
        onComplete={handleComplete}
        onChat={handleChat}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-violet-600" />
              Booking Management
            </h1>
            <p className="text-slate-500 mt-1">View and manage all your service bookings</p>
          </div>
          <Button variant="outline" onClick={() => setShowBookedDates(true)} className="flex items-center gap-2">
            <CalendarDays className="mr-2 h-6 w-6 text-violet-600" />
            Booked Dates
          </Button>
          </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: "Pending", count: counts.pending, color: "amber", icon: Clock, tab: "pending" },
          { label: "Approved", count: counts.approved, color: "emerald", icon: CheckCircle, tab: "approved" },
          { label: "Confirmed", count: counts.confirmed, color: "rose", icon: CheckCircle, tab: "confirmed" },
          { label: "Completed", count: counts.completed, color: "violet", icon: Check, tab: "completed" },
          { label: "Rejected", count: counts.rejected, color: "rose", icon: X, tab: "rejected" },
        ].map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -5 }}
            className={`bg-white rounded-xl shadow-sm p-4 border-l-4 border-${item.color}-400`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{item.count}</h3>
              </div>
              <div className={`bg-${item.color}-100 p-2 rounded-lg`}>
                <item.icon className={`h-5 w-5 text-${item.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs and Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-100 p-1 mb-4">
            {[
              { value: "pending", label: "Pending", color: "amber" },
              { value: "approved", label: "Approved", color: "emerald" },
              { value: "confirmed", label: "Confirmed", color: "emerald" },
              { value: "completed", label: "Completed", color: "violet" },
              { value: "rejected", label: "Rejected", color: "rose" },
              { value: "cancelled", label: "Cancelled", color: "rose" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`data-[state=active]:bg-white data-[state=active]:text-${tab.color}-700 data-[state=active]:shadow-sm`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {localBookings?.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter."
                    : "You don't have bookings yet."}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset filters
                  </Button>
                )}
              </div>
            ) : (
              <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" initial="hidden" animate="show">
                <AnimatePresence>
                  {localBookings?.map((booking) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                        <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 via-emerald-50 to-amber-50 border-b border-slate-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                  <Calendar className="h-4 w-4 text-violet-600" />
                                </div>
                                #{booking?.bookingId?.substring(booking?.bookingId?.length - 6)}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 text-slate-600 mt-1">
                                <Tag className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-sm font-medium truncate max-w-[180px]">
                                  {booking?.serviceName}
                                </span>
                              </CardDescription>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <StatusBadge status={booking?.status} />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Booking Status: {booking?.status}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardHeader>

                        <CardContent className="pb-3 pt-4">
                          <div className="space-y-3">
                            {[
                              {
                                icon: User,
                                label: "Client",
                                value: booking?.client?.name || booking?.clientName,
                                color: "blue",
                              },
                              {
                                icon: Calendar,
                                label: "Date",
                                value: booking.date[0] ? formatDate(booking.date[0]) : "N/A",
                                color: "emerald",
                              },
                              {
                                icon: CreditCard,
                                label: "Payment",
                                value: <StatusBadge status={booking?.paymentStatus} />,
                                color: "purple",
                              },
                              {
                                icon: Check,
                                label: "Approval",
                                value: <StatusBadge status={booking?.vendorApproval} />,
                                color: "amber",
                              },
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                whileHover={{ x: 2 }}
                              >
                                <span className="text-sm font-medium flex items-center text-slate-600">
                                  <div
                                    className={`w-6 h-6 bg-${item.color}-100 rounded-full flex items-center justify-center mr-2`}
                                  >
                                    <item.icon className={`h-3.5 w-3.5 text-${item.color}-600`} />
                                  </div>
                                  {item.label}
                                </span>
                                <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">
                                  {typeof item.value === "string" ? item.value : item.value}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2 border-t border-slate-100 pt-4 bg-slate-50/50">
                          <Button
                            onClick={() => setSelectedBooking(booking)}
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>

                          {booking.vendorApproval === "Approved" && (
                            <Link to={`/vendor/chat/${booking.clientId}`}>
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                  />
                                </svg>
                                Chat with Client
                              </Button>
                            </Link>
                          )}

                          {booking.vendorApproval !== "Approved" && booking.vendorApproval !== "Rejected" && booking.status !== "Cancelled" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg"
                                >
                                  Vendor Approval <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-white shadow-lg" align="end">
                                <DropdownMenuItem
                                  onClick={() => handleVendorApprovalChange(booking.bookingId, "Approved")}
                                  className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleVendorApprovalChange(booking.bookingId, "Rejected")}
                                  className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Pagination */}
      {localBookings && localBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 flex justify-center"
        >
          <Pagination1
            currentPage={currentPage}
            totalPages={totalPages}
            onPageNext={() => setCurrentPage(currentPage + 1)}
            onPagePrev={() => setCurrentPage(currentPage - 1)}
          />
        </motion.div>
      )}

      <RejectReasonDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleRejectWithReason}
        bookingId={rejectingBookingId}
      />

          {showBookedDates && (
            <div className="fixed inset-0 z-[100] bg-opacity-50 overflow-y-auto flex justify-center items-start">
              <BookedDatesCalendar onClose={() => setShowBookedDates(false)} />
            </div>
          )}
    </div>
  )
}

export default BookingList

