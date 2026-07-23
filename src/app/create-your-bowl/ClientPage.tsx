"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// Note: preview image already uses priority={true}, gallery images use loading="lazy"
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LightRays from "@/components/ui/LightRays";
import { products } from "@/data/products";
import { Check, Sparkles, Save, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

// --- DATA MODELS ---

const SIZES = [
  { id: "small", name: "Small", weight: "150g", price: 149, icon: "🥣" },
  { id: "medium", name: "Medium", weight: "250g", price: 249, icon: "🥣" },
  { id: "large", name: "Large", weight: "350g", price: 349, icon: "🥣" },
  { id: "family", name: "Family Bowl", weight: "500g", price: 499, icon: "🥘" },
];

const CRUNCH_LEVELS = [
  { id: "light", name: "Light Crunch", desc: "Gentle crisp" },
  { id: "regular", name: "Regular", desc: "Perfectly roasted" },
  { id: "extra", name: "Extra Crunch", desc: "Double roasted" },
  { id: "ultra", name: "Ultra Crunch", desc: "Maximum snap" },
];

const TOPPINGS = [
  { id: "cheese", name: "Cheese Dust", price: 20, icon: "🧀" },
  { id: "mint", name: "Mint Herbs", price: 15, icon: "🌿" },
  { id: "peri", name: "Peri Peri Sprinkle", price: 25, icon: "🌶️" },
  { id: "tomato", name: "Tomato Seasoning", price: 20, icon: "🍅" },
  { id: "chilli", name: "Chilli Flakes", price: 10, icon: "🔥" },
  { id: "salt", name: "Himalayan Salt", price: 10, icon: "🧂" },
];

const PACKAGING = [
  { id: "eco", name: "Eco Pack", price: 0, icon: "♻️" },
  { id: "jar", name: "Premium Jar", price: 49, icon: "🫙" },
  { id: "travel", name: "Travel Pack", price: 29, icon: "🎒" },
  { id: "gift", name: "Luxury Gift Box", price: 99, icon: "🎁" },
];

const COMBO_IMAGES = [
  "Bold-Heart.png",
  "Butterflies-Combos.png",
  "First-Crush.png",
  "Forever-Yours.png",
  "Match-Made.png",
  "Mixed-Signals.png",
  "Spicy-and-Romance.png",
  "The-Date-Night.png",
];

// ─── Shared card class builders ───────────────────────────────────────────────
const cardBase =
  "relative rounded-2xl border transition-all duration-300 cursor-pointer group";
const cardIdle =
  "border-white/[0.06] bg-[#111111]/50 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]";
const cardActive =
  "border-v-gold bg-v-gold/10 shadow-[0_0_24px_rgba(212,184,122,0.12)]";

export default function CreateYourBowl() {
  const { addCustomToCart } = useCart();
  const [bowlName, setBowlName] = useState("");
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [flavourRatios, setFlavourRatios] = useState<Record<string, number>>({});
  const [selectedCrunch, setSelectedCrunch] = useState(CRUNCH_LEVELS[1]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState(PACKAGING[0]);

  const handleAddToCart = () => {
    const name = bowlName.trim() || "Custom Makhana Bowl";
    const slug = `custom-bowl-${Date.now()}`;
    const flavorText = selectedFlavours.length > 0 
      ? selectedFlavours.map(slug => products.find(p => p.slug === slug)?.name || slug).join(" + ")
      : "Plain Roasted";

    addCustomToCart({
      slug,
      name,
      price: totalPrice,
      image: `/assets/combos/${previewImage}`,
      flavor: `${flavorText} (${selectedCrunch.name})`,
    });
  };

  const previewImage = useMemo(() => {
    if (selectedFlavours.length > 0) {
      const idx = selectedFlavours.length % COMBO_IMAGES.length;
      return COMBO_IMAGES[idx];
    }
    return COMBO_IMAGES[0];
  }, [selectedFlavours]);

  const { totalPrice, totalProtein, totalCalories } = useMemo(() => {
    let price = selectedSize.price;
    selectedToppings.forEach((t) => {
      const topping = TOPPINGS.find((x) => x.id === t);
      if (topping) price += topping.price;
    });
    price += selectedPackaging.price;
    const weightGrams = parseInt(selectedSize.weight);
    return {
      totalPrice: price,
      totalProtein: Math.round(weightGrams * 0.12),
      totalCalories: Math.round(weightGrams * 4.5),
    };
  }, [selectedSize, selectedToppings, selectedPackaging]);

  const handleFlavourToggle = (slug: string) => {
    setSelectedFlavours((prev) => {
      const isSelected = prev.includes(slug);
      let newFlavours;
      if (isSelected) {
        newFlavours = prev.filter((f) => f !== slug);
        const newRatios = { ...flavourRatios };
        delete newRatios[slug];
        setFlavourRatios(newRatios);
      } else {
        newFlavours = [...prev, slug];
        setFlavourRatios((prev) => ({ ...prev, [slug]: 50 }));
      }
      return newFlavours;
    });
  };

  const handleToppingToggle = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const suggestion = useMemo(() => {
    if (selectedFlavours.includes("love-bite"))
      return "Cheese pairs incredibly well with Peri Peri.";
    if (selectedFlavours.includes("green-flag"))
      return "Try adding a pinch of Himalayan Salt topping.";
    if (selectedFlavours.length > 2)
      return "Customers love this complex combination!";
    return "Mix 2-3 flavours for the ultimate taste profile.";
  }, [selectedFlavours]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">

        {/* ── GLOBAL BACKGROUND ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#D4AF37"
            raysSpeed={0.5}
            lightSpread={0.6}
            rayLength={1.8}
            pulsating={true}
            fadeDistance={1.5}
            saturation={0.3}
          />
          {/* Warm gold radial behind hero */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-v-gold/[0.04] rounded-full blur-[160px]" />
          {/* Warm gold radial behind builder */}
          <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] bg-v-gold/[0.04] rounded-full blur-[140px]" />
          <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-v-gold/[0.03] rounded-full blur-[130px]" />
          {/* Warm gold radial behind gallery */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-v-gold/[0.04] rounded-full blur-[160px]" />
          {/* Floating particles */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(212,184,122,0.3) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 pb-32" style={{ paddingTop: "220px" }}>

          {/* ════════════════════════════════════════
              MASTER CONTAINER — matches homepage
              ════════════════════════════════════════ */}
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center">

            {/* ── HERO ── */}
            {/* ── HERO ── centered, below navbar */}
            <div className="w-full flex flex-col items-center text-center mb-[120px]">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-v-gold/10 text-v-gold text-[10px] uppercase tracking-[4px] font-accent font-bold mb-7 border border-v-gold/20 shadow-[0_0_20px_rgba(212,184,122,0.08)]"
              >
                <Sparkles size={12} />
                Personalise Your Bowl
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.6rem] sm:text-5xl md:text-[3.75rem] font-black font-accent text-v-gold uppercase tracking-[4px] drop-shadow-2xl leading-[1.05] mb-6 max-w-3xl w-full"
              >
                Craft Your Perfect Bowl
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/55 text-base md:text-lg font-light tracking-[0.5px] leading-relaxed max-w-2xl"
              >
                Create your own personalised makhana bowl by choosing your favourite flavours.
                Every bowl is made fresh, just the way you like it.
              </motion.p>
            </div>

            {/* ════════════════════════════════════════
                TWO-COLUMN BUILDER LAYOUT
                Left 48% | Right 52% | Gap 72px
                ════════════════════════════════════════ */}
            <div className="flex flex-col lg:flex-row gap-[72px] items-start w-full mb-[120px]">

              {/* ── LEFT COLUMN (48%) ── */}
              <div className="w-full lg:w-[48%] flex flex-col gap-8 lg:sticky lg:top-32">

                {/* Product Preview Stage */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full aspect-square bg-[#0e0e0e]/60 border border-white/[0.06] rounded-[2rem] flex items-center justify-center p-8 backdrop-blur-xl overflow-hidden group shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                >
                  {/* Stage inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-v-gold/[0.08] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-v-gold/[0.06] rounded-full blur-[80px] pointer-events-none" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={previewImage}
                      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        y: [0, -10, 0],
                      }}
                      exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
                      transition={{
                        opacity: { duration: 0.45 },
                        scale: { duration: 0.45 },
                        y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                      }}
                      className="relative w-[82%] h-[82%]"
                    >
                      <Image
                        src={`/assets/combos/${previewImage}`}
                        alt="Your Custom Bowl"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* AI Suggestion Badge */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={suggestion}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[88%] bg-black/90 backdrop-blur-2xl border border-v-gold/20 rounded-full py-2.5 px-5 flex items-center gap-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-20"
                    >
                      <Sparkles size={12} className="text-v-gold animate-pulse shrink-0" />
                      <span className="text-[11px] text-white/80 tracking-[0.5px] font-medium whitespace-nowrap">
                        {suggestion}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Price & Macros Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-[#0e0e0e]/80 border border-white/[0.06] rounded-[1.75rem] p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col gap-8"
                >
                  {/* Price row */}
                  <div className="flex justify-between items-start pb-8 border-b border-white/[0.06]">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-white/35 text-[9px] uppercase tracking-[3px] font-accent">
                        Total Price
                      </span>
                      <div className="text-5xl font-black text-v-gold font-accent tracking-tight leading-none">
                        ₹{totalPrice}
                      </div>
                    </div>
                    {bowlName && (
                      <div className="text-right max-w-[200px] flex flex-col gap-1 pt-1">
                        <span className="text-v-gold text-[9px] uppercase tracking-[2px] font-medium">
                          Your Creation
                        </span>
                        <span className="text-white font-bold truncate text-sm leading-tight">
                          {bowlName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Macro stats */}
                  <div className="grid grid-cols-3 gap-0 text-center">
                    <div className="flex flex-col gap-2">
                      <span className="text-white/35 text-[9px] uppercase tracking-[2px]">Weight</span>
                      <span className="text-white font-black text-xl tracking-tight">
                        {selectedSize.weight}
                      </span>
                    </div>
                    <div className="border-x border-white/[0.06] flex flex-col gap-2">
                      <span className="text-white/35 text-[9px] uppercase tracking-[2px]">Protein</span>
                      <span className="text-white font-black text-xl tracking-tight">
                        {totalProtein}g
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/35 text-[9px] uppercase tracking-[2px]">Calories</span>
                      <span className="text-white font-black text-xl tracking-tight">
                        {totalCalories}
                      </span>
                    </div>
                  </div>

                  {/* Selected summary pills */}
                  {(selectedFlavours.length > 0 || selectedToppings.length > 0) && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.05]">
                      {selectedFlavours.slice(0, 3).map((slug) => {
                        const p = products.find((x) => x.slug === slug);
                        return (
                          <span
                            key={slug}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 text-[10px] tracking-wide"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: p?.color }}
                            />
                            {p?.name}
                          </span>
                        );
                      })}
                      {selectedFlavours.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 text-[10px]">
                          +{selectedFlavours.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ── RIGHT COLUMN (52%) ── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[52%] flex flex-col gap-10"
              >

                {/* Step label helper */}
                {/* ── NAME YOUR CREATION ── */}
                <section className="flex flex-col gap-5 w-full">
                  <StepLabel>Name Your Creation</StepLabel>
                  <input
                    type="text"
                    aria-label="Name Your Creation"
                    placeholder="e.g. My Power Crunch Mix"
                    value={bowlName}
                    onChange={(e) => setBowlName(e.target.value)}
                    className="w-full bg-[#111111]/60 border border-white/[0.06] rounded-2xl px-8 py-6 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-v-gold/30 hover:border-white/10 transition-all duration-300 backdrop-blur-md"
                  />
                </section>

                {/* ── STEP 1: SIZE ── */}
                <section className="flex flex-col gap-6 w-full">
                  <StepLabel>Step 1: Choose Size</StepLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`${cardBase} p-5 flex flex-col justify-between min-h-[148px] ${
                          selectedSize.id === size.id ? cardActive : cardIdle
                        }`}
                      >
                        <span className="text-2xl block mb-3">{size.icon}</span>
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-bold text-white text-sm leading-tight">
                            {size.name}
                          </h4>
                          <p className="text-white/40 text-[10px] mb-2">{size.weight}</p>
                          <span className="text-v-gold font-black text-sm tracking-tight">
                            ₹{size.price}
                          </span>
                        </div>
                        {selectedSize.id === size.id && (
                          <div className="absolute top-3.5 right-3.5 text-v-gold">
                            <Check size={13} strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* ── STEP 2: FLAVOURS ── */}
                <section className="flex flex-col gap-6 w-full">
                  <StepLabel>Step 2: Choose Flavours</StepLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <button
                        key={product.slug}
                        onClick={() => handleFlavourToggle(product.slug)}
                        className={`${cardBase} p-5 flex flex-col items-center gap-4 min-h-[160px] justify-center ${
                          selectedFlavours.includes(product.slug)
                            ? cardActive
                            : cardIdle
                        }`}
                      >
                        <div className="w-[72px] h-[72px] relative flex items-center justify-center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="72px"
                            className="object-contain drop-shadow-xl"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                          <h4 className="font-bold text-white text-xs tracking-[0.5px] text-center leading-tight">
                            {product.name}
                          </h4>
                          <span
                            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{
                              backgroundColor: product.color,
                              color: product.color,
                            }}
                          />
                        </div>
                        {selectedFlavours.includes(product.slug) && (
                          <div className="absolute top-3 right-3 text-v-gold bg-black/60 rounded-full p-1 backdrop-blur-sm">
                            <Check size={11} strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* ── STEP 3: MIX PERCENTAGES (conditional) ── */}
                <AnimatePresence>
                  {selectedFlavours.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden w-full flex flex-col gap-6"
                    >
                      <StepLabel>Step 3: Mix Percentages</StepLabel>
                      <div className="flex flex-col gap-7 bg-[#0e0e0e]/80 border border-white/[0.06] rounded-2xl p-8 backdrop-blur-md shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                        {selectedFlavours.map((slug) => {
                          const p = products.find((x) => x.slug === slug);
                          const ratio = flavourRatios[slug] || 50;
                          return (
                            <div key={slug} className="flex flex-col gap-3">
                              <div className="flex justify-between items-center">
                                <span className="font-bold tracking-[0.5px] text-white text-xs flex items-center gap-2">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                                    style={{
                                      background: p?.color,
                                      color: p?.color,
                                    }}
                                  />
                                  {p?.name}
                                </span>
                                <span className="text-v-gold font-black font-accent text-xs tracking-[0.5px]">
                                  {ratio}%
                                </span>
                              </div>
                              <input
                                type="range"
                                aria-label={`Mix percentage for ${p?.name}`}
                                min="10"
                                max="100"
                                step="5"
                                value={ratio}
                                onChange={(e) =>
                                  setFlavourRatios((prev) => ({
                                    ...prev,
                                    [slug]: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full accent-v-gold h-[3px] bg-white/10 rounded-full appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* ── STEP 4: CRUNCH LEVEL ── */}
                <section className="flex flex-col gap-6 w-full">
                  <StepLabel>Step 4: Crunch Level</StepLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {CRUNCH_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedCrunch(level)}
                        className={`${cardBase} p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] text-center ${
                          selectedCrunch.id === level.id ? cardActive : cardIdle
                        }`}
                      >
                        <h4 className="font-bold text-white text-xs tracking-[0.5px] leading-tight">
                          {level.name}
                        </h4>
                        <p className="text-white/40 text-[9px] uppercase tracking-[1px]">
                          {level.desc}
                        </p>
                        {selectedCrunch.id === level.id && (
                          <div className="absolute top-3 right-3 text-v-gold">
                            <Check size={11} strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* ── STEP 5: TOPPINGS ── */}
                <section className="flex flex-col gap-6 w-full">
                  <StepLabel>Step 5: Extra Toppings</StepLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {TOPPINGS.map((topping) => (
                      <button
                        key={topping.id}
                        onClick={() => handleToppingToggle(topping.id)}
                        className={`${cardBase} p-5 flex items-center gap-4 min-h-[88px] ${
                          selectedToppings.includes(topping.id)
                            ? cardActive
                            : cardIdle
                        }`}
                      >
                        <span className="text-2xl drop-shadow-lg shrink-0">
                          {topping.icon}
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <h4 className="font-bold text-white text-[12px] tracking-[0.4px] leading-tight">
                            {topping.name}
                          </h4>
                          <span className="text-v-gold font-accent text-xs font-semibold">
                            +₹{topping.price}
                          </span>
                        </div>
                        {selectedToppings.includes(topping.id) && (
                          <div className="absolute top-2.5 right-2.5 text-v-gold">
                            <Check size={11} strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* ── STEP 6: PACKAGING ── */}
                <section className="flex flex-col gap-6 w-full">
                  <StepLabel>Step 6: Packaging</StepLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {PACKAGING.map((pack) => (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackaging(pack)}
                        className={`${cardBase} p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] text-center ${
                          selectedPackaging.id === pack.id ? cardActive : cardIdle
                        }`}
                      >
                        <span className="text-3xl drop-shadow-xl">{pack.icon}</span>
                        <div className="flex flex-col gap-0.5 items-center">
                          <h4 className="font-bold text-white text-xs tracking-[0.5px]">
                            {pack.name}
                          </h4>
                          <span className="text-v-gold text-xs tracking-[0.5px] font-accent font-semibold">
                            {pack.price === 0 ? "Free" : `+₹${pack.price}`}
                          </span>
                        </div>
                        {selectedPackaging.id === pack.id && (
                          <div className="absolute top-3.5 right-3.5 text-v-gold">
                            <Check size={13} strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* ── CTA BUTTONS ── */}
                <section className="mt-6 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-[2] relative overflow-hidden bg-gradient-to-r from-v-gold via-[#e8c96a] to-v-gold bg-[length:200%_auto] text-v-black font-accent font-black uppercase tracking-[2px] py-6 rounded-2xl shadow-[0_0_40px_rgba(212,184,122,0.2)] hover:shadow-[0_0_60px_rgba(212,184,122,0.3)] hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-sm"
                  >
                    <ShoppingBag size={18} />
                    Add Bowl to Cart
                  </button>
                  <button className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white font-accent font-bold uppercase tracking-[2px] py-6 rounded-2xl hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-sm">
                    <Save size={18} />
                    Save
                  </button>
                </section>
              </motion.div>
            </div>

            {/* ════════════════════════════════════════
                INSPIRATION GALLERY
                ════════════════════════════════════════ */}
            <div className="w-full border-t border-white/[0.05] pt-[80px]">

              {/* Gallery Header */}
              <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col gap-5">
                <motion.span
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center gap-2 py-1.5 px-5 rounded-full bg-v-gold/10 text-v-gold text-[10px] uppercase tracking-[4px] font-accent font-bold border border-v-gold/20 shadow-[0_0_20px_rgba(212,184,122,0.08)]"
                >
                  <Sparkles size={12} />
                  Chef Curated
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.05 }}
                  className="text-3xl md:text-[2.75rem] font-black font-accent text-white uppercase tracking-[3px] leading-tight"
                >
                  Inspiration{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0D4] to-v-gold">
                    Gallery
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-white/50 text-base font-light leading-relaxed"
                >
                  Explore some of our most popular combinations curated by our
                  chefs and snack lovers.
                </motion.p>
              </div>

              {/* Desktop / Tablet Grid */}
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {COMBO_IMAGES.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.7,
                      delay: (i % 4) * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative rounded-[1.5rem] overflow-hidden group bg-[#0e0e0e]/80 border border-white/[0.06] shadow-xl cursor-pointer aspect-square flex items-center justify-center p-6 hover:border-v-gold/25 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-v-gold/[0.05] to-transparent opacity-60 pointer-events-none" />
                    <div className="relative w-4/5 h-4/5">
                      <Image
                        src={`/assets/combos/${img}`}
                        alt={img.replace(".png", "").replace(/-/g, " ")}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                        className="object-contain transform group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 rounded-[1.5rem]">
                      <span className="text-v-gold font-accent font-black uppercase tracking-[2px] text-xs">
                        {img.replace(".png", "").replace(/-/g, " ")}
                      </span>
                      <span className="text-[9px] text-white/50 tracking-[1.5px] mt-0.5 uppercase">
                        Preset Recipe
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Horizontal Carousel */}
              <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 hide-scrollbar">
                {COMBO_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden group bg-[#0e0e0e]/80 border border-white/[0.06] shadow-xl cursor-pointer aspect-square flex items-center justify-center p-5 shrink-0 w-[72vw] snap-start hover:border-v-gold/25 transition-all duration-500"
                  >
                    <div className="relative w-4/5 h-4/5">
                      <Image
                        src={`/assets/combos/${img}`}
                        alt={img.replace(".png", "").replace(/-/g, " ")}
                        fill
                        sizes="72vw"
                        loading="lazy"
                        className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col">
                      <span className="text-v-gold font-accent font-black uppercase tracking-[2px] text-[10px]">
                        {img.replace(".png", "").replace(/-/g, " ")}
                      </span>
                      <span className="text-[9px] text-white/50 tracking-[1px] mt-0.5 uppercase">
                        Preset Recipe
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          {/* /master container */}
        </div>
        {/* /page wrapper */}
      </div>

      <Footer />
    </>
  );
}

// ─── Shared Step Label Component ──────────────────────────────────────────────
function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-[10px] flex items-center gap-3">
      <span className="w-8 h-[1px] bg-v-gold/40 block shrink-0" />
      {children}
    </h3>
  );
}
