import axios from "axios";

const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 console.log('auth file',BACKEND_URL)
const authAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/auth`,
  withCredentials:true
})

export default authAxiosInstance