import { useState, useEffect, useRef } from "react" // Add useRef to imports
import { AnimatePresence, motion } from "framer-motion"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Clock, DollarSign, Star, Award, AlertCircle, ArrowLeft, Share2, Heart, MessageCircle, ChevronDown, ChevronUp, Calendar, User, Mail, Phone, IndianRupee, Plus } from 'lucide-react'
import { useAddReviewMutation, useBookingServiceMutation, useClientGetServiceByIdMutation, useGetAllReviewsMutation } from "@/hooks/ClientCustomHooks"
import { IVendor } from "@/types/User"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast"
import Navbar from "@/components/common/NavBar"
import ReviewForm from "@/components/common/review/review-form"
import ReviewDisplay from "@/components/common/review/review-display"
import { ReviewData } from "@/types/worksample/review"
import { useSelector } from "react-redux"
import VendorDetailsPage from "@/components/client/vendor-info/VendorDetails"

// Define the Service type
interface Service {
  id: string
  serviceId: string
  serviceTitle: string
  serviceDescription: string
  servicePrice: number
  serviceDuration: string
  yearsOfExperience: number
  additionalHourFee: number
  cancellationPolicy: string
  termsAndCondition: string
  imageUrl: string
  rating: number
  reviewCount: number
  category: string
  providerName: string
  providerImage: string
  providerRating: number
  gallery: string[]
}

export const BookingPage = () => {
  const { id } = useParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vendor, setVendor] = useState<IVendor | null>(null)
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [showVendorInfo, setShowVendorInfo] = useState(false)
  const {client} = useSelector((state: any) => state.client)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    terms: false,
    cancellation: false,
  })

  const navigate = useNavigate()
  const clientGetServiceByIdMutation = useClientGetServiceByIdMutation()
  const clientBookingServiceMutation = useBookingServiceMutation()

  console.log('reviews', reviews)

  console.log('service', service)

  // Create a ref for the ReviewForm container
  const reviewFormRef = useRef<HTMLDivElement>(null)

  const handleBookingService = (values: any, action: any) => {
    clientBookingServiceMutation.mutate(
      {
        id: service?.serviceId!,
        bookingData: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          date: values.date,
          vendorId: vendor?.userId!
        }
      },
      {
        onSuccess: (data) => {
          toast.success(data.message)
          action.resetForm()
          action.setSubmitting(false)
          setTimeout(() => {
            navigate(`/services`)
          }, 1000)
        },
        onError: (error: any) => {
          console.log('error while booking service',error)
          toast.error(error.response.data.message)
          action.setSubmitting(false)
        }
      }
    )
  }



  const getAllReviewsMutation = useGetAllReviewsMutation()  

useEffect(() => {
  getAllReviewsMutation.mutate(
    {
      page: 1,
      limit: 10,
      targetId: service?.serviceId!,
      targetType: "service",
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




  console.log('reviews-details page', reviews)

  const handleSubmitReview = (values: any) => {
    console.log('values', values)
    const newReview = {
      comment: values.comment,
      rating: values.rating,
      client:{
        name: client?.name,
        profileImage: client?.profileImage,
      },
      targetId: service?.id!,
      targetType: "service",
    }
    setReviews([ newReview, ...reviews ])
    console.log('reviews', values)
  }


  




  useEffect(() => {
    if (id) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        clientGetServiceByIdMutation.mutate(id, {
          onSuccess: (data) => {
            setService(data.service.service)
            setVendor(data.service.vendor)
            setIsLoading(false)
          },
          onError: (error: any) => {
            console.log('error while client get service by id', error)
            setIsLoading(false)
          },
        })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [id])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  // Formik validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    date: Yup.date().required("Date is required").min(new Date(), "Date must be in the future"),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-40 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-80 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Back to Services
          </button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mt-16 px-4 py-12"
      >
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-6">
          <Link to="/services" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Services</span>
          </Link>
        </motion.div>

        {/* Service header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{service.serviceTitle}</h1>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Heart className="h-5 w-5 text-gray-700" />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <span className="ml-1 font-medium">{service.rating}</span>
            </div>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{service.reviewCount} reviews</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{service.category}</span>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Service details */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            {/* Main image */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-md">
              <div className="w-full h-96 bg-gray-200" />
            </div>

            {/* Gallery */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {service?.gallery?.map((_, index) => (
                  <motion.div 
                    key={index} 
                    whileHover={{ scale: 1.05 }} 
                    className="rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="w-full h-32 bg-gray-200" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <div className="flex space-x-8">
                {["description", "provider", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-1 font-medium transition-colors ${
                      activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="mb-8">
              {activeTab === "description" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {/* Description section */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection("description")}
                    >
                      <h3 className="text-xl font-bold text-gray-800">Service Description</h3>
                      {expandedSections.description ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSections.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-gray-600 leading-relaxed"
                      >
                        <p>{service.serviceDescription}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Terms section */}
                  <div className="mb-6 border-t border-gray-100 pt-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection("terms")}
                    >
                      <h3 className="text-xl font-bold text-gray-800">Terms & Conditions</h3>
                      {expandedSections.terms ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSections.terms && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-gray-600 leading-relaxed"
                      >
                        <p>{service.termsAndCondition}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Cancellation policy section */}
                  <div className="mb-6 border-t border-gray-100 pt-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection("cancellation")}
                    >
                      <h3 className="text-xl font-bold text-gray-800">Cancellation Policy</h3>
                      {expandedSections.cancellation ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSections.cancellation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-gray-600 leading-relaxed"
                      >
                        <p>{service.cancellationPolicy}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "provider" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      {vendor?.profileImage ? (
                        <img
                          src={vendor?.profileImage}
                          alt={vendor?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{vendor?.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{vendor?.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{service.yearsOfExperience} years experience</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Professional service provider with {service.yearsOfExperience} years of experience in{" "}
                    {service?.category?.toLowerCase()}. Committed to delivering high-quality services that exceed client
                    expectations.
                  </p>
                  <button onClick={() => setShowVendorInfo(true)} className="text-blue-500 font-medium hover:text-blue-700 transition-colors">
                    View Full Profile
                  </button>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <ReviewDisplay 
                    title="What Our Customers Say" 
                    showAverage={true} 
                    reviews={reviews}
                    />
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Right column - Booking form */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              {/* Service Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <IndianRupee className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold text-gray-800">₹{service.servicePrice}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{service.serviceDuration}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Duration</h4>
                      <p className="text-sm text-gray-600">{service.serviceDuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Additional Hour</h4>
                      <p className="text-sm text-gray-600">₹{service.additionalHourFee} per hour</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Experience</h4>
                      <p className="text-sm text-gray-600">{service.yearsOfExperience} years</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Cancellation</h4>
                      <p className="text-sm text-gray-600">{service.cancellationPolicy.slice(0, 20)}...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <Formik
                initialValues={{ name: "", email: "", phone: "", date: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, action) => handleBookingService(values, action)}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <User className="h-4 w-4 mr-1" />
                        Full Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your name"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Number
                      </label>
                      <Field
                        type="tel"
                        name="phone"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                      />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Preferred Date
                      </label>
                      <Field
                        type="date"
                        name="date"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                      Book Now
                    </motion.button>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Not ready to book? Save this service for later</p>
                <button className="mt-2 text-blue-500 font-medium text-sm hover:text-blue-700 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
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
              <VendorDetailsPage vendor={vendor!} onClose={() => setShowVendorInfo(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}