// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/public/Landing";
import AuthPage from "@/pages/public/Login";
import ProfileSettings from "./pages/public/ProfileSettings";
import Dashboard from "@/pages/member/Dashboard";
import Books from "@/pages/member/Books";
import Borrows from "./pages/member/Borrows";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageBorrows from "./pages/admin/ManageBorrows";
import ViewMembers from "./pages/admin/ViewMembers";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import ManageUsers from "./pages/superadmin/ManageUsers";
import ReportsLogs from "./pages/superadmin/ReportsLogs";
import Sidebar from "@/components/layout/Sidebar";
import AnimatedPage from "@/components/layout/AnimatedPage";
import ParticleBackground from "@/components/layout/ParticleBackground";
import { useAuth } from "@/context/AuthContext";

function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-8 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <ParticleBackground />
      <main className="lg:pl-72 min-h-screen">
        <AnimatedPage>
          <Outlet />  {/* This renders Dashboard, Books, etc. */}
        </AnimatedPage>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage />} />
        
        

        {/* Protected – all member pages go here */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/borrow-history" element={<Borrows />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-books" element={<ManageBooks />} />
          <Route path="/manage-borrows" element={<ManageBorrows />} />
          <Route path="/view-members" element={<ViewMembers />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/reports" element={<ReportsLogs />} />
          <Route path="/profile" element={<ProfileSettings />} />
          {/* Future pages just add here */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;