"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LightRays from "@/components/ui/LightRays";
import { products } from "@/data/products";
import { Check, Info, Sparkles, Plus, Minus, ArrowRight, Share2, Save, ShoppingBag } from "lucide-react";

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

export default function CreateYourBowl() {
  const [bowlName, setBowlName] = useState("");
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [flavourRatios, setFlavourRatios] = useState<Record<string, number>>({});
  const [selectedCrunch, setSelectedCrunch] = useState(CRUNCH_LEVELS[1]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState(PACKAGING[0]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  const [previewImage, setPreviewImage] = useState(COMBO_IMAGES[0]);

  // Update live preview based on selected flavours (random combo image for now)
  useEffect(() => {
    if (selectedFlavours.length > 0) {
      const idx = selectedFlavours.length % COMBO_IMAGES.length;
      setPreviewImage(COMBO_IMAGES[idx]);
    } else {
      setPreviewImage(COMBO_IMAGES[0]);
    }
  }, [selectedFlavours]);

  // Calculate Macros and Price
  useEffect(() => {
    let price = selectedSize.price;
    selectedToppings.forEach(t => {
      const topping = TOPPINGS.find(x => x.id === t);
      if (topping) price += topping.price;
    });
    price += selectedPackaging.price;
    setTotalPrice(price);

    // Mock calculations based on weight
    const weightGrams = parseInt(selectedSize.weight);
    setTotalProtein(Math.round(weightGrams * 0.12)); // approx 12g per 100g
    setTotalCalories(Math.round(weightGrams * 4.5));
  }, [selectedSize, selectedFlavours, flavourRatios, selectedToppings, selectedPackaging]);

  const handleFlavourToggle = (slug: string) => {
    setSelectedFlavours(prev => {
      const isSelected = prev.includes(slug);
      let newFlavours;
      if (isSelected) {
        newFlavours = prev.filter(f => f !== slug);
        const newRatios = { ...flavourRatios };
        delete newRatios[slug];
        setFlavourRatios(newRatios);
      } else {
        newFlavours = [...prev, slug];
        setFlavourRatios(prev => ({ ...prev, [slug]: 50 })); // Default 50 slider
      }
      return newFlavours;
    });
  };

  const handleToppingToggle = (id: string) => {
    setSelectedToppings(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // AI Suggestion mock
  const [suggestion, setSuggestion] = useState("Mix 2-3 flavours for the ultimate taste profile.");
  useEffect(() => {
    if (selectedFlavours.includes("love-bite")) setSuggestion("Cheese pairs incredibly well with Peri Peri.");
    else if (selectedFlavours.includes("green-flag")) setSuggestion("Try adding a pinch of Himalayan Salt topping.");
    else if (selectedFlavours.length > 2) setSuggestion("Customers love this complex combination!");
    else setSuggestion("Mix 2-3 flavours for the ultimate taste profile.");
  }, [selectedFlavours]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 overflow-hidden relative">
        
        {/* GLOBAL BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#D4AF37"
            raysSpeed={1}
            lightSpread={0.8}
            rayLength={1.5}
            pulsating={true}
            fadeDistance={1.2}
            saturation={0.5}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        {/* HERO SECTION */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center py-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black font-accent text-v-gold uppercase tracking-[8px] mb-6 drop-shadow-2xl"
          >
            Craft Your<br/>Perfect Bowl
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto tracking-[1px] leading-relaxed"
          >
            Create your own personalised makhana bowl by choosing your favourite flavours. Every bowl is made fresh, just the way you like it.
          </motion.p>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* LEFT: LIVE 3D PREVIEW (STICKY) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 w-full flex flex-col items-center">
              
              {/* Product Preview Stage */}
              <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-v-gold/20 to-black rounded-full blur-[100px] opacity-30 -z-10" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewImage}
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -10, 0] }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ 
                      opacity: { duration: 0.5 },
                      scale: { duration: 0.5 },
                      y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                    }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={`/assets/combos/${previewImage}`}
                      alt="Your Custom Bowl"
                      fill
                      priority
                      className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* AI Suggestion Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={suggestion}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-black/80 backdrop-blur-xl border border-v-gold/30 rounded-full py-3 px-6 flex items-center gap-3 shadow-[0_10px_30px_rgba(212,184,122,0.15)] z-20"
                >
                  <Sparkles size={14} className="text-v-gold animate-pulse" />
                  <span className="text-xs text-white/80 tracking-[1px]">{suggestion}</span>
                </motion.div>
              </div>

              {/* Live Price & Macros Card */}
              <div className="mt-16 w-full max-w-[400px] bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
                <div className="mb-6 border-b border-white/10 pb-6 flex justify-between items-end">
                  <div>
                    <h4 className="text-white/40 text-[10px] uppercase tracking-[3px] mb-2 font-accent">Total Price</h4>
                    <div className="text-5xl font-black text-v-gold font-accent tracking-[2px]">
                      ₹{totalPrice}
                    </div>
                  </div>
                  {bowlName && (
                    <div className="text-right max-w-[150px]">
                      <span className="text-v-gold text-[10px] uppercase tracking-[2px] block mb-1">Your Creation</span>
                      <span className="text-white font-bold truncate block">{bowlName}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="block text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Weight</span>
                    <span className="text-white font-bold text-lg">{selectedSize.weight}</span>
                  </div>
                  <div className="border-x border-white/10">
                    <span className="block text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Protein</span>
                    <span className="text-white font-bold text-lg">{totalProtein}g</span>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Calories</span>
                    <span className="text-white font-bold text-lg">{totalCalories}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: CONFIGURATOR STEPS */}
          <div className="lg:col-span-7 pb-32">
            
            {/* Custom Name */}
            <section className="mb-16">
              <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-v-gold block"></span> Name Your Creation
              </h3>
              <input 
                type="text" 
                placeholder="e.g. My Power Crunch Mix" 
                value={bowlName}
                onChange={(e) => setBowlName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-xl text-white placeholder:text-white/20 focus:outline-none focus:border-v-gold/50 transition-colors backdrop-blur-md"
              />
            </section>

            {/* Step 1: Size */}
            <section className="mb-16">
              <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-v-gold block"></span> Step 1: Choose Size
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SIZES.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                      selectedSize.id === size.id 
                        ? "border-v-gold bg-v-gold/10 shadow-[0_0_20px_rgba(212,184,122,0.15)] scale-[1.02]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl mb-3 block">{size.icon}</span>
                    <h4 className="font-bold text-white mb-1 tracking-[1px]">{size.name}</h4>
                    <p className="text-white/40 text-[11px] mb-3">{size.weight}</p>
                    <span className="text-v-gold font-bold text-sm tracking-[1px]">₹{size.price}</span>
                    
                    {selectedSize.id === size.id && (
                      <div className="absolute top-4 right-4 text-v-gold">
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Flavours */}
            <section className="mb-16">
              <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-v-gold block"></span> Step 2: Choose Flavours
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(product => (
                  <button
                    key={product.slug}
                    onClick={() => handleFlavourToggle(product.slug)}
                    className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${
                      selectedFlavours.includes(product.slug)
                        ? "border-v-gold bg-v-gold/10 shadow-[0_0_20px_rgba(212,184,122,0.15)] scale-[1.02]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-[1.01]"
                    }`}
                  >
                    <div className="w-24 h-24 relative mb-4">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                    <h4 className="font-bold text-white text-sm text-center mb-2 tracking-[1px]">{product.name}</h4>
                    <span 
                      className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
                      style={{ backgroundColor: product.color, color: product.color }}
                    ></span>

                    {selectedFlavours.includes(product.slug) && (
                      <div className="absolute top-3 right-3 text-v-gold bg-black/40 rounded-full p-1 backdrop-blur-sm">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Mix Percentages */}
            <AnimatePresence>
              {selectedFlavours.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-16 overflow-hidden"
                >
                  <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-v-gold block"></span> Step 3: Mix Percentages
                  </h3>
                  <div className="space-y-6 bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                    {selectedFlavours.map(slug => {
                      const p = products.find(x => x.slug === slug);
                      const ratio = flavourRatios[slug] || 50;
                      return (
                        <div key={slug} className="flex flex-col gap-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold tracking-[1px] text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ background: p?.color, color: p?.color }}></span>
                              {p?.name}
                            </span>
                            <span className="text-v-gold font-bold font-accent tracking-[1px]">{ratio}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            step="5"
                            value={ratio}
                            onChange={(e) => setFlavourRatios(prev => ({...prev, [slug]: parseInt(e.target.value)}))}
                            className="w-full accent-v-gold h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Step 4: Crunch Level */}
            <section className="mb-16">
              <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-v-gold block"></span> Step 4: Crunch Level
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CRUNCH_LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedCrunch(level)}
                    className={`relative p-5 rounded-2xl border text-center transition-all duration-300 ${
                      selectedCrunch.id === level.id 
                        ? "border-v-gold bg-v-gold/10 scale-[1.02] shadow-[0_0_20px_rgba(212,184,122,0.15)]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <h4 className="font-bold text-white mb-1 tracking-[1px] leading-tight">{level.name}</h4>
                    <p className="text-white/40 text-[9px] uppercase tracking-[1px] mt-2">{level.desc}</p>
                    
                    {selectedCrunch.id === level.id && (
                      <div className="absolute top-2 right-2 text-v-gold">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 5: Toppings */}
            <section className="mb-16">
              <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-v-gold block"></span> Step 5: Extra Toppings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TOPPINGS.map(topping => (
                  <button
                    key={topping.id}
                    onClick={() => handleToppingToggle(topping.id)}
                    className={`relative p-4 flex items-center gap-4 rounded-2xl border text-left transition-all duration-300 ${
                      selectedToppings.includes(topping.id)
                        ? "border-v-gold bg-v-gold/10 shadow-[0_0_20px_rgba(212,184,122,0.15)] scale-[1.02]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-[1.01]"
                    }`}
                  >
                    <span className="text-2xl drop-shadow-lg">{topping.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-[13px] tracking-[1px] leading-tight mb-1">{topping.name}</h4>
                      <span className="text-v-gold font-accent text-xs tracking-[1px]">+₹{topping.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 6: Packaging */}
            <section className="mb-16">
              <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-v-gold block"></span> Step 6: Packaging
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {PACKAGING.map(pack => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPackaging(pack)}
                    className={`relative p-6 flex flex-col items-center justify-center gap-3 rounded-2xl border text-center transition-all duration-300 ${
                      selectedPackaging.id === pack.id 
                        ? "border-v-gold bg-v-gold/10 scale-[1.02] shadow-[0_0_20px_rgba(212,184,122,0.15)]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-[1.01]"
                    }`}
                  >
                    <span className="text-4xl drop-shadow-xl">{pack.icon}</span>
                    <h4 className="font-bold text-white text-sm tracking-[1px]">{pack.name}</h4>
                    <span className="text-v-gold text-xs tracking-[1px] font-accent">{pack.price === 0 ? "Free" : `+₹${pack.price}`}</span>
                    
                    {selectedPackaging.id === pack.id && (
                      <div className="absolute top-3 right-3 text-v-gold">
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Final Actions */}
            <section className="mt-20 flex flex-col sm:flex-row gap-6 border-t border-white/10 pt-10">
              <button className="flex-1 bg-gradient-to-r from-v-gold to-[#e1c564] text-black font-accent font-black uppercase tracking-[2px] py-6 rounded-2xl shadow-[0_0_30px_rgba(212,184,122,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <ShoppingBag size={20} />
                Add Bowl to Cart
              </button>
              <button className="px-8 bg-white/5 border border-white/20 text-white font-accent font-bold uppercase tracking-[2px] py-6 rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <Save size={20} />
                Save
              </button>
            </section>

          </div>
        </div>
        
        {/* PREMIUM MASONRY GALLERY */}
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 mt-32 border-t border-white/10 pt-32">
          <h2 className="text-4xl md:text-5xl font-black font-accent text-white uppercase tracking-[4px] text-center mb-16">
            Inspiration <span className="text-v-gold">Gallery</span>
          </h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {COMBO_IMAGES.map((img, i) => (
              <div key={i} className="relative break-inside-avoid rounded-3xl overflow-hidden group bg-white/5 border border-white/10 shadow-xl cursor-pointer">
                <div className="relative w-full" style={{ paddingBottom: i % 2 === 0 ? "100%" : "125%" }}>
                  <Image 
                    src={`/assets/combos/${img}`} 
                    alt={`Combo ${i}`} 
                    fill 
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-v-gold font-accent font-bold uppercase tracking-[2px] text-sm">
                      {img.replace('.png', '').replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
