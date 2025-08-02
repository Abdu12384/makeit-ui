import { IEvent } from "./event";
import { IClient } from "./User";

export interface ITicketConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  ticket:ITicket
  event?: IEvent
}

export interface ITicket {
  _id?: string;
  ticketId?: string;
  clientId?: string;
  vendorId?: string;
  email?: string;
  phone?: string;
  eventId?: string;
  ticketCount?: number;
  totalAmount?: number;
  paymentStatus?: "pending" | "successful" | "failed";
  ticketStatus?: "unused" | "used" | "refunded" | "cancelled"|"partially_refunded";
  qrCodeLink?: string;
  paymentTransactionId?: string;
  checkInHistory?: [];
  checkedIn?: "checked_in" | "pending" | "cancelled";
  checkedInTime?: string;
  checkedInBy?: string;
  createdAt?: Date; 
  updatedAt?: string | number;  
  ticketType?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventDetails?: IEvent;
  djs?: string[];
  client?: IClient;
  paymentIntentId?: string;
}





