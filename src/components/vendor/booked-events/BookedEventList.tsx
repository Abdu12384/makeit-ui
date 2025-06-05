
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookedEventDetails } from "./BookedEventDetails"
import { useGetAllEventsByVendorIdMutation } from "@/hooks/VendorCustomHooks"

// Sample event data - in a real app, this would come from an API or props
const events = [
  {
    id: "evt-001",
    title: "Tech Conference 2023",
    description: "Annual tech conference featuring the latest innovations",
    fullDescription:
      "Join us for the annual Tech Conference 2023, where industry leaders and innovators gather to showcase the latest technological advancements. This year's conference will feature keynote speeches, interactive workshops, and networking opportunities with professionals from around the globe.",
    date: "2023-11-15",
    time: "9:00 AM - 6:00 PM",
    location: "Convention Center, New York",
    imageUrl: "/placeholder.svg?height=600&width=600",
    organizer: "Tech Events Inc.",
    category: "Technology",
    capacity: 500,
    attendeeCount: 423,
    checkedInCount: 387,
    status: "active",
    additionalInfo: "Please bring your ID for check-in. Wi-Fi will be provided.",
  },
  {
    id: "evt-002",
    title: "Music Festival Summer Vibes",
    description: "Three days of music, art, and entertainment",
    date: "2023-07-20",
    time: "12:00 PM - 11:00 PM",
    location: "Central Park, Los Angeles",
    imageUrl: "/placeholder.svg?height=600&width=600",
    organizer: "Festival Productions",
    category: "Entertainment",
    capacity: 2000,
    attendeeCount: 1850,
    status: "completed",
  },
  {
    id: "evt-003",
    title: "Business Leadership Summit",
    description: "Connect with business leaders and learn new strategies",
    date: "2023-09-05",
    time: "10:00 AM - 4:00 PM",
    location: "Grand Hotel, Chicago",
    imageUrl: "/placeholder.svg?height=600&width=600",
    organizer: "Business Network Association",
    category: "Business",
    capacity: 300,
    attendeeCount: 275,
    status: "active",
  },
  {
    id: "evt-004",
    title: "Wellness Retreat Weekend",
    description: "Rejuvenate your mind, body, and soul",
    date: "2023-08-12",
    time: "All Day",
    location: "Mountain Resort, Colorado",
    imageUrl: "/placeholder.svg?height=600&width=600",
    organizer: "Wellness Collective",
    category: "Health",
    capacity: 100,
    attendeeCount: 87,
    status: "active",
  },
  {
    id: "evt-005",
    title: "Food & Wine Festival",
    description: "Taste the finest cuisines and wines from around the world",
    date: "2023-10-08",
    time: "11:00 AM - 8:00 PM",
    location: "Waterfront Park, San Francisco",
    imageUrl: "/placeholder.svg?height=600&width=600",
    organizer: "Culinary Arts Association",
    category: "Food & Drink",
    capacity: 1500,
    attendeeCount: 1342,
    status: "active",
  },
  {
    id: "evt-006",
    title: "Startup Pitch Competition",
    description: "Innovative startups compete for funding and recognition",
    date: "2023-11-30",
    time: "1:00 PM - 7:00 PM",
    location: "Innovation Hub, Austin",
    imageUrl: "/placeholder.svg?height=600&width=600",
    organizer: "Venture Capital Partners",
    category: "Business",
    capacity: 200,
    attendeeCount: 178,
    status: "active",
  },
]

export function BookedEventsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [events,setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)


  const getAllEventsMutation = useGetAllEventsByVendorIdMutation()


  useEffect(() => {
    getAllEventsMutation.mutate(
      {
      page: 1,
      limit: 10,
    },
    {
      onSuccess:(data)=>{
        console.log('event',data)
        setEvents(data.events.events)
      },
      onError:(error)=>{
        console.log(error)
      }
    }
  )
  }, [])



  const filteredEvents = events?.filter((event) => {
    const matchesSearch =
      event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event?.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus ? event?.status === filterStatus : true

    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedEvent ? (
        <BookedEventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Events</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
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
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div key={event._id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
                    {event?.posterImage && (
                      <img
                        src={event?.posterImage[0]}
                        alt={event?.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={event.status === "active" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{event?.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event?.date[0]}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event?.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(event?.date[0]).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>

                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event?.attendeeCount} attendees</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button onClick={() => setSelectedEvent(event)} className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}