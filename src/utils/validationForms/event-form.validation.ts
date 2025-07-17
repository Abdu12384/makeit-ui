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



export const NewEventValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),

  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),

  category: Yup.string().required("Category is required"),

  // date: Yup.array()
  // .of(
  //   Yup.object().shape({
  //     date: Yup.date()
  //       .typeError("Invalid date")
  //       .required("Date is required"),
  //     startTime: Yup.string().required("Start time is required"),
  //     endTime: Yup.string()
  //       .required("End time is required")
  //       .test("is-after-start", "End time must be after start time", function (value) {
  //         const { startTime } = this.parent;
  //         if (!startTime || !value) return true;
  //         const start = new Date(`1970-01-01T${startTime}`);
  //         const end = new Date(`1970-01-01T${value}`);
  //         return end > start;
  //       }),
  //   })
  // )
  // .test("is-sorted", "Dates must be in ascending order", function (entries) {
  //   if (!Array.isArray(entries)) return true;

  //   for (let i = 1; i < entries.length; i++) {
  //     const prevDate = new Date(entries[i - 1].date);
  //     const currDate = new Date(entries[i].date);

  //     // If date is same, then compare time
  //     if (currDate < prevDate) {
  //       return this.createError({
  //         path: `date[${i}].date`,
  //         message: `Date must be after previous date`,
  //       });
  //     }
  //   }

  //   return true;
  // }),

  // startTime: Yup.string().required("Start time is required"),

  // endTime: Yup.string()
  //   .required("End time is required")
  //   .test("is-after-start", "End time must be after start time", function (value) {
  //     const { startTime } = this.parent;
  //     if (!startTime || !value) return true;
  //     return new Date(`1970-01-01T${value}`) > new Date(`1970-01-01T${startTime}`);
  //   }),

  venueName: Yup.string().required("Venue name is required"),

  address: Yup.string().required("Address is required"),

  location: Yup.object().shape({
    coordinates: Yup.array()
      .of(
        Yup.number()
          .typeError("Coordinate must be a number")
          .required("Both latitude and longitude are required")
      )
      .length(2, "Exactly two coordinates required")
      .required("Coordinates are required"),
  }),

  posterImage: Yup.array()
    .of(Yup.string().required("Image is required"))
    .min(1, "At least one image is required"),

  pricePerTicket: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .max(10000, "Price cannot exceed ₹10,000")
    .required("Price is required"),

  totalTicket: Yup.number()
    .typeError("Total tickets must be a number")
    .positive("Total tickets must be positive")
    .integer("Total tickets must be a whole number")
    .max(100000, "Total tickets cannot exceed 100,000")
    .required("Total tickets is required"),

  maxTicketsPerUser: Yup.number()
    .typeError("Max tickets per user must be a number")
    .positive("Max tickets per user must be positive")
    .integer("Max tickets per user must be a whole number")
    .max(Yup.ref("totalTicket"), "Cannot exceed total tickets")
    .required("Max tickets per user is required"),
});
