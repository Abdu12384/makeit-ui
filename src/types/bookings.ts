import { IService } from "./service";
import { IClient, IVendor } from "./User";

export interface IBooking {
  _id?: string;
  bookingId: string;
  clientId: string;
  client?: IClient & { name?: string }; 
  date: string[];
  email: string;
  phone: string;
  paymentStatus: "Paid" | "Pending" | "Failed" | string;
  serviceId: string;
  service: IService;
  vendorApproval: "Approved" | "Pending" | "Rejected" | string;
  vendorId: string;
  vendor?: IVendor;
  status: "Confirmed" | "Pending" | "Cancelled" | "Rejected" | string;
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
  rejectionReason?: string;
  clientName?: string;
  serviceName?: string;
}
