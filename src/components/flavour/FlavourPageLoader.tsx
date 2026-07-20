"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { ProductTheme } from "@/lib/productThemes";

interface FlavourPageLoaderProps {
  theme: ProductTheme;
  productName: string;
  heroSrc: string;
  onComplete: () => void;
}

export default function FlavourPageLoader({
  theme,
  productName,
  heroSrc,
  onComplete,
}: FlavourPageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mounted = true;
    let frame = 0;
    const start = performance.now();
    const minDuration = 900;
    let imgLoaded = false;

    const img = new window.Image();
    img.src = heroSrc;
    img.onload = () => {
      imgLoaded = true;
    };
    img.onerror = () => {
      imgLoaded = true;
    };

    const tick = (now: number) => {
      if (!mounted) return;
      const elapsed = now - start;
      const timeProgress = Math.min(elapsed / minDuration, 1);
      const loadProgress = imgLoaded ? 1 : Math.min(elapsed / 1400, 0.85);
      const next = Math.min(100, Math.floor(Math.max(timeProgress, loadProgress) * 100));
      setProgress(next);

      if (next >= 100 && elapsed >= minDuration && imgLoaded) {
        setTimeout(() => {
          if (!mounted) return;
          setVisible(false);
          setTimeout(onComplete, 500);
        }, 200);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
    };
  }, [heroSrc, onComplete]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: theme.bgSolid }}
        >
          {/* Soft animated glow behind logo */}
          <motion.div
            className="absolute h-[320px] w-[320px] rounded-full blur-[80px]"
            style={{ background: theme.glow }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col items-center">
            {/* Logo + ring */}
            <div className="relative mb-8 flex h-[160px] w-[160px] items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 140 140"
                aria-hidden
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.15, ease: "linear" }}
                />
              </svg>

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white/5 backdrop-blur-sm"
              >
                <Image
                  src="/logo.png"
                  alt="Vellari"
                  width={64}
                  height={64}
                  className="h-auto w-[64px] object-contain"
                  priority
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-[family-name:var(--font-accent)] text-[11px] uppercase tracking-[5px]"
              style={{ color: theme.accent }}
            >
              {productName}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.35 }}
              className="mt-3 font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[3px]"
              style={{ color: theme.text }}
            >
              {progress}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
