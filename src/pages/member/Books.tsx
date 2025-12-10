// src/pages/member/Books.tsx
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookCover from "@/assets/images/book.jpeg";
import api from "@/lib/api";

const BOOK_COVER=BookCover;

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, genresRes] = await Promise.all([
          api.get("/books"),
          api.get("/categories"),
        ]);

        setBooks(
          booksRes.data.data.map((b: any) => ({
            id: b.book_id,
            title: b.title,
            author: b.author,
            genre: b.genre || "Uncategorized",
            available: b.available_copies > 0,
          }))
        );

        setGenres(["all", ...genresRes.data.data.map((c: any) => c.name)]);
      } catch {
        toast.error("Failed to load books");
      }
    };
    fetchData();
  }, []);

  const handleBorrow = async (book: any) => {
    setIsBorrowing(true);
    try {
      await api.post("/borrow", { book_id: book.id });
      toast.success("Book borrowed successfully!");
      const res = await api.get("/books");
      setBooks(res.data.data.map((b: any) => ({
        id: b.book_id,
        title: b.title,
        author: b.author,
        genre: b.genre || "Uncategorized",
        available: b.available_copies > 0,
      })));
      setSelectedBook(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to borrow");
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBook || rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await api.post("/comments", {
        book_id: selectedBook.id,
        rating,
        comment: comment.trim() || null,
      });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setIsReviewOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === "all" || book.genre === genre;
      return matchesSearch && matchesGenre;
    });
  }, [books, search, genre]);

  return (
    <div className="p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">

        {/* Header & Search */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">Browse Books</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="mr-2 h-5 w-5" />
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g === "all" ? "All Genres" : g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {filteredBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group"
            >
              <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={BOOK_COVER}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {!book.available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-6 py-2">
                        Borrowed
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">by {book.author}</p>
                  <Badge variant="outline" className="mb-4 text-xs">{book.genre}</Badge>

                  <div className="flex gap-3 mt-auto">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedBook(book)}>
                      Details
                    </Button>
                    <Button
                      size="sm"
                      disabled={!book.available || isBorrowing}
                      onClick={() => handleBorrow(book)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isBorrowing ? "Borrowing..." : book.available ? "Borrow" : "Unavailable"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Simple & Spacious Details Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{selectedBook?.title}</DialogTitle>
            <DialogDescription className="text-xl mt-2">
              by {selectedBook?.author}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Genre</span>
              <Badge className="mt-2 text-base px-4 py-2">{selectedBook?.genre}</Badge>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">Availability</span>
              <p className="text-lg font-semibold mt-1">
                {selectedBook?.available ? "Available for borrowing" : "Currently borrowed"}
              </p>
            </div>
          </div>

          {/* Buttons at the bottom with good spacing */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              size="lg"
              className="flex-1 h-14 text-lg"
              disabled={!selectedBook?.available || isBorrowing}
              onClick={() => handleBorrow(selectedBook!)}
            >
              {isBorrowing
                ? "Borrowing..."
                : selectedBook?.available
                ? "Borrow This Book"
                : "Currently Unavailable"}
            </Button>

            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="flex-1 h-14 text-lg">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Write a Review
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Rate & Review</DialogTitle>
                  <DialogDescription className="text-lg">
                    {selectedBook?.title}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 py-6">
                  <div className="text-center">
                    <p className="font-medium mb-4">Select your rating</p>
                    <div className="flex justify-center gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-12 w-12 ${
                              star <= rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Your comment (optional)</p>
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setComment(e.target.value)
                      }
                      className="min-h-32"
                    />
                  </div>

                  <Button
                    className="w-full h-12 text-lg"
                    onClick={handleSubmitReview}
                    disabled={rating === 0}
                  >
                    Submit Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}