

type statusTypes = "active" | "pending" | "blocked";

export type ForType = "active" | "non-active" | "all" | "pending";

export type UserRoles = "admin" | "vendor" | "client";

export type UserType = "client" | "vendor";

export interface ILoginData {
	email: string;
	password: string;
	role: UserRoles;	
}



export interface User{
	userId?: string
	name:string,
	email:string,
	phone:string,
	password?:string,
	role?:UserRoles,
	status?:statusTypes,
	profileImage?:string
	createdAt?:Date,
	lastLogin?:Date,
	updatedAt?:Date,
	onlineStatus?:'online'|'offline',
	isAdmin?:boolean
}


export interface IAdmin extends User {
  isSuperAdmin?: boolean;
}



export interface IClient extends User{
	userId?:string,
	googleVarified?:boolean
}


export interface IVendor extends User{
	idProof?: string,
	vendorId?: string,
	// vendorStatus?:'pending'| 'approved' | 'rejected'
	rejectionReason?:string,
	aboutVendor?:string
}



export type UserDTO = IAdmin | IClient | IVendor








export interface FetchUsersParams {
	userType: UserType
	page: number;
	limit: number;
	search: string;
}



export interface FetchVendorParams {
	forType: ForType;
	page: number;
	limit: number;
	search: string;
}