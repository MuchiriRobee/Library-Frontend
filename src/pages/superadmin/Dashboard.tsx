// src/pages/superadmin/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Library, History, AlertCircle, TrendingUp, Activity, Award } from "lucide-react";
import { motion } from "framer-motion";

const monthlyData = [
  { month: "Jan", members: 4120, books: 1680, borrowed: 892, returned: 845 },
  { month: "Feb", members: 4250, books: 1720, borrowed: 910, returned: 880 },
  { month: "Mar", members: 4380, books: 1750, borrowed: 945, returned: 910 },
  { month: "Apr", members: 4510, books: 1790, borrowed: 980, returned: 955 },
  { month: "May", members: 4680, books: 1820, borrowed: 1020, returned: 990 },
  { month: "Jun", members: 4840, books: 1842, borrowed: 1080, returned: 1045 },
];

const pieData = [
  { name: "Borrowed", value: 68, color: "#0ea5e9" },
  { name: "Returned", value: 195, color: "#10b981" },
  { name: "Overdue", value: 18, color: "#ef4444" },
];

const recentActivity = [
  { id: 1, user: "Sarah Admin", action: "Added new book", target: "Project Hail Mary", time: "2 hours ago" },
  { id: 2, user: "Alex Johnson", action: "Borrowed", target: "Atomic Habits", time: "4 hours ago" },
  { id: 3, user: "Sarah Admin", action: "Marked as Returned", target: "Dune", time: "6 hours ago" },
];

const topBorrowers = [
  { name: "Emma Wilson", borrows: 28, avatar: "EW" },
  { name: "Michael Brown", borrows: 22, avatar: "MB" },
  { name: "James Chen", borrows: 19, avatar: "JC" },
];

const popularBooks = [
  { title: "The Midnight Library", borrows: 42 },
  { title: "Atomic Habits", borrows: 38 },
  { title: "Project Hail Mary", borrows: 35 },
];

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-emerald-50 dark:from-gray-950 dark:via-purple-950/50 dark:to-emerald-950/50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bowrain-text">
            SuperAdmin Portal
          </h1>
          <p className="text-2xl text-muted-foreground font-light">
            Full system oversight • Real-time analytics • Complete control
          </p>
        </div>

        {/* Stats Grid – 8 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {[
            { title: "Total Members", value: "5,284", icon: Users, gradient: "from-purple-500 to-pink-500" },
            { title: "Total Books", value: "1,842", icon: Library, gradient: "from-emerald-500 to-teal-500" },
            { title: "Active Borrows", value: "68", icon: History, gradient: "from-blue-500 to-cyan-500" },
            { title: "Overdue", value: "18", icon: AlertCircle, gradient: "from-red-500 to-rose-500" },
            { title: "Returned Today", value: "24", icon: Activity, gradient: "from-green-500 to-emerald-500" },
            { title: "Growth Rate", value: "+12.4%", icon: TrendingUp, gradient: "from-orange-500 to-red-500" },
            { title: "Top Book", value: "42 borrows", icon: Award, gradient: "from-yellow-500 to-amber-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-1xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl overview-text">
                2025 Growth Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={650}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "none" }} />
                  <Legend />
                  <Line type="monotone" dataKey="members" stroke="#e07715ff" strokeWidth={4} dot={{ fill: "#8b5cf6" }} />
                  <Line type="monotone" dataKey="books" stroke="#10b981" strokeWidth={4} dot={{ fill: "#10b981" }} />
                  <Line type="monotone" dataKey="borrowed" stroke="#0ea5e9" strokeWidth={4} dot={{ fill: "#0ea5e9" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Donut Pie + Summary */}
          <div className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl piechart-text">
                  Current Borrow Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {pieData.map((item) => (
                    <div key={item.name} className="text-center">
                      <div className="text-3xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{act.user.split(" ")[0][0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{act.user}</p>
                      <p className="text-sm text-muted-foreground">
                        {act.action} <span className="font-semibold text-emerald-600">"{act.target}"</span>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{act.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row: Top Borrowers + Popular Books */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Borrowers This Month</CardTitle>
            </CardHeader>
            <CardContent>
              {topBorrowers.map((person, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {person.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{person.name}</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {person.borrows} borrows
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Popular Books</CardTitle>
            </CardHeader>
            <CardContent>
              {popularBooks.map((book, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                  <p className="font-medium">{book.title}</p>
                  <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                    {book.borrows} times
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}