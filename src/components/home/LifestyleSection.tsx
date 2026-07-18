"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "@/hooks/useAnimations";

export default function LifestyleSection() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} style={{ width: "100%", background: "#FFF6E0", padding: "100px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>

        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "56px", textAlign: "center" }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "6px", color: "#D4961A", textTransform: "uppercase", display: "block", marginBottom: "20px", fontFamily: "var(--font-accent)" }}>
            Lifestyle
          </span>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontFamily: "var(--font-body)", fontWeight: "700", color: "#070707", lineHeight: "1.1", marginBottom: "20px" }}>
            Binge Better.<br />Flirt with Crunch.
          </h2>
          <p style={{ color: "#8B7355", fontSize: "16px", lineHeight: "1.7", maxWidth: "540px", margin: "0 auto", textAlign: "center" }}>
            From late-night study sessions to mid-day desk escapes, Vellari turns
            healthy snacking into a premium affair.
          </p>
        </motion.div>

        {/* Symmetrical 3-column grid — centered */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {[
            { src: "/lifestyle/1.png", alt: "Vellari Classic Salted", delay: 0.2 },
            { src: "/products/Bowl.jpeg", alt: "All Flavours Bowl", delay: 0.1, caption: "All-Natural Goodness." },
            { src: "/lifestyle/2.png", alt: "Vellari Peri Peri", delay: 0.3 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: item.delay }}
              style={{ position: "relative", borderRadius: "24px", overflow: "hidden", aspectRatio: "4/5" }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{ objectFit: "cover", transition: "transform 1.5s ease" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {item.caption && (
                <>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,7,7,0.7), transparent)" }} />
                  <div style={{ position: "absolute", bottom: "20px", left: 0, right: 0, textAlign: "center" }}>
                    <p style={{ fontSize: "16px", fontFamily: "var(--font-body)", fontWeight: "700", color: "#FFF6E0" }}>
                      {item.caption}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
