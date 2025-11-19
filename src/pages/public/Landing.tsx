// src/pages/public/Landing.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Sparkles, Clock, Star, ArrowRight, Mail, Phone, MapPin, Library } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const testimonials = [
    { name: "Sarah Chen", role: "Member since 2023", text: "The best library experience I've ever had. Beautiful space and incredible collection!", rating: 5 },
    { name: "Michael Torres", role: "Student", text: "Quiet, modern, and has every book I need for my studies. Love the online borrowing too!", rating: 5 },
    { name: "Emma Williams", role: "Teacher", text: "Perfect for both leisure reading and research. The staff are incredibly helpful.", rating: 5 },
];

export default function Landing() {
    return (
        <>
            {/* Floating Particles Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                {[...Array(8)].map((_, i) => (
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

                    </motion.div>
                ))}
            </div>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-black dark:to-emerald-950">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-8">
                                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-700 dark:text-emerald-300 font-large">Welcome to Your Modern Library</span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-bold mb-8 rainbow-text-slow">
                                Library Hub
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                                Discover a world of knowledge. Borrow books online or visit our beautiful space.
                                <br className="hidden md:block" />
                                Where stories come alive and learning never stops.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button asChild size="lg" className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl">
                                    <Link to="/login">
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg">
                                    <a href="#features">Explore Features</a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-20 px-6 bg-white/70 dark:bg-black/30 backdrop-blur">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4">Why Choose LibraryHub?</h2>
                            <p className="text-xl text-muted-foreground">Everything you need in one beautiful place</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                { icon: BookOpen, title: "30,000+ Books", desc: "Fiction, non-fiction, research papers, and rare collections" },
                                { icon: Users, title: "5,000+ Members", desc: "Join a thriving community of readers and learners" },
                                { icon: Clock, title: "24/7 Online Access", desc: "Browse, reserve, and manage your account anytime" },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="text-center"
                                >
                                    <div className="inline-flex p-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-3xl mb-6">
                                        <feature.icon className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground text-lg">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4">Loved by Our Members</h2>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <Card className="h-full hover:shadow-2xl transition-shadow duration-300">
                                        <CardContent className="pt-8">
                                            <div className="flex mb-4">
                                                {[...Array(t.rating)].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                                ))}
                                            </div>
                                            <p className="text-lg italic mb-6">"{t.text}"</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                                                    {t.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{t.name}</p>
                                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA + Footer */}
                <footer className="bg-gray-900 text-white py-16 px-6">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Library className="h-10 w-10 text-emerald-400" />
                                <h3 className="text-3xl font-bold">LibraryHub</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Your gateway to knowledge, imagination, and lifelong learning.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-6">Visit Us</h4>
                            <div className="space-y-4 text-gray-400">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5" />
                                    <span>123 Reading Street, Booktown, BC 12345</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5" />
                                    <span>
                                        <a
                                            href="tel:+254743371171"
                                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 font-medium underline-offset-4 hover:underline transition-all duration-200"
                                        >
                                            +254 743 371 171
                                        </a>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5" />
                                    <span><a href="library@gmail.com" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 font-medium underline-offset-4 hover:underline transition-all duration-200"
                                    >library@gmail.com</a></span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-right">
                            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                                <Link to="/login">
                                    Sign In / Register <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <p className="text-gray-500 mt-8 text-sm">
                                © 2025 LibraryHub. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}