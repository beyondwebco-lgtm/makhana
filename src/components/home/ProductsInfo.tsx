"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

export default function ProductsInfo() {
  const { ref, isInView } = useInView(0.15);

  const scrollToCollection = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        background: "#FFF6E0",
        padding: "160px 0",
        overflow: "hidden",
      }}
    >
      {/* Container */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr", // Gives the image slightly more room
          alignItems: "center",
          gap: "80px",
        }}
      >
        {/* Left — Huge Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          style={{ width: "100%", position: "relative" }}
        >
          {/* Subtle drop shadow behind the image */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "80%",
              height: "80%",
              background: "rgba(212,150,26,0.1)",
              filter: "blur(60px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, borderRadius: "32px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.15)" }}>
            <Image
              src="/products-info.png"
              alt="Vellari Roasted Makhana — six flirty flavours"
              width={1600}
              height={1200}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
              priority
            />
          </div>
        </motion.div>

        {/* Right — Content neatly aligned */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
        >
          <span
            style={{
              fontSize: "12px",
              letterSpacing: "6px",
              color: "#D4961A",
              textTransform: "uppercase",
              fontFamily: "var(--font-accent)",
              fontWeight: "600",
              marginBottom: "24px",
              display: "block",
            }}
          >
            Meet the Range
          </span>

          <h2
            style={{
              fontSize: "clamp(48px, 6vw, 84px)",
              fontFamily: "var(--font-body)",
              fontWeight: "800",
              color: "#070707",
              lineHeight: "1.0",
              letterSpacing: "-1px",
              marginBottom: "32px",
            }}
          >
            Six Flirty<br />
            <span style={{ color: "#D4961A" }}>Flavours.</span>
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "#5A4A3B", // Darker muted brown for cream background
              lineHeight: "1.8",
              maxWidth: "520px",
              marginBottom: "40px",
            }}
          >
            Roasted makhana in every mood — from cheesy love letters to fiery red flags.
            Every jar is roasted, not fried, and packed with crunch.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "48px" }}>
            {["Roasted, Not Fried", "High in Protein", "Gluten Free"].map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "8px 16px",
                  borderRadius: "60px",
                  border: "1px solid rgba(212,150,26,0.3)",
                  background: "rgba(212,150,26,0.05)",
                  fontSize: "12px",
                  color: "#B87F13",
                  fontFamily: "var(--font-accent)",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          <button
            onClick={scrollToCollection}
            className="btn-primary group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 40px",
              fontSize: "14px",
            }}
          >
            Find Your Flavor
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Fade transition at bottom to match next section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #070707)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
