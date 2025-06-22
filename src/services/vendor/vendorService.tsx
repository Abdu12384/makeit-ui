import authAxiosInstance from "@/api/auth.axios";
import { VendorAxiosInstance } from "@/api/vendor.axios";
import { IEventFormValues } from "@/types/event";
import { IAuthResponse, IAxiosResponse } from "@/types/response";
import { GetAllServicesParams, ServiceFormValues } from "@/types/service";
import { ILoginData } from "@/types/User";
import { WorkSample } from "@/types/worksample/work-sample";
import clodAxios from 'axios'



interface VendorData {
   name: string;
   email: string;
   phone: string;
   password: string;
   confirmPassword: string;
   idProof: string;
}



export const refreshVendorSession = async (): Promise<IAuthResponse> => {
   const response = await VendorAxiosInstance.get<IAuthResponse>(
     "/vendor/refresh-session"
   );
   return response.data;
 };


 export const  saveVendorFCMToken = async (token:string) => {
   try {
      const response = await VendorAxiosInstance.post("/vendor/fcm-token", { token });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };



const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dujuwqvz5/image/upload";

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
   const response = await VendorAxiosInstance.get("/vendor/notifications");
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}

export const markVendorNotificationAsRead = async () => {
   try {
   const response = await VendorAxiosInstance.put(`/vendor/notifications/read`);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}


export const vendorSignup  = async (formdata: VendorData) =>{
   try {
     const response = await authAxiosInstance.post('/send-otp',formdata)
    return  response.data
   } catch (error) {
     console.log('error wihle singup vendor', error)
     throw error
   }
}


export  const vendorCreateAccount = async ({formdata, otpString}:{formdata:Record<string, string | number | boolean>;otpString:string}) =>{
    try {
       const response = await authAxiosInstance.post('/signup',{formdata,otpString})
       return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
}


export const VendorLogin = async (user: ILoginData) =>{
    try {
       const response = await authAxiosInstance.post('/login',user)
      return  response.data
    } catch (error) {
       console.log(error)
       throw error
    }
}





export const updateVendorProfile = async ({data}:{data: Record<string, string | number | boolean>}) =>{
     try {
       const response = await VendorAxiosInstance.put("/vendor/details",data)
       return response
     } catch (error) {
        console.log(error)
        throw error
     }
}




export const vendorChangePassword = async (data:Record<string, string | number | boolean>) => {
   try {
      const response = await VendorAxiosInstance.put("/vendor/change-password",data)
      return response.data
   } catch (error) {
      console.log(error)
      throw error
   }
}






export const createService = async (data:ServiceFormValues) => {
  try {
     const response = await VendorAxiosInstance.post("/vendor/service",data);
     return response.data
   
  } catch (error) {
       console.log(error)
       throw error
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
     const response = await VendorAxiosInstance.get("/vendor/service", {
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



export const updateService = async ({serviceId,data}: {serviceId:string,data:ServiceFormValues}) => {
  try {
     const response = await VendorAxiosInstance.put(`/vendor/service/${serviceId}`,
      data
   );
     return response.data
   } catch (error) {
        console.log(error)
        throw error
   }
}




export const getAllCategories = async () => {
   try {
   const response = await VendorAxiosInstance.get("/vendor/categories");
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
    const response = await VendorAxiosInstance.patch(`/vendor/bookings/${bookingId}`, {
      status,
      reason,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



export const getAllBookings = async (limit:number,skip:number) => {
   try {
   const response = await VendorAxiosInstance.get("/vendor/bookings",{
      params:{
         limit,
         skip
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
      const response = await VendorAxiosInstance.patch(`/vendor/bookings/${bookingId}`,{
        status,
        reason
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
}


export const createEvent = async (data:IEventFormValues)=>{
   try {
     const response = await VendorAxiosInstance.post("/vendor/event",data)
     return response.data
   } catch (error) {
    console.log(error)
    throw error
   }
}


export const getAllEventsByVendorId = async (page:number,limit:number) => {
   try {
   const response = await VendorAxiosInstance.get("/vendor/event",{
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


export const editEvent = async ({data,eventId}: {data:IEventFormValues,eventId:string})=>{
   try {
     const response = await VendorAxiosInstance.put(`/vendor/event/${eventId}`,data)
     return response.data
   } catch (error) {
    console.log(error) 
    throw error
   }
}





export const getWalletById = async ({page,limit}: {page:number,limit:number}) => {
   try {
   const response = await VendorAxiosInstance.get("/vendor/wallet",{
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





export const verifyTicket = async ({ticketId,eventId}: {ticketId:string,eventId:string}) => {
   try {
   const response = await VendorAxiosInstance.get(`/vendor/verify-ticket/${ticketId}/${eventId}`);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}




export const getAttendeesById = async (eventId:string) => {
   try {
   const response = await VendorAxiosInstance.get(`/vendor/events/attendees/${eventId}`);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}




export const getAllWorkSamplesByVendorId = async ({page,limit}: {page:number,limit:number}) => {
   try {
   const response = await VendorAxiosInstance.get("/vendor/work-sample",{
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
   const response = await VendorAxiosInstance.post("/vendor/work-sample",data);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}



export const updateWorkSample = async ({data,workSampleId}: {data:WorkSample,workSampleId:string}) => {
   try {
   const response = await VendorAxiosInstance.put(`/vendor/work-sample/${workSampleId}`,data);
   return response.data;
 } catch (error) {
   console.log(error)
   throw error
 }
}


export const getDashboardData = async (period:string) => {
   try {
   const response = await VendorAxiosInstance.get("/vendor/dashboard",{
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
   const response = await VendorAxiosInstance.post("/vendor/logout");
   return response.data;
};





