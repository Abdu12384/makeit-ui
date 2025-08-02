import { FormikTouched } from "formik";
import { IReview } from "./review";
import { IVendor } from "./User";
import { CloudinaryUploadResponse } from "./cloudinary";


export interface IEvent {
  title: string;
  description: string;
  category: string;
  venueName: string;
  address: string;
  location: ILocation;
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  maxTicketsPerUser: number;
  status: "upcoming" | "completed" | "cancelled";
  date: IDateTimeEntry[];
  startTime: string;
  endTime: string;
  eventId?: string;
  _id?: string;
  ticketPurchased?: number;
  attendeesCount?: number;
  checkedInCount?: number;
  hostedBy?: string;
  attendees?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  vendorDetails?: IVendor;
  amenities?: string[];
  faq?: Array<{ question: string; answer: string }>;
  reviews?: IReview[];
  __v?: number;
}


export interface IEventFormTouched {
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
date?:FormikTouched<IDateTimeEntry>[]; 
startTime?: boolean
endTime?: boolean
}


export interface UploadMutation {
mutateAsync: (formData: FormData) => Promise<CloudinaryUploadResponse>
isPending: boolean
}


export interface ILocation {
type: "Point";
coordinates: [number, number];
}

export interface IDateTimeEntry {
date: Date;
startTime: string;
endTime: string;
}
