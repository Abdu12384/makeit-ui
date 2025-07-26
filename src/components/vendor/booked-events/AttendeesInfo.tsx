// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import {
//   ChevronLeft,
//   Mail,
//   Phone,
//   Ticket,
//   Calendar,
//   MapPin,
//   CheckCircle2,
//   XCircle,
//   CreditCard,
//   X,
//   Clock,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useParams } from "react-router-dom"
// import { useGetAttendeesByIdMutation } from "@/hooks/VendorCustomHooks"
// import { AvatarImage } from "@radix-ui/react-avatar"
// import { Attendee } from "@/types/attendees"



// export default function AttendeesList() {

//   const { eventId } = useParams<{ eventId: string }>()
//   const [searchQuery, _setSearchQuery] = useState("")
//   const [attendees, setAttendees] = useState<Attendee[]>([])
//   const [filterStatus, _setFilterStatus] = useState<string | null>(null)
//   const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
//   const getAttendeesByIdMutation = useGetAttendeesByIdMutation()

//   console.log(eventId)



//   useEffect(() => {

//     getAttendeesByIdMutation.mutate(
//       eventId!,
//       {
//         onSuccess: (data) => {
//           console.log('attendees',data)
//           setAttendees(data.attendees)

//         },
//         onError: (err) => {
//           console.log(err)
//         }
//       }
//     )
     
//   }, [eventId])

//   const filteredAttendees = attendees.filter((attendee:Attendee) => {
//     const matchesSearch =
//       attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       attendee.ticketId.toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesFilter = filterStatus ? attendee.status === filterStatus : true

//     return matchesSearch && matchesFilter
//   })


//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "checked_in":
//         return "bg-green-500"
//       case "pending":
//         return "bg-yellow-500"
//       case "cancelled":
//         return "bg-red-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const getStatusBadge = (checkedIn: string) => {
//     switch (checkedIn) {
//       case "checked_in":
//         return (
//           <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
//             <CheckCircle2 className="h-3 w-3 mr-1" />
//             Checked In
//           </Badge>
//         )
//       case "cancelled":
//         return (
//           <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
//             <XCircle className="h-3 w-3 mr-1" />
//             Cancelled
//           </Badge>
//         )
//       case "pending":
//       default:
//         return (
//           <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
//             <Clock className="h-3 w-3 mr-1" />
//             Pending
//           </Badge>
//         )
//     }
//   }
  

//   // Attendee Details Component (embedded)
//   const AttendeeDetails = ({ attendee, onClose }: { attendee: Attendee; onClose: () => void }) => {
//     console.log('attendee in the datails',attendee)
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         transition={{ duration: 0.3 }}
//         className="bg-card rounded-xl shadow-lg overflow-hidden"
//       >
//         <div className="relative p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full"
//             onClick={onClose}
//           >
//             <X className="h-5 w-5" />
//           </Button>

//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16 border-2 border-white">
//               {attendee.profileImage ? (
//                 <img src={attendee.profileImage || "/placeholder.svg"} alt={attendee.name} />
//               ) : (
//                 <AvatarFallback className="text-lg">{getInitials(attendee.name)}</AvatarFallback>
//               )}
//             </Avatar>
//             <div>
//               <h2 className="text-2xl font-bold">{attendee.name}</h2>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge className="bg-white/30 hover:bg-white/40 text-white">{attendee.ticketType}</Badge>
//                 {attendee?.ticket?.checkedIn === "checked_in" ? (
//                   <Badge className="bg-green-500/80 hover:bg-green-500/90 text-white">Checked In</Badge>
//                 ) : attendee?.ticket?.checkedIn === "cancelled" ? (
//                   <Badge className="bg-red-500/80 hover:bg-red-500/90 text-white">Cancelled</Badge>
//                 ) : (
//                   <Badge className="bg-yellow-500/80 hover:bg-yellow-500/90 text-white">Not Checked In</Badge>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <Tabs defaultValue="details">
//             <TabsList className="mb-6">
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="ticket">Ticket</TabsTrigger>
//               <TabsTrigger value="history">History</TabsTrigger>
//             </TabsList>

//             <TabsContent value="details" className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Contact Information</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
//                       <span>{attendee.email}</span>
//                     </div>
//                     {attendee.phone && (
//                       <div className="flex items-center">
//                         <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
//                         <span>{attendee.phone}</span>
//                       </div>
//                     )}
//                     {attendee.address && (
//                       <div className="flex items-center">
//                         <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
//                         <span>{attendee.address}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Check-in Status</h3>
//                 <div className="p-4 rounded-lg bg-muted/50">
//                   {attendee?.ticket?.checkedIn === "checked_in" ? (
//                     <div className="flex items-center">
//                       <CheckCircle2 className="h-6 w-6 mr-3 text-green-500" />
//                       <div>
//                         <p className="font-medium">Checked In</p>
//                       </div>
//                     </div>
//                   ) : attendee?.ticket?.checkedIn === "cancelled" ? (
//                     <div className="flex items-center">
//                       <XCircle className="h-6 w-6 mr-3 text-red-500" />
//                       <div>
//                         <p className="font-medium">Cancelled</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <CheckCircle2 className="h-6 w-6 mr-3 text-muted-foreground" />
//                       <div>
//                         <p className="font-medium">Not checked in</p>
//                         <p className="text-sm text-muted-foreground">Attendee has not checked in yet</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="ticket">
//               <div className="space-y-6">
//                 <div className="p-6 border rounded-lg">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                     </div>
//                     </div>

//                   <Separator className="my-6" />

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Attendee</p>
//                       <p className="font-medium">{attendee.name}</p>
//                       <p className="text-sm text-muted-foreground mt-1">{attendee.email}</p>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex justify-center">
//                     <div className="p-4 bg-muted rounded-lg">
//                       <div className="h-48 w-48 bg-white flex items-center justify-center">
//                         <Ticket className="h-24 w-24 text-muted-foreground" />
//                       </div>
//                       <p className="text-center mt-2 text-sm text-muted-foreground">Scan to check in</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Payment Information</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
//                       <span>Purchased on {attendee.purchaseDate || "Unknown date"}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Ticket Count</span>
//                       <span>{attendee?.ticket?.ticketCount || "0"}</span>
//                     </div>
//                     <Separator />
//                     <div className="flex justify-between items-center font-medium">
//                       <span>Total</span>
//                       <span>₹{attendee?.ticket?.totalAmount || "0.00"}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="history">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Activity History</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3 pb-4 border-b">
//                     <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
//                       <CreditCard className="h-4 w-4" />
//                     </div>
//                     <div className="flex-grow">
//                       <div className="flex justify-between">
//                         <p className="font-medium">Ticket purchased</p>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Purchased {attendee.ticketType} ticket for ₹{attendee?.ticket?.totalAmount }
//                       </p>
//                     </div>
//                   </div>

//                   {attendee?.ticket?.checkedIn === "checked-in" && (
//                     <div className="flex items-start gap-3 pb-4 border-b">
//                       <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
//                         <CheckCircle2 className="h-4 w-4" />
//                       </div>
//                       <div className="flex-grow">
//                         <div className="flex justify-between">
//                           <p className="font-medium">Checked in to event</p>
//                           <p className="text-sm text-muted-foreground">{attendee?.ticket?.checkedInTime}</p>
//                         </div>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Checked in by {attendee?.ticket?.checkedInBy || "Self check-in"}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </motion.div>
//     )
//   }


  

//   const AttendeeCard = ({ attendee, onClick }: { attendee: Attendee; onClick: () => void }) => {
//     console.log('attendee',attendee)
//     return (
//       <motion.div
//         whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
//         transition={{ type: "spring", stiffness: 300, damping: 20 }}
//         className="w-full"
//       >
//         <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group">
//           <CardContent className="p-0">
//             <div className="flex items-center p-4 gap-4" onClick={onClick}>
//               {/* Avatar Section */}
//               <div className="flex-shrink-0">
//                 <Avatar className="h-14 w-14 ring-2 ring-gray-100">
//                   <AvatarImage src={attendee?.profileImage || "/placeholder.svg?height=56&width=56"} alt={attendee.name} />
//                   <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
//                     {getInitials(attendee?.name)}
//                   </AvatarFallback>
//                 </Avatar>
//               </div>
  
//               {/* Main Content */}
//               <div className="flex-grow min-w-0">
//                 {/* Name and Status Row */}
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-3">
//                     <h3 className="font-semibold text-gray-900 text-lg truncate">{attendee.name}</h3>
//                     <div className={`h-2 w-2 rounded-full ${getStatusColor(attendee?.ticket?.checkedIn!)} flex-shrink-0`} />
//                   </div>
//                   <div className="flex items-center gap-2">{getStatusBadge(attendee?.ticket?.checkedIn!)}</div>
//                 </div>
  
//                 {/* Contact Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
//                     <span className="truncate">{attendee.email}</span>
//                   </div>
//                   {attendee.phone && (
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
//                       <span>{attendee.phone}</span>
//                     </div>
//                   )}
//                 </div>
  
//                 {/* Ticket and Status Information */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <Ticket className="h-4 w-4 mr-1 text-gray-400" />
//                       <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{attendee.ticketId}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-500">
//                     {attendee?.ticket?.checkedIn === "checked_in" ? (
//                       <span>Checked in at {attendee?.ticket?.checkedInTime}</span>
//                     ) : attendee?.ticket?.checkedIn === "cancelled" ? (
//                       <span className="text-red-600">Registration cancelled</span>
//                     ) : (
//                       <span>Awaiting check-in</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
  
//               {/* Action Buttons */}
//               <div className="flex-shrink-0 flex items-center gap-2">
          
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {selectedAttendee ? (
//         <AttendeeDetails attendee={selectedAttendee} onClose={() => setSelectedAttendee(null)} />
//       ) : (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//           <div className="flex items-center mb-6">
//             <Button variant="ghost" size="icon" onClick={() => window.location.href = "/vendor/booked-events"} className="mr-2">
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold">Attendees</h1>
//               <p className="text-muted-foreground">
//                 {/* {event?.title || "Event"} • {filteredAttendees.length} attendees */}
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 gap-4">
//             {filteredAttendees.map((attendee: Attendee) => (
//               <AttendeeCard key={attendee.userId} attendee={attendee} onClick={() => setSelectedAttendee(attendee)} />
//             ))}

//             {filteredAttendees.length === 0 && (
//               <div className="col-span-full py-12 text-center">
//                 <p className="text-muted-foreground">No attendees found.</p>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Mail,
  Phone,
  Ticket,
  MapPin,
  CheckCircle2,
  XCircle,
  CreditCard,
  X,
  Clock,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import type { ITicket } from "@/types/ticket"
import { useGetAttendeesByIdMutation } from "@/hooks/VendorCustomHooks"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"
import { Pagination1 } from "@/components/common/paginations/Pagination"

export default function TicketsList() {
  const { eventId } = useParams<{ eventId: string }>()
  const [tickets, setTickets] = useState<ITicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10


  const getAttendeesByIdMutation = useGetAttendeesByIdMutation()

  
    useEffect(() => {
  
      getAttendeesByIdMutation.mutate(
        {
          eventId:eventId!,
          page:currentPage,
          limit:limit
        },
        {
          onSuccess: (data) => {
            setTickets(data.attendees.clients)
            setTotalPages(data.attendees.total)
          },
          onError: (err) => {
            console.log(err)
          }
        }
      )
       
    }, [eventId,currentPage])


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked_in":
      case "successfull": // For payment status
      case "used": // For ticket status
        return "bg-green-500"
      case "pending":
      case "unused": // For ticket status
        return "bg-yellow-500"
      case "cancelled":
      case "failed": // For payment status
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked_in":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Checked In
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "successfull":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            <IndianRupee className="h-3 w-3 mr-1" /> Paid
          </Badge>
        )
      case "unused":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
            <Ticket className="h-3 w-3 mr-1" /> Unused
          </Badge>
        )
      case "used":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            <Ticket className="h-3 w-3 mr-1" /> Used
          </Badge>
        )
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50">Status Unknown</Badge>
    }
  }

  // Ticket Details Component (embedded)
  const TicketDetails = ({ ticket, onClose }: { ticket: ITicket; onClose: () => void }) => {
    const client = ticket.client // Access the nested client object

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              {client?.profileImage ? (
                <AvatarImage src={CLOUDINARY_BASE_URL + client.profileImage || "/placeholder.svg"} alt={client.name || "Client"} />
              ) : (
                <AvatarFallback className="text-lg">{getInitials(client?.name || "Unknown")}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{client?.name || "Unknown Client"}</h2>
              <div className="flex items-center gap-2 mt-1">
                {/* Removed Badge for ticketType as it's always "Standard" */}
                {getStatusBadge(ticket.checkedIn || ticket.ticketStatus || "pending")}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Client Details</TabsTrigger>
              <TabsTrigger value="ticket">Ticket Details</TabsTrigger>
              <TabsTrigger value="history">Ticket History</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>{client?.email || "N/A"}</span>
                    </div>
                    {client?.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client?.userId && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>Client ID: {client.userId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </TabsContent>
            <TabsContent value="ticket">
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-semibold">Ticket ID: {ticket.ticketId || "N/A"}</h4>
                      {/* Removed display of ticketType here */}
                    </div>
                    {getStatusBadge(ticket.ticketStatus || "pending")}
                  </div>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Count</p>
                      <p className="font-medium">{ticket.ticketCount || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">₹{ticket.totalAmount?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Date</p>
                      <p className="font-medium">{new Date(ticket?.createdAt!).toLocaleDateString() || "Unknown date"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="font-medium">{ticket.paymentStatus || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="h-48 w-48 bg-white flex items-center justify-center">
                        {ticket?.qrCodeLink ? (
                          <img
                            src={ticket.qrCodeLink || "/placeholder.svg"}
                            alt={`QR Code for ${ticket.ticketId}`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Ticket className="h-24 w-24 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-center mt-2 text-sm text-muted-foreground">Scan to check in</p>
                      <p className="text-center mt-1 text-xs text-muted-foreground">
                        Ticket ID: {ticket?.ticketId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activity History for Ticket {ticket.ticketId}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium">Ticket purchased</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ticket?.createdAt!).toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Purchased ticket for ₹{ticket?.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                  {ticket?.checkedIn === "checked_in" && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">Checked in to event</p>
                          <p className="text-sm text-muted-foreground">{ticket?.checkedInTime || "N/A"}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Checked in by {ticket?.checkedInBy || "Self check-in"}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Add more history items based on ticketStatus changes, payment status, etc. */}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    )
  }

  const TicketCard = ({ ticket, onClick }: { ticket: ITicket; onClick: () => void }) => {
    const client = ticket?.client // Access the nested client object

    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full"
      >
        <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-0">
            <div className="flex items-center p-4 gap-4" onClick={onClick}>
              {/* Client Avatar Section */}
              <div className="flex-shrink-0">
                <Avatar className="h-14 w-14 ring-2 ring-gray-100">
                  <AvatarImage
                    src={CLOUDINARY_BASE_URL + client?.profileImage || "/placeholder.svg?height=56&width=56"}
                    alt={client?.name || "Client"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(client?.name || "Unknown")}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Main Content */}
              <div className="flex-grow min-w-0">
                {/* Ticket ID and Status Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">Ticket: {ticket.ticketId}</h3>
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(ticket.checkedIn || ticket.ticketStatus || "pending")} flex-shrink-0`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(ticket.checkedIn || ticket.ticketStatus || "pending")}
                  </div>
                </div>
                {/* Client and Ticket Type Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{client?.email || "N/A"}</span>
                  </div>
                  {/* Removed display of ticketType here */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span>{client?.phone || "N/A"}</span>
                  </div>
                </div>
                {/* Payment Status and Total Amount */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        ₹{ticket?.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Payment: {ticket?.paymentStatus || "N/A"}</span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex-shrink-0 flex items-center gap-2"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedTicket ? (
        <TicketDetails ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (window.location.href = "/vendor/booked-events")}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Tickets</h1>
              <p className="text-muted-foreground">{tickets.length} tickets found</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {tickets?.map((ticket: ITicket) => (
              <TicketCard key={ticket._id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
            ))}
            {tickets?.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">No tickets found.</p>
              </div>
            )}
          </div>
          <Pagination1
          currentPage={currentPage}
          totalPages={totalPages}
          onPagePrev={() => setCurrentPage(currentPage - 1)}
          onPageNext={() => setCurrentPage(currentPage + 1)}
        />
        </motion.div>
      )}
    </div>
  )
}
