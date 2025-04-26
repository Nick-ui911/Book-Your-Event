"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const pulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function HeroSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: "all", label: "All Events" },
    { id: "concerts", label: "Concerts" },
    { id: "workshops", label: "Workshops" },
    { id: "conferences", label: "Conferences" },
  ];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bgImage.png"
          alt="Evenza Events Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />

        {/* Floating Elements */}
        <motion.div
          className="absolute z-5 hidden md:block"
          animate={{
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ top: "20%", left: "15%" }}
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/20 backdrop-blur-md" />
        </motion.div>

        <motion.div
          className="absolute z-5 hidden md:block"
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{ top: "35%", right: "20%" }}
        >
          <div className="w-24 h-24 rounded-full bg-blue-500/20 backdrop-blur-md" />
        </motion.div>
      </div>

      {/* Hero Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container mx-auto px-6 relative z-20 mt-16"
      >
        <div className="max-w-4xl text-center mx-auto">
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow"
          >
            Discover.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Book.
            </span>{" "}
            Celebrate.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Find and book the best events in your area, or create and manage
            your own. Evenza makes event management simple and enjoyable.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/login">
              <motion.button
                type="button"
                className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-900 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 rounded-full shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Get Started Free</span>
                <span className="absolute inset-0 z-0 translate-x-[-100%] bg-white/20 opacity-0 transition-transform duration-500 ease-out group-hover:translate-x-[200%] group-hover:opacity-40" />
              </motion.button>
            </Link>
            <Link href="/events">
              <motion.button
                className="px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-purple-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Events
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scrolling indicator */}
      <motion.div
        className="absolute mt-5 bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-white/80 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
