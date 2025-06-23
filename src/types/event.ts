
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



export interface Event {
  id: string
  eventId: string
  title: string
  description: string
  category: string
  date: string[]
  startTime: string
  endTime: string
  address: string
  venueName: string
  posterImage: string[]
  pricePerTicket: number
  maxTicketsPerUser?: number
  totalTicket: number
  attendeesCount: number
  ticketPurchased: number
  status: "upcoming" | "completed" | "cancelled"
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
  isActive?: boolean
}


export interface Event {
  eventId: string;
  title: string;
  description: string;
  category: string;
  date: string[];
  startTime: string;
  endTime: string;
  address: string;
  venueName: string;
  attendeesCount: number;
  posterImage: string[];
  pricePerTicket: number;
  totalTicket: number;
  ticketPurchased: number;
  status: "upcoming" | "completed" | "cancelled";
  location?: {
    type: string;
    coordinates: number[];
  };
  vendorDetails?: {
    name: string;
    profileImage: string;
    rating: number;
    events: number;
    userId?:string
  };
  amenities?: string[];
  faq?: Array<{ question: string; answer: string }>;
  reviews?: Array<{
    reviewId: string;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}



export interface AdEvent {
  _id: string
  eventId: string
  title: string
  category: string
  description: string
  venueName: string
  address: string
  location: Location
  date: string[]
  startTime: string
  endTime: string
  pricePerTicket: number
  totalTicket: number
  ticketPurchased: number
  maxTicketsPerUser: number
  posterImage: string[]
  hostedBy: string
  attendees: string[]
  attendeesCount: number
  status: string
  isActive: boolean
  createdAt: string
  __v: number
}

interface Location {
  type: string
  coordinates: number[]
}
