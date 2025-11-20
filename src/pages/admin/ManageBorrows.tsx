// src/pages/admin/ManageBorrows.tsx
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Calendar, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookCover from "@/assets/images/book.jpeg";

const BOOK_COVER =BookCover;
interface BorrowRecord {
  id: number;
  memberName: string;
  memberEmail: string;
  bookTitle: string;
  borrowedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: "Borrowed" | "Returned" | "Overdue";
}

const mockBorrows: BorrowRecord[] = [
  { id: 1, memberName: "Alex Johnson", memberEmail: "alex@example.com", bookTitle: "The Midnight Library", borrowedDate: "2025-11-10", dueDate: "2025-11-24", status: "Borrowed" },
  { id: 2, memberName: "Sarah Chen", memberEmail: "sarah@example.com", bookTitle: "Atomic Habits", borrowedDate: "2025-11-01", dueDate: "2025-11-15", status: "Borrowed" },
  { id: 3, memberName: "James Torres", memberEmail: "james@example.com", bookTitle: "Dune", borrowedDate: "2025-10-20", dueDate: "2025-11-03", status: "Returned" },
  { id: 4, memberName: "Emma Williams", memberEmail: "emma@example.com", bookTitle: "Project Hail Mary", borrowedDate: "2025-11-05", dueDate: "2025-11-19", status: "Borrowed" },
  { id: 5, memberName: "Michael Brown", memberEmail: "michael@example.com", bookTitle: "The Psychology of Money", borrowedDate: "2025-10-28", dueDate: "2025-11-11", status: "Borrowed" },
];

const today = new Date("2025-11-18"); // Fixed current date as per system

export default function ManageBorrows() {
  const [borrows, setBorrows] = useState(mockBorrows);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Borrowed" | "Returned" | "Overdue">("all");

  // Compute displayed status (auto Overdue if Borrowed and past due)
  const getDisplayedStatus = (record: BorrowRecord) => {
    if (record.status === "Returned") return "Returned";
    const due = new Date(record.dueDate);
    if (due < today) return "Overdue";
    return "Borrowed";
  };

  const filteredBorrows = useMemo(() => {
    return borrows.filter(record => {
      const displayedStatus = getDisplayedStatus(record);
      const matchesSearch = record.memberName.toLowerCase().includes(search.toLowerCase()) ||
                           record.memberEmail.toLowerCase().includes(search.toLowerCase()) ||
                           record.bookTitle.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = statusFilter === "all" || displayedStatus === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [borrows, search, statusFilter]);

  const handleStatusChange = (id: number, newStatus: "Borrowed" | "Returned" | "Overdue") => {
    setBorrows(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus === "Returned" || newStatus === "Overdue" ? newStatus : "Borrowed" } : r
    ));
    toast.success(`Borrow status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Borrowed": return <Badge className="bg-blue-500 text-white">Borrowed</Badge>;
      case "Returned": return <Badge className="bg-emerald-500 text-white">Returned</Badge>;
      case "Overdue": return <Badge variant="destructive">Overdue</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
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
          <h1 className="text-4xl font-bold mb-3 rainbow-text-slow">
            Manage Borrow Records
          </h1>
          <p className="text-xl text-muted-foreground">
            View and update all borrow records 
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by member, email or book title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="Borrowed">Borrowed</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Borrow Records Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrows.map((record) => {
                  const displayedStatus = getDisplayedStatus(record);
                  return (
                    <TableRow key={record.id} className="h-24">
                      <TableCell>
                        <img src={BOOK_COVER} alt={record.bookTitle} className="w-14 h-20 object-cover rounded shadow" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium"><User className="h-4 w-4" />{record.memberName}</p>
                          <p className="text-sm text-muted-foreground">{record.memberEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold"><BookOpen className="h-4 w-4" />{record.bookTitle}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {record.borrowedDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {record.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={displayedStatus}
                          onValueChange={(value) => handleStatusChange(record.id, value as any)}
                        >
                          <SelectTrigger className="w-32 flex items-center gap-2">
                            {getStatusBadge(displayedStatus)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Borrowed">Borrowed</SelectItem>
                            <SelectItem value="Returned">Returned</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
 
  );
}