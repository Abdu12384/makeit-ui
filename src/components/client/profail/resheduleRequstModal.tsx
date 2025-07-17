"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MessageSquare, X, Check, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Booking } from "./BookingDetails"
import { useRescheduleBookingApprovalMutation } from "@/hooks/ClientCustomHooks"
import toast from "react-hot-toast"

interface RescheduleRequestModalProps {
  isOpen: boolean
  onClose: () => void
  rescheduleRequest: Booking
  isLoading?: boolean
}

export default function RescheduleRequestModal({
  isOpen,
  onClose,
  rescheduleRequest,
  isLoading = false
}: RescheduleRequestModalProps) {
  const [actionType, setActionType] = useState<"Approve" | "Reject" | null>(null)
  const clientRescheduleBookingApprovalMutation = useRescheduleBookingApprovalMutation()

  const handleApprove = () => {
    setActionType("Approve")
    clientRescheduleBookingApprovalMutation.mutate(
      {bookingId: rescheduleRequest.bookingId, status: "Approved"},
      {
        onSuccess: (data) => {
          onClose()
          toast.success(data.message)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  }

  const handleReject = () => {
    setActionType("Reject")
    clientRescheduleBookingApprovalMutation.mutate(
      {bookingId: rescheduleRequest.bookingId, status: "Rejected"},
      {
        onSuccess: (data) => {
          onClose()
          toast.success(data.message)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-2xl bg-white dark:bg-gray-900">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Reschedule Request</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Review and respond to the reschedule request
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Request Info */}
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/30">
                      Requested by {rescheduleRequest.vendor.name}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      on {formatDate(rescheduleRequest.date)}
                    </span>
                  </div>
                </div>

                {/* New Date & Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Date</p>
                      <p className="font-semibold text-blue-900 dark:text-blue-300">
                        {formatDate(rescheduleRequest.date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <Label className="text-sm font-medium">Reason for Reschedule</Label>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {rescheduleRequest?.rescheduleReason}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 sm:flex-none"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-3 flex-1">
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      disabled={isLoading}
                      className="flex-1 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      {isLoading && actionType === "Reject" ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          Rejecting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Reject
                        </div>
                      )}
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading && actionType === "Approve" ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Approving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Approve
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
