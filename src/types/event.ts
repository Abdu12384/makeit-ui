
export interface IEventFormValues {
    title: string;
    description: string;
    category: string;
    dates: Date[];
    startTime: string;
    endTime: string;
    venueName: string;
    address: string;
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