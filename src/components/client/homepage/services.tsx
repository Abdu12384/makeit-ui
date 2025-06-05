// import { useRef, useState, useEffect } from "react"
// import { motion, useScroll, useTransform } from "framer-motion"
// import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { useMediaQuery } from "@/hooks/media-query/use-media-query"
// import bgIMG from '@/assets/images/servicebackround.jpg'
// import bgIMG2 from '@/assets/images/servicebg.webp'
// import { useClientGetAllServicesMutation } from "@/hooks/ClientCustomHooks";



 

// export default function Services() {
//   const sectionRef = useRef<HTMLElement>(null)
//   const carouselRef = useRef<HTMLDivElement>(null)
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null)
//   const isMobile = useMediaQuery("(max-width: 768px)")
//   const [cardsPerView, setCardsPerView] = useState(3)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [servicesData, setServicesData] = useState([])
//   const limit = 10

//   const clientGetAllServicesMutation = useClientGetAllServicesMutation()


//    useEffect(()=>{
//     clientGetAllServicesMutation.mutate(
//       {
//         page:currentPage,
//         limit,
//       },
//       {
//         onSuccess: (data) => {
//           console.log('data',data.services.services)
//           setServicesData(data.services.services)
//           setTotalPages(data.totalPages)
//         },
//         onError: (error) => {
//           console.log('error',error)
//         }
//       } 
//     )
//    },[currentPage])


//   useEffect(() => {
    
//     setCardsPerView(isMobile ? 1 : 3)
//   }, [isMobile])

//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"],
//   })

//   const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.1])
//   const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
//   const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [5, 0, 0, 5])

//   const nextSlide = () => {
//     if (activeIndex < services.length - cardsPerView) {
//       setActiveIndex(activeIndex + 1)
//     } else {
//       setActiveIndex(0)
//     }
//   }

//   const prevSlide = () => {
//     if (activeIndex > 0) {
//       setActiveIndex(activeIndex - 1)
//     } else {
//       setActiveIndex(services.length - cardsPerView)
//     }
//   }

//   return (
//     <motion.section
//       ref={sectionRef}
//       className="py-20 bg-white relative overflow-hidden"
//       initial={{ opacity: 0 }}
//       whileInView={{ opacity: 1 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* Background with zoom effect on scroll */}
//       <motion.div
//         className="absolute inset-0 z-0"
//         style={{
//           backgroundImage: `url(${bgIMG2})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           scale,
//           filter: `blur(${blur}px)`,
//           opacity,
//         }}
//       />

//       {/* Overlay */}
//       <div className="absolute inset-0  z-0"></div>

//       <div className=" px-4 md:px-6 relative z-10">
//         <motion.div
//           className="text-center mb-12"
//           initial={{ y: 20, opacity: 0 }}
//           whileInView={{ y: 0, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <motion.h2
//             className="text-3xl md:text-4xl font-bold tracking-tight text-[#212A31] mb-4"
//             initial={{ y: -20, opacity: 0 }}
//             whileInView={{ y: 0, opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//           >
//             Our Services
//           </motion.h2>
//           <motion.p
//             className="text-[#2E3944] max-w-2xl mx-auto"
//             initial={{ y: 20, opacity: 0 }}
//             whileInView={{ y: 0, opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             Connect with top vendors for all your event needs. We provide premium services to make your events
//             memorable.
//           </motion.p>
//         </motion.div>

//         <div className="relative">
//           <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="rounded-full border-[#124E66] bg-white text-[#124E66] hover:bg-[#124E66] hover:text-white shadow-lg"
//                 onClick={prevSlide}
//               >
//                 <ChevronLeft className="h-5 w-5" />
//                 <span className="sr-only">Previous</span>
//               </Button>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="rounded-full border-[#124E66] bg-white text-[#124E66] hover:bg-[#124E66] hover:text-white shadow-lg"
//                 onClick={nextSlide}
//               >
//                 <ChevronRight className="h-5 w-5" />
//                 <span className="sr-only">Next</span>
//               </Button>
//             </motion.div>
//           </div>

//           <div className="overflow-hidden">
//             <motion.div
//               ref={carouselRef}
//               className="flex"
//               animate={{ x: `-${activeIndex * (100 / cardsPerView)}%` }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             >
//               {servicesData?.map((service, index) => (
//                 <motion.div
//                   key={index}
//                   className={`${isMobile ? 'min-w-full' : 'min-w-[33.333%]'} px-4`}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   onHoverStart={() => setHoveredCard(index)}
//                   onHoverEnd={() => setHoveredCard(null)}
//                 >
//                   <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
//                     <motion.div
//                       className="relative h-60 w-full overflow-hidden"
//                       animate={{
//                         scale: hoveredCard === index ? 1.05 : 1,
//                         y: hoveredCard === index ? -5 : 0,
//                       }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <img
//                         src={service?.category?.image || "/placeholder.svg"}
//                         alt={service?.serviceTitle}
//                         className="h-full w-full object-cover"
//                       />
//                       <motion.div
//                         className="absolute inset-0 bg-gradient-to-t from-[#124E66]/80 to-transparent"
//                         animate={{
//                           opacity: hoveredCard === index ? 0.9 : 0.7,
//                         }}
//                         transition={{ duration: 0.3 }}
//                       ></motion.div>
//                     </motion.div>
//                     <CardContent className="p-6">
//                       <motion.h3
//                         className="text-xl font-bold text-[#212A31] mb-3"
//                         animate={{
//                           color: hoveredCard === index ? "#124E66" : "#212A31",
//                         }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         {service?.serviceTitle}
//                       </motion.h3>
//                       <p className="text-[#2E3944]">{service?.serviceDescription}</p>
//                     </CardContent>
//                     <CardFooter className="px-6 pb-6 pt-0">
//                       <motion.div
//                         whileHover={{ x: 5 }}
//                         whileTap={{ scale: 0.95 }}
//                         animate={{
//                           scale: hoveredCard === index ? 1.05 : 1,
//                         }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <Button className="bg-[#124E66] hover:bg-[#0e3e52] text-white rounded-full px-6">
//                           Learn More <ArrowRight className="ml-2 h-4 w-4" />
//                         </Button>
//                       </motion.div>
//                     </CardFooter>
//                   </Card>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.section>
//   )
// }






"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, Star, MapPin, Clock, Heart, Eye, Sparkles, User, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/media-query/use-media-query"
import { useClientGetAllServicesMutation } from "@/hooks/ClientCustomHooks";
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


interface Service {
    serviceId: string
    serviceTitle: string
    serviceDescription: string
    category: {
    name: string
    image: string
  }
  vendor: {
    name: string
    rating: number
  }
  servicePrice: number
  serviceDuration: string
  isPopular?: boolean
  images: string[]
  vendorId: string
  yearsOfExperience: number
  additionalHourFee: number

}



export default function EnhancedServicesCards() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [likedServices, setLikedServices] = useState<string[]>([])
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [cardsPerView, setCardsPerView] = useState(3)
  const [servicesData, setServicesData] = useState<Service[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10
  const {client} = useSelector((state: RootState) => state.client)

  const clientGetAllServicesMutation = useClientGetAllServicesMutation()
  const navigate = useNavigate();


  useEffect(() => {
    setCardsPerView(isMobile ? 1 : 3)
  }, [isMobile])


     useEffect(()=>{
    clientGetAllServicesMutation.mutate(
      {
        page:currentPage,
        limit,
      },
      {
        onSuccess: (data) => {
          console.log('data',data.services.services)
          setServicesData(data.services.services)
          setTotalPages(data.totalPages)
        },
        onError: (error) => {
          console.log('error',error)
        }
      } 
    )
   },[currentPage])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const handleBookService = (serviceId: string) => {
     
    if(client){
      navigate(`/services/details/${serviceId}`)
    }
    else{
      navigate('/login')
    }
    
  }

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"])

  const nextSlide = () => {
    if (activeIndex < servicesData.length - cardsPerView) {
      setActiveIndex(activeIndex + 1)
    } else {
      setActiveIndex(0)
    }
  }

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else {
      setActiveIndex(servicesData.length - cardsPerView)
    }
  }

  const toggleLike = (serviceId: string) => {
    setLikedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div className="text-center mb-16" style={{ y: textY }}>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg"
          >
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Premium Services</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Exceptional Services
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover premium services from top-rated vendors. Each service is carefully curated to ensure exceptional
            quality and unforgettable experiences for your special events.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 w-full z-20 px-4 pointer-events-none">
            <motion.div className="pointer-events-auto" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/90 backdrop-blur-sm border-white/20 text-gray-700 hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div className="pointer-events-auto" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/90 backdrop-blur-sm border-white/20 text-gray-700 hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Cards Container */}
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * (100 / cardsPerView)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {servicesData?.map((service, index) => (
                <motion.div
                  key={service?.serviceId}
                  className={`${isMobile ? "min-w-full" : "min-w-[33.333%]"} px-4`}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group relative">
                    {/* Popular Badge */}
                    {/* <AnimatePresence>
                      {service.isPopular && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 45 }}
                          className="absolute top-4 right-4 z-20"
                        >
                          <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0 shadow-lg">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence> */}

                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={service?.category?.image}
                        alt={service?.serviceTitle}
                        className="h-full w-full object-cover"
                        variants={imageVariants}
                        whileHover="hover"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Hover Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px]"
                        variants={overlayVariants}
                        initial="hidden"
                        whileHover="hover"
                      />

                      {/* Action Buttons */}
                      <motion.div
                        className="absolute top-4 left-4 flex gap-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: hoveredCard === index ? 1 : 0, y: hoveredCard === index ? 0 : -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(service?.serviceId)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            likedServices.includes(service?.serviceId)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-700 hover:bg-white"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${likedServices.includes(service.id) ? "fill-current" : ""}`} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-all duration-300"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                      </motion.div>

                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border-0">
                          {service?.category?.name}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Title */}
                      <motion.h3
                        className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
                        animate={{
                          scale: hoveredCard === index ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {service?.serviceTitle}
                      </motion.h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{service?.serviceDescription}</p>

                      {/* Vendor Info */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          {service?.vendor?.[0]?.profileImage ? (
                            <img
                              src={service?.vendor?.[0]?.profileImage }
                              alt="Vendor"
                              className="w-full h-full object-cover"
                            />
                          ): (
                            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{service?.vendor?.[0]?.name}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{service?.vendor?.[0]?.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span>{service?.serviceDuration} hours</span>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-2xl font-bold text-gray-800">₹{service?.servicePrice}</span>
                          <span className="text-sm text-gray-500 ml-1">starting</span>
                        </div>

                        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={() => handleBookService(service?.serviceId)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            Book Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(servicesData?.length / cardsPerView) }).map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex / cardsPerView) === index ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setActiveIndex(index * cardsPerView)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

