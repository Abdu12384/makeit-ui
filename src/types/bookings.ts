export interface Booking {
  bookingId: string;
  clientId: string;
  date: string[];
  paymentStatus: "Paid" | "Pending" | "Failed";
  serviceId: string;
  vendorApproval: "Approved" | "Pending" | "Rejected";
  vendorId: string;
  email: string;
  phone: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  createdAt: string;
  isComplete: boolean;
  updatedAt: string;
  clientName?: string;
  serviceName?: string;
}
