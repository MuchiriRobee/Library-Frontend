// src/components/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Home, BookOpen, History, Users, Settings, LogOut, Menu, Library, UserCog, Shield 
} from "lucide-react";
import { motion } from "framer-motion";

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
    { to: "/members", label: "Members", icon: Users },
  ],
  SuperAdmin: [
    { to: "/dashboard", label: "System Dashboard", icon: Shield },
    { to: "/users", label: "All Users", icon: Users },
    { to: "/admins", label: "Manage Admins", icon: UserCog },
    { to: "/settings", label: "System Settings", icon: Settings },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const items = user ? navItems[user.role] : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border">
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
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
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
        </nav>
      </ScrollArea>

{/* Bottom: User Profile + Logout */}
<div className="p-4 border-t border-border mt-auto">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="w-full justify-start h-14">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-left flex-1">
          <p className="font-medium text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuItem 
        onClick={logout} 
        className="text-red-600 dark:text-red-400 font-medium cursor-pointer"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sheet */}
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
    </>
  );
}