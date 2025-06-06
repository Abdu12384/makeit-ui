
import { changeBookingStatus, createEvent, createService, createWorkSample, editEvent, getAllBookings, getAllCategories, getAllEventsByVendorId, getAllServicesByVendorId, getAllWorkSamplesByVendorId, getAttendeesById, getDashboardData, getWalletById, logoutVendor, updateService, updateVendorProfile, updateWorkSample, uploadImageCloudinary, vendorChangePassword, vendorCreateAccount, VendorLogin, vendorSignup, verifyTicket } from "@/services/vendor/vendorService";
import { IEventFormValues } from "@/types/event";
import { ServiceFormValues } from "@/types/service";
import { ILoginData } from "@/types/User";
import { WorkSample } from "@/types/worksample/work-sample";
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



export const useVendorSignupMutation = () =>{
   return useMutation({
     mutationFn: async (formData: FormValues) =>{
        return await vendorSignup(formData)
     }
   })
}



export const useCreateAccountMutation = () => {
  return useMutation({
      mutationFn: ({ formdata, otpString }: { formdata: Record<string, string | boolean | number>; otpString: string }) => vendorCreateAccount({ formdata, otpString })

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
     mutationFn:(data: ServiceFormValues) => createService(data)
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
    mutationFn: ({serviceId,data}: {serviceId:string,data:ServiceFormValues}) => updateService({serviceId,data}),
  });
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
    mutationFn: (params: {limit:number,skip:number}) => getAllBookings(params.limit,params.skip),
  });
}




export const useCreateEventMutation = () => {
   return useMutation({
     mutationFn: (data:IEventFormValues) => createEvent(data)
   })
}


export const useGetAllEventsByVendorIdMutation = () => {
  return useMutation({
    mutationFn: ({page,limit}: {page:number,limit:number}) => getAllEventsByVendorId(page,limit),
  });
}


export const useEditEventMutation = () => {
  return useMutation({
    mutationFn: ({data,eventId}: {data:IEventFormValues,eventId:string}) => editEvent({data,eventId}),
  });
}


export const useGetVendorWalletByIdMutation = () => {
  return useMutation({
    mutationFn: ({page,limit}: {page:number,limit:number}) => getWalletById({page,limit}),
  });
}



export const useVerifyTicketMutation = () => {
   return useMutation({
     mutationFn: ({ticketId,eventId}: {ticketId:string,eventId:string}) => verifyTicket({ticketId,eventId}),
   })
}




export const useGetAttendeesByIdMutation = () => {
  return useMutation({
    mutationFn: (eventId:string) => getAttendeesById(eventId),
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





