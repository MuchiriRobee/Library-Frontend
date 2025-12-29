import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Library, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";


interface Book {
  book_id: number;
  title: string;
  author: string;
  stock_quantity: number;
}

interface Comment {
  comment_id: number;
  user_id: number;
  user_name: string;
  book_id: number;
  book_title: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch real books
  const {
    data: books = [],
    isLoading: booksLoading,
    error: booksError,
  } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await api.get("/books");
      return res.data.data;
    },
  });

  // Fetch real comments
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery<Comment[]>({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await api.get("/comments");
      return res.data.data;
    },
  });

  // Show toast on error
  if (booksError) toast.error("Failed to load books");
  if (commentsError) toast.error("Failed to load reviews");

  // Calculate real stats
  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.stock_quantity > 0).length;

  // Format real comments (latest 4)
  const latestReviews = comments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
    .map((c) => ({
      id: c.comment_id,
      user: c.user_name,
      avatar: c.user_name[0] || "U",
      book: c.book_title,
      rating: c.rating,
      comment: c.comment || "No comment",
      date: new Date(c.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

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
            Welcome back, {user?.username || "Member"}!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            You are logged in as{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {user?.role || "Guest"}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              {
                title: "Total Books",
                value: booksLoading ? "Loading..." : totalBooks.toString(),
                icon: Library,
                color: "from-emerald-500 to-teal-500",
              },
              {
                title: "Available Now",
                value: booksLoading ? "Loading..." : availableBooks.toString(),
                icon: BookOpen,
                color: "from-green-500 to-emerald-500",
              },
            ].map((stat, i) => (
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

          {commentsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading reviews...</div>
          ) : latestReviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No reviews yet</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {latestReviews.map((review, i) => (
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
          )}
        </div>

        <div className="text-center py-8">
<p className="text-lg text-muted-foreground">
  <Link
    to="/books"
    className="text-primary font-semibold underline underline-offset-4 hover:scale-105 inline-block transition-transform hover:text-emerald-600 dark">
    Explore the library — your next favorite book is waiting
  </Link>
</p>
        </div>
      </motion.div>
    </div>
  );
}