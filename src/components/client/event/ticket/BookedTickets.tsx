"use client"

import { useState, useEffect } from "react"
import { X, Eye, CheckCircle, XCircle, Clock3 } from "lucide-react"
import { useGetAllTicketsMutation } from "@/hooks/ClientCustomHooks"
import type { Ticket } from "@/types/ticket"
import { TicketDetailsModal } from "./ViewTicketDetails"
import { CancelTicketModal } from "./CancelTicket"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Main component
export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [activeTab, setActiveTab] = useState("unused")
  const limit = 10

  const getAllTicketsMutation = useGetAllTicketsMutation()

  const fetchTickets = () => {
    getAllTicketsMutation.mutate(
      {
        page: currentPage,
        limit: limit,
        status: activeTab
      },
      {
        onSuccess: (response) => {
          setTickets(response.tickets.tickets)
          setTotalPages(response.tickets.total)
        },
        onError: (error) => {
          console.log("error while client get all tickets", error)
        },
      },
    )
  }

  useEffect(() => {
    fetchTickets()
  }, [currentPage,activeTab])

  const formatTo12Hour = (time: string) => {
    const [hour, minute] = time.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hour))
    date.setMinutes(Number.parseInt(minute))
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowDetailsModal(true)
  }

  const handleCancelTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowCancelModal(true)
  }

  const confirmCancelTicket = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.map((ticket) => {
        if (ticket.ticketId === selectedTicket.ticketId) {
          return { ...ticket, ticketStatus: "cancelled" }
        }
        return ticket
      })
      setTickets(updatedTickets)
      setShowCancelModal(false)
    }
  }

  // Filter tickets based on status
  const filterTickets = (status: string) => {
    switch (status) {
      case "used":
        return tickets.filter((ticket) => ticket.ticketStatus === "used")
      case "unused":
        return tickets.filter((ticket) => ticket.ticketStatus === "unused" || ticket.ticketStatus === "active" || ticket.ticketStatus === "partially_refunded")
      case "cancelled":
        return tickets.filter((ticket) => ticket.ticketStatus === "cancelled")
      default:
        return tickets
    }
  }

  const getTicketCounts = () => {
    return {
      used: tickets.filter((ticket) => ticket.ticketStatus === "used").length,
      unused: tickets.filter((ticket) => ticket.ticketStatus === "unused" || ticket.ticketStatus === "active").length,
      cancelled: tickets.filter((ticket) => ticket.ticketStatus === "cancelled").length,
    }
  }

  const ticketCounts = getTicketCounts()
  const filteredTickets = filterTickets(activeTab)

  const renderTicketCard = (ticket: Ticket) => {
    const isUsed = ticket.ticketStatus === "used"
    const isCancelled = ticket.ticketStatus === "cancelled"
    const isUnused = ticket.ticketStatus === "unused" || ticket.ticketStatus === "active"

    return (
      <div key={ticket?.ticketId} className="max-w-md w-full">
        {/* Ticket Card */}
        <div className="relative h-80 rounded-lg shadow-lg overflow-hidden group">
          {/* Ticket Container */}
          <div className="absolute inset-0 flex">
            {/* Left Side - White */}
            <div
              className={`w-1/2 bg-white p-6 flex flex-col justify-between relative ${isCancelled ? "opacity-60" : ""}`}
            >
              <div>
              <h3
                className={`text-2xl font-bold ${isCancelled ? "text-gray-500" : "text-purple-900"} truncate max-w-[300px]`}
                title={ticket.eventDetails?.title} 
              >
                {ticket.eventDetails?.title}
              </h3>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isCancelled ? "text-gray-500" : "text-purple-900"}`}>
                {ticket.eventDetails?.date && ticket.eventDetails.date.length > 0 ? (
                  ticket.eventDetails.date.length > 0 && (
                    // Single date entry
                    <>
                      <div className={`text-2xl font-bold ${isCancelled ? "text-gray-500" : "text-purple-900"}`}>
                        {new Date(ticket.eventDetails.date[0].date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>{formatTo12Hour(ticket.eventDetails.date[0].startTime || "")}</span>
                        <span> - </span>
                        <span>{formatTo12Hour(ticket.eventDetails.date[0].endTime || "")}</span>
                      </div>
                    </>
                  )
                ) : (
                  <div className={`text-2xl font-bold ${isCancelled ? "text-gray-500" : "text-purple-900"}`}>
                    No date
                  </div>
                )}                </div>
                <div className="text-sm text-gray-600">
                  <span>{formatTo12Hour(ticket?.eventDetails?.startTime || "")}</span>
                  <span> - </span>
                  <span>{formatTo12Hour(ticket?.eventDetails?.endTime || "")}</span>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-500">Ticket Price</div>
                  <div className={`text-2xl font-bold ${isCancelled ? "text-gray-500" : "text-purple-900"}`}>
                    {ticket?.totalAmount}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Colored */}
            <div
              className={`w-1/2 p-6 flex flex-col justify-between ${
                isCancelled ? "bg-gray-400" : isUsed ? "bg-green-600" : "bg-purple-800"
              } ${isCancelled ? "opacity-60" : ""}`}
            >
              <div>
                <h3 className={`text-2xl font-bold text-white`}>{ticket?.eventDetails?.title}</h3>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-white/80">{ticket?.ticketType}</p>
                  <p className="text-sm text-white/80">THIS PARTY IS FOR YOU</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-2 rounded">
                <img
                  src={ticket?.qrCodeLink || "/placeholder.svg"}
                  alt="Ticket QR Code"
                  className={`w-full h-20 object-cover ${isCancelled ? "grayscale" : ""}`}
                />
              </div>
            </div>

            {/* Perforation Line */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col justify-between py-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            {isUsed && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Used
              </Badge>
            )}
            {isUnused && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Clock3 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>

          {/* Overlay with buttons (visible on hover) */}
          {!isCancelled && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleViewDetails(ticket)}
                  className="bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Details
                </button>
                {!isUsed && (
                  <button
                    onClick={() => handleCancelTicket(ticket)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4 inline mr-1" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Cancelled Overlay */}
          {isCancelled && (
            <>
              {/* Red diagonal stripes background */}
              <div className="absolute inset-0 bg-red-600 opacity-20"></div>
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    #dc2626,
                    #dc2626 10px,
                    transparent 10px,
                    transparent 20px
                  )`,
                }}
              ></div>

              {/* Cancelled Banner */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Shadow effect */}
                  <div className="absolute inset-0 bg-red-800 rounded-lg transform rotate-12 translate-x-1 translate-y-1 opacity-50"></div>
                  {/* Main banner */}
                  <div className="relative bg-red-600 text-white px-8 py-4 rounded-lg text-2xl font-bold transform rotate-12 shadow-2xl border-4 border-red-700">
                    <XCircle className="inline h-6 w-6 mr-2" />
                    CANCELLED
                  </div>
                </div>
              </div>

              {/* View Details Button for Cancelled Tickets */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => handleViewDetails(ticket)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-2">Manage your event tickets</p>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="unused" className="relative">
              <Clock3 className="h-4 w-4 mr-2" />
              Unused
              {ticketCounts.unused > 0 && (
                <Badge className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5">{ticketCounts.unused}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="used" className="relative">
              <CheckCircle className="h-4 w-4 mr-2" />
              Used
              {ticketCounts.used > 0 && (
                <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5">{ticketCounts.used}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="relative">
              <XCircle className="h-4 w-4 mr-2" />
              Cancelled
              {ticketCounts.cancelled > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5">{ticketCounts.cancelled}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unused" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Active Tickets</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {ticketCounts.unused} tickets
              </Badge>
            </div>
            {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map(renderTicketCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No unused tickets</h3>
                <p className="text-gray-500">You don't have active tickets at the moment.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="used" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Used Tickets</h2>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {ticketCounts.used} tickets
              </Badge>
            </div>
            {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map(renderTicketCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No used tickets</h3>
                <p className="text-gray-500">You haven't used tickets yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Cancelled Tickets</h2>
              <Badge variant="outline" className="text-red-600 border-red-200">
                {ticketCounts.cancelled} tickets
              </Badge>
            </div>
            {filteredTickets.length > 0 ? (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="text-sm font-medium text-red-800">Cancelled Tickets</h3>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    These tickets have been cancelled and cannot be used for entry. Refund processing may take 3-5
                    business days.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTickets.map(renderTicketCard)}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cancelled tickets</h3>
                <p className="text-gray-500">You don't have cancelled tickets.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {filteredTickets.length > 0 && (
          <div className="mt-8 flex justify-center items-center">
            <Pagination1
              currentPage={currentPage}
              totalPages={totalPages}
              onPageNext={() => setCurrentPage(currentPage + 1)}
              onPagePrev={() => setCurrentPage(currentPage - 1)}
            />
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={() => setShowDetailsModal(false)} />
      )}

      {/* Cancel Ticket Modal */}
      {showCancelModal && selectedTicket && (
        <CancelTicketModal
          ticket={selectedTicket}
          onClose={() => setShowCancelModal(false)}
          onConfirm={confirmCancelTicket}
        />
      )}
    </div>
  )
}
