"use client";

import React, { useState, useEffect } from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products, getFeaturedProducts } from "@/data/products";
import { ChevronDown, Filter, SlidersHorizontal, Heart, Sparkles, Loader2 } from "lucide-react";
import WishlistProductCard from "@/components/wishlist/WishlistProductCard";

const FILTERS = ["All", "Flavours", "Combo Packs", "Custom Bowls", "Best Sellers", "Offers", "Newest"];
const SORTS = ["Newest", "Oldest", "Price: Low to High", "Price: High to Low", "Best Sellers"];

export default function AccountWishlistPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  
  // Mock syncing state
  const [isSyncing, setIsSyncing] = useState(true);
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Newest");

  useEffect(() => {
    // Simulate Supabase fetch/sync delay
    const timer = setTimeout(() => {
      setWishlistSlugs(["love-bite", "blush", "green-flag", "red-flag"]);
      setIsSyncing(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (slug: string) => {
    setWishlistSlugs(prev => prev.filter(s => s !== slug));
  };

  const handleExplore = (slug: string) => {
    router.push(`/shop/${slug}`);
  };

  const wishlistProducts = products.filter(p => wishlistSlugs.includes(p.slug));
  const recentlyViewed = getFeaturedProducts().slice(0, 3); // Mock recently viewed
  const recommended = getFeaturedProducts().reverse().slice(0, 3); // Mock recommended

  // If syncing, show a premium loading state
  if (isSyncing) {
    return (
      <AccountLayout activeBadgeCounts={{ wishlist: 0 }}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 size={32} className="text-v-gold animate-spin mb-4" />
          <p className="text-[11px] font-accent uppercase tracking-widest text-white/50 font-bold">
            Syncing your collection...
          </p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeBadgeCounts={{ wishlist: wishlistSlugs.length }}>
      <div className="flex flex-col" style={{ gap: "32px" }}>
        
        {/* ── HEADER ── */}
        <div>
          <span className="text-[11px] font-accent uppercase tracking-[4px] font-bold text-v-gold flex items-center gap-2 mb-3">
            <Heart size={12} fill="currentColor" />
            MY COLLECTION
          </span>
          <h2 className="font-display font-bold text-4xl text-white tracking-tight mb-2">Saved Products</h2>
          <p className="text-white/50 font-light text-[15px] max-w-xl">
            Your favourite flavours and premium bowls, ready whenever you're ready.
          </p>
        </div>

        {wishlistProducts.length > 0 ? (
          <>
            {/* ── FILTERS & SORT BAR ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-white/5">
              
              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="flex items-center gap-2 pr-4 text-white/40 mr-2 border-r border-white/10 shrink-0">
                  <Filter size={16} />
                </div>
                {FILTERS.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`relative shrink-0 px-5 py-2 rounded-full text-[11px] font-accent uppercase tracking-wider font-bold transition-all duration-300 ${
                      activeFilter === filter 
                        ? "text-v-black shadow-[0_0_20px_rgba(212,150,26,0.3)]" 
                        : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {activeFilter === filter && (
                      <motion.div
                        layoutId="activeWishlistFilter"
                        className="absolute inset-0 bg-gradient-to-r from-v-gold to-amber-300 rounded-full z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{filter}</span>
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0 flex items-center gap-3">
                <span className="text-[10px] font-accent uppercase tracking-widest text-white/40 font-bold hidden xl:block">
                  Sort By
                </span>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center justify-between gap-3 w-44 px-4 py-2.5 rounded-[12px] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors text-[11px] font-accent uppercase tracking-wider font-bold text-white/80"
                >
                  <span className="truncate">{activeSort}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-48 rounded-[16px] bg-[#111] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden z-30"
                    >
                      {SORTS.map(sort => (
                        <button
                          key={sort}
                          onClick={() => { setActiveSort(sort); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-[11px] font-accent uppercase tracking-wider font-bold transition-colors ${
                            activeSort === sort ? "bg-v-gold/10 text-v-gold" : "text-white/60 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {sort}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── PRODUCT GRID ── */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-accent uppercase tracking-[2px] font-bold text-white/40">
                {wishlistProducts.length} Saved Products
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 pb-12">
              <AnimatePresence mode="popLayout">
                {wishlistProducts.map(p => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <WishlistProductCard 
                      product={p} 
                      onRemove={handleRemove}
                      onAddToCart={addToCart}
                      onExplore={handleExplore}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          /* ── EMPTY STATE ── */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#111111]/40 backdrop-blur-md rounded-[32px] border border-white/[0.05] relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-v-gold/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="w-24 h-24 mb-8 relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-v-gold/20 rounded-full blur-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#161616] to-[#222] border border-white/10 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <Heart size={32} className="text-white/20" />
              </div>
            </div>

            <h3 className="font-display font-bold text-3xl text-white mb-4 tracking-tight">
              Your Wishlist is Empty
            </h3>
            <p className="text-white/50 font-light max-w-sm mb-10 text-[15px]">
              Save your favourite flavours and custom bowls so you can easily find them later.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/shop"
                className="px-8 py-4 rounded-[16px] text-[11px] font-accent font-bold uppercase tracking-[2px] bg-v-gold text-v-black hover:bg-amber-300 shadow-[0_4px_20px_rgba(212,150,26,0.2)] hover:shadow-[0_8px_30px_rgba(212,150,26,0.4)] transition-all"
              >
                Explore Flavours
              </Link>
              <Link 
                href="/custom-bowl"
                className="px-8 py-4 rounded-[16px] text-[11px] font-accent font-bold uppercase tracking-[2px] border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                Build Your Own Bowl
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

        {/* ── HORIZONTAL PRODUCT SECTIONS ── */}
        <div className="flex flex-col gap-16 mt-4">
          
          {/* Recently Viewed */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-2xl text-white tracking-tight">Recently Viewed</h3>
              <Link href="/shop" className="text-[10px] font-accent font-bold uppercase tracking-widest text-v-gold hover:text-amber-300">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentlyViewed.map(p => (
                <WishlistProductCard 
                  key={`recent-${p.id}`} 
                  product={p} 
                  onRemove={() => {}} 
                  onAddToCart={addToCart} 
                  onExplore={handleExplore} 
                />
              ))}
            </div>
          </div>

          {/* You May Also Like */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-v-gold" size={20} />
              <h3 className="font-display font-bold text-2xl text-white tracking-tight">You May Also Like</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommended.map(p => (
                <WishlistProductCard 
                  key={`rec-${p.id}`} 
                  product={p} 
                  onRemove={() => {}} 
                  onAddToCart={addToCart} 
                  onExplore={handleExplore} 
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </AccountLayout>
  );
}
