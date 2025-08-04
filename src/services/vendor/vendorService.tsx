import authAxiosInstance from "@/api/auth.axios";
import { axiosInstance } from "@/api/privet.axios";
import { AUTH_ROUTES } from "@/constants/auth.route";
import { CLOUDINARY_URL, VENDOR_ROUTES } from "@/constants/vendor.route";
import {  IEvent } from "@/types/event";
import { IAuthResponse, IAxiosResponse } from "@/types/response";
import { GetAllServicesParams, IService } from "@/types/service";
import { IVendorData } from "@/types/signup";
import { ILoginData } from "@/types/User";
import { WorkSample } from "@/types/work-sample";
import clodAxios, { isAxiosError } from 'axios'



export const refreshVendorSession = async (): Promise<IAuthResponse> => {
   const response = await axiosInstance.get<IAuthResponse>(
     VENDOR_ROUTES.REFRESH_SESSION
   );
   return response.data;
 };


 export const getVendorBookedDates = async () => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.BOOKED_DATES);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}


 export const  saveVendorFCMToken = async (token:string) => {
   try {
      const response = await axiosInstance.post(VENDOR_ROUTES.SAVE_FCM_TOKEN, { token });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };




export const uploadImageCloudinary = async (formdata: FormData) => {
  try {
      const response = await clodAxios.post(CLOUDINARY_URL, formdata)
      return response.data
  } catch (error) {
      console.log('error while uploding image', error)
      throw error
  }
}


export const getVendorNotifications = async () => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.NOTIFICATIONS);
   return response.data;
 } catch (error) {
   console.log(error)
   throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while fetching notifications')	
 }
}

export const markVendorNotificationAsRead = async () => {
   try {
   const response = await axiosInstance.put(VENDOR_ROUTES.MARK_NOTIFICATION_READ);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}


export const vendorSignup  = async (formdata: IVendorData) =>{
   try {
     const response = await authAxiosInstance.post(AUTH_ROUTES.SEND_OTP,formdata)
    return  response.data
   } catch (error) {
     console.log('error wihle singup vendor', error)
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while singup vendor')	
   }
}


export  const vendorCreateAccount = async ({formdata, otpString}:{formdata:IVendorData;otpString:string}) =>{
    try {
       const response = await authAxiosInstance.post(AUTH_ROUTES.SIGNUP,{formdata,otpString})
       return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
}


export const VendorLogin = async (user: ILoginData) =>{
    try {
       const response = await authAxiosInstance.post(AUTH_ROUTES.LOGIN,user)
      return  response.data
    } catch (error) {
       console.log(error)
       throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging in')	
    }
}





export const updateVendorProfile = async ({data}:{data: Record<string, string | number | boolean>}) =>{
     try {
       const response = await axiosInstance.put(VENDOR_ROUTES.UPDATE_PROFILE,data)
       return response
     } catch (error) {
        console.log(error)
        throw error
     }
}




export const vendorChangePassword = async (data:Record<string, string | number | boolean>) => {
   try {
      const response = await axiosInstance.put(VENDOR_ROUTES.CHANGE_PASSWORD,data)
      return response.data
   } catch (error) {
      console.log(error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while changing password')	
   }
}






export const createService = async (data:IService) => {
  try {
     const response = await axiosInstance.post(VENDOR_ROUTES.SERVICE,data);
     return response.data
   
  } catch (error) {
       console.log(error)
       throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while creating service')	
  }
}



export const getAllServicesByVendorId = async ({
   page = 1,
   limit = 10,
   search = "",
   sortBy = "serviceTitle",  
   sortOrder = "asc" 
 }: GetAllServicesParams) => {
   try {
     const response = await axiosInstance.get(VENDOR_ROUTES.SERVICE, {
       params: {
         page,
         limit,
         search,
         sortBy,
         sortOrder
       }
     }); 
     return{
      services:response.data.services,
      currentPage:response.data.currentPage,
      totalPages:response.data.totalPages
     }
  } catch (error) {
    console.log(error);
    throw error;
  }
};



export const updateService = async ({serviceId,data}: {serviceId:string,data:IService}) => {
  try {
     const response = await axiosInstance.put(VENDOR_ROUTES.SERVICE_BY_ID(serviceId),
      data
   );
     return response.data
   } catch (error) {
        console.log(error)
        throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while updating service')	
   }
}


export const blockService = async (serviceId:string) => {
   try {
   const response = await axiosInstance.patch(VENDOR_ROUTES.BLOCK_SERVICE(serviceId));
   return response.data;
 } catch (error) {
   console.log(error)
   throw Error(isAxiosError(error) ? error.response?.data.message : 'error while blocking service')	
 }
}




export const getAllCategories = async () => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.CATEGORIES);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}




export const changeBookingStatus = async ({
  bookingId,
  status,
  reason,
}: {
  bookingId: string;
  status: string;
  reason?: string;
}) => {
  try {
    const response = await axiosInstance.patch(VENDOR_ROUTES.BOOKING_BY_ID(bookingId), {
      status,
      reason,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while changing booking status')	
  }
};



export const getAllBookings = async (page:number,limit:number,status:string) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.BOOKINGS,{
      params:{
         page,
         limit,
         status
      }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}


export const vendorCancelBooking = async ({bookingId,status,reason}: {bookingId:string,status:string,reason?:string}) => {
   try {
      const response = await axiosInstance.patch(VENDOR_ROUTES.BOOKING_BY_ID(bookingId),{
        status,
        reason
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while canceling booking')	
    }
}


export const createEvent = async (data:IEvent)=>{
   try {
     const response = await axiosInstance.post(VENDOR_ROUTES.EVENT,data)
     return response.data
   } catch (error) {
    console.log(error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while creating event')	
   }
}


export const getAllEventsByVendorId = async (page:number,limit:number) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.EVENT,{
      params:{
         page,
         limit
      }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }  
}


export const editEvent = async ({data,eventId}: {data:IEvent,eventId:string})=>{
   try {
     const response = await axiosInstance.put(VENDOR_ROUTES.EVENT_BY_ID(eventId),data)
     return response.data
   } catch (error) {
    console.log(error) 
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while editing event')	
   }
}

export const blockEvent = async (eventId:string) => {
   try {
   const response = await axiosInstance.patch(VENDOR_ROUTES.BLOCK_EVENT(eventId));
   return response.data;
 } catch (error) {
   console.log(error)
   throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while blocking event')	
 }
}


export const RescheduleBooking = async ({bookingId,selectedDate,rescheduleReason}: {bookingId:string,selectedDate:string,rescheduleReason:string}) => {
   try {
      const response = await axiosInstance.patch(VENDOR_ROUTES.RESCHEDULE_BOOKING(bookingId),{
        selectedDate,
        rescheduleReason
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while rescheduling booking')	
    }
}





export const getWalletById = async ({page,limit}: {page:number,limit:number}) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.WALLET,{
      params:{
         page,
         limit
      }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}





export const verifyTicket = async ({ticketId,eventId,status}: {ticketId:string,eventId:string,status:string}) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.VERIFY_TICKET(ticketId,eventId),{
    params:{
      status
    }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while verifying ticket')	
  }
}




export const getAttendeesById = async ({eventId,page,limit}:{eventId:string,page:number,limit:number}) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.ATTENDEES_BY_EVENT(eventId),{
      params:{
         page,
         limit
      }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}




export const getAllWorkSamplesByVendorId = async ({page,limit}: {page:number,limit:number}) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.WORK_SAMPLES,{
      params:{
         page,
         limit
      }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}





export const createWorkSample = async (data:WorkSample) => {
   try {
   const response = await axiosInstance.post(VENDOR_ROUTES.WORK_SAMPLES,data);
   return response.data;
 } catch (error) {
   console.log(error)
   throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while creating work sample')	
 }
}



export const updateWorkSample = async ({data,workSampleId}: {data:WorkSample,workSampleId:string}) => {
   try {
   const response = await axiosInstance.put(VENDOR_ROUTES.WORK_SAMPLE_BY_ID(workSampleId),data);
   return response.data;
 } catch (error) {
   console.log(error)
   throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while updating work sample')	
 }
}


export const getDashboardData = async (period:string) => {
   try {
   const response = await axiosInstance.get(VENDOR_ROUTES.DASHBOARD,{
      params:{
         period
      }
   });
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}



export const logoutVendor = async (): Promise<IAxiosResponse> => {
   try {
   const response = await axiosInstance.post(VENDOR_ROUTES.LOGOUT);
   return response.data;
} catch (error) {
   console.log(error)
   throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging out')	
}
};





