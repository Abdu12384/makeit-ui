import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Share2,
  Heart,
  ArrowLeft,
  Info,
  Tag,
  Star,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetAllReviewsMutation, useGetEventByIdMutation } from "@/hooks/ClientCustomHooks";
import LocationPicker from "@/components/common/location/LocationPicker";
import EventBookingForm from "@/components/client/event/EventBookingForm";
import ReviewForm from "@/components/common/review/review-form";
import { ReviewData } from "@/types/worksample/review";
import { useSelector } from "react-redux";
import ReviewDisplay from "@/components/common/review/review-display";
import VendorDetailsPage from "@/components/client/vendor-info/VendorDetails";

export interface Event {
  eventId: string;
  title: string;
  description: string;
  category: string;
  date: string[];
  startTime: string;
  endTime: string;
  address: string;
  venueName: string;
  attendeesCount: number;
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  ticketPurchased: number;
  status: "upcoming" | "completed" | "cancelled";
  location?: {
    type: string;
    coordinates: number[];
  };
  vendorDetails?: {
    name: string;
    profileImage: string;
    rating: number;
    events: number;
    userId?:string
  };
  amenities?: string[];
  faq?: Array<{ question: string; answer: string }>;
  reviews?: Array<{
    reviewId: string;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>(); // Get event ID from URL
  const navigate = useNavigate(); // For navigation
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [ticketCount, setTicketCount] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const getEventByIdMutation = useGetEventByIdMutation()
  const [showVendorInfo, setShowVendorInfo] = useState(false)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const {client} = useSelector((state: any) => state.client)
  const getAllReviewsMutation = useGetAllReviewsMutation()


    const reviewFormRef = useRef<HTMLDivElement>(null)
  console.log('eventId',eventId)
  // Simulated data fetch
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);

      getEventByIdMutation.mutate(
        eventId!,
        {
          onSuccess: (data) => {
            console.log('event data',data)
            setEvent(data.event)
            setIsLoading(false)
          },
          onError: (error) => {
            console.log('error while fetching event',error)
            setIsLoading(false)
          }
        }
      )
    };

    fetchEvent();
  }, [eventId]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookNow = () => {
    setIsBookingOpen(true);
  };

  const handleTicketChange = (change: number) => {
    const newCount = ticketCount + change;
    if (newCount >= 1 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  useEffect(() => {
    getAllReviewsMutation.mutate(
      {
        page: 1,
        limit: 10,
        targetId: event?.eventId!,
        targetType: "event",
      },
      {
        onSuccess: (data) => {
          console.log('reviews', data)
          setReviews(data.reviews.reviews)
        },
        onError: (error) => {
          console.log('error while get reviews', error)
        }
      }
    )
  }, [activeTab])

  const handleSubmitReview = (values: any) => {
    console.log('values', values)
    const newReview = {
      comment: values.comment,
      rating: values.rating,
      client:{
        name: client?.name,
        profileImage: client?.profileImage,
      },
      targetId: event?.eventId!,
      targetType: "event",
    }
    setReviews([ newReview, ...reviews ])
    console.log('reviews', values)
  
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const changeImage = (direction: number) => {
    if (!event) return;

    const newIndex = (currentImageIndex + direction + event.posterImage.length) % event.posterImage.length;
    setCurrentImageIndex(newIndex);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#D3D9D4]/10 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#124E66] mb-4"></div>
          <p className="text-[#2E3944]">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#D3D9D4]/10 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-[#212A31] mb-4">Event Not Found</h2>
          <p className="text-[#748D92] mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/events")} className="bg-[#124E66] hover:bg-[#124E66]/90">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D3D9D4]/10">
      {/* Header with back button */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/events")}
            className="mr-2 text-[#212A31] hover:bg-[#D3D9D4]/20"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-medium text-[#212A31] line-clamp-1">{event.title}</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[21/9] w-full relative overflow-hidden">
          <motion.img
            src={event?.posterImage[0]}
            alt={event?.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#212A31] via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Badge className="bg-[#124E66] hover:bg-[#124E66]/90 border-none mb-3">{event.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-[#D3D9D4]" />
                <span>
                  {formatDate(event.date[0])}
                  {event.date.length > 1 ? ` - ${formatDate(event.date[event.date.length - 1])}` : ""}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-[#D3D9D4]" />
                <span>
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-[#D3D9D4]" />
                <span>{event.venueName}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full bg-white/90 text-[#212A31] shadow-md hover:bg-white"
            aria-label="Share event"
          >
            <Share2 size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`p-2.5 rounded-full ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-[#212A31]"
            } shadow-md hover:bg-white`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={isFavorite ? "fill-white" : ""} size={20} />
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-white border border-[#748D92]/20 p-1 rounded-lg w-full grid grid-cols-4">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-[#124E66] data-[state=active]:text-white rounded-md"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-[#124E66] data-[state=active]:text-white rounded-md"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-[#124E66] data-[state=active]:text-white rounded-md"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-[#212A31] mb-4">About This Event</h2>
                      <p className="text-[#2E3944] mb-6 leading-relaxed">{event.description}</p>

                      <Separator className="my-6 bg-[#D3D9D4]/50" />

                      <h3 className="text-lg font-semibold text-[#212A31] mb-4">Event Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 mr-3 text-[#124E66] mt-0.5" />
                          <div>
                            <h4 className="font-medium text-[#212A31]">Date & Time</h4>
                            <p className="text-[#748D92] text-sm">
                              {formatDate(event.date[0])}
                              {event.date.length > 1 ? ` - ${formatDate(event.date[event.date.length - 1])}` : ""}
                              <br />
                              {event.startTime} - {event.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 mr-3 text-[#124E66] mt-0.5" />
                          <div>
                            <h4 className="font-medium text-[#212A31]">Location</h4>
                            <p className="text-[#748D92] text-sm">
                              {event.venueName}
                              <br />
                              {event.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Ticket className="h-5 w-5 mr-3 text-[#124E66] mt-0.5" />
                          <div>
                            <h4 className="font-medium text-[#212A31]">Ticket Information</h4>
                            <p className="text-[#748D92] text-sm">
                              ₹{event.pricePerTicket} per person
                              <br />
                              {event.totalTicket - event.attendeesCount} tickets remaining
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Tag className="h-5 w-5 mr-3 text-[#124E66] mt-0.5" />
                          <div>
                            <h4 className="font-medium text-[#212A31]">Category</h4>
                            <p className="text-[#748D92] text-sm">{event.category}</p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6 bg-[#D3D9D4]/50" />

                      <h3 className="text-lg font-semibold text-[#212A31] mb-4">Organizer</h3>
                      {event.vendorDetails && (
                        <div className="flex items-center mb-6">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={event.vendorDetails.profileImage|| "/placeholder.svg"} alt={event.vendorDetails.name} />
                            <AvatarFallback>{event.vendorDetails.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-[#212A31]">{event.vendorDetails.name}</h4>
                            <div className="flex items-center text-sm text-[#748D92]">
                              <div className="flex items-center mr-4">
                                <Star className="h-3.5 w-3.5 mr-1 text-yellow-500 fill-yellow-500" />
                                <span>{event.vendorDetails.rating}/5</span>
                              </div>
                              <div>{event.vendorDetails.events} events</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="ml-4"
                            onClick={() => setShowVendorInfo(true)}
                          >
                            View Profile
                          </Button>
                        </div>
                      )}

                
                      <Separator className="my-6 bg-[#D3D9D4]/50" />

                      <h3 className="text-lg font-semibold text-[#212A31] mb-4">Location</h3>
                      <div className={`z-10 ${isBookingOpen || showVendorInfo ? 'hidden' : 'block'}`}>
                      <LocationPicker
                        mode="view"
                        initialLat={event?.location?.coordinates[0]}
                        initialLng={event?.location?.coordinates[1]}
                        initialAddress={event?.address}
                        containerClassName="space-y-4" 
                      />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-[#212A31] mb-4">Event Gallery</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {event.posterImage.map((image, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => openGallery(index)}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Event image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-6">
                    <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <ReviewDisplay 
                    title="What Our Customers Say" 
                    showAverage={true} 
                    reviews={reviews}
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <button
                      onClick={() => {
                        setIsReviewFormVisible(!isReviewFormVisible)
                        // Scroll to the form if opening it
                        if (!isReviewFormVisible) {
                          setTimeout(() => {
                            reviewFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                          }, 300) // Delay to match the animation duration of the form appearing
                        }
                      }}
                      className="flex items-center justify-center gap-2 w-full max-w-md mt-4 mx-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus size={20} />
                      {isReviewFormVisible ? "Hide Review Form" : "Add Your Review"}
                    </button>
                  </motion.div>

                  <AnimatePresence>
                    {isReviewFormVisible && (
                      <motion.div
                        ref={reviewFormRef} // Attach the ref to the form container
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <ReviewForm
                          onSubmit={(data: ReviewData) => {
                            handleSubmitReview(data)
                            setIsReviewFormVisible(false)
                          }}
                          isLoading={isLoading}
                          title="Share Your Experience"
                          subtitle="Your feedback helps us improve and helps others make informed decisions"
                          targetId={event?.eventId!}
                          targetType="event"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="sticky top-24"
            >
              <Card className="bg-white border-none shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#212A31] mb-4">Book Tickets</h2>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-[#748D92] text-sm">Price per ticket</p>
                      <p className="text-2xl font-bold text-[#212A31]">₹{event.pricePerTicket}</p>
                    </div>
                    <Badge variant="outline" className="bg-[#124E66]/10 text-[#124E66] border-[#124E66]/20 px-3 py-1">
                      {event.totalTicket - (event.ticketPurchased || 0)} left
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <p className="text-[#748D92] text-sm mb-2">Tickets sold</p>
                    <div className="flex items-center justify-between mb-1.5 text-xs text-[#2E3944]">
                      <span>{Math.round(((event.ticketPurchased || 0) / event.totalTicket) * 100)}% Booked</span>
                      <span>
                        {(event.ticketPurchased || 0)} / {event.totalTicket}
                      </span>
                    </div>
                    <Progress
                      value={((event.ticketPurchased || 0) / event.totalTicket) * 100}
                      className="h-2 bg-[#D3D9D4]/30"
                    />
                  </div>

                  <Separator className="my-6 bg-[#D3D9D4]/50" />

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-medium text-[#212A31]">Number of tickets</p>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-[#748D92]/30"
                          onClick={() => handleTicketChange(-1)}
                          disabled={ticketCount <= 1}
                        >
                          -
                        </Button>
                        <span className="mx-4 font-medium text-[#212A31]">{ticketCount}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-[#748D92]/30"
                          onClick={() => handleTicketChange(1)}
                          disabled={ticketCount >= 10 || ticketCount >= event.totalTicket - (event.ticketPurchased || 0)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="bg-[#D3D9D4]/10 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#2E3944]">Ticket price</span>
                        <span className="text-[#212A31] font-medium">
                          ₹{event.pricePerTicket} x {ticketCount}
                        </span>
                      </div>
                      {/* <div className="flex justify-between mb-2">
                        <span className="text-[#2E3944]">Service fee</span>
                        <span className="text-[#212A31] font-medium">
                          ₹{(event.pricePerTicket * 0.1 * ticketCount).toFixed(2)}
                        </span>
                      </div> */}
                      <Separator className="my-3 bg-[#D3D9D4]/50" />
                      <div className="flex justify-between font-bold">
                        <span className="text-[#212A31]">Total</span>
                        <span className="text-[#124E66]">
                          ₹{(event.pricePerTicket * ticketCount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-[#124E66] hover:bg-[#124E66]/90 text-white py-6" onClick={handleBookNow}>
                    Book Now
                  </Button>

                  <div className="mt-4 flex items-center justify-center text-xs text-[#748D92]">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Tickets are non-refundable after 14 days before the event</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="z-[9999] relative">
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <EventBookingForm
          event={event}
          ticketCount={ticketCount}
          setTicketCount={setTicketCount}
          isBookingOpen={isBookingOpen}
          setIsBookingOpen={setIsBookingOpen}
        />
      </Dialog>
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-[#212A31] border-none">
          <div className="relative">
            <div className="aspect-video w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={event.posterImage[currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsGalleryOpen(false)}
            >
              ✕
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
              onClick={() => changeImage(-1)}
            >
              <ChevronLeft size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
              onClick={() => changeImage(1)}
            >
              <ChevronRight size={24} />
            </Button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {event.posterImage.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/40"}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        {showVendorInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black"
              onClick={() => setShowVendorInfo(false)} // Close on backdrop click
            />

            {/* Vendor Details Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl shadow-xl  w-full mx-4 max-h-[100vh] overflow-y-auto"
            >
              <VendorDetailsPage vendor={event?.vendorDetails!} onClose={() => setShowVendorInfo(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chevron icons for gallery navigation
function ChevronLeft(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}