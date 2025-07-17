export interface ServiceFormValues {
  serviceTitle: string
  yearsOfExperience: number
  serviceId?:string
  categoryId: string
  serviceDescription: string
  cancellationPolicy: string
  termsAndCondition: string
  serviceDuration: number
  servicePrice: number
  additionalHourFee: number
}


export interface GetAllServicesParams {
   page: number;    
   limit: number;   
   search?: string; 
   sortBy?: string; 
   sortOrder?: 'asc' | 'desc'; 
 }




// Define the Service type
export interface Service {
  id: string
  serviceId: string
  serviceTitle: string
  serviceDescription: string
  servicePrice: number
  serviceDuration: string
  yearsOfExperience: number
  additionalHourFee: number
  cancellationPolicy: string
  termsAndCondition: string
  imageUrl: string
  rating: number
  reviewCount: number
  category: string
  providerName: string
  providerImage: string
  providerRating: number
  gallery: string[]
}

export interface ServiceType {
  _id: string
  title?: string
  serviceId: string
  serviceTitle: string
  serviceCategory: string
  yearsOfExperience: number
  servicePrice: number
  serviceDuration: number
  serviceDescription: string
  status: "active" | "blocked" | string  // You can restrict values if known
}

