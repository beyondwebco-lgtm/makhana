"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/data/products";

interface WishlistProductCardProps {
  product: Product;
  onRemove: (slug: string) => void;
  onAddToCart: (slug: string, quantity: number) => void;
  onExplore: (slug: string) => void;
}

export default function WishlistProductCard({ product, onRemove, onAddToCart, onExplore }: WishlistProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  /* Mouse parallax for image */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  
  const imgX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const imgY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between rounded-[28px] overflow-hidden"
      style={{
        background: "rgba(17, 17, 17, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.02)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* ── CARD HOVER GLOW ── */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700 ease-out z-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${product.gradientFrom}22, transparent 60%)`
        }}
      />
      
      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-[28px] p-6 flex flex-col items-center justify-center bg-black/40 z-10">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full text-[9px] font-accent font-bold uppercase tracking-widest bg-v-gold text-v-black shadow-lg">
              {product.badge}
            </span>
          )}
          {product.price < product.originalPrice && (
            <span className="px-2.5 py-1 rounded-full text-[9px] font-accent font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Remove / Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(product.slug)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center z-20 hover:bg-v-gold/20 hover:border-v-gold/40 hover:text-v-gold text-v-gold transition-all duration-300 shadow-xl group/heart"
        >
          <motion.div
            initial={false}
            animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-2 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-accent uppercase tracking-wider text-white opacity-0 group-hover/heart:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Remove
          </div>
        </motion.button>

        {/* Parallax Image */}
        <motion.div 
          className="relative w-full h-full flex items-center justify-center z-10"
          style={{ x: imgX, y: imgY }}
        >
          <motion.div
            animate={{ 
              scale: isHovered ? 1.08 : 1,
              rotate: isHovered ? 2 : 0
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[85%] h-[85%]"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </motion.div>
        
        {/* Subtle shadow base for jar */}
        <div className="absolute bottom-6 w-3/4 h-4 bg-black/60 blur-[12px] rounded-[100%] z-0" />
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="p-5 flex flex-col flex-1 z-10 relative">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-accent font-bold uppercase tracking-[2px]" style={{ color: product.color }}>
              {product.flavor}
            </p>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[10px] text-white/60">
              <span className="text-v-gold">★</span> {product.rating}
            </div>
          </div>
          
          <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2 group-hover:text-v-gold transition-colors duration-300">
            {product.name}
          </h3>
          
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-[9px] font-accent uppercase tracking-wider px-2 py-0.5 border border-white/10 rounded-full text-white/50 bg-white/5">
              {product.weight}
            </span>
            <span className="text-[9px] font-accent uppercase tracking-wider px-2 py-0.5 border border-white/10 rounded-full text-white/50 bg-white/5">
              Roasted
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-end gap-2 mb-4">
            <span className="font-display font-bold text-2xl text-white">
              ₹{product.price}
            </span>
            {product.price < product.originalPrice && (
              <span className="text-sm font-medium text-white/30 line-through mb-1">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onAddToCart(product.slug, 1)}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black hover:bg-amber-300 shadow-[0_4px_15px_rgba(212,150,26,0.2)] hover:shadow-[0_8px_25px_rgba(212,150,26,0.4)] active:scale-[0.98] transition-all duration-300"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
            
            <button
              onClick={() => onExplore(product.slug)}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-accent font-bold uppercase tracking-wider border border-white/10 text-white/70 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all duration-300"
            >
              Explore Flavour
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
