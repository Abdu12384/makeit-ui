import { Service } from "./service";
import { IClient, IVendor } from "./User";

export interface Booking {
  _id?:string;
  bookingId: string;
  clientId: string;
  date: string[];
  paymentStatus: "Paid" | "Pending" | "Failed";
  serviceId: string;
  vendorApproval: "Approved" | "Pending" | "Rejected";
  vendorId: string;
  email: string;
  phone: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Rejected";
  createdAt: string;
  isComplete: boolean;
  updatedAt: string;
  clientName?: string;
  serviceName?: string;
  client?:{
    name : string
  }
}



export interface BookingType {
  bookingId: string
  clientId: string
  client: IClient
  date: string[]
  email: string
  phone: string
  paymentStatus: string
  serviceId: string
  service: Service
  vendorApproval: string
  vendorId: string
  vendor: IVendor
  status: string
  createdAt: string
  updatedAt: string
  isComplete: boolean
  rejectionReason?: string
  _id: string
}