"use client"
import { motion } from "framer-motion"
import { Info, Type, FileText, Tag } from "lucide-react"
import { Field, ErrorMessage, type FieldInputProps } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type {  EventFormErrors, EventFormTouched } from "@/types/event"

interface EventDetailsTabProps {
  errors: EventFormErrors
  touched: EventFormTouched
  setFieldValue: (field: string, value: string) => void
}

const eventCategories = [
  "music",
  "sports",
  "arts",
  "food",
  "business",
  "technology", 
  "education",
  "wellness"
]
const eventStatuses = ["upcoming", "ongoing", "cancelled"]

export default function EventDetailsTab({ errors, touched, setFieldValue }: EventDetailsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Event Information Section */}
      <Card className="border-2 border-sky-100 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-100 via-indigo-50 to-purple-50 border-b-2 border-sky-100 py-8">
          <CardTitle className="text-2xl font-bold text-sky-800 flex items-center">
            <div className="bg-sky-500 p-3 rounded-xl mr-4 shadow-lg">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Event Information</span>
              <Info className="inline-block ml-2 h-5 w-5 text-sky-500" />
            </div>
          </CardTitle>
          <CardDescription className="text-sky-600 text-lg mt-2 ml-16">
            Tell us about your amazing event
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-10">
          {/* Event Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sky-800 font-semibold text-lg flex items-center">
              <span className="bg-sky-100 p-2 rounded-lg mr-3">
                <Type className="h-4 w-4 text-sky-600" />
              </span>
              Event Title
            </Label>
            <Field name="title">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Input
                  id="title"
                  placeholder="Enter your event title..."
                  {...field}
                  className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                    errors.title && touched.title
                      ? "border-red-300 bg-red-50 focus:border-red-400"
                      : "border-sky-200 focus:border-sky-400"
                  }`}
                />
              )}
            </Field>
            <ErrorMessage name="title" component="div" className="text-red-500 text-sm font-medium animate-pulse" />
          </div>

          {/* Event Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sky-800 font-semibold text-lg flex items-center">
              <span className="bg-sky-100 p-2 rounded-lg mr-3">
                <FileText className="h-4 w-4 text-sky-600" />
              </span>
              Event Description
            </Label>
            <Field name="description">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail..."
                  rows={6}
                  {...field}
                  className={`text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 resize-none ${
                    errors.description && touched.description
                      ? "border-red-300 bg-red-50 focus:border-red-400"
                      : "border-sky-200 focus:border-sky-400"
                  }`}
                />
              )}
            </Field>
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm font-medium animate-pulse"
            />
          </div>

          {/* Event Category */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sky-800 font-semibold text-lg flex items-center">
              <span className="bg-sky-100 p-2 rounded-lg mr-3">
                <Tag className="h-4 w-4 text-sky-600" />
              </span>
              Event Category
            </Label>
            <Field name="category">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Select value={field.value} onValueChange={(value) => setFieldValue("category", value)}>
                  <SelectTrigger
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.category && touched.category
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  >
                    <SelectValue placeholder="Select event category..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {eventCategories.map((category) => (
                      <SelectItem key={category} value={category} className="text-base py-3">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm font-medium animate-pulse" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="status" className="text-sky-800 font-semibold text-lg flex items-center">
              <span className="bg-sky-100 p-2 rounded-lg mr-3">
                <Info className="h-4 w-4 text-sky-600" />
              </span>
              Event Status
            </Label>
            <Field name="status">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Select value={field.value} onValueChange={(value) => setFieldValue("status", value)}>
                  <SelectTrigger
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.status && touched.status
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  >
                    <SelectValue placeholder="Select event status..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {eventStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="text-base py-3 capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="status" component="div" className="text-red-500 text-sm font-medium animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
