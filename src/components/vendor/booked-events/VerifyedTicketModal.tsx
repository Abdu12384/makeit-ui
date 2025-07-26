import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Mail, Phone, Ticket, CreditCard, CheckCircle2, User, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useVerifyTicketMutation } from "@/hooks/VendorCustomHooks"
import toast from "react-hot-toast"
import { ITicket } from "@/types/ticket"

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
  ticket?: ITicket
  onCheckIn?: () => void
}

export function TicketModal({ isOpen, onClose, ticket, onCheckIn }: TicketModalProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(ticket?.ticketStatus === "used")
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const ticketVerify = useVerifyTicketMutation()
  

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const handleCheckIn = async () => {

    if (isCheckingIn) return
    setIsCheckingIn(true)

    ticketVerify.mutate(
      { 
        ticketId: ticket?.ticketId!,
         eventId: ticket?.eventId! ,
         status : 'checked_in'
      }, 
      {
      onSuccess: () => {
        setIsCheckedIn(true)
        setIsCheckingIn(false)
        if (onCheckIn) onCheckIn()
      },
      onError: (err) => {
        toast.error(err.message)
      },
      onSettled: () => {
        setTimeout(() => {
          setIsCheckingIn(false)
        }, 1000)
      }
    })
  }

  if(!ticket){
   return(
    <>
    <div>
      <p>
        Ticket not found
        </p>
    </div>
    </>
   )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Ticket Verification</DialogTitle>
        </DialogHeader>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Ticket Verified</h3>
              <p className="text-muted-foreground">
                {isCheckedIn ? "Ticket has been checked in" : "Ticket is valid and ready for check-in"}
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Ticket className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">Ticket ID</span>
                </div>
                <span className="font-mono text-sm">{ticket?.ticketId?.substring(0, 20)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">Amount</span>
                </div>
                <span>{formatCurrency(ticket?.totalAmount!)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{ticket?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Customer</p>
                      <p className="text-xs text-muted-foreground">{ticket?.clientId?.substring(0, 20)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{ticket?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{ticket.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Ticket className="w-4 h-4 mr-2" />
                  Ticket Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        ticket.ticketStatus === "used" || isCheckedIn
                          ? "outline"
                          : ticket.ticketStatus === "unused"
                            ? "default"
                            : "destructive"
                      }
                      className={
                        ticket.ticketStatus === "used" || isCheckedIn
                          ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                          : ""
                      }
                    >
                      {ticket.ticketStatus === "used" || isCheckedIn ? "Used" : ticket.ticketStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment</span>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                    >
                      {ticket.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <span>{ticket.ticketCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm">{formatDate(ticket?.createdAt!)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 mb-6">
              <h4 className="font-medium flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </h4>
              <div className="flex justify-center">
                <div className="bg-white p-2 rounded-lg border">
                  <img
                    src={ticket.qrCodeLink || "/placeholder.svg"}
                    alt="Ticket QR Code"
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=QR"
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {!isCheckedIn && (
                <Button onClick={handleCheckIn} disabled={isCheckingIn} className="gap-2">
                  {isCheckingIn ? (
                    <>
                      <span className="animate-spin">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Check In Ticket
                    </>
                  )}
                </Button>
              )}
              {isCheckedIn && (
                <Button variant="outline" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Checked In
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}