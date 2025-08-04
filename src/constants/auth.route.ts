import { BASE_URL } from "./route";


export const AUTH_ROUTES = {
  SEND_OTP: `${BASE_URL.AUTH}/send-otp`,
  SIGNUP: `${BASE_URL.AUTH}/signup`,
  LOGIN: `${BASE_URL.AUTH}/login`,
  GOOGLE_AUTH: `${BASE_URL.AUTH}/google-auth`,
  FORGOT_PASSWORD: `${BASE_URL.AUTH}/forgot-password`,
  RESET_PASSWORD: `${BASE_URL.AUTH}/reset-password`,
};