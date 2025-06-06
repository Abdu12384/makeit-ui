
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { X, ArrowRight, ArrowLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServiceFormValues } from "@/types/service"
import { useCreateServiceMutation, useGetAllCategoriesMutation, useUpdateServiceMutation } from "@/hooks/VendorCustomHooks"
import toast from "react-hot-toast"

interface ServiceAddFormProps {
  onClose: () => void
  onSubmit?: (values: ServiceFormValues) => void
  initialData?: ServiceFormValues
  isEdit?: boolean
  refetchServices?: () => void// <--- new
}

// Validation schemas for each step
const step1ValidationSchema = Yup.object({
  serviceTitle: Yup.string().required("Service title is required"),
  yearsOfExperience: Yup.number()
    .required("Years of experience is required")
    .min(0, "Experience cannot be negative")
    .max(100, "Experience seems too high"),
  availableDates: Yup.array().of(Yup.string()).min(1, "At least one available date is required"),
  categoryId: Yup.string().required("Category is required"),
  serviceDescription: Yup.string()
    .required("Service description is required")
    .min(20, "Description should be at least 20 characters"),
})

const step2ValidationSchema = Yup.object({
  cancellationPolicy: Yup.string().required("Cancellation policy is required"),
  termsAndCondition: Yup.string().required("Terms and conditions are required"),
  serviceDuration: Yup.number()
    .required("Service duration is required")
    .min(0.5, "Duration must be at least 30 minutes")
    .max(24, "Duration cannot exceed 24 hours"),
  servicePrice: Yup.number().required("Service price is required").min(1, "Price must be at least $1"),
  additionalHourFee: Yup.number().required("Additional hour price is required").min(0, "Price cannot be negative"),
})

// Default initial values for adding a new service
const defaultInitialValues: ServiceFormValues = {
  serviceTitle: "",
  yearsOfExperience: 0,
  categoryId: "",
  serviceDescription: "",
  cancellationPolicy: "",
  termsAndCondition: "",
  serviceDuration: 1,
  servicePrice: 0,
  additionalHourFee: 0,
};

export const  ServiceAddForm = ({ onClose, onSubmit, initialData, isEdit, refetchServices }: ServiceAddFormProps) => {
  console.log('isEding',isEdit)
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<any[]>([])

  const createServiceMutation = useCreateServiceMutation()
  const getAllCategoriesMutation = useGetAllCategoriesMutation()
 const updateServiceMutation = useUpdateServiceMutation()

  const initialValues: ServiceFormValues = isEdit && initialData ? 
  { ...initialData } 
  : { ...defaultInitialValues };

console.log('initialValues',initialValues)

  useEffect(() => {
    if (!isEdit) {
      setStep(1); 
    }
  }, [isEdit]);

  useEffect(() => {
    getAllCategoriesMutation.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Categories fetched successfully:", data.categories)
        setCategories(data.categories?.items || [])
      },
      onError: (error) => {
        console.log("Error fetching categories:", error)
        toast.error("Failed to fetch categories")
      },
    })
  }, []);

  const handleSubmit = (values: ServiceFormValues, actions: FormikHelpers<ServiceFormValues>) => {
    console.log(values)
    if (step === 1) {
      setStep(2)
      actions.setTouched({})
      actions.setSubmitting(false)
    } else {
      if (isEdit &&values.serviceId) {
        console.log('serviceId',values)
        updateServiceMutation.mutate({serviceId:values.serviceId,data:values}, {
          onSuccess: (data) => {
            console.log("Service updated successfully:", data)
            toast.success(data.message || "Service updated successfully")
            actions.resetForm({ values: defaultInitialValues }) 
            actions.setSubmitting(false)
            onSubmit?.(values)
            onClose()
            refetchServices?.()
          },
          onError: (error: any) => {
            console.error("Error updating service:", error)
            toast.error(error.response?.data?.message || "Failed to update service")
            actions.setSubmitting(false)
          },
        })

      } else {
        console.log('adding',values)
        createServiceMutation.mutate(values, {
          onSuccess: (data) => {
            console.log("Service created successfully:", data)
            toast.success(data.message || "Service created successfully")
            actions.resetForm({ values: defaultInitialValues }) 
            actions.setSubmitting(false)
            onSubmit?.(values)
            onClose()
            refetchServices?.()
            },  
          onError: (error: any) => {
            console.error("Error submitting service:", error)
            toast.error(error.response?.data?.message || "Failed to create service")
            actions.setSubmitting(false)
          },
        })
      }
    }
  };



  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit 
                ? (step === 1 ? "Edit Service" : "Edit Service Details")
                : (step === 1 ? "Add New Service" : "Service Details")
              }
            </h2>
            <p className="text-sm text-gray-500">
              Step {step} of 2: {step === 1 ? "Basic Information" : "Pricing & Policies"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={step === 1 ? step1ValidationSchema : step2ValidationSchema}
          enableReinitialize={true}
        >
          {({ isSubmitting, errors, touched, setFieldValue, values, resetForm }) => (
            <Form className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="serviceTitle">
                          Service Title <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="serviceTitle"
                          name="serviceTitle"
                          placeholder="e.g. Professional Web Development"
                          className={errors.serviceTitle && touched.serviceTitle ? "border-red-500" : ""}
                        />
                        <ErrorMessage name="serviceTitle" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">
                          Years of Experience <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          type="number"
                          min="0"
                          placeholder="e.g. 5"
                          className={errors.yearsOfExperience && touched.yearsOfExperience ? "border-red-500" : ""}
                        />
                        <ErrorMessage name="yearsOfExperience" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoryId">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <div className="flex-grow">
                            <Select onValueChange={(value) => setFieldValue("categoryId", value)} value={values.categoryId}>
                              <SelectTrigger className={errors.categoryId && touched.categoryId ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.length > 0 ? (
                                  categories.map((category) =>
                                    category.categoryId && category.title ? (
                                      <SelectItem key={category.categoryId} value={category.categoryId}>
                                        {category.title}
                                      </SelectItem>
                                    ) : null
                                  )
                                ) : (
                                  <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <ErrorMessage name="categoryId" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceDescription">
                          Service Description <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Textarea}
                          id="serviceDescription"
                          name="serviceDescription"
                          placeholder="Describe your service in detail..."
                          rows={4}
                          className={errors.serviceDescription && touched.serviceDescription ? "border-red-500" : ""}
                        />
                        <ErrorMessage name="serviceDescription" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="cancellationPolicy">
                          Cancellation Policy <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Textarea}
                          id="cancellationPolicy"
                          name="cancellationPolicy"
                          placeholder="Describe your cancellation policy..."
                          rows={3}
                          className={errors.cancellationPolicy && touched.cancellationPolicy ? "border-red-500" : ""}
                        />
                        <ErrorMessage name="cancellationPolicy" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="termsAndCondition">
                          Terms & Conditions <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Textarea}
                          id="termsAndCondition"
                          name="termsAndCondition"
                          placeholder="Outline your terms and conditions..."
                          rows={3}
                          className={errors.termsAndCondition && touched.termsAndCondition ? "border-red-500" : ""}
                        />
                        <ErrorMessage name="termsAndCondition" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="serviceDuration">
                            Service Duration (hours) <span className="text-red-500">*</span>
                          </Label>
                          <Field
                            as={Input}
                            id="serviceDuration"
                            name="serviceDuration"
                            type="number"
                            min="0.5"
                            step="0.5"
                            placeholder="e.g. 2"
                            className={errors.serviceDuration && touched.serviceDuration ? "border-red-500" : ""}
                          />
                          <ErrorMessage name="serviceDuration" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="servicePrice">
                            Service Price (₹) <span className="text-red-500">*</span>
                          </Label>
                          <Field
                            as={Input}
                            id="servicePrice"
                            name="servicePrice"
                            type="number"
                            min="1"
                            placeholder="e.g. 75"
                            className={errors.servicePrice && touched.servicePrice ? "border-red-500" : ""}
                          />
                          <ErrorMessage name="servicePrice" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalHourFee">
                          Additional Hour Fee (₹) <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="additionalHourFee"
                          name="additionalHourFee"
                          type="number"
                          min="0"
                          placeholder="e.g. 50"
                          className={errors.additionalHourFee && touched.additionalHourFee ? "border-red-500" : ""}
                        />
                        <ErrorMessage
                          name="additionalHourFee"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Pricing Information</h4>
                          <p className="text-sm text-blue-600 mt-1">
                            Set your base price for the specified duration. Additional hours will be charged at the rate
                            you specify.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-between">
                {step === 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      resetForm({ values: defaultInitialValues }); 
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${step === 2 ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {step === 1 ? (
                    <>
                      Next <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    isEdit ? "Update Service" : "Submit Service"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  )
}