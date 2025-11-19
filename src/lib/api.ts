import axios from "axios";
import { toast } from "sonner";

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

// Optional: Add register method
export const register = async (data: any) => {
  try {
    await api.post("/auth/register", data);
    toast.success("Registration successful!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Registration failed");
    throw err;
  }
};

export default api;