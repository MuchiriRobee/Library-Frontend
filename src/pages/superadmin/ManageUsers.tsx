// src/pages/superadmin/ManageUsers.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Shield, Crown, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface LibraryUser {
  id: number;
  name: string;
  email: string;
  role: "Member" | "Admin" | "SuperAdmin";
  joinDate: string;
  totalBorrows: number;
  status: "Active" | "Inactive";
}

const mockUsers: LibraryUser[] = [
  { id: 1, name: "Alex Johnson", email: "member@library.com", role: "Member", joinDate: "2024-01-15", totalBorrows: 12, status: "Active" },
  { id: 2, name: "Sarah Admin", email: "admin@library.com", role: "Admin", joinDate: "2023-06-20", totalBorrows: 5, status: "Active" },
  { id: 3, name: "David Super", email: "super@library.com", role: "SuperAdmin", joinDate: "2023-01-10", totalBorrows: 3, status: "Active" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "Member", joinDate: "2024-03-22", totalBorrows: 28, status: "Active" },
  { id: 5, name: "James Chen", email: "james@example.com", role: "Member", joinDate: "2024-07-01", totalBorrows: 19, status: "Active" },
  { id: 6, name: "Michael Brown", email: "michael@example.com", role: "Admin", joinDate: "2023-11-05", totalBorrows: 22, status: "Active" },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case "SuperAdmin":
      return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"><Crown className="w-3 h-3 mr-1" /> SuperAdmin</Badge>;
    case "Admin":
      return <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
    case "Member":
      return <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium"><UserCheck className="w-3 h-3 mr-1" /> Member</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

export default function ManageUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Member" | "Admin" | "SuperAdmin">("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: number, newRole: "Member" | "Admin" | "SuperAdmin") => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    
    const user = users.find(u => u.id === userId);
    toast.success(`Role updated`, {
      description: `${user?.name} is now ${newRole}`,
      duration: 4000,
    });
  };

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bowrain-text">
                Manage All Users
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                View and manage all users roles
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <Card className="p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-0 shadow-xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
              <SelectTrigger className="w-full md:w-64 h-14">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden shadow-2xl border-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Borrows</TableHead>
                  <TableHead className="text-center">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="h-24 hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-4 ring-white dark:ring-gray-900 shadow-lg">
                          <AvatarFallback className={`font-bold text-lg ${
                            user.role === "SuperAdmin" ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" :
                            user.role === "Admin" ? "bg-gradient-to-br from-orange-500 to-red-500 text-white" :
                            "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                          }`}>
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.status}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm">{user.joinDate}</TableCell>
                    <TableCell>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {user.totalBorrows}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as any)}
                      >
                        <SelectTrigger className="w-44 mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Member">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4" /> Member
                            </div>
                          </SelectItem>
                          <SelectItem value="Admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" /> Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="SuperAdmin">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4" /> SuperAdmin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}