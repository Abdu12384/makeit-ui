
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookedEventDetails } from "./BookedEventDetails"
import { useGetAllEventsByVendorIdMutation } from "@/hooks/VendorCustomHooks"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"
import { Event } from "@/types/event"
import { Pagination1 } from "@/components/common/paginations/Pagination"


export default function BookedEventsList() {
  const [events,setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentPage , setCurrentPage] = useState(1)
  const [totalPage , setTotalPages] = useState(1)
  let limit = 10


  const getAllEventsMutation = useGetAllEventsByVendorIdMutation()


  useEffect(() => {
    getAllEventsMutation.mutate(
      {
      page: currentPage,
      limit: limit,
    },
    {
      onSuccess:(data)=>{
        setEvents(data.events.events)
        setTotalPages(data.events.total)
      },
      onError:(error)=>{
        console.log(error)
      }
    }
  )
  }, [currentPage])


  const filteredEvents = events?.filter((event) => {
    const matchesFilter = event.status === "upcoming"
    return matchesFilter  
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedEvent ? (
        <BookedEventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Events</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <motion.div key={event.eventId} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
                    {event?.posterImage && (
                      <img
                        src={CLOUDINARY_BASE_URL + event?.posterImage[0]}
                        alt={event?.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{event?.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {event.date && event.date.length > 0 && (
                        <>
                          {event.date.length === 1 ? (
                            // Single date entry
                            <>
                              <div className="flex items-center text-gray-700">
                                <Calendar className="h-4 w-4 mr-2 text-sky-600" />
                                <span>
                                  {new Date(event.date[0].date).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Clock className="h-4 w-4 mr-2 text-sky-600" />
                                <span>
                                  {event.date[0].startTime} - {event.date[0].endTime}
                                </span>
                              </div>
                            </>
                          ) : (
                            // Multiple date entries
                            <div className="space-y-1">
                              <div className="flex items-center text-sky-800">
                                <Calendar className="h-4 w-4 mr-2 text-sky-600" />
                                <span className="font-semibold">Dates:</span>
                              </div>
                              <ul className="list-disc pl-6 text-gray-700">
                                {event.date.map((entry, index) => (
                                  <li key={index} className="text-sm">
                                    {new Date(entry.date).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                    {entry.startTime && entry.endTime && (
                                      <span className="ml-2 text-gray-500">
                                        ({entry.startTime} - {entry.endTime})
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event?.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event?.attendeesCount} attendees</span>
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
        <Pagination1
        currentPage={currentPage}
        totalPages={totalPage}
        onPagePrev={()=>setCurrentPage(currentPage-1)}
        onPageNext={()=>setCurrentPage(currentPage+1)}
        />
    </div>
  )
}