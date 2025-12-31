import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Sparkles, Clock, Star, ArrowRight, Mail, Phone, MapPin, Library, Globe, Book, Coffee, Headphones, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

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

// Properly typed variants for smooth, type-safe animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      staggerChildren: 0.3,
      ease: "easeOut",
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const slideVariants: Variants = {
  enter: { opacity: 0, scale: 1.05 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Carousel slides with different images and text
const slides = [
  {
    image: "/images/library1.webp",
    placeholder: "/images/library1-low.webp", // tiny blurred version
    title: "Welcome to Maktaba Hub",
    description: "Your gateway to knowledge, imagination, and community.",
  },
  {
    image: "/images/library2.webp",
    title: "Modern Reading Spaces",
    description: "Relax in beautifully designed areas filled with natural light.",
  },
  {
    image: "/images/library3.webp",
    title: "Digital Library Access",
    description: "Borrow e-books and audiobooks anytime, anywhere.",
  },
  {
    image: "/images/library4.webp",
    title: "Community Events",
    description: "Join book clubs, workshops, and author talks.",
  },
  {
    image: "/images/library5.webp",
    title: "Children's Corner",
    description: "Inspiring young minds with interactive learning zones.",
  },
  {
    image: "/images/library6.webp",
    title: "Research & Study Rooms",
    description: "Quiet spaces equipped for focused learning and research.",
  },
  {
    image: "/images/library7.webp",
    title: "Cozy Cafe Corner",
    description: "Enjoy coffee and light bites while reading.",
  },
  {
    image: "/images/library8.webp",
    title: "Sustainable & Green Design",
    description: "Eco-friendly spaces built for the future.",
  },
];

export default function Landing() {

  // Fetch latest comments for testimonials
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery<Comment[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await api.get("/comments");
      return res.data.data;
    },
  });

  if (commentsError) toast.error("Failed to load testimonials");

  // Format latest 3 comments with book title
  const testimonials = comments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)
    .map((c) => ({
      name: c.user_name,
      book: c.book_title,
      text: c.comment || "Loved this book!",
      rating: c.rating,
    }));

  // Refs for scroll animations
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
  // Preload all carousel images
  slides.forEach((slide) => {
    const img = new Image();
    img.src = slide.image;
  });
}, []); // Run once on mount

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Particles Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5 select-none"
            initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
            animate={{ y: "-100vh" }}
            transition={{
              duration: 25 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          >
            📖
          </motion.div>
        ))}
      </div>

      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-indigo-100 dark:from-emerald-950 dark:via-teal-950 dark:to-indigo-950">
        {/* Hero Section with Interactive Carousel */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          {/* Carousel Backgrounds */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `                
                url(${slides[currentSlide].image})
              ` }}
            />
          </AnimatePresence>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={childVariants}>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
                  <Sparkles className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Discover Endless Stories</span>
                </div>
              </motion.div>

              <motion.h1
                key={currentSlide + "-title"} // Re-animate on slide change
                variants={childVariants}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-bold rainbow-text-slow mb-8 tracking-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.p
                key={currentSlide + "-desc"}
                variants={childVariants}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-3xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                variants={childVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-white text-emerald-600 hover:bg-white/90">
                  <Link to="/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-10 h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-16" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* About the Library Section */}
        <section
          ref={aboutRef}
          className="py-32 px-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                variants={childVariants}
                className="text-5xl font-bold text-center mb-16 rainbow-text-slow"
              >
                About Maktaba Hub
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div variants={childVariants}>
                  <img
                    src="/images/library-interior.jpg"
                    alt="Library Interior"
                    className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                  />
                </motion.div>

                <motion.div variants={childVariants} className="space-y-6">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Maktaba Hub is more than just a place for books, it's a vibrant community center dedicated to fostering lifelong learning and creativity.
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Founded in 2025, we blend traditional library services with modern technology, offering digital borrowing, interactive workshops, and cozy reading spaces.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-lg">
                      <Book className="h-6 w-6 text-emerald-600" />
                      Over 1,000 physical and digital titles
                    </li>
                    <li className="flex items-center gap-3 text-lg">
                      <Users className="h-6 w-6 text-emerald-600" />
                      Community events and book clubs
                    </li>
                    <li className="flex items-center gap-3 text-lg">
                      <Globe className="h-6 w-6 text-emerald-600" />
                      Global access to resources
                    </li>
                  </ul>
                  <Button asChild className="mt-6">
                    <Link to="/about">About Us</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

{/* Expanded Features Section */}
        <section
          ref={featuresRef}
          className="py-32 px-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                variants={childVariants}
                className="text-5xl font-bold text-center mb-20 rainbow-text-slow"
              >
                Discover Our Features
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={childVariants}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Vast Collection</h3>
                      <p className="text-muted-foreground mb-6">
                        Explore thousands of books across genres, from classics to modern bestsellers.
                      </p>
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Digital e-books</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Audiobooks</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Rare collections</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={childVariants}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Community Hub</h3>
                      <p className="text-muted-foreground mb-6">
                        Join events, workshops, and discussions with fellow book lovers.
                      </p>
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book clubs</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Author meetups</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Writing workshops</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={childVariants}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Clock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">24/7 Access</h3>
                      <p className="text-muted-foreground mb-6">
                        Borrow anytime with our digital library and extended hours.
                      </p>
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Online borrowing</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Mobile app</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Virtual tours</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={childVariants}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Coffee className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Cozy Spaces</h3>
                      <p className="text-muted-foreground mb-6">
                        Relax in our modern reading areas and cafes.
                      </p>
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Quiet zones</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Group study rooms</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Cafe integration</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={childVariants}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Headphones className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Multimedia Resources</h3>
                      <p className="text-muted-foreground mb-6">
                        Beyond books: audiobooks, videos, and more.
                      </p>
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Podcasts</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> E-learning courses</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Virtual reality experiences</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={childVariants}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Search className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Smart Search</h3>
                      <p className="text-muted-foreground mb-6">
                        Find exactly what you need with AI-powered recommendations.
                      </p>
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Personalized suggestions</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Advanced filters</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Voice search</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

{/* Testimonials Section */}
        <section
          ref={testimonialsRef}
          className="py-32 px-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                variants={childVariants}
                className="text-5xl font-bold text-center mb-20 rainbow-text-slow"
              >
                What Our Readers Say
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-8">
                {commentsLoading ? (
                  <p className="col-span-3 text-center text-muted-foreground">Loading testimonials...</p>
                ) : (
                  testimonials.map((t, i) => (
                    <motion.div
                      key={i}
                      variants={childVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                          {/* Rating Stars */}
                          <div className="flex mb-4">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-5 w-5 ${
                                  idx < t.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-lg italic mb-6 leading-relaxed">"{t.text}"</p>

                          {/* User Info + Book Title */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                              {t.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-semibold text-lg">{t.name}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>

{/* CTA + Footer */}
        <footer
          ref={ctaRef}
          className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white py-16 px-6"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12"
          >
            <motion.div variants={childVariants}>
              <div className="flex items-center gap-3 mb-6">
                <Library className="h-10 w-10 text-white" />
                <h3 className="text-3xl font-bold">Maktaba Hub</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your gateway to knowledge, imagination, and lifelong learning.
              </p>
            </motion.div>

            <motion.div variants={childVariants}>
              <h4 className="text-xl font-semibold mb-6">Visit Us</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>2341 Kimathi, Nyeri, Kenya</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>
                    <a
                      href="tel:+254743371171"
                      className="text-white hover:text-emerald-200 font-medium underline-offset-4 hover:underline transition-all duration-200"
                    >
                      +254 743 371 171
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>
                    <a 
                      href="mailto:library@gmail.com" 
                      className="text-white hover:text-emerald-200 font-medium underline-offset-4 hover:underline transition-all duration-200"
                    >
                      maktaba@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={childVariants} className="text-center md:text-right">
              <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-gray-100">
                <Link to="/login">
                  Sign In / Register <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-gray-500 mt-8 text-sm">
                © 2025 Maktaba Hub. All rights reserved.
              </p>
            </motion.div>
          </motion.div>
        </footer>
      </div>
    </>
  );
}