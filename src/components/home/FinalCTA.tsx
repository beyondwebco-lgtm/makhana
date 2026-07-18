"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useAnimations";
import CollectionCarousel from "@/components/home/CollectionCarousel";

export default function FinalCTA() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section
      id="products"
      ref={ref}
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        padding: "120px 0 100px",
      }}
    >
      {/* Base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(165deg, #0a0a0a 0%, #070707 40%, #0d0a12 100%)",
        }}
      />

      {/* Gold ambient orb — top left */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-8%",
          width: "55%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,150,26,0.12) 0%, rgba(212,150,26,0.04) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Purple ambient orb — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: "50%",
          height: "60%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(123,79,191,0.1) 0%, rgba(123,79,191,0.03) 45%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Warm centre glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(212,150,26,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Top edge highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(212,150,26,0.25) 30%, rgba(123,79,191,0.2) 70%, transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom fade into footer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to top, rgba(7,7,7,0.8), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          whileHover={{ 
            scale: 1.05, 
            y: -12, 
            transition: { type: "spring", stiffness: 400, damping: 25 } 
          }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "56px", cursor: "default" }}
        >
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "6px",
              color: "#D4961A",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "20px",
              fontFamily: "var(--font-accent)",
            }}
          >
            The Collection
          </span>
          <h2
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontFamily: "var(--font-body)",
              fontWeight: "700",
              color: "#FFF6E0",
              lineHeight: "1.0",
              marginBottom: "24px",
            }}
          >
            Found Your
            <br />
            <span className="gradient-gold">Flavour?</span>
          </h2>
          <p
            style={{
              color: "#A89478",
              fontSize: "17px",
              lineHeight: "1.7",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Some crushes are worth snacking on. Explore the full family of Vellari
            premium makhanas and find your crunchy match.
          </p>
        </motion.div>

        {/* Collection carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <CollectionCarousel />
        </motion.div>
      </div>
    </section>
  );
}
