import authAxiosInstance from "@/api/auth.axios";
import { ICategory } from "@/types/category";
import { IPaginationParams } from "@/types/params";
import { IAllVendorResponse, IAuthResponse, IAxiosResponse } from "@/types/response";
import {IFetchVendorParams, ILoginData, IVendor } from "@/types/User";
import { isAxiosError } from "axios";
import { ADMIN_ROUTES } from "@/constants/admin.route";
import { axiosInstance } from "@/api/privet.axios";
import { AUTH_ROUTES } from "@/constants/auth.route";


export interface UserQueryParams {
  page: number;
  limit: number;
  search: string;
  userType: string;
}



export const refreshAdminSession = async (): Promise<IAuthResponse> => {
	const response = await axiosInstance.get<IAuthResponse>(
		ADMIN_ROUTES.REFRESH_SESSION
	);
	return response.data;	
};



export const adminLogin = async (user:ILoginData) => {
  try {
     const response = await authAxiosInstance.post(AUTH_ROUTES.LOGIN,user)
     return response?.data
  } catch (error) {
    console.log('error while admin login')
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while admin login')	
  }
}







export const getAllUsers = async ({ page, limit, search, userType }: UserQueryParams) => {
  try {
    const response = await axiosInstance.get(ADMIN_ROUTES.USERS, {
      params: {
        page,
        limit,
        search,
        userType
      }
    });
    return response?.data;
  } catch (error) {
    console.log('error while fetching users');
    throw error;
  }
};




export  const updateUserStatus = async (data:{userType: string; userId: string}): Promise<IAxiosResponse> =>{
	try {
    const response = await axiosInstance.patch(ADMIN_ROUTES.USER_STATUS,
      {},
      {
      params:{
        userType: data.userType,
        userId: data.userId
      }
    })
    return response.data
  } catch (error) {
    console.log('error while updating user status',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while updating user status')	
  }
}





export const getAllVendors = async ({
	forType = "non-active",
	page = 1,
	limit = 10,
	search = "",
}: IFetchVendorParams): Promise<IAllVendorResponse> => {
	const response = await axiosInstance.get(ADMIN_ROUTES.VENDORS, {
		params: { forType, page, limit, search },
	});
	return {
		vendor: response.data.vendor as IVendor[],
		totalPages: response.data.totalPages,
		currentPage: response.data.currentPage,
	};
	
};




export const updateVendorStatusById = async ({
	id,
	status,
	message,
}: {
	id: string;
	status: string;
	message?: string;
}): Promise<IAxiosResponse> => {
	const response = await axiosInstance.put<IAxiosResponse>(
		ADMIN_ROUTES.VENDOR_BY_ID(id),
		{ status, message }
	);
	return response.data;
};



export const createCategory = async (data: ICategory) => {
	try {
		const response = await axiosInstance.post(ADMIN_ROUTES.CATEGORY, data);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while creating category')	
	  }
};


export const getAllCategories = async (params: { limit?: number; page?: number; search?: string }) => {
  const response = await axiosInstance.get(ADMIN_ROUTES.CATEGORY, { params });
  return response.data;
};



export const updateCategoryStatus = async (id: string, status: string) => {
  try {
	const response = await axiosInstance.patch(ADMIN_ROUTES.CATEGORY_BY_ID(id), { status });
	return response.data;
  } catch (error) {
    console.log('error while updating category status',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while updating category status')	
  }
};


export const editCategory = async ({data,categoryId}: {data: ICategory,categoryId: string}) => {
	try {
		const response = await axiosInstance.put(ADMIN_ROUTES.CATEGORY_BY_ID(categoryId), data);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while editing category')	
		}
};


export const getAdminWalletById = async ({page = 1,limit = 10}:IPaginationParams) => {
	try {
		const response = await axiosInstance.get(ADMIN_ROUTES.WALLET,{
			params:{
				page,
				limit,
			}
		})
		return response.data
	} catch (error) {
		console.log('error while admin get wallet by id',error)
		throw error
	}
}


export const getAllBookings = async ({page = 1,limit = 10}:IPaginationParams) => {
	try {
		const response = await axiosInstance.get(ADMIN_ROUTES.BOOKINGS, {
			params:{
				page,
				limit,
			}
		})
		return response.data
	} catch (error) {
		console.log('error while admin get all bookings',error)
		throw error
	}
}



export const getAllEvents = async ({page = 1,limit = 10}:IPaginationParams) => {
	try {
		const response = await axiosInstance.get(ADMIN_ROUTES.EVENTS, {
			params:{
				page,
				limit,
			}
		})
		return response.data
	} catch (error) {
		console.log('error while admin get all events',error)
		throw error
	}
}




export const getAllDashboardData = async (period:string) => {
    try {
        const response = await axiosInstance.get(ADMIN_ROUTES.DASHBOARD, {
            params:{
                period
            }
        })
        return response.data
    } catch (error) {
        console.log('error while admin get all dashboard data',error)
        throw error
    }
}


  


export const logoutAdmin = async (): Promise<IAxiosResponse> => {
	try {
	const response = await axiosInstance.post(ADMIN_ROUTES.LOGOUT);
	return response.data;
} catch (error) {
	console.log('error while admin logout',error)
	throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging out')	
}
};
