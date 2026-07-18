"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const circumference = 2 * Math.PI * 120; // radius is 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F9EED9]"
        >
          <div className="relative flex flex-col items-center">
            {/* Circular Loader Container */}
            <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-10">
              {/* Outer SVG Ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 transform"
                viewBox="0 0 260 260"
              >
                {/* Background Ring */}
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  stroke="#E8D5B0"
                  strokeWidth="12"
                  fill="transparent"
                  className="opacity-30"
                />
                {/* Animated Progress Ring */}
                <motion.circle
                  cx="130"
                  cy="130"
                  r="120"
                  stroke="#D4961A" // v-gold
                  strokeWidth="12"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </svg>

              {/* Inner Black Circle & Logo */}
              <div className="relative w-[220px] h-[220px] bg-v-black rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <motion.img
                  src="/logo.png"
                  alt="Vellari Logo"
                  className="w-[80px] h-auto object-contain"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* LOADING Text */}
            <motion.h1
              className="text-5xl md:text-6xl font-[family-name:var(--font-body)] font-black tracking-wider text-[#641A1A] uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              LOADING...
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
