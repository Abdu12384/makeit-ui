
export interface IEventFormValues {
    title: string;
    eventId?: string;
    description: string;
    category: string;
    dates: Date[];
    startTime: string;
    endTime: string;
    venueName: string;
    address: string;
    date: string;
    location: {
      type: "Point";
      coordinates: number[];
    };
    posterImage: string[];
    pricePerTicket: number;
    totalTicket: number;
    maxTicketsPerUser: number;
}



export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    targetId?: string;
    targetType?: string;
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
}