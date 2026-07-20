"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import { products } from "@/data/products";
import { ArrowRight, ChevronUp, ChevronDown, Sparkles } from "lucide-react";

// Themed background configs for each product
const productThemes: Record<string, { bg: string; glow: string; accent: string; particles: string[] }> = {
  "crush-me": {
    bg: "radial-gradient(ellipse at 40% 50%, #E8D5A3 0%, #D4B87A 30%, #C4A265 60%, #A8884A 100%)",
    glow: "rgba(196,162,101,0.6)",
    accent: "#7A5C2A",
    particles: ["🌾", "✨", "🌿"],
  },
  "red-flag": {
    bg: "radial-gradient(ellipse at 40% 50%, #6B1010 0%, #8B1A1A 30%, #4A0808 70%, #2A0404 100%)",
    glow: "rgba(180,30,30,0.7)",
    accent: "#FF6B6B",
    particles: ["🌶️", "🔥", "✨"],
  },
  "green-flag": {
    bg: "radial-gradient(ellipse at 40% 50%, #3A6B20 0%, #2D5016 30%, #1E3810 70%, #0F2008 100%)",
    glow: "rgba(60,120,30,0.7)",
    accent: "#8FD44F",
    particles: ["🌿", "🍃", "✨"],
  },
  "soulmate": {
    bg: "radial-gradient(ellipse at 40% 50%, #8B5FC0 0%, #6B3FA0 30%, #4A2D75 70%, #2E1A52 100%)",
    glow: "rgba(107,63,160,0.7)",
    accent: "#D4A8FF",
    particles: ["💜", "🌸", "✨"],
  },
  "blush": {
    bg: "radial-gradient(ellipse at 40% 50%, #E05555 0%, #C94040 30%, #9B2020 70%, #6B0E0E 100%)",
    glow: "rgba(201,64,64,0.7)",
    accent: "#FFB3B3",
    particles: ["🍅", "🌶️", "✨"],
  },
  "love-bite": {
    bg: "radial-gradient(ellipse at 40% 50%, #E8C040 0%, #D4961A 30%, #A8740E 70%, #7A5208 100%)",
    glow: "rgba(212,150,26,0.7)",
    accent: "#FFF0A0",
    particles: ["🧀", "⭐", "✨"],
  },
};

// Floating animation for the jar
const floatVariants: Variants = {
  animate: {
    y: [0, -14, 0],
    rotate: [0, 1.5, -1.5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Particle floating component
function FloatingParticle({ emoji, index }: { emoji: string; index: number }) {
  const positions = [
    { top: "15%", left: "12%" },
    { top: "70%", left: "8%" },
    { top: "40%", left: "85%" },
    { top: "20%", left: "75%" },
    { top: "80%", left: "78%" },
    { top: "55%", left: "15%" },
  ];
  const pos = positions[index % positions.length];
  return (
    <motion.div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        fontSize: "clamp(18px, 2.5vw, 32px)",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.35,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.25, 0.5, 0.25],
        rotate: [0, 15, -10, 0],
      }}
      transition={{
        duration: 4 + index * 0.8,
        repeat: Infinity,
        delay: index * 0.5,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Background Image Component
function FloatingBackgroundImage({ src, index }: { src: string; index: number }) {
  // Asymmetric positioning
  const isTopLeft = index === 0;
  
  // Pick a random corner for the first image, and the opposite for the second
  const layoutRandomizer = useRef(Math.random() > 0.5);
  const useTopLeft = layoutRandomizer.current ? isTopLeft : !isTopLeft;

  // For the left image: blurred and lower opacity
  // For the right image: sharp, high opacity, and multiply blend mode (to remove white background)
  const isBlurred = isTopLeft; 
  
  const blurVal = isBlurred ? Math.floor(Math.random() * (12 - 4 + 1) + 4) : 0; // 4-12px if blurred, 0 if sharp
  const opacityVal = isBlurred ? Math.random() * (0.5 - 0.3) + 0.3 : Math.random() * (0.95 - 0.85) + 0.85; // 30-50% vs 85-95%
  
  const blur = useRef(blurVal);
  const scale = useRef(Math.random() * (1.5 - 1.2) + 1.2); 
  const rotation = useRef(Math.random() * 30 - 15); // -15° to +15°
  const opacity = useRef(opacityVal);
  const duration = useRef(Math.random() * (15 - 10) + 10); 

  const top = useTopLeft ? '5%' : '60%';
  const left = useTopLeft ? '2%' : '65%';
  const width = useTopLeft ? '35%' : '30%';

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: scale.current * 0.9, 
        rotate: rotation.current - 10,
        y: 40,
        filter: `blur(${blur.current}px)`
      }}
      animate={{ 
        opacity: opacity.current, 
        scale: scale.current, 
        rotate: [rotation.current, rotation.current + 4, rotation.current - 4, rotation.current],
        y: [0, -20, 0],
        filter: `blur(${blur.current}px)`
      }}
      exit={{ 
        opacity: 0, 
        scale: scale.current * 1.1, 
        filter: `blur(${blur.current + 8}px)` 
      }}
      transition={{ 
        // Entrance animation
        opacity: { duration: 1.2, ease: "easeOut" },
        scale: { duration: 1.5, ease: "easeOut" },
        // Loop animations
        rotate: { duration: duration.current, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        y: { duration: duration.current, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
      }}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height: '40%',
        zIndex: 0,
        transformOrigin: 'center center',
        mixBlendMode: isBlurred ? 'normal' : 'multiply',
      }}
    >
      <Image 
        src={src} 
        alt="" 
        fill
        sizes="35vw"
        style={{ objectFit: 'contain' }} 
      />
    </motion.div>
  );
}

export default function FlavorScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const numProducts = products.length;

  const [activeBgImages, setActiveBgImages] = useState<{ src: string; id: string }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const targetIdx = Math.max(0, Math.min(index, numProducts - 1));
    const vh = window.innerHeight;
    const containerStart = containerRef.current.offsetTop;
    window.scrollTo({
      top: containerStart + targetIdx * vh,
      behavior: "smooth"
    });
  };

  // Map scroll progress to active product index
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const raw = v * numProducts;
      const idx = Math.min(Math.floor(raw), numProducts - 1);
      if (idx !== activeIndex) {
        setPrevIndex(activeIndex);
        setActiveIndex(idx);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, numProducts, activeIndex]);

  // Select active background images when index changes
  useEffect(() => {
    const product = products[activeIndex];
    const availableImages = product.bgImages;
    
    if (availableImages && availableImages.length >= 2) {
      // Shuffle array to pick 2 random images
      const shuffled = [...availableImages].sort(() => 0.5 - Math.random());
      setActiveBgImages([
        { src: `/assets/products/${product.slug}/${shuffled[0]}`, id: `${product.slug}-${shuffled[0]}-${Date.now()}-0` },
        { src: `/assets/products/${product.slug}/${shuffled[1]}`, id: `${product.slug}-${shuffled[1]}-${Date.now()}-1` }
      ]);
    } else {
      setActiveBgImages([]);
    }
  }, [activeIndex]);

  const product = products[activeIndex];
  const theme = productThemes[product.slug] ?? {
    bg: "#1A1A1A",
    glow: "rgba(255,255,255,0.3)",
    accent: "#FFF6E0",
    particles: ["✨"],
  };

  const allParticles: string[] = [];
  for (let i = 0; i < 6; i++) {
    allParticles.push(theme.particles[i % theme.particles.length]);
  }

  return (
    /* Tall scroll container — 600vh gives one viewport per flavour */
    <div
      ref={containerRef}
      style={{ height: `${numProducts * 100}vh`, position: "relative" }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* === Animated Background === */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.slug + "-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: theme.bg,
              zIndex: 0,
            }}
          />
        </AnimatePresence>

        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Floating particles */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.slug + "-particles"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
          >
            {allParticles.map((emoji, i) => (
              <FloatingParticle key={i} emoji={emoji} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic product background images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.slug + "-dynamic-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
          >
            {activeBgImages.map((img, idx) => (
              <FloatingBackgroundImage key={img.id} src={img.src} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Section header */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(255,255,255,0.15)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 24px",
              borderRadius: "100px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              cursor: "default",
            }}
          >
            <Sparkles size={16} color="rgba(255,255,255,0.8)" />
            <span
              style={{
                fontSize: "15px",
                fontWeight: "700",
                letterSpacing: "6px",
                color: "rgba(255,255,255,0.9)",
                textTransform: "uppercase",
                fontFamily: "var(--font-accent)",
              }}
            >
              MEET THE FLAVOURS
            </span>
            <Sparkles size={16} color="rgba(255,255,255,0.8)" />
          </motion.div>
        </div>

        {/* === Main split layout === */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            height: "100%",
            padding: "0 4vw",
            gap: "4vw",
          }}
        >
          {/* ─── LEFT: Product Jar (60%) ─── */}
          <div
            style={{
              flex: "0 0 58%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "100%",
            }}
          >
            {/* Glow blob behind jar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.slug + "-glow"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: "absolute",
                  width: "55%",
                  paddingBottom: "55%",
                  borderRadius: "50%",
                  background: theme.glow,
                  filter: "blur(80px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
            </AnimatePresence>

            {/* The jar itself */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.slug + "-jar"}
                initial={{ opacity: 0, scale: 0.85, rotate: -6, y: 40 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 5, y: -30 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "relative", zIndex: 2 }}
              >
                <motion.div
                  variants={floatVariants}
                  animate="animate"
                  style={{
                    filter: `drop-shadow(0 30px 60px ${theme.glow})`,
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      y: -15, 
                      borderColor: theme.accent,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                    style={{
                      border: "2px solid transparent",
                      borderRadius: "32px",
                      padding: "20px",
                      transition: "border-color 0.3s, background-color 0.3s",
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      priority
                      style={{
                        width: "clamp(280px, 36vw, 520px)",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── RIGHT: Product Info (40%) ─── */}
          <div
            style={{
              flex: "0 0 38%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 2vw 0 0",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={product.slug + "-info"}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Label */}
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "5px",
                    color: theme.accent,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-accent)",
                    marginBottom: "16px",
                    opacity: 0.85,
                  }}
                >
                  MEET THE FLAVOUR
                </p>

                {/* Emoji + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                  <span style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>{product.emoji}</span>
                  <h2
                    style={{
                      fontSize: "clamp(42px, 6vw, 80px)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 900,
                      color: "#FFFFFF",
                      lineHeight: 1,
                      letterSpacing: "-1px",
                    }}
                  >
                    {product.name}
                  </h2>
                </div>

                {/* Flavor tag */}
                <p
                  style={{
                    fontSize: "13px",
                    letterSpacing: "3px",
                    color: theme.accent,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-accent)",
                    marginBottom: "20px",
                  }}
                >
                  {product.flavor}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "clamp(15px, 1.4vw, 18px)",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.75,
                    marginBottom: "32px",
                    maxWidth: "420px",
                  }}
                >
                  "{product.tagline}"
                </p>

                {/* Feature pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}>
                  {product.highlights.slice(0, 4).map((h) => (
                    <span
                      key={h}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "60px",
                        border: `1px solid ${theme.accent}55`,
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(8px)",
                        color: theme.accent,
                        fontSize: "12px",
                        fontFamily: "var(--font-accent)",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                  <div>
                    <span
                      style={{
                        fontSize: "clamp(24px, 2.5vw, 36px)",
                        fontWeight: 800,
                        color: "#FFFFFF",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      ₹{product.price}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "rgba(255,255,255,0.3)",
                        textDecoration: "line-through",
                        marginLeft: "10px",
                      }}
                    >
                      ₹{product.originalPrice}
                    </span>
                  </div>

                  <Link href={`/flavours/${product.slug}`}>
                    <motion.span
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px 30px",
                        borderRadius: "60px",
                        background: "#FFFFFF",
                        color: "#1A1A1A",
                        fontSize: "13px",
                        fontWeight: 800,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-accent)",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: `0 10px 40px rgba(0,0,0,0.3)`,
                      }}
                    >
                      Explore Flavour
                      <ArrowRight size={15} />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* === Progress indicator & Navigation (right side) === */}
        <div
          style={{
            position: "absolute",
            right: "28px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button 
            onClick={() => scrollToIndex(activeIndex - 1)}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "rgba(255,255,255,0.7)", 
              cursor: activeIndex > 0 ? "pointer" : "default",
              opacity: activeIndex > 0 ? 1 : 0.2,
              padding: "4px" 
            }}
          >
            <ChevronUp size={20} />
          </button>

          {/* Counter */}
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-accent)",
              letterSpacing: "2px",
            }}
          >
            {String(activeIndex + 1).padStart(2, "0")}/{String(numProducts).padStart(2, "0")}
          </span>
          {/* Dots */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "8px 0" }}>
            {products.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeIndex ? "4px" : "4px",
                  height: i === activeIndex ? "28px" : "8px",
                  background:
                    i === activeIndex ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                  borderRadius: "4px",
                }}
                transition={{ duration: 0.3 }}
                style={{ width: "4px", borderRadius: "4px" }}
              />
            ))}
          </div>

          <button 
            onClick={() => scrollToIndex(activeIndex + 1)}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "rgba(255,255,255,0.7)", 
              cursor: activeIndex < numProducts - 1 ? "pointer" : "default",
              opacity: activeIndex < numProducts - 1 ? 1 : 0.2,
              padding: "4px"
            }}
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Scroll hint (only shown for first product) */}
        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                bottom: "28px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "24px",
                  height: "38px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: "6px",
                }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: "4px",
                    height: "8px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.6)",
                  }}
                />
              </motion.div>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-accent)",
                }}
              >
                Scroll
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
