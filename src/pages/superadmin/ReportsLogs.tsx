// src/pages/superadmin/ReportsLogs.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, FileText, Activity, Users, BookOpen, AlertCircle, Shield, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

const activityLogs = [
  { id: 1, user: "Sarah Admin", email: "admin@library.com", action: "Added book", target: "The Psychology of Money", timestamp: new Date("2025-11-18T14:32:00"), role: "Admin" },
  { id: 2, user: "Alex Johnson", email: "member@library.com", action: "Borrowed book", target: "Atomic Habits", timestamp: new Date("2025-11-18T12:15:00"), role: "Member" },
  { id: 3, user: "David Super", email: "super@library.com", action: "Changed role", target: "Michael Brown → Admin", timestamp: new Date("2025-11-17T19:45:00"), role: "SuperAdmin" },
  { id: 4, user: "Emma Wilson", email: "emma@example.com", action: "Returned book", target: "Project Hail Mary", timestamp: new Date("2025-11-17T10:20:00"), role: "Member" },
  { id: 5, user: "Sarah Admin", email: "admin@library.com", action: "Marked overdue", target: "Dune", timestamp: new Date("2025-11-16T08:10:00"), role: "Admin" },
];

const trendData = [
  { month: "Jul", borrows: 820, returns: 780, newMembers: 142 },
  { month: "Aug", borrows: 890, returns: 850, newMembers: 168 },
  { month: "Sep", borrows: 950, returns: 910, newMembers: 195 },
  { month: "Oct", borrows: 1020, returns: 980, newMembers: 220 },
  { month: "Nov", borrows: 1080, returns: 1045, newMembers: 248 },
];

export default function ReportsLogs() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFillColor(30, 41, 59);
      pdf.rect(0, 0, pdfWidth, 40, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text("LibraryHub System Report", 20, 25);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${format(new Date(), "PPP 'at' p")}`, 20, 35);

      pdf.addImage(imgData, "PNG", 10, 50, imgWidth, imgHeight);

      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, pdfHeight - 30, pdfWidth, 30, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("© 2025 LibraryHub • SuperAdmin Report • Confidential", 10, pdfHeight - 15);

      pdf.save(`LibraryHub_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
      toast.success("Report generated successfully!", { description: "PDF saved to your device" });
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SuperAdmin": return <Crown className="h-4 w-4" />;
      case "Admin": return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-pink-950/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold mb-3 bowrain-text">
              Reports & Activity Logs
            </h1>
            <p className="text-xl text-muted-foreground">Complete system audit • Exportable reports</p>
          </div>
          <Button
            size="lg"
            onClick={generatePDF}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Export PDF Report
              </>
            )}
          </Button>
        </div>

        {/* Exportable Report Section */}
        <div ref={reportRef} className="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-border">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Members", value: "5,284", icon: Users, color: "from-purple-500 to-pink-500" },
              { label: "Books in Library", value: "1,842", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
              { label: "Active Borrows", value: "68", icon: Activity, color: "from-blue-500 to-cyan-500" },
              { label: "Overdue Today", value: "18", icon: AlertCircle, color: "from-red-500 to-rose-500" },
            ].map((stat, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl overview-text">
                Borrow & Growth Trends (Last 5 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px" }} />
                  <Line type="monotone" dataKey="borrows" stroke="#8b5cf6" strokeWidth={4} name="Borrows" />
                  <Line type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={4} name="Returns" />
                  <Line type="monotone" dataKey="newMembers" stroke="#f59e0b" strokeWidth={4} name="New Members" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Log Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <FileText className="h-7 w-7" />
                Full Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id} className="h-20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className={`${
                                log.role === "SuperAdmin" ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" :
                                log.role === "Admin" ? "bg-gradient-to-br from-orange-500 to-red-500 text-white" :
                                "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                              }`}>
                                {log.user.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{log.user}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {getRoleIcon(log.role)} {log.role}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.role === "SuperAdmin" ? "default" : "secondary"}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                          {log.target}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(log.timestamp, "MMM dd, yyyy 'at' h:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}