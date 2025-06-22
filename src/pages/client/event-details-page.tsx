import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar,Clock,MapPin,Ticket,ArrowLeft,Tag,Star,Plus,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { useGetAllReviewsMutation, useGetEventByIdMutation } from "@/hooks/ClientCustomHooks";
import LocationPicker from "@/components/common/location/LocationPicker";
import EventBookingForm from "@/components/client/event/EventBookingForm";
import ReviewForm from "@/components/common/review/review-form";
import { ReviewData } from "@/types/worksample/review";
import { useSelector } from "react-redux";
import ReviewDisplay from "@/components/common/review/review-display";
import { Event } from "@/types/event";
import BookingCard from "@/components/client/event/BookingCard";
import EventGalleryDialog from "@/components/client/event/EventGallery";
import { VendorDetailsDialog } from "@/components/client/vendor-info/VendorInfoDialog";
import { EventDetailsPageSkeleton } from "@/components/common/skelton/SkeltonLoading";
import { EventNF } from "@/components/common/NotFound/ItemsNotFound";
import toast from "react-hot-toast";

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>(); 
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    const isSoldOut = event ? event.attendeesCount >= event.totalTicket : false;


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


  const handleBookNow = () => {
    if (isSoldOut) {
      toast.error("Ticket is sold out")
      return;
    }
    setIsBookingOpen(true);
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
    return <EventDetailsPageSkeleton/>
  }

  if (!event) {
    return <EventNF/>
  }
  return (
    <div className="min-h-screen bg-[#D3D9D4]/10">
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
            <BookingCard
              event={event}
              ticketCount={ticketCount}
              setTicketCount={setTicketCount}
              handleBookNow={handleBookNow}
            />
          </div>
        </div>
      </div>

      <div className="z-[9999] relative">
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <EventBookingForm
          event={event}
          ticketCount={ticketCount}
          isBookingOpen={isBookingOpen}
          setIsBookingOpen={setIsBookingOpen}
        />
      </Dialog>
      </div>

      <EventGalleryDialog
        isOpen={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        images={event.posterImage}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        changeImage={changeImage}
      />
     <VendorDetailsDialog
        isOpen={showVendorInfo}
        onClose={() => setShowVendorInfo(false)}
        vendor={event?.vendorDetails || null} 
      />
    </div>
  );
}

