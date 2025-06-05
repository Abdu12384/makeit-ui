import { Ticket } from "@/types/ticket"
import { useState } from "react"
import { useEffect } from "react"
import { X } from "lucide-react"
import { useCancelTicketMutation } from "@/hooks/ClientCustomHooks"
import toast from "react-hot-toast"


export const CancelTicketModal: React.FC<{
  ticket: Ticket
  onClose: () => void
  onConfirm: () => void
}> = ({ ticket, onClose, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cancelTicketMutation = useCancelTicketMutation()

  console.log('ticket',ticket)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  
  const handleCancelTicket = () => {
    cancelTicketMutation.mutate(
      ticket?.ticketId,
      {
        onSuccess: (data) => {
          console.log(data)
          toast.success(data.message)
          onClose()
        },
        onError: (error) => {
          console.log(error)
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <X className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Cancel Ticket</h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to cancel your ticket for <strong>{ticket?.eventDetails?.title}</strong>?
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium">{ticket?.eventDetails?.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{ticket?.eventDetails?.date.toString().split("T")[0]}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tickets:</span>
              <span className="font-medium">{ticket?.ticketCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">{ticket?.totalAmount}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Note: Refund policies may apply. Please check the event's cancellation policy for details.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Keep Ticket
            </button>
            <button
              onClick={handleCancelTicket}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}