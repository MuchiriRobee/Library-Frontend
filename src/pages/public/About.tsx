import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Star,
  ArrowRight,
  ArrowLeft,
  Mail,
  Globe,
  MessageSquare,
  Book,
  BookCheck,
  Archive,
  Clock,
  Coffee,
  Headphones,
  Search,
  Library,
  MapPin, 
  Phone,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";


// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, staggerChildren: 0.3, ease: "easeOut" },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const hoverVariants: Variants = { hover: { scale: 1.05, transition: { duration: 0.3 } } };
const tapVariants: Variants = { tap: { scale: 0.95, transition: { duration: 0.2 } } };
const flipVariants: Variants = { front: { rotateY: 0 }, back: { rotateY: 180 } };

// Placeholder data
const missionVision = {
  mission: "To provide equitable access to information, foster lifelong learning, and serve as a hub for community engagement and cultural preservation.",
  vision: "To be a leading innovative library that inspires curiosity, supports education, and connects people through knowledge and technology.",
};

const historyMilestones = [
  { year: 2025, title: "Founded", description: "Maktaba Hub was established as a modern library management system to revolutionize access to knowledge." },
  { year: 2026, title: "Digital Expansion", description: "Launched our comprehensive digital catalogue with e-books and audiobooks." },
  { year: 2027, title: "Community Programs", description: "Introduced book clubs, workshops, and author events to build community." },
  { year: 2028, title: "Sustainable Renovation", description: "Upgraded facilities with eco-friendly designs and modern reading spaces." },
];

const staff = [
  { name: "Dr. Elena Rodriguez", role: "Head Librarian", bio: "With over 20 years in library sciences, Elena leads our team in curating exceptional collections.", photo: "/images/staff1.jpg", linkedin: "#", twitter: "#", email: "elena@maktaba.com" },
  { name: "Marcus Chen", role: "Digital Resources Manager", bio: "Expert in digital archiving, Marcus ensures seamless access to our online resources.", photo: "/images/staff2.jpg", linkedin: "#", twitter: "#", email: "marcus@maktaba.com" },
  { name: "Sarah Patel", role: "Community Outreach Coordinator", bio: "Sarah organizes events and programs to connect our library with the community.", photo: "/images/staff3.jpg", linkedin: "#", twitter: "#", email: "sarah@maktaba.com" },
  { name: "James Wilkins", role: "Research Specialist", bio: "James assists patrons with in-depth research and academic resources.", photo: "/images/staff4.jpg", linkedin: "#", twitter: "#", email: "james@maktaba.com" },
];

const catalogueHighlights = [
  { icon: Book, title: "Books", description: "Extensive collection of fiction, non-fiction, and reference materials." },
  { icon: BookOpen, title: "Journals", description: "Academic and professional journals across various disciplines." },
  { icon: Globe, title: "Digital Resources", description: "E-books, audiobooks, and online databases." },
  { icon: Archive, title: "Archives", description: "Historical documents and special collections." },
];

const services = [
  { icon: BookCheck, title: "Borrowing", description: "Easy checkout system for physical and digital items." },
  { icon: Search, title: "Research Assistance", description: "Expert help for your research needs." },
  { icon: Headphones, title: "Digital Access", description: "24/7 access to online resources." },
  { icon: Coffee, title: "Reading Rooms", description: "Comfortable spaces for study and relaxation." },
];

const openingHours = [
  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
  { day: "Saturday", time: "10:00 AM - 6:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const rules = [
  { title: "Borrowing Policy", content: "Members may borrow up to 5 items for 2 weeks. Late fees apply." },
  { title: "Quiet Zones", content: "Please maintain silence in designated quiet areas." },
  { title: "Food and Drink", content: "No food allowed; covered drinks permitted in cafe areas only." },
  { title: "Digital Use", content: "Respect copyright laws when using digital resources." },
  { title: "Membership", content: "Free for residents; ID required for registration." },
];

const galleryItems = [
  { image: "/images/gallery1.webp", description: "Our grand reading hall with natural lighting." },
  { image: "/images/gallery2.webp", description: "Children's interactive learning corner." },
  { image: "/images/gallery3.webp", description: "Modern digital access stations." },
];

const faqs = [
  { question: "How do I get a library card?", answer: "Visit our front desk with a valid ID and proof of address." },
  { question: "Can I renew books online?", answer: "Yes, through your account on our website." },
  { question: "Are there computers available?", answer: "We have public computers; reservations recommended." },
  { question: "Do you offer interlibrary loans?", answer: "Yes, for items not in our collection." },
];

export default function About() {
  const refs = {
    hero: useRef(null),
    mission: useRef(null),
    history: useRef(null),
    staff: useRef(null),
    catalogue: useRef(null),
    rules: useRef(null),
    gallery: useRef(null),
    ask: useRef(null),
    ctaRef: useRef(null),
  };

  const inViews = {
    hero: useInView(refs.hero, { once: true, margin: "-100px" }),
    mission: useInView(refs.mission, { once: true, margin: "-100px" }),
    history: useInView(refs.history, { once: true, margin: "-100px" }),
    staff: useInView(refs.staff, { once: true, margin: "-100px" }),
    catalogue: useInView(refs.catalogue, { once: true, margin: "-100px" }),
    rules: useInView(refs.rules, { once: true, margin: "-100px" }),
    gallery: useInView(refs.gallery, { once: true, margin: "-100px" }),
    ask: useInView(refs.ask, { once: true, margin: "-100px" }),
    ctaRef: useInView(refs.ctaRef, { once: true, margin: "-100px" }),
  };

  const [flipped, setFlipped] = useState([false, false, false]);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const toggleFlip = (index: number) => {
    setFlipped(prev => prev.map((f, i) => (i === index ? !f : f)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-indigo-100 dark:from-emerald-950 dark:via-teal-950 dark:to-indigo-950">
      {/* Floating Book Particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5 select-none"
            initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
            animate={{ y: "-100vh" }}
            transition={{ duration: 25 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
          >
            📖
          </motion.div>
        ))}
      </div>

      {/* Hero Introduction */}
      <section ref={refs.hero} className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.hero ? "visible" : "hidden"}>
            <motion.h1 variants={childVariants} className="text-4xl sm:text-6xl md:text-8xl font-bold rainbow-text-slow mb-8 tracking-tight">
              About Our Library
            </motion.h1>
            <motion.p variants={childVariants} className="text-lg sm:text-xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              A sanctuary of knowledge, fostering community connections and lifelong learning through accessible resources.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={refs.mission} className="py-16 sm:py-32 px-4 sm:px-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.mission ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-12 sm:mb-16 rainbow-text-slow">
              Mission & Vision
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[
                { icon: BookOpen, title: "Our Mission", text: missionVision.mission },
                { icon: Star, title: "Our Vision", text: missionVision.vision },
              ].map((item, i) => (
                <motion.div key={i} variants={childVariants} whileHover="hover" >
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <item.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-muted-foreground text-base sm:text-lg">{item.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Library History */}
      <section ref={refs.history} className="py-16 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.history ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-16 sm:mb-20 rainbow-text-slow">
              Our History
            </motion.h2>
            <div className="space-y-8 sm:space-y-12">
              {historyMilestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  variants={childVariants}
                  whileHover="hover"
                  
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{milestone.title}</h3>
                  </div>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Administration & Staff */}
      <section ref={refs.staff} className="py-16 sm:py-32 px-4 sm:px-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.staff ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-16 sm:mb-20 rainbow-text-slow">
              Our Team
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {staff.map((member, i) => (
                <motion.div
                  key={i}
                  variants={childVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <img src={member.photo} alt={member.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover shadow-md" />
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{member.name}</h3>
                      <p className="text-muted-foreground mb-4 text-sm sm:text-base">{member.role}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{member.bio}</p>
                      <div className="flex justify-center gap-3 sm:gap-4">
                        <motion.a href={member.linkedin} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-emerald-600 hover:text-emerald-800">
                          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.a>
                        <motion.a href={member.twitter} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-emerald-600 hover:text-emerald-800">
                          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.a>
                        <motion.a href={`mailto:${member.email}`} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-emerald-600 hover:text-emerald-800">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catalogue & Services */}
      <section ref={refs.catalogue} className="py-16 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.catalogue ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-16 sm:mb-20 rainbow-text-slow">
              Catalogue & Services
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Our Catalogue</h3>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {catalogueHighlights.map((item, i) => (
                    <motion.div key={i} variants={childVariants} whileHover="hover" >
                      <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base sm:text-lg">{item.title}</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Our Services</h3>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  {services.map((service, i) => (
                    <motion.div key={i} variants={childVariants} whileHover="hover" >
                      <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base sm:text-lg">{service.title}</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">{service.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" /> Opening Hours
                    </h4>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {openingHours.map((hour, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{hour.day}</span>
                          <span className="font-medium">{hour.time}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rules & Regulations */}
      <section ref={refs.rules} className="py-16 sm:py-32 px-4 sm:px-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.rules ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-16 sm:mb-20 rainbow-text-slow">
              Rules & Regulations
            </motion.h2>
            <Accordion type="single" collapsible className="w-full">
              {rules.map((rule, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <AccordionItem value={`item-${i}`}>
                    <AccordionTrigger className="text-base sm:text-lg font-semibold hover:no-underline">
                      {rule.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                      {rule.content}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Library Gallery */}
      <section ref={refs.gallery} className="py-16 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.gallery ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-16 sm:mb-20 rainbow-text-slow">
              Gallery
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={childVariants}
                  className="perspective-1000"
                  onHoverStart={() => toggleFlip(i)}
                  onHoverEnd={() => toggleFlip(i)}
                  whileTap="tap"                  
                >
                  <motion.div
                    className="relative w-full h-48 sm:h-64 preserve-3d"
                    animate={flipped[i] ? "back" : "front"}
                    variants={flipVariants}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 backface-hidden">
                      <img src={item.image} alt="Gallery" className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                    </div>
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center p-4 sm:p-6 text-center">
                      <p className="text-muted-foreground text-sm sm:text-base">{item.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
                <Button asChild size="lg" className="h-14 px-8 mt-25 font-bold text-lg bg-white text-emerald-600 hover:bg-white/90">
                  <Link to="/">
                    Back To Home <ArrowLeft className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
        </div>        
      </section>

      {/* Ask the Librarian */}
      <section ref={refs.ask} className="py-16 sm:py-32 px-4 sm:px-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate={inViews.ask ? "visible" : "hidden"}>
            <motion.h2 variants={childVariants} className="text-3xl sm:text-5xl font-bold text-center mb-16 sm:mb-20 rainbow-text-slow">
              Ask the Librarian
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <AccordionItem value={`faq-${i}`}>
                        <AccordionTrigger className="text-base sm:text-lg font-semibold hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contact Us</h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="h-10 sm:h-12" />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="h-10 sm:h-12" />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="h-10 sm:h-12" />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className="h-24 sm:h-32" />
                  </motion.div>
                  <motion.div whileHover="hover" whileTap="tap" variants={{ ...hoverVariants, ...tapVariants }}>
                    <Button type="submit" size="lg" className="w-full h-10 sm:h-12 bg-white text-emerald-600 hover:bg-white/90">
                      Submit <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* CTA + Footer */}
              <footer
                ref={refs.ctaRef}
                className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white py-16 px-6"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={inViews.ctaRef ? "visible" : "hidden"}
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
                      © 2026 Maktaba Hub. All rights reserved.
                    </p>
                  </motion.div>
                </motion.div>
              </footer>
    </div>
  );
}