"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, Calendar, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("ORD-XXXXXX");

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  // Generate a random estimated delivery date (2-3 days from now)
  const getDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center pt-32 pb-24 px-6">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-green-500/5 blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-[640px] bg-[#111] rounded-[3rem] border border-white/5 p-8 sm:p-12 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-0" />
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-green-400 mb-6 relative z-10"
          >
            <CheckCircle2 size={72} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10"
          >
            <span className="text-[var(--v-gold)] text-xs uppercase tracking-[4px] font-accent font-bold mb-3 block">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
              Thank You For Your Order!
            </h1>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 font-light max-w-sm mx-auto">
              Your payment was successful and we are preparing your premium roasted makhana bowl package.
            </p>

            {/* Order Details box */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Order ID</span>
                <span className="font-accent font-bold text-white">{orderId}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                <span className="text-white/50 flex items-center gap-2">
                  <Calendar size={14} className="text-[var(--v-gold)]" />
                  Estimated Delivery
                </span>
                <span className="font-bold text-white text-right text-xs sm:text-sm">{getDeliveryDate()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                <span className="text-white/50 flex items-center gap-2">
                  <Mail size={14} className="text-[var(--v-gold)]" />
                  Confirmation Email
                </span>
                <span className="font-bold text-white text-xs sm:text-sm">Sent to your inbox</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/#products">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--v-gold)] px-8 py-4 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-black shadow-lg shadow-[var(--v-gold)]/10"
                >
                  <ShoppingBag size={14} />
                  Continue Shopping
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>

      </main>
      <Footer />
    </>
  );
}
