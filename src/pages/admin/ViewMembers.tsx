// src/pages/admin/ViewMembers.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Shield, Crown, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface LibraryUser {
  id: number;
  name: string;
  email: string;
  role: "Member" | "Admin" | "SuperAdmin";
  joinDate: string;
  totalBorrows: number;
  status: "Active" | "Inactive";
}

const mockMembers: LibraryUser[] = [
  { id: 1, name: "Alex Johnson", email: "member@library.com", role: "Member", joinDate: "2024-01-15", totalBorrows: 12, status: "Active" },
  { id: 2, name: "Sarah Admin", email: "admin@library.com", role: "Admin", joinDate: "2023-06-20", totalBorrows: 5, status: "Active" },
  { id: 3, name: "David Super", email: "super@library.com", role: "SuperAdmin", joinDate: "2023-01-10", totalBorrows: 3, status: "Active" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "Member", joinDate: "2024-03-22", totalBorrows: 18, status: "Active" },
  { id: 5, name: "James Chen", email: "james@example.com", role: "Member", joinDate: "2024-07-01", totalBorrows: 8, status: "Active" },
  { id: 6, name: "Sofia Martinez", email: "sofia@example.com", role: "Member", joinDate: "2024-09-10", totalBorrows: 4, status: "Active" },
  { id: 7, name: "Michael Brown", email: "michael@example.com", role: "Member", joinDate: "2023-11-05", totalBorrows: 22, status: "Active" },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case "SuperAdmin":
      return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Crown className="w-3 h-3 mr-1" /> SuperAdmin</Badge>;
    case "Admin":
      return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
    case "Member":
      return <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400"><UserCheck className="w-3 h-3 mr-1" /> Member</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

export default function ViewMembers() {
  const [search, setSearch] = useState("");

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold rainbow-text-slow">
                All Library Members
              </h1>
              <p className="text-xl text-muted-foreground mt-1">
                View all registered users • {mockMembers.length} total
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
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
                  <TableHead>Joined</TableHead>
                  <TableHead>Borrows</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="h-20 hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">{member.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(member.role)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{member.joinDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {member.totalBorrows}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={member.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}>
                        {member.status}
                      </Badge>
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