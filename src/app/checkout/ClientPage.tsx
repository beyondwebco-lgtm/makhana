"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ShoppingBag, Truck, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, subtotal, shipping, tax, total, clearCart } = useCart();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "VELLARI20") {
      setDiscount(Math.round(subtotal * 0.2));
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code! Try 'VELLARI20'.");
    }
  };

  const finalTotal = total - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API order creation & payment gateway transition
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-success?orderId=${orderId}`);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-white/5 p-6 mb-6">
            <ShoppingBag className="h-10 w-10 text-white/30" />
          </div>
          <h1 className="text-3xl font-black mb-2">No Items to Checkout</h1>
          <p className="text-white/50 mb-8 max-w-sm">
            Your cart is currently empty. Go ahead and add some premium roasted makhana!
          </p>
          <Link href="/#products">
            <span className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--v-gold)] px-8 py-4 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-black shadow-lg">
              Explore Flavours
            </span>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[var(--v-gold)]/5 blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[var(--v-gold)]/5 blur-[150px] pointer-events-none -z-10" />

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: Shipping Form */}
          <div className="w-full lg:w-[60%] space-y-8">
            <div>
              <Link href="/flavours/crush-me" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} />
                <span>Back to Flavour details</span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-[#111] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wider font-[family-name:var(--font-accent)] border-b border-white/5 pb-4">
                  1. Contact Info
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 99999 99999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#111] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wider font-[family-name:var(--font-accent)] border-b border-white/5 pb-4">
                  2. Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">Street Address</label>
                  <input
                    id="address"
                    type="text"
                    required
                    placeholder="Apartment, suite, unit, building, street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">City</label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-xs text-white/50 font-bold uppercase tracking-wider mb-2">ZIP Code</label>
                    <input
                      id="zip"
                      type="text"
                      required
                      placeholder="400001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#111] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wider font-[family-name:var(--font-accent)] border-b border-white/5 pb-4">
                  3. Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Card Selection */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "card" ? "border-[var(--v-gold)] bg-[var(--v-gold)]/5" : "border-white/5 bg-white/5"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="accent-[var(--v-gold)]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Credit / Debit Card (Stripe/Razorpay)</span>
                        <span className="text-xs text-white/50">Pay securely with card, UPI, or NetBanking</span>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-white/50" />
                  </label>

                  {/* COD Selection */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "cod" ? "border-[var(--v-gold)] bg-[var(--v-gold)]/5" : "border-white/5 bg-white/5"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-[var(--v-gold)]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Cash on Delivery (COD)</span>
                        <span className="text-xs text-white/50">Pay at your doorstep upon delivery</span>
                      </div>
                    </div>
                    <Truck className="h-5 w-5 text-white/50" />
                  </label>
                </div>
              </div>

              {/* Submit Checkout CTA */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 rounded-full bg-[var(--v-gold)] text-black font-[family-name:var(--font-accent)] uppercase tracking-widest text-sm font-black flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_10px_30px_rgba(212,184,122,0.2)] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pay ₹{finalTotal} & Complete Order</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* RIGHT: Order Summary Panel */}
          <div className="w-full lg:w-[40%]">
            <div className="sticky top-32 bg-[#111] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-wider font-[family-name:var(--font-accent)] border-b border-white/5 pb-4">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
                {cart.map((item) => (
                  <div key={item.slug} className="flex gap-4 items-center">
                    <div className="relative h-14 w-14 rounded-xl bg-white/5 p-1 flex items-center justify-center flex-shrink-0">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-white/50">{item.quantity} x ₹{item.price}</p>
                    </div>
                    <span className="font-black text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="flex gap-3 border-t border-white/5 pt-6">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  aria-label="Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--v-gold)] transition-colors text-sm uppercase"
                  disabled={couponApplied}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                  disabled={couponApplied}
                >
                  {couponApplied ? "Applied ✓" : "Apply"}
                </button>
              </div>

              {couponApplied && (
                <p className="text-xs text-green-400 font-bold">VELLARI20: 20% discount applied successfully!</p>
              )}

              {/* Totals info */}
              <div className="space-y-3 pt-6 border-t border-white/5">
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
                  <span>GST (5%)</span>
                  <span className="text-white font-bold">₹{tax}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount</span>
                    <span className="font-bold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base text-white pt-4 border-t border-white/5">
                  <span className="font-bold">Grand Total</span>
                  <span className="text-2xl font-black text-[var(--v-gold)]">₹{finalTotal}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
