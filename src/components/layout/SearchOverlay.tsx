"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, Trash2, ArrowUpRight, Flame, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset Premium Combos data for search
const COMBOS = [
  {
    slug: "bold-hearts",
    name: "Bold Hearts Combo",
    flavor: "Peri Peri • Mint • Tangy Tomato",
    description: "Bold flavors, real connections. The perfect mix of spicy, mint, and tomato.",
    price: 449,
    image: "/assets/combos/bold-heart.png",
    isCombo: true,
    isBestseller: true,
    isProteinRich: true,
    isSpicy: true,
  },
  {
    slug: "mixed-signals",
    name: "Mixed Signals Combo",
    flavor: "Peri Peri • Mint",
    description: "Two flavors, total chemistry! Spicy Peri Peri meets refreshing mint.",
    price: 349,
    image: "/assets/combos/mixed-signals.png",
    isCombo: true,
    isTrending: true,
    isSpicy: true,
  },
  {
    slug: "spicy-romance",
    name: "Spice & Romance Combo",
    flavor: "Peri Peri • Tangy Tomato • Cheese",
    description: "Bold flavors, perfect together. Peri Peri, cheese, and tomato mix.",
    price: 449,
    image: "/assets/combos/spicy-romance.png",
    isCombo: true,
    isSpicy: true,
  },
  {
    slug: "butterflies",
    name: "Butterflies Combo",
    flavor: "Classic Salted • Tangy Tomato",
    description: "The first look, the first smile, the first blush. Tangy and salted mix.",
    price: 349,
    image: "/assets/combos/butterflies.png",
    isCombo: true,
  }
];

const SUGGESTIONS = [
  { label: "🔥 Best Sellers", query: "Bestseller" },
  { label: "🧀 Cheese", query: "Love Bite" },
  { label: "🌿 Mint", query: "Green Flag" },
  { label: "🌶️ Peri Peri", query: "Red Flag" },
  { label: "🥣 Build Your Bowl", query: "create-your-bowl" },
  { label: "🎁 Combo Packs", query: "Combo" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "flavours", label: "Flavours" },
  { id: "combos", label: "Combos" },
  { id: "protein", label: "Protein Rich" },
  { id: "spicy", label: "Spicy" },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addToCart, addCustomToCart } = useCart();

  // Load recent searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vellari_recent_searches");
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  // Lock scroll / Focus input
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedFilter("all");
      setActiveIndex(-1);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Add to recents
  const saveSearchQuery = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 5);
      localStorage.setItem("vellari_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("vellari_recent_searches");
  };

  // Compile all searchable items (Products + Premium Combos)
  const allItems = useMemo(() => {
    const pItems = products.map(p => ({
      slug: p.slug,
      name: p.name,
      flavor: p.flavor,
      description: p.description,
      price: p.price,
      image: p.image,
      rating: p.rating || 4.8,
      isCombo: false,
      isBestseller: p.isBestseller || false,
      isNew: p.isNew || false,
      isProteinRich: true,
      isSpicy: ["red-flag", "love-bite"].includes(p.slug),
      isHealthy: true,
      category: "flavours"
    }));

    const cItems = COMBOS.map(c => ({
      ...c,
      rating: 4.9,
      isNew: false,
      isHealthy: true,
      category: "combos"
    }));

    return [...pItems, ...cItems];
  }, []);

  // Filter & search matches
  const searchResults = useMemo(() => {
    let list = allItems;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.flavor.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    } else {
      return [];
    }

    if (selectedFilter !== "all") {
      if (selectedFilter === "flavours") {
        list = list.filter(i => !i.isCombo);
      } else if (selectedFilter === "combos") {
        list = list.filter(i => i.isCombo);
      } else if (selectedFilter === "protein") {
        list = list.filter(i => i.isProteinRich);
      } else if (selectedFilter === "spicy") {
        list = list.filter(i => i.isSpicy);
      }
    }

    return list;
  }, [query, selectedFilter, allItems]);

  // Handle keyboard Arrow Up/Down navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (searchResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          const selected = searchResults[activeIndex];
          handleNavigate(selected.slug, selected.isCombo);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, activeIndex, onClose]);

  const handleNavigate = (slug: string, isCombo: boolean) => {
    saveSearchQuery(query || slug);
    onClose();
    if (isCombo) {
      router.push("/create-your-bowl");
    } else {
      router.push(`/flavours/${slug}`);
    }
  };

  const handleSuggestionClick = (queryText: string) => {
    if (queryText === "create-your-bowl") {
      onClose();
      router.push("/create-your-bowl");
    } else {
      setQuery(queryText);
      inputRef.current?.focus();
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (item.isCombo) {
      addCustomToCart({
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        flavor: item.flavor,
      });
    } else {
      addToCart(item.slug, 1);
    }
  };

  // Trending picks
  const trendingFlavours = useMemo(() => {
    return allItems.slice(0, 3);
  }, [allItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[20px] flex items-start justify-center overflow-y-auto p-4 md:p-10 pt-[12vh]"
          onClick={onClose}
        >
          {/* Spotlight Glow behind modal */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-v-gold/[0.08] rounded-full blur-[100px] pointer-events-none z-0" />

          {/* Centered Spotlight Modal */}
          <motion.div
            initial={{ y: 15, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl bg-[#0c0c0c]/90 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── SEARCH INPUT HEADER ── */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.06]">
              <Search className="text-white/40 w-5 h-5 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                placeholder="Search flavors, combos, collections..."
                className="w-full bg-transparent text-[17px] text-white placeholder:text-white/20 focus:outline-none font-[family-name:var(--font-accent)]"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
                >
                  <X size={12} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-bold text-white/35">
                Esc
              </kbd>
            </div>

            {/* ── CONTENT SCROLL AREA ── */}
            <div className="max-h-[480px] overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
              
              {/* ── PRE-SEARCH DEFAULT DASHBOARD ── */}
              {!query.trim() && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left panel: Quick tags & Recents */}
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <SectionLabel>Quick Suggestions</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((tag) => (
                          <button
                            key={tag.label}
                            onClick={() => handleSuggestionClick(tag.query)}
                            className="px-3 py-1.5 text-[11px] font-medium font-[family-name:var(--font-accent)] rounded-full border border-white/[0.04] bg-white/[0.02] hover:bg-v-gold/10 hover:border-v-gold/30 hover:text-v-gold transition-all duration-200"
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {recentSearches.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <SectionLabel>Recent Searches</SectionLabel>
                          <button
                            onClick={handleClearHistory}
                            className="text-[9px] uppercase tracking-wider text-white/30 hover:text-red-400 flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={10} />
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {recentSearches.map((item, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(item)}
                              className="flex items-center gap-2.5 w-full text-left py-1.5 px-2 rounded-lg hover:bg-white/[0.03] text-white/60 hover:text-white transition-all text-xs"
                            >
                              <Clock size={11} className="text-white/30" />
                              <span className="truncate">{item}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right panel: Trending products */}
                  <div className="flex flex-col gap-3">
                    <SectionLabel>Trending Products</SectionLabel>
                    <div className="flex flex-col gap-2.5">
                      {trendingFlavours.map((item) => (
                        <div
                          key={item.slug}
                          onClick={() => handleNavigate(item.slug, item.isCombo)}
                          className="flex items-center gap-3.5 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-v-gold/20 cursor-pointer group transition-all duration-300"
                        >
                          <div className="w-10 h-10 relative flex items-center justify-center p-1.5 bg-white/[0.02] border border-white/[0.05] rounded-lg shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-xs group-hover:text-v-gold transition-colors truncate">
                              {item.name}
                            </h4>
                            <span className="text-[9px] text-white/40 uppercase tracking-wider block mt-0.5">
                              {item.flavor}
                            </span>
                          </div>
                          <ArrowUpRight size={13} className="text-white/20 group-hover:text-v-gold transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── LIVE SEARCH RESULTS PANEL ── */}
              {query.trim() && (
                <div className="flex flex-col gap-5">
                  {/* Category filters */}
                  <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                    {FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`px-3.5 py-1 text-[11px] font-accent uppercase tracking-wider font-bold rounded-full border transition-all duration-200 ${
                          selectedFilter === filter.id
                            ? "bg-v-gold border-v-gold text-v-black shadow-[0_0_12px_rgba(212,184,122,0.2)]"
                            : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white hover:border-white/[0.12]"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Matching results */}
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {searchResults.map((item, idx) => (
                        <div
                          key={item.slug}
                          onClick={() => handleNavigate(item.slug, item.isCombo)}
                          className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            activeIndex === idx
                              ? "border-v-gold bg-v-gold/[0.06] shadow-[0_0_20px_rgba(212,184,122,0.08)]"
                              : "border-white/[0.05] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Product thumbnail */}
                            <div className="w-12 h-12 relative flex items-center justify-center p-2 bg-[#FFF9EB]/5 border border-white/[0.05] rounded-lg shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-contain"
                              />
                            </div>
                            
                            <div className="flex flex-col min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-white text-sm truncate font-display">
                                  {item.name}
                                </h4>
                                
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-white/[0.04] text-v-gold text-[8px] font-bold">
                                  ★ {item.rating}
                                </span>
                              </div>
                              <span className="text-[10px] text-v-gold/70 font-accent font-bold uppercase tracking-wider mt-0.5 block">
                                {item.flavor}
                              </span>
                            </div>
                          </div>

                          {/* Price & CTA Button */}
                          <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className="text-sm font-black text-white font-accent">
                              ₹{item.price}
                            </span>
                            <button
                              onClick={(e) => handleAddToCartClick(e, item)}
                              className="px-3.5 py-1.5 text-[9px] font-accent font-black uppercase tracking-wider bg-v-gold text-v-black rounded-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // No matches panel
                    <div className="py-12 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/[0.01] gap-4">
                      <span className="text-3xl opacity-30">🥣</span>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-white text-sm">
                          No matching results
                        </h4>
                        <p className="text-white/40 text-xs font-light max-w-xs leading-relaxed">
                          We couldn&apos;t find anything matching &ldquo;{query}&rdquo;.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── FOOTER TIPS ── */}
            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/30 font-accent">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-white/5 border border-white/10 px-1 font-mono">↑↓</kbd> to navigate
                <kbd className="rounded bg-white/5 border border-white/10 px-1 font-mono">Enter</kbd> to select
              </span>
              <span>
                Close with <kbd className="rounded bg-white/5 border border-white/10 px-1 font-mono">Esc</kbd>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Sublabel helper
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-v-gold font-accent uppercase tracking-[3px] text-[9px] font-extrabold flex items-center gap-2">
      <span className="w-4 h-[1px] bg-v-gold/30 block shrink-0" />
      {children}
    </h3>
  );
}
