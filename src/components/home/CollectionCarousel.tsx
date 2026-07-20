"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

// Easing function for smooth cinematic motion
const cinematicEase: [number, number, number, number] = [0.25, 1, 0.35, 1]; // highly responsive cubic-bezier

// Stagger variants for text content
const textContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1, // Wait for slide to begin settling
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    }
  }
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: cinematicEase } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// Subtle idle float for the active product image
const imageIdleVariants: Variants = {
  idle: {
    y: [-3, 3, -3],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function CollectionCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();
  const activeProduct = products[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const prev = () => goTo((activeIndex - 1 + products.length) % products.length);
  const next = () => goTo((activeIndex + 1) % products.length);

  const getVisibleProducts = () => {
    const len = products.length;
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (activeIndex + offset + len) % len;
      return { product: products[index], offset, actualIndex: index };
    });
  };

  const visible = getVisibleProducts();

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* ─── CINEMATIC BACKGROUND CROSSFADE ─── */}
      <div 
        style={{
          position: "absolute",
          top: "-600px", bottom: "-600px", left: "-50vw", right: "-50vw",
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden"
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeProduct.id + "-bg"}
            initial={{ opacity: 0, scale: 1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1.05, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${activeProduct.color}ee 0%, ${activeProduct.color}99 40%, #070707 100%)`,
              willChange: "transform, opacity, filter"
            }}
          />
        </AnimatePresence>
      </div>

      {/* ─── 3D CAROUSEL TRACK ─── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "420px",
          marginTop: "16px",
          perspective: "1200px" // For authentic 3D depth
        }}
      >
        {visible.map(({ product, offset, actualIndex }) => {
          const isActive = offset === 0;
          const absOffset = Math.abs(offset);
          
          // Ultra smooth 3D transformations
          const translateX = offset * 230; 
          const scale = isActive ? 1.08 : absOffset === 1 ? 0.85 : 0.7;
          const translateY = isActive ? -12 : 0;
          const rotateY = offset * -8; // Slight rotation pointing towards center
          const zIndex = 10 - absOffset;
          const opacity = isActive ? 1 : absOffset === 1 ? 0.5 : 0.15;
          const blur = isActive ? "0px" : absOffset === 1 ? "4px" : "8px";
          const brightness = isActive ? "1" : "0.6";

          return (
            <motion.div
              key={product.id}
              initial={false}
              animate={{
                x: translateX,
                y: translateY,
                scale,
                rotateY,
                opacity,
                filter: `blur(${blur}) brightness(${brightness})`,
                zIndex,
              }}
              transition={{
                duration: 0.8,
                ease: cinematicEase,
              }}
              onClick={() => !isActive && goTo(actualIndex)}
              style={{
                position: "absolute",
                cursor: isActive ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "260px",
                willChange: "transform, opacity, filter",
                transformOrigin: "center bottom",
              }}
            >
              {/* Card Container */}
              <motion.div
                animate={{
                  boxShadow: isActive 
                    ? `0 20px 60px -10px ${product.color}99, inset 0 0 20px rgba(255,255,255,0.3)` 
                    : `0 0 0px 0px rgba(0,0,0,0), inset 0 0 0px rgba(255,255,255,0)`,
                  borderColor: isActive ? `rgba(255,255,255,0.5)` : `rgba(255,255,255,0.05)`,
                  backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.02)",
                }}
                transition={{ duration: 0.8, ease: cinematicEase }}
                style={{
                  position: "relative",
                  width: "260px",
                  height: "260px",
                  borderRadius: "32px",
                  padding: "8px",
                  backdropFilter: "blur(12px)",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  willChange: "transform, background-color, border-color, box-shadow",
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "24px",
                  overflow: "hidden",
                  background: "#111", // Dark bg for contrast
                }}>
                  <motion.div 
                    variants={isActive ? imageIdleVariants : undefined}
                    animate={isActive ? "idle" : undefined}
                    style={{ width: "100%", height: "100%", position: "relative" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{
                        objectFit: "cover",
                        transform: isActive ? "scale(1)" : "scale(0.96)",
                        transition: "transform 0.8s cubic-bezier(0.25, 1, 0.35, 1)",
                      }}
                      sizes="260px"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── STAGGERED TEXT ANIMATION ─── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          marginTop: "32px",
          padding: "0 24px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          minHeight: "220px", // prevent layout shift during exit/enter
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id + "-info"}
            variants={textContainerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Emoji + Name */}
            <motion.div variants={textItemVariants} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px" }}>{activeProduct.emoji}</span>
              <h3
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontFamily: "var(--font-body)",
                  fontWeight: "700",
                  color: "#FFF6E0",
                }}
              >
                {activeProduct.name}
              </h3>
            </motion.div>

            {/* Flavor Name */}
            <motion.p variants={textItemVariants}
              style={{
                fontSize: "13px",
                letterSpacing: "3px",
                color: activeProduct.color,
                textTransform: "uppercase",
                fontFamily: "var(--font-accent)",
                marginBottom: "14px",
              }}
            >
              {activeProduct.flavor}
            </motion.p>

            {/* Tagline */}
            <motion.p variants={textItemVariants}
              style={{
                fontSize: "15px",
                color: "rgba(255,246,224,0.6)",
                lineHeight: "1.7",
                maxWidth: "480px",
                margin: "0 auto 28px",
              }}
            >
              &ldquo;{activeProduct.tagline}&rdquo;
            </motion.p>

            {/* Price & CTA */}
            <motion.div variants={textItemVariants}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#FFF6E0",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ₹{activeProduct.price}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    color: "rgba(255,246,224,0.35)",
                    textDecoration: "line-through",
                    marginLeft: "8px",
                  }}
                >
                  ₹{activeProduct.originalPrice}
                </span>
              </div>
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Link href={`/flavours/${activeProduct.slug}`}>
                  <motion.span
                    whileHover={{ scale: 1.05, boxShadow: `0 12px 32px ${activeProduct.color}80` }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 28px",
                      borderRadius: "60px",
                      background: activeProduct.color,
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-accent)",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: `0 8px 24px ${activeProduct.color}40`,
                      willChange: "transform, box-shadow",
                    }}
                  >
                    Explore Flavour
                  </motion.span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    borderRadius: "60px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#FFF6E0",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-accent)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                  }}
                  onClick={() => addToCart(activeProduct.slug, 1)}
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── NAVIGATION BUTTONS ─── */}
      <div style={{ position: "absolute", top: "35%", left: "16px", transform: "translateY(-50%)", zIndex: 10 }}>
        <motion.button
          onClick={prev}
          aria-label="Previous flavour"
          whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "0 4px 20px rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            color: "#FFF6E0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform, background-color, box-shadow",
          }}
        >
          <ChevronLeft size={24} />
        </motion.button>
      </div>
      <div style={{ position: "absolute", top: "35%", right: "16px", transform: "translateY(-50%)", zIndex: 10 }}>
        <motion.button
          onClick={next}
          aria-label="Next flavour"
          whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "0 4px 20px rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            color: "#FFF6E0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform, background-color, box-shadow",
          }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* ─── DOT INDICATORS ─── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "16px",
        }}
      >
        {products.map((p, i) => (
          <motion.button
            key={p.id}
            onClick={() => goTo(i)}
            aria-label={`View ${p.name}`}
            animate={{
              width: i === activeIndex ? 32 : 8,
              backgroundColor: i === activeIndex ? activeProduct.color : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              height: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              padding: 0,
              willChange: "width, background-color",
            }}
          />
        ))}
      </div>
    </div>
  );
}
