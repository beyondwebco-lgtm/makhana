"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "@/hooks/useAnimations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "100%", label: "Roasted", sublabel: "Not Fried" },
  { value: "9.2g", label: "Protein", sublabel: "Per Serving" },
  { value: "0", label: "Preservatives", sublabel: "All Natural" },
  { value: "6", label: "Flavours", sublabel: "Every Mood" },
];

export default function BrandStory() {
  const { ref, isInView } = useInView(0.1);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !statsRef.current) return;
    const items = statsRef.current.querySelectorAll(".stat-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" }
    );
  }, [isInView]);

  return (
    <section
      id="story"
      ref={ref}
      style={{ width: "100%", background: "#070707", overflow: "hidden" }}
    >
      <div style={{ padding: "100px 0", width: "100%" }}>
        {/* Inner container: centered, max-width */}
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span style={{ fontSize: "11px", letterSpacing: "6px", color: "#D4961A", textTransform: "uppercase", display: "block", marginBottom: "20px", fontFamily: "var(--font-accent)" }}>
              Our Promise
            </span>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontFamily: "var(--font-body)", fontWeight: "700", color: "#FFF6E0", lineHeight: "1.05", marginBottom: "24px" }}>
              Crunch Without{" "}
              <span className="gradient-gold">Compromise.</span>
            </h2>
            <p style={{ color: "#A89478", fontSize: "17px", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto 48px" }}>
              Premium Makhana made for cravings that deserve something better.
              We don&apos;t do boring — we roast, season, and flirt with flavours
              until every bite is a confession.
            </p>
          </motion.div>

          {/* Stats */}
          <div
            ref={statsRef}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "64px" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-item"
                style={{ padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", textAlign: "center" }}
              >
                <span style={{ fontSize: "clamp(28px, 3vw, 40px)", fontFamily: "var(--font-body)", fontWeight: "700", color: "#FFF6E0", display: "block", marginBottom: "4px" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "13px", fontFamily: "var(--font-accent)", fontWeight: "600", color: "#D4961A", display: "block" }}>
                  {stat.label}
                </span>
                <span style={{ fontSize: "11px", color: "#8B7355" }}>
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width Bowl Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}
        >
          <div style={{ position: "relative", borderRadius: "32px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", aspectRatio: "21/9" }}>
            <Image
              src="/products/Bowl.jpeg"
              alt="Vellari — All Flavours. One Bowl."
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,7,7,0.8), transparent)" }} />
            <div style={{ position: "absolute", bottom: "32px", left: 0, right: 0, textAlign: "center" }}>
              <p style={{ fontSize: "clamp(18px, 2vw, 24px)", fontFamily: "var(--font-display)", color: "#FFF6E0", fontStyle: "italic" }}>
                &ldquo;All Flavours. One Bowl.&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
