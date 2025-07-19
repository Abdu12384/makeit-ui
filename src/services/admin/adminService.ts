import { adminAxiosInstance } from "@/api/admin.axios";
import authAxiosInstance from "@/api/auth.axios";
import { PaginationParams } from "@/types/event";
import { IAllVendorResponse, IAuthResponse, IAxiosResponse } from "@/types/response";
import {FetchVendorParams, ILoginData, IVendor } from "@/types/User";
import { isAxiosError } from "axios";



export interface UserQueryParams {
  page: number;
  limit: number;
  search: string;
  userType: string;
}

export interface Category {
	title: string;
	description: string;
	image?:string
}


export const refreshAdminSession = async (): Promise<IAuthResponse> => {
	const response = await adminAxiosInstance.get<IAuthResponse>(
		"/admin/refresh-session"
	);
	return response.data;
};



export const adminLogin = async (user:ILoginData) => {
  try {
     const response = await authAxiosInstance.post('/login',user)
     return response?.data
  } catch (error) {
    console.log('error while admin login')
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while admin login')	
  }
}







export const getAllUsers = async ({ page, limit, search, userType }: UserQueryParams) => {
  try {
    const response = await adminAxiosInstance.get('/admin/users', {
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
    const response = await adminAxiosInstance.patch('/admin/user/status',
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
}: FetchVendorParams): Promise<IAllVendorResponse> => {
	const response = await adminAxiosInstance.get("/admin/vendors", {
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
	const response = await adminAxiosInstance.put<IAxiosResponse>(
		`/admin/vendor/${id}`,
		{ status, message }
	);
	return response.data;
};



export const createCategory = async (data: Category) => {
	try {
		const response = await adminAxiosInstance.post("/admin/category", data);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while creating category')	
	  }
};


export const getAllCategories = async (params: { limit?: number; page?: number; search?: string }) => {
  const response = await adminAxiosInstance.get("/admin/category", { params });
  return response.data;
};



export const updateCategoryStatus = async (id: string, status: string) => {
  try {
	const response = await adminAxiosInstance.patch(`/admin/category/${id}`, { status });
	return response.data;
  } catch (error) {
    console.log('error while updating category status',error)
    throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while updating category status')	
  }
};


export const editCategory = async ({data,categoryId}: {data: Category,categoryId: string}) => {
	try {
		const response = await adminAxiosInstance.put(`/admin/category/${categoryId}`, data);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while editing category')	
		}
};


export const getAdminWalletById = async ({page = 1,limit = 10}:PaginationParams) => {
	try {
		const response = await adminAxiosInstance.get('/admin/wallet',{
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


export const getAllBookings = async ({page = 1,limit = 10}:PaginationParams) => {
	try {
		const response = await adminAxiosInstance.get('/admin/bookings', {
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



export const getAllEvents = async ({page = 1,limit = 10}:PaginationParams) => {
	try {
		const response = await adminAxiosInstance.get('/admin/events', {
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
        const response = await adminAxiosInstance.get('/admin/dashboard', {
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
	const response = await adminAxiosInstance.post("/admin/logout");
	return response.data;
} catch (error) {
	console.log('error while admin logout',error)
	throw new Error(isAxiosError(error) ? error.response?.data.message : 'error while logging out')	
}
};
