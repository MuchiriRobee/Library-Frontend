// src/components/layout/ParticleBackground.tsx
import { motion } from "framer-motion";

const books = ["📚", "📖", "📔", "📕", "📗", "📘", "📙"];

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-5"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -100,
          }}
          animate={{
            y: window.innerHeight + 100,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 20 + Math.random() * 30,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        >
          {books[i % books.length]}
        </motion.div>
      ))}
    </div>
  );
}