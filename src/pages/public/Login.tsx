// src/pages/public/Login.tsx
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
//import {  CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Library, LogIn, UserPlus, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", // Change if your backend port differs
  withCredentials: true, // Important if you use httpOnly cookies
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState({ login: false, register: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email , data.password);
      
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      // Error toast already in context
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Replace with your actual register endpoint
      await api.post("/auth/register", data);
      toast.success("Account created! Please log in.");
      setActiveTab("login");
      registerForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = (field: "login" | "register" | "confirm") => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-black dark:to-emerald-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full shadow-xl backdrop-blur-sm">
            <Library className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="mt-6 text-4xl font-bold rainbow-text">
            Library Portal
          </h1>
          <p className="text-muted-foreground mt-2">Manage your reading journey with elegance</p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-black/95 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-t-lg bg-muted/50">
              <TabsTrigger value="login" className="text-lg font-semibold data-[state=active]:bg-background">
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="text-lg font-semibold data-[state=active]:bg-background">
                <UserPlus className="mr-2 h-5 w-5" /> Register
              </TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="px-8 pt-8 pb-10">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="member@library.com" type="email" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword.login ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-12 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => togglePassword("login")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword.login ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                                    <div className="text-left space-y-3">
                    <Link to="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
<div className="mt-8 p-5 bg-muted/50 rounded-lg border border-border">
  <p className="text-sm font-semibold text-foreground mb-3">Demo Accounts (click to fill)</p>
  <div className="space-y-3 text-xs">
    <button
      type="button"
      onClick={() => {
        loginForm.setValue("email", "member@library.com");
        loginForm.setValue("password", "123456");
      }}
      className="block w-full text-left p-3 rounded-md bg-background/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all border border-border"
    >
      Member → member@library.com / 123456
    </button>

    <button
      type="button"
      onClick={() => {
        loginForm.setValue("email", "admin@library.com");
        loginForm.setValue("password", "admin123");
      }}
      className="block w-full text-left p-3 rounded-md bg-background/80 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-all border border-border"
    >
      Admin → admin@library.com / admin123
    </button>

    <button
      type="button"
      onClick={() => {
        loginForm.setValue("email", "super@library.com");
        loginForm.setValue("password", "super123");
      }}
      className="block w-full text-left p-3 rounded-md bg-background/80 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all border border-border"
    >
      Super Admin → super@library.com / super123
    </button>
  </div>
  <p className="text-xs text-muted-foreground mt-3 italic">
    These will auto-fill the form — just click and press Sign In
  </p>
</div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>


                </form>
              </Form>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register" className="px-8 pt-8 pb-10">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword.register ? "text" : "password"}
                              placeholder="Create strong password"
                              className="h-12 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => togglePassword("register")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword.register ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword.confirm ? "text" : "password"}
                              placeholder="Repeat password"
                              className="h-12 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => togglePassword("confirm")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          {/* Back to Home */}
          <div className="pb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}