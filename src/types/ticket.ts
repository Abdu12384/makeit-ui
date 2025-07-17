import { DateTimeEntry, IEventFormValues } from "./event";
import { IClient } from "./User";



// client side ticket entity
export interface TicketEntity {
  phone: string;
  email: string;
  eventId: string;
  clientId: string;
  // ticket?: Ticket
  paymentIntentId?: string
  totalAmount?:number
  totalCount?:number
  vendorId?:string
}




// backend ticket entity
export interface TicketBackendEntity {
  _id?: string; 
  ticketId: string;
  createdAt?: Date;
  totalAmount: number;
  ticketCount: number;
  phone: string;
  email: string;
  paymentStatus: 'pending' | 'successful' | 'failed';
  qrCodeLink: string;
  eventId: string;
  clientId: string;
  ticketStatus: 'used' | 'refunded' | 'unused';
  paymentTransactionId: string;
  ticket:Ticket 
}  








// Types
export interface Ticket {
  ticketId: string
  clientId: string
  email: string
  eventId: string
  ticketCount: number
  paymentStatus: string
  phone: string
  qrCodeLink: string
  ticketStatus: string
  paymentTransactionId: string
  totalAmount: number
  checkInHistory:[]
  // Additional fields for display
  eventName?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  ticketType?: string
  eventDetails?: {
    eventId: string;
    address: string;
    attendees: number;
    date: DateTimeEntry[];
    totalTicket: number;
    ticketPurchased: number;
    status: string;
    startTime: string;
    endTime: string;
    venue: string;
    posterImage: string;
    title: string;
  }
  djs?: string[]
}





export interface ITicketConfirmationModal{
  _id?:string
  ticketId: string;
  clientId: string;
  email: string;
  eventId: string;
  ticketCount: number;
  paymentStatus: string; 
  phone: string;
  qrCodeLink: string;
  ticketStatus: string;
  paymentTransactionId: string;
  totalAmount: number;
  checkInHistory?:[];
  createdAt?: string;
  updatedAt?: string;
  eventName?: string;
  eventLocation?: string;
  eventDate?: string;
};
export interface TicketConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  ticket:ITicketConfirmationModal
  event?: IEventFormValues
}



export interface ITicketEntity {
  _id: string
  ticketId: string
  clientId: string
  vendorId: string
  email: string // This is the client's email on the ticket
  eventId: string
  ticketCount: number // Number of tickets purchased (e.g., 1)
  paymentStatus: "successfull" | "pending" | "failed"
  phone: string // This is the client's phone on the ticket
  qrCodeLink: string
  ticketStatus: "unused" | "used" | "cancelled"
  totalAmount: number
  createdAt: string // ISO string
  updatedAt: string // ISO string
  checkedIn?: "checked_in" | "pending" | "cancelled" // Status for check-in
  checkedInTime?: string
  checkedInBy?: string
  ticketType: string // e.g., "Standard" - now consistent across all mock tickets
  client?: IClient// Nested client object
}
