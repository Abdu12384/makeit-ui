"use client"

import { useEffect, useState } from "react"
import { Eye, Filter, Search, X, Calendar, User, DollarSign, Clock, CheckCircle, AlertCircle, Info, IndianRupee } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetAllBookingsMutation } from "@/hooks/AdminCustomHooks"
import { Pagination1 } from "@/components/common/paginations/Pagination"

// Booking Types
interface Client {
  email: string
  name: string
  phone: string
  userId: string
}

interface Service {
  serviceTitle: string
  serviceDescription: string
  servicePrice: number
  serviceDuration: string
  additionalHourFee: number
  yearsOfExperience: number
}

interface Vendor {
  email: string
  name: string
  phone: string
  userId: string
}

interface Booking {
  bookingId: string
  clientId: string
  client: Client
  date: string[]
  email: string
  phone: string
  paymentStatus: string
  serviceId: string
  service: Service
  vendorApproval: string
  vendorId: string
  vendor: Vendor
  status: string
  createdAt: string
  updatedAt: string
  isComplete: boolean
  rejectionReason?: string
  _id: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const limit = 10

  const getAllBookingsMutation = useGetAllBookingsMutation()

  useEffect(() => {
    getAllBookingsMutation.mutate(
      {
        page: currentPage,
        limit: limit,
      },
      {
        onSuccess: (data) => {
          console.log("Bookings data:", data)
          setBookings(data.bookings.bookings)
          setTotalPages(data.bookings.total)
        },
        onError: (error) => {
          console.error("Error fetching bookings:", error)
        },
      }
    )
  }, [searchQuery, currentPage])

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
      case "cancelled":
      case "completed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "successfull":
        return "success"
      case "pending":
        return "warning"
      case "refunded":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const handleCloseDetails = () => {
    setSelectedBooking(null)
  }

  return (
    <div className="grid gap-6 p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Booking Management</h1>
      </div>

      <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Bookings</CardTitle>
          <CardDescription className="text-gray-400">
            Manage bookings, view details, and update status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by ID, email, phone, or status..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>

          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300 font-medium">Booking ID</TableHead>
                  <TableHead className="text-gray-300 font-medium">Date</TableHead>
                  <TableHead className="text-gray-300 font-medium">Contact</TableHead>
                  <TableHead className="text-center text-gray-300 font-medium">Status</TableHead>
                  <TableHead className="text-center text-gray-300 font-medium">Payment</TableHead>
                  <TableHead className="text-center text-gray-300 font-medium">Vendor Approval</TableHead>
                  <TableHead className="text-right text-gray-300 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId} className="border-gray-800 hover:bg-gray-800/50 transition-colors duration-150">
                    <TableCell className="font-medium text-white">
                      {booking.bookingId.substring(booking.bookingId.length - 12)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(booking.date[0]).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{booking.email}</div>
                      <div className="text-gray-400 text-xs">{booking.phone}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(booking.status) as any}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getPaymentStatusColor(booking.paymentStatus) as any}>
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="border-gray-700 text-gray-300">
                        {booking.vendorApproval}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-800 border-gray-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-colors duration-200"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Pagination1
        currentPage={currentPage}
        totalPages={totalPages}
        onPageNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        onPagePrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      />

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white transform transition-all duration-300 scale-95 animate-in">
            {/* Header with Vendor Avatar */}
            <div className="relative bg-gray-800 h-48 sm:h-56 flex items-center justify-center rounded-t-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-indigo-600 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg">
                  {selectedBooking.vendor.name.trim()
                    ? selectedBooking.vendor.name.trim()[0].toUpperCase()
                    : "?"}
                </div>
              </div>
              <button
                onClick={handleCloseDetails}
                className="absolute top-4 right-4 bg-gray-800/70 hover:bg-gray-700/70 rounded-full p-2 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                  {selectedBooking.service.serviceTitle}
                </h3>
                <p className="text-sm text-gray-200 drop-shadow-md capitalize">{selectedBooking.status}</p>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="text-white font-medium">
                        {new Date(selectedBooking.date[0]).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Client</p>
                      <p className="text-white font-medium">{selectedBooking.client.name.trim()}</p>
                      <p className="text-sm text-gray-300">{selectedBooking.client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Vendor</p>
                      <p className="text-white font-medium">{selectedBooking.vendor.name}</p>
                      <p className="text-sm text-gray-300">{selectedBooking.vendor.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-white font-medium">₹{selectedBooking.service.servicePrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p className="text-white font-medium">{selectedBooking.service.serviceDuration} hour(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={getStatusColor(selectedBooking.status) as any}
                      className={selectedBooking.isComplete ? "bg-green-600 text-white" : ""}
                    >
                      {selectedBooking.status}
                    </Badge>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-white font-medium">
                        {selectedBooking.isComplete ? "Completed" : selectedBooking.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-indigo-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Service Description</p>
                    <p className="text-white leading-relaxed">{selectedBooking.service.serviceDescription}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Booking ID</p>
                  <p className="text-white font-medium truncate">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <p className="text-gray-400">Payment Status</p>
                  <p className="text-white font-medium capitalize">{selectedBooking.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-gray-400">Vendor Approval</p>
                  <p className="text-white font-medium">{selectedBooking.vendorApproval}</p>
                </div>
                <div>
                  <p className="text-gray-400">Years of Experience</p>
                  <p className="text-white font-medium">{selectedBooking.service.yearsOfExperience}</p>
                </div>
                <div>
                  <p className="text-gray-400">Additional Hour Fee</p>
                  <p className="text-white font-medium">₹{selectedBooking.service.additionalHourFee}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created At</p>
                  <p className="text-white font-medium">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
                {selectedBooking.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-gray-400">Rejection Reason</p>
                    <p className="text-white font-medium">{selectedBooking.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 sm:p-8 bg-gray-800/50 border-t border-gray-800 flex justify-end gap-4">
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                onClick={handleCloseDetails}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}