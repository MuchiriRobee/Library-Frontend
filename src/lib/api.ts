import axios from "axios";
//import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", // Change if your backend port differs
  withCredentials: true, // Important if you use httpOnly cookies
});

// Request interceptor – adds token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;