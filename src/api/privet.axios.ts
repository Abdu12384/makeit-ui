import axios from "axios";
import { ADMIN_ROUTES  } from "@/constants/admin.route";
import { CLIENT_ROUTES } from "@/constants/client.route";
import { VENDOR_ROUTES } from "@/constants/vendor.route";
import { store } from "@/store/store";
import { clientLogout } from "@/store/slices/client.slice";
import { adminLogout } from "@/store/slices/admin.slice";
import { vendorLogout } from "@/store/slices/vendor.slice";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Detect role from URL path (e.g., /client/xyz)
		const urlPart = originalRequest.url?.split("/")[1];
		let role = "";

		switch (urlPart) {
			case "_cl":
				role = "_cl";
				break;
			case "_ad":
				role = "_ad";
				break;
			case "_ve":
				role = "_ve";
				break;
			default:
				role = "";
		}

		// Handle token expired
		if (
			error.response?.status === 401 &&
			!originalRequest._retry 
			// error.response?.data?.message === "Token Expired"
		) {
			originalRequest._retry = true;

			if (!isRefreshing) {
				isRefreshing = true;

        const refreshEndpoint =
                role === "_ad"
                ? ADMIN_ROUTES.REFRESH_TOKEN
                : role === "_cl"
                ? CLIENT_ROUTES.REFRESH_TOKEN
                : role === "_ve"
                ? VENDOR_ROUTES.REFRESH_TOKEN
                : "";
				try {
					await axiosInstance.post(refreshEndpoint);
					isRefreshing = false;
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;
					handleLogout(role);
					return Promise.reject(refreshError);
				}
			}
		}

		// Handle forbidden or blacklisted token
		const message = error.response?.data?.message;
		if (
			error.response?.status === 403 &&
			[
				"Token is blacklisted",
				"Access denied: Your account has been blocked",
			].includes(message) &&
			!originalRequest._retry
		) {
			handleLogout(role);
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);

// Helper function for logout
const handleLogout = (role: string) => {
	switch (role) {
		case "_cl":
			store.dispatch(clientLogout());
			window.location.href = "/";
			break;
		case "_ad":
			store.dispatch(adminLogout());
			window.location.href = "/admin";
			break;
		case "_ve":
			store.dispatch(vendorLogout());
			window.location.href = "/vendor";
			break;
		default:
			window.location.href = "/";
	}
	toast("Please login again");
};
