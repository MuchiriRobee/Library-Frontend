// src/pages/admin/ManageBooks.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookCover from "@/assets/images/book.jpeg";


const BOOK_COVER = BookCover;

const bookSchema = z.object({
  title: z.string().min(2, "Title is required"),
  author: z.string().min(2, "Author is required"),
  genre: z.string().min(1, "Select a genre"),
  isbn: z.string().min(10, "Valid ISBN required"),
  description: z.string().min(10, "Description too short"),
});

type BookForm = z.infer<typeof bookSchema>;

const mockBooks = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", isbn: "978-0525559481", available: true },
  { id: 2, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", isbn: "978-0735211299", available: false },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", isbn: "978-0441013593", available: true },
  { id: 4, title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", isbn: "978-0593135204", available: true },
  { id: 5, title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Fiction", isbn: "978-0593318171", available: true },
];

export default function ManageBooks() {
  const [books, setBooks] = useState(mockBooks);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<typeof mockBooks[0] | null>(null);

  const form = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: editingBook || {
      title: "",
      author: "",
      genre: "",
      isbn: "",
      description: "",
    },
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                         book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === "all" || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const onSubmit = (data: BookForm) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === editingBook.id ? { ...b, ...data } : b));
      toast.success(`"${data.title}" updated successfully`);
    } else {
      const newBook = {
        id: Math.max(...books.map(b => b.id)) + 1,
        ...data,
        available: true,
      };
      setBooks(prev => [...prev, newBook]);
      toast.success(`"${data.title}" added to library`);
    }
    setIsAddOpen(false);
    setEditingBook(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    const book = books.find(b => b.id === id);
    setBooks(prev => prev.filter(b => b.id !== id));
    toast.success(`"${book?.title}" removed from library`);
  };

  const handleEdit = (book: typeof mockBooks[0]) => {
    setEditingBook(book);
    form.reset({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      description: "A captivating story about choices and alternate realities.",
    });
    setIsAddOpen(true);
  };

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold rainbow-text-slow">
              Manage Books
            </h1>
            <p className="text-muted-foreground mt-2">Add, edit, or remove books from the library collection</p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              setEditingBook(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-5 w-5" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingBook ? "Edit Book" : "Add New Book"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter book title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Author name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select genre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fiction">Fiction</SelectItem>
                              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                              <SelectItem value="Self-Help">Self-Help</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Romance">Romance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isbn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISBN</FormLabel>
                          <FormControl>
                            <Input placeholder="978-3-16-148410-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full min-h-32 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                            placeholder="Brief description of the book..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      {editingBook ? "Update Book" : "Add Book"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full md:w-48">
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
        </Card>

        {/* Books Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id} className="h-24">
                    <TableCell>
                      <img src={BOOK_COVER} alt={book.title} className="w-16 h-20 object-cover rounded shadow" />
                    </TableCell>
                    <TableCell className="font-semibold">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.genre}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                    <TableCell>
                      <Badge className={book.available ? "bg-emerald-500" : "bg-gray-500"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(book)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(book.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}