// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import type { Booking } from "@/types/bookings"
// import { format } from "date-fns"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Check,
//   Calendar,
//   ArrowUpDown,
//   Clock,
//   User,
//   CreditCard,
//   CheckCircle,
//   AlertCircle,
//   Info,
//   Search,
//   X,
//   Eye,
//   RefreshCw,
//   CalendarDays,
//   Tag,
// } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import RejectReasonDialog from "./RejectResonBox"
// import toast from "react-hot-toast"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useChangeBookingStatusMutation, useGetAllBookingsMutation } from "@/hooks/VendorCustomHooks"
// import VendorBookingDetails from "./VendorBookingDetails"
// import { Pagination1 } from "@/components/common/paginations/Pagination"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Link } from "react-router-dom"

// interface BookingListProps {
//   bookings?: Booking[]
//   isLoading?: boolean
// }

// const StatusBadge = ({ status }: { status: string }) => {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Confirmed":
//       case "Approved":
//       case "Paid":
//         return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
//       case "Pending":
//         return "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
//       case "Cancelled":
//       case "Rejected":
//       case "Failed":
//         return "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
//       default:
//         return "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Confirmed":
//       case "Approved":
//       case "Paid":
//         return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
//       case "Pending":
//         return <Clock className="w-3.5 h-3.5 mr-1.5" />
//       case "Cancelled":
//       case "Rejected":
//       case "Failed":
//         return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
//       default:
//         return <Info className="w-3.5 h-3.5 mr-1.5" />
//     }
//   }

//   return (
//     <Badge className={`${getStatusColor(status)} font-medium px-2 py-0.5 flex items-center text-xs`} variant="outline">
//       {getStatusIcon(status)}
//       {status}
//     </Badge>
//   )
// }

// const BookingSkeleton = () => {
//   return (
//     <Card className="overflow-hidden border border-slate-200 shadow-sm">
//       <CardHeader className="pb-3 bg-slate-50 border-b border-slate-100">
//         <Skeleton className="h-6 w-3/4" />
//         <Skeleton className="h-4 w-1/2 mt-2" />
//       </CardHeader>
//       <CardContent className="pb-3 pt-4">
//         <div className="grid gap-3">
//           {[1, 2, 3, 4, 5].map((item) => (
//             <div key={item} className="flex items-center justify-between">
//               <Skeleton className="h-4 w-1/4" />
//               <Skeleton className="h-4 w-1/3" />
//             </div>
//           ))}
//         </div>
//       </CardContent>
//       <CardFooter className="border-t border-slate-100 pt-4 flex flex-col gap-2">
//         <div className="flex gap-2 w-full">
//           <Skeleton className="h-10 flex-1" />
//           <Skeleton className="h-10 flex-1" />
//         </div>
//         <Skeleton className="h-10 w-full" />
//       </CardFooter>
//     </Card>
//   )
// }

// const BookingList = ({ isLoading = false }: BookingListProps) => {
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
//   const [localBookings, setLocalBookings] = useState<Booking[]>([])
//   const [showRejectDialog, setShowRejectDialog] = useState(false)
//   const [rejectingBookingId, setRejectingBookingId] = useState<string>("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const limit = 10
//   const [activeTab, setActiveTab] = useState("all")

//   const changeBookingStatusMutation = useChangeBookingStatusMutation()
//   const getAllBookingsMutation = useGetAllBookingsMutation()

//   const handleViewDetails = (booking: Booking) => {
//     setSelectedBooking(booking)
//   }

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "MMM dd, yyyy")
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error)
//       return dateString
//     }
//   }

  

//   useEffect(() => {
//     getAllBookingsMutation.mutate(
//       {
//       skip: currentPage,
//       limit,
//     },
//       {
//       onSuccess: (response) => {
//         console.log("bookings", response)
//         setTotalPages(response.bookings.total)
//         setLocalBookings(response.bookings.bookings)
//       },
//       onError: (error) => {
//         console.log(error)
//       },
//     })
//   }, [currentPage])

//   console.log("local bookind", localBookings)

//   const handleVendorApprovalChange = (bookingId: string, newStatus: "Approved" | "Pending" | "Rejected") => {
//     if (newStatus === "Rejected") {
//       setRejectingBookingId(bookingId)
//       setShowRejectDialog(true)
//       return
//     }


//     changeBookingStatusMutation.mutate(
//       {
//         bookingId,
//         status: newStatus,
//       },
//       {
//         onSuccess: (response) => {
//           console.log(response)
//           toast.success(response.message)

//           setLocalBookings((prevBookings) =>
//             prevBookings.map((booking) =>
//               booking.bookingId === bookingId ? { ...booking, vendorApproval: newStatus } : booking,
//             ),
//           )
//         },
//         onError: (error: any) => {
//           console.error('status error',error)
//           toast.error(error.response.data.message || "Failed to update status")
//         },
//       },
//     )
//   }

//   const handleRejectWithReason = (reason: string) => {
//     console.log("Reject reason:", reason)
//     setLocalBookings((prevBookings) =>
//       prevBookings.map((booking) =>
//         booking.bookingId === rejectingBookingId ? { ...booking, vendorApproval: "Rejected" } : booking,
//       ),
//     )
//     changeBookingStatusMutation.mutate(
//       {
//         bookingId: rejectingBookingId,
//         status: "Rejected",
//         reason,
//       },
//       {
//         onSuccess: (response) => {
//           toast.success(response.message)
//           console.log(response)
//           setShowRejectDialog(false)
//         },
//         onError: (error: any) => {
//           console.log(error)
//           toast.error(error.message || "Failed to reject booking.")
//           setShowRejectDialog(false)
//         },
//       },
//     )
//   }

//   const toggleComplete = (bookingId: string) => {
//     changeBookingStatusMutation.mutate(
//       {
//         bookingId,
//         status: "Completed",
//       },
//       {
//         onSuccess: (response) => {
//           toast.success(response.message)
//           console.log(response)
//           setLocalBookings((prevBookings) =>
//             prevBookings.map((booking) =>
//               booking.bookingId === bookingId ? { ...booking, isComplete: !booking.isComplete } : booking,
//             ),
//           )
//         },
//         onError: (error: any) => {
//           console.log(error)
//           toast.error(error.response.data.message || "Failed to complete booking.")
//         },
//       },
//     )
//   }

//   // Filter bookings based on tab selection
//   const getFilteredBookingsByTab = () => {
//     let tabFiltered = localBookings

//     if (activeTab === "pending") {
//       tabFiltered = localBookings.filter(
//         (booking) => booking.vendorApproval === "Pending" || booking.status === "Pending",
//       )
//     } else if (activeTab === "approved") {
//       tabFiltered = localBookings.filter(
//         (booking) => booking.vendorApproval === "Approved" && booking.status !== "Cancelled",
//       )
//     } else if (activeTab === "completed") {
//       tabFiltered = localBookings.filter((booking) => booking.isComplete)
//     } else if (activeTab === "rejected") {
//       tabFiltered = localBookings.filter(
//         (booking) => booking.vendorApproval === "Rejected" || booking.status === "Cancelled",
//       )
//     }

//     return tabFiltered
//   }

//   const tabFilteredBookings = getFilteredBookingsByTab()

//   const filteredBookings = tabFilteredBookings
//     ?.filter((booking) => {
//       if (statusFilter === "all") return true
//       return booking.status.toLowerCase() === statusFilter.toLowerCase()
//     })
//     ?.filter((booking) => {
//       if (!searchTerm) return true
//       const searchLower = searchTerm.toLowerCase()
//       return (
//         booking.bookingId.toLowerCase().includes(searchLower) ||
//         booking.serviceName?.toLowerCase().includes(searchLower) ||
//         booking.clientName?.toLowerCase().includes(searchLower)
//       )
//     })

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   }

//   // Count bookings by status for the summary cards
//   const pendingCount = localBookings.filter(
//     (booking) => booking.vendorApproval === "Pending" || booking.status === "Pending",
//   ).length

//   const approvedCount = localBookings.filter(
//     (booking) => booking.vendorApproval === "Approved" && booking.status !== "Cancelled",
//   ).length

//   const completedCount = localBookings.filter((booking) => booking.isComplete).length

//   const rejectedCount = localBookings.filter(
//     (booking) => booking.vendorApproval === "Rejected" || booking.status === "Cancelled",
//   ).length

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//           <h2 className="text-2xl font-bold text-slate-800">Bookings</h2>
//           <div className="flex gap-2 w-full sm:w-auto">
//             <Skeleton className="h-10 w-full sm:w-[200px]" />
//             <Skeleton className="h-10 w-full sm:w-[150px]" />
//           </div>
//         </div>
//         <motion.div
//           className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           {[1, 2, 3, 4, 5, 6].map((item) => (
//             <motion.div
//               key={item}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: item * 0.05 }}
//             >
//               <BookingSkeleton />
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-xl shadow-sm p-6 mb-6"
//       >
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800 flex items-center">
//               <CalendarDays className="mr-2 h-6 w-6 text-violet-600" />
//               Booking Management
//             </h1>
//             <p className="text-slate-500 mt-1">View and manage all your service bookings</p>
//           </div>
//           <div className="flex gap-2 w-full sm:w-auto">
//             <div className="relative flex-1 sm:flex-none">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <Input
//                 placeholder="Search bookings..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 w-full sm:w-[200px] border-slate-200 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 >
//                   <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
//                 </button>
//               )}
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full sm:w-[150px] border-slate-200 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="confirmed">Confirmed</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </motion.div>

//       {/* Status Summary Cards */}
//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//       >
//         <motion.div
//           whileHover={{ y: -5, transition: { duration: 0.2 } }}
//           className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-400"
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Pending</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingCount}</h3>
//             </div>
//             <div className="bg-amber-100 p-2 rounded-lg">
//               <Clock className="h-5 w-5 text-amber-600" />
//             </div>
//           </div>
//           <div className="mt-2">
//             <Button
//               variant="ghost"
//               className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto text-xs font-medium"
//               onClick={() => setActiveTab("pending")}
//             >
//               View all pending
//             </Button>
//           </div>
//         </motion.div>

//         <motion.div
//           whileHover={{ y: -5, transition: { duration: 0.2 } }}
//           className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-emerald-400"
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Approved</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{approvedCount}</h3>
//             </div>
//             <div className="bg-emerald-100 p-2 rounded-lg">
//               <CheckCircle className="h-5 w-5 text-emerald-600" />
//             </div>
//           </div>
//           <div className="mt-2">
//             <Button
//               variant="ghost"
//               className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto text-xs font-medium"
//               onClick={() => setActiveTab("approved")}
//             >
//               View all approved
//             </Button>
//           </div>
//         </motion.div>

//         <motion.div
//           whileHover={{ y: -5, transition: { duration: 0.2 } }}
//           className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-violet-400"
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Completed</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{completedCount}</h3>
//             </div>
//             <div className="bg-violet-100 p-2 rounded-lg">
//               <Check className="h-5 w-5 text-violet-600" />
//             </div>
//           </div>
//           <div className="mt-2">
//             <Button
//               variant="ghost"
//               className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 p-0 h-auto text-xs font-medium"
//               onClick={() => setActiveTab("completed")}
//             >
//               View all completed
//             </Button>
//           </div>
//         </motion.div>

//         <motion.div
//           whileHover={{ y: -5, transition: { duration: 0.2 } }}
//           className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-rose-400"
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Rejected</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{rejectedCount}</h3>
//             </div>
//             <div className="bg-rose-100 p-2 rounded-lg">
//               <X className="h-5 w-5 text-rose-600" />
//             </div>
//           </div>
//           <div className="mt-2">
//             <Button
//               variant="ghost"
//               className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0 h-auto text-xs font-medium"
//               onClick={() => setActiveTab("rejected")}
//             >
//               View all rejected
//             </Button>
//           </div>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="bg-white rounded-xl shadow-sm p-6 mb-6"
//       >
//         <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
//           <TabsList className="bg-slate-100 p-1 mb-4">
//             <TabsTrigger
//               value="all"
//               className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm"
//             >
//               All Bookings
//             </TabsTrigger>
//             <TabsTrigger
//               value="pending"
//               className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
//             >
//               Pending
//             </TabsTrigger>
//             <TabsTrigger
//               value="approved"
//               className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
//             >
//               Approved
//             </TabsTrigger>
//             <TabsTrigger
//               value="completed"
//               className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm"
//             >
//               Completed
//             </TabsTrigger>
//             <TabsTrigger
//               value="rejected"
//               className="data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm"
//             >
//               Rejected
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value={activeTab} className="mt-0">
//             {filteredBookings?.length === 0 ? (
//               <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
//                   <Calendar className="h-8 w-8 text-slate-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
//                 <p className="text-slate-500 max-w-md mx-auto">
//                   {searchTerm || statusFilter !== "all"
//                     ? "Try adjusting your search or filter to find what you're looking for."
//                     : "You don't have any bookings yet. Bookings will appear here once created."}
//                 </p>
//                 {(searchTerm || statusFilter !== "all") && (
//                   <Button
//                     variant="outline"
//                     className="mt-4"
//                     onClick={() => {
//                       setSearchTerm("")
//                       setStatusFilter("all")
//                     }}
//                   >
//                     <RefreshCw className="mr-2 h-4 w-4" />
//                     Reset filters
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <motion.div
//                 className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//                 variants={container}
//                 initial="hidden"
//                 animate="show"
//               >
//                 <AnimatePresence>
//                   {filteredBookings?.map((booking) => (
//                     <motion.div
//                       key={booking._id}
//                       variants={item}
//                       initial="hidden"
//                       animate="show"
//                       exit={{ opacity: 0, y: -20 }}
//                       whileHover={{ scale: 1.01 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow transition-all duration-300">
//                         <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-slate-50 border-b border-slate-100">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
//                                 <Calendar className="h-4 w-4 text-violet-600" />#
//                                 {booking?.bookingId?.substring(booking?.bookingId?.length - 6)}
//                               </CardTitle>
//                               <CardDescription className="flex items-center gap-2 text-slate-600 mt-1">
//                                 <Tag className="h-3.5 w-3.5 text-slate-400" />
//                                 <span className="text-sm font-medium truncate max-w-[180px]">
//                                   {booking?.serviceName}
//                                 </span>
//                               </CardDescription>
//                             </div>
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <div>
//                                     <StatusBadge status={booking?.status} />
//                                   </div>
//                                 </TooltipTrigger>
//                                 <TooltipContent>
//                                   <p>Booking Status: {booking?.status}</p>
//                                 </TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                           </div>
//                         </CardHeader>
//                         <CardContent className="pb-3 pt-4">
//                           <div className="grid gap-3">
//                             <motion.div
//                               className="flex items-center justify-between"
//                               whileHover={{ x: 3 }}
//                               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                             >
//                               <span className="text-sm font-medium flex items-center text-slate-600">
//                                 <User className="h-3.5 w-3.5 mr-2 text-slate-400" />
//                                 Client:
//                               </span>
//                               <span className="text-sm font-medium">{booking?.client?.name}</span>
//                             </motion.div>
//                             <motion.div
//                               className="flex items-center justify-between"
//                               whileHover={{ x: 3 }}
//                               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                             >
//                               <span className="text-sm font-medium flex items-center text-slate-600">
//                                 <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
//                                 Date:
//                               </span>
//                               <span className="text-sm font-medium">
//                                 {booking.date[0] ? formatDate(booking.date[0]) : "N/A"}
//                               </span>
//                             </motion.div>
                        
//                             <motion.div
//                               className="flex items-center justify-between"
//                               whileHover={{ x: 3 }}
//                               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                             >
//                               <span className="text-sm font-medium flex items-center text-slate-600">
//                                 <CreditCard className="h-3.5 w-3.5 mr-2 text-slate-400" />
//                                 Payment:
//                               </span>
//                               <StatusBadge status={booking?.paymentStatus} />
//                             </motion.div>
//                             <motion.div
//                               className="flex items-center justify-between"
//                               whileHover={{ x: 3 }}
//                               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                             >
//                               <span className="text-sm font-medium flex items-center text-slate-600">
//                                 <Check className="h-3.5 w-3.5 mr-2 text-slate-400" />
//                                 Approval:
//                               </span>
//                               <StatusBadge status={booking?.vendorApproval} />
//                             </motion.div>
//                             <motion.div
//                               className="flex items-center justify-between"
//                               whileHover={{ x: 3 }}
//                               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                             >
//                               <span className="text-sm font-medium flex items-center text-slate-600">
//                                 <CheckCircle className="h-3.5 w-3.5 mr-2 text-slate-400" />
//                                 Completed:
//                               </span>
//                               <Badge
//                                 className={`${
//                                   booking.isComplete
//                                     ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                                     : "bg-slate-50 text-slate-700 border-slate-200"
//                                 } font-medium px-2 py-0.5 flex items-center text-xs`}
//                                 variant="outline"
//                               >
//                                 {booking?.isComplete ? (
//                                   <CheckCircle className="w-3 h-3 mr-1" />
//                                 ) : (
//                                   <Clock className="w-3 h-3 mr-1" />
//                                 )}
//                                 {booking?.isComplete ? "Yes" : "No"}
//                               </Badge>
//                             </motion.div>
//                           </div>
//                         </CardContent>
                        
//                         <CardFooter className="flex flex-col gap-2 border-t border-slate-100 pt-4">
//                           <div className="flex w-full flex-col gap-2">
//                             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
//                               <Button
//                                 className="w-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100"
//                                 onClick={() => handleViewDetails(booking)}
//                                 variant="outline"
//                               >
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 View Details
//                               </Button>
//                             </motion.div>
//                             {!booking.isComplete &&
//                               booking.status !== "Rejected" && booking.status !== "Cancelled" &&
//                               booking.vendorApproval === "Approved" && (
//                                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
//                                   <Button
//                                     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
//                                     onClick={() => toggleComplete(booking?.bookingId)}
//                                     variant="default"
//                                   >
//                                     <Check className="mr-2 h-4 w-4" />
//                                     Mark Complete
//                                   </Button>
//                                 </motion.div>
//                               )}
                
//                               {booking.vendorApproval === "Approved" && (
//                                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
//                                   <Link to={`/vendor/chat/${booking.clientId}`}>
//                                     <Button
//                                       className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                                       variant="default"
//                                     >
//                                       <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
//                                       </svg>
//                                       Chat with Client
//                                     </Button>
//                                   </Link>
//                                 </motion.div>
//                               )}
//                             {booking.vendorApproval !== "Approved" && booking.vendorApproval !== "Rejected" && (
//                               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button
//                                       variant="outline"
//                                       className="w-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
//                                     >
//                                       Vendor Approval <ArrowUpDown className="ml-2 h-4 w-4" />
//                                     </Button>
//                                   </DropdownMenuTrigger>
//                                   <DropdownMenuContent className="bg-white shadow-lg" align="end">
//                                     <DropdownMenuItem
//                                       onClick={() => handleVendorApprovalChange(booking.bookingId, "Approved")}
//                                       className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
//                                     >
//                                       <CheckCircle className="mr-2 h-4 w-4" />
//                                       <span>Approve Booking</span>
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() => handleVendorApprovalChange(booking.bookingId, "Rejected")}
//                                       className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
//                                     >
//                                       <X className="mr-2 h-4 w-4" />
//                                       <span>Reject Booking</span>
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </motion.div>
//                             )}
//                           </div>
//                         </CardFooter>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </motion.div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </motion.div>

//       {filteredBookings.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white rounded-xl shadow-sm p-4 flex justify-center"
//         >
//           <Pagination1
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageNext={() => setCurrentPage(currentPage + 1)}
//             onPagePrev={() => setCurrentPage(currentPage - 1)}
//           />
//         </motion.div>
//       )}

//       {selectedBooking && (
//         <VendorBookingDetails
//           booking={selectedBooking}
//           onClose={() => setSelectedBooking(null)}
//           isOpen={!!selectedBooking}
//         />
//       )}

//       <RejectReasonDialog
//         isOpen={showRejectDialog}
//         onClose={() => setShowRejectDialog(false)}
//         onConfirm={handleRejectWithReason}
//         bookingId={rejectingBookingId}
//       />
//     </div>
//   )
// }

// export default BookingList



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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const limit = 10

  const changeBookingStatusMutation = useChangeBookingStatusMutation()
  const getAllBookingsMutation = useGetAllBookingsMutation()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  useEffect(() => {
    getAllBookingsMutation.mutate(
      { skip: currentPage, limit },
      {
        onSuccess: (response) => {
          setTotalPages(response.bookings.total)
          setLocalBookings(response.bookings.bookings)
        },
        onError: (error) => {
          console.error(error)
          toast.error("Failed to load bookings")
        },
      },
    )
  }, [currentPage])

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
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update status")
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
        onError: (error: any) => {
          toast.error(error.message || "Failed to reject booking")
          setShowRejectDialog(false)
        },
      },
    )
  }

  const handleCancel = async (bookingId: string, reason: string) => {
    changeBookingStatusMutation.mutate(
      { bookingId, status: "Cancelled", reason },
      {
        onSuccess: () => {
          toast.success("Booking cancelled successfully")
          setLocalBookings((prev) =>
            prev.map((booking) => (booking.bookingId === bookingId ? { ...booking, status: "Cancelled" } : booking)),
          )
        },
        onError: () => toast.error("Failed to cancel booking"),
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
        onError: (error: any) => toast.error(error.response?.data?.message || "Failed to complete booking"),
      },
    )
  }

  const handleChat = (clientId: string) => {
    window.location.href = `/vendor/chat/${clientId}`
  }

  // Filter bookings by tab
  const getFilteredBookingsByTab = () => {
    if (activeTab === "pending")
      return localBookings.filter((b) => b.vendorApproval === "Pending" || b.status === "Pending")
    if (activeTab === "approved")
      return localBookings.filter((b) => b.vendorApproval === "Approved" && b.status !== "Cancelled")
    if (activeTab === "completed") return localBookings.filter((b) => b.isComplete)
    if (activeTab === "rejected")
      return localBookings.filter((b) => b.vendorApproval === "Rejected" || b.status === "Cancelled")
    return localBookings
  }

  const filteredBookings = getFilteredBookingsByTab()
    ?.filter((booking) => statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase())
    ?.filter((booking) => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        booking.bookingId.toLowerCase().includes(search) ||
        booking.serviceName?.toLowerCase().includes(search) ||
        booking.clientName?.toLowerCase().includes(search)
      )
    })

  // Counts for summary cards
  const counts = {
    pending: localBookings.filter((b) => b.vendorApproval === "Pending" || b.status === "Pending").length,
    approved: localBookings.filter((b) => b.vendorApproval === "Approved" && b.status !== "Cancelled").length,
    completed: localBookings.filter((b) => b.isComplete).length,
    rejected: localBookings.filter((b) => b.vendorApproval === "Rejected" || b.status === "Cancelled").length,
  }

  if (selectedBooking) {
    return (
      <BookingDetails
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
        onCancel={handleCancel}
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
          </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: "Pending", count: counts.pending, color: "amber", icon: Clock, tab: "pending" },
          { label: "Approved", count: counts.approved, color: "emerald", icon: CheckCircle, tab: "approved" },
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
            <Button
              variant="ghost"
              className={`text-${item.color}-600 hover:text-${item.color}-700 hover:bg-${item.color}-50 p-0 h-auto text-xs font-medium mt-2`}
              onClick={() => setActiveTab(item.tab)}
            >
              View all {item.label.toLowerCase()}
            </Button>
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
              { value: "all", label: "All Bookings", color: "violet" },
              { value: "pending", label: "Pending", color: "amber" },
              { value: "approved", label: "Approved", color: "emerald" },
              { value: "completed", label: "Completed", color: "violet" },
              { value: "rejected", label: "Rejected", color: "rose" },
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
            {filteredBookings?.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter."
                    : "You don't have any bookings yet."}
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
                  {filteredBookings?.map((booking) => (
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

                          {booking.vendorApproval !== "Approved" && booking.vendorApproval !== "Rejected" && (
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
      {filteredBookings && filteredBookings.length > 0 && (
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
    </div>
  )
}

export default BookingList

