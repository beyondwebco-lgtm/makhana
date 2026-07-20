"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, subtotal, shipping, tax, total } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col bg-[#0f0f0f] text-white border-l border-white/5 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[var(--v-gold)]" />
                <h2 className="text-xl font-bold uppercase tracking-wider font-[family-name:var(--font-accent)]">Your Cart</h2>
                {cart.length > 0 && (
                  <span className="rounded-full bg-[var(--v-gold)] px-2.5 py-0.5 text-xs font-black text-black">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-white/5 p-6 mb-6">
                    <ShoppingBag className="h-10 w-10 text-white/30" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Your Cart is Empty</h3>
                  <p className="text-white/50 text-sm max-w-[240px] mb-8">
                    Looks like you haven&apos;t added any flirty flavours to your bowl yet!
                  </p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--v-gold)] px-6 py-3 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-black shadow-lg hover:shadow-[var(--v-gold)]/20 transition-all hover:scale-105"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.slug}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 border-b border-white/5 pb-6 last:border-0"
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-2 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                          <span className="font-black text-white ml-2">₹{item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs text-white/50 font-medium uppercase tracking-wider font-[family-name:var(--font-accent)] mt-1">
                          {item.flavor}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-white/10 rounded-full overflow-hidden bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                            className="p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                            className="p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.slug)}
                          className="text-white/40 hover:text-red-400 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 bg-[#141414] p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Shipping</span>
                    <span className="text-white font-bold">
                      {shipping === 0 ? <span className="text-green-400 font-bold uppercase text-xs tracking-wider">Free</span> : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Estimated GST (5%)</span>
                    <span className="text-white font-bold">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-base text-white pt-2 border-t border-white/5">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-xl font-black text-[var(--v-gold)]">₹{total}</span>
                  </div>
                </div>

                <div className="pt-2 gap-3 flex flex-col">
                  <Link href="/checkout" onClick={onClose}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-full bg-[var(--v-gold)] text-black font-[family-name:var(--font-accent)] uppercase tracking-widest text-sm font-black flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_10px_20px_rgba(212,184,122,0.15)]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>

                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-full border border-white/10 text-white font-[family-name:var(--font-accent)] uppercase tracking-widest text-xs font-bold hover:bg-white/5 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
