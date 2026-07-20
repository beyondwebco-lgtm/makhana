"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function FlavourShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();

  const [clickPos, setClickPos] = useState({ x: 50, y: 50 }); // percentages

  const activeProduct = products[activeIndex];

  const goTo = useCallback(
    (index: number, e?: React.MouseEvent) => {
      if (e) {
        const rect = document.getElementById("flavours")?.getBoundingClientRect();
        if (rect) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setClickPos({ x, y });
        }
      } else {
        setClickPos({ x: 50, y: 50 });
      }
      setActiveIndex(index);
    },
    []
  );

  const prev = (e: React.MouseEvent) => {
    const newIndex = (activeIndex - 1 + products.length) % products.length;
    goTo(newIndex, e);
  };

  const next = (e: React.MouseEvent) => {
    const newIndex = (activeIndex + 1) % products.length;
    goTo(newIndex, e);
  };

  // Positions for the 5 products in the carousel track
  const getVisibleProducts = () => {
    const len = products.length;
    // Show active, 2 left, 2 right
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (activeIndex + offset + len) % len;
      return { product: products[index], offset };
    });
  };

  const visible = getVisibleProducts();

  return (
    <section
      id="flavours"
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 0 60px",
      }}
    >
      {/* Dark base */}
      <div style={{ position: "absolute", inset: 0, background: "#050505", zIndex: -1 }} />

      {/* Ripple Fill Background emanating from mouse click */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProduct.id + "-ripple"}
          initial={{ clipPath: `circle(0% at ${clickPos.x}% ${clickPos.y}%)`, opacity: 0.9 }}
          animate={{ clipPath: `circle(150% at ${clickPos.x}% ${clickPos.y}%)`, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            // Full color fill over the dark background
            background: `radial-gradient(circle at 50% 50%, ${activeProduct.color}ee 0%, ${activeProduct.color}aa 40%, ${activeProduct.color}55 100%)`,
            zIndex: 0,
          }}
        />
      </AnimatePresence>

      {/* Section header */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: "60px", marginTop: "20px" }}>
        <p style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.7)",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.8",
          fontFamily: "var(--font-body)"
        }}>
          Some crushes are worth snacking on. Explore the full family of Vellari
          premium makhanas and find your crunchy match.
        </p>
      </div>

      {/* Carousel track */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "360px",
          perspective: "1200px",
        }}
      >
        {visible.map(({ product, offset }) => {
          const isActive = offset === 0;
          const absOffset = Math.abs(offset);
          
          // Size and positioning logic
          const scale = isActive ? 1.1 : absOffset === 1 ? 0.75 : 0.55;
          const opacity = isActive ? 1 : absOffset === 1 ? 0.6 : 0.3;
          const translateX = offset * 260; // Spacing between images
          const zIndex = isActive ? 10 : absOffset === 1 ? 6 : 3;

          return (
            <motion.div
              key={product.id + "-" + offset}
              layout
              animate={{
                x: translateX,
                scale,
                opacity,
                zIndex,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              onClick={(e) => !isActive && goTo(products.findIndex((p) => p.id === product.id), e as any)}
              style={{
                position: "absolute",
                cursor: isActive ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "280px", // Base size of the square images
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
                  width: "100%", 
                  aspectRatio: "1/1", // Force square
                  borderRadius: "40px", // Highly rounded corners
                  padding: "8px", // Creates the transparent layer
                  background: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(8px)",
                  border: isActive ? `1px solid rgba(255,255,255,0.4)` : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "32px", // Inner rounded corners
                  overflow: "hidden",
                  background: "#111",
                }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ 
                      objectFit: "cover",
                    }}
                    sizes="300px"
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Active product info */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: "60px", padding: "0 24px", maxWidth: "600px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id + "-info"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px" }}>{activeProduct.emoji}</span>
              <h3
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
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
                letterSpacing: "4px",
                color: activeProduct.color,
                textTransform: "uppercase",
                fontFamily: "var(--font-accent)",
                marginBottom: "20px",
              }}
            >
              {activeProduct.flavor}
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,246,224,0.7)",
                lineHeight: "1.7",
                marginBottom: "36px",
                fontStyle: "italic"
              }}
            >
              &ldquo;{activeProduct.tagline}&rdquo;
            </p>

            {/* Price + CTA */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: "28px", fontWeight: "700", color: "#FFF6E0", fontFamily: "var(--font-body)" }}>
                  ₹{activeProduct.price}
                </span>
                <span style={{ fontSize: "16px", color: "rgba(255,246,224,0.35)", textDecoration: "line-through", marginLeft: "8px" }}>
                  ₹{activeProduct.originalPrice}
                </span>
              </div>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 36px",
                  borderRadius: "60px",
                  background: activeProduct.color,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-accent)",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 8px 32px ${activeProduct.color}60`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                onClick={() => addToCart(activeProduct.slug, 1)}
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows (matching the screenshot exactly) */}
      <div style={{ position: "absolute", top: "50%", left: "10%", transform: "translateY(-50%)", zIndex: 10 }}>
        <button
          onClick={prev}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(20,20,20,0.8)",
            color: "#FFF6E0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(40,40,40,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(20,20,20,0.8)"; }}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div style={{ position: "absolute", top: "50%", right: "10%", transform: "translateY(-50%)", zIndex: 10 }}>
        <button
          onClick={next}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(20,20,20,0.8)",
            color: "#FFF6E0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(40,40,40,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(20,20,20,0.8)"; }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "48px",
        }}
      >
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIndex ? "32px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === activeIndex ? activeProduct.color : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
