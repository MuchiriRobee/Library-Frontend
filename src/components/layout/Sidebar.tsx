// src/components/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Home, BookOpen, History, Users, Settings, LogOut, Menu, Library,
  Shield, Moon, Sun, Calendar, UserCog
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const navItems = {
  Member: [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/books", label: "Browse Books", icon: BookOpen },
    { to: "/borrow-history", label: "My Borrows", icon: History },
  ],
  Admin: [
    { to: "/admin", label: "Admin Dashboard", icon: Home },
    { to: "/manage-books", label: "Manage Books", icon: Library },
    { to: "/manage-borrows", label: "Borrow Records", icon: History },
    { to: "/view-members", label: "Members", icon: Users },
  ],
  SuperAdmin: [
    { to: "/superadmin", label: "System Dashboard", icon: Shield },
    { to: "/manage-users", label: "Manage Users", icon: Users },
    { to: "/reports", label: "Reports & Logs", icon: UserCog },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const items = user ? navItems[user.role] || [] : [];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dueDateLimit, setDueDateLimit] = useState("14");
  const [dateFormat, setDateFormat] = useState("PPP");
  const isSuperAdmin = user?.role === "SuperAdmin";
  

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
            <Library className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold rainbow-text">
              LibraryHub
            </h1>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start h-12 text-left font-medium"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </motion.div>
              </Link>
            );
          })}

          {/* System Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-12 text-left font-medium">
                <Settings className="mr-3 h-5 w-5" />
                System Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Preferences</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Sun className="mr-2 h-4 w-4" /> Theme & Appearance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" /> Date Format
              </DropdownMenuItem>
              {isSuperAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>SuperAdmin</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="text-purple-600 dark:text-purple-400">
                    <Shield className="mr-2 h-4 w-4" /> Due Date Limit
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fixed Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </ScrollArea>

      {/* User Profile - Now Links to Profile Page */}
      <Link to="/profile" className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start h-14">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </Button>
      </Link>
    </div>
  );

  // Settings Dialog (same as before — kept for completeness)
  return (
    <>
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <SidebarContent />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-50 lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">System Settings</DialogTitle>
            <DialogDescription>Customize your LibraryHub experience</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Light, Dark, or System</p>
                </div>
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label><Calendar className="h-5 w-5 mr-2" /> Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PPP">Aug 15, 2025</SelectItem>
                  <SelectItem value="PPPP">Thursday, Aug 15th, 2025</SelectItem>
                  <SelectItem value="yyyy-MM-dd">2025-08-15</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isSuperAdmin && (
              <div className="pt-4 border-t">
                <Label className="text-purple-600 dark:text-purple-400">
                  <Shield className="h-5 w-5 mr-2" /> Due Date Limit (days)
                </Label>
                <Select value={dueDateLimit} onValueChange={setDueDateLimit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14">14 days (Current)</SelectItem>
                    <SelectItem value="21">21 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => { toast.success("Settings saved!"); setSettingsOpen(false); }}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}