"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImageIcon, Ticket, Upload, Trash2 } from "lucide-react"
import { FieldArray, Field, ErrorMessage, type FieldInputProps, type FieldArrayRenderProps, FormikErrors } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"
import toast from "react-hot-toast"
import type {
  IEvent,
  IEventFormTouched,
  UploadMutation,
} from "@/types/event"

interface MediaTicketsTabProps {
  values: IEvent
  errors:FormikErrors<IEvent>
  touched: IEventFormTouched
  setFieldValue: (field: string, value: string | number) => void
  uploadToCloudinary: UploadMutation
  eventData?: IEvent
  isEditing: boolean
}

export default function MediaTicketsTab({
  values,
  errors,
  touched,
  setFieldValue,
  uploadToCloudinary,
  eventData,
  isEditing,
}: MediaTicketsTabProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, push: (obj: string) => void) => {
    const files = Array.from(e.target.files || [])

    if (files.length + values.posterImage.length > 5) {
      toast.error("Cannot upload more than 5 images")
      return
    }

    for (const file of files) {
      const localUrl = URL.createObjectURL(file)
      push(localUrl)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Images Section */}
      <Card className="border-2 border-sky-100 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-100 via-indigo-50 to-purple-50 border-b-2 border-sky-100 py-8">
          <CardTitle className="text-2xl font-bold text-sky-800 flex items-center">
            <div className="bg-sky-500 p-3 rounded-xl mr-4 shadow-lg">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Event Images</span>
              <ImageIcon className="inline-block ml-2 h-5 w-5 text-sky-500" />
            </div>
          </CardTitle>
          <CardDescription className="text-sky-600 text-lg mt-2 ml-16">
            Upload poster images for your event (max 5 images)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-10">
          <FieldArray name="posterImage">
            {({ remove, push }: FieldArrayRenderProps) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {values.posterImage.map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={
                            image.startsWith("http") || image.startsWith("data:image") || image.startsWith("blob:")
                              ? image
                              : `${CLOUDINARY_BASE_URL}/${image}`
                          }
                          alt={`Event poster ${index + 1}`}
                          className="w-full h-56 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 border-2 border-sky-100"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                          onClick={() => remove(index)}
                          disabled={values.posterImage.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {values.posterImage.length < 5 && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleFileChange(e, push)}
                        multiple={values.posterImage.length < 4}
                        onClick={(e) => {
                          e.currentTarget.value = ""
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-40 border-dashed border-2 border-sky-300 hover:bg-sky-50 text-sky-700 transition-all duration-300 bg-white"
                        disabled={uploadToCloudinary.isPending}
                      >
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-sky-500 mb-4" />
                          <p className="text-lg font-semibold">
                            {uploadToCloudinary.isPending ? "Uploading..." : "Add Images"}
                          </p>
                          <p className="text-sm text-sky-500 mt-2">{5 - values.posterImage.length} remaining</p>
                        </div>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </FieldArray>

          <ErrorMessage name="posterImage" component="div" className="text-red-500 text-sm font-medium animate-pulse" />
        </CardContent>
      </Card>

      {/* Ticket Information Section */}
      <Card className="border-2 border-sky-100 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-100 via-indigo-50 to-purple-50 border-b-2 border-sky-100 py-8">
          <CardTitle className="text-2xl font-bold text-sky-800 flex items-center">
            <div className="bg-sky-500 p-3 rounded-xl mr-4 shadow-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Ticket Information</span>
              <Ticket className="inline-block ml-2 h-5 w-5 text-sky-500" />
            </div>
          </CardTitle>
          <CardDescription className="text-sky-600 text-lg mt-2 ml-16">
            Set pricing and availability for your event tickets
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label htmlFor="pricePerTicket" className="text-sky-800 font-semibold text-lg flex items-center">
                <span className="bg-sky-100 p-2 rounded-lg mr-3">💰</span>
                Price Per Ticket (₹)
              </Label>
              <Field name="pricePerTicket">
                {({ field }: { field: FieldInputProps<string> }) => (
                  <Input
                    id="pricePerTicket"
                    type="number"
                    disabled={isEditing}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => setFieldValue("pricePerTicket", Number.parseFloat(e.target.value) || 0)}
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.pricePerTicket && touched.pricePerTicket
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="pricePerTicket"
                component="div"
                className="text-red-500 text-sm font-medium animate-pulse"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="totalTicket" className="text-sky-800 font-semibold text-lg flex items-center">
                <span className="bg-sky-100 p-2 rounded-lg mr-3">🎫</span>
                Total Tickets
              </Label>
              <Field name="totalTicket">
                {({ field }: { field: FieldInputProps<string> }) => (
                  <Input
                    id="totalTicket"
                    type="number"
                    min={isEditing ? eventData?.ticketPurchased || 1 : 1}
                    placeholder="100"
                    {...field}
                    onChange={(e) => setFieldValue("totalTicket", Number.parseInt(e.target.value) || 0)}
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.totalTicket && touched.totalTicket
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="totalTicket"
                component="div"
                className="text-red-500 text-sm font-medium animate-pulse"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxTicketsPerUser" className="text-sky-800 font-semibold text-lg flex items-center">
                <span className="bg-sky-100 p-2 rounded-lg mr-3">👤</span>
                Max Per User
              </Label>
              <Field name="maxTicketsPerUser">
                {({ field }: { field: FieldInputProps<string> }) => (
                  <Input
                    id="maxTicketsPerUser"
                    type="number"
                    min="1"
                    placeholder="4"
                    {...field}
                    onChange={(e) => setFieldValue("maxTicketsPerUser", Number.parseInt(e.target.value) || 0)}
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.maxTicketsPerUser && touched.maxTicketsPerUser
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="maxTicketsPerUser"
                component="div"
                className="text-red-500 text-sm font-medium animate-pulse"
              />
            </div>
          </div>

          {isEditing && eventData && eventData.ticketPurchased! < eventData.totalTicket && (
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6 rounded-2xl border-2 border-sky-200">
              <p className="text-sky-800 font-medium">
                <strong>📝 Note:</strong> {eventData.ticketPurchased} tickets already sold. You can only increase the
                total.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
