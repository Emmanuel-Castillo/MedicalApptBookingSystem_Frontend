import axios from "axios";
import { LOCAL_STORAGE_AUTH_KEY } from "../context/AuthContext";
import { useAuthStore } from "../store/auth.store";

// Creating api instance with given base url
const api = axios.create({
  baseURL: process.env.REACT_APP_WEB_API,
  withCredentials: true,
});

// Get token from localStorage, and plug that into authorization header
// 1. Request interceptor: Add jwt access token to headers
api.interceptors.request.use(
  (config) => {
    
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Redirect user to login if jwt access token has expired
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const requestUrl = error.config?.url || "";

//     if (status === 401 && !requestUrl.includes("/auth/login")) {
//       localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
