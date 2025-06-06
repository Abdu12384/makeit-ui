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


