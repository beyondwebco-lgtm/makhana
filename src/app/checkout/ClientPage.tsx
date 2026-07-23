"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Truck,
  Lock,
  ChevronRight,
  Check,
  Mail,
  Phone,
  MapPin,
  User,
  Home,
  Hash,
  Tag,
  Shield,
  Zap,
  Package,
  Wallet,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Payment method definitions ─────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    desc: "PhonePe, GPay, Paytm, BHIM & more",
    icon: "💳",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, RuPay — via Razorpay",
    icon: "🏦",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    desc: "All major Indian banks supported",
    icon: "🌐",
  },
  {
    id: "wallet",
    label: "Wallets",
    desc: "Freecharge, Mobikwik, Amazon Pay",
    icon: "👛",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay at doorstep upon delivery",
    icon: "🏠",
  },
];

// ─── Trust badge definitions ─────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Shield, label: "100% Secure Checkout" },
  { icon: Lock, label: "Encrypted Payments" },
  { icon: Zap, label: "Powered by Razorpay" },
  { icon: Truck, label: "Ships via Shiprocket" },
  { icon: BadgeCheck, label: "Premium Quality" },
  { icon: Package, label: "Freshly Roasted" },
];

// ─── Checkout progress steps ─────────────────────────────────────────────────
const STEPS = ["Cart", "Checkout", "Payment", "Order Complete"];

// ─── Helper classes ────────────────────────────────────────────────────────
const inputCls =
  "w-full h-[60px] bg-white/50 border border-v-black/10 rounded-[16px] pr-[20px] py-[16px] text-v-black text-[16px] font-[family-name:var(--font-accent)] placeholder:text-v-black/30 focus:outline-none focus:border-v-gold/80 focus:bg-white/80 focus:shadow-[0_0_0_4px_rgba(212,184,122,0.15)] transition-all duration-300";

const labelCls =
  "block text-[12px] font-[family-name:var(--font-accent)] uppercase tracking-[0.18em] text-v-gold mb-[10px]";

// ─── Section Card wrapper ────────────────────────────────────────────────────
function SectionCard({
  step,
  title,
  desc,
  children,
}: {
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/60 backdrop-blur-xl border border-v-black/5 rounded-[24px] p-[32px] flex flex-col gap-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
    >
      <div className="flex flex-col gap-[12px] border-b border-v-black/5 pb-[32px]">
        <span className="text-v-gold text-[10px] font-[family-name:var(--font-accent)] font-black uppercase tracking-[3px]">
          {step}
        </span>
        <h2 className="text-[30px] font-black font-[family-name:var(--font-display)] text-v-black uppercase tracking-wide leading-tight">
          {title}
        </h2>
        <p className="text-v-black/60 text-[15px] font-light tracking-wide font-[family-name:var(--font-body)]">{desc}</p>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Icon-wrapped input ──────────────────────────────────────────────────────
function IconInput({
  icon: Icon,
  ...props
}: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full">
      <Icon
        size={20}
        className="absolute left-[18px] top-1/2 -translate-y-1/2 text-v-black/40 pointer-events-none"
      />
      <input {...props} className={inputCls} style={{ paddingLeft: '52px' }} />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { cart, subtotal, shipping, tax, total, clearCart } = useCart();
  const router = useRouter();

  // ── Form state (preserved exactly from original) ──────────────────────────
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("India");
  const [addressType, setAddressType] = useState<"home" | "office">("home");
  const [orderNotes, setOrderNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ── Business Logic (preserved exactly from original) ──────────────────────
  const FREE_SHIPPING_THRESHOLD = 499;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const awayFromFree = FREE_SHIPPING_THRESHOLD - subtotal;
  const finalShipping = isFreeShipping ? 0 : shipping;
  const finalTotal = subtotal + finalShipping + tax - discount;

  const applyCoupon = () => {
    setCouponError("");
    if (coupon.toUpperCase() === "VELLARI20") {
      setDiscount(Math.round(subtotal * 0.2));
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code. Try 'VELLARI20'.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-success?orderId=${orderId}`);
    }, 2000);
  };

  // ─── Hydration check ────────────────────────────────────────────────────
  if (!mounted) return null;

  // ─── Empty cart state ────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-v-cream text-v-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-v-gold/[0.04] rounded-full blur-[160px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 max-w-sm"
          >
            <div className="w-20 h-20 rounded-full bg-white border border-v-black/5 flex items-center justify-center text-3xl shadow-sm">
              🥣
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-black font-accent uppercase tracking-wide text-v-black">
                Nothing to Checkout
              </h1>
              <p className="text-v-black/50 text-sm font-light leading-relaxed">
                Your cart is empty. Discover premium roasted makhana first!
              </p>
            </div>
            <Link href="/#products">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-v-gold to-[#e8c96a] px-8 py-4 font-accent text-xs font-black uppercase tracking-[2px] text-black shadow-[0_10px_30px_rgba(212,184,122,0.2)]"
              >
                Explore Flavours
                <ChevronRight size={14} />
              </motion.span>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  // ─── Full checkout page ──────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-v-cream text-v-black overflow-hidden relative">
        {/* ── Background ambience ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[5%] left-1/4 w-[700px] h-[700px] bg-v-gold/[0.06] rounded-full blur-[180px]" />
          <div className="absolute top-[40%] right-1/4 w-[500px] h-[500px] bg-v-gold/[0.04] rounded-full blur-[160px]" />
        </div>

        <main className="relative z-10 pb-32" style={{ paddingTop: '260px' }}>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col gap-[48px]">

            {/* ── PAGE HEADER ── */}
            <div className="flex flex-col items-center text-center">
              {/* Breadcrumb */}
              <nav className="flex items-center justify-center gap-2 text-v-black/55 text-[12px] tracking-wider uppercase font-accent mb-[24px]">
                <Link href="/" className="hover:text-v-gold transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/cart" className="hover:text-v-gold transition-colors">Cart</Link>
                <ChevronRight size={12} />
                <span className="text-v-gold font-bold">Checkout</span>
              </nav>

              {/* Heading */}
              <div className="flex flex-col items-center max-w-[700px]">
                <span className="text-v-gold text-[12px] font-[family-name:var(--font-accent)] font-black uppercase tracking-[4px] mb-[16px]">
                  Secure Checkout
                </span>
                <h1 className="text-[56px] font-black font-[family-name:var(--font-display)] text-v-black uppercase tracking-wide leading-none mb-[16px]">
                  Complete Your Order
                </h1>
                <p className="text-v-black/60 text-[16px] font-light tracking-wide mb-[40px] font-[family-name:var(--font-body)]">
                  You&apos;re just one step away from enjoying your premium roasted makhana.
                </p>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center">
                {STEPS.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black border transition-all duration-300 ${
                          idx === 0
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600"
                            : idx === 1
                            ? "bg-v-gold/20 border-v-gold/50 text-v-gold"
                            : "bg-white border-v-black/10 text-v-black/40"
                        }`}
                      >
                        {idx === 0 ? <Check size={14} /> : idx + 1}
                      </div>
                      <span
                        className={`text-[12px] font-accent font-bold uppercase tracking-[0.1em] hidden sm:block ${
                          idx === 0
                            ? "text-emerald-600"
                            : idx === 1
                            ? "text-v-gold"
                            : "text-v-black/40"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`w-[60px] h-[1px] mx-[16px] transition-all duration-500 ${
                          idx === 0 ? "bg-emerald-500/30" : "bg-v-black/10"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── MAIN 2-COL LAYOUT ── */}
            <div className="flex flex-col lg:flex-row gap-[40px] items-start">

              {/* ───────────── LEFT: CHECKOUT FORM (65%) ───────────── */}
              <div className="w-full lg:w-[65%] flex flex-col gap-[48px]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-[48px]">

                  {/* ── SECTION 1: Contact Information ── */}
                  <SectionCard
                    step="Step 01"
                    title="Contact Information"
                    desc="We'll use this to send your order confirmation and shipping updates."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                      <div className="md:col-span-2">
                        <label htmlFor="email" className={labelCls}>Email Address</label>
                        <IconInput
                          icon={Mail}
                          id="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="phone" className={labelCls}>Phone Number</label>
                        <IconInput
                          icon={Phone}
                          id="phone"
                          type="tel"
                          required
                          placeholder="+91 99999 99999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </SectionCard>

                  {/* ── SECTION 2: Shipping Address ── */}
                  <SectionCard
                    step="Step 02"
                    title="Shipping Address"
                    desc="Enter the exact delivery address. Shiprocket will dispatch to this location."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                      <div>
                        <label htmlFor="firstName" className={labelCls}>First Name</label>
                        <IconInput
                          icon={User}
                          id="firstName"
                          type="text"
                          required
                          placeholder="Arjun"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className={labelCls}>Last Name</label>
                        <IconInput
                          icon={User}
                          id="lastName"
                          type="text"
                          required
                          placeholder="Sharma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="address" className={labelCls}>Street Address</label>
                        <IconInput
                          icon={MapPin}
                          id="address"
                          type="text"
                          required
                          placeholder="Building, street, area"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="apartment" className={labelCls}>Apartment / Flat / Floor (optional)</label>
                        <IconInput
                          icon={Home}
                          id="apartment"
                          type="text"
                          placeholder="Apt 4B, 2nd Floor"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className={labelCls}>City</label>
                        <input
                          id="city"
                          type="text"
                          required
                          placeholder="Mumbai"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className={labelCls}>State</label>
                        <input
                          id="state"
                          type="text"
                          required
                          placeholder="Maharashtra"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label htmlFor="zip" className={labelCls}>Pincode</label>
                        <IconInput
                          icon={Hash}
                          id="zip"
                          type="text"
                          required
                          placeholder="400001"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className={labelCls}>Country</label>
                        <input
                          id="country"
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      {/* Address type toggle */}
                      <div className="md:col-span-2 mt-[8px]">
                        <span className={labelCls}>Address Type</span>
                        <div className="flex gap-[16px]">
                          {(["home", "office"] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAddressType(type)}
                              className={`flex items-center gap-[10px] px-[24px] py-[16px] rounded-[16px] border text-[14px] font-accent font-bold uppercase tracking-wider transition-all duration-300 ${
                                addressType === type
                                  ? "border-v-gold/80 bg-v-gold/10 text-v-gold shadow-[0_0_0_1px_rgba(212,184,122,0.3)]"
                                  : "border-v-black/10 bg-white text-v-black/50 hover:border-v-black/20 hover:text-v-black/80"
                              }`}
                            >
                              {type === "home" ? <Home size={18} /> : <CreditCard size={18} />}
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* ── SECTION 3: Delivery Information ── */}
                  <SectionCard
                    step="Step 03"
                    title="Delivery Information"
                    desc="Your estimated delivery timeline and shipping method."
                  >
                    <div className="flex flex-col gap-[24px]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                        <div className="p-[24px] rounded-[20px] border border-v-black/5 bg-white/40 flex flex-col gap-[8px]">
                          <span className="text-[10px] font-accent font-black uppercase tracking-[2px] text-v-black/50">Courier Partner</span>
                          <div className="flex items-center gap-[12px]">
                            <Truck size={20} className="text-v-gold" />
                            <span className="text-[16px] font-bold text-v-black">Shiprocket</span>
                          </div>
                          <span className="text-[13px] text-v-black/60">Automated dispatch</span>
                        </div>
                        <div className="p-[24px] rounded-[20px] border border-v-black/5 bg-white/40 flex flex-col gap-[8px]">
                          <span className="text-[10px] font-accent font-black uppercase tracking-[2px] text-v-black/50">Estimated Delivery</span>
                          <div className="flex items-center gap-[12px]">
                            <Package size={20} className="text-v-gold" />
                            <span className="text-[16px] font-bold text-v-black">2–4 Business Days</span>
                          </div>
                          <span className="text-[13px] text-v-black/60">After confirmed dispatch</span>
                        </div>
                      </div>

                      {/* Free shipping progress */}
                      <div className="p-[24px] rounded-[20px] border border-v-black/5 bg-white/40 flex flex-col gap-[16px]">
                        <div className="flex justify-between items-center text-[14px]">
                          {isFreeShipping ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-[8px]">
                              <Check size={18} />
                              Free Shipping Unlocked!
                            </span>
                          ) : (
                            <span className="text-v-black/60 font-light">
                              Add <strong className="text-v-gold">₹{awayFromFree}</strong> more for FREE shipping
                            </span>
                          )}
                          <span className="text-v-black/40 text-[12px]">Goal: ₹{FREE_SHIPPING_THRESHOLD}</span>
                        </div>
                        <div className="w-full h-[6px] bg-v-black/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-v-gold to-yellow-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* ── SECTION 4: Payment Method ── */}
                  <SectionCard
                    step="Step 04"
                    title="Payment Method"
                    desc="All payments are encrypted and processed securely via Razorpay."
                  >
                    <div className="flex flex-col gap-[16px]">
                      {PAYMENT_METHODS.map((method) => (
                        <motion.label
                          key={method.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`flex items-center justify-between h-[74px] px-[20px] rounded-[20px] border cursor-pointer transition-all duration-300 ${
                            paymentMethod === method.id
                              ? "border-v-gold/80 bg-v-gold/[0.08] shadow-[0_0_0_1px_rgba(212,184,122,0.2),0_10px_30px_rgba(0,0,0,0.03)]"
                              : "border-v-black/5 bg-white/40 hover:border-v-black/15 hover:bg-white/60"
                          }`}
                        >
                          <div className="flex items-center gap-[16px]">
                            {/* Hidden native radio for form semantics */}
                            <input
                              type="radio"
                              name="payment"
                              className="sr-only"
                              checked={paymentMethod === method.id}
                              onChange={() => setPaymentMethod(method.id)}
                            />
                            {/* Custom radio ring */}
                            <div
                              className={`w-[24px] h-[24px] rounded-full border-[2px] flex items-center justify-center transition-all duration-300 shrink-0 ${
                                paymentMethod === method.id
                                  ? "border-v-gold bg-v-gold"
                                  : "border-v-black/20 bg-transparent"
                              }`}
                            >
                              <AnimatePresence>
                                {paymentMethod === method.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="w-[10px] h-[10px] rounded-full bg-black"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            <span className="text-[28px] leading-none shrink-0">{method.icon}</span>
                            <div className="flex flex-col justify-center">
                              <span className="font-bold text-[16px] text-v-black leading-tight">{method.label}</span>
                              <span className="text-[13px] text-v-black/60 font-light mt-[2px]">{method.desc}</span>
                            </div>
                          </div>

                          {paymentMethod === method.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-[28px] h-[28px] rounded-full bg-v-gold/20 border border-v-gold/50 flex items-center justify-center shrink-0 ml-auto"
                            >
                              <Check size={16} className="text-v-gold" />
                            </motion.div>
                          )}
                        </motion.label>
                      ))}
                    </div>
                  </SectionCard>

                  {/* ── SECTION 5: Order Notes ── */}
                  <SectionCard
                    step="Step 05"
                    title="Order Notes"
                    desc="Any special instructions for your delivery? Let us know."
                  >
                    <div className="flex flex-col">
                      <label htmlFor="notes" className={labelCls}>Additional Notes</label>
                      <textarea
                        id="notes"
                        placeholder="e.g. Leave at the door, ring bell twice, gift wrap, etc."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full min-h-[140px] bg-white/50 border border-v-black/10 rounded-[16px] p-[20px] text-v-black text-[16px] placeholder:text-v-black/30 focus:outline-none focus:border-v-gold/80 focus:bg-white/80 focus:shadow-[0_0_0_4px_rgba(212,184,122,0.15)] transition-all duration-300 tracking-wide resize-none"
                      />
                    </div>
                  </SectionCard>

                  {/* ── SUBMIT CTA ── */}
                  <div className="mt-[40px] flex flex-col gap-[16px]">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full h-[64px] rounded-[18px] bg-gradient-to-r from-v-gold via-[#e8c96a] to-v-gold text-v-black font-accent font-black uppercase tracking-[2px] text-[16px] flex items-center justify-center gap-[12px] shadow-[0_15px_50px_rgba(212,184,122,0.3)] hover:shadow-[0_20px_60px_rgba(212,184,122,0.4)] disabled:opacity-60 transition-all duration-300 relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-[12px]">
                          <span className="w-[24px] h-[24px] border-[3px] border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Processing Payment…</span>
                        </div>
                      ) : (
                        <>
                          <Lock size={20} />
                          <span>Proceed to Secure Payment — ₹{finalTotal}</span>
                        </>
                      )}
                    </motion.button>
                    {/* Trust micro-line */}
                    <p className="text-center text-[12px] text-v-black/50 font-light tracking-wide">
                      256-bit SSL encryption · Razorpay PCI-DSS certified · Shiprocket logistics
                    </p>
                  </div>

                </form>
              </div>

              {/* ───────────── RIGHT: ORDER SUMMARY (35%) ───────────── */}
              <div className="w-full lg:w-[35%] lg:sticky lg:top-[120px] flex flex-col gap-[32px]">

                {/* Summary Card */}
                <div className="bg-white/70 border border-v-black/5 rounded-[24px] p-[28px] flex flex-col gap-[28px] shadow-[0_15px_50px_rgba(0,0,0,0.03)]">
                  <div className="flex flex-col gap-[12px] border-b border-v-black/5 pb-[24px]">
                    <span className="text-v-gold text-[10px] font-accent font-black uppercase tracking-[3px]">
                      Summary
                    </span>
                    <h3 className="text-[24px] font-black font-accent text-v-black uppercase tracking-wide">
                      Order Summary
                    </h3>
                  </div>

                  {/* Product list */}
                  <div className="flex flex-col gap-[18px] max-h-[300px] overflow-y-auto pr-[8px] custom-scrollbar">
                    {cart.map((item, index) => (
                      <React.Fragment key={item.slug}>
                        <div className="flex items-center gap-[18px]">
                          <div className="relative w-[72px] h-[72px] rounded-[16px] bg-[#FFFBF0] border border-v-black/5 flex items-center justify-center p-[8px] overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="72px"
                              className="object-contain"
                            />
                            {/* Quantity badge */}
                            <span className="absolute -top-[6px] -right-[6px] w-[22px] h-[22px] rounded-full bg-v-gold text-black text-[11px] font-black flex items-center justify-center border-2 border-white">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="font-bold text-[15px] text-v-black truncate leading-tight">{item.name}</p>
                            <p className="text-[12px] text-v-black/50 uppercase tracking-wide mt-[4px]">{item.flavor}</p>
                          </div>
                          <span className="font-black text-[16px] text-v-black shrink-0 text-right">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                        {index < cart.length - 1 && (
                          <div className="w-full h-[1px] bg-v-black/10" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Free shipping bar */}
                  <div className="flex flex-col gap-[12px] p-[20px] bg-white/40 rounded-[16px] border border-v-black/5">
                    <p className="text-[13px] text-v-black/60 font-light">
                      {isFreeShipping ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-[6px]">
                          🎉 Free Shipping Unlocked!
                        </span>
                      ) : (
                        <>
                          <span className="text-v-gold font-bold text-[14px]">₹{awayFromFree}</span> more for free shipping
                        </>
                      )}
                    </p>
                    <div className="w-full h-[6px] bg-v-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-v-gold to-yellow-400 transition-all duration-700 ease-out"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Coupon input */}
                  <div className="flex flex-col gap-[10px]">
                    <label className={labelCls}>Promo Code</label>
                    {!couponApplied ? (
                      <div className="flex gap-[8px] bg-white/50 border border-v-black/10 rounded-[16px] p-[6px] focus-within:border-v-gold/80 focus-within:shadow-[0_0_0_3px_rgba(212,184,122,0.15)] transition-all duration-300">
                        <input
                          type="text"
                          placeholder="VELLARI20"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          className="flex-1 bg-transparent px-[18px] h-[56px] text-[15px] text-v-black uppercase placeholder:text-v-black/30 focus:outline-none tracking-widest"
                          disabled={couponApplied}
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="px-[24px] h-[56px] bg-v-black hover:bg-v-black/80 text-white rounded-[12px] text-[13px] font-accent font-black uppercase tracking-wider transition-colors shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-[18px] bg-emerald-500/10 border border-emerald-500/30 rounded-[16px] text-[14px] text-emerald-600">
                        <div className="flex items-center gap-[12px]">
                          <Tag size={18} />
                          <span className="font-bold">VELLARI20 — 20% Off</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCouponApplied(false);
                            setDiscount(0);
                            setCoupon("");
                          }}
                          className="text-emerald-600/70 hover:text-red-500 text-[12px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <span className="text-red-500 text-[12px] pl-[8px] font-medium mt-[4px]">{couponError}</span>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-[16px] border-t border-v-black/10 pt-[28px]">
                    <div className="flex justify-between text-[16px] text-v-black/60">
                      <span className="font-light">Subtotal</span>
                      <span className="font-semibold text-v-black">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[16px] text-emerald-600">
                        <span className="font-light">Coupon Discount</span>
                        <span className="font-bold">-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[16px] text-v-black/60">
                      <span className="font-light">Shipping</span>
                      <span className={`font-semibold ${finalShipping === 0 ? "text-emerald-600" : "text-v-black"}`}>
                        {finalShipping === 0 ? "FREE" : `₹${finalShipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[16px] text-v-black/60">
                      <span className="font-light">Estimated GST (5%)</span>
                      <span className="font-semibold text-v-black">₹{tax}</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-v-black/10 pt-[24px] mt-[8px]">
                      <span className="text-v-black font-accent font-black uppercase tracking-wider text-[14px]">Grand Total</span>
                      <span className="text-[40px] font-black text-v-gold font-accent leading-none">₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges Grid */}
                <div className="grid grid-cols-2 gap-[16px]">
                  {TRUST_BADGES.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center h-[74px] gap-[14px] p-[18px] rounded-[20px] border border-v-black/5 bg-white/60"
                    >
                      <div className="w-[38px] h-[38px] rounded-[12px] bg-white border border-v-black/5 flex items-center justify-center text-v-gold shrink-0">
                        <badge.icon size={20} />
                      </div>
                      <span className="text-[13px] text-v-black/70 font-medium leading-tight font-[family-name:var(--font-accent)]">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
