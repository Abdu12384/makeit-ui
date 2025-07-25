
export interface GetAllServicesParams {
   page: number;    
   limit: number;   
   search?: string; 
   sortBy?: string; 
   sortOrder?: 'asc' | 'desc'; 
 }


export interface IService {
  _id?: string;
  id?: string; 
  serviceId?: string;

  serviceTitle: string;
  title?: string; 
  serviceDescription: string ;
  category?: string;
  categoryId?: string; 

  yearsOfExperience: number;
  serviceDuration: string | number; 
  servicePrice: number;
  additionalHourFee: number;

  cancellationPolicy: string;
  termsAndCondition: string;

  status?: "active" | "blocked" | string;

  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  gallery?: string[];

  providerName?: string;
  providerImage?: string;
  providerRating?: number;
}
