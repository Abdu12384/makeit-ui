import authAxiosInstance from "@/api/auth.axios";
import { IGetAllBookingsParams } from "@/types/params";
import { IBooking } from "@/types/bookings";
import { IPaginationParams,ILocationEventParams } from "@/types/params";
import { IAuthResponse, IAxiosResponse } from "@/types/response";
import { GetAllServicesParams } from "@/types/service";
import { ITicket } from "@/types/ticket";
import { IClient, ILoginData } from "@/types/User";
import { IReview } from "@/types/review";
import { FormData } from "@/utils/validationForms/validationForms";
import { isAxiosError } from "axios";
import { axiosInstance } from "@/api/privet.axios";
import { CLIENT_ROUTES } from "@/constants/client.route";
import { AUTH_ROUTES } from "@/constants/auth.route";

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
  const response = await axiosInstance.get<IAuthResponse>(
    CLIENT_ROUTES.REFRESH_SESSION
  );
  return response.data;
};


export const saveClientFCMToken = async (token:string) => {
  try {
     const response = await axiosInstance.post(CLIENT_ROUTES.SAVE_FCM_TOKEN, { token });
     return response.data;
   } catch (error) {
     console.log(error);
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while saving fcm token');
   }
 };

 export const getClientNotifications = async () => {
   try {
     const response = await axiosInstance.get(CLIENT_ROUTES.NOTIFICATIONS);
     return response.data;
   } catch (error) {
     console.log(error);
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while getting notifications');	
   }
 }

 export const markNotificationAsRead = async () => {
   try {
     const response = await axiosInstance.put(CLIENT_ROUTES.MARK_NOTIFICATION_READ);
     return response.data;
   } catch (error) {
     console.log(error);
     throw error;
   }
 }


export const clientSignup = async (values: SignupPayload): Promise<SingupResponse> =>{
   try {
     const response = await authAxiosInstance.post(AUTH_ROUTES.SEND_OTP,values)
     return response.data
   } catch (error) {
     console.error('Signup failed',error)
     throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while signup')	
   }
}



export const clientCreateAccount = async ({formdata, otpString}:CreateAccountParams): Promise<SingupResponse> =>{
   try {
     const response = await authAxiosInstance.post(AUTH_ROUTES.SIGNUP,{
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
       const response = await authAxiosInstance.post(AUTH_ROUTES.SEND_OTP,{email})
       return response.data
     } catch (error) {
       console.log('error while client resend otp',error)
       throw error
     }
}





export const clientLogin = async (user:ILoginData)=>{
   try {
     const response = await authAxiosInstance.post(AUTH_ROUTES.LOGIN,user)
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
      AUTH_ROUTES.GOOGLE_AUTH,
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
      const response = await authAxiosInstance.post(AUTH_ROUTES.FORGOT_PASSWORD,{email})
      return response.data
    } catch (error) {
      console.log('error while client forgot password',error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while forgot password')	
    }
  }


  export const clientResetPassword = async (password:string,token:string) => {
    try {
      const response = await authAxiosInstance.post(AUTH_ROUTES.RESET_PASSWORD,{password,token})
      return response.data
    } catch (error) {
      console.log('error while client reset password',error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while reset password')	
    }
  }

  export const clientGetAllCategories = async () => {
    try {
      const response = await axiosInstance.get(CLIENT_ROUTES.CATEGORIES)
      return response.data
    } catch (error) {
      console.log('error while client get all categories',error)
      throw error
    }
  }

  
  export const clientProfileEdit = async (data:Record<string, string|number|boolean>) => {
    try {
       const response = await axiosInstance.put(CLIENT_ROUTES.DETAILS,data)
      return response.data
    } catch (error) {
      console.log('error while client profile edit',error)
      throw error
    }
  }




 export const clientChangePassword = async(data:Record<string, string|number|boolean>)=>{
   try {
    const response = await axiosInstance.put(CLIENT_ROUTES.CHANGE_PASSWORD,data)
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
    const response = await axiosInstance.get(CLIENT_ROUTES.SERVICES, {
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
    const response = await axiosInstance.get(CLIENT_ROUTES.SERVICE_BY_ID(id))
    return response.data
  } catch (error) {
    console.log('error while client get service by id',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while getting service by id')	
  }
}



export const clientBookingService = async (id:string,bookingData:Record<string, string|number|boolean>) => {
  try {
    console.log('client booking service',id,bookingData)
    const response = await axiosInstance.post(CLIENT_ROUTES.BOOK_SERVICE(id),bookingData)
    return response.data
  } catch (error) {
    console.log('error while client booking service',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while booking service')	
  }
}


export const rescheduleBookingApproval = async (bookingId:string,status:string) => {
  try {
    const response = await axiosInstance.patch(CLIENT_ROUTES.RESCHEDULE_BOOKING(bookingId),
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
}: IGetAllBookingsParams) => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.BOOKINGS,{
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




export const createBookingPayment = async (bookingId:string,paymentIntentId:string,bookingDetails:IBooking) => {
  try {
    const response = await axiosInstance.post(CLIENT_ROUTES.CREATE_BOOKING_PAYMENT,{bookingId,paymentIntentId,bookingDetails})
    return response.data
  } catch (error) {
    console.log('error while client create booking payment',error)
    throw error
  }
}



export const confirmBookingPayment = async (booking:string,paymentIntentId:string) => {
  try {
    const response = await axiosInstance.post(CLIENT_ROUTES.CONFIRM_PAYMENT,{booking,paymentIntentId})
    return response.data
  } catch (error) {
    console.log('error while client confirm booking payment',error)
    throw error
  }
}


export const cancelBooking = async (bookingId:string) => {
  try {
    const response = await axiosInstance.put(CLIENT_ROUTES.CANCEL_BOOKING(bookingId))
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
}: IPaginationParams) => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.EVENTS,{
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
}: ILocationEventParams) => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.NEARBY_EVENTS, {
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
    const response = await axiosInstance.get(CLIENT_ROUTES.EVENT_BY_ID(eventId))
    return response.data
  } catch (error) {
    console.log('error while client get event by id',error)
    throw error
  }
}



export const checkEventBookingAvailability = async ({id,ticketCount}: {id:string,ticketCount:number}):Promise<string> => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.CHECK_EVENT_BOOKING(id),{
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




export const createTicket = async (ticket: ITicket) => {
  try {
    const response = await axiosInstance.post(CLIENT_ROUTES.CREATE_TICKET,ticket)
    return response.data
  } catch (error) {
    console.log('error while client create ticket',error)
    throw error
  }
}


export const confirmTicketAndPayment = async (ticket: ITicket,paymentIntentId:string,vendorId:string) => {
  try {
    const response = await axiosInstance.post(CLIENT_ROUTES.CONFIRM_TICKET_PAYMENT,{ticket,paymentIntentId,vendorId})
    return response.data
  } catch (error) {
    console.log('error while client confirm ticket and payment',error)
    throw error
  }
}


export const  getAllTickets = async ({page = 1,limit = 10,status}:IPaginationParams) => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.TICKETS,{
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
    const response = await axiosInstance.put(CLIENT_ROUTES.CANCEL_TICKET(ticketId),{cancelCount})
    return response.data
  } catch (error) {
    console.log('error while client cancel ticket',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while canceling ticket')	
  }
}



export const getWalletById = async ({page = 1,limit = 10}:IPaginationParams) => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.WALLET,{
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




export const addReview = async (review: IReview) => {
  try {
    const response = await axiosInstance.post(CLIENT_ROUTES.REVIEW,review)
    return response.data
  } catch (error) {
    console.log('error while client add review',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while adding review')	
  }
}




export const getAllReviews = async ({page = 1,limit = 10,targetId,targetType}:IPaginationParams) => {
  try {
    const response = await axiosInstance.get(CLIENT_ROUTES.REVIEWS,{
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
    const response = await axiosInstance.get(CLIENT_ROUTES.WORK_SAMPLES_BY_VENDOR(vendorId),{
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
      const response = await axiosInstance.post(CLIENT_ROUTES.LOGOUT);
      return response.data;
    } catch (error) {
      console.log('error while client logout',error)
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging out')	
    }
  };
  
