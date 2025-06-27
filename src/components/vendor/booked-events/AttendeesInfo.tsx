import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Search,
  Mail,
  Phone,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  CreditCard,
  X,
  Clock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import { useGetAttendeesByIdMutation } from "@/hooks/VendorCustomHooks"
import { AvatarImage } from "@radix-ui/react-avatar"




export default function AttendeesList() {

  const { eventId } = useParams<{ eventId: string }>()
  const [searchQuery, setSearchQuery] = useState("")
  const [attendees, setAttendees] = useState<any>([])
  const [filterStatus, _setFilterStatus] = useState<string | null>(null)
  const [selectedAttendee, setSelectedAttendee] = useState<any | null>(null)
  const getAttendeesByIdMutation = useGetAttendeesByIdMutation()

  console.log(eventId)



  useEffect(() => {

    getAttendeesByIdMutation.mutate(
      eventId!,
      {
        onSuccess: (data) => {
          console.log('attendees',data)
          setAttendees(data.attendees)

        },
        onError: (err) => {
          console.log(err)
        }
      }
    )
     
  }, [eventId])

  const filteredAttendees = attendees.filter((attendee:any) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus ? attendee.status === filterStatus : true

    return matchesSearch && matchesFilter
  })


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
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (checkedIn: string) => {
    switch (checkedIn) {
      case "checked_in":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Checked In
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }
  

  // Attendee Details Component (embedded)
  const AttendeeDetails = ({ attendee, onClose }: { attendee: any; onClose: () => void }) => {
    console.log('attendee in the datails',attendee)
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
              {attendee.profileImage ? (
                <img src={attendee.profileImage || "/placeholder.svg"} alt={attendee.name} />
              ) : (
                <AvatarFallback className="text-lg">{getInitials(attendee.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{attendee.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-white/30 hover:bg-white/40 text-white">{attendee.ticketType}</Badge>
                {attendee?.ticket?.checkedIn === "checked_in" ? (
                  <Badge className="bg-green-500/80 hover:bg-green-500/90 text-white">Checked In</Badge>
                ) : attendee?.ticket?.checkedIn === "cancelled" ? (
                  <Badge className="bg-red-500/80 hover:bg-red-500/90 text-white">Cancelled</Badge>
                ) : (
                  <Badge className="bg-yellow-500/80 hover:bg-yellow-500/90 text-white">Not Checked In</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ticket">Ticket</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>{attendee.email}</span>
                    </div>
                    {attendee.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>{attendee.phone}</span>
                      </div>
                    )}
                    {attendee.address && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>{attendee.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>{event ? formatDate(event.date) : "Unknown date"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>{event?.time || "Unknown time"}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>{event?.location || "Unknown location"}</span>
                  </div>
                  <div className="flex items-center">
                    <Ticket className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="font-mono">{attendee.ticketId}</span>
                  </div>
                </div>
              </div> */}

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Check-in Status</h3>
                <div className="p-4 rounded-lg bg-muted/50">
                  {attendee?.ticket?.checkedIn === "checked_in" ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-6 w-6 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Checked In</p>
                        {/* <p className="text-sm text-muted-foreground">
                          {attendee.ticket.checkedInTime} • {attendee.ticket.checkedInBy || "Self check-in"}
                        </p> */}
                      </div>
                    </div>
                  ) : attendee?.ticket?.checkedIn === "cancelled" ? (
                    <div className="flex items-center">
                      <XCircle className="h-6 w-6 mr-3 text-red-500" />
                      <div>
                        <p className="font-medium">Cancelled</p>
                        {/* <p className="text-sm text-muted-foreground">
                          {attendee.cancellationReason || "No reason provided"}
                        </p> */}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-6 w-6 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Not checked in</p>
                        <p className="text-sm text-muted-foreground">Attendee has not checked in yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ticket">
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      {/* <h3 className="text-xl font-bold">{event?.title || "Event"}</h3>
                      <p className="text-muted-foreground">{formatDate(event?.date || "")}</p> */}
                    </div>
                    </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Attendee</p>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{attendee.email}</p>
                    </div>

                    {/* <div>
                      <p className="text-sm text-muted-foreground">Ticket ID</p>
                      <p className="font-mono">{attendee.ticket.ticketId}</p>
                    </div> */}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="h-48 w-48 bg-white flex items-center justify-center">
                        {/* This would be a QR code in a real app */}
                        <Ticket className="h-24 w-24 text-muted-foreground" />
                      </div>
                      <p className="text-center mt-2 text-sm text-muted-foreground">Scan to check in</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Purchased on {attendee.purchaseDate || "Unknown date"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ticket Count</span>
                      <span>{attendee?.ticket?.ticketCount || "0"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>₹{attendee?.ticket?.totalAmount || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activity History</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium">Ticket purchased</p>
                        {/* <p className="text-sm text-muted-foreground">{attendee.purchaseDate || "May 15, 2023"}</p> */}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Purchased {attendee.ticketType} ticket for ₹{attendee?.ticket?.totalAmount }
                      </p>
                    </div>
                  </div>

                  {attendee?.ticket?.checkedIn === "checked-in" && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">Checked in to event</p>
                          <p className="text-sm text-muted-foreground">{attendee?.ticket?.checkedInTime}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Checked in by {attendee?.ticket?.checkedInBy || "Self check-in"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    )
  }


  

  const AttendeeCard = ({ attendee, onClick }: { attendee: any; onClick: () => void }) => {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full"
      >
        <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-0">
            <div className="flex items-center p-4 gap-4" onClick={onClick}>
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <Avatar className="h-14 w-14 ring-2 ring-gray-100">
                  <AvatarImage src={attendee?.profileImage || "/placeholder.svg?height=56&width=56"} alt={attendee.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(attendee?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
  
              {/* Main Content */}
              <div className="flex-grow min-w-0">
                {/* Name and Status Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{attendee.name}</h3>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(attendee?.ticket?.checkedIn)} flex-shrink-0`} />
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(attendee?.ticket?.checkedIn)}</div>
                </div>
  
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{attendee.email}</span>
                  </div>
                  {attendee.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{attendee.phone}</span>
                    </div>
                  )}
                </div>
  
                {/* Ticket and Status Information */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{attendee.ticketId}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    {attendee?.ticket?.checkedIn === "checked_in" && attendee?.ticket?.checkedInTime ? (
                      <span>Checked in at {attendee?.ticket?.checkedInTime}</span>
                    ) : attendee?.ticket?.checkedIn === "cancelled" ? (
                      <span className="text-red-600">Registration cancelled</span>
                    ) : (
                      <span>Awaiting check-in</span>
                    )}
                  </div>
                </div>
              </div>
  
              {/* Action Buttons */}
              <div className="flex-shrink-0 flex items-center gap-2">
          
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedAttendee ? (
        <AttendeeDetails attendee={selectedAttendee} onClose={() => setSelectedAttendee(null)} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => window.location.href = "/vendor/booked-events"} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Attendees</h1>
              <p className="text-muted-foreground">
                {/* {event?.title || "Event"} • {filteredAttendees.length} attendees */}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or ticket ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {filterStatus ? `Filter: ${filterStatus}` : "Filter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("checked_in")}>Checked In</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("not-checked-in")}>Not Checked In</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAttendees.map((attendee: any) => (
              <AttendeeCard key={attendee.userId} attendee={attendee} onClick={() => setSelectedAttendee(attendee)} />
            ))}

            {filteredAttendees.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">No attendees found matching your criteria.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
