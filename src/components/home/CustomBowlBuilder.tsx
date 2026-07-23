"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const PREMIUM_COMBOS = [
  {
    id: "bold-hearts",
    title: "Bold Hearts",
    description: "Red Flag + Green Flag + Blush. Bold flavors, real connections.",
    image: "/assets/combos/bold-heart.png",
    flavors: "Peri Peri • Mint • Tangy Tomato",
    badge: "POPULAR",
    badgeColor: "from-red-600 to-red-400",
    count: "3 Flavors",
    price: "₹449",
    delay: 0.1
  },
  {
    id: "mixed-signals",
    title: "Mixed Signals",
    description: "Red Flag + Green Flag. Two flavors, total chemistry!",
    image: "/assets/combos/mixed-signals.png",
    flavors: "Peri Peri • Mint",
    badge: "TRENDING",
    badgeColor: "from-emerald-600 to-emerald-400",
    count: "2 Flavors",
    price: "₹349",
    delay: 0.15
  },
  {
    id: "spice-romance",
    title: "Spice \u0026 Romance",
    description: "Red Flag + Blush + Love Bite. Bold flavors, perfect together.",
    image: "/assets/combos/spicy-romance.png",
    flavors: "Peri Peri • Tangy Tomato • Cheese",
    badge: "HOT",
    badgeColor: "from-orange-600 to-orange-400",
    count: "3 Flavors",
    price: "₹449",
    delay: 0.2
  },
  {
    id: "butterflies",
    title: "Butterflies",
    description: "Crush Me + Blush. The first look, the first smile, the first blush.",
    image: "/assets/combos/butterflies.png",
    flavors: "Classic Salted • Tangy Tomato",
    badge: "SWEET",
    badgeColor: "from-pink-500 to-pink-400",
    count: "2 Flavors",
    price: "₹349",
    delay: 0.25
  },
  {
    id: "date-night",
    title: "The Date Night",
    description: "Crush Me + Red Flag + Love Bite. Perfect company, perfect flavors.",
    image: "/assets/combos/date-night.png",
    flavors: "Classic Salted • Peri Peri • Cheese",
    badge: "CHEF\u0027S PICK",
    badgeColor: "from-rose-600 to-rose-400",
    count: "3 Flavors",
    price: "₹449",
    delay: 0.3
  },
  {
    id: "forever-yours",
    title: "Forever Yours",
    description: "Soulmate + Love Bite. Two flavors, one forever.",
    image: "/assets/combos/forever-yours.png",
    flavors: "Cream \u0026 Onion • Cheese",
    badge: "ROMANTIC",
    badgeColor: "from-purple-600 to-purple-400",
    count: "2 Flavors",
    price: "₹349",
    delay: 0.35
  },
  {
    id: "first-crush",
    title: "First Crush",
    description: "Green Flag + Crush Me + Soulmate. The perfect beginning.",
    image: "/assets/combos/first-crush.png",
    flavors: "Mint • Classic Salted • Cream \u0026 Onion",
    badge: "NEW",
    badgeColor: "from-fuchsia-600 to-fuchsia-400",
    count: "3 Flavors",
    price: "₹449",
    delay: 0.4
  },
  {
    id: "match-made",
    title: "Match Made",
    description: "Crush Me + Soulmate + Love Bite. Perfect flavors, perfect together.",
    image: "/assets/combos/match-made.png",
    flavors: "Classic Salted • Cream \u0026 Onion • Cheese",
    badge: "BEST SELLER",
    badgeColor: "from-[var(--v-gold)] to-yellow-600",
    count: "3 Flavors",
    price: "₹449",
    delay: 0.45
  }
];

export default function CustomBowlBuilder() {
  const { addCustomToCart } = useCart();

  const handleAddCombo = (combo: typeof PREMIUM_COMBOS[0]) => {
    addCustomToCart({
      slug: combo.id,
      name: combo.title,
      price: parseInt(combo.price.replace("₹", "")),
      image: combo.image,
      flavor: combo.flavors,
    });
  };

  return (
    <section id="bowl-mixer-section" className="relative w-full min-h-screen py-32 overflow-hidden flex flex-col items-center justify-center bg-[#050505]">
      
      {/* Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2a1a00] rounded-full blur-[150px] opacity-60 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#1a0a00] rounded-full blur-[150px] opacity-80 mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[var(--v-gold)] rounded-full blur-[200px] opacity-10 mix-blend-screen" />
      </div>

      {/* Floating Particles (Soft ambient) */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(212, 184, 122, 0.2) 1px, transparent 1px), radial-gradient(circle at 90% 80%, rgba(212, 184, 122, 0.15) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Texture Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          zIndex: -5,
          pointerEvents: "none",
        }}
      />

      {/* 
        ========================================
        MAIN CONTENT CONTAINER 
        (Perfectly centered, max 1400px)
        ========================================
      */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 relative z-10 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-[var(--v-gold)]/10 text-[var(--v-gold)] text-[10px] sm:text-xs uppercase tracking-[4px] font-accent font-bold mb-6 border border-[var(--v-gold)]/20 shadow-[0_0_20px_rgba(212,184,122,0.1)]">
              <Sparkles size={14} />
              Build Your Mix
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
              Find Your <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0D4] to-[var(--v-gold)]">
                Perfect Mix.
              </span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              Choose one of our signature bowls or create your own personalised makhana experience.
            </p>
          </motion.div>
        </div>

        {/* 
          ========================================
          FOUR PREMIUM COMBO BOWLS
          ========================================
        */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-32">
          {PREMIUM_COMBOS.map((combo) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: combo.delay, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative h-full w-full rounded-[1.5rem] bg-[#111111]/80 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-500 ease-out hover:border-[var(--v-gold)]/30 hover:bg-[#151515]/90 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-1">
                
                {/* Glow Effect */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[120%] aspect-square bg-[var(--v-gold)]/8 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Badge */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r ${combo.badgeColor} z-20 shadow-lg`}>
                  <span className="text-[9px] font-black text-white/90 uppercase tracking-[2px]">
                    {combo.badge}
                  </span>
                </div>

                {/* Combo Image - Landscape */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent z-10" />
                  <Image
                    src={combo.image}
                    alt={combo.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 p-6 sm:p-8 -mt-8">
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 group-hover:text-[var(--v-gold)] transition-colors duration-300">
                    {combo.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-3 font-light">
                    {combo.description}
                  </p>
                  <p className="text-[var(--v-gold)]/70 text-xs tracking-wide font-medium mb-5">
                    {combo.flavors}
                  </p>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-medium tracking-wide w-fit">
                        {combo.count}
                      </span>
                      <span className="text-2xl font-black text-white">{combo.price}</span>
                    </div>
                    
                    {/* Add Button */}
                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="h-12 px-6 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-white hover:bg-[var(--v-gold)] hover:text-black hover:border-[var(--v-gold)] transition-all duration-300 transform active:scale-95 text-xs font-accent font-bold uppercase tracking-wider relative z-30"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 
          ========================================
          CENTER CTA 
          ========================================
        */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl rounded-[3rem] bg-gradient-to-b from-[#111] to-[#080808] border border-white/5 p-6 md:p-12 lg:p-16 text-center relative overflow-hidden flex flex-col items-center"
        >
          {/* Internal Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[80%] h-[100%] bg-[var(--v-gold)]/10 blur-[100px] pointer-events-none rounded-full" />
          
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 relative z-10">
            Want Something Unique?
          </h3>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 font-light relative z-10">
            Take full control of your snacking experience. Mix and match your favourite flavours to create your ultimate custom bowl.
          </p>
          
          <Link href="/create-your-bowl" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-5 rounded-full overflow-hidden flex items-center justify-center gap-3 cursor-pointer shadow-[0_10px_30px_rgba(212,184,122,0.2)]"
            >
              {/* Golden gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4B87A] via-[#F2D799] to-[#D4B87A] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]" />
              
              {/* Liquid hover effect overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              <span className="relative z-10 text-black font-black uppercase tracking-[2px] text-sm md:text-base">
                Create Your Own Bowl
              </span>
              <ArrowRight size={20} className="relative z-10 text-black transform group-hover:translate-x-1 transition-transform duration-300" />
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
