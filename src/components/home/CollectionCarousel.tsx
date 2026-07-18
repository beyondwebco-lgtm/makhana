"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";

export default function CollectionCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const prev = () => {
    goTo((activeIndex - 1 + products.length) % products.length);
  };

  const next = () => {
    goTo((activeIndex + 1) % products.length);
  };

  const getVisibleProducts = () => {
    const len = products.length;
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (activeIndex + offset + len) % len;
      return { product: products[index], offset };
    });
  };

  const visible = getVisibleProducts();

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Ripple Fill Background emanating from the active product (center) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProduct.id + "-ripple"}
          initial={{ clipPath: `circle(0% at 50% 50%)`, opacity: 0.9 }}
          animate={{ clipPath: `circle(150% at 50% 50%)`, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "absolute",
            // Make it large enough to cover the parent section (FinalCTA)
            top: "-500px", bottom: "-500px", left: "-50vw", right: "-50vw",
            background: `radial-gradient(circle at 50% 50%, ${activeProduct.color}ee 0%, ${activeProduct.color}99 40%, ${activeProduct.color}44 100%)`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </AnimatePresence>

      {/* Carousel track */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "380px",
          marginTop: "16px",
        }}
      >
        {visible.map(({ product, offset }) => {
          const isActive = offset === 0;
          const absOffset = Math.abs(offset);
          const scale = isActive ? 1 : absOffset === 1 ? 0.75 : 0.55;
          const opacity = isActive ? 1 : absOffset === 1 ? 0.65 : 0.3;
          const translateX = offset * 240;
          const zIndex = isActive ? 10 : absOffset === 1 ? 6 : 3;

          return (
            <motion.div
              key={product.id}
              layout
              animate={{
                x: translateX,
                scale,
                opacity,
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              onClick={(e) =>
                !isActive &&
                goTo(products.findIndex((p) => p.id === product.id))
              }
              style={{
                position: "absolute",
                zIndex,
                cursor: isActive ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "280px",
              }}
            >
              {/* Product image with Transparent Glass Layer and heavily rounded corners */}
              <motion.div
                animate={{ 
                  boxShadow: isActive 
                    ? `0 0 60px 10px ${product.color}80, inset 0 0 20px rgba(255,255,255,0.2)` 
                    : `0 0 0px 0px ${product.color}00, inset 0 0 0px rgba(255,255,255,0)`
                }}
                transition={{ duration: 0.8 }}
                style={{ 
                  position: "relative", 
                  width: "260px", 
                  height: "260px",
                  borderRadius: "40px", // Highly rounded corners (outer glass frame)
                  padding: "8px", // Creates the transparent layer
                  background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(8px)",
                  border: isActive ? `1.5px solid rgba(255,255,255,0.5)` : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "32px", // Inner rounded corners
                  overflow: "hidden",
                  background: "#111", // Dark background so transparent PNGs look solid
                }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="260px"
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Active product info */}
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
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id + "-info"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
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
            </div>
            <p
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
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,246,224,0.6)",
                lineHeight: "1.7",
                maxWidth: "480px",
                margin: "0 auto 28px",
              }}
            >
              &ldquo;{activeProduct.tagline}&rdquo;
            </p>

            <div
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
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 32px",
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
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 8px 32px ${activeProduct.color}60`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "16px",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <button
          onClick={prev}
          aria-label="Previous flavour"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            color: "#FFF6E0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(212,150,26,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <ChevronLeft size={22} />
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "42%",
          right: "16px",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <button
          onClick={next}
          aria-label="Next flavour"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            color: "#FFF6E0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(212,150,26,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "36px",
        }}
      >
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            aria-label={`View ${p.name}`}
            style={{
              width: i === activeIndex ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background:
                i === activeIndex
                  ? activeProduct.color
                  : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
