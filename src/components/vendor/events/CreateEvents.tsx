import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, Clock, Trash2, Upload } from "lucide-react";
import { EventValidationSchema } from "@/utils/validationForms/event-form.validation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateEventMutation, useEditEventMutation, useUploadeImageToCloudinaryMutation } from "@/hooks/VendorCustomHooks";
import toast from "react-hot-toast";
import LocationPicker from "@/components/common/location/LocationPicker";
import { EventData } from "@/types/event";



interface EventFormPageProps {
  eventData?: EventData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EventFormPage({ eventData, onSuccess, onCancel }: EventFormPageProps) {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [mounted, setMounted] = useState(false);
  const createEventMutation = useCreateEventMutation();
  const uploadToCloudinary = useUploadeImageToCloudinaryMutation();
  const editEventMutation = useEditEventMutation();
  const isEditing = !!eventData;

  useEffect(() => {
    setMounted(true);
    if (eventData) {
      // Convert date strings to Date objects for editing
      const dates = eventData.date.map((dateStr) => new Date(dateStr));
      setSelectedDates(dates);
    }
  }, [eventData]);

  console.log('eventData',eventData)

  const initialValues = eventData
    ? {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        date: selectedDates,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
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
      }
    : {
        title: "",
        description: "",
        category: "",
        date: [] as Date[],
        startTime: "",
        endTime: "",
        venueName: "",
        address: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        posterImage: [] as string[],
        pricePerTicket: 0,
        totalTicket: 100,
        maxTicketsPerUser: 4,
        status: "upcoming" as const,
      };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, push: any, values: any) => {
    const files = Array.from(e.target.files || []);
    if (files.length + values.posterImage.length > 5) {
      toast.error("Cannot upload more than 5 images");
      return;
    }

    for (const file of files) {
      const localUrl = URL.createObjectURL(file);
      push(localUrl);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      console.log(`handleSubmit is running with ${JSON.stringify(values)}`);

      const cloudinaryUrls = [];
      for (const imageUrl of values.posterImage) {
        if (!imageUrl.includes("cloudinary.com")) {
          const imageBlob = await fetch(imageUrl).then((r) => r.blob());
          const imageFile = new File([imageBlob], "event-image.jpg", { type: "image/jpeg" });
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append("file", imageFile);
          cloudinaryFormData.append("upload_preset", "vendor_id"); 

          const uploadResponse = await uploadToCloudinary.mutateAsync(cloudinaryFormData);
          cloudinaryUrls.push(uploadResponse.secure_url);
        } else {
          cloudinaryUrls.push(imageUrl);
        }
      }

      const finalValues = {
        ...values,
        posterImage: cloudinaryUrls,
      };

      if (isEditing) {
        editEventMutation.mutate(
          {
            data:finalValues, 
            eventId: eventData?.eventId 
          }, 
          {
          onSuccess: (response: any) => {
            console.log("Edit response:", response);
            toast.success(response.message);
            onSuccess?.()

          },
          onError: (error: any) => {
            console.error("Failed to edit event:", error);
            toast.error(error?.response?.data?.message || "Failed to edit event");
            setSubmitting(false);
          },
        });
      } else {
        createEventMutation.mutate(finalValues, {
          onSuccess: (response: any) => {
            console.log("Create response:", response);
            toast.success(response.message);
            navigate("/vendor/events");
          },
          onError: (error: any) => {
            console.error("Failed to create event:", error);
            toast.error(error?.response?.data?.message || "Failed to create event");
            setSubmitting(false);
          },
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to upload images");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 bg-gradient-to-b from-sky-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-8"
      >
        <Button
          variant="outline"
          onClick={handleCancel}
          className="mr-4 border-sky-200 hover:bg-sky-50 transition-all duration-300"
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold text-sky-800">{isEditing ? "Edit Event" : "Host New Event"}</h1>
      </motion.div>

      <Formik initialValues={initialValues} validationSchema={EventValidationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                      <CardTitle className="text-sky-800">Event Details</CardTitle>
                      <CardDescription className="text-sky-600">
                        {isEditing ? "Update the basic information about your event" : "Provide the basic information about your event"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sky-700">
                          Event Title
                        </Label>
                        <Field name="title">
                          {({ field }: any) => (
                            <Input
                              id="title"
                              placeholder="Enter event title"
                              {...field}
                              className={`transition-all duration-300 focus:ring-sky-300 ${
                                errors.title && touched.title ? "border-red-300 bg-red-50" : "border-sky-200"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sky-700">
                          Description
                        </Label>
                        <Field name="description">
                          {({ field }: any) => (
                            <Textarea
                              id="description"
                              placeholder="Describe your event"
                              className={`min-h-32 transition-all duration-300 focus:ring-sky-300 ${
                                errors.description && touched.description ? "border-red-300 bg-red-50" : "border-sky-200"
                              }`}
                              {...field}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sky-700">
                          Category
                        </Label>
                        <Field name="category">
                          {({ field, form }: any) => (
                            <Select
                              onValueChange={(value) => form.setFieldValue("category", value)}
                              defaultValue={field.value}
                            >
                              <SelectTrigger
                                id="category"
                                className={`transition-all duration-300 border-sky-200 focus:ring-sky-300 ${
                                  errors.category && touched.category ? "border-red-300 bg-red-50" : ""
                                }`}
                              >
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-sky-100">
                                <SelectItem value="music">Music</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="food">Food & Drink</SelectItem>
                                <SelectItem value="arts">Arts & Culture</SelectItem>
                                <SelectItem value="sports">Sports & Fitness</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sky-700">
                          Event Status
                        </Label>
                        <Field name="status">
                          {({ field }: any) => (
                            <Select
                              onValueChange={(value) => setFieldValue("status", value)}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="status"
                                className={`transition-all duration-300 border-sky-200 focus:ring-sky-300 ${
                                  errors.status && touched.status ? "border-red-300 bg-red-50" : ""
                                }`}
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-sky-100">
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                      <CardTitle className="text-sky-800">Date & Time</CardTitle>
                      <CardDescription className="text-sky-600">When will your event take place?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-2">
                        <Label className="text-sky-700">Event Date(s)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal transition-all duration-300 border-sky-200 hover:bg-sky-50",
                                !selectedDates.length && "text-sky-400",
                                errors.date && touched.date ? "border-red-300 bg-red-50" : ""
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-sky-500" />
                              {selectedDates.length > 0 ? formatDate(selectedDates[0]) : "Select date(s)"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border border-sky-100">
                            <Calendar
                              mode="single"
                              selected={selectedDates[0]}
                              onSelect={(date) => {
                                const selected = date ? [date] : []
                                setSelectedDates(selected)
                                setFieldValue("date", selected)
                              }}
                              initialFocus
                              className="bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime" className="text-sky-700">
                            Start Time
                          </Label>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-sky-500" />
                            <Field name="startTime">
                              {({ field }: any) => (
                                <Input
                                  id="startTime"
                                  type="time"
                                  {...field}
                                  className={`transition-all duration-300 focus:ring-sky-300 ${
                                    errors.startTime && touched.startTime ? "border-red-300 bg-red-50" : "border-sky-200"
                                  }`}
                                />
                              )}
                            </Field>
                          </div>
                          <ErrorMessage
                            name="startTime"
                            component="div"
                            className="text-red-500 text-sm mt-1 animate-pulse"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endTime" className="text-sky-700">
                            End Time
                          </Label>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-sky-500" />
                            <Field name="endTime">
                              {({ field }: any) => (
                                <Input
                                  id="endTime"
                                  type="time"
                                  {...field}
                                  className={`transition-all duration-300 focus:ring-sky-300 ${
                                    errors.endTime && touched.endTime ? "border-red-300 bg-red-50" : "border-sky-200"
                                  }`}
                                />
                              )}
                            </Field>
                          </div>
                          <ErrorMessage
                            name="endTime"
                            component="div"
                            className="text-red-500 text-sm mt-1 animate-pulse"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                      <CardTitle className="text-sky-800">Location</CardTitle>
                      <CardDescription className="text-sky-600">Where will your event be held?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-2">
                        <Label htmlFor="venueName" className="text-sky-700">
                          Venue Name
                        </Label>
                        <Field name="venueName">
                          {({ field }: any) => (
                            <Input
                              id="venueName"
                              placeholder="Enter venue name"
                              {...field}
                              className={`transition-all duration-300 focus:ring-sky-300 ${
                                errors.venueName && touched.venueName ? "border-red-300 bg-red-50" : "border-sky-200"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="venueName"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sky-700">
                          Address
                        </Label>
                        <Field name="address">
                          {({ field }: any) => (
                            <Textarea
                              id="address"
                              placeholder="Enter full address"
                              {...field}
                              className={`transition-all duration-300 focus:ring-sky-300 ${
                                errors.address && touched.address ? "border-red-300 bg-red-50" : "border-sky-200"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude" className="text-sky-700">
                            Latitude
                          </Label>
                          <Field name="location.coordinates[0]">
                            {({ field }: any) => (
                              <Input
                                id="latitude"
                                type="number"
                                step="any"
                                placeholder="e.g. 40.7128"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setFieldValue("location.coordinates[0]", value);
                                }}
                                className={`transition-all duration-300 focus:ring-sky-300 ${
                                  errors.location?.coordinates && touched.location?.coordinates
                                    ? "border-red-300 bg-red-50"
                                    : "border-sky-200"
                                }`}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="longitude" className="text-sky-700">
                            Longitude
                          </Label>
                          <Field name="location.coordinates[1]">
                            {({ field }: any) => (
                              <Input
                                id="longitude"
                                type="number"
                                step="any"
                                placeholder="e.g. -74.0060"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setFieldValue("location.coordinates[1]", value);
                                }}
                                className={`transition-all duration-300 focus:ring-sky-300 ${
                                  errors.location?.coordinates && touched.location?.coordinates
                                    ? "border-red-300 bg-red-50"
                                    : "border-sky-200"
                                }`}
                              />
                            )}
                          </Field>
                        </div>
                      </div>
                      {errors.location?.coordinates && touched.location?.coordinates && (
                        <div className="text-red-500 text-sm mt-1 animate-pulse">Valid coordinates are required</div>
                      )}

                        <div className="pt-2">
                        {/* This is the single component you need to add to your form */}
                        <LocationPicker
                          mode="edit"
                          initialLat={values.location.coordinates[0]}
                          initialLng={values.location.coordinates[1]}
                          onLocationSelect={(location) => {
                            setFieldValue("location.coordinates[0]", location.lat)
                            setFieldValue("location.coordinates[1]", location.lng)
                            setFieldValue("address", location.address)
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                      <CardTitle className="text-sky-800">Event Images</CardTitle>
                      <CardDescription className="text-sky-600">
                        {isEditing ? "Update poster images for your event" : "Upload poster images for your event"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <FieldArray name="posterImage">
                        {({ remove, push }: any) => (
                          <>
                            <AnimatePresence>
                              {values.posterImage.map((image: string, index: number) => (
                                <motion.div
                                  key={index}
                                  className="relative"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Event poster ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-md shadow-sm transition-transform duration-500 hover:scale-[1.02]"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
                                    onClick={() => remove(index)}
                                    disabled={values.posterImage.length <= 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              ))}
                            </AnimatePresence>

                            {values.posterImage.length < 5 && (
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <div className="relative">
                                  <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => handleFileChange(e, push, values)}
                                    multiple={values.posterImage.length < 4}
                                    onClick={(e) => {
                                      e.currentTarget.value = "";
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full mt-4 border-dashed border-sky-200 hover:bg-sky-50 text-sky-700 transition-all duration-300"
                                    disabled={uploadToCloudinary.isPending}
                                  >
                                    <Upload className="mr-2 h-4 w-4 text-sky-500" />
                                    {uploadToCloudinary.isPending ? "Uploading..." : "Add Image"}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </>
                        )}
                      </FieldArray>
                      <ErrorMessage
                        name="posterImage"
                        component="div"
                        className="text-red-500 text-sm mt-1 animate-pulse"
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="border border-sky-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-sky-100 to-indigo-50 border-b border-sky-100">
                      <CardTitle className="text-sky-800">Ticket Information</CardTitle>
                      <CardDescription className="text-sky-600">
                        {isEditing ? "Update ticket details for your event" : "Set up ticket details for your event"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-2">
                        <Label htmlFor="pricePerTicket" className="text-sky-700">
                          Price Per Ticket (₹)
                        </Label>
                        <Field name="pricePerTicket">
                          {({ field }: any) => (
                            <Input
                              id="pricePerTicket"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                setFieldValue("pricePerTicket", value);
                              }}
                              className={`transition-all duration-300 focus:ring-sky-300 ${
                                errors.pricePerTicket && touched.pricePerTicket ? "border-red-300 bg-red-50" : "border-sky-200"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="pricePerTicket"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalTicket" className="text-sky-700">
                          Total Tickets Available
                        </Label>
                        <Field name="totalTicket">
                          {({ field }: any) => (
                            <Input
                              id="totalTicket"
                              type="number"
                              min={isEditing ? eventData?.ticketPurchased! : 1}
                              placeholder="100"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value || (isEditing ? eventData?.totalTicket! : "");
                                setFieldValue("totalTicket", value);
                              }}
                              className={`transition-all duration-300 focus:ring-sky-300 ${
                                errors.totalTicket && touched.totalTicket ? "border-red-300 bg-red-50" : "border-sky-200"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="totalTicket"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                        {isEditing && eventData?.ticketPurchased! < eventData?.totalTicket! ? (
                          <p className="text-xs text-sky-500">
                            Note: {eventData.ticketPurchased} tickets already sold. You can only increase the total.
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxTicketsPerUser" className="text-sky-700">
                          Max Tickets Per User
                        </Label>
                        <Field name="maxTicketsPerUser">
                          {({ field }: any) => (
                            <Input
                              id="maxTicketsPerUser"
                              type="number"
                              min="1"
                              placeholder="4"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value 
                                setFieldValue("maxTicketsPerUser", value);
                              }}
                              className={`transition-all duration-300 focus:ring-sky-300 ${
                                errors.maxTicketsPerUser && touched.maxTicketsPerUser
                                  ? "border-red-300 bg-red-50"
                                  : "border-sky-200"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="maxTicketsPerUser"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex justify-end space-x-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-sky-200 hover:bg-sky-50 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300"
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
                      ) : (
                        isEditing ? "Save Changes" : "Create Event"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}