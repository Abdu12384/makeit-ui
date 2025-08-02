"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Clock, MapPin, Plus, Trash2 } from "lucide-react"
import { Field, ErrorMessage, type FieldInputProps } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import LocationPicker from "@/components/common/location/LocationPicker"// Assuming this is the correct path
import type { IEvent, IEventFormTouched, IDateTimeEntry } from "@/types/event"
import type { FormikErrors } from "formik"

interface DateTimeLocationTabProps {
  values: IEvent
  errors: FormikErrors<IEvent>
  touched: IEventFormTouched
  setFieldValue: (field: string, value: string | number | Date[] | [number, number] | IDateTimeEntry[]) => void
  dateTimeEntries: IDateTimeEntry[]
  setDateTimeEntries: React.Dispatch<React.SetStateAction<IDateTimeEntry[]>>
  isEditing: boolean
}

export default function DateTimeLocationTab({
  values,
  errors,
  touched,
  setFieldValue,
  dateTimeEntries,
  setDateTimeEntries,
  isEditing
}: DateTimeLocationTabProps) {
  const addDateTimeEntry = () => {
    if (dateTimeEntries.length < 5) {
      setDateTimeEntries([...dateTimeEntries, { date: new Date(), startTime: "", endTime: "" }])
    }
  }

  const removeDateTimeEntry = (index: number) => {
    if (dateTimeEntries.length > 1) {
      const newEntries = dateTimeEntries.filter((_, i) => i !== index)
      setDateTimeEntries(newEntries)
      // Update Formik's 'date' field to reflect the removed entry
      setFieldValue(
        "date",
        newEntries.map((entry) => ({ date: new Date(entry.date), startTime: entry.startTime, endTime: entry.endTime })),
      )
    }
  }

  const updateDateTimeEntry = (index: number, field: keyof IDateTimeEntry, value: Date | string) => {
    const newEntries = [...dateTimeEntries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setDateTimeEntries(newEntries)

    // Update Formik's 'date' field to reflect the change
    setFieldValue(
      "date",
      newEntries.map((entry) => ({ date: new Date(entry.date), startTime: entry.startTime, endTime: entry.endTime })),
    )

    // Also update top-level startTime/endTime if this is the first entry
    if (index === 0) {
      if (field === "startTime") {
        setFieldValue("startTime", value as string)
      } else if (field === "endTime") {
        setFieldValue("endTime", value as string)
      }
    }
  }

  const handleLocationSelect = (data: { lat: number; lng: number; address: string }) => {
    setFieldValue("location.coordinates", [data.lng, data.lat])
    setFieldValue("address", data.address)
  }


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Date & Time Section */}
      <Card className="border-2 border-sky-100 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-100 via-indigo-50 to-purple-50 border-b-2 border-sky-100 py-8">
          <CardTitle className="text-2xl font-bold text-sky-800 flex items-center">
            <div className="bg-sky-500 p-3 rounded-xl mr-4 shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Date & Time</span>
              <Clock className="inline-block ml-2 h-5 w-5 text-sky-500" />
            </div>
          </CardTitle>
          <CardDescription className="text-sky-600 text-lg mt-2 ml-16">
            When will your event take place?
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-10">
          <AnimatePresence>
            {dateTimeEntries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6 rounded-2xl border-2 border-sky-200 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-sky-800 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Event Date {index + 1}
                  </h3>
                  {dateTimeEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDateTimeEntry(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Date Picker */}
                  <div className="space-y-3">
                    <Label className="text-sky-800 font-semibold flex items-center">
                      <span className="bg-sky-100 p-2 rounded-lg mr-3">📅</span>
                      Event Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-14 text-lg justify-start text-left font-normal border-2 border-sky-200 hover:border-sky-400",
                            !entry.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {entry.date ? format( entry.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={entry.date}
                          onSelect={(date) => date && updateDateTimeEntry(index, "date", date)}
                          disabled={(date) => date < new Date()||isEditing}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage name={`date[${index}].date`} component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Start Time */}
                  <div className="space-y-3">
                    <Label className="text-sky-800 font-semibold flex items-center">
                      <span className="bg-sky-100 p-2 rounded-lg mr-3">🕐</span>
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      value={entry.startTime}
                      disabled={isEditing}
                      onChange={(e) => updateDateTimeEntry(index, "startTime", e.target.value)}
                      className="h-14 text-lg border-2 border-sky-200 focus:border-sky-400"
                    />
                    <ErrorMessage name={`date[${index}].startTime`} component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* End Time */}
                  <div className="space-y-3">
                    <Label className="text-sky-800 font-semibold flex items-center">
                      <span className="bg-sky-100 p-2 rounded-lg mr-3">🕕</span>
                      End Time
                    </Label>
                    <Input
                      type="time"
                      value={entry.endTime}
                      disabled={isEditing}
                      onChange={(e) => updateDateTimeEntry(index, "endTime", e.target.value)}
                      className="h-14 text-lg border-2 border-sky-200 focus:border-sky-400"
                    />
                    <ErrorMessage name={`date[${index}].endTime`} component="div" className="text-red-500 text-sm" />
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {dateTimeEntries.length < 5 && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                disabled={isEditing}
                onClick={addDateTimeEntry}
                className="w-full h-16 border-dashed border-2 border-sky-300 hover:bg-sky-50 text-sky-700 transition-all duration-300 bg-transparent"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Another Date & Time
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card className="border-2 border-sky-100 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-100 via-indigo-50 to-purple-50 border-b-2 border-sky-100 py-8">
          <CardTitle className="text-2xl font-bold text-sky-800 flex items-center">
            <div className="bg-sky-500 p-3 rounded-xl mr-4 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Event Location</span>
              <MapPin className="inline-block ml-2 h-5 w-5 text-sky-500" />
            </div>
          </CardTitle>
          <CardDescription className="text-sky-600 text-lg mt-2 ml-16">Where will your event be held?</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Venue Name */}
            <div className="space-y-3">
              <Label htmlFor="venueName" className="text-sky-800 font-semibold text-lg flex items-center">
                <span className="bg-sky-100 p-2 rounded-lg mr-3">🏢</span>
                Venue Name
              </Label>
              <Field name="venueName">
                {({ field }: { field: FieldInputProps<string> }) => (
                  <Input
                    id="venueName"
                    disabled={isEditing}
                    placeholder="Enter venue name..."
                    {...field}
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.venueName && touched.venueName
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="venueName"
                component="div"
                className="text-red-500 text-sm font-medium animate-pulse"
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <Label htmlFor="address" className="text-sky-800 font-semibold text-lg flex items-center">
                <span className="bg-sky-100 p-2 rounded-lg mr-3">📍</span>
                Address
              </Label>
              <Field name="address">
                {({ field }: { field: FieldInputProps<string> }) => (
                  <Input
                    id="address"
                    placeholder="Enter full address..."
                    {...field}
                    disabled={isEditing}
                    className={`h-14 text-lg transition-all duration-300 focus:ring-2 focus:ring-sky-300 border-2 ${
                      errors.address && touched.address
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-sky-200 focus:border-sky-400"
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm font-medium animate-pulse" />
            </div>
          </div>

          {/* Location Picker Integration */}
          <div className="pt-4">
            <LocationPicker
              mode={!isEditing ? "edit" : "view"}
              initialLat={values.location.coordinates[1]}
              initialLng={values.location.coordinates[0]}
              initialAddress={values.address}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
