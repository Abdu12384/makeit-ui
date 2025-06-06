import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Search,
  Filter,
  Mail,
  Phone,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  User,
  CreditCard,
  FileText,
  MessageSquare,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "react-router-dom"
import { useGetAttendeesByIdMutation } from "@/hooks/VendorCustomHooks"




export function AttendeesList() {

  const { eventId } = useParams<{ eventId: string }>()
  const [searchQuery, setSearchQuery] = useState("")
  const [attendees, setAttendees] = useState<any>([])
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedAttendee, setSelectedAttendee] = useState<any | null>(null)
  const getAttendeesByIdMutation = useGetAttendeesByIdMutation()

  console.log(eventId)



  useEffect(() => {

    getAttendeesByIdMutation.mutate(
      eventId!,
      {
        onSuccess: (data) => {
          console.log(data)
          setAttendees(data.attendees)

        },
        onError: (err) => {
          console.log(err)
        }
      }
    )
     
  }, [eventId])





  // const event = mockEvents.find((e) => e.id === eventId)
  // const eventAttendees = attendees.filter((a) => a.eventId === eventId)

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
      case "checked-in":
        return "bg-green-500"
      case "not-checked-in":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Attendee Details Component (embedded)
  const AttendeeDetails = ({ attendee, onClose }: { attendee: any; onClose: () => void }) => {
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
                {attendee.status === "checked-in" ? (
                  <Badge className="bg-green-500/80 hover:bg-green-500/90 text-white">Checked In</Badge>
                ) : attendee.status === "cancelled" ? (
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

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="space-y-3">
                    {attendee.company && (
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>{attendee.company}</span>
                      </div>
                    )}
                    {attendee.jobTitle && (
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>{attendee.jobTitle}</span>
                      </div>
                    )}
                    {attendee.dietaryRequirements && (
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                        <span>
                          <strong className="block text-sm">Dietary Requirements:</strong>
                          {attendee.dietaryRequirements}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

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
                  {attendee.status === "checked-in" ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-6 w-6 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Checked in</p>
                        <p className="text-sm text-muted-foreground">
                          {attendee.checkedInTime} • {attendee.checkedInBy || "Self check-in"}
                        </p>
                      </div>
                    </div>
                  ) : attendee.status === "cancelled" ? (
                    <div className="flex items-center">
                      <XCircle className="h-6 w-6 mr-3 text-red-500" />
                      <div>
                        <p className="font-medium">Cancelled</p>
                        <p className="text-sm text-muted-foreground">
                          {attendee.cancellationReason || "No reason provided"}
                        </p>
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
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Ticket Type</p>
                      <p className="font-medium">{attendee.ticketType}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Attendee</p>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{attendee.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Ticket ID</p>
                      <p className="font-mono">{attendee.ticketId}</p>
                    </div>
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
                      <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>
                        {attendee.paymentMethod || "Credit Card"} •••• {attendee.lastFourDigits || "1234"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Purchased on {attendee.purchaseDate || "Unknown date"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ticket Price</span>
                      <span>${attendee.ticketPrice || "0.00"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Fees</span>
                      <span>${attendee.fees || "0.00"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>${attendee.totalPaid || "0.00"}</span>
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
                        <p className="text-sm text-muted-foreground">{attendee.purchaseDate || "May 15, 2023"}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Purchased {attendee.ticketType} ticket for ${attendee.totalPaid || "99.00"}
                      </p>
                    </div>
                  </div>

                  {attendee.status === "checked-in" && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">Checked in to event</p>
                          <p className="text-sm text-muted-foreground">{attendee.checkedInTime}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Checked in by {attendee.checkedInBy || "Self check-in"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {attendee.status !== "checked-in" && (
              <Button>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Check In
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Attendee Card Component (embedded)
  const AttendeeCard = ({ attendee, onClick }: { attendee: any; onClick: () => void }) => {
    return (
      <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="overflow-hidden h-full flex flex-col">
          <CardContent className="pt-6 flex-grow">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                {attendee.avatarUrl ? (
                  <img src={attendee.avatarUrl || "/placeholder.svg"} alt={attendee.name} />
                ) : (
                  <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{attendee.name}</h3>
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(attendee.status)}`} />
                </div>
                <Badge variant="outline" className="mt-1">
                  {attendee.ticketType}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{attendee.email}</span>
              </div>
              {attendee.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{attendee.phone}</span>
                </div>
              )}
              <div className="flex items-center">
                <Ticket className="h-4 w-4 mr-2" />
                <span className="font-mono text-xs">{attendee.ticketId}</span>
              </div>
              <div className="flex items-center">
                {attendee.status === "checked-in" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Checked in at {attendee.checkedInTime}</span>
                  </>
                ) : attendee.status === "cancelled" ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    <span>Cancelled</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Not checked in</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button onClick={onClick} variant="outline" className="w-full">
              View Details
            </Button>
          </CardFooter>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {filterStatus ? `Filter: ${filterStatus}` : "Filter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("checked-in")}>Checked In</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("not-checked-in")}>Not Checked In</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttendees.map((attendee: any) => (
              <AttendeeCard key={attendee.id} attendee={attendee} onClick={() => setSelectedAttendee(attendee)} />
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
