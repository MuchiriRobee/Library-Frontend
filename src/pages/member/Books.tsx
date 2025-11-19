// src/pages/member/Books.tsx
import { useState, useMemo } from "react";
import { mockBooks } from "@/data/mockBooks";
import type {Book} from "@/data/mockBooks"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookCover from "@/assets/images/book.jpeg";

// Beautiful book cover (same for all – replace with your own later)
const BOOK_COVER =BookCover;

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    return mockBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                          book.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === "all" || book.genre === genre;
      return matchesSearch && matchesGenre;
    });
  }, [search, genre]);

  const handleBorrow = (book: Book) => {
    if (!book.available) {
      toast.error("This book is currently borrowed");
      return;
    }
    toast.success(`"${book.title}" has been reserved for you!`, {
      description: "Check your borrow history",
    });
  };

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 overview-text">
            Browse Books
          </h1>
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
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                <SelectItem value="Self-Help">Self-Help</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
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
                {/* Book Cover */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
                  <img
                    src={BOOK_COVER}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {!book.available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-6 py-2">
                        Borrowed
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-1">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    by {book.author}
                  </p>

                  {/* Genre Badge */}
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {book.genre}
                    </Badge>
                  </div>

                  {/* Action Buttons – now perfectly spaced */}
                  <div className="flex gap-3 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedBook(book)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      disabled={!book.available}
                      onClick={() => handleBorrow(book)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {book.available ? "Borrow" : "Unavailable"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Book Detail Modal */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left: Image */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
              <img
                src={BOOK_COVER}
                alt={selectedBook?.title}
                className="w-full h-full object-cover"
              />
              {!selectedBook?.available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="destructive" className="text-2xl px-8 py-4">
                    Currently Borrowed
                  </Badge>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="p-8 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  {selectedBook?.title}
                </DialogTitle>
                <p className="text-xl text-muted-foreground">
                  by {selectedBook?.author}
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Genre</p>
                  <Badge className="mt-1">{selectedBook?.genre}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-mono text-lg">{selectedBook?.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-2 leading-relaxed text-foreground">
                    {selectedBook?.description}
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-lg h-14"
                disabled={!selectedBook?.available}
                onClick={() => {
                  handleBorrow(selectedBook!);
                  setSelectedBook(null);
                }}
              >
                {selectedBook?.available ? "Borrow This Book" : "Currently Unavailable"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}