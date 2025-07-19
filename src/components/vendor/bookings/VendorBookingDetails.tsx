"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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
  CalendarDays,
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
import { useRescheduleBookingMutation, useVendorCancelBookingMutation } from "@/hooks/VendorCustomHooks"

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
}

interface BookingDetailsProps {
  booking: Booking
  onBack?: () => void
  onCancel?: () => void
  onComplete?: (bookingId: string) => void
  onChat?: (clientId: string) => void
  onReschedule?: (bookingId: string, newDate: Date, reason: string) => void
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

const BookingDetails = ({ booking, onBack,onCancel, onComplete, onChat }: BookingDetailsProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [rescheduleReason, setRescheduleReason] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)


  const vendorCancelBookingMutation = useVendorCancelBookingMutation()
  const rescheduleBookingMutation = useRescheduleBookingMutation()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMM dd, yyyy")
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
        status: "Cancelled",
        reason: cancelReason,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          setShowCancelDialog(false)
          setCancelReason("")
          onCancel?.()
        },
        onError: (error) => {
          toast.error(error.message || "Failed to cancel booking")
          setIsLoading(false)
        },
        onSettled: () => setIsLoading(false),
      },
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


  const handleReschedule = async () => {
    if (!selectedDate) {
      toast.error("Please select a new date")
      return
    }
    if (!rescheduleReason.trim()) {
      toast.error("Please provide a reason for rescheduling")
      return
    }

    setIsLoading(true)
      await rescheduleBookingMutation.mutateAsync({
        bookingId: booking.bookingId,
        selectedDate: format(selectedDate, "yyyy-MM-dd HH:mm:ss"),
        rescheduleReason,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          setShowRescheduleDialog(false)
          setSelectedDate(undefined)
          setRescheduleReason("")
        },
        onError: (error) => {
          toast.error(error.message)
          setIsLoading(false)
        },
        onSettled: () => setIsLoading(false),
      })
  }

  const canCancel =
    booking.vendorApproval === "Approved" &&
    booking.status !== "Cancelled" &&
    booking.status !== "Completed" &&
    !booking.isComplete

  const canComplete = booking.vendorApproval === "Approved" && !booking.isComplete && booking.status !== "Cancelled"

  const canReschedule =
    booking.vendorApproval === "Approved" &&
    booking.status !== "Cancelled" &&
    booking.status !== "Completed" &&
    booking.status === "Confirmed" &&
    !booking.isComplete

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
                      <p className="text-lg font-bold text-slate-800">{booking.service.serviceTitle}</p>
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {onChat && (
                    <Button
                      onClick={() => onChat(booking.clientId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-12"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat Client
                    </Button>
                  )}

                  {canReschedule && (
                    <Button
                      onClick={() => setShowRescheduleDialog(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white h-12"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Reschedule
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

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-orange-700">
              <CalendarDays className="mr-2 h-5 w-5" />
              Reschedule Booking
            </DialogTitle>
            <DialogDescription>
              Select a new date for this booking and provide a reason for the change.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Select New Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Reason for Rescheduling</label>
              <Textarea
                placeholder="Enter reason for rescheduling..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRescheduleDialog(false)
                setSelectedDate(undefined)
                setRescheduleReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!selectedDate || !rescheduleReason.trim() || isLoading}
            >
              {isLoading ? "Sending Request..." : "Send Reschedule Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
