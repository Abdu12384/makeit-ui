import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, Clock, MapPin, Trash2, Upload } from "lucide-react";
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
import { useUploadeImageToCloudinaryMutation } from "@/hooks/VendorCustomHooks";
import toast from "react-hot-toast";

interface EventData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  date: string[];
  startTime: string;
  endTime: string;
  address: string;
  venueName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  maxTicketsPerUser?: number;
  ticketPurchased?: number;
  status: "upcoming" | "completed" | "cancelled";
}

interface EditEventPageProps {
  eventData?: EventData;
  onSubmit?: (updatedData: any) => void;
  onClose?: () => void;
}

export default function EditEventPage({ eventData, onSubmit , onClose}: EditEventPageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [mounted, setMounted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadToCloudinary = useUploadeImageToCloudinaryMutation();

  useEffect(() => {
    setMounted(true);

    // Convert date strings to Date objects
    const eventDates = eventData.date.map((dateStr: string) => new Date(dateStr));
    setSelectedDates(eventDates);

    // Format times for input fields
    const startDateTime = new Date(eventData.startTime);
    const endDateTime = new Date(eventData.endTime);

    const startTimeStr = `${startDateTime.getHours().toString().padStart(2, "0")}:${startDateTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const endTimeStr = `${endDateTime.getHours().toString().padStart(2, "0")}:${endDateTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Set initial form values from eventData prop
    setInitialValues({
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      dates: eventDates,
      startTime: startTimeStr,
      endTime: endTimeStr,
      venueName: eventData.venueName,
      address: eventData.address,
      location: eventData.location,
      posterImage: eventData.posterImage,
      pricePerTicket: eventData.pricePerTicket,
      totalTicket: eventData.totalTicket,
      maxTicketsPerUser: eventData.maxTicketsPerUser,
      ticketPurchased: eventData.ticketPurchased,
      status: eventData.status,
    });

    setIsLoading(false);
  }, [eventData]);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    category: "",
    dates: [] as Date[],
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
    totalTicket: 0,
    maxTicketsPerUser: 0,
    ticketPurchased: 0,
    status: "upcoming" as "upcoming" | "completed" | "cancelled",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, push: any, values: any) => {
    const files = Array.from(e.target.files || []);
    if (files.length + values.posterImage.length > 5) {
      toast.error("Cannot upload more than 5 images");
      return;
    }

    for (const file of files) {
      try {
        setUploadError(null);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "vendor_id"); // Replace with your upload preset
        // formData.append("cloud_name", "your_cloud_name"); // Replace with your cloud name

        const uploadResponse = await uploadToCloudinary.mutateAsync(formData);
        push(uploadResponse.secure_url);
      } catch (error) {
        setUploadError("Failed to upload one or more images");
        toast.error("Failed to upload image");
      }
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setSubmitting(true);

      // Validate dates
      if (!values.dates || values.dates.length === 0) {
        toast.error("Please select at least one event date");
        setSubmitting(false);
        return;
      }

      // Combine startTime and endTime with the first selected date
      const eventDate = new Date(values.dates[0]);
      const startTimeParts = values.startTime.split(":");
      const endTimeParts = values.endTime.split(":");
      const startDate = new Date(eventDate);
      startDate.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]), 0, 0);
      const endDate = new Date(eventDate);
      endDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);

      const updatedValues = {
        ...values,
        _id: eventData._id, // Include _id for backend
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        location: {
          type: "Point",
          coordinates: values.location.coordinates.map((coord: string) => parseFloat(coord)),
        },
        pricePerTicket: parseFloat(values.pricePerTicket),
        totalTicket: parseInt(values.totalTicket),
        maxTicketsPerUser: parseInt(values.maxTicketsPerUser),
        ticketPurchased: values.ticketPurchased,
      };

      // Call parent onSubmit function
      onSubmit(updatedValues);

      toast.success("Event updated successfully");
      navigate(`/vendor/events/${eventData._id}`);
    } catch (error) {
      toast.error("Failed to update event");
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to previous page
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh] bg-gradient-to-b from-sky-50 to-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-sky-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sky-700">Loading event data...</p>
        </motion.div>
      </div>
    );
  }

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
          onClick={handleBack}
          className="mr-4 border-sky-200 hover:bg-sky-50 transition-all duration-300"
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold text-sky-800">Edit Event</h1>
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
                        Update the basic information about your event
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sky-700">
                          Event Title
                        </Label>
                        <Field
                          name="title"
                          as={Input}
                          id="title"
                          placeholder="Enter event title"
                          className={`transition-all duration-300 focus:ring-sky-300 ${errors.title && touched.title ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
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
                        <Field
                          name="description"
                          as={Textarea}
                          id="description"
                          placeholder="Describe your event"
                          className={`min-h-32 transition-all duration-300 focus:ring-sky-300 ${errors.description && touched.description ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
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
                          {({ field }: any) => (
                            <Select
                              onValueChange={(value) => setFieldValue("category", value)}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="category"
                                className={`transition-all duration-300 border-sky-200 focus:ring-sky-300 ${errors.category && touched.category ? "border-red-300 bg-red-50" : ""}`}
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
                                className={`transition-all duration-300 border-sky-200 focus:ring-sky-300 ${errors.status && touched.status ? "border-red-300 bg-red-50" : ""}`}
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
                                errors.dates && touched.dates ? "border-red-300 bg-red-50" : ""
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-sky-500" />
                              {selectedDates.length > 0 ? selectedDates.map(formatDate).join(", ") : "Select date(s)"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border border-sky-100">
                            <Calendar
                              mode="multiple"
                              selected={selectedDates}
                              onSelect={(dates) => {
                                setSelectedDates(dates || []);
                                setFieldValue("dates", dates || []);
                              }}
                              initialFocus
                              className="bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage
                          name="dates"
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
                            <Field
                              name="startTime"
                              as={Input}
                              type="time"
                              id="startTime"
                              className={`transition-all duration-300 focus:ring-sky-300 ${errors.startTime && touched.startTime ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                            />
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
                            <Field
                              name="endTime"
                              as={Input}
                              type="time"
                              id="endTime"
                              className={`transition-all duration-300 focus:ring-sky-300 ${errors.endTime && touched.endTime ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                            />
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
                        <Field
                          name="venueName"
                          as={Input}
                          id="venueName"
                          placeholder="Enter venue name"
                          className={`transition-all duration-300 focus:ring-sky-300 ${errors.venueName && touched.venueName ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
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
                        <Field
                          name="address"
                          as={Textarea}
                          id="address"
                          placeholder="Enter full address"
                          className={`transition-all duration-300 focus:ring-sky-300 ${errors.address && touched.address ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
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
                          <Field
                            name="location.coordinates[0]"
                            as={Input}
                            type="number"
                            step="any"
                            id="latitude"
                            placeholder="e.g. 40.7128"
                            onChange={(e: any) => setFieldValue("location.coordinates[0]", parseFloat(e.target.value) || 0)}
                            className={`transition-all duration-300 focus:ring-sky-300 ${errors.location?.coordinates && touched.location?.coordinates ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="longitude" className="text-sky-700">
                            Longitude
                          </Label>
                          <Field
                            name="location.coordinates[1]"
                            as={Input}
                            type="number"
                            step="any"
                            id="longitude"
                            placeholder="e.g. -74.0060"
                            onChange={(e: any) => setFieldValue("location.coordinates[1]", parseFloat(e.target.value) || 0)}
                            className={`transition-all duration-300 focus:ring-sky-300 ${errors.location?.coordinates && touched.location?.coordinates ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                          />
                        </div>
                      </div>
                      {errors.location?.coordinates && touched.location?.coordinates && (
                        <div className="text-red-500 text-sm mt-1 animate-pulse">Valid coordinates are required</div>
                      )}

                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-sky-200 hover:bg-sky-50 text-sky-700 transition-all duration-300"
                        >
                          <MapPin className="mr-2 h-4 w-4 text-sky-500" />
                          Pick Location on Map
                        </Button>
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
                      <CardDescription className="text-sky-600">Update poster images for your event</CardDescription>
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
                                    src={image}
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
                                    disabled={uploadToCloudinary.isLoading}
                                  >
                                    <Upload className="mr-2 h-4 w-4 text-sky-500" />
                                    {uploadToCloudinary.isLoading ? "Uploading..." : "Add Image"}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                            {uploadError && (
                              <div className="text-red-500 text-sm mt-1 animate-pulse">{uploadError}</div>
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
                      <CardDescription className="text-sky-600">Update ticket details for your event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-2">
                        <Label htmlFor="pricePerTicket" className="text-sky-700">
                          Price Per Ticket (₹)
                        </Label>
                        <Field
                          name="pricePerTicket"
                          as={Input}
                          type="number"
                          min="0"
                          step="0.01"
                          id="pricePerTicket"
                          placeholder="0.00"
                          onChange={(e: any) => setFieldValue("pricePerTicket", parseFloat(e.target.value) || 0)}
                          className={`transition-all duration-300 focus:ring-sky-300 ${errors.pricePerTicket && touched.pricePerTicket ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
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
                        <Field
                          name="totalTicket"
                          as={Input}
                          type="number"
                          min={values.ticketPurchased}
                          id="totalTicket"
                          placeholder="100"
                          onChange={(e: any) => setFieldValue("totalTicket", parseInt(e.target.value) || values.ticketPurchased)}
                          className={`transition-all duration-300 focus:ring-sky-300 ${errors.totalTicket && touched.totalTicket ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
                        <ErrorMessage
                          name="totalTicket"
                          component="div"
                          className="text-red-500 text-sm mt-1 animate-pulse"
                        />
                        {values.ticketPurchased > 0 && (
                          <p className="text-xs text-sky-500">
                            Note: {values.ticketPurchased} tickets already sold. You can only increase the total.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxTicketsPerUser" className="text-sky-700">
                          Max Tickets Per User
                        </Label>
                        <Field
                          name="maxTicketsPerUser"
                          as={Input}
                          type="number"
                          min="1"
                          id="maxTicketsPerUser"
                          placeholder="4"
                          onChange={(e: any) => setFieldValue("maxTicketsPerUser", parseInt(e.target.value) || 0)}
                          className={`transition-all duration-300 focus:ring-sky-300 ${errors.maxTicketsPerUser && touched.maxTicketsPerUser ? "border-red-300 bg-red-50" : "border-sky-200"}`}
                        />
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
                    onClick={handleBack}
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
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
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