"use client"

import { useEffect, useState } from "react"
import { Calendar, Eye, Filter, Search, X, MapPin, Clock, Ticket, Users, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetAllEventsMutation } from "@/hooks/AdminCustomHooks"
import { Pagination1 } from "@/components/common/paginations/Pagination"

// Event Type
interface Location {
  type: string
  coordinates: number[]
}

interface Event {
  _id: string
  eventId: string
  title: string
  category: string
  description: string
  venueName: string
  address: string
  location: Location
  date: string[]
  startTime: string
  endTime: string
  pricePerTicket: number
  totalTicket: number
  ticketPurchased: number
  maxTicketsPerUser: number
  posterImage: string[]
  hostedBy: string
  attendees: string[]
  attendeesCount: number
  status: string
  isActive: boolean
  createdAt: string
  __v: number
}

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const limit = 10

  const getAllEventsMutation = useGetAllEventsMutation()

  useEffect(() => {
    getAllEventsMutation.mutate(
      {
        page: currentPage,
        limit: limit,
      },
      {
        onSuccess: (data) => {
          console.log("Events data:", data)
          setEvents(data.events.events)
          setTotalPages(data.events.total)
        },
        onError: (error) => {
          console.error("Error fetching events:", error)
        },
      }
    )
  }, [searchQuery, currentPage])

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCloseDetails = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="grid gap-6 p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Event Management</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 transition-colors duration-200">
          <Calendar className="mr-2 h-4 w-4" />
          Add New Event
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Events</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your events, view details, and monitor attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search events by title, category, or venue..."
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
                  <TableHead className="text-gray-300 font-medium">Title</TableHead>
                  <TableHead className="text-gray-300 font-medium">Category</TableHead>
                  <TableHead className="text-gray-300 font-medium">Venue</TableHead>
                  <TableHead className="text-gray-300 font-medium">Time</TableHead>
                  <TableHead className="text-right text-gray-300 font-medium">Price</TableHead>
                  <TableHead className="text-center text-gray-300 font-medium">Tickets</TableHead>
                  <TableHead className="text-center text-gray-300 font-medium">Status</TableHead>
                  <TableHead className="text-right text-gray-300 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event._id} className="border-gray-800 hover:bg-gray-800/50 transition-colors duration-150">
                    <TableCell className="font-medium text-white">{event.title}</TableCell>
                    <TableCell className="text-gray-300">{event.category}</TableCell>
                    <TableCell className="text-gray-300">{event.venueName}</TableCell>
                    <TableCell className="text-gray-300">{`${event.startTime} - ${event.endTime}`}</TableCell>
                    <TableCell className="text-right text-gray-300">₹{event.pricePerTicket}</TableCell>
                    <TableCell className="text-center text-gray-300">
                      {event.ticketPurchased}/{event.totalTicket}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={event.isActive ? "default" : "secondary"}
                        className={event.isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-700 text-gray-300"}
                      >
                        {event.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-800 border-gray-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-colors duration-200"
                        onClick={() => handleViewDetails(event)}
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

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white transform transition-all duration-300 scale-95 animate-in">
            {/* Header with Poster */}
            <div className="relative">
              <img
                src={
                  selectedEvent.posterImage[0] ||
                  "/placeholder.svg?height=200&width=800&text=Event+Poster"
                }
                alt={`${selectedEvent.title} Poster`}
                className="w-full h-48 sm:h-56 object-cover rounded-t-2xl"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=200&width=800&text=Event+Poster"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
              <button
                onClick={handleCloseDetails}
                className="absolute top-4 right-4 bg-gray-800/70 hover:bg-gray-700/70 rounded-full p-2 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-200 drop-shadow-md capitalize">{selectedEvent.category}</p>
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
                      <p className="text-white font-medium">{selectedEvent.date.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p className="text-white font-medium">{`${selectedEvent.startTime} - ${selectedEvent.endTime}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-indigo-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Venue</p>
                      <p className="text-white font-medium">{selectedEvent.venueName}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{selectedEvent.address}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-white font-medium">₹{selectedEvent.pricePerTicket}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Tickets Sold</p>
                      <p className="text-white font-medium">{selectedEvent.ticketPurchased}/{selectedEvent.totalTicket}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={selectedEvent.isActive ? "default" : "secondary"}
                      className={selectedEvent.isActive ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}
                    >
                      {selectedEvent.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-white font-medium capitalize">{selectedEvent.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-indigo-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-white leading-relaxed">{selectedEvent.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Event ID</p>
                  <p className="text-white font-medium truncate">{selectedEvent.eventId}</p>
                </div>
                <div>
                  <p className="text-gray-400">Hosted By</p>
                  <p className="text-white font-medium truncate">{selectedEvent.hostedBy}</p>
                </div>
                <div>
                  <p className="text-gray-400">Max Tickets per User</p>
                  <p className="text-white font-medium">{selectedEvent.maxTicketsPerUser}</p>
                </div>
                <div>
                  <p className="text-gray-400">Attendees</p>
                  <p className="text-white font-medium">{selectedEvent.attendeesCount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created At</p>
                  <p className="text-white font-medium">{new Date(selectedEvent.createdAt).toLocaleString()}</p>
                </div>
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