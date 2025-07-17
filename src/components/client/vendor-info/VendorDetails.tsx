import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, Star, Eye, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { useGetAllWorkSamplesByVendorIdMutation } from "@/hooks/ClientCustomHooks"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"

interface WorkSample {
  _id: string
  title: string
  description: string
  images: string[]
}

interface Vendor {
  _id?: string
  userId?:string
  name: string
  profileImage?: string
  phone?: string
  email?: string
  location?: string
  rating?: number
  totalReviews?: number
  specialties?: string[]
  bio?: string
  workSamples?: WorkSample[]
}

interface VendorDetailsPageProps {
  vendor: Vendor
  onClose: () => void
}


const ImageGallery: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

 
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }


  

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.slice(0, 6).map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={CLOUDINARY_BASE_URL+image || "/placeholder.svg?height=200&width=200"}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
              <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={24} />
            </div>
            {index === 5 && images.length > 6 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 6}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={CLOUDINARY_BASE_URL+images[selectedImage] || "/placeholder.svg"}
                alt={`${title} ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const VendorDetailsPage: React.FC<VendorDetailsPageProps> = ({ vendor , onClose }) => {
  const getAllWorkSamplesByVendorIdMutation = useGetAllWorkSamplesByVendorIdMutation()
  const [workSamples,setWorkSamples] = useState<WorkSample[]>([])

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

console.log('vendor',vendor)

  useEffect(() => {
    getAllWorkSamplesByVendorIdMutation.mutate(
      {
          page:1,
          limit:10,
          vendorId:vendor.userId!
       },
      {
        onSuccess: (data) => {
          console.log('work samples',data)
          setWorkSamples(data.workSamples.workSamples)
        },
        onError: (error) => {
          console.log('error while client get all work samples',error)
        }
      }
    )
  }, [vendor])


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
    >
      {/* Hero Section */}
      <motion.div
        variants={heroVariants}
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="fixed top-2 right-5 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </motion.button>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src={CLOUDINARY_BASE_URL + vendor?.profileImage || "/placeholder.svg?height=200&width=200"}
                  alt={vendor?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Vendor Info */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl font-bold mb-4"
              >
                {vendor?.name}
              </motion.h1>

              {vendor?.bio && (
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl text-white/90 mb-6 max-w-2xl"
                >
                  {vendor?.bio}
                </motion.p>
              )}

              {/* Rating */}
              {vendor?.rating && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center gap-2 justify-center lg:justify-start mb-6"
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={`${
                          star <= vendor?.rating! ? "text-yellow-400 fill-yellow-400" : "text-white/30"
                        } transition-colors`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">{vendor?.rating?.toFixed(1)}</span>
                  {vendor?.totalReviews && <span className="text-white/80">({vendor?.totalReviews} reviews)</span>}
                </motion.div>
              )}

              {/* Specialties */}
              {vendor?.specialties && vendor?.specialties.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6"
                >
                  {vendor?.specialties?.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <a
                  href={`tel:${vendor?.phone}`}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <Phone size={18} />
                  {vendor?.phone}
                </a>
                {vendor?.email && (
                  <a
                    href={`mailto:${vendor?.email}`}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Mail size={18} />
                    {vendor?.email}
                  </a>
                )}
                {vendor.location && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <MapPin size={18} />
                    {vendor.location}
                  </div>
                )}
              </motion.div>
            </div>  
          </div>
        </div>
      </motion.div>

      {/* Work Samples Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Portfolio & Work Samples</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our featured projects and see the quality of work we deliver to our clients
          </p>
        </motion.div>

        {workSamples?.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No work samples available</h3>
              <p className="text-gray-500">This vendor hasn't uploaded any work samples yet.</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {workSamples?.map((sample, index) => (
              <motion.div
                key={sample._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Work Sample Images */}
                <div className="p-6 pb-4">
                  <ImageGallery images={sample.images} title={sample.title} />
                </div>

                {/* Work Sample Content */}
                <div className="p-6 pt-2">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{sample.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{sample.description}</p>

                  {/* Project Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>{sample.images.length} images</span>
                    <span>Project #{index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact CTA Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Get in touch to discuss your project and see how we can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href={`tel:${vendor.phone}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call Now
            </motion.a>
            {vendor.email && (
              <motion.a
                href={`mailto:${vendor.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border border-white/20"
              >
                <Mail size={20} />
                Send Email
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VendorDetailsPage
