"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface RejectReasonDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  bookingId: string
}

const RejectReasonDialog = ({ isOpen, onClose, onConfirm, bookingId }: RejectReasonDialogProps) => {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setReason("")
      setError("")
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection")
      return
    }
    onConfirm(reason)
    setReason("")
    setError("")
  }

  // Safely handle dialog closing
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-xl">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Reject Booking
            </DialogTitle>
          </DialogHeader>
          <p className="text-red-100 mt-2">
            Please provide a reason for rejecting booking #{bookingId ? bookingId.substring(bookingId.length - 6) : ''}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                className="min-h-[120px] border-gray-200 focus:border-red-500 focus:ring-red-500"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3 w-full">
            <Button 
              onClick={() => {
                setReason("")
                setError("")
                onClose()
              }} 
              variant="outline" 
              className="flex-1 border-gray-200"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
              Reject Booking
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RejectReasonDialog