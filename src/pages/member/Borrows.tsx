//import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import BookCover from "@/assets/images/book.jpeg";
import { useQuery } from "@tanstack/react-query";
//import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
//import { toast } from "sonner";
import { format } from "date-fns";

// Define proper type from backend response
interface BorrowRecord {
  id: number;
  book: string;
  author: string;
  borrowedDate: string; // YYYY-MM-DD
  dueDate: string;
  returnedDate: string | null;
  status: "Borrowed" | "Returned" | "Overdue";
}

const BOOK_COVER = BookCover;

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
  //const { user } = useAuth();
  //const queryClient = useQueryClient();

  const { data: borrows = [], isLoading } = useQuery<BorrowRecord[]>({
    queryKey: ["my-borrows"],
    queryFn: async () => {
      const res = await api.get("/borrow/my");
      return res.data.data.map((record: any) => ({
        id: record.borrow_id,
        book: record.book_title,
        author: record.book_author,
        borrowedDate: format(new Date(record.borrow_date), "yyyy-MM-dd"),
        dueDate: format(new Date(record.due_date), "yyyy-MM-dd"),
        returnedDate: record.return_date ? format(new Date(record.return_date), "yyyy-MM-dd") : null,
        status: record.status as "Borrowed" | "Returned" | "Overdue",
      }));
    },
  });



  const getDisplayedStatus = (borrow: BorrowRecord): "Borrowed" | "Returned" | "Overdue" => {
    if (borrow.status === "Returned") return "Returned";
    const due = new Date(borrow.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize
    return due < today ? "Overdue" : "Borrowed";
  };

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
              <History className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">Borrow History</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your borrowed books and due dates
          </p>
        </div>

        <Card className="overflow-hidden border-border shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
            <CardTitle className="text-2xl">Your Borrow Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading borrow history...</div>
            ) : borrows.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl text-muted-foreground">No borrow history yet</p>
                <Button asChild className="mt-6" size="lg">
                  <a href="/books">Browse Books Now</a>
                </Button>
              </div>
            ) : (
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
                  {borrows.map((borrow) => {
                    const displayedStatus = getDisplayedStatus(borrow);
                    return (
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
                          {getStatusBadge(displayedStatus)}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}