
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