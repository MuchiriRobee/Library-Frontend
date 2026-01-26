// src/pages/public/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";           // ← import the axios instance

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

useEffect(() => {
  const token = searchParams.get('token');
  if (!token) {
    setStatus('error');
    setMessage("Invalid or missing verification link");
    return;
  }

  // Single-use guard – only one verification attempt per mount
  let didRun = false;

  const verify = async () => {
    if (didRun) return;
    didRun = true;

    setStatus('loading');

    try {
      console.log("[frontend] Verifying with token:", token);

      const res = await api.get("/users/verify-email", {
        params: { token },
      });

      console.log("[frontend] Full response:", res.data);

      // Only update state if we are still the active attempt
      if (!didRun) return;

      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message || "Email verified! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2400);
      } else {
        setStatus('error');
        setMessage(
          res.data.message ||
          "This link may be invalid, expired, or has already been used."
        );
      }
    } catch (err: any) {
      if (!didRun) return;
      console.error("[frontend] Verification error:", err);
      setStatus('error');
      setMessage(
        err.response?.data?.message ||
        "Could not complete verification. Please try again."
      );
    }
  };

  verify();

  // Optional: cleanup (not strictly needed with didRun flag)
  return () => {
    didRun = true; // prevent any late async updates
  };
}, [searchParams, navigate]);

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:via-black dark:to-emerald-950 px-4 py-8">
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-black/95">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
              <p className="text-lg">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <p className="text-green-600 text-lg font-medium">{message}</p>
          )}

          {status === 'error' && (
            <>
              <p className="text-red-600 text-lg font-medium">{message}</p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-emerald-600 hover:underline"
                >
                  Go to Login
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}