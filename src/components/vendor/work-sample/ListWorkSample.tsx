import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Plus, Eye } from "lucide-react"
import { WorkSample } from "@/types/work-sample"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"

interface WorkSamplesListProps {
  workSamples: WorkSample[]
  onEdit: (workSample: WorkSample) => void
  onAdd: () => void
}

const WorkSamplesList: React.FC<WorkSamplesListProps> = ({ workSamples, onEdit, onAdd }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Work Samples</h1>
            <p className="text-slate-600">Manage your portfolio and showcase your best work</p>
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onAdd}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Work Sample
          </motion.button>
        </motion.div>

        {/* Work Samples Grid */}
        {workSamples.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No work samples yet</h3>
              <p className="text-slate-500 mb-6">Start building your portfolio by adding your first work sample</p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={onAdd}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Your First Sample
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {workSamples.map((sample) => (
              <motion.div
                key={sample.workSampleId}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              >
                {/* Image Gallery */}
                <div className="relative h-48 bg-slate-100">
                  {sample.images.length > 0 ? (
                    <div className="relative h-full">
                      <img
                        src={CLOUDINARY_BASE_URL + sample.images[0] || "/placeholder.svg?height=200&width=300"}
                        alt={sample.title}
                        className="w-full h-full object-cover"
                      />
                      {sample.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm">
                          +{sample.images.length - 1} more
                        </div>
                      )}
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedImage(sample.images[0])}
                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye size={16} className="text-slate-600" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-slate-400">No images</div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-1">{sample.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4">{sample.description}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => onEdit(sample)}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Work sample"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WorkSamplesList
