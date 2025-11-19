// src/data/mockBooks.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
  available: boolean;
  isbn: string;
  description: string;
}

export const mockBooks: Book[] = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", available: true, isbn: "978-0525559481", description: "A dazzling novel about all the choices that go into a life well lived.", cover: "midnight" },
  { id: 2, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", available: false, isbn: "978-0735211299", description: "Tiny changes, remarkable results.", cover: "atomic" },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", available: true, isbn: "978-0441013593", description: "A stunning blend of adventure and mysticism.", cover: "dune" },
  { id: 4, title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", available: true, isbn: "978-0593135204", description: "A lone astronaut must save the earth.", cover: "hailmary" },
  { id: 5, title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Fiction", available: true, isbn: "978-0593318171", description: "A thrilling feat of world-building.", cover: "klara" },
  { id: 6, title: "The Psychology of Money", author: "Morgan Housel", genre: "Finance", available: true, isbn: "978-0857197689", description: "Timeless lessons on wealth and happiness.", cover: "money" },
];