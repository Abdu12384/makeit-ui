 "use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, type FormikHelpers } from "formik"
import { motion } from "framer-motion"
import { Info, CalendarIcon, ImageIcon, ArrowLeft, ArrowRight } from "lucide-react"
import {  NewEventValidationSchema } from "@/utils/validationForms/event-form.validation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useCreateEventMutation,
  useEditEventMutation,
  useUploadeImageToCloudinaryMutation,
} from "@/hooks/VendorCustomHooks"
import toast from "react-hot-toast"
import EventDetailsTab from "./EventDetailsTap"
import DateTimeLocationTab from "./DateTimeAndLocation"
import MediaTicketsTab from "./MediaTicketsTap"
import type {
  DateTimeEntry,
  NewEventData,
  NewEventFormValues,
} from "@/types/event"

interface EventFormPageProps {
  eventData?: NewEventData
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EventFormTabs({ eventData, onSuccess, onCancel }: EventFormPageProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("details")
  const [mounted, setMounted] = useState(false)
  const [dateTimeEntries, setDateTimeEntries] = useState<DateTimeEntry[]>([
    { date: new Date(), startTime: "", endTime: "" },
  ])

  const createEventMutation = useCreateEventMutation() 
  const uploadToCloudinary = useUploadeImageToCloudinaryMutation() 
  const editEventMutation = useEditEventMutation() 

  const isEditing = !!eventData

  const tabs = [
    { id: "details", label: "Event Details", icon: Info },
    { id: "datetime", label: "Date & Location", icon: CalendarIcon },
    { id: "media", label: "Images & Tickets", icon: ImageIcon },
  ]

  useEffect(() => {
    setMounted(true)
    if (eventData) {
      const entries = eventData.date.map((item:any) => ({
        date: new Date(item.date),
        startTime: item.startTime,
        endTime: item.endTime,
      }))
      setDateTimeEntries(entries.length > 0 ? entries : [{ date: new Date(), startTime: "", endTime: "" }])
    }
  }, [eventData])


  const initialValues: NewEventFormValues = eventData
    ? {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        venueName: eventData.venueName,
        address: eventData.address,
        location: {
          type: "Point",
          coordinates: eventData.location.coordinates,
        },
        posterImage: eventData.posterImage,
        pricePerTicket: eventData.pricePerTicket,
        totalTicket: eventData.totalTicket,
        maxTicketsPerUser: eventData.maxTicketsPerUser,
        status: eventData.status,
        date: dateTimeEntries.map((entry) => ({
          date: new Date(entry?.date),
          startTime: entry?.startTime,
          endTime: entry?.endTime,
        })),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
      }
    : {
        title: "",
        description: "",
        category: "",
        venueName: "",
        address: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        posterImage: [],
        pricePerTicket: 0,
        totalTicket: 100,
        maxTicketsPerUser: 4,
        status: "upcoming",
        date: [
          {
            date: new Date(),
            startTime: "",
            endTime: "",
          },
        ],
        startTime: "",
        endTime: "",
      }

  const handleSubmit = async (values: NewEventFormValues, { setSubmitting }: FormikHelpers<NewEventFormValues>) => {
    try {
      setSubmitting(true)

      const validEntries = dateTimeEntries.filter((entry) => entry.date && entry.startTime && entry.endTime)

      if (validEntries.length === 0) {
        toast.error("Please add at least one valid date and time")
        setSubmitting(false)
        return
      }

      const cloudinaryUrls: string[] = []
      for (const imageUrl of values.posterImage) {
        const isLocalBlob = imageUrl.startsWith("blob:")
        const isBase64Image = imageUrl.startsWith("data:image")
        const isAlreadyUploaded = !isLocalBlob && !isBase64Image && imageUrl.includes("/")

        if (isLocalBlob || isBase64Image) {
          const imageBlob = await fetch(imageUrl).then((r) => r.blob())
          const imageFile = new File([imageBlob], "event-image.jpg", { type: "image/jpeg" })
          const cloudinaryFormData = new FormData()
          cloudinaryFormData.append("file", imageFile)
          cloudinaryFormData.append("upload_preset", "vendor_id")

          const uploadResponse = await uploadToCloudinary.mutateAsync(cloudinaryFormData)
          const fullUrl = uploadResponse.secure_url
          const uniquePath = new URL(fullUrl).pathname.split("/image/upload/")[1]
          cloudinaryUrls.push(uniquePath)
        } else if (isAlreadyUploaded) {
          cloudinaryUrls.push(imageUrl)
        }
      }

      const finalValues = {
        ...values,
        posterImage: cloudinaryUrls,
        date: validEntries.map((entry) => ({
          date: new Date(entry.date),
          startTime: entry.startTime,
          endTime: entry.endTime,
        })),
        startTime: validEntries[0].startTime,
        endTime: validEntries[0].endTime,
        dateTimeEntries: validEntries,
      }

      console.log('event new data', finalValues)
      if (isEditing && eventData) {
        editEventMutation.mutate(
          { data: finalValues, eventId: eventData.eventId },
          {
            onSuccess: (response) => {
              toast.success(response.message)
              onSuccess?.()
            },
            onError: (error) => {
              toast.error(error?.message || "Failed to edit event")
              setSubmitting(false)
            },
          },
        )
      } else {
        createEventMutation.mutate(finalValues, {
          onSuccess: (response) => {
            toast.success(response.message)
            navigate("/vendor/events")
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to create event")
            setSubmitting(false)
          },
        })
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error("Failed to process request")
      setSubmitting(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(-1)
    }
  }

  const nextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const prevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="mr-4 border-sky-200 hover:bg-sky-50 transition-all duration-300 bg-transparent"
            >
              Back
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-800 to-indigo-800 bg-clip-text text-transparent">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h1>
          </div>
        </motion.div>

        <Formik initialValues={initialValues} validationSchema={NewEventValidationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Enhanced Tab Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-sky-100 p-2 rounded-2xl shadow-lg h-16">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex items-center justify-center space-x-3 py-4 px-6 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-sky-50 text-sky-700 font-medium"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="hidden sm:inline text-sm font-semibold">{tab.label}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </motion.div>

                {/* Tab Content with proper sizing */}
                <div className="w-full">
                  <TabsContent value="details" className="mt-0">
                    <EventDetailsTab errors={errors} touched={touched} setFieldValue={setFieldValue} />
                  </TabsContent>

                  <TabsContent value="datetime" className="mt-0">
                    <DateTimeLocationTab
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      dateTimeEntries={dateTimeEntries}
                      setDateTimeEntries={setDateTimeEntries}
                    />
                  </TabsContent>

                  <TabsContent value="media" className="mt-0">
                    <MediaTicketsTab
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      uploadToCloudinary={uploadToCloudinary}
                      eventData={eventData}
                      isEditing={isEditing}
                    />
                  </TabsContent>
                </div>

                {/* Enhanced Navigation Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row justify-between items-center mt-12 space-y-4 sm:space-y-0 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-100"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={activeTab === "details"}
                    className="border-sky-200 hover:bg-sky-50 transition-all duration-300 disabled:opacity-50 w-full sm:w-auto bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-sky-200 hover:bg-sky-50 transition-all duration-300 w-full sm:w-auto bg-transparent"
                    >
                      Cancel
                    </Button>

                    {activeTab === "media" ? (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 px-8 w-full sm:w-auto shadow-lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              {isEditing ? "Saving..." : "Creating..."}
                            </div>
                          ) : isEditing ? (
                            "Save Changes"
                          ) : (
                            "Create Event"
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextTab}
                        className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 w-full sm:w-auto shadow-lg"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </Tabs>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
