"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Booking } from "@/types/bookings"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  MapPin,
  Building,
  Download,
  Printer,
  ArrowLeft,
} from "lucide-react"

interface BookingDetailsProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onReject?: () => void
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Approved":
      case "Paid":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
      case "Cancelled":
      case "Rejected":
      case "Failed":
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
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
    <Badge className={`${getStatusColor(status)} font-medium px-2.5 py-1 flex items-center text-xs`} variant="outline">
      {getStatusIcon(status)}
      {status}
    </Badge>
  )
}

const BookingDetails = ({ booking, isOpen, onClose, onReject }: BookingDetailsProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a")
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return dateString
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  // Safely handle dialog closing
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white rounded-xl">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <DialogHeader className="pb-2">
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="absolute left-2 top-2 text-white hover:bg-blue-600 hover:text-white p-2 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-bold flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-blue-100 opacity-90">Booking ID: {booking.bookingId}</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
            <StatusBadge status={booking.vendorApproval} />
          </div>
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Service Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Service</p>
                  <p className="text-sm font-medium">{booking.serviceName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Created</p>
                  <p className="text-sm font-medium">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Status Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Booking Status</p>
                  <StatusBadge status={booking.status} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Payment Status</p>
                  <StatusBadge status={booking.paymentStatus} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Vendor Approval</p>
                  <StatusBadge status={booking.vendorApproval} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Completed</p>
                  <Badge
                    variant="outline"
                    className={`${
                      booking.isComplete
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    } px-2.5 py-1 flex items-center text-xs`}
                  >
                    {booking.isComplete ? (
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {booking.isComplete ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                <User className="mr-2 h-4 w-4" />
                Client Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-sm font-medium flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.clientName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <p className="text-sm font-medium flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone</p>
                  <p className="text-sm font-medium flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Client ID</p>
                  <p className="text-sm font-medium truncate flex items-center" title={booking.clientId}>
                    <Info className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.clientId.substring(0, 12)}...
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Appointment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Date & Time</p>
                  <p className="text-sm font-medium flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.date[0] ? formatDate(booking.date[0]) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Service ID</p>
                  <p className="text-sm font-medium truncate flex items-center" title={booking.serviceId}>
                    <Building className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.serviceId.substring(0, 12)}...
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Vendor ID</p>
                  <p className="text-sm font-medium truncate flex items-center" title={booking.vendorId}>
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {booking.vendorId.substring(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3 w-full">
            <Button onClick={onClose} variant="outline" className="flex-1 border-gray-200">
              Back to List
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <CreditCard className="mr-2 h-4 w-4" />
              View Payment
            </Button>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <Button variant="outline" className="flex-1 border-gray-200">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="flex-1 border-gray-200">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookingDetails