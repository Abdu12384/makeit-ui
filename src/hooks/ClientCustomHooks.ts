import { useMutation } from '@tanstack/react-query';
import { addReview, cancelBooking, cancelTicket, clientBookingService, clientChangePassword, clientCreateAccount, clientForgotPassword, clientGetAllServices, clientGetServiceById, clientGoogleLogin, clientLogin, clientProfileEdit, clientResendOtp, clientResetPassword, clientSignup, confirmBookingPayment, confirmTicketAndPayment, createBookingPayment, createTicket, getAllEvents, getAllReviews, getAllTickets, getAllWorkSamplesByVendorId, getBookings, getEventById, getWalletById, logoutClient, saveClientFCMToken, getClientNotifications, markNotificationAsRead, checkEventBookingAvailability, rescheduleBookingApproval, getAllLocationBasedEvents, clientGetAllCategories, getWalletAmount, purchaseTicketWithWallet   } from '@/services/client/clientService';
import { ILoginData } from '@/types/User';
import { IGetAllBookingsParams, ILocationEventParams, IPaginationParams } from '@/types/params';
import { ITicket } from '@/types/ticket';
import { IReview } from '@/types/review';
import { GetAllServicesParams } from '@/types/service';
import { IBooking } from '@/types/bookings';
import { FormData } from '@/utils/validationForms/validationForms';
import { IEvent } from '@/types/event';


interface FormValues {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

type loginData = {
  credential: string
  client_id: string,
  role : string
}



export const useClientSignupMutation = () =>{
  return useMutation({
    mutationFn: (values: FormValues) => clientSignup(values),
  })
}

export const useSaveClientFCMTokenMutation = () => {
  return useMutation({
    mutationFn: (token:string) => saveClientFCMToken(token)
  })
}


export const useCreateAccountMutation = () => {
  return useMutation({
      mutationFn: ({ formdata, otpString }: { formdata: FormData; otpString: string }) => clientCreateAccount({ formdata, otpString })

  })
}


export const useGetClientNotificationsMutation = () => {
  return useMutation({
    mutationFn: () => getClientNotifications()
  })
}

export const useMarkNotificationAsReadMutation = () => {
  return useMutation({
    mutationFn: () => markNotificationAsRead()
  })
}


export const useClientLoginMutation = () =>{
   return useMutation({
     mutationFn: (user:ILoginData) => clientLogin(user)
   })
}




export const useClientGoogleLoginMutation = () =>{
  return useMutation({
    mutationFn: (loginData:loginData) => clientGoogleLogin(loginData)
  })
}



export const useClientForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email:string) => clientForgotPassword(email)
  })
}


export const useClientResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data:{password:string,token:string}) => clientResetPassword(data.password,data.token)
  })
}



export const useResendOtpClientMutaion = () => {
   return useMutation({
     mutationFn: (email: string) => clientResendOtp(email)
   })
}




export const useClientGetAllServicesMutation = () => {
  return useMutation({
    mutationFn: ({page,limit,search}:GetAllServicesParams) => clientGetAllServices({page,limit,search})
  })
}     


export const useRescheduleBookingApprovalMutation = () => {
  return useMutation({
    mutationFn: ({bookingId,status}: {bookingId:string,status:string}) => rescheduleBookingApproval(bookingId,status)
  })
}


export const useClientProfileEditMutation = () => {
  return useMutation({
    mutationFn:(data:Record<string, string|number|boolean>) => clientProfileEdit(data)
  })
}


export const useClientChangePasswordMutation = () => {
  return useMutation({
    mutationFn:(data:Record<string, string|number|boolean>) => clientChangePassword(data)
  })
}


export const useClientGetServiceByIdMutation = () => {
  return useMutation({
    mutationFn: (id:string) => clientGetServiceById(id)
  })
}




export const useBookingServiceMutation = () => {
  return useMutation({
    mutationFn: ({id,bookingData}: {id:string,bookingData:Record<string, string|number|boolean>}) => clientBookingService(id,bookingData),
  });
}



export const  useCreateBookingPaymentMutation = () => {
  return useMutation({
    mutationFn: ({bookingId,paymentIntentId,bookingDetails}: {bookingId:string,paymentIntentId:string,bookingDetails:IBooking}) => createBookingPayment(bookingId,paymentIntentId,bookingDetails)
  })
}


export const useConfirmBookingPaymentMutation = () => {
  return useMutation({
    mutationFn: ({booking,paymentIntentId}: {booking:string,paymentIntentId:string}) => confirmBookingPayment(booking,paymentIntentId)
  })
}




export const useGetBookingsMutation = () => {
  return useMutation({
    mutationFn: (params:IGetAllBookingsParams) => getBookings(params)
  })
} 


export const useCancelBookingMutation = () => {
  return useMutation({
    mutationFn: (bookingId:string) => cancelBooking(bookingId)
  })
}   


export const useGetAllEventsMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getAllEvents(params)
  })
}


export const useGetAllLocationBasedEventsMutation = () =>{
  return useMutation({
    mutationFn: (params:ILocationEventParams) => getAllLocationBasedEvents(params)
  })
}


export const useClientGetAllCategoriesMutation = () => {
  return useMutation({
    mutationFn: () => clientGetAllCategories()
  })
}


export const useGetEventByIdMutation = () => {
  return useMutation({
    mutationFn: (eventId:string) => getEventById(eventId)
  })
}


export const useCheckEventBookingAvailabilityMutation = () => {
  return useMutation({
    mutationFn: ({eventId,ticketCount}: {eventId:string,ticketCount:number}) => checkEventBookingAvailability({id: eventId,ticketCount})
  })
}


export const useCreateTicketMutation = () => {
  return useMutation({
    mutationFn: (ticket:ITicket) => createTicket(ticket)
  })
} 

export const usePurchaseTicketWithWallet = () => {
  return useMutation({
    mutationFn: (
      data: {
        amount: number;
        event: IEvent;
        ticket: ITicket;
        type: string;
        totalTicketCount: number;
        vendorId: string;
        paymentMethod: string;
      }
    ) => purchaseTicketWithWallet(
      data.amount,
      data.event,
      data.ticket,
      data.type,
      data.totalTicketCount,
      data.vendorId,
      data.paymentMethod
    )
  });
};


export const useGetAllTicketsMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getAllTickets(params)
  })
}


export const useConfirmTicketAndPaymentMutation = () => {
  return useMutation({
    mutationFn: ({ticket,paymentIntentId,vendorId}: {ticket:ITicket,paymentIntentId:string,vendorId:string}) => confirmTicketAndPayment(ticket,paymentIntentId,vendorId)
  })
}


export const useCancelTicketMutation = () => {
  return useMutation({
    mutationFn: ({ticketId,cancelCount}: {ticketId:string,cancelCount:number}) => cancelTicket({ticketId,cancelCount})
  })
}


export const useGetWalletByIdMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getWalletById(params)
  })
}

export const useGetWalletAmountMutation = () => {
  return useMutation({
    mutationFn: () => getWalletAmount()
  })
}

export const useAddReviewMutation = () => {
  return useMutation({
    mutationFn: (review:IReview) => addReview(review)
  })
}


export const useGetAllReviewsMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getAllReviews(params)
  })
}
  

export const useGetAllWorkSamplesByVendorIdMutation = () => {
  return useMutation({
    mutationFn: ({vendorId,page,limit}: {vendorId:string,page:number,limit:number}) => getAllWorkSamplesByVendorId({vendorId,page,limit})
  })
}


export const useLogoutClient = () => {
  return useMutation({
    mutationFn: logoutClient,
  });
};