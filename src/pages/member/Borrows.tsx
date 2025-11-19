// src/pages/member/Borrows.tsx
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import BookCover from "@/assets/images/book.jpeg";

const BOOK_COVER = BookCover;

// Mock borrow history for the logged-in user
const mockBorrows = [
  {
    id: 1,
    book: "The Midnight Library",
    author: "Matt Haig",
    borrowedDate: "2025-03-10",
    dueDate: "2025-03-24",
    returnedDate: null,
    status: "Borrowed" as const,
  },
  {
    id: 2,
    book: "Atomic Habits",
    author: "James Clear",
    borrowedDate: "2025-02-28",
    dueDate: "2025-03-14",
    returnedDate: "2025-03-12",
    status: "Returned" as const,
  },
  {
    id: 3,
    book: "Dune",
    author: "Frank Herbert",
    borrowedDate: "2025-03-01",
    dueDate: "2025-03-15",
    returnedDate: null,
    status: "Overdue" as const,
  },
  {
    id: 4,
    book: "Project Hail Mary",
    author: "Andy Weir",
    borrowedDate: "2025-02-15",
    dueDate: "2025-03-01",
    returnedDate: "2025-02-28",
    status: "Returned" as const,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Borrowed":
      return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" /> Borrowed</Badge>;
    case "Returned":
      return <Badge className="bg-emerald-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> Returned</Badge>;
    case "Overdue":
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Borrows() {
  const { user } = useAuth();

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <History className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold rainbow-text-slow">
                My Borrow History
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Track all books you've borrowed
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Currently Borrowed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Returned on Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">2</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">1</div>
            </CardContent>
          </Card>
        </div>

        {/* Borrow History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Borrow Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Cover</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBorrows.map((borrow) => (
                  <TableRow key={borrow.id} className="h-20">
                    <TableCell>
                      <img
                        src={BOOK_COVER}
                        alt={borrow.book}
                        className="w-16 h-20 object-cover rounded-md shadow-md"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-lg">
                      {borrow.book}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {borrow.author}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {borrow.borrowedDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {borrow.dueDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(borrow.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {mockBorrows.length === 0 && (
          <div className="text-center py-20">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">No borrow history yet</p>
            <Button className="mt-6" size="lg">
              Browse Books Now
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}