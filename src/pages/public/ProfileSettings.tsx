// src/pages/ProfileSettings.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number").optional().or(z.literal("")),
  oldPassword: z.string().min(6, "Old password required"),
  newPassword: z.string().min(6, "New password must be 6+ chars"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user } = useAuth();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "+254 712 345 678",
    }
  });

  const onSubmit = (data: ProfileForm) => {
    console.log("Profile updated:", data);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold overview-text">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and security</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...register("name")} placeholder="John Doe" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input {...register("email")} type="email" placeholder="john@example.com" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-6 w-6" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input {...register("oldPassword")} type={showOld ? "text" : "password"} />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-3">
                    {showOld ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-sm text-red-500">{errors.oldPassword.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input {...register("newPassword")} type={showNew ? "text" : "password"} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3">
                      {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <Input {...register("confirmPassword")} type={showConfirm ? "text" : "password"} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3">
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}