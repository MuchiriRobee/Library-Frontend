// src/pages/admin/Dashboard.tsx
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, History, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format, subMonths } from "date-fns";
//import { toast } from "sonner";

interface Book {
  book_id: number;
  title: string;
  author: string;
  stock_quantity: number;
  available_copies: number;
}

interface BorrowRecord {
  borrow_id: number;
  user_id: number;
  member_name: string;
  member_email: string;
  book_id: number;
  book_title: string;
  book_author: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "Borrowed" | "Returned" | "Overdue";
}

interface MonthlyStat {
  month: string;
  borrowed: number;
  returned: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch all books
  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const res = await api.get("/books");
      return res.data.data;
    },
  });

  // Fetch all borrow records
  const { data: allBorrows = [], isLoading: borrowsLoading } = useQuery<BorrowRecord[]>({
    queryKey: ["admin-all-borrows"],
    queryFn: async () => {
      const res = await api.get("/borrow");
      return res.data.data;
    },
  });

 // Fetch actual total number of members (users)
const { data: membersCount = 0, isError, error } = useQuery<number>({
  queryKey: ["total-members"],
  queryFn: async () => {
    const res = await api.get("/users/count");
    return res.data.count;
  },
});

// Add this for debugging
{isError && (
  <div className="text-red-500 text-sm">
    Failed to load member count: {(error as any)?.response?.data?.message || error?.message}
  </div>
)}

  // Compute real-time stats
  const totalBooks = books.length;
  const currentlyBorrowed = allBorrows.filter((b) => b.status === "Borrowed").length;
  const overdueCount = allBorrows.filter((b) => {
    if (b.status === "Returned") return false;
    return new Date(b.due_date) < new Date();
  }).length;

  const returnedThisMonth = allBorrows.filter((b) => {
    if (!b.return_date) return false;
    const returnDate = new Date(b.return_date);
    const now = new Date();
    return (
      returnDate.getMonth() === now.getMonth() &&
      returnDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Monthly borrow/return trend (last 6 months)
  const monthlyStats: MonthlyStat[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthKey = format(date, "MMM");

    const borrowedInMonth = allBorrows.filter((b) => {
      const d = new Date(b.borrow_date);
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    }).length;

    const returnedInMonth = allBorrows.filter((b) => {
      if (!b.return_date) return false;
      const d = new Date(b.return_date);
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    }).length;

    monthlyStats.push({
      month: monthKey,
      borrowed: borrowedInMonth,
      returned: returnedInMonth,
    });
  }

  // Pie chart data
  const pieData = [
    { name: "Borrowed", value: currentlyBorrowed, color: "#6d76f5ff" },
    { name: "Returned", value: returnedThisMonth, color: "#34d399" },
    { name: "Overdue", value: overdueCount, color: "#ef4444" },
  ];

  // Recent borrow records (latest 10)
  const recentBorrows = [...allBorrows]
    .sort((a, b) => new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime())
    .slice(0, 10);

  const stats = [
    { title: "Total Books", value: totalBooks.toLocaleString(), icon: BookOpen, color: "from-emerald-500 to-teal-500" },
    { title: "Currently Borrowed", value: currentlyBorrowed.toString(), icon: History, color: "from-blue-500 to-cyan-500" },
    { title: "Returned This Month", value: returnedThisMonth.toString(), icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { title: "Overdue Books", value: overdueCount.toString(), icon: AlertCircle, color: "from-red-500 to-rose-500" },
    { title: "Total Members", value: membersCount.toLocaleString(), icon: Users, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-3 rainbow-text-slow">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome back, <span className="font-bold text-emerald-600">{user?.username}</span> • Managing the entire library
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-2xl transition-all duration-300 border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                    <stat.icon className="h-7 w-7 text-foreground opacity-80" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Borrow & Return Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="borrowed"
                    stroke="#eb5915ff"
                    strokeWidth={3}
                    dot={{ fill: "#10b981" }}
                    name="Borrowed"
                  />
                  <Line
                    type="monotone"
                    dataKey="returned"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ fill: "#34d399" }}
                    name="Returned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Current Borrow Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                {pieData.map((item) => (
                  <div key={item.name}>
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Borrow Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recent Borrow Activity (All Members)</CardTitle>
          </CardHeader>
          <CardContent>
            {borrowsLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading borrow records...</div>
            ) : recentBorrows.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No borrow records yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBorrows.map((record) => {
                    const isOverdue = record.status !== "Returned" && new Date(record.due_date) < new Date();
                    const status = record.status === "Returned" ? "Returned" : isOverdue ? "Overdue" : "Borrowed";

                    return (
                      <TableRow key={record.borrow_id}>
                        <TableCell className="font-medium">{record.member_name}</TableCell>
                        <TableCell>{record.book_title}</TableCell>
                        <TableCell>{format(new Date(record.borrow_date), "yyyy-MM-dd")}</TableCell>
                        <TableCell>{format(new Date(record.due_date), "yyyy-MM-dd")}</TableCell>
                        <TableCell>
                          {status === "Borrowed" && <Badge className="bg-blue-500">Borrowed</Badge>}
                          {status === "Returned" && <Badge className="bg-emerald-500">Returned</Badge>}
                          {status === "Overdue" && <Badge variant="destructive">Overdue</Badge>}
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