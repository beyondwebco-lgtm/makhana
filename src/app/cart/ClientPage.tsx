"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, ShieldCheck, Truck, RotateCcw, Sparkles, Heart, Check } from "lucide-react";

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Secure Payments", desc: "Razorpay Encrypted" },
  { icon: Sparkles, title: "Freshly Roasted", desc: "Guaranteed Crunch" },
  { icon: Truck, title: "Fast Shipping", desc: "Shiprocket Delivery" },
  { icon: RotateCcw, title: "Guaranteed Satisfaction", desc: "Easy Support" },
];

export default function ClientPage() {
  const { cart, addToCart, updateQuantity, removeFromCart, subtotal, shipping, tax, total } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Free shipping logic (goal threshold: 499)
  const FREE_SHIPPING_THRESHOLD = 499;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const awayFromFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Math totals
  const finalShipping = isFreeShipping ? 0 : shipping;
  const couponDiscount = appliedCoupon ? discountAmount : 0;
  const grandTotal = Math.max(subtotal + finalShipping + tax - couponDiscount, 0);

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    if (couponCode.toUpperCase() === "VELLARI20") {
      const discount = Math.round(subtotal * 0.20);
      setDiscountAmount(discount);
      setAppliedCoupon("VELLARI20");
      setCouponSuccess("Coupon 'VELLARI20' (20% OFF) applied successfully!");
    } else if (!couponCode.trim()) {
      setCouponError("Please enter a valid coupon code.");
    } else {
      setCouponError("Invalid coupon code. Try 'VELLARI20'.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setDiscountAmount(0);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  const handleSaveForLater = (item: any) => {
    setSavedItems((prev) => [...prev, item]);
    removeFromCart(item.slug);
  };

  const handleMoveToCart = (item: any) => {
    setSavedItems((prev) => prev.filter((i) => i.slug !== item.slug));
    updateQuantity(item.slug, item.quantity || 1);
  };

  const crossSellProducts = useMemo(() => {
    return products.slice(0, 4);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FFFDF9] text-v-black overflow-hidden relative">
        
        {/* ── PREMIUM LIGHT AMBIENCE ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFF6E0]/60 rounded-full blur-[160px] opacity-70" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFF0D4]/40 rounded-full blur-[180px] opacity-50" />
          <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-[#E8C96A]/10 rounded-full blur-[120px] opacity-30" />
        </div>

        {/* ── PAGE WORKSPACE ── */}
        <div className="relative z-10 pb-32 flex flex-col items-center" style={{ paddingTop: '220px' }}>
          
          <div className="w-full max-w-[1400px] px-6 md:px-8 lg:px-12 flex flex-col gap-16">

            {/* ── BREADCRUMB & HEADER ── */}
            <div className="flex flex-col items-center text-center">
              <nav className="flex items-center justify-center gap-2.5 text-v-black/45 text-[11px] tracking-[0.2em] uppercase font-accent mb-6">
                <Link href="/" className="hover:text-v-gold transition-colors">Home</Link>
                <ChevronRight size={12} className="text-v-black/30" />
                <Link href="/#products" className="hover:text-v-gold transition-colors">Shop</Link>
                <ChevronRight size={12} className="text-v-black/30" />
                <span className="text-v-gold font-bold">Cart</span>
              </nav>

              <div className="flex flex-col items-center max-w-[800px]">
                <span className="text-v-gold text-[11px] font-accent font-extrabold uppercase tracking-[0.3em] mb-4">
                  Shopping Cart
                </span>
                <h1 className="text-4xl md:text-6xl font-black font-display text-v-black uppercase tracking-tight leading-none mb-6">
                  Review Your Order
                </h1>
                <p className="text-v-black/50 text-[16px] font-light leading-relaxed max-w-[500px]">
                  You&apos;re one step closer to your premium roasted makhana mix.
                </p>
              </div>
            </div>

            {/* ── EMPTY CART STATE PANEL ── */}
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full py-24 border border-v-black/5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
              >
                <div className="w-24 h-24 rounded-full bg-[#FFFBF4] border border-v-black/5 flex items-center justify-center text-v-black/30 text-4xl shadow-inner">
                  🥣
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black font-accent text-v-black uppercase tracking-wider">
                    Your Cart is Empty
                  </h2>
                  <p className="text-v-black/50 text-sm font-light max-w-sm mx-auto leading-relaxed">
                    Looks like you haven&apos;t added any flavours to your crunch mix yet. Let&apos;s discover some!
                  </p>
                </div>
                <Link href="/#products">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4.5 rounded-full overflow-hidden flex items-center justify-center gap-3 cursor-pointer shadow-[0_10px_30px_rgba(212,184,122,0.15)] bg-gradient-to-r from-v-gold to-[#e8c96a] text-v-black font-accent font-black uppercase tracking-[2px] text-xs"
                  >
                    Explore Flavours
                    <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              
              /* ── 2-COLUMN SHOPPING INTERFACE ── */
              <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                
                {/* ── LEFT COLUMN: ITEMS & SAVED LIST (65% width) ── */}
                <div className="w-full lg:w-[65%] flex flex-col gap-10">
                  
                  {/* Cart Items List */}
                  <div className="flex flex-col gap-5">
                    <AnimatePresence initial={false}>
                      {cart.map((item) => (
                        <motion.div
                          key={item.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20, height: 0, overflow: "hidden", marginBottom: 0 }}
                          transition={{ duration: 0.4 }}
                          className="w-full rounded-[2rem] border border-white bg-white/70 backdrop-blur-md hover:border-v-gold/30 hover:bg-white/95 group p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.04)]"
                        >
                          <div className="flex items-center gap-6 w-full sm:w-auto">
                            {/* Product Thumbnail */}
                            <div className="w-24 h-24 relative flex items-center justify-center p-4 bg-[#FFF9EB] border border-v-black/5 rounded-[1.25rem] shrink-0 overflow-hidden shadow-inner">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="96px"
                                className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            {/* Item Information */}
                            <div className="flex flex-col min-w-0">
                              <h4 className="font-black text-v-black text-xl truncate leading-tight font-display">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-v-black/40 uppercase tracking-widest mt-1.5 font-accent font-bold">
                                {item.flavor}
                              </p>

                              {/* Badges */}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                                  Protein Rich
                                </span>
                                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-v-gold text-[9px] font-bold uppercase tracking-wider">
                                  Roasted
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Controls Row */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-v-black/5 pt-5 sm:pt-0 shrink-0">
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-v-black/10 rounded-full p-1 bg-white/90 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                className="w-9 h-9 rounded-full hover:bg-v-black/5 flex items-center justify-center text-v-black/60 hover:text-v-black transition-all active:scale-95 shrink-0"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-10 text-center font-bold text-[15px] text-v-black select-none font-accent">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                className="w-9 h-9 rounded-full hover:bg-v-black/5 flex items-center justify-center text-v-black/60 hover:text-v-black transition-all active:scale-95 shrink-0"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Price details */}
                            <div className="flex flex-col items-end justify-center min-w-[80px]">
                              <span className="text-xl font-black text-v-black font-accent">
                                ₹{item.price * item.quantity}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[11px] text-v-black/45 mt-0.5">
                                  ₹{item.price} each
                                </span>
                              )}
                            </div>

                            {/* Action links */}
                            <div className="flex items-center gap-2 border-l border-v-black/10 pl-5">
                              <button
                                onClick={() => handleSaveForLater(item)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-v-black/5 bg-white hover:bg-[#FFF5F7] text-v-black/35 hover:text-rose-500 hover:border-rose-100 transition-colors shadow-sm"
                                title="Save for later"
                              >
                                <Heart size={16} />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.slug)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-v-black/5 bg-white hover:bg-red-50 text-v-black/35 hover:text-red-500 hover:border-red-100 transition-colors shadow-sm"
                                title="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Saved for Later Section */}
                  {savedItems.length > 0 && (
                    <div className="flex flex-col gap-6 border-t border-v-black/10 pt-12">
                      <SectionLabel>Saved For Later ({savedItems.length})</SectionLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {savedItems.map((item) => (
                          <div
                            key={item.slug}
                            className="p-6 rounded-[1.75rem] border border-white bg-white/70 backdrop-blur-md flex items-center justify-between gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.015)]"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 relative flex items-center justify-center p-2 bg-[#FFF9EB] border border-v-black/5 rounded-xl overflow-hidden shrink-0 shadow-inner">
                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <h4 className="font-bold text-v-black text-base truncate font-display">{item.name}</h4>
                                <span className="text-v-gold font-accent text-sm font-semibold block mt-0.5">₹{item.price}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="px-5 py-3 text-[11px] font-accent font-black uppercase tracking-wider bg-white border border-v-black/10 hover:bg-v-black hover:text-white hover:border-v-black rounded-xl transition-all shadow-sm shrink-0"
                            >
                              Move to Cart
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* ── RIGHT COLUMN: ORDER SUMMARY (35% width, sticky) ── */}
                <div className="w-full lg:w-[35%] lg:sticky lg:top-[120px] flex flex-col gap-6">
                  
                  {/* Summary Card */}
                  <div className="w-full bg-white/80 border border-white rounded-[2rem] p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col gap-8">
                    
                    <div className="flex flex-col gap-2">
                      <span className="text-v-gold text-[10px] font-accent font-extrabold uppercase tracking-[3px]">
                        Order Summary
                      </span>
                      <h3 className="text-2xl font-black font-display text-v-black uppercase tracking-tight">
                        Bag Total
                      </h3>
                    </div>

                    {/* Free shipping bar */}
                    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-[#FFFBF0]/60 border border-v-black/5">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-v-black/70 font-light">
                          {isFreeShipping ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                              <Check size={16} className="text-emerald-500" />
                              Free Shipping Unlocked!
                            </span>
                          ) : (
                            <span>You&apos;re <strong className="text-v-gold">₹{awayFromFreeShipping}</strong> away from free shipping</span>
                          )}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-v-black/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-v-gold to-yellow-400 transition-all duration-500 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Breakdown totals */}
                    <div className="flex flex-col gap-4 text-[15px]">
                      <div className="flex justify-between items-center text-v-black/60">
                        <span className="font-light">Subtotal</span>
                        <span className="font-semibold text-v-black">₹{subtotal}</span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex justify-between items-center text-emerald-600">
                          <span className="font-light">Coupon ({appliedCoupon})</span>
                          <span className="font-semibold">-₹{couponDiscount}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-v-black/60">
                        <span className="font-light">Shipping Charges</span>
                        <span className="font-semibold">
                          {finalShipping === 0 ? (
                            <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Free</span>
                          ) : (
                            `₹${finalShipping}`
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-v-black/60">
                        <span className="font-light">Estimated GST (5%)</span>
                        <span className="font-semibold text-v-black">₹{tax}</span>
                      </div>

                      <div className="h-[1px] bg-v-black/10 w-full my-2" />

                      <div className="flex justify-between items-end">
                        <span className="text-v-black font-accent font-black uppercase tracking-wider text-[13px]">Grand Total</span>
                        <span className="text-[32px] font-black text-v-gold font-accent tracking-tight leading-none">
                          ₹{grandTotal}
                        </span>
                      </div>
                    </div>

                    {/* Coupon Input Area */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] uppercase tracking-[2px] text-v-black/50 font-accent font-bold">
                        Promo Coupon Code
                      </label>
                      
                      {!appliedCoupon ? (
                        <div className="flex bg-white/60 border border-v-black/10 rounded-2xl p-1.5 w-full focus-within:border-v-gold/80 focus-within:shadow-[0_0_0_3px_rgba(212,184,122,0.15)] transition-all duration-300">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="e.g. VELLARI20"
                            className="bg-transparent border-none px-4 text-sm w-full focus:outline-none uppercase text-v-black placeholder:text-v-black/30 font-accent font-bold"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="bg-v-black text-white hover:bg-v-black/85 rounded-xl px-5 py-3 text-[11px] uppercase font-accent font-bold tracking-wider transition-colors shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3 text-xs text-emerald-700">
                          <div className="flex items-center gap-2.5">
                            <Tag size={15} />
                            <span className="font-bold">{appliedCoupon} Applied</span>
                          </div>
                          <button onClick={handleRemoveCoupon} className="hover:text-red-600 font-bold uppercase tracking-wider text-[11px] transition-colors">
                            Remove
                          </button>
                        </div>
                      )}

                      {couponError && (
                        <span className="text-red-500 text-[11px] font-medium tracking-wide mt-1 pl-1">
                          {couponError}
                        </span>
                      )}
                      {couponSuccess && (
                        <span className="text-emerald-600 text-[11px] font-medium tracking-wide mt-1 pl-1">
                          {couponSuccess}
                        </span>
                      )}
                    </div>

                    {/* Checkout Button CTA */}
                    <Link href="/checkout" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-16 bg-gradient-to-r from-v-gold via-[#e8c96a] to-v-gold bg-[length:200%_auto] text-v-black font-accent font-black uppercase tracking-[2px] rounded-2xl shadow-[0_12px_32px_rgba(212,184,122,0.25)] hover:shadow-[0_16px_40px_rgba(212,184,122,0.35)] transition-all duration-300 flex items-center justify-center gap-2.5 text-[13px]"
                      >
                        <ShieldCheck size={18} />
                        Proceed to Secure Checkout
                      </motion.button>
                    </Link>

                    {/* Trust statement */}
                    <p className="text-[11px] text-v-black/40 font-light text-center leading-relaxed">
                      Estimated delivery: 2-4 business days. Shiprocket automated shipping courier dispatch.
                    </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-col gap-3">
                    {TRUST_BADGES.map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-white bg-white/70 backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.01)]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-v-black/5 flex items-center justify-center text-v-gold shrink-0 shadow-sm">
                          <badge.icon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-extrabold text-v-black leading-tight">
                            {badge.title}
                          </span>
                          <span className="text-[10px] text-v-black/40 uppercase tracking-wide leading-none mt-1 font-accent font-bold">
                            {badge.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ── YOU MAY ALSO LIKE (CROSS-SELLS) ── */}
            <div className="w-full border-t border-v-black/10 pt-16 flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <span className="text-v-gold text-[10px] font-accent font-black uppercase tracking-[4px]">
                  Snack Recommendations
                </span>
                <h2 className="text-2xl md:text-3xl font-black font-display text-v-black uppercase tracking-wide leading-none">
                  You May Also Like
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {crossSellProducts.map((product) => (
                  <div
                    key={product.slug}
                    className="relative rounded-3xl border border-white bg-white/70 backdrop-blur-md hover:border-v-gold/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] group p-6 cursor-pointer flex flex-col justify-between aspect-[3/4] transition-all duration-500 hover:-translate-y-1"
                  >
                    <Link href={`/flavours/${product.slug}`} className="flex-1 flex flex-col justify-between">
                      <div className="w-full aspect-[4/3] relative flex items-center justify-center p-2 bg-[#FFF9EB]/40 rounded-2xl border border-v-black/5 shadow-inner">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 250px"
                          className="object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5 mt-5">
                        <h4 className="font-black text-v-black text-base group-hover:text-v-gold transition-colors leading-tight font-display">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-v-black/40 uppercase tracking-widest font-accent font-bold mt-1">
                          {product.flavor}
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between border-t border-v-black/5 pt-4 mt-5">
                      <span className="text-lg font-black text-v-black font-accent">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product.slug, 1);
                        }}
                        className="px-4 py-2.5 text-[10px] font-accent font-black uppercase tracking-wider bg-v-black text-white hover:bg-v-gold hover:text-v-black rounded-xl transition-all shadow-sm"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-v-gold font-accent uppercase tracking-[4px] text-[9px] flex items-center gap-3">
      <span className="w-6 h-[1px] bg-v-gold/40 block shrink-0" />
      {children}
    </h3>
  );
}
