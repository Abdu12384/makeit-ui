import { FormikErrors, FormikTouched } from "formik";

export interface IEventFormValues {
    title: string;
    eventId?: string;
    description: string;
    category: string;
    date: DateTimeEntry[];
    startTime: string;
    endTime: string;
    venueName: string;
    address: string;
    location: {
      type: "Point";
      coordinates: number[];
    };
    posterImage: string[];
    pricePerTicket: number;
    totalTicket: number;
    maxTicketsPerUser: number;
    status?: "upcoming" | "completed" | "cancelled"
}


export interface Event {
  id: string
  eventId: string
  title: string
  description: string
  category: string
  date: DateTimeEntry[]
  startTime: string
  endTime: string
  address: string
  venueName: string
  posterImage: string[]
  pricePerTicket: number
  maxTicketsPerUser?: number
  totalTicket: number
  attendeesCount: number
  checkedInCount?: number
  ticketPurchased: number
  status: "upcoming" | "completed" | "cancelled"
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    targetId?: string;
    targetType?: string;
    status?:string;
}

export interface EventData {
  eventId: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  date: string[];
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  maxTicketsPerUser: number;
  ticketPurchased?: number;
  status: "upcoming" | "completed" | "cancelled";
  isActive?: boolean
}

export interface Event {
  eventId: string;
  title: string;
  description: string;
  category: string;
  date: DateTimeEntry[];
  startTime: string;
  endTime: string;
  address: string;
  venueName: string;
  attendeesCount: number;
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  ticketPurchased: number;
  status: "upcoming" | "completed" | "cancelled";
  location?: {
    type: string;
    coordinates: number[];
  };
  vendorDetails?: {
    name: string;
    profileImage: string;
    rating: number;
    events: number;
    userId?:string
  };
  amenities?: string[];
  faq?: Array<{ question: string; answer: string }>;
  reviews?: Array<{
    reviewId: string;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export interface AdEvent {
  _id: string
  eventId: string
  title: string
  category: string
  description: string
  venueName: string
  address: string
  location: Location
  date: string[]
  startTime: string
  endTime: string
  pricePerTicket: number
  totalTicket: number
  ticketPurchased: number
  maxTicketsPerUser: number
  posterImage: string[]
  hostedBy: string
  attendees: string[]
  attendeesCount: number
  status: string
  isActive: boolean
  createdAt: string
  __v: number
}

interface Location {
  type: string
  coordinates: number[]
}
export interface Attendee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  ticketNumber: string;
  checkedIn: boolean;
}



export type LocationEventParams = {
  lat: number
  lng: number
  radius: number
  page?: number
  limit?: number
}


export interface NewEventFormValues {
  title: string
  description: string
  category: string
  venueName: string
  address: string
  location: {
    type: "Point"
    coordinates: [number, number]
  }
  posterImage: string[]
  pricePerTicket: number
  totalTicket: number
  maxTicketsPerUser: number
  status: "upcoming" | "completed" | "cancelled"
  date: DateTimeEntry[]
  startTime: string
  endTime: string
}

export interface EventFormErrors {
  title?: string
  description?: string
  category?: string
  venueName?: string
  address?: string
  location?: {
    type?: string
    coordinates?: string | string[]
  }
  posterImage?: string | string[]
  pricePerTicket?: string
  totalTicket?: string
  maxTicketsPerUser?: string
  status?: string
  date?: string | string[] | FormikErrors<DateTimeEntry>[];
  startTime?: string
  endTime?: string
}

export interface EventFormTouched {
  title?: boolean
  description?: boolean
  category?: boolean
  venueName?: boolean
  address?: boolean
  location?: {
    type?: boolean
    coordinates?: boolean | boolean[]
  }
  posterImage?: boolean | boolean[]
  pricePerTicket?: boolean
  totalTicket?: boolean
  maxTicketsPerUser?: boolean
  status?: boolean
  date?:FormikTouched<DateTimeEntry>[]; 
  startTime?: boolean
  endTime?: boolean
}

export interface DateTimeEntry {
  date: Date
  startTime: string
  endTime: string
}

export interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

export interface UploadMutation {
  mutateAsync: (formData: FormData) => Promise<CloudinaryUploadResponse>
  isPending: boolean
}


export interface NewEventData {
  eventId: string
  title: string
  description: string
  category: string
  venueName: string
  address: string
  location: {
    type: "Point"
    coordinates: [number, number]
  }
  posterImage: string[]
  pricePerTicket: number
  totalTicket: number
  maxTicketsPerUser: number
  status: "upcoming" | "completed" | "cancelled"
  date: DateTimeEntry[]
  startTime: string
  endTime: string
  ticketPurchased: number
  isActive?: boolean
} 