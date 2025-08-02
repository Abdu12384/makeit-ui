
import { changeBookingStatus, createEvent, createService, createWorkSample, editEvent, getAllBookings, getAllCategories, getAllEventsByVendorId, getAllServicesByVendorId, getAllWorkSamplesByVendorId, getAttendeesById, getDashboardData, getWalletById, logoutVendor, saveVendorFCMToken, updateService, updateVendorProfile, updateWorkSample, uploadImageCloudinary, vendorCancelBooking, vendorChangePassword, vendorCreateAccount, VendorLogin, vendorSignup, verifyTicket, getVendorNotifications, markVendorNotificationAsRead, blockEvent, blockService, RescheduleBooking, getVendorBookedDates } from "@/services/vendor/vendorService";
import { IEvent } from "@/types/event";
import { IService } from "@/types/service";
import { IVendorData } from "@/types/signup";
import { ILoginData } from "@/types/User";
import { WorkSample } from "@/types/work-sample";
import { useMutation } from "@tanstack/react-query";

interface FormValues{
    name: string
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    idProof: string;
}


export const useUploadeImageToCloudinaryMutation = () => {
  return useMutation({
      mutationFn: async (formData: FormData) => {
          return await uploadImageCloudinary(formData)

      },

  })
}


export const useGetVendorBookedDates = () => {
  return useMutation({
    mutationFn: getVendorBookedDates,
  })
}



export const useSaveVendorFCMTokenMutation = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      return await saveVendorFCMToken(token)
    },
  })
}


export const useGetVendorNotificationsMutation = () => {
  return useMutation({
    mutationFn: getVendorNotifications,
  })
}

export const useMarkVendorNotificationAsReadMutation = () => {
  return useMutation({
    mutationFn: markVendorNotificationAsRead,
  })
}

export const useVendorSignupMutation = () =>{
   return useMutation({
     mutationFn: async (formData: FormValues) =>{
        return await vendorSignup(formData)
     }
   })
}



export const useCreateAccountMutation = () => {
  return useMutation({
      mutationFn: ({ formdata, otpString }: { formdata: IVendorData; otpString: string }) => vendorCreateAccount({ formdata, otpString })

  })
}


export const useVendorLoginMutation = () =>{
   return useMutation({
     mutationFn: (user:ILoginData) => VendorLogin(user)
   })
}



export const useVendorChangePasswordMutation = () => {
   return useMutation({
     mutationFn: (data:Record<string, string|number|boolean>) => vendorChangePassword(data)
   })
}



export const useUpdateVendorProfileMutation = () =>{
   return useMutation({
     mutationFn: ({data}:{data:Record<string, string|number|boolean>})=>
      updateVendorProfile({data})
   })
}





export const useCreateServiceMutation = () => {
   return useMutation({
     mutationFn:(data: IService) => createService(data)
   })
}


export const useGetAllServicesByVendorIdMutation = () => {
  return useMutation({
    mutationFn: (params: {
      page: number;
      limit: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }) => getAllServicesByVendorId(params), 
  });
}




export const useUpdateServiceMutation = () => {
  return useMutation({
    mutationFn: ({serviceId,data}: {serviceId:string,data:IService}) => updateService({serviceId,data}),
  });
}

export const useBlockServiceMutation = () => {
   return useMutation({
     mutationFn: (serviceId:string) => blockService(serviceId)
   })
}


export const useGetAllCategoriesMutation = () => {
  return useMutation({
    mutationFn: getAllCategories,
  });
};



export const useChangeBookingStatusMutation = () => {
  return useMutation({
    mutationFn: ({bookingId,status,reason}: {bookingId:string,status:string,reason?:string}) => changeBookingStatus({bookingId,status,reason}),
  });
}



export const useGetAllBookingsMutation = () => {
  return useMutation({
    mutationFn: (params: {page:number,limit:number,status:string}) => getAllBookings(params.page,params.limit,params.status),
  });
}


export const useVendorCancelBookingMutation = () => {
  return useMutation({
    mutationFn: ({bookingId,status,reason}: {bookingId:string,status:string,reason?:string}) => vendorCancelBooking({bookingId,status,reason}),
  });
}



export const useCreateEventMutation = () => {
   return useMutation({
     mutationFn: (data:IEvent) => createEvent(data)
   })
}

export const useBlockEventMutation = () => {
   return useMutation({
     mutationFn: (eventId:string) => blockEvent(eventId)
   })
}

export const useGetAllEventsByVendorIdMutation = () => {
  return useMutation({
    mutationFn: ({page,limit}: {page:number,limit:number}) => getAllEventsByVendorId(page,limit),
  });
}


export const useEditEventMutation = () => {
  return useMutation({
    mutationFn: ({data,eventId}: {data:IEvent,eventId:string}) => editEvent({data,eventId}),
  });
}

export const useRescheduleBookingMutation = () => {
  return useMutation({
    mutationFn: ({bookingId,selectedDate,rescheduleReason}: {bookingId:string,selectedDate:string,rescheduleReason:string}) => RescheduleBooking({bookingId,selectedDate,rescheduleReason}),
  });
}


export const useGetVendorWalletByIdMutation = () => {
  return useMutation({
    mutationFn: ({page,limit}: {page:number,limit:number}) => getWalletById({page,limit}),
  });
}



export const useVerifyTicketMutation = () => {
   return useMutation({
     mutationFn: ({ticketId,eventId,status}: {ticketId:string,eventId:string,status:string}) => verifyTicket({ticketId,eventId,status}),
   })
}




export const useGetAttendeesByIdMutation = () => {
  return useMutation({
    mutationFn: ({eventId,page,limit}:{eventId:string,page:number,limit:number}) => getAttendeesById({eventId,page,limit}),
  });
}


export const useCreateWorkSampleMutation = () => {
   return useMutation({
     mutationFn: (data:WorkSample) => createWorkSample(data)
   })
}


export const useGetAllWorkSamplesByVendorIdMutation = () => {
  return useMutation({
    mutationFn: ({page,limit}: {page:number,limit:number}) => getAllWorkSamplesByVendorId({page,limit}),
  });
}


export const useUpdateWorkSampleMutation = () => {
  return useMutation({
    mutationFn: ({data,workSampleId}: {data:WorkSample,workSampleId:string}) => updateWorkSample({data,workSampleId}),
  });
}


export const useGetDashboardDataMutation = () => {
  return useMutation({
    mutationFn: (period: string) => getDashboardData(period),
  });
}



export const useLogoutVendor = () => {
  return useMutation({
    mutationFn: logoutVendor,
  });
};





