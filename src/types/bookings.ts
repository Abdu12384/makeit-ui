import { BookingStatus, PaymentStatus, VendorApprovalStatus } from "./enum/staus.enum";
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
  paymentStatus: PaymentStatus;
  serviceId: string;
  service: IService;
  vendorApproval: VendorApprovalStatus;
  vendorId: string;
  vendor?: IVendor;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
  rejectionReason?: string;
  clientName?: string;
  serviceName?: string;
}
