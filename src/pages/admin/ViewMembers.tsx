// src/pages/admin/ViewMembers.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Shield, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

interface LibraryUser {
  user_id: number;
  username: string;
  email: string;
  role: "Member" | "Admin";
  created_at: string;
  total_borrows: number;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Admin":
      return <Badge className="bg-blue-600 text-white"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
    case "Member":
      return <Badge className="bg-emerald-600 text-white"><UserCheck className="w-3 h-3 mr-1" /> Member</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default function ViewMembers() {
  const [members, setMembers] = useState<LibraryUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Admin" | "Member">("all");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/users");
        const fetchedMembers = res.data.data.map((user: any) => ({
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
          created_at: format(new Date(user.created_at), "yyyy-MM-dd"),
          total_borrows: user.total_borrows || 0,
        }));
        setMembers(fetchedMembers);
      } catch (err) {
        toast.error("Failed to load members");
      }
    };
    fetchMembers();
  }, []);

  const handleRoleChange = async (id: number, newRole: "Member" | "Admin") => {
    try {
      await api.put(`/users/${id}`, { role: newRole });
      setMembers(members.map((m) => (m.user_id === id ? { ...m, role: newRole } : m)));
      toast.success("Role updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.username.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold rainbow-text-slow">
              View Members
            </h1>
            <p className="text-muted-foreground mt-2">Manage library users and their roles</p>
          </div>
        </div>

        {/* Search & Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value: "all" | "Admin" | "Member") => setRoleFilter(value)}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="mr-2 h-5 w-5" />
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Members Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Total Borrows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.user_id} className="h-20 hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
                            {member.username.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">{member.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value: "Member" | "Admin") => handleRoleChange(member.user_id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>{getRoleBadge(member.role)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{member.created_at}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {member.total_borrows}
                      </span>
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