import { adminLogin,createCategory, editCategory, getAdminWalletById, getAllBookings, getAllCategories, getAllDashboardData, getAllEvents, logoutAdmin, updateCategoryStatus, updateUserStatus, updateVendorStatusById } from "@/services/admin/adminService";
import { IFetchVendorParams, ForType, ILoginData } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, UserQueryParams } from "@/services/admin/adminService";
import { IAllVendorResponse, IAxiosResponse } from "@/types/response";
import { IPaginationParams } from "@/types/params";
import { ICategory } from "@/types/category";




interface QueryParams {
  limit?: number;
  page?: number;
  search?: string;
}




export const useAdminLoginMutation = () =>{
      return useMutation({
        mutationFn:(user:ILoginData) => adminLogin(user)
      })
}




export const useGetAllUsers = (params: UserQueryParams) => {
  return useQuery({
    queryKey: ['users', params.page, params.limit, params.search, params.userType],
    queryFn: () => getAllUsers(params)
  });
};




export const useUpdateUserStatusMutaiion = <T = IAxiosResponse>() => {
  return useMutation<T, Error, { userType: string; userId: string }>({
    mutationFn: updateUserStatus as (data: { userType: string; userId: string }) => Promise<T>,

  });
};




export const useAllVendorQueryMutation = (
	queryFunc: (params: IFetchVendorParams) => Promise<IAllVendorResponse>,
	page: number,
	limit: number,
	search: string,
	forType: ForType
) => {
	return useQuery<IAllVendorResponse>({
		queryKey: ["vendor", forType, page, limit, search],
		queryFn: () =>
			queryFunc({
				page,
				limit,
				search,
				forType,
			}),
	});
};




export const useUpdateVendorStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IAxiosResponse, Error, { vendorId: string; status: string; message?: string }>({
    mutationFn: ({ vendorId, status, message }) => updateVendorStatusById({ id: vendorId, status, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};




export const useCreateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<IAxiosResponse, Error, ICategory>({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};    




export const useGetAllCategoriesQuery = (params: QueryParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getAllCategories(params),
  });
};





export const useUpdateCategoryStatusMutation = () => {
  return useMutation<IAxiosResponse, Error, { id: string; status: string }>({
    mutationFn: ({ id, status }) => updateCategoryStatus(id, status),
  });
};



export const useEditCategoryMutation = () => {
	 return useMutation<IAxiosResponse, Error, { id: string; description: string; title: string; image?: string }>({
		mutationFn: ({ id, description,title,image}) => editCategory({data:{description,title,image},categoryId:id}),
	});   
};




export const useGetAdminWalletByIdMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getAdminWalletById(params)
  })
}
  

export const useGetAllBookingsMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getAllBookings(params)
  })
} 


export const useGetAllEventsMutation = () => {
  return useMutation({
    mutationFn: (params:IPaginationParams) => getAllEvents(params)
  })
} 


export const useGetAllDashboardDataMutation = () => {
    return useMutation({
        mutationFn:(period:string) => getAllDashboardData(period)
    })
}


  

export const useLogoutAdmin = () => {
  return useMutation({
    mutationFn: logoutAdmin,
  });
};