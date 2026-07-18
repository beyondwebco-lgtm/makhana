"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import WarningMarquee from "./WarningMarquee";

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    window.addEventListener("mousemove", handleMouseMove);
    const animate = () => {
      if (parallaxRef.current) {
        const x = mouseX.current * 12;
        const y = mouseY.current * 12;
        parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove]);

  const scrollToAnimation = () => {
    document.getElementById("scroll-animation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#070707",
      }}
    >
      {/* Ambient glow */}
      <div ref={parallaxRef} style={{ position: "absolute", inset: 0, transition: "transform 2000ms ease-out" }}>
        <div style={{ position: "absolute", top: "20%", right: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "rgba(212,150,26,0.05)", filter: "blur(160px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(123,79,191,0.04)", filter: "blur(120px)" }} />
      </div>

      {/* Two-column layout */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px 48px 140px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {/* LEFT — Tagline */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ marginBottom: "32px" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                borderRadius: "60px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                fontSize: "11px",
                letterSpacing: "4px",
                color: "#A89478",
                textTransform: "uppercase",
                fontFamily: "var(--font-accent)",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4961A", display: "inline-block" }} className="animate-pulse" />
              Premium Roasted Makhana
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: "700",
              lineHeight: "0.92",
              letterSpacing: "-1px",
              marginBottom: "28px",
              fontSize: "clamp(48px, 6.5vw, 110px)",
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ display: "block" }}
              className="gradient-gold"
            >
              Flirty
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ display: "block" }}
              className="gradient-gold"
            >
              Flavours.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ display: "block", color: "#FFF6E0", marginTop: "8px" }}
            >
              Crunchy
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ display: "block", color: "#FFF6E0" }}
            >
              Feelings.
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "380px",
              marginBottom: "40px",
              fontWeight: "300",
              lineHeight: "1.8",
            }}
          >
            Six irresistible flavours of roasted makhana, crafted for those who snack with intention.
          </motion.p>

          {/* Badges row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}
          >
            {["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives"].map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "6px 14px",
                  borderRadius: "60px",
                  border: "1px solid rgba(212,150,26,0.3)",
                  background: "rgba(212,150,26,0.06)",
                  fontSize: "11px",
                  color: "#D4961A",
                  fontFamily: "var(--font-accent)",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
          >
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary-light group"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Explore Flavours
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary-light group"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* RIGHT — Product Jar */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Glow behind jar */}
          <div
            style={{
              position: "absolute",
              width: "80%",
              height: "80%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(123,79,191,0.18) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          {/* Float animation wrapper */}
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "500px" }}
          >
            <Image
              src="/products/4.png"
              alt="Vellari Soulmate — Cream & Onion"
              width={500}
              height={500}
              style={{ width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))" }}
              priority
            />
          </motion.div>

          {/* Flavour tag */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "-10px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "12px 18px",
            }}
          >
            <p style={{ fontSize: "11px", color: "#D4961A", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-accent)", marginBottom: "2px" }}>
              Soulmate
            </p>
            <p style={{ fontSize: "13px", color: "#FFF6E0", fontWeight: "600", fontFamily: "var(--font-accent)" }}>
              Cream & Onion ♡
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={scrollToAnimation}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "10px", letterSpacing: "4px", color: "#8B7355", textTransform: "uppercase", fontFamily: "var(--font-accent)" }}>
          Scroll to explore
        </span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown style={{ width: "16px", height: "16px", color: "#8B7355" }} />
        </motion.div>
      </motion.div>

      {/* Warning Marquee */}
      <WarningMarquee />

      {/* Bottom gradient */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to top, #FFF6E0, transparent)", zIndex: 10, pointerEvents: "none" }} />
    </section>
  );
}
