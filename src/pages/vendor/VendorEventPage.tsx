import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, MoreVertical, Plus, Tag, Ticket } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllEventsByVendorIdMutation } from "@/hooks/VendorCustomHooks";
import EventFormPage from "@/components/vendor/events/CreateEvents";
import { EventData } from "@/types/event";
import { useBlockEventMutation } from "@/hooks/VendorCustomHooks";
import toast from "react-hot-toast";


export default function VendorEventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const getAllEventsByVendorIdMutation = useGetAllEventsByVendorIdMutation();
  const blockEventMutation = useBlockEventMutation();

  useEffect(() => {
    setIsLoading(true);
    getAllEventsByVendorIdMutation.mutate(
      {
        page: 1,
        limit: 10
      },
      {
        onSuccess: (data) => {
          setEvents(data.events.events);
          setIsLoading(false);
        },
        onError: (error: any) => {
          setIsLoading(false);
         console.log(error)
        }
      }
    );
  }, []);


  const handleBlockEvent = (eventId: string) => {
    blockEventMutation.mutate(
      eventId,
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.eventId === eventId ? { ...event, isActive: !event.isActive } : event
            )
          );
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message);
        }
      }
    );
  };

  
  const filteredEvents = events.filter((event) => event.status === activeTab);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="container mx-auto py-8 bg-gradient-to-b from-sky-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-sky-800">Event Management</h1>
        <Button
          onClick={() => navigate("/vendor/events/create")}
          className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Host New Event
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-sky-100">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300"
          >
            Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event) => (
                <motion.div key={event.eventId || `event-${Math.random()}`} variants={item}>
                  <Card className="overflow-hidden border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={event.posterImage?.[0] || "/placeholder.svg"}
                        alt={event.title}
                        className={`object-cover w-full h-full transition-transform duration-500 ${
                          event.isActive ? "hover:scale-105" : "grayscale opacity-60"
                        }`}                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm shadow-md">
                        ₹{event.pricePerTicket}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold mb-2 line-clamp-1 text-sky-800">{event.title}</h3>
                      <div className="space-y-2 text-sm text-sky-700">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-sky-500" />
                          <span>
                            {event.date[0]
                              ? new Date(event.date[0]).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "No date"}
                            {event.startTime ? ` at ${event.startTime}` : ""}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-sky-500" />
                          <span className="line-clamp-1">{event.venueName}</span>
                        </div>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-sky-500" />
                          <span>{event.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Ticket className="h-4 w-4 mr-2 text-sky-500" />
                          <span>
                            {event.ticketPurchased} / {event.totalTicket} tickets sold
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-sky-100">
                          <MoreVertical className="h-5 w-5 text-sky-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40 bg-white border border-sky-100">
                        <DropdownMenuItem
                          onClick={() => setEditingEvent(event)}
                          className="text-sky-700 hover:bg-sky-100 cursor-pointer"
                        >
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBlockEvent(event.eventId)}
                          className={event.isActive ? "text-red-600 hover:bg-red-50 cursor-pointer" : "text-green-600 hover:bg-green-50 cursor-pointer"}
                        >
                          {event.isActive ? "Block Event" : "Unblock Event"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-sky-50 rounded-lg shadow-inner"
            >
              <h3 className="text-xl font-medium mb-2 text-sky-800">No {activeTab} events found</h3>
              <p className="text-sky-600 mb-6">Start hosting events to see them listed here.</p>
              <Button
                onClick={() => navigate("/vendor/events/create")}
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" /> Host New Event
              </Button>
            </motion.div>
          )}
        </TabsContent>
        {editingEvent && (
              <div className="fixed inset-0 z-50 bg-opacity-30 overflow-y-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full min-h-[90vh] relative overflow-y-auto">
                  <h2 className="text-2xl font-semibold text-sky-700 mb-4">
                    Edit Event: {editingEvent.title}
                  </h2>
                  <EventFormPage eventData={editingEvent} onSuccess={() => setEditingEvent(null)} onCancel={() => setEditingEvent(null)} />
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
      </Tabs>
    </div>
  );
}