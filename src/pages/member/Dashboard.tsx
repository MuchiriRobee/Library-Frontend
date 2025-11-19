// src/pages/member/Dashboard.tsx
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Library, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const mockReviews = [
  {
    id: 1,
    user: "Emma Wilson",
    avatar: "EW",
    book: "The Midnight Library",
    rating: 5,
    comment: "A life-changing read. Made me rethink every choice I've ever made. Beautifully written!",
    date: "2 hours ago",
  },
  {
    id: 2,
    user: "James Chen",
    avatar: "JC",
    book: "Atomic Habits",
    rating: 4,
    comment: "Practical and actionable. Already implementing the 1% better rule. Highly recommend!",
    date: "5 hours ago",
  },
  {
    id: 3,
    user: "Sofia Martinez",
    avatar: "SM",
    book: "Project Hail Mary",
    rating: 5,
    comment: "Andy Weir does it again! Funny, smart, and emotionally powerful. Couldn't put it down.",
    date: "1 day ago",
  },
  {
    id: 4,
    user: "Liam Brown",
    avatar: "LB",
    book: "Dune",
    rating: 5,
    comment: "Timeless masterpiece. The world-building is unmatched. Essential sci-fi.",
    date: "3 days ago",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { title: "Total Books", value: "1,842", icon: Library, color: "from-emerald-500 to-teal-500" },
    { title: "Available Now", value: "1,529", icon: BookOpen, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Welcome + Stats */}
        <div>
          <h1 className="text-4xl font-bold mb-3 overview-text">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            You are logged in as{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {user?.role}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                      <stat.icon className="h-6 w-6 text-foreground opacity-80" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Latest Reviews Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-8 w-8 text-emerald-600" />
            <h2 className="text-2xl font-bold">Latest Member Reviews</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mockReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                            {review.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.user}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                      "{review.book}"
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            Explore the library — your next favorite book is waiting
          </p>
        </div>
      </motion.div>
    </div>
  );
}