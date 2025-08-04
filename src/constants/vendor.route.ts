import { BASE_URL } from "./route";

export const VENDOR_ROUTES = {
  REFRESH_TOKEN: `${BASE_URL.VENDOR}/refresh-token`,
  REFRESH_SESSION: `${BASE_URL.VENDOR}/refresh-session`,
  BOOKED_DATES: `${BASE_URL.VENDOR}/booked-dates`,
  SAVE_FCM_TOKEN: `${BASE_URL.VENDOR}/fcm-token`,
  NOTIFICATIONS: `${BASE_URL.VENDOR}/notifications`,
  MARK_NOTIFICATION_READ: `${BASE_URL.VENDOR}/notifications/read`,
  SEND_OTP: `${BASE_URL.VENDOR}/send-otp`,
  SIGNUP: `${BASE_URL.VENDOR}/signup`,
  LOGIN: `${BASE_URL.VENDOR}/login`,
  UPDATE_PROFILE: `${BASE_URL.VENDOR}/details`,
  CHANGE_PASSWORD: `${BASE_URL.VENDOR}/change-password`,
  SERVICE: `${BASE_URL.VENDOR}/service`,
  SERVICE_BY_ID: (serviceId: string) => `${BASE_URL.VENDOR}/service/${serviceId}`,
  BLOCK_SERVICE: (serviceId: string) => `${BASE_URL.VENDOR}/service/block/${serviceId}`,
  CATEGORIES: `${BASE_URL.VENDOR}/categories`,
  BOOKINGS: `${BASE_URL.VENDOR}/bookings`,
  BOOKING_BY_ID: (bookingId: string) => `${BASE_URL.VENDOR}/bookings/${bookingId}`,
  RESCHEDULE_BOOKING: (bookingId: string) => `${BASE_URL.VENDOR}/bookings/${bookingId}/reschedule`,
  EVENT: `${BASE_URL.VENDOR}/event`,
  EVENT_BY_ID: (eventId: string) => `${BASE_URL.VENDOR}/event/${eventId}`,
  BLOCK_EVENT: (eventId: string) => `${BASE_URL.VENDOR}/event/block/${eventId}`,
  WALLET: `${BASE_URL.VENDOR}/wallet`,
  VERIFY_TICKET: (ticketId: string, eventId: string) => `${BASE_URL.VENDOR}/verify-ticket/${ticketId}/${eventId}`,
  ATTENDEES_BY_EVENT: (eventId: string) => `${BASE_URL.VENDOR}/events/attendees/${eventId}`,
  WORK_SAMPLES: `${BASE_URL.VENDOR}/work-sample`,
  WORK_SAMPLE_BY_ID: (workSampleId: string) => `${BASE_URL.VENDOR}/work-sample/${workSampleId}`,
  DASHBOARD: `${BASE_URL.VENDOR}/dashboard`,
  LOGOUT: `${BASE_URL.VENDOR}/logout`,
};

export const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dujuwqvz5/image/upload";
