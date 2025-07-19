import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Star, Send, MessageCircle, Sparkles } from "lucide-react"
import { useAddReviewMutation } from "@/hooks/ClientCustomHooks"
import toast from "react-hot-toast"
import { ReviewData } from "@/types/worksample/review"

interface ReviewFormProps {
  onSubmit: (data: ReviewData) => Promise<void> | void
  initialData?: Partial<ReviewData>
  targetId?: string
  targetType?: string
  isLoading?: boolean
  title?: string
  subtitle?: string
  placeholder?: string
  submitText?: string
  className?: string
}

interface ReviewFormValues {
  comment: string;
  rating: number;
}


const validationSchema = Yup.object({
  comment: Yup.string()
    .required("Please share your thoughts")
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be less than 500 characters"),
  rating: Yup.number()
    .required("Please select a rating")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
})

const StarRating: React.FC<{
  rating: number
  onRatingChange: (rating: number) => void
  size?: number
  interactive?: boolean
}> = ({ rating, onRatingChange, size = 32, interactive = true }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const starVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95, rotate: -5 },
    filled: { scale: 1.05 },
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating)
        return (
          <motion.button
            key={star}
            type="button"
            variants={starVariants}
            initial="initial"
            whileHover={interactive ? "hover" : "initial"}
            whileTap={interactive ? "tap" : "initial"}
            animate={isFilled ? "filled" : "initial"}
            onClick={() => interactive && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-colors duration-200 ${interactive ? "cursor-pointer" : "cursor-default"}`}
            disabled={!interactive}
          >
            <Star
              size={size}
              className={`transition-all duration-200 ${
                isFilled ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  initialData = {},
  targetId,
  targetType,
  isLoading = false,
  title = "Share Your Experience",
  subtitle = "Your feedback helps us improve and helps others make informed decisions",
  placeholder = "Tell us about your experience... What did you like? What could be improved?",
  submitText = "Submit Review",
  className = "",
}) => {
  const initialValues: ReviewData = {
    comment: initialData.comment || "",
    rating: initialData.rating || 0,
  }

  const addReviewMutation = useAddReviewMutation()

  const handleSubmitReview = (values: ReviewFormValues, action: any) => {
    // action.setSubmitting(true)
    addReviewMutation.mutate(
      {
        comment: values.comment,
        rating: values.rating,
        targetType: targetType!,
        targetId: targetId!,
      },
    {
      onSuccess: (data) => {
        toast.success(data.message)
        action.setSubmitting(false)
      },
      onError: (error) => {
        toast.error(error.message)
        action.setSubmitting(false)
      }
    })
    action.resetForm()
    action.setSubmitting(false)
  }







  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const getRatingText = (rating: number) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    }
    return texts[rating as keyof typeof texts] || ""
  }

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-red-500"
    if (rating === 3) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto ${className}`}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <MessageCircle size={24} className="text-white" />
          </div>
          <Sparkles size={20} className="text-yellow-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </motion.div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            onSubmit(values)
            await handleSubmitReview(values, { setSubmitting })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8">
            {/* Rating Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <label className="block text-lg font-semibold text-gray-700">How would you rate your experience? *</label>

              <div className="flex flex-col items-center space-y-4">
                <StarRating
                  rating={values.rating}
                  onRatingChange={(rating) => setFieldValue("rating", rating)}
                  size={40}
                />

                <AnimatePresence mode="wait">
                  {values.rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      <span className={`text-xl font-semibold ${getRatingColor(values.rating)}`}>
                        {getRatingText(values.rating)}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{values.rating} out of 5 stars</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ErrorMessage name="rating" component="div" className="text-red-500 text-sm text-center" />
            </motion.div>

            {/* Comment Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <label htmlFor="comment" className="block text-lg font-semibold text-gray-700">
                Share your thoughts *
              </label>

              <div className="relative">
                <Field
                  as="textarea"
                  name="comment"
                  rows={5}
                  placeholder={placeholder}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 resize-none placeholder-gray-400"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">{values.comment.length}/500</div>
              </div>

              <ErrorMessage name="comment" component="div" className="text-red-500 text-sm" />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting || isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send size={20} />
                      {submitText}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </Form>
        )}
      </Formik>

      {/* Rating Guide */}
      <motion.div variants={itemVariants} className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Guide:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          {[
            { stars: 1, label: "Poor", desc: "Unsatisfactory" },
            { stars: 2, label: "Fair", desc: "Below expectations" },
            { stars: 3, label: "Good", desc: "Meets expectations" },
            { stars: 4, label: "Very Good", desc: "Exceeds expectations" },
            { stars: 5, label: "Excellent", desc: "Outstanding" },
          ].map((item) => (
            <div key={item.stars} className="text-center p-2">
              <div className="flex justify-center mb-1">
                <StarRating rating={item.stars} onRatingChange={() => {}} size={16} interactive={false} />
              </div>
              <div className="font-medium text-gray-700">{item.label}</div>
              <div className="text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ReviewForm
