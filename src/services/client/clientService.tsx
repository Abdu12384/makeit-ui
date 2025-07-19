import authAxiosInstance from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { GetAllBookingsParams } from "@/hooks/ClientCustomHooks";
import { Booking } from "@/types/bookings";
import { LocationEventParams, PaginationParams } from "@/types/event";
import { IAuthResponse, IAxiosResponse } from "@/types/response";
import { GetAllServicesParams } from "@/types/service";
import { TicketEntity } from "@/types/ticket";
import { IClient, ILoginData } from "@/types/User";
import { ReviewData } from "@/types/worksample/review";
import { FormData } from "@/utils/validationForms/validationForms";
import { isAxiosError } from "axios";

interface SignupPayload{
  name: string,
  email: string,
  password: string,
  confirmPassword:string,
  phone?: string
}

interface SingupResponse {
  message: string,
  data?: IClient
}

type CreateAccountParams = {
  formdata: FormData
  otpString: string
}




export const refreshClientSession = async (): Promise<IAuthResponse> => {
  const response = await clientAxiosInstance.get<IAuthResponse>(
    "/client/refresh-session"
  );
  return response.data;
};


export const saveClientFCMToken = async (token:string) => {
  try {
     const response = await clientAxiosInstance.post("/client/save-fcm-token", { token });
     return response.data;
   } catch (error) {
     console.log(error);
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while saving fcm token');
   }
 };

 export const getClientNotifications = async () => {
   try {
     const response = await clientAxiosInstance.get("/client/notifications");
     return response.data;
   } catch (error) {
     console.log(error);
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while getting notifications');	
   }
 }

 export const markNotificationAsRead = async () => {
   try {
     const response = await clientAxiosInstance.put(`/client/notifications/read`);
     return response.data;
   } catch (error) {
     console.log(error);
     throw error;
   }
 }


export const clientSignup = async (values: SignupPayload): Promise<SingupResponse> =>{
   try {
     const response = await authAxiosInstance.post('/send-otp',values)
     return response.data
   } catch (error) {
     console.error('Signup failed',error)
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while signup')	
   }
}



export const clientCreateAccount = async ({formdata, otpString}:CreateAccountParams): Promise<SingupResponse> =>{
   try {
     const response = await authAxiosInstance.post('/signup',{
      formdata,
      otpString
     })   
     return response.data
   } catch (error) {
     console.error('Create account failed',error)
     throw error
   }
}


export const clientResendOtp = async (email: string) =>{
     try {
       const response = await authAxiosInstance.post('/send-otp',{email})
       return response.data
     } catch (error) {
       console.log('error while client resend otp',error)
       throw error
     }
}





export const clientLogin = async (user:ILoginData)=>{
   try {
     const response = await authAxiosInstance.post('/login',user)
     return response.data
   } catch (error) {
       console.log('error while client login', error)
       throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging in')	
   }
}





export const clientGoogleLogin = async ({
  credential,
  client_id,
  role,
}:{
  credential: string,
  client_id: string,
  role: string
}) => {
  try {
    const response = await authAxiosInstance.post(
      '/google-auth',
      {
        credential,
        client_id,
        role
      })
      return response.data
    } catch (error) {
      console.log('error while client google login',error)
      throw error
    }
  }
  
  


  export const clientForgotPassword = async (email:string) => {
    try {
      const response = await authAxiosInstance.post('/forgot-password',{email})
      return response.data
    } catch (error) {
      console.log('error while client forgot password',error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while forgot password')	
    }
  }


  export const clientResetPassword = async (password:string,token:string) => {
    try {
      const response = await authAxiosInstance.post('/reset-password',{password,token})
      return response.data
    } catch (error) {
      console.log('error while client reset password',error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while reset password')	
    }
  }

  export const clientGetAllCategories = async () => {
    try {
      const response = await clientAxiosInstance.get('/client/categories')
      return response.data
    } catch (error) {
      console.log('error while client get all categories',error)
      throw error
    }
  }

  
  export const clientProfileEdit = async (data:Record<string, string|number|boolean>) => {
    try {
       const response = await clientAxiosInstance.put('/client/details',data)
      return response.data
    } catch (error) {
      console.log('error while client profile edit',error)
      throw error
    }
  }




 export const clientChangePassword = async(data:Record<string, string|number|boolean>)=>{
   try {
    const response = await clientAxiosInstance.put('/client/change-password',data)
    return response.data
   } catch (error) {
    console.log('error while client change password',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while changing password')	
   }
 }



export const clientGetAllServices = async ({
  page = 1,
  limit = 10,
  search = ""
}: GetAllServicesParams) => {
  try {
    const response = await clientAxiosInstance.get('/client/services', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get all services',error)
    throw error
  }
}




export const clientGetServiceById = async (id:string) => {
  try {
    const response = await clientAxiosInstance.get(`/client/services/${id}`)
    return response.data
  } catch (error) {
    console.log('error while client get service by id',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while getting service by id')	
  }
}



export const clientBookingService = async (id:string,bookingData:Record<string, string|number|boolean>) => {
  try {
    console.log('client booking service',id,bookingData)
    const response = await clientAxiosInstance.post(`/client/services/${id}/book`,bookingData)
    return response.data
  } catch (error) {
    console.log('error while client booking service',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while booking service')	
  }
}


export const rescheduleBookingApproval = async (bookingId:string,status:string) => {
  try {
    const response = await clientAxiosInstance.patch(`/client/bookings/${bookingId}/reschedule`,
      {status})
    return response.data
  } catch (error) {
    console.log('error while client reschedule booking approval',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while reschedule booking approval')	
  }
}




export const getBookings = async ({
  page = 1,
  limit = 10,
  status = "",
  search = "",
  sortOrder = "asc"
}: GetAllBookingsParams) => {
  try {
    const response = await clientAxiosInstance.get('/client/bookings',{
      params:{
        page,
        limit,
        status,
        search,
        sortOrder
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get bookings',error)
    throw error
  }
}




export const createBookingPayment = async (bookingId:string,paymentIntentId:string,bookingDetails:Booking) => {
  try {
    const response = await clientAxiosInstance.post(`/client/create-booking-payment`,{bookingId,paymentIntentId,bookingDetails})
    return response.data
  } catch (error) {
    console.log('error while client create booking payment',error)
    throw error
  }
}



export const confirmBookingPayment = async (booking:string,paymentIntentId:string) => {
  try {
    const response = await clientAxiosInstance.post(`/client/confirm-payment`,{booking,paymentIntentId})
    return response.data
  } catch (error) {
    console.log('error while client confirm booking payment',error)
    throw error
  }
}


export const cancelBooking = async (bookingId:string) => {
  try {
    const response = await clientAxiosInstance.put(`/client/cancel-booking/${bookingId}`)
    return response.data
  } catch (error) {
    console.log('error while client cancel booking',error)
    throw error
  }
}





export const getAllEvents = async ({
  page = 1,
  limit = 10,
  search = "",
}: PaginationParams) => {
  try {
    const response = await clientAxiosInstance.get('/client/events',{
      params:{
        page,
        limit,
        search,
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get all events',error)
    throw error
  }
}


export const getAllLocationBasedEvents = async ({
  lat,
  lng,
  radius,
  page = 1,
  limit = 10,
}: LocationEventParams) => {
  try {
    const response = await clientAxiosInstance.get("/nearby", {
      params: {
        lat,
        lng,
        radius,
        page,
        limit,
      },
    })
    return response.data
  } catch (error) {
    console.log("Error while fetching location-based events:", error)
    throw error
  }
}


export const getEventById = async (eventId:string) => {
  try {
    const response = await clientAxiosInstance.get(`/client/events/${eventId}`)
    return response.data
  } catch (error) {
    console.log('error while client get event by id',error)
    throw error
  }
}



export const checkEventBookingAvailability = async ({id,ticketCount}: {id:string,ticketCount:number}):Promise<string> => {
  try {
    const response = await clientAxiosInstance.get(`/client/events/${id}/check-booking`,{
      params:{
        ticketCount
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client check event booking availability',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while checking event booking availability')	
  }
}




export const createTicket = async (ticket: TicketEntity) => {
  try {
    const response = await clientAxiosInstance.post('/client/create-ticket',ticket)
    return response.data
  } catch (error) {
    console.log('error while client create ticket',error)
    throw error
  }
}


export const confirmTicketAndPayment = async (ticket: TicketEntity,paymentIntentId:string,vendorId:string) => {
  try {
    const response = await clientAxiosInstance.post('/client/confirm-ticket-payment',{ticket,paymentIntentId,vendorId})
    return response.data
  } catch (error) {
    console.log('error while client confirm ticket and payment',error)
    throw error
  }
}


export const  getAllTickets = async ({page = 1,limit = 10,status}:PaginationParams) => {
  try {
    const response = await clientAxiosInstance.get('/client/tickets',{
      params:{
        page,
        limit,  
        status,
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get all tickets',error)
    throw error
  }
}


export const cancelTicket = async ({ticketId,cancelCount}: {ticketId:string,cancelCount:number}) => {
  try {
    console.log('send -ticketId',ticketId)
    const response = await clientAxiosInstance.put(`/client/cancel-ticket/${ticketId}`,{cancelCount})
    return response.data
  } catch (error) {
    console.log('error while client cancel ticket',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while canceling ticket')	
  }
}



export const getWalletById = async ({page = 1,limit = 10}:PaginationParams) => {
  try {
    const response = await clientAxiosInstance.get('/client/wallet',{
      params:{
        page,
        limit,
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get wallet by id',error)
    throw error
  }
}




export const addReview = async (review: ReviewData) => {
  try {
    const response = await clientAxiosInstance.post('/client/review',review)
    return response.data
  } catch (error) {
    console.log('error while client add review',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while adding review')	
  }
}




export const getAllReviews = async ({page = 1,limit = 10,targetId,targetType}:PaginationParams) => {
  try {
    const response = await clientAxiosInstance.get('/client/reviews',{
      params:{
        page,
        limit,
        targetId,
        targetType,
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get all reviews',error)
    throw error
  }
}


export const getAllWorkSamplesByVendorId = async ({vendorId,page,limit}: {vendorId:string,page:number,limit:number}) => {
  try {
    const response = await clientAxiosInstance.get(`/client/work-sample/${vendorId}`,{
      params:{
        page,
        limit,
      }
    })
    return response.data
  } catch (error) {
    console.log('error while client get all work samples by vendor id',error)
    throw error
  }
}



  export const logoutClient = async (): Promise<IAxiosResponse> => {
    try {
      const response = await clientAxiosInstance.post("/client/logout");
      return response.data;
    } catch (error) {
      console.log('error while client logout',error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging out')	
    }
  };
  
