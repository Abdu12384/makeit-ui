import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Edit, MapPin, Share2, Tag, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string[];
  startTime: string;
  endTime: string;
  address: string;
  venueName: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  maxTicketsPerUser: number;
  ticketPurchased: number;
  status: string;
  attendeesCount: number;
  isActive: boolean;
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Mock data for demonstration
  const event: Event = {
    id: id || "1",
    title: "Summer Music Festival",
    description:
      "A three-day music festival featuring top artists from around the world. Join us for an unforgettable experience with live performances, food vendors, and activities for all ages. The festival will take place in the beautiful City Park Amphitheater, offering stunning views and a perfect atmosphere for music lovers.",
    category: "Music",
    date: ["2025-06-15T00:00:00.000Z", "2025-06-16T00:00:00.000Z", "2025-06-17T00:00:00.000Z"],
    startTime: "2025-06-15T14:00:00.000Z",
    endTime: "2025-06-17T23:00:00.000Z",
    address: "123 Festival Park, Music City, CA 90210",
    venueName: "City Park Amphitheater",
    location: {
      type: "Point",
      coordinates: [34.0522, -118.2437],
    },
    posterImage: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    pricePerTicket: 150,
    totalTicket: 5000,
    maxTicketsPerUser: 4,
    ticketPurchased: 3200,
    status: "upcoming",
    attendeesCount: 0,
    isActive: true,
  };

  useEffect(() => {
    setMounted(true);
    // Animate progress bar
    const timer = setTimeout(() => {
      setProgressValue((event.ticketPurchased / event.totalTicket) * 100);
    }, 300);
    return () => clearTimeout(timer);
  }, [event.ticketPurchased, event.totalTicket]);

  const formatDateRange = (dates: string[]) => {
    if (dates.length === 1) {
      return new Date(dates[0]).toLocaleDateString();
    }

    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);

    return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const ticketsRemaining = event.totalTicket - event.ticketPurchased;

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 bg-gradient-to-b from-sky-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-8"
      >
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mr-4 border-sky-200 hover:bg-sky-50 transition-all duration-300"
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold text-sky-800">Event Details</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-xl shadow-md"
          >
            <img
              src={event.posterImage[0] || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-[400px] object-cover transition-transform duration-10000 hover:scale-110"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4 text-sky-700" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigate(`/vendor/events/edit/${event.id}`)}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
                >
                  <Edit className="h-4 w-4 text-sky-700" />
                </Button>
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm shadow-md">
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-2 text-sky-800">{event.title}</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sky-700">
                <CalendarDays className="h-4 w-4 mr-2 text-sky-500" />
                <span>{formatDateRange(event.date)}</span>
              </div>
              <div className="flex items-center text-sky-700">
                <Clock className="h-4 w-4 mr-2 text-sky-500" />
                <span>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>
              <div className="flex items-center text-sky-700">
                <Tag className="h-4 w-4 mr-2 text-sky-500" />
                <span>{event.category}</span>
              </div>
            </div>
            <p className="text-sky-700 whitespace-pre-line">{event.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3 bg-sky-100">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300"
                >
                  Location
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300"
                >
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-sky-800">Event Schedule</h3>
                  <div className="space-y-2">
                    {event.date.map((date, index) => (
                      <motion.div
                        key={index}
                        className="flex justify-between items-center p-3 bg-sky-50 rounded-md border border-sky-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, backgroundColor: "#e0f2fe" }}
                      >
                        <div>
                          <p className="font-medium text-sky-800">Day {index + 1}</p>
                          <p className="text-sm text-sky-600">{new Date(date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-sky-600">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-sky-100" />

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-sky-800">Ticket Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="border border-sky-100 shadow-sm bg-gradient-to-br from-sky-50 to-white">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-sky-800">Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-sky-800">${event.pricePerTicket}</p>
                          <p className="text-sm text-sky-600">per ticket</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="border border-sky-100 shadow-sm bg-gradient-to-br from-sky-50 to-white">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-sky-800">Limit</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-sky-800">{event.maxTicketsPerUser}</p>
                          <p className="text-sm text-sky-600">tickets per user</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="pt-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-sky-100 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="text-sky-800">{event.venueName}</CardTitle>
                      <CardDescription className="text-sky-600">{event.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-sky-50 rounded-md flex items-center justify-center border border-sky-100">
                        <MapPin className="h-8 w-8 text-sky-400" />
                        <span className="ml-2 text-sky-600">Map view would be displayed here</span>
                      </div>
                      <div className="mt-4 text-sm text-sky-600">
                        <p>
                          Coordinates: {event.location.coordinates[0]}, {event.location.coordinates[1]}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="gallery" className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {event.posterImage.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      className="overflow-hidden rounded-md shadow-sm"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Event image ${index + 1}`}
                        className="w-full aspect-video object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                <CardTitle className="text-sky-800">Ticket Sales</CardTitle>
                <CardDescription className="text-sky-600">
                  {event.ticketPurchased} of {event.totalTicket} tickets sold
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-4 bg-sky-50 rounded-lg border border-sky-100"
                  >
                    <p className="text-sm text-sky-600">Sold</p>
                    <motion.p
                      className="text-2xl font-bold text-sky-800"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      {event.ticketPurchased}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-4 bg-sky-50 rounded-lg border border-sky-100"
                  >
                    <p className="text-sm text-sky-600">Remaining</p>
                    <motion.p
                      className="text-2xl font-bold text-sky-800"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      {ticketsRemaining}
                    </motion.p>
                  </motion.div>
                </div>

                <div className="pt-2">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300"
                      onClick={() => navigate(`/vendor/events/${event.id}/attendees`)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Attendees
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                <CardTitle className="text-sky-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-sky-200 hover:bg-sky-50 text-sky-700 transition-all duration-300"
                    onClick={() => navigate(`/vendor/events/edit/${event.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4 text-sky-500" />
                    Edit Event
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={event.isActive ? "destructive" : "outline"}
                    className={`w-full justify-start transition-all duration-300 ${!event.isActive && "border-sky-200 hover:bg-sky-50 text-sky-700"}`}
                  >
                    {event.isActive ? "Cancel Event" : "Reactivate Event"}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-sky-200 hover:bg-sky-50 text-sky-700 transition-all duration-300"
                  >
                    <Share2 className="mr-2 h-4 w-4 text-sky-500" />
                    Share Event
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}