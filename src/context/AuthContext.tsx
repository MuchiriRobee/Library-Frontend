// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type {ReactNode} from "react";
import api from "@/lib/api";
import type { AuthState } from "../types/index";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Check token on app load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setState({ user: null, token: null, isLoading: false });
        return;
      }

      try {
        const res = await api.get("/auth/me"); // Your backend should have this endpoint
        setState({ user: res.data, token, isLoading: false });
      } catch (err) {
        localStorage.removeItem("token");
        setState({ user: null, token: null, isLoading: false });
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
  // MOCK LOGIN – works instantly for demo
  const mockUsers = {
    "member@library.com": { id: 1, email: "member@library.com", name: "Alex Johnson", role: "Member" as const },
    "admin@library.com": { id: 2, email: "admin@library.com", name: "Sarah Admin", role: "Admin" as const },
    "super@library.com": { id: 3, email: "super@library.com", name: "David Super", role: "SuperAdmin" as const },
  };

  // Simulate small delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const user = mockUsers[email as keyof typeof mockUsers];

  if (user && (password === "123456" || password === "admin123" || password === "super123")) {
    const fakeToken = "mock-jwt-token-" + Date.now();
    localStorage.setItem("token", fakeToken);
    setState({ user, token: fakeToken, isLoading: false });
    toast.success(`Welcome back, ${user.name.split(" ")[0]}!`, {
      description: `Logged in as ${user.role}`,
    });
  } else {
    toast.error("Invalid email or password", {
      description: "Use one of the demo accounts below",
    });
    throw new Error("Invalid credentials");
  }
};
  {/*const login = async (email: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setState({ user: res.data.user, token: res.data.token, isLoading: false });
      toast.success(`Welcome back, ${res.data.user.name}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };*/}

  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, token: null, isLoading: false });
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};