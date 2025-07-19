import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/media-query/use-media-query"
import eventimg1half from '@/assets/images/eventIMG1half.png'
import eventimg2half from '@/assets/images/eventIMG2half.png'
import { useGetAllEventsMutation } from "@/hooks/ClientCustomHooks"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useNavigate } from "react-router-dom"
import { IEventFormValues } from "@/types/event"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"


export default function Events() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [cardsPerView, setCardsPerView] = useState(3)
  const getAllEventsMutation = useGetAllEventsMutation()
  const [currentPage, _setCurrentPage] = useState(1)
  const [_totalPages, setTotalPages] = useState(1)
  const limit = 6
  const [events, setEvents] = useState<IEventFormValues[]>([])
  const [_isLoading, setIsLoading] = useState(true)

  const {client} = useSelector((state: RootState) => state.client)


  useEffect(() => {
    setCardsPerView(isMobile ? 1 : 3)
  }, [isMobile])


  useEffect(() => {
    const fetchEvents = () => {
      getAllEventsMutation.mutate(
        {
          page: currentPage,
          limit: limit, 
        },
        {
          onSuccess: (response) => {
            setEvents(response.events.events)
            setTotalPages(response.events.total)
            setIsLoading(false)
          },
          onError: (error) => {
            console.log(error)
            setIsLoading(false)
          },
        },
      )
    }

    fetchEvents()
  }, [currentPage, limit])



  const handleTicketBooking = (eventId: string) => {
    if (client) {
      navigate(`/events/details/${eventId}`)
    } else {
      navigate('/login')
    }
  }




  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const leftX = useTransform(scrollYProgress, [0, 0.5], ["-100%", "0%"])
  const leftOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])

  const rightX = useTransform(scrollYProgress, [0, 0.5], ["100%", "0%"])
  const rightOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])

  const nextSlide = () => {
    if (activeIndex < events.length - cardsPerView) {
      setActiveIndex(activeIndex + 1)
    } else {
      setActiveIndex(0)
    }
  }

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else {
      setActiveIndex(events.length - cardsPerView)
    }
  }

  return (
    <motion.section
      ref={sectionRef}
      className="py-20 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Left background image */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-0"
        style={{
          backgroundImage: `url(${eventimg1half})`,
          backgroundSize: "cover",
          backgroundPosition: "center left",
          x: leftX,
          opacity: leftOpacity,
        }}
      />

      {/* Right background image */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-0"
        style={{
          backgroundImage:`url(${eventimg2half})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          x: rightX,
          opacity: rightOpacity,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-0"></div>

      <div className="px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Upcoming Events
          </motion.h2>
          <motion.p
            className="text-white max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover and book your spot at these amazing events. Don't miss out on the opportunity to be part of
            something special.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-[#124E66] bg-white text-[#124E66] hover:bg-[#124E66] hover:text-white shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-[#124E66] bg-white text-[#124E66] hover:bg-[#124E66] hover:text-white shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </motion.div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              ref={carouselRef}
              className="flex"
              animate={{ x: `-${activeIndex * (100 / cardsPerView)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {events?.map((event, index) => (
                <motion.div
                  key={index}
                  className={`${isMobile ? 'min-w-full' : 'min-w-[33.333%]'} px-4`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    animate={{
                      y: hoveredCard === index ? -10 : 0,
                      scale: hoveredCard === index ? 1.03 : 1,
                      boxShadow:
                        hoveredCard === index
                          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden">
                      <motion.div
                        className="relative h-48 w-full overflow-hidden"
                        animate={{
                          scale: hoveredCard === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={CLOUDINARY_BASE_URL + event?.posterImage[0] || "/placeholder.svg"}
                          alt={event?.title}
                          className="h-full w-full object-cover"
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-[#124E66]/60 to-transparent"
                          animate={{
                            opacity: hoveredCard === index ? 0.8 : 0.6,
                          }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </motion.div>
                      <CardContent className="p-6">
                        <motion.h3
                          className="text-xl font-bold text-[#212A31] mb-4"
                          animate={{
                            color: hoveredCard === index ? "#124E66" : "#212A31",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {event?.title}
                        </motion.h3>
                        <div className="space-y-3 text-[#2E3944]">
                          <motion.div
                            className="flex items-center"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Calendar className="h-5 w-5 mr-3 text-[#124E66]" />
                            <span>
                            {new Date(event?.date?.[0]?.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Clock className="h-5 w-5 mr-3 text-[#124E66]" />
                            <span>{event?.date?.[0]?.startTime}</span>
                          </motion.div>
                          <motion.div
                            className="flex items-center"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <MapPin className="h-5 w-5 mr-3 text-[#124E66]" />
                            <span className="truncate max-w-[200px] block">{event?.address}</span>
                            </motion.div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0">
                        <motion.div
                          className="w-full"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          animate={{
                            scale: hoveredCard === index ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button onClick={() => handleTicketBooking(event?.eventId!)} className="w-full bg-[#124E66] hover:bg-[#0e3e52] text-white rounded-full">
                            Book Now
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
