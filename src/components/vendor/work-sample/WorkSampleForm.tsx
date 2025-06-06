import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik"
import * as Yup from "yup"
import { X, Plus, Upload, ImageIcon, ArrowLeft, Save } from "lucide-react"
import { WorkSample } from "@/types/worksample/work-sample"

interface WorkSampleFormProps {
  initialData?: WorkSample
  onSubmit: (data: WorkSample) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  images: Yup.array()
    // .of(Yup.string().url("Must be a valid URL"))
    .min(1, "At least one image is required")
    .required("Images are required"),
})

const WorkSampleForm: React.FC<WorkSampleFormProps> = ({ initialData, onSubmit, onCancel, isEditing = false }) => {
  const [dragOver, setDragOver] = useState(false)

  const initialValues: WorkSample = initialData || {
    title: "",
    description: "",
    images: [""],
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, push: (obj: string) => void) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            push(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </motion.button>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              {isEditing ? "Edit Work Sample" : "Add New Work Sample"}
            </h1>
            <p className="text-slate-600">
              {isEditing ? "Update your work sample details" : "Showcase your best work to potential clients"}
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              onSubmit(values)
              setSubmitting(false)
            }}
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Title Field */}
                <motion.div variants={fieldVariants} className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                    Project Title *
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter your project title..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                </motion.div>

                {/* Description Field */}
                <motion.div variants={fieldVariants} className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                    Project Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Describe your project, the challenges you solved, technologies used..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </motion.div>

                {/* Images Field */}
                <motion.div variants={fieldVariants} className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">Project Images *</label>

                  <FieldArray name="images">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.images.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-3 items-start"
                          >
                            <div className="flex-1">
                              <Field
                                name={`images.${index}`}
                                type="url"
                                placeholder="Enter image URL or upload below..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700"
                              />
                              <ErrorMessage
                                name={`images.${index}`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {image && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                                <img
                                  src={image || "/placeholder.svg?height=64&width=64"}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {values.images.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X size={20} />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}

                        {/* Upload Area */}
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                            dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault()
                            setDragOver(true)
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setDragOver(false)
                            const files = e.dataTransfer.files
                            if (files) {
                              Array.from(files).forEach((file) => {
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                  if (e.target?.result) {
                                    push(e.target.result as string)
                                  }
                                }
                                reader.readAsDataURL(file)
                              })
                            }
                          }}
                        >
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                              <ImageIcon size={24} className="text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-600 mb-2">Drag and drop images here, or</p>
                              <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                <Upload size={16} />
                                Choose Files
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, push)}
                                />
                              </label>
                            </div>
                          </div>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => push("")}
                          className="w-full py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Add Another Image URL
                        </motion.button>
                      </div>
                    )}
                  </FieldArray>
                </motion.div>

                {/* Submit Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4 pt-6 border-t border-slate-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {isSubmitting ? "Saving..." : isEditing ? "Update Sample" : "Add Sample"}
                  </motion.button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WorkSampleForm
