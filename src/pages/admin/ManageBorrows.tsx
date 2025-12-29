import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added missing import
import { Search, Calendar, User, BookOpen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookCover from "@/assets/images/book.jpeg";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const BOOK_COVER = BookCover;

interface BorrowRecord {
  id: number;
  memberName: string;
  memberEmail: string;
  bookTitle: string;
  borrowedDate: string;
  dueDate: string;
  status: "Borrowed" | "Returned" | "Overdue";
}

export default function ManageBorrows() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Borrowed" | "Returned" | "Overdue">("all");
  const queryClient = useQueryClient();

  const { data: borrows = [], isLoading } = useQuery<BorrowRecord[]>({
    queryKey: ["all-borrows"],
    queryFn: async () => {
      const res = await api.get("/borrow");
      return res.data.data.map((record: any) => ({
        id: record.borrow_id,
        memberName: record.member_name,
        memberEmail: record.member_email,
        bookTitle: record.book_title,
        borrowedDate: format(new Date(record.borrow_date), "yyyy-MM-dd"),
        dueDate: format(new Date(record.due_date), "yyyy-MM-dd"),
        status: record.status as "Borrowed" | "Returned",
      }));
    },
  });

  const returnMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/borrow/return/${id}`),
    onSuccess: () => {
      toast.success("Book marked as returned");
      queryClient.invalidateQueries({ queryKey: ["all-borrows"] });
    },
    onError: () => toast.error("Failed to update"),
  });



  const getDisplayedStatus = (record: BorrowRecord): "Borrowed" | "Returned" | "Overdue" => {
    if (record.status === "Returned") return "Returned";
    const due = new Date(record.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today ? "Overdue" : "Borrowed";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Borrowed": return <Badge className="bg-blue-500">Borrowed</Badge>;
      case "Returned": return <Badge className="bg-emerald-500">Returned</Badge>;
      case "Overdue": return <Badge variant="destructive">Overdue</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    if (newStatus === "Returned") {
      returnMutation.mutate(id);
    }
    // Overdue/Borrowed are display-only
  };

  const handleSoftDelete = (id: number) => {
  queryClient.setQueryData<BorrowRecord[]>(["all-borrows"], (old) =>
    old ? old.filter((record) => record.id !== id) : old
  );
  toast.success("Record removed from view");
};

  const filteredBorrows = useMemo(() => {
    return borrows.filter((record) => {
      const displayedStatus = getDisplayedStatus(record);
      const matchesSearch =
        record.memberName.toLowerCase().includes(search.toLowerCase()) ||
        record.memberEmail.toLowerCase().includes(search.toLowerCase()) ||
        record.bookTitle.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || displayedStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [borrows, search, statusFilter]);

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
            <h1 className="text-4xl font-bold rainbow-text-slow">Manage Borrows</h1>
            <p className="text-muted-foreground mt-2">Oversee all borrow records and update statuses</p>
          </div>
          <Button variant="outline">Export Report</Button>
        </div>

        {/* Search & Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by member name, email or book title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Borrowed">Borrowed</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading records...</div>
            ) : filteredBorrows.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No records found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                            <p className="font-medium">
                              <User className="h-4 w-4 inline mr-1" />
                              {record.memberName}
                            </p>
                            <p className="text-sm text-muted-foreground">{record.memberEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          <BookOpen className="h-4 w-4 inline mr-1" />
                          {record.bookTitle}
                        </TableCell>
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
                            onValueChange={(v) => handleStatusChange(record.id, v)}
                          >
                            <SelectTrigger className="w-32">
                              {getStatusBadge(displayedStatus)}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Borrowed">Borrowed</SelectItem>
                              <SelectItem value="Returned">Returned</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {displayedStatus === "Returned" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleSoftDelete(record.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}