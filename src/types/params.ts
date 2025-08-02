export interface IPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  targetId?: string;
  targetType?: string;
  status?:string;
}


export interface ILocationEventParams {
lat: number
lng: number
radius: number
page?: number
limit?: number
}


export interface IGetAllBookingsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortOrder?: string;
}
