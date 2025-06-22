// "use client"

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import type { Booking } from "@/types/bookings"
// import { format } from "date-fns"
// import { Badge } from "@/components/ui/badge"
// import { motion } from "framer-motion"
// import {
//   Calendar,
//   Clock,
//   User,
//   Mail,
//   Phone,
//   CreditCard,
//   CheckCircle,
//   AlertCircle,
//   Info,
//   FileText,
//   MapPin,
//   Building,
//   Download,
//   Printer,
//   ArrowLeft,
// } from "lucide-react"

// interface BookingDetailsProps {
//   booking: Booking
//   isOpen: boolean
//   onClose: () => void
//   onReject?: () => void
// }

// const StatusBadge = ({ status }: { status: string }) => {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Confirmed":
//       case "Approved":
//       case "Paid":
//         return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
//       case "Cancelled":
//       case "Rejected":
//       case "Failed":
//         return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
//       default:
//         return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
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
//     <Badge className={`${getStatusColor(status)} font-medium px-2.5 py-1 flex items-center text-xs`} variant="outline">
//       {getStatusIcon(status)}
//       {status}
//     </Badge>
//   )
// }

// const BookingDetails = ({ booking, isOpen, onClose }: BookingDetailsProps) => {
//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a")
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error)
//       return dateString
//     }
//   }

//   const fadeIn = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0 },
//   }

//   // Safely handle dialog closing
//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       onClose()
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white rounded-xl">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
//           <DialogHeader className="pb-2">
//             <Button 
//               variant="ghost" 
//               onClick={onClose} 
//               className="absolute left-2 top-2 text-white hover:bg-blue-600 hover:text-white p-2 h-8 w-8"
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//             <DialogTitle className="text-xl font-bold flex items-center">
//               <FileText className="mr-2 h-5 w-5" />
//               Booking Details
//             </DialogTitle>
//             <DialogDescription className="text-blue-100 opacity-90">Booking ID: {booking.bookingId}</DialogDescription>
//           </DialogHeader>
//           <div className="mt-2 flex flex-wrap gap-2">
//             <StatusBadge status={booking.status} />
//             <StatusBadge status={booking.paymentStatus} />
//             <StatusBadge status={booking.vendorApproval} />
//           </div>
//         </div>

//         <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={fadeIn}
//             transition={{ duration: 0.3, delay: 0.1 }}
//             className="space-y-6"
//           >
//             <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
//               <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
//                 <Calendar className="mr-2 h-4 w-4" />
//                 Service Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Service</p>
//                   <p className="text-sm font-medium">{booking.serviceName}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Created</p>
//                   <p className="text-sm font-medium">{formatDate(booking.createdAt)}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                 <Info className="mr-2 h-4 w-4" />
//                 Status Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Booking Status</p>
//                   <StatusBadge status={booking.status} />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Payment Status</p>
//                   <StatusBadge status={booking.paymentStatus} />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Vendor Approval</p>
//                   <StatusBadge status={booking.vendorApproval} />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Completed</p>
//                   <Badge
//                     variant="outline"
//                     className={`${
//                       booking.isComplete
//                         ? "bg-green-100 text-green-800 border-green-200"
//                         : "bg-gray-100 text-gray-800 border-gray-200"
//                     } px-2.5 py-1 flex items-center text-xs`}
//                   >
//                     {booking.isComplete ? (
//                       <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
//                     ) : (
//                       <Clock className="w-3.5 h-3.5 mr-1.5" />
//                     )}
//                     {booking.isComplete ? "Yes" : "No"}
//                   </Badge>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-green-50 rounded-lg p-4 border border-green-100">
//               <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
//                 <User className="mr-2 h-4 w-4" />
//                 Client Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Name</p>
//                   <p className="text-sm font-medium flex items-center">
//                     <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.clientName}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Email</p>
//                   <p className="text-sm font-medium flex items-center">
//                     <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.email}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Phone</p>
//                   <p className="text-sm font-medium flex items-center">
//                     <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.phone}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Client ID</p>
//                   <p className="text-sm font-medium truncate flex items-center" title={booking.clientId}>
//                     <Info className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.clientId.substring(0, 12)}...
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
//               <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
//                 <Calendar className="mr-2 h-4 w-4" />
//                 Appointment Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Date & Time</p>
//                   <p className="text-sm font-medium flex items-center">
//                     <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.date[0] ? formatDate(booking.date[0]) : "N/A"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Last Updated</p>
//                   <p className="text-sm font-medium flex items-center">
//                     <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {formatDate(booking.updatedAt)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Service ID</p>
//                   <p className="text-sm font-medium truncate flex items-center" title={booking.serviceId}>
//                     <Building className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.serviceId.substring(0, 12)}...
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Vendor ID</p>
//                   <p className="text-sm font-medium truncate flex items-center" title={booking.vendorId}>
//                     <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                     {booking.vendorId.substring(0, 12)}...
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100">
//           <div className="flex gap-3 w-full">
//             <Button onClick={onClose} variant="outline" className="flex-1 border-gray-200">
//               Back to List
//             </Button>
//             <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
//               <CreditCard className="mr-2 h-4 w-4" />
//               View Payment
//             </Button>
//           </div>
//           <div className="flex gap-3 w-full mt-2">
//             <Button variant="outline" className="flex-1 border-gray-200">
//               <Printer className="mr-2 h-4 w-4" />
//               Print
//             </Button>
//             <Button variant="outline" className="flex-1 border-gray-200">
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default BookingDetails


"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { format } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  MessageCircle,
  XCircle,
  Check,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { useVendorCancelBookingMutation } from "@/hooks/VendorCustomHooks"

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
}

interface BookingDetailsProps {
  booking: Booking
  onBack?: () => void
  onCancel?: (bookingId: string, reason: string) => void
  onComplete?: (bookingId: string) => void
  onChat?: (clientId: string) => void
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    Rejected: "bg-rose-100 text-rose-700 border-rose-200",
    Failed: "bg-rose-100 text-rose-700 border-rose-200",
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
  const colorClass = colors[status as keyof typeof colors] || "bg-slate-100 text-slate-700 border-slate-200"

  return (
    <Badge className={`${colorClass} font-medium px-3 py-1 flex items-center text-sm`} variant="outline">
      <Icon className="w-4 h-4 mr-2" />
      {status}
    </Badge>
  )
}

const BookingDetails = ({ booking, onBack, onComplete, onChat }: BookingDetailsProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const vendorCancelBookingMutation = useVendorCancelBookingMutation()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMM dd, yyyy 'at' h:mm a")
    } catch (error) {
      return dateString
    }
  }

  const formatShortDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation")
      return
    }
    setIsLoading(true)
      vendorCancelBookingMutation.mutate(
        {
          bookingId: booking.bookingId,
          status:"Cancelled",
          reason: cancelReason
        },
        {
          onSuccess: (response) => {
            toast.success(response.message)
            setShowCancelDialog(false)
            setCancelReason("")
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to cancel booking")
            setIsLoading(false)
          },
          onSettled: () => setIsLoading(false)
        }
      )
    } 

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await onComplete?.(booking.bookingId)
      setShowCompleteDialog(false)
    } catch (error) {
      toast.error("Failed to complete booking")
    } finally {
      setIsLoading(false)
    }
  }

  const canCancel =
    booking.vendorApproval === "Approved" &&
    booking.status !== "Cancelled" &&
    booking.status !== "Completed" &&
    !booking.isComplete

  const canComplete = booking.vendorApproval === "Approved" && !booking.isComplete && booking.status !== "Cancelled"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                <FileText className="mr-3 h-7 w-7 text-emerald-600" />
                Booking Details
              </h1>
              <p className="text-slate-500 mt-1">ID: #{booking.bookingId.substring(booking.bookingId.length - 8)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={booking.status} />
              <StatusBadge status={booking.paymentStatus} />
              <StatusBadge status={booking.vendorApproval} />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Service Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-emerald-200 rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Calendar className="mr-3 h-5 w-5 text-emerald-600" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Service Name</p>
                      <p className="text-lg font-bold text-slate-800">{booking.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Appointment Date</p>
                      <p className="text-base font-semibold text-slate-800 flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
                        {booking.date[0] ? formatDate(booking.date[0]) : "Not scheduled"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Created</p>
                      <p className="text-base font-semibold text-slate-800 flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-slate-400" />
                        {formatShortDate(booking.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Status</p>
                      <Badge
                        className={`${
                          booking.isComplete
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        } font-medium px-3 py-1 flex items-center text-sm w-fit`}
                        variant="outline"
                      >
                        {booking.isComplete ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <Clock className="w-4 h-4 mr-2" />
                        )}
                        {booking.isComplete ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Client Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white border-slate-200 rounded-xl h-full">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                  <CardTitle className="flex items-center text-slate-800">
                    <User className="mr-3 h-5 w-5 text-blue-600" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Mail className="h-5 w-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Email</p>
                        <p className="font-bold text-slate-800">{booking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Phone className="h-5 w-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Phone</p>
                        <p className="font-bold text-slate-800">{booking.phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white border-slate-200 rounded-xl h-full">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                  <CardTitle className="flex items-center text-slate-800">
                    <Info className="mr-3 h-5 w-5 text-purple-600" />
                    Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Booking</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Payment</span>
                      <StatusBadge status={booking.paymentStatus} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Approval</span>
                      <StatusBadge status={booking.vendorApproval} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white border-slate-200 rounded-xl">
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {onChat && (
                    <Button
                      onClick={() => onChat(booking.clientId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-12"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat Client
                    </Button>
                  )}

                  {canComplete && (
                    <Button
                      onClick={() => setShowCompleteDialog(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      onClick={() => setShowCancelDialog(true)}
                      variant="destructive"
                      className="bg-rose-600 hover:bg-rose-700 h-12"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-rose-700">
              <XCircle className="mr-2 h-5 w-5" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this booking. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false)
                setCancelReason("")
              }}
            >
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={!cancelReason.trim() || isLoading}>
              {isLoading ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-emerald-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Complete Booking
            </DialogTitle>
            <DialogDescription>Are you sure you want to mark this booking as completed?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Completing..." : "Mark Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingDetails
