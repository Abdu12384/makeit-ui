import { IClient, IVendor, UserDTO } from "./User";



export interface IAxiosResponse {
	success: boolean;
	message: string;
}

export interface IAuthResponse extends IAxiosResponse {
	user: UserDTO;
}

export type IClientResponse = {
	success: boolean;
	message: string;
	user: IClient;
};

export type IVendorResponse = {
	success: boolean;
	message: string;
	user: IVendor;
};

export type IAllVendorResponse = {
	totalPages: number;
	currentPage: number;
	vendor: IVendor[];
};


