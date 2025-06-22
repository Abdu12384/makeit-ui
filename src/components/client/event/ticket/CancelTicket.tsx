// import { Ticket } from "@/types/ticket"
// import { useState } from "react"
// import { useEffect } from "react"
// import { X } from "lucide-react"
// import { useCancelTicketMutation } from "@/hooks/ClientCustomHooks"
// import toast from "react-hot-toast"


// export const CancelTicketModal: React.FC<{
//   ticket: Ticket
//   onClose: () => void
//   onConfirm: () => void
// }> = ({ ticket, onClose,onConfirm }) => {
//   const [isVisible, setIsVisible] = useState(false)
//   const cancelTicketMutation = useCancelTicketMutation()

//   console.log('ticket',ticket)

//   useEffect(() => {
//     setIsVisible(true)
//     return () => setIsVisible(false)
//   }, [])

  
//   const handleCancelTicket = () => {
//     cancelTicketMutation.mutate(
//       ticket?.ticketId,
//       {
//         onSuccess: (data) => {
//           console.log(data)
//           toast.success(data.message)
//           onConfirm()
//           onClose()
//         },
//         onError: (error) => {
//           console.log(error)
//           toast.error(error.message)
//         },
//       }
//     )
//   }

//   return (
//     <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50 p-4">
//       <div
//         className={`bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
//           isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
//         }`}
//       >
//         <div className="p-6">
//           <div className="flex items-center justify-center mb-4 text-red-500">
//             <X className="h-12 w-12" />
//           </div>
//           <h3 className="text-xl font-bold text-center mb-2">Cancel Ticket</h3>
//           <p className="text-gray-600 text-center mb-6">
//             Are you sure you want to cancel your ticket for <strong>{ticket?.eventDetails?.title}</strong>?
//           </p>

//           <div className="bg-gray-50 p-4 rounded-lg mb-6">
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-600">Event:</span>
//               <span className="font-medium">{ticket?.eventDetails?.title}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-600">Date:</span>
//               <span className="font-medium">{ticket?.eventDetails?.date.toString().split("T")[0]}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-600">Tickets:</span>
//               <span className="font-medium">{ticket?.ticketCount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Price:</span>
//               <span className="font-medium">{ticket?.totalAmount}</span>
//             </div>
//           </div>

//           <p className="text-sm text-gray-500 mb-6">
//             Note: Refund policies may apply. Please check the event's cancellation policy for details.
//           </p>

//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
//             >
//               Keep Ticket
//             </button>
//             <button
//               onClick={handleCancelTicket}
//               className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//             >
//               Cancel Ticket
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"

import type { Ticket } from "@/types/ticket"
import { useState, useEffect } from "react"
import { Minus, Plus, AlertTriangle, X } from "lucide-react"
import { useCancelTicketMutation } from "@/hooks/ClientCustomHooks"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const CancelTicketModal: React.FC<{
  ticket: Ticket
  onClose: () => void
  onConfirm: () => void
}> = ({ ticket, onClose, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [cancelCount, setCancelCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const cancelTicketMutation = useCancelTicketMutation()

  const totalTickets = ticket?.ticketCount || 1
  const pricePerTicket = ticket?.totalAmount ? ticket.totalAmount / totalTickets : 0
  const refundAmount = cancelCount * pricePerTicket

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  const handleCountChange = (newCount: number) => {
    if (newCount >= 1 && newCount <= totalTickets) {
      setCancelCount(newCount)
    }
  }

  const handleCancelTicket = () => {
    setIsLoading(true)
    cancelTicketMutation.mutate(
      {
        ticketId: ticket?.ticketId,
        cancelCount: cancelCount,
      },
      {
        onSuccess: (data) => {
          console.log(data)
          toast.success(data.message || `Successfully cancelled ${cancelCount} ticket(s)`)
          onConfirm()
          onClose()
        },
        onError: (error: any) => {
          console.log(error)
          toast.error(error.message || "Failed to cancel ticket")
          setIsLoading(false)
        },
      },
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString.split("T")[0]
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white w-full max-w-md h-full max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 flex flex-col ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Cancel Tickets</h3>
            <p className="text-rose-100 text-sm">Select how many tickets you want to cancel</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Event Details */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-lg text-slate-800 mb-4 text-center">Event Details</h4>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm font-medium text-slate-600 block mb-1">Event Name</span>
                      <span className="font-bold text-slate-800 text-lg block">{ticket?.eventDetails?.title}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <span className="text-xs font-medium text-blue-600 block mb-1">Date</span>
                      <span className="font-semibold text-blue-800 text-sm">
                        {formatDate(ticket?.eventDetails?.date?.toString() || "")}
                      </span>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <span className="text-xs font-medium text-purple-600 block mb-1">Total Tickets</span>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 font-bold">
                        {totalTickets}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-lg text-center">
                    <span className="text-xs font-medium text-emerald-600 block mb-1">Price per Ticket</span>
                    <span className="font-bold text-emerald-800 text-lg">₹{pricePerTicket.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Count Selector */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-lg text-slate-800 mb-4 text-center">Select Tickets to Cancel</h4>

                {/* Main Counter */}
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCountChange(cancelCount - 1)}
                    disabled={cancelCount <= 1 || isLoading}
                    className="h-14 w-14 rounded-full border-2 border-slate-300 hover:border-rose-400 hover:bg-rose-50 shadow-md"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                      {cancelCount}
                    </div>
                    <span className="text-sm text-slate-500 mt-2 font-medium">ticket{cancelCount > 1 ? "s" : ""}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCountChange(cancelCount + 1)}
                    disabled={cancelCount >= totalTickets || isLoading}
                    className="h-14 w-14 rounded-full border-2 border-slate-300 hover:border-rose-400 hover:bg-rose-50 shadow-md"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                {/* Quick Select Buttons */}
                {totalTickets > 1 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-600 text-center">Quick Select:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: totalTickets }, (_, i) => i + 1).map((count) => (
                        <Button
                          key={count}
                          variant={cancelCount === count ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCancelCount(count)}
                          disabled={isLoading}
                          className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                            cancelCount === count
                              ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md scale-105"
                              : "border-slate-300 hover:border-rose-400 hover:bg-rose-50"
                          }`}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Refund Summary */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-lg text-amber-800 mb-4 text-center">Cancellation Summary</h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 p-3 rounded-lg text-center">
                      <span className="text-xs font-medium text-amber-700 block mb-1">Cancelling</span>
                      <span className="font-bold text-amber-900 text-lg">{cancelCount}</span>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg text-center">
                      <span className="text-xs font-medium text-amber-700 block mb-1">Remaining</span>
                      <span className="font-bold text-amber-900 text-lg">{totalTickets - cancelCount}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg border border-amber-200">
                    <div className="text-center">
                      <span className="text-sm font-medium text-amber-700 block mb-1">Estimated Refund</span>
                      <span className="font-bold text-2xl text-amber-900">₹{refundAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy Notice */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 text-sm font-bold">ℹ</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-semibold">Refund Policy:</span> Processing time is typically 3-5 business
                    days. Please check the event's cancellation policy for specific terms and conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Footer - Action Buttons */}
        <div className="flex-shrink-0 p-6 bg-slate-50 border-t border-slate-200">
          <div className="space-y-3">
            <Button
              onClick={handleCancelTicket}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-lg shadow-lg rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Cancelling...
                </div>
              ) : (
                `Cancel ${cancelCount} Ticket${cancelCount > 1 ? "s" : ""} - ₹${refundAmount.toFixed(2)}`
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl"
              disabled={isLoading}
            >
              Keep All Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
