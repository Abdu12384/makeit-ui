"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetAllLocationBasedEventsMutation } from "@/hooks/ClientCustomHooks"
import type { Event } from "@/types/event"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Clock, Users, ChevronRight, ChevronDown, Navigation } from "lucide-react"
import Navbar from "@/components/common/NavBar"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"
import { Link } from "react-router-dom"

export default function NearbyEventsPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [radius, setRadius] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const getAllLocationBasedEventsMutation = useGetAllLocationBasedEventsMutation()

  const radiusOptions = [
    { value: 10, label: "Within 10km", description: "Very close events" },
    { value: 20, label: "Within 20km", description: "Nearby events" },
    { value: 30, label: "Within 30km", description: "Local area events" },
    { value: 50, label: "Within 50km", description: "Regional events" },
    { value: 100, label: "Within 100km", description: "Extended area events" },
  ]

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        alert("Location permission is required to find nearby events.")
        console.error(error)
      },
    )
  }, [])

  useEffect(() => {
    if (!location) return
    setIsLoading(true)
    getAllLocationBasedEventsMutation.mutate(
      {
        lat: location.lat,
        lng: location.lng,
        radius: radius,
        page: 1,
        limit: 20,
      },
      {
        onSuccess: (res) => {
          setEvents(res.events)
          setIsLoading(false)
        },
        onError: (err) => {
          console.error("Error fetching nearby events:", err)
          setIsLoading(false)
        },
      },
    )
  }, [location, radius])

  const selectedOption = radiusOptions.find((option) => option.value === radius)

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-10 bg-[#F5F5F5] px-4 md:px-8 py-12">
        <div className="container mx-auto">
          {/* Header with Title and Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <h1 className="text-3xl font-bold text-[#124E66] mb-6 md:mb-0">Events Near You</h1>

            {/* Enhanced Radius Filter Dropdown - Right Side */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 bg-white border-2 border-[#124E66]/20 hover:border-[#124E66]/40 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px]"
              >
                <div className="bg-[#124E66]/10 rounded-full p-2">
                  <Navigation className="h-5 w-5 text-[#124E66]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[#124E66]">{selectedOption?.label}</div>
                  <div className="text-sm text-[#748D92]">{selectedOption?.description}</div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-[#124E66] transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />

                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-[#124E66]/10 z-20 overflow-hidden"
                    >
                      <div className="p-2">
                        {radiusOptions.map((option, index) => (
                          <motion.button
                            key={option.value}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setRadius(option.value)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 ${
                              radius === option.value
                                ? "bg-[#124E66] text-white shadow-md"
                                : "hover:bg-[#124E66]/5 text-[#124E66]"
                            }`}
                          >
                            <div
                              className={`rounded-full p-2 ${
                                radius === option.value ? "bg-white/20" : "bg-[#124E66]/10"
                              }`}
                            >
                              <Navigation
                                className={`h-4 w-4 ${radius === option.value ? "text-white" : "text-[#124E66]"}`}
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div
                                className={`font-medium ${radius === option.value ? "text-white" : "text-[#124E66]"}`}
                              >
                                {option.label}
                              </div>
                              <div
                                className={`text-sm ${radius === option.value ? "text-white/80" : "text-[#748D92]"}`}
                              >
                                {option.description}
                              </div>
                            </div>
                            {radius === option.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white/20 rounded-full p-1"
                              >
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Event Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-none shadow-md bg-white">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events?.map((event) => (
                <motion.div key={event.eventId} whileHover={{ y: -5 }}>
                  <Card className="overflow-hidden border-none shadow-md bg-white h-full flex flex-col">
                    <div className="relative">
                      <div className="aspect-[3/2] overflow-hidden">
                        <motion.img
                          src={CLOUDINARY_BASE_URL + event.posterImage[0]}
                          alt={event.title}
                          className="object-cover w-full h-full"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#212A31]/80 to-transparent p-4">
                        <Badge className="bg-[#124E66] hover:bg-[#124E66]/90 text-white border-none">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-grow">
                      <h3 className="text-xl font-bold mb-3 text-[#212A31] line-clamp-2">{event.title}</h3>
                      <div className="space-y-3 text-sm text-[#2E3944]">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#124E66]" />
                          <span>
                            {new Date(event.date[0].date).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#124E66]" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-[#124E66]" />
                          <span className="line-clamp-1">{event.venueName}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-[#124E66]" />
                          <div className="w-full">
                            <div className="flex justify-between mb-1 text-xs">
                              <span>
                                {Math.round(((event?.ticketPurchased || 0) / event?.totalTicket) * 100)}% Booked
                              </span>
                              <span>{event?.totalTicket - (event?.ticketPurchased || 0)} left</span>
                            </div>
                            <div className="w-full bg-[#D3D9D4]/50 rounded-full h-1.5">
                              <div
                                className="bg-[#124E66] h-1.5 rounded-full"
                                style={{ width: `${((event?.ticketPurchased || 0) / event?.totalTicket) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex justify-between items-center">
                      <div className="text-[#212A31]">
                        <span className="text-lg font-bold">₹{event.pricePerTicket}</span>
                        <span className="text-sm text-[#748D92]">/ticket</span>
                      </div>
                      <Button className="bg-[#124E66] hover:bg-[#124E66]/90 text-white">
                        <Link to={`/events/details/${event.eventId}`} className="flex items-center">
                          Book Now
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#748D92] mt-12">No events found within {radius}km.</div>
          )}
        </div>
      </div>
    </>
  )
}
