


// client side ticket entity
export interface TicketEntity {
  phone: string;
  email: string;
  eventId: string;
  clientId: string;

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
  checkInHistory: any[]
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
    date: string;
    totalTicket: number;
    ticketPurchased: number;
    status: string;
    startTime: string;
    endTime: string;
    venueName: string;
    posterImage: string;
    title: string;
  }
  djs?: string[]
}
