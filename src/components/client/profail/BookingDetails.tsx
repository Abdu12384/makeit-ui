"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Tag,
  Building,
  Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle } from "lucide-react";
import BookingPayment from "./BookingPayment"
import ReviewForm from "@/components/common/review/review-form"
import { Link } from "react-router-dom";
import { useCancelBookingMutation } from "@/hooks/ClientCustomHooks";
import { ConfirmationButton } from "@/components/common/customButtons/ConfirmButton"
import toast from "react-hot-toast"


export type Booking = {
  _id?: string
  bookingId: string
  title?: string
  serviceTitle?: string
  serviceId?:string
  date: string
  time?: string
  client: {
    name: string
    email: string
    phone: string
    avatar?: string
  }
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  email: string
  phone: string
  vendor: {
    name: string
    email: string
    userId: string
    profileImage?: string
  }
  paymentStatus: "Pending" | "Successfull" | "Failed"
  price?: number
  serviceType?: string
  vendorApproval?: "Pending" | "Approved" | "Rejected"
  service?: {
    serviceTitle?: string
    servicePrice?: number
    serviceDescription?: string
    serviceDuration?: number
    yearsOfExperience?: number
    additionalHourFee?: number
  }

}

interface BookingDetailsProps {
  booking: Booking
  onBack: () => void
}

export default function BookingDetails({ booking, onBack }: BookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [_activeTab, setActiveTab] = useState("details")
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false)
  const cancelBookingMutation = useCancelBookingMutation()
  const reviewFormRef = useRef<HTMLDivElement>(null)

  console.log('booking', booking)
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Fill in missing data with defaults for demo
  const enhancedBooking: Booking = {
    ...booking,
    serviceTitle: booking.service?.serviceTitle || "Professional Consultation",
    time: booking.time || "10:00 AM - 11:30 AM",
    price: booking.price || 150,
    vendorApproval: booking.vendorApproval ?? "Pending",
    client: {
      ...booking.client,
      avatar: booking.client?.avatar || undefined,
    },
    vendor: {
      ...booking.vendor,
      profileImage: booking.vendor?.profileImage || undefined,
    },
    service: {
      ...booking?.service,
    },
  }

  const handlePayNow = () => {
    setOpenPaymentDialog(true)
  }



  const handleCancelBooking = (bookingId: string) => {
    cancelBookingMutation.mutate(
      bookingId,
      {
      onSuccess: (data) => {
        console.log('booking cancelled successfully',data)
        toast.success(data.message)
        onBack()
      },
      onError: (error) => {
        console.log('error while cancel booking',error)
        toast.error(error.message)
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30"
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getVendorApprovalColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getVendorApprovalIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const SkeletonLoader = () => (
    <div className="w-full max-w-5xl mx-auto">
      <div className="h-10 w-40 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
      <Card className="animate-pulse overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-1/2 rounded bg-gray-200"></div>
            <div className="h-6 w-24 rounded-full bg-gray-200"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-20 rounded-lg bg-gray-200"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-3 h-6 w-6 rounded-full bg-gray-200"></div>
                  <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-3 h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3">
            <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 max-w-5xl"
    >
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Booking Details</h1>
          </div>

          <div className="grid gap-6">
            {/* Header Card */}
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                      {enhancedBooking.serviceTitle}
                    </h2>
                    <p className="text-indigo-700 dark:text-indigo-400 font-medium">
                      Booking ID: {enhancedBooking?.bookingId?.slice(0,18)}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium ${getStatusColor(
                          enhancedBooking.status,
                        )}`}
                      >
                        {getStatusIcon(enhancedBooking.status)}
                        <span>Status: {enhancedBooking.status}</span>
                      </Badge>

                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium ${getPaymentStatusColor(
                          enhancedBooking.paymentStatus,
                        )}`}
                      >
                        {getPaymentStatusIcon(enhancedBooking.paymentStatus)}
                        <span>Payment: {enhancedBooking.paymentStatus}</span>
                      </Badge>

                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium ${getVendorApprovalColor(
                          enhancedBooking.vendorApproval || "",
                        )}`}
                      >
                        {getVendorApprovalIcon(enhancedBooking.vendorApproval || "")}
                        <span>Vendor: {enhancedBooking.vendorApproval}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{enhancedBooking?.service?.servicePrice?.toFixed(2)}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Service Fee</p>

                    {/* {enhancedBooking.paymentStatus === "Pending" && (
                      <Button
                        onClick={handlePayNow}
                        className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
                        size="sm"
                      >
                        <CreditCardIcon className="mr-2 h-4 w-4" /> Pay Now
                      </Button>
                    )} */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Booking Details</TabsTrigger>
                <TabsTrigger value="client">Client Info</TabsTrigger>
                <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 grid gap-6 md:grid-cols-3">
                    <div className="flex flex-col space-y-2 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                          <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                          <p className="font-medium">{enhancedBooking.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/50">
                          <Tag className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Type</p>
                          <p className="font-medium">{enhancedBooking?.service?.serviceTitle}</p>
                        </div>
                        
                      </div>
                      
                    </div>
                  {enhancedBooking.status !== "Completed" && enhancedBooking.status !== "Cancelled" && (
                  <div className="flex justify-end">
                    <ConfirmationButton
                      buttonText="Cancel Booking"
                      buttonType="danger"
                      confirmType="danger"
                      confirmTitle="Cancel Booking"
                      confirmMessage="Are you sure you want to cancel this booking? This action cannot be undone."
                      confirmText="Yes, Cancel"
                      cancelText="No, Go Back"
                      onConfirm={() => handleCancelBooking(enhancedBooking.bookingId)} // Only run after confirm
                    />
                  </div>
                )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="client" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center md:items-start gap-4 md:border-r md:pr-6 md:w-1/3">
                        <Avatar className="h-24 w-24 border-4 border-indigo-100 dark:border-indigo-900/30">
                          {enhancedBooking.client?.avatar ? (
                            <AvatarImage
                              src={enhancedBooking.client.avatar || "/placeholder.svg"}
                              alt={enhancedBooking.client?.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 text-2xl">
                              {enhancedBooking.client?.name?.charAt(0) || "C"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold">{enhancedBooking.client?.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400">Client</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                              <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                              <p className="font-medium break-all">{enhancedBooking.client?.email}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                              <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                              <p className="font-medium">{enhancedBooking.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <h4 className="font-medium mb-2">Previous Bookings</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            This client has 3 previous bookings with you.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendor" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center md:items-start gap-4 md:border-r md:pr-6 md:w-1/3">
                        <Avatar className="h-24 w-24 border-4 border-purple-100 dark:border-purple-900/30">
                          {enhancedBooking.vendor?.profileImage ? (
                            <AvatarImage
                              src={enhancedBooking.vendor.profileImage || "/placeholder.svg"}
                              alt={enhancedBooking.vendor?.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 text-2xl">
                              {enhancedBooking.vendor?.name?.charAt(0) || "V"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold">{enhancedBooking.vendor?.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400">Service Provider</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                              <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                              <p className="font-medium break-all">{enhancedBooking.vendor?.email}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                              <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor ID</p>
                              <p className="font-medium">{enhancedBooking.vendor?.userId}</p>
                            </div>
                          </div>
                          {enhancedBooking.vendor?.userId && (
                            <div className="mt-6">
                              <Link
                                to={`/client/chat/${enhancedBooking.vendor.userId}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                              >
                                <MessageCircle className="h-5 w-5" />
                                Chat with Vendor
                              </Link>
                            </div>
                          )}
                        </div>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

                  {booking?.status === "Completed" && booking?.paymentStatus === "Successfull" && (
                    <button
                      onClick={() => {
                        setIsReviewFormVisible(!isReviewFormVisible)
                        // Scroll to the form if opening it
                        if (!isReviewFormVisible) {
                          setTimeout(() => {
                            reviewFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                          }, 300) // Delay to match the animation duration of the form appearing
                        }
                      }}
                      className="flex items-center justify-center gap-2 w-full max-w-md mt-4 mx-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus size={20} />
                      {isReviewFormVisible ? "Hide Review Form" : "Add Your Review"}
                    </button>
                  )}
                  </motion.div>
                    <AnimatePresence>
                    {isReviewFormVisible && (
                      <motion.div
                        ref={reviewFormRef} // Attach the ref to the form container
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <ReviewForm
                          onSubmit={() => {
                            // handleSubmitReview(data)
                            setIsReviewFormVisible(false)
                          }}
                          isLoading={isLoading}
                          title="Share Your Experience"
                          subtitle="Your feedback helps us improve and helps others make informed decisions"
                          targetId={booking?.serviceId!}
                          targetType="service"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Actions Card */}
            <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-800/50">
              <CardContent className="p-6">
                <div className="flex flex-wrap justify-between gap-4">
                  <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Bookings
                  </Button>
                  <div className="flex flex-wrap gap-3">
                    {enhancedBooking.paymentStatus === "Pending" && enhancedBooking.status === "Completed" && (
                      <Button onClick={handlePayNow} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <CreditCard className="h-4 w-4" /> Pay Now
                      </Button>
                    )}
                    {enhancedBooking.status === "Confirmed" && (
                      <Button variant="destructive" className="gap-2">
                        <XCircle className="h-4 w-4" /> Cancel Booking
                      </Button>
                    )}
                    {enhancedBooking.status === "Completed" && enhancedBooking.paymentStatus === "Successfull" && (
                      <Button
                        variant="outline"
                        className="gap-2 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        <FileText className="h-4 w-4" /> Download Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
 
          {openPaymentDialog && (
            <div className="fixed inset-0 z-50 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl mx-4 md:mx-auto p-6 rounded-xl shadow-xl z-10">
                <BookingPayment booking={enhancedBooking} onClose={() => setOpenPaymentDialog(false)} />
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
