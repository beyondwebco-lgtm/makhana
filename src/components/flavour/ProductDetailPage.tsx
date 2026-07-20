"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Flame,
  Leaf,
  Shield,
  Wheat,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  RotateCcw,
  Minus,
  Plus
} from "lucide-react";
import type { Product } from "@/data/products";
import type { ProductAssetBundle } from "@/lib/getProductAssets";
import type { ProductTheme } from "@/lib/productThemes";
import { useInView } from "@/hooks/useAnimations";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import FlavourPageLoader from "@/components/flavour/FlavourPageLoader";
import AnimatedFlavourBackground from "@/components/flavour/AnimatedFlavourBackground";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";

const BENEFIT_ICONS = [Flame, Zap, Shield, Wheat, Leaf];

interface ProductDetailPageProps {
  product: Product;
  assets: ProductAssetBundle;
  theme: ProductTheme;
  related: Product[];
}

function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <span
      className="mb-6 inline-block font-[family-name:var(--font-accent)] text-xs uppercase tracking-[4px] font-bold"
      style={{ color: accent }}
    >
      {children}
    </span>
  );
}

function MascotSticker({
  src,
  className,
  delay = 0,
  width = 120,
}: {
  src: string;
  className?: string;
  delay?: number;
  width?: number;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none z-30 select-none ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 0.9,
        scale: 1,
        y: [0, -12, 0],
        rotate: [0, 4, -4, 0],
      }}
      whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      }}
      style={{ width: `${width}px`, height: `${width}px` }}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt="Mascot"
          fill
          sizes={`${width}px`}
          className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        />
      </div>
    </motion.div>
  );
}

export default function ProductDetailPage({
  product,
  assets,
  theme,
  related,
}: ProductDetailPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [pageReady, setPageReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 400], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const jarRotate = useTransform(scrollY, [0, 400], [0, 12]);

  const galleryImages = assets.gallery.length > 0 ? [...assets.gallery] : [product.image];
  if (assets.hero && !galleryImages.includes(assets.hero)) {
    galleryImages.unshift(assets.hero);
  }

  const mascots = assets.emotions.filter((_, idx) => idx > 1 && idx < 9);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages]);

  const handleAddToCart = () => {
    addToCart(product.slug, quantity);
  };

  const nutritionCards = [
    { label: "Protein", value: product.nutrition.protein, icon: Zap },
    { label: "Calories", value: product.nutrition.energy, icon: Flame },
    { label: "Fiber", value: product.nutrition.dietaryFibre, icon: Leaf },
    { label: "Fat", value: product.nutrition.totalFat, icon: Sparkles },
    { label: "Carbs", value: product.nutrition.carbohydrate, icon: Wheat },
  ];

  return (
    <>
      {!pageReady && (
        <FlavourPageLoader
          theme={theme}
          productName={product.name}
          heroSrc={assets.hero}
          onComplete={() => {
            setPageReady(true);
            setShowContent(true);
          }}
        />
      )}

      <div
        className="relative min-h-screen w-full overflow-x-hidden"
        style={{ background: theme.bgSolid }}
      >
        <Navbar />
        <AnimatedFlavourBackground theme={theme} slug={product.slug} />

        <AnimatePresence>
          {showContent && (
            <motion.div
              className="relative z-10 w-full flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* Back Nav Button */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="fixed left-6 top-6 z-50 md:left-8 md:top-8"
              >
                <Link
                  href="/#products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-5 py-3 font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[2.5px] backdrop-blur-xl transition-all hover:bg-black/80 hover:scale-105"
                  style={{ color: "#FFF6E0" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </motion.div>

              {/* HERO SECTION */}
              <section className="relative w-full max-w-[1400px] mx-auto px-6 pt-36 pb-24 md:px-10 lg:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center justify-center min-h-[90vh]">
                
                {mascots[0] && (
                  <MascotSticker
                    src={mascots[0]}
                    className="hidden lg:block -top-4 right-[38%] transform rotate-12"
                    width={90}
                    delay={0.6}
                  />
                )}

                {/* Left: Product Gallery */}
                <div className="w-full lg:w-[55%] flex gap-6 h-full items-start relative">
                  <div className="hidden md:flex flex-col gap-3 max-h-[500px] overflow-y-auto hide-scrollbar z-10">
                    {galleryImages.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-2xl border-2 overflow-hidden flex items-center justify-center p-1.5 transition-all duration-300 ${
                          activeImageIndex === idx
                            ? "border-[var(--v-gold)] scale-105 bg-white/10"
                            : "border-white/5 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${product.name} Thumbnail ${idx + 1}`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 flex flex-col items-center relative">
                    <motion.div
                      style={{ y: heroY, rotate: jarRotate, opacity: heroOpacity }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="relative w-full max-w-[500px] aspect-square rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxIndex(activeImageIndex)}
                    >
                      <div
                        className="absolute h-72 w-72 rounded-full blur-[80px] -z-10 opacity-80"
                        style={{ background: theme.glow }}
                      />
                      
                      <Image
                        src={galleryImages[activeImageIndex]}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain p-6 transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 500px"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white hover:bg-black/70 transition-colors z-20"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white hover:bg-black/70 transition-colors z-20"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </motion.div>

                    <div className="flex gap-2 mt-6 md:hidden">
                      {galleryImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeImageIndex === idx ? "w-6 bg-[var(--v-gold)]" : "w-2 bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Product Info */}
                <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left z-10 relative">
                  <span
                    style={{ color: theme.accent, borderColor: `${theme.accent}44`, backgroundColor: `${theme.accent}15` }}
                    className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-xs uppercase tracking-[3px] font-accent font-bold mb-10 border shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                  >
                    <Sparkles size={12} />
                    Premium Roasted
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-wide mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <p
                    className="text-lg uppercase tracking-[5px] font-accent font-semibold mb-10"
                    style={{ color: theme.accent }}
                  >
                    {product.flavor}
                  </p>

                  <div className="flex items-center gap-2 mb-10">
                    <div className="flex text-[#FFC107]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-sm text-white/50 font-light">(4.9 out of 5 from 124 reviews)</span>
                  </div>

                  <p className="text-lg md:text-xl text-[#FFF6E0]/70 font-light leading-loose mb-12 max-w-xl">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
                    {product.highlights.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/10 bg-white/5 px-5 py-2 font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[1.5px] backdrop-blur-xl text-[#FFF6E0] font-bold"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end gap-4 mb-12">
                    <span className="text-5xl font-black text-white">₹{product.price}</span>
                    <span className="text-2xl line-through text-white/20 mb-1">₹{product.originalPrice}</span>
                    <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1.5 rounded-full font-bold mb-1.5 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-8 relative">
                    <div className="flex items-center justify-between border border-white/10 rounded-full bg-white/5 p-1 h-14 w-full sm:w-36 backdrop-blur-xl">
                      <button
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-bold w-8 text-center text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      style={{ backgroundColor: theme.accent, color: theme.bgSolid }}
                      className="flex-1 h-14 rounded-full font-[family-name:var(--font-accent)] uppercase tracking-widest text-sm font-black flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </motion.button>
                  </div>

                  <div className="w-full max-w-md mb-12">
                    <Link href="/checkout" onClick={handleAddToCart}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-14 rounded-full border border-white/15 text-white font-[family-name:var(--font-accent)] uppercase tracking-widest text-xs font-bold hover:bg-white/5 transition-colors flex items-center justify-center"
                      >
                        Buy Now
                      </motion.button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#FFF6E0]/60 mt-10 mb-6 py-4 border-y border-white/5 w-full max-w-md">
                    <Truck size={18} style={{ color: theme.accent }} />
                    <span>Free shipping on orders above ₹500. Delivers in 2-3 days.</span>
                  </div>

                  <div className="flex gap-6 text-white/30">
                    <div className="flex items-center gap-2 text-xs">
                      <RotateCcw size={14} />
                      <span>7-Day Returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Shield size={14} />
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* BELOW HERO SECTIONS WITH EXPLICIT OUTWARD VERTICAL MARGINS */}
              <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 mb-32 relative z-10 flex flex-col items-center">
                
                {/* ─── INGREDIENTS ─── */}
                <div className="relative w-full" style={{ paddingTop: "120px", paddingBottom: "120px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  {mascots[1] && (
                    <MascotSticker
                      src={mascots[1]}
                      className="hidden lg:block -top-12 left-0 transform -rotate-12"
                      width={100}
                    />
                  )}
                  <IngredientsSection product={product} assets={assets} theme={theme} />
                </div>

                {/* ─── NUTRITION ─── */}
                <div className="relative w-full" style={{ paddingTop: "120px", paddingBottom: "120px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  {mascots[2] && (
                    <MascotSticker
                      src={mascots[2]}
                      className="hidden lg:block -top-16 right-0 transform rotate-12"
                      width={100}
                    />
                  )}
                  <NutritionSection cards={nutritionCards} theme={theme} assets={assets} />
                </div>

                {/* ─── WHY YOU'LL LOVE IT ─── */}
                <div className="relative w-full" style={{ paddingTop: "100px", paddingBottom: "100px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <WhyLoveSection product={product} theme={theme} />
                </div>

                {/* ─── LIFESTYLE / GALLERY ─── */}
                <div className="relative w-full" style={{ paddingTop: "120px", paddingBottom: "120px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <GallerySection
                    images={galleryImages}
                    lifestyle={assets.lifestyle}
                    theme={theme}
                    onOpenLightbox={setLightboxIndex}
                  />
                </div>

                {/* ─── RELATED PRODUCTS (Auto Carousel) ─── */}
                <div className="relative w-full" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
                  {mascots[4] && (
                    <MascotSticker
                      src={mascots[4]}
                      className="hidden lg:block -top-12 right-[10%] transform rotate-6"
                      width={110}
                    />
                  )}
                  <RelatedSection related={related} theme={theme} />
                </div>

                {/* ─── BOTTOM CTA ─── */}
                <div className="relative w-full" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
                  {mascots[5] && (
                    <MascotSticker
                      src={mascots[5]}
                      className="hidden lg:block -bottom-8 left-[10%] transform rotate-12"
                      width={100}
                    />
                  )}
                  <BottomCTA theme={theme} />
                </div>
              </div>

              {/* Lightbox */}
              <AnimatePresence>
                {lightboxIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-xl"
                    onClick={() => setLightboxIndex(null)}
                  >
                    <button
                      className="absolute right-6 top-6 rounded-full border border-white/20 p-3 text-white"
                      onClick={() => setLightboxIndex(null)}
                      aria-label="Close gallery"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 28 }}
                      className="relative h-[70vh] w-full max-w-4xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {galleryImages[lightboxIndex].endsWith(".mp4") ? (
                        <video
                          src={galleryImages[lightboxIndex]}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-contain rounded-2xl p-2 z-10"
                        />
                      ) : (
                        <Image
                          src={galleryImages[lightboxIndex]}
                          alt={`${product.name} gallery`}
                          fill
                          className="object-contain"
                          sizes="90vw"
                        />
                      )}
                    </motion.div>
                    <div className="absolute bottom-8 flex gap-3">
                      <button
                        className="rounded-full border border-white/20 p-3 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(
                            (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
                          );
                        }}
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        className="rounded-full border border-white/20 p-3 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
                        }}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function IngredientsSection({
  product,
  assets,
  theme,
}: {
  product: Product;
  assets: ProductAssetBundle;
  theme: ProductTheme;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="w-full py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <SectionLabel accent={theme.accent}>Ingredients</SectionLabel>
          <h2 className="mb-6 font-[family-name:var(--font-body)] text-4xl md:text-5xl font-black text-white leading-tight">
            Pure. Honest.<br />Delicious.
          </h2>
          <p className="mb-10 leading-relaxed text-[#FFF6E0]/60 font-light text-base max-w-xl">
            {product.longDescription}
          </p>
          <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full">
            {product.ingredients.map((item, i) => (
              <motion.div
                key={item}
                variants={fadeInUp}
                custom={i}
                whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.15)", boxShadow: `0 10px 30px ${theme.glow}` }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-xl transition-all duration-300"
              >
                <p className="font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[2px]" style={{ color: theme.accent }}>
                  Ingredient {i + 1}
                </p>
                <p className="mt-2 text-base font-bold text-white">
                  {item}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative aspect-square w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl"
        >
          <Image
            src={assets.ingredients ?? product.image}
            alt={`${product.name} ingredients`}
            fill
            className="object-contain p-8 transform hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}

function NutritionSection({
  cards,
  theme,
  assets,
}: {
  cards: { label: string; value: string; icon: typeof Zap }[];
  theme: ProductTheme;
  assets: ProductAssetBundle;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="w-full text-center py-0 flex flex-col items-center">
      <SectionLabel accent={theme.accent}>Nutrition Facts</SectionLabel>
      <h2 className="mb-4 font-[family-name:var(--font-body)] text-4xl md:text-5xl font-black text-white tracking-tight">
        Snack Smart. Crunch Hard.
      </h2>
      <p style={{ marginBottom: "64px" }} className="max-w-xl text-base text-[#FFF6E0]/60 leading-relaxed font-light">
        Honest metrics for mindful snacking.
      </p>

      {assets.nutrition && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="relative mx-auto mb-16 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
        >
          <Image src={assets.nutrition} alt="Nutrition label" fill className="object-contain p-4" sizes="768px" />
        </motion.div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-full grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5"
      >
        {cards.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            variants={fadeInUp}
            custom={i}
            whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(255, 255, 255, 0.15)", boxShadow: `0 10px 30px ${theme.glow}` }}
            className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl shadow-xl transition-all duration-300"
          >
            <Icon className="mx-auto mb-4 h-8 w-8" style={{ color: theme.accent }} />
            <p className="font-[family-name:var(--font-body)] text-2xl font-black text-white">
              {value}
            </p>
            <p className="mt-2.5 font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[2px]" style={{ color: theme.accent }}>
              {label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function WhyLoveSection({ product, theme }: { product: Product; theme: ProductTheme }) {
  const { ref, isInView } = useInView(0.1);
  const benefits = [
    "Roasted Not Fried",
    "High Protein",
    "No Preservatives",
    "Gluten Free",
    "Healthy Snack",
  ];

  return (
    <section ref={ref} className="w-full py-0 flex flex-col items-center">
      <div className="w-full rounded-[3rem] border border-white/10 p-12 md:p-20 backdrop-blur-xl bg-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none" />
        
        <div className="mb-16 text-center relative z-10">
          <SectionLabel accent={theme.accent}>Why You&apos;ll Love It</SectionLabel>
          <h2 className="font-[family-name:var(--font-body)] text-4xl md:text-5xl font-black text-white tracking-tight">
            Crunch Without Compromise
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-8 grid-cols-2 lg:grid-cols-5 relative z-10"
        >
          {benefits.map((benefit, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <motion.div
                key={benefit}
                variants={fadeInUp}
                custom={i}
                whileHover={{ y: -8 }}
                className="text-center flex flex-col items-center"
              >
                <div
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-xl"
                >
                  <Icon className="h-8 w-8" style={{ color: theme.accent }} />
                </div>
                <p className="font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[1.5px] font-bold text-[#FFF6E0]">
                  {benefit}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
        <p className="mt-12 text-center text-xs text-white/40 font-medium tracking-wide relative z-10">
          {product.allergenInfo}
        </p>
      </div>
    </section>
  );
}

function GallerySection({
  images,
  lifestyle,
  theme,
  onOpenLightbox,
}: {
  images: string[];
  lifestyle: string[];
  theme: ProductTheme;
  onOpenLightbox: (index: number) => void;
}) {
  const { ref, isInView } = useInView(0.08);
  const allImages = [...images, ...lifestyle].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  return (
    <section ref={ref} className="w-full text-center py-0 flex flex-col items-center">
      <SectionLabel accent={theme.accent}>Product Gallery</SectionLabel>
      <h2 className="mb-4 font-[family-name:var(--font-body)] text-4xl md:text-5xl font-black text-white tracking-tight">
        Every Angle. Every Crunch.
      </h2>
      <p style={{ marginBottom: "64px" }} className="max-w-xl text-base text-[#FFF6E0]/60 leading-relaxed font-light">
        A visual journey through flavor.
      </p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {allImages.slice(0, 9).map((src, i) => (
          <motion.button
            key={src}
            variants={fadeInUp}
            custom={i}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onOpenLightbox(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 text-left bg-white/5 shadow-2xl cursor-pointer"
          >
            <Image
              src={src}
              alt={`Gallery ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}

function RelatedSection({
  related,
  theme,
}: {
  related: Product[];
  theme: ProductTheme;
}) {
  const { ref, isInView } = useInView(0.1);
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let intervalId: NodeJS.Timeout;
    
    const startScroll = () => {
      intervalId = setInterval(() => {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: 300, behavior: "smooth" });
        }
      }, 5000);
    };

    startScroll();

    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = startScroll;

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={ref} className="w-full py-12 flex flex-col items-center">
      <SectionLabel accent={theme.accent}>Related Flavours</SectionLabel>
      <h2 className="mb-4 font-[family-name:var(--font-body)] text-4xl md:text-5xl font-black text-white tracking-tight text-center">
        More Crushes to Explore
      </h2>
      <p className="mb-16 max-w-xl text-base text-[#FFF6E0]/60 leading-relaxed font-light text-center">
        Can&apos;t settle on just one? Meet the rest of the flirty family.
      </p>

      <div className="relative w-full flex items-center">
        <button
          onClick={() => carouselRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
          className="absolute -left-4 z-20 rounded-full border border-white/10 bg-black/40 p-3 text-white hover:bg-black/70 transition-all hover:scale-105 hidden md:flex"
        >
          <ChevronLeft />
        </button>

        <motion.div
          ref={carouselRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full flex gap-6 overflow-x-auto py-4 px-2 scroll-smooth hide-scrollbar"
        >
          {related.map((item, i) => (
            <motion.div
              key={item.slug}
              variants={fadeInUp}
              custom={i}
              className="flex-shrink-0 w-[280px] sm:w-[320px]"
            >
              <div
                className="relative rounded-[2.5rem] border border-white/10 bg-[#111111]/80 backdrop-blur-xl p-6 flex flex-col h-full group hover:border-[var(--v-gold)]/20 transition-all duration-300 shadow-2xl"
              >
                <Link href={`/flavours/${item.slug}`} className="block relative aspect-square w-full p-4 mb-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="280px"
                  />
                </Link>

                <h3 className="font-[family-name:var(--font-body)] text-xl font-bold text-white group-hover:text-[var(--v-gold)] transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-xs text-white/50 uppercase tracking-widest font-[family-name:var(--font-accent)] mt-1 mb-4">
                  {item.flavor}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl font-black text-white">₹{item.price}</span>
                  <span className="text-sm line-through text-white/30">₹{item.originalPrice}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Link href={`/flavours/${item.slug}`}>
                    <span className="flex items-center justify-center h-12 w-full rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors cursor-pointer text-center">
                      Details
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      addToCart(item.slug, 1);
                    }}
                    className="flex items-center justify-center gap-1.5 h-12 w-full rounded-full bg-[var(--v-gold)] text-black text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-md"
                  >
                    <ShoppingBag size={12} />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <button
          onClick={() => carouselRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
          className="absolute -right-4 z-20 rounded-full border border-white/10 bg-black/40 p-3 text-white hover:bg-black/70 transition-all hover:scale-105 hidden md:flex"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function BottomCTA({ theme }: { theme: ProductTheme }) {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="w-full py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[900px] rounded-[3rem] border border-white/10 p-12 text-center backdrop-blur-xl md:p-16 bg-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <SectionLabel accent={theme.accent}>Still Thinking?</SectionLabel>
          <h2 className="mb-4 font-[family-name:var(--font-body)] text-4xl md:text-5xl font-black text-white tracking-tight">
            Try Our Bestseller Combo
          </h2>
          <p className="mb-10 max-w-md leading-relaxed text-[#FFF6E0]/60 font-light">
            Mix moods, build your bowl, or shop the full family of flirty flavours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#bowl-mixer-section">
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 font-[family-name:var(--font-accent)] text-[12px] font-bold uppercase tracking-[1.5px]"
                style={{ background: theme.buttonBg, color: theme.buttonText }}
              >
                Build Your Own Bowl
              </motion.span>
            </Link>
            <Link href="/#products">
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-8 py-4 font-[family-name:var(--font-accent)] text-[12px] font-bold uppercase tracking-[1.5px] backdrop-blur-md"
                style={{ borderColor: `${theme.accent}55`, color: "#FFF6E0" }}
              >
                Shop All Flavours
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
