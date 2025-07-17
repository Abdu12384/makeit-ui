import { useState, useEffect, useCallback } from "react"
import {motion } from "framer-motion"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useClientGetServiceByIdMutation, useGetAllReviewsMutation } from "@/hooks/ClientCustomHooks"
import { IVendor } from "@/types/User"
import Navbar from "@/components/common/NavBar"
import ReviewDisplay from "@/components/common/review/review-display"
import { ReviewData } from "@/types/worksample/review"
import { Service } from "@/types/service"
import { containerVariants, itemVariants } from "@/animations/variants"
import { VendorDetailsDialog } from "@/components/client/vendor-info/VendorInfoDialog"
import { ServiceDetailsSkeleton } from "@/components/common/skelton/SkeltonLoading"
import { ServiceNF } from "@/components/common/NotFound/ItemsNotFound"
import { BookingFormComponent } from "@/components/client/service/ServiceBookingForm"

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vendor, setVendor] = useState<IVendor | null>(null)
  const [activeTab, setActiveTab] = useState("description")
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [showVendorInfo, setShowVendorInfo] = useState(false)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    terms: false,
    cancellation: false,
  })

  const navigate = useNavigate()
  const clientGetServiceByIdMutation = useClientGetServiceByIdMutation()

  const handleBookingSuccess = useCallback(() => {

    setTimeout(() => {
      navigate(`/services`); 
    }, 1000);
  }, [navigate])

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
          onError: (error) => {
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


  if (isLoading) {
    return <ServiceDetailsSkeleton/>
  }
  if (!service) {
    return <ServiceNF/>
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

          <motion.div variants={itemVariants}>
            {service && vendor ? (
              <BookingFormComponent
                serviceId={service.serviceId}
                vendorId={vendor.userId!}
                servicePrice={service.servicePrice}
                serviceDuration={service.serviceDuration}
                additionalHourFee={service.additionalHourFee}
                yearsOfExperience={service.yearsOfExperience}
                cancellationPolicySnippet={service.cancellationPolicy.slice(0, 50) + '...'}
                onBookingSuccess={handleBookingSuccess}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6 text-center text-gray-500">
                Booking form could not be loaded. Service or vendor data is missing.
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      <VendorDetailsDialog
            isOpen={showVendorInfo}
            onClose={() => setShowVendorInfo(false)}
            vendor={vendor || null} 
          />
    </>
  )
}