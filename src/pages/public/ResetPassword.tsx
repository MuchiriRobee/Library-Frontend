// src/pages/public/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";


const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token");
    }
  }, [token]);

  const onSubmit = async (data: ResetForm) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: data.password.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2200);
      } else {
        setStatus("error");
        setMessage(result.message || "Failed to reset password");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShow = (field: "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (status !== "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>
              {status === "success" ? "Success!" : "Error"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className={status === "success" ? "text-green-600" : "text-red-600"}>{message}</p>
            {status === "success" && (
              <div className="mt-6 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-black dark:to-emerald-950 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="p-5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full shadow-xl">
            <KeyRound className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground mt-2">Choose a strong password for your account</p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-black/95">
          <CardContent className="pt-8 pb-10 px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword.new ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-12 pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => toggleShow("new")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword.confirm ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-12 pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => toggleShow("confirm")}
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
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}