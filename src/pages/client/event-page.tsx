import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Filter, Search, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/common/NavBar"
import { useGetAllEventsMutation } from "@/hooks/ClientCustomHooks"
import { Link } from "react-router-dom"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { Event } from "@/types/event"
import { container, item } from "@/animations/variants"


const categories = [
  { name: "All", value: "all", color: "bg-gradient-to-r from-purple-500 to-blue-500" },
  { name: "Music", value: "music", color: "bg-gradient-to-r from-pink-500 to-rose-500" },
  { name: "Sports", value: "sports", color: "bg-gradient-to-r from-green-500 to-emerald-500" },
  { name: "Arts", value: "arts", color: "bg-gradient-to-r from-violet-500 to-purple-500" },
  { name: "Food", value: "food", color: "bg-gradient-to-r from-orange-500 to-red-500" },
  { name: "Technology", value: "technology", color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { name: "Business", value: "business", color: "bg-gradient-to-r from-gray-600 to-gray-700" },
  { name: "Wellness", value: "wellness", color: "bg-gradient-to-r from-teal-500 to-green-500" },
  { name: "Education", value: "education", color: "bg-gradient-to-r from-indigo-500 to-blue-600" },
]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "nearby" | "today">("all")
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  // const [favorites, setFavorites] = useState<string[]>([])
  const getAllEventsMutation = useGetAllEventsMutation()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 6

  useEffect(() => {
    const fetchEvents = () => {
      getAllEventsMutation.mutate(
        {
          page: currentPage,
          limit: limit,
          search: searchQuery,
        },
        {
          onSuccess: (response) => {
            console.log(response.events.events)
            setEvents(response.events.events)
            setTotalPages(response.events.total)
            setIsLoading(false)
          },
          onError: (error) => {
            console.error("Error fetching events:", error)
            setIsLoading(false)
          },
        },
      )
    }

    fetchEvents()
  }, [searchQuery,currentPage])

  // const toggleFavorite = (id: string) => {
  //   setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  // }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSearchQuery("")
  }

  const filteredEvents = events.filter((event) => {

    const categoryMatch = selectedCategory === "all" || event.category.toLowerCase() === selectedCategory.toLowerCase()

    const searchMatch =
      !searchQuery ||
      event.title.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      event.venueName.toLowerCase().startsWith(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  const getCategoryCount = (categoryValue: string) => {
    if (categoryValue === "all") return events.length
    return events.filter((event) => event.category.toLowerCase() === categoryValue.toLowerCase()).length
  }

  return (
    <>
      <Navbar variant="transparent" />
      <div className="min-h-screen bg-[#D3D9D4]/10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#124E66] to-[#212A31] text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Events</h1>
              <p className="text-lg mb-8 text-[#D3D9D4]">
                Find and book tickets for the best events happening near you
              </p>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search events, categories, or venues..."
                  className="w-full py-6 pl-12 pr-4 rounded-full text-[#212A31] bg-white/95 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#124E66]" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="mb-8">

            {/* Active Filters Display */}
            {(selectedCategory !== "all" || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-[#748D92]/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#212A31]">Active Filters:</span>
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="bg-[#124E66] text-white hover:bg-[#124E66]/90">
                        {categories.find((cat) => cat.value === selectedCategory)?.name}
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge variant="secondary" className="bg-[#748D92] text-white hover:bg-[#748D92]/90">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-[#124E66] border-[#124E66] hover:bg-[#124E66] hover:text-white"
                  >
                    Clear All
                  </Button>
                </div>
                {/* <div className="mt-2 text-sm text-[#748D92]">
                  Showing {displayEvents.length} of {events.length} events
                </div> */}
              </motion.div>
            )}

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Filter className="h-5 w-5 text-[#124E66]" />
                <h3 className="text-lg font-semibold text-[#212A31]">Filter by Category</h3>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.value
                  const count = getCategoryCount(category.value)

                  return (
                    <motion.button
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                        isSelected
                          ? `${category.color} text-white shadow-lg`
                          : "bg-white border-2 border-[#748D92]/20 text-[#2E3944] hover:border-[#124E66]/40 hover:shadow-md"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <Badge
                        className={`text-xs ${
                          isSelected
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-[#124E66]/10 text-[#124E66] border-[#124E66]/20"
                        }`}
                      >
                        {count}
                      </Badge>

                      {isSelected && (
                        <motion.div
                          layoutId="categoryIndicator"
                          className="absolute inset-0 rounded-full border-2 border-white/50"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Event Cards */}
            <TabsContent value={activeTab} className="mt-0">
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
              ) : filteredEvents.length > 0 ? (
                <>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredEvents.map((event) => (
                    <motion.div key={event.id} variants={item} whileHover={{ y: -5 }} className="h-full">
                      <Card className="overflow-hidden border-none shadow-md bg-white h-full flex flex-col">
                        <div className="relative">
                          <div className="aspect-[3/2] overflow-hidden">
                            <motion.img
                              src={event.posterImage[0]}
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
                                {new Date(event.date[0]).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                {event.date.length > 1
                                  ? ` - ${new Date(event.date[event.date.length - 1]).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}`
                                  : ""}
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
                            <Link to={`/events/details/${event?.eventId}`} className="flex items-center">
                              Book Now
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
                  <Pagination1
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPagePrev={()=>setCurrentPage(currentPage-1)}
                  onPageNext={()=>setCurrentPage(currentPage+1)}
                  />
                  </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16 bg-white rounded-lg shadow-sm"
                >
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 bg-[#124E66]/10 rounded-full flex items-center justify-center">
                      <Search className="h-12 w-12 text-[#124E66]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-[#212A31]">No events found</h3>
                    <p className="text-[#748D92] mb-6">
                      {selectedCategory !== "all"
                        ? `No events found in "${categories.find((cat) => cat.value === selectedCategory)?.name}" category`
                        : "Try adjusting your search or filters"}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={clearFilters} className="bg-[#124E66] hover:bg-[#124E66]/90 text-white">
                      Clear Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("all")}
                      className="border-[#124E66] text-[#124E66] hover:bg-[#124E66] hover:text-white"
                    >
                      View All Events
                    </Button>
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Featured Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#212A31] mb-4">Featured Collections</h2>
              <p className="text-[#748D92] max-w-2xl mx-auto">
                Discover curated collections of events that match your interests
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Weekend Getaways", count: 24, image: "/placeholder.svg?height=300&width=400" },
                { title: "Family-Friendly Events", count: 18, image: "/placeholder.svg?height=300&width=400" },
                { title: "Exclusive Experiences", count: 12, image: "/placeholder.svg?height=300&width=400" },
              ].map((collection, index) => (
                <motion.div
                  key={collection.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#212A31] to-transparent opacity-70 z-10"></div>
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                    <h3 className="text-xl font-bold mb-1">{collection.title}</h3>
                    <p>{collection.count} Events</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-[#124E66]/5 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-2xl font-bold text-[#212A31] mb-4">Never Miss an Event</h2>
              <p className="text-[#748D92] mb-6">
                Subscribe to our newsletter and be the first to know about upcoming events
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow py-6 rounded-lg border-[#748D92]/20"
                />
                <Button className="bg-[#124E66] hover:bg-[#124E66]/90 text-white py-6 px-8">Subscribe</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
