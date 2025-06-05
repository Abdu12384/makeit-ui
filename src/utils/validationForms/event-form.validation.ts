import * as Yup from "yup";


export const EventValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  date: Yup.array().of(Yup.date()).min(1, "At least one date is required").required("Event date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("is-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    }),
  venueName: Yup.string().required("Venue name is required"),
  address: Yup.string().required("Address is required"),
  location: Yup.object().shape({
    coordinates: Yup.array()
      .of(Yup.number())
      .min(2, "Both latitude and longitude are required")
      .max(2, "Only latitude and longitude are allowed")
      .required("Coordinates are required"),
  }),
  posterImage: Yup.array().of(Yup.string()).min(1, "At least one image is required"),
  pricePerTicket: Yup.number()
    .positive("Price must be positive")
    .max(10000, "Price cannot exceed ₹10,000")
    .required("Price is required"),
  totalTicket: Yup.number()
    .positive("Total tickets must be positive")
    .integer("Total tickets must be a whole number")
    .max(100000, "Total tickets cannot exceed 100,000")
    .required("Total tickets is required"),
  maxTicketsPerUser: Yup.number()
    .positive("Max tickets per user must be positive")
    .integer("Max tickets per user must be a whole number")
    .max(Yup.ref("totalTicket"), "Cannot exceed total tickets")
    .required("Max tickets per user is required"),
});