import type React from "react"
import { motion } from "framer-motion"
import { Star, User, Calendar } from "lucide-react"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"

interface Review {
  _id?: string
  comment: string
  rating: number
  reviewerName?: string
  reviewerAvatar?: string
  client?: {
    name?: string
    profileImage?: string
  }
  createdAt?: string
}

interface ReviewDisplayProps {
  title?: string
  showAverage?: boolean
  className?: string
  reviews?: Review[]
}

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } transition-colors duration-200`}
        />
      ))}
    </div>
  )
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  title = "Customer Reviews",
  showAverage = true,
  className = "",
  reviews
}) => {
  
 
  
  const averageRating =
  reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0


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
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        {showAverage && reviews?.length! > 0 && (
          <div className="flex items-center justify-center gap-3">
            <StarRating rating={Math.round(averageRating)} size={24} />
            <span className="text-xl font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({reviews?.length} reviews)</span>
          </div>
        )}
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews?.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-gray-500">No reviews yet. Be the first to share your experience!</div>
          </motion.div>
        ) : (
          reviews?.map((review) => (
            <motion.div
              key={review?._id}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {review?.client?.profileImage ? (
                    <img
                      src={CLOUDINARY_BASE_URL + review?.client?.profileImage || "/placeholder.svg"}
                      alt={review?.client?.name || "Reviewer"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-800">{review?.client?.name || "Anonymous"}</h4>
                    <StarRating rating={review.rating} />
                    {review.createdAt && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
                        <Calendar size={14} />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default ReviewDisplay
