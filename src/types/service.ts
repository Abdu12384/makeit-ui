export interface ServiceFormValues {
  serviceTitle: string
  yearsOfExperience: number
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
