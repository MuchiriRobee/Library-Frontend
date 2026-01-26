// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface User {
  user_id: number;        // ← Match your backend field name
  username: string;
  email: string;
  role: "Admin" | "Member";
  created_at?: string;
  updated_at?: string;
  total_borrows?: number;
  // token is stored separately
}

interface AuthContextType {
  user: User | null;
  token: string | null;           // ← Optional: expose token if needed elsewhere
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;  // ← NEW: Add this
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Optionally set auth header globally
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/users/login", { email, password });

      if (res.data.success) {
        const { token: newToken, user: loggedInUser } = res.data.data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(loggedInUser));

        setToken(newToken);
        setUser(loggedInUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        toast.success(`Welcome back, ${loggedInUser.username}!`);
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
        role: "Member",
      });

      if (res.data.success) {
        //toast.success("Account created successfully! Please sign in.");
        return { success: true };
      } else {
        toast.error(res.data.message || "Registration failed");
        return { success: false };
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Email already exists";
      toast.error(message);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
    toast.info("Logged out successfully");
  };

  // ← NEW: Function to update user in context + localStorage
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // If token remains the same, no need to update it
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        updateUser,     // ← Now provided!
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};