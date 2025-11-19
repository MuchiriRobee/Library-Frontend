// src/pages/admin/Dashboard.tsx
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, History, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const borrowTrendData = [
  { month: "Jan", borrowed: 145, returned: 120 },
  { month: "Feb", borrowed: 168, returned: 152 },
  { month: "Mar", borrowed: 182, returned: 160 },
  { month: "Apr", borrowed: 195, returned: 178 },
  { month: "May", borrowed: 210, returned: 195 },
  { month: "Jun", borrowed: 228, returned: 210 },
];

const pieData = [
  { name: "Borrowed", value: 68, color: "#6d76f5ff" },
  { name: "Returned", value: 195, color: "#34d399" },
  { name: "Overdue", value: 18, color: "#ef4444" },
];

const allBorrowRecords = [
  { id: 101, member: "Alex Johnson", book: "The Midnight Library", borrowed: "2025-03-10", due: "2025-03-24", status: "Borrowed" },
  { id: 102, member: "Sarah Chen", book: "Atomic Habits", borrowed: "2025-03-08", due: "2025-03-22", status: "Borrowed" },
  { id: 103, member: "James Torres", book: "Dune", borrowed: "2025-02-28", due: "2025-03-14", status: "Overdue" },
  { id: 104, member: "Emma Williams", book: "Project Hail Mary", borrowed: "2025-03-01", due: "2025-03-15", status: "Returned" },
  { id: 105, member: "Michael Brown", book: "Klara and the Sun", borrowed: "2025-02-20", due: "2025-03-06", status: "Returned" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: "Total Books", value: "1,842", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
    { title: "Currently Borrowed", value: "68", icon: History, color: "from-blue-500 to-cyan-500" },
    { title: "Returned This Month", value: "195", icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { title: "Overdue Books", value: "18", icon: AlertCircle, color: "from-red-500 to-rose-500" },
    { title: "Total Members", value: "5,284", icon: Users, color: "from-purple-500 to-pink-500" },
    { title: "Growth This Month", value: "+12%", icon: TrendingUp, color: "from-orange-500 to-red-500" },
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
            Welcome back, <span className="font-bold text-emerald-600">{user?.name}</span> • Managing the entire library
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
              <CardTitle className="text-2xl">Borrow & Return Trend (2025)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={borrowTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="borrowed" stroke="#eb5915ff" strokeWidth={3} dot={{ fill: "#10b981" }} />
                  <Line type="monotone" dataKey="returned" stroke="#34d399" strokeWidth={3} dot={{ fill: "#34d399" }} />
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

        {/* All Borrow Records Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recent Borrow Activity (All Members)</CardTitle>
          </CardHeader>
          <CardContent>
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
                {allBorrowRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.member}</TableCell>
                    <TableCell>{record.book}</TableCell>
                    <TableCell>{record.borrowed}</TableCell>
                    <TableCell>{record.due}</TableCell>
                    <TableCell>
                      {record.status === "Borrowed" && <Badge className="bg-blue-500">Borrowed</Badge>}
                      {record.status === "Returned" && <Badge className="bg-emerald-500">Returned</Badge>}
                      {record.status === "Overdue" && <Badge variant="destructive">Overdue</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}