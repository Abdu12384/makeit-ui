import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, User, CheckCircle, ClockIcon, Eye, Mail, Phone, XCircle, AlertTriangle, CheckIcon } from "lucide-react"
import { useGetBookingsMutation } from "@/hooks/ClientCustomHooks"
import BookingDetails from "./BookingDetails"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Booking } from "./BookingDetails"


export default function ClientBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [activeTab, setActiveTab] = useState("pending")
  const limit = 10

  console.log(bookings)
  const clientGetBookingsMutation = useGetBookingsMutation()

  useEffect(() => {
    setIsLoading(true)
    clientGetBookingsMutation.mutate(
      {
        page: currentPage,
        limit,
        status: activeTab
      },
      {
        onSuccess: (response) => {
          console.log("response", response)
          setTotalPages(response.bookings.total)
          const fetchedBookings = response.bookings.bookings.map((booking: Booking) => ({
            bookingId: booking.bookingId || booking.clientId,
            title: "Service Booking",
            date: new Date(booking.date[0]).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time: "N/A",
            client: booking.client,
            status: booking.status,
            email: booking.email,
            phone: booking.phone,
            vendor: booking.vendor,
            paymentStatus: booking.paymentStatus,
            balanceAmount: booking.balanceAmount,
            vendorApproval: booking.vendorApproval,
            isComplete: booking.isComplete,
            serviceId: booking.serviceId,
            service: booking.service,
            rescheduleStatus: booking.rescheduleStatus,
            rescheduleReason: booking.rescheduleReason,
            _id: booking._id,
          }))
          setBookings(fetchedBookings)
          setIsLoading(false)
        },
        onError: (error) => {
          console.error("Error fetching bookings:", error)
          setIsLoading(false)
        },
      },
    )
  }, [currentPage,activeTab])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Filter bookings based on completion status
  const filterBookings = (type: string) => {
    switch (type) {
      case "completed":
        return bookings.filter((booking) => booking.status.toLowerCase() === "completed")
      case "rescheduled":
        return bookings.filter((booking) => booking.status.toLowerCase() === "rescheduled")
      case "pending":
        return bookings.filter(
          (booking) => booking.status.toLowerCase() === "pending" || booking.status.toLowerCase() === "confirmed",
        )
      case "cancelled":
        return bookings.filter((booking) => booking.status.toLowerCase() === "cancelled")
      default:
        return bookings
    }
  }

  const getBookingCounts = () => {
    return {
      completed: bookings.filter((booking) => booking.status.toLowerCase() === "completed").length,
      confirmed: bookings.filter((booking) => booking.status.toLowerCase() === "confirmed").length,
      pending: bookings.filter((booking) => booking.status.toLowerCase() === "pending").length,
      rescheduled: bookings.filter((booking) => booking.status.toLowerCase() === "rescheduled").length,
      cancelled: bookings.filter((booking) => booking.status.toLowerCase() === "cancelled").length,
    }
  }

  const bookingCounts = getBookingCounts()
  const filteredBookings = filterBookings(activeTab)

  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-1/2 rounded bg-gray-200"></div>
          <div className="h-5 w-20 rounded-full bg-gray-200"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="mr-2 h-5 w-5 rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-5 w-5 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-5 w-5 rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-10 w-24 rounded-lg bg-gray-200"></div>
        </div>
      </CardContent>
    </Card>
  )

  const renderBookingCard = (booking: Booking, index: number) => {
    const isCompleted = booking.status.toLowerCase() === "completed"
    const isPending = booking.status.toLowerCase() === "pending"
    const isRescheduled = booking.status.toLowerCase() === "rescheduled"
    const isConfirmed = booking.status.toLowerCase() === "confirmed"
    const isCancelled = booking.status.toLowerCase() === "cancelled"

    return (
      <motion.div
        key={booking._id || booking.bookingId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card
          className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${
            isCancelled ? "border-l-red-500" : "border-l-purple-500"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : isPending
                        ? "bg-yellow-100 text-yellow-600"
                        : isConfirmed
                          ? "bg-blue-100 text-blue-600"
                          : isRescheduled
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : isCancelled ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <ClockIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                  <p className="text-sm text-gray-500">ID: {booking.bookingId}</p>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{booking.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="font-medium">Client:</span>
                  <span className="ml-2">{booking.client?.name || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 truncate">{booking.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{booking.phone}</span>
                </div>
              </div>
            </div>

            {/* Additional Status Information */}
            {booking.paymentStatus && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Payment Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      booking.paymentStatus === "Successfull"
                        ? "text-green-600 border-green-200"
                        : "text-orange-600 border-orange-200"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>
                {booking.vendorApproval && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-medium text-gray-700">Vendor Approval:</span>
                    <Badge
                      variant="outline"
                      className={
                        booking.vendorApproval === "Approved"
                          ? "text-green-600 border-green-200"
                          : booking.vendorApproval === "Rejected"
                            ? "text-red-600 border-red-200"
                            : "text-yellow-600 border-yellow-200"
                      }
                    >
                      {booking.vendorApproval}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Cancellation Notice for Cancelled Bookings */}
            {isCancelled && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-800">Booking Cancelled</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  This booking has been cancelled. If you have any questions, please contact support.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBooking(booking)}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (selectedBooking) {
    return <BookingDetails booking={selectedBooking} onBack={() => setSelectedBooking(null)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto space-y-6 p-4"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
          <p className="text-gray-600 mt-2">Manage and track your service bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="pending" className="relative">
            <ClockIcon className="h-4 w-4 mr-2" />
            Pending
            {bookingCounts.pending > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5">{bookingCounts.pending}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="relative">
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmed
            {bookingCounts.confirmed > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5">{bookingCounts.confirmed}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed
            {bookingCounts.completed > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5">{bookingCounts.completed}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="relative">
            <XCircle className="h-4 w-4 mr-2" />
            Cancelled
            {bookingCounts.cancelled > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5">{bookingCounts.cancelled}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rescheduled" className="relative">
            <XCircle className="h-4 w-4 mr-2" />
            Rescheduled
            {bookingCounts.rescheduled > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5">{bookingCounts.rescheduled}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Pending & Active Bookings</h2>
            <Badge variant="outline" className="text-yellow-600 border-yellow-200">
              {bookingCounts.pending} bookings
            </Badge>
          </div>

          {/* Info Banner for Pending */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800">Pending Bookings</h3>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              These bookings are awaiting confirmation or are currently active. You'll receive updates as their status
              changes.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">{filteredBookings.map(renderBookingCard)}</div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending bookings</h3>
              <p className="text-gray-500">You don't have any pending bookings at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Confirmed Bookings</h2>
            <Badge variant="outline" className="text-green-600 border-green-200">
              {bookingCounts.confirmed} bookings
            </Badge>
          </div>

          {/* Info Banner for Pending */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-green-800">Confirmed Bookings</h3>
            </div>
            <p className="text-sm text-green-700 mt-1">
              These bookings are awaiting confirmation or are currently active. You'll receive updates as their status
              changes.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">{filteredBookings.map(renderBookingCard)}</div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending bookings</h3>
              <p className="text-gray-500">You don't have any pending bookings at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rescheduled" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Rescheduled Bookings</h2>
            <Badge variant="outline" className="text-yellow-600 border-yellow-200">
              {bookingCounts.rescheduled} bookings
            </Badge>
          </div>

          {/* Info Banner for Pending */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800">Rescheduled Bookings</h3>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              These bookings are awaiting confirmation or are currently active. You'll receive updates as their status
              changes.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">{filteredBookings.map(renderBookingCard)}</div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending bookings</h3>
              <p className="text-gray-500">You don't have any pending bookings at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Completed Bookings</h2>
            <Badge variant="outline" className="text-green-600 border-green-200">
              {bookingCounts.completed} bookings
            </Badge>
          </div>

          {/* Info Banner for Completed */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-green-800">Completed Bookings</h3>
            </div>
            <p className="text-sm text-green-700 mt-1">
              These bookings have been successfully completed. You can view details and download receipts for your
              records.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">{filteredBookings.map(renderBookingCard)}</div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed bookings</h3>
              <p className="text-gray-500">You haven't completed any bookings yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Cancelled Bookings</h2>
            <Badge variant="outline" className="text-red-600 border-red-200">
              {bookingCounts.cancelled} bookings
            </Badge>
          </div>

          {/* Special Banner for Cancelled Bookings */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 mb-6 shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-red-800">Cancelled Bookings</h3>
                  <Badge className="ml-3 bg-red-100 text-red-800 border-red-200">
                    {bookingCounts.cancelled} cancelled
                  </Badge>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-red-700">
                    We're sorry these bookings didn't work out. Here are your cancelled bookings for reference.
                  </p>
                </div>
            
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">{filteredBookings.map(renderBookingCard)}</div>
          ) : (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cancelled bookings</h3>
              <p className="text-gray-500">Great! You don't have any cancelled bookings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <div className="mt-8 flex justify-center items-center">
          <Pagination1
            currentPage={currentPage}
            totalPages={totalPages}
            onPageNext={() => setCurrentPage(currentPage + 1)}
            onPagePrev={() => setCurrentPage(currentPage - 1)}
          />
        </div>
      )}
    </motion.div>
  )
}
