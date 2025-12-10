// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect} from "react";
import type {ReactNode} from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  email: string;
  role: "Admin" | "Member";
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/users/login", { email, password });

    if (res.data.success) {
      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser({ ...user, token });
      toast.success(`Welcome back, ${user.username}!`);
    } else {
      toast.error(res.data.message || "Login failed");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Invalid email or password");
  }
};

const signup = async (username: string, email: string, password: string) => {
  try {
    const res = await api.post("/users/register", {
      username,
      email,
      password,
      role: "Member", // Your backend allows this
    });

    if (res.data.success) {
      toast.success("Account created! Please log in.");
    } else {
      toast.error(res.data.message || "Registration failed");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Email already exists");
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};