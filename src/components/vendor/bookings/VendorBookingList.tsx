import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Booking } from "@/types/bookings"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
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
  Search,
  X,
  Eye,
  RefreshCw,
  CalendarDays,
  Tag,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RejectReasonDialog from "./RejectResonBox"
import toast from "react-hot-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChangeBookingStatusMutation, useGetAllBookingsMutation } from "@/hooks/VendorCustomHooks"
import VendorBookingDetails from "./VendorBookingDetails"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"

interface BookingListProps {
  bookings?: Booking[]
  isLoading?: boolean
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Approved":
      case "Paid":
        return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
      case "Pending":
        return "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
      case "Cancelled":
      case "Rejected":
      case "Failed":
        return "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Approved":
      case "Paid":
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
      case "Pending":
        return <Clock className="w-3.5 h-3.5 mr-1.5" />
      case "Cancelled":
      case "Rejected":
      case "Failed":
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
      default:
        return <Info className="w-3.5 h-3.5 mr-1.5" />
    }
  }

  return (
    <Badge className={`${getStatusColor(status)} font-medium px-2 py-0.5 flex items-center text-xs`} variant="outline">
      {getStatusIcon(status)}
      {status}
    </Badge>
  )
}

const BookingSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <CardHeader className="pb-3 bg-slate-50 border-b border-slate-100">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="pb-3 pt-4">
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 pt-4 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

const BookingList = ({ isLoading = false }: BookingListProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [localBookings, setLocalBookings] = useState<Booking[]>([])
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectingBookingId, setRejectingBookingId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10
  const [activeTab, setActiveTab] = useState("all")

  const changeBookingStatusMutation = useChangeBookingStatusMutation()
  const getAllBookingsMutation = useGetAllBookingsMutation()

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch (error) {
      console.error("Error formatting time:", dateString, error)
      return ""
    }
  }

  useEffect(() => {
    getAllBookingsMutation.mutate(
      {
      skip: currentPage,
      limit,
    },
      {
      onSuccess: (response) => {
        console.log("bookings", response)
        setTotalPages(response.bookings.total)
        setLocalBookings(response.bookings.bookings)
      },
      onError: (error) => {
        console.log(error)
      },
    })
  }, [currentPage])

  console.log("local bookind", localBookings)

  const handleVendorApprovalChange = (bookingId: string, newStatus: "Approved" | "Pending" | "Rejected") => {
    if (newStatus === "Rejected") {
      setRejectingBookingId(bookingId)
      setShowRejectDialog(true)
      return
    }

    setLocalBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId ? { ...booking, vendorApproval: newStatus } : booking,
      ),
    )

    changeBookingStatusMutation.mutate(
      {
        bookingId,
        status: newStatus,
      },
      {
        onSuccess: (response) => {
          console.log(response)
          toast.success(response.message)
        },
        onError: (error: any) => {
          console.error(error)
          toast.error(error.message || "Failed to update status")
        },
      },
    )
  }

  const handleRejectWithReason = (reason: string) => {
    console.log("Reject reason:", reason)
    setLocalBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === rejectingBookingId ? { ...booking, vendorApproval: "Rejected" } : booking,
      ),
    )
    changeBookingStatusMutation.mutate(
      {
        bookingId: rejectingBookingId,
        status: "Rejected",
        reason,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          console.log(response)
          setShowRejectDialog(false)
        },
        onError: (error: any) => {
          console.log(error)
          toast.error(error.message || "Failed to reject booking.")
          setShowRejectDialog(false)
        },
      },
    )
  }

  const toggleComplete = (bookingId: string) => {
    setLocalBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId ? { ...booking, isComplete: !booking.isComplete } : booking,
      ),
    )
    changeBookingStatusMutation.mutate(
      {
        bookingId,
        status: "Completed",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          console.log(response)
        },
        onError: (error: any) => {
          console.log(error)
          toast.error(error.message || "Failed to complete booking.")
        },
      },
    )
  }

  // Filter bookings based on tab selection
  const getFilteredBookingsByTab = () => {
    let tabFiltered = localBookings

    if (activeTab === "pending") {
      tabFiltered = localBookings.filter(
        (booking) => booking.vendorApproval === "Pending" || booking.status === "Pending",
      )
    } else if (activeTab === "approved") {
      tabFiltered = localBookings.filter(
        (booking) => booking.vendorApproval === "Approved" && booking.status !== "Cancelled",
      )
    } else if (activeTab === "completed") {
      tabFiltered = localBookings.filter((booking) => booking.isComplete)
    } else if (activeTab === "rejected") {
      tabFiltered = localBookings.filter(
        (booking) => booking.vendorApproval === "Rejected" || booking.status === "Cancelled",
      )
    }

    return tabFiltered
  }

  const tabFilteredBookings = getFilteredBookingsByTab()

  const filteredBookings = tabFilteredBookings
    ?.filter((booking) => {
      if (statusFilter === "all") return true
      return booking.status.toLowerCase() === statusFilter.toLowerCase()
    })
    ?.filter((booking) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        booking.bookingId.toLowerCase().includes(searchLower) ||
        booking.serviceName?.toLowerCase().includes(searchLower) ||
        booking.clientName?.toLowerCase().includes(searchLower)
      )
    })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Count bookings by status for the summary cards
  const pendingCount = localBookings.filter(
    (booking) => booking.vendorApproval === "Pending" || booking.status === "Pending",
  ).length

  const approvedCount = localBookings.filter(
    (booking) => booking.vendorApproval === "Approved" && booking.status !== "Cancelled",
  ).length

  const completedCount = localBookings.filter((booking) => booking.isComplete).length

  const rejectedCount = localBookings.filter(
    (booking) => booking.vendorApproval === "Rejected" || booking.status === "Cancelled",
  ).length

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Bookings</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[200px]" />
            <Skeleton className="h-10 w-full sm:w-[150px]" />
          </div>
        </div>
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: item * 0.05 }}
            >
              <BookingSkeleton />
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[200px] border-slate-200 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] border-slate-200 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Status Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-400"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingCount}</h3>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-2">
            <Button
              variant="ghost"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto text-xs font-medium"
              onClick={() => setActiveTab("pending")}
            >
              View all pending
            </Button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-emerald-400"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Approved</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{approvedCount}</h3>
            </div>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-2">
            <Button
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto text-xs font-medium"
              onClick={() => setActiveTab("approved")}
            >
              View all approved
            </Button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-violet-400"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{completedCount}</h3>
            </div>
            <div className="bg-violet-100 p-2 rounded-lg">
              <Check className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <div className="mt-2">
            <Button
              variant="ghost"
              className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 p-0 h-auto text-xs font-medium"
              onClick={() => setActiveTab("completed")}
            >
              View all completed
            </Button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-rose-400"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Rejected</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{rejectedCount}</h3>
            </div>
            <div className="bg-rose-100 p-2 rounded-lg">
              <X className="h-5 w-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-2">
            <Button
              variant="ghost"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0 h-auto text-xs font-medium"
              onClick={() => setActiveTab("rejected")}
            >
              View all rejected
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="bg-slate-100 p-1 mb-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm"
            >
              All Bookings
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Approved
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm"
            >
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredBookings?.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "You don't have any bookings yet. Bookings will appear here once created."}
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
              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {filteredBookings?.map((booking) => (
                    <motion.div
                      key={booking._id}
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow transition-all duration-300">
                        <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-slate-50 border-b border-slate-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Calendar className="h-4 w-4 text-violet-600" />#
                                {booking?.bookingId?.substring(booking?.bookingId?.length - 6)}
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
                          <div className="grid gap-3">
                            <motion.div
                              className="flex items-center justify-between"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className="text-sm font-medium flex items-center text-slate-600">
                                <User className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                Client:
                              </span>
                              <span className="text-sm font-medium">{booking?.client?.name}</span>
                            </motion.div>
                            <motion.div
                              className="flex items-center justify-between"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className="text-sm font-medium flex items-center text-slate-600">
                                <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                Date:
                              </span>
                              <span className="text-sm font-medium">
                                {booking.date[0] ? formatDate(booking.date[0]) : "N/A"}
                              </span>
                            </motion.div>
                        
                            <motion.div
                              className="flex items-center justify-between"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className="text-sm font-medium flex items-center text-slate-600">
                                <CreditCard className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                Payment:
                              </span>
                              <StatusBadge status={booking?.paymentStatus} />
                            </motion.div>
                            <motion.div
                              className="flex items-center justify-between"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className="text-sm font-medium flex items-center text-slate-600">
                                <Check className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                Approval:
                              </span>
                              <StatusBadge status={booking?.vendorApproval} />
                            </motion.div>
                            <motion.div
                              className="flex items-center justify-between"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className="text-sm font-medium flex items-center text-slate-600">
                                <CheckCircle className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                Completed:
                              </span>
                              <Badge
                                className={`${
                                  booking.isComplete
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                } font-medium px-2 py-0.5 flex items-center text-xs`}
                                variant="outline"
                              >
                                {booking?.isComplete ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : (
                                  <Clock className="w-3 h-3 mr-1" />
                                )}
                                {booking?.isComplete ? "Yes" : "No"}
                              </Badge>
                            </motion.div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                          <div className="flex w-full flex-col gap-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                className="w-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100"
                                onClick={() => handleViewDetails(booking)}
                                variant="outline"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </motion.div>
                            {!booking.isComplete &&
                              booking.status !== "Rejected" && booking.status !== "Cancelled" &&
                              booking.vendorApproval === "Approved" && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                  <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => toggleComplete(booking?.bookingId)}
                                    variant="default"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark Complete
                                  </Button>
                                </motion.div>
                              )}
                
                              {booking.vendorApproval === "Approved" && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                  <Link to={`/vendor/chat/${booking.clientId}`}>
                                    <Button
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                      variant="default"
                                    >
                                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                      </svg>
                                      Chat with Client
                                    </Button>
                                  </Link>
                                </motion.div>
                              )}
                            {booking.vendorApproval !== "Approved" && booking.vendorApproval !== "Rejected" && (
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
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
                                      <span>Approve Booking</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleVendorApprovalChange(booking.bookingId, "Rejected")}
                                      className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      <span>Reject Booking</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </motion.div>
                            )}
                          </div>
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

      {filteredBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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

      {selectedBooking && (
        <VendorBookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          isOpen={!!selectedBooking}
        />
      )}

      <RejectReasonDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleRejectWithReason}
        bookingId={rejectingBookingId}
      />
    </div>
  )
}

export default BookingList
