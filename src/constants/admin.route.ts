import { BASE_URL } from "./route";

export const ADMIN_ROUTES = {
  REFRESH_SESSION: `${BASE_URL.ADMIN}/refresh-session`,
  REFRESH_TOKEN: `${BASE_URL.ADMIN}/refresh-token`,
  LOGIN: `${BASE_URL.ADMIN}/login`,
  USERS: `${BASE_URL.ADMIN}/users`,
  USER_STATUS: `${BASE_URL.ADMIN}/user/status`,
  VENDORS: `${BASE_URL.ADMIN}/vendors`,
  VENDOR_BY_ID: (id: string) => `${BASE_URL.ADMIN}/vendor/${id}`,
  CATEGORY: `${BASE_URL.ADMIN}/category`,
  CATEGORY_BY_ID: (id: string) => `${BASE_URL.ADMIN}/category/${id}`,
  WALLET: `${BASE_URL.ADMIN}/wallet`,
  BOOKINGS: `${BASE_URL.ADMIN}/bookings`,
  EVENTS: `${BASE_URL.ADMIN}/events`,
  DASHBOARD: `${BASE_URL.ADMIN}/dashboard`,
  LOGOUT: `${BASE_URL.ADMIN}/logout`,
};