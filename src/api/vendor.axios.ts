

import axios from "axios";
import toast from "react-hot-toast";
// import { store } from "@/store/store";
// import { barberLogout } from "@/store/slices/barber.slice";

export const VendorAxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL + "/vendor",
	withCredentials: true,
});

let isRefreshing = false;

VendorAxiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await VendorAxiosInstance.post("/vendor/refresh-token");
					isRefreshing = false;
					return VendorAxiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;

					// store.dispatch(barberLogout());

					window.location.href = "/";
					toast("Please login again");
					return Promise.reject(refreshError);
				}
			}
		}

		if (
			(error.response.status === 403 &&
				error.response.data.message === "Token is blacklisted") ||
			(error.response.status === 403 &&
				error.response.data.message ===
					"Access denied: Your account has been blocked" &&
				!originalRequest._retry)
		) {
			console.log("Session ended");
			// store.dispatch(barberLogout())

			window.location.href = "/vendor";
			toast("Please login again");
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
)