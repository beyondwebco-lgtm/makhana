"use client";

import React from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Package, Heart, UtensilsCrossed, Award,
  ChevronRight, ShoppingBag, ArrowUpRight, CheckCircle2
} from "lucide-react";

const MOCK_RECENT_ORDER = {
  id: "VEL-892401",
  date: "20 July 2026",
  status: "Delivered",
  amount: 898,
  itemsCount: 3,
  timeline: [
    { title: "Order Placed", time: "20 July, 02:30 PM", done: true },
    { title: "Packed & Sealed", time: "20 July, 05:15 PM", done: true },
    { title: "Out for Delivery", time: "22 July, 09:00 AM", done: true },
    { title: "Delivered", time: "22 July, 02:45 PM", done: true },
  ]
};

export default function AccountDashboardPage() {
  const { addToCart } = useCart();

  return (
    <AccountLayout>
      <div className="flex flex-col" style={{ gap: "48px" }}>

        {/* ════════════════════════════════════════
            STATISTICS — 4 Premium Cards (140px)
           ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "24px" }}>
          {[
            { label: "Total Orders", val: "02", icon: Package, href: "/account/orders", color: "text-v-gold" },
            { label: "Wishlist Items", val: "03", icon: Heart, href: "/account/wishlist", color: "text-rose-400" },
            { label: "Saved Bowls", val: "02", icon: UtensilsCrossed, href: "/account/bowls", color: "text-amber-400" },
            { label: "Reward Points", val: "Gold", icon: Award, href: "/account/settings", color: "text-amber-300" },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={st.href}
                  className="block bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between hover:border-v-gold/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,150,26,0.1)] transition-all duration-300 group relative overflow-hidden"
                  style={{ height: "140px", padding: "24px" }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-v-gold/[0.03] rounded-full blur-xl pointer-events-none group-hover:bg-v-gold/[0.08] transition-colors" />

                  <div className="flex items-center justify-between z-10">
                    <span className="text-[13px] font-accent uppercase tracking-wider text-white/45 font-bold">
                      {st.label}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 group-hover:border-v-gold/30 transition-all">
                      <Icon size={18} className={st.color} />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between z-10">
                    <span className="text-3xl lg:text-4xl font-display font-bold text-white group-hover:text-v-gold transition-colors">
                      {st.val}
                    </span>
                    <ArrowUpRight size={16} className="text-white/25 group-hover:text-v-gold transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ════════════════════════════════════════
            RECENT ORDER ACTIVITY — Timeline Card
           ════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
          style={{ padding: "36px" }}
        >
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between" style={{ gap: "16px", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <span className="text-[13px] font-accent uppercase tracking-[3px] text-v-gold font-bold block" style={{ marginBottom: "6px" }}>
                RECENT ORDER
              </span>
              <h3 className="font-display font-bold text-xl text-white">
                Order #{MOCK_RECENT_ORDER.id}
              </h3>
            </div>

            <div className="flex items-center" style={{ gap: "16px" }}>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-accent font-bold uppercase tracking-wider">
                ● {MOCK_RECENT_ORDER.status}
              </span>
              <Link
                href="/account/orders"
                className="text-xs font-accent uppercase tracking-wider font-bold text-v-gold hover:underline flex items-center gap-1"
              >
                View All Orders <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-4" style={{ gap: "28px", marginBottom: "36px" }}>
            {MOCK_RECENT_ORDER.timeline.map((st, idx) => (
              <div key={idx} className="flex flex-col" style={{ gap: "10px" }}>
                <div className="flex items-center" style={{ gap: "12px" }}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    st.done ? "bg-v-gold text-v-black shadow-[0_0_15px_rgba(212,150,26,0.3)]" : "bg-white/10 text-white/40"
                  }`}>
                    {st.done ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span className="font-bold text-sm text-white">{st.title}</span>
                </div>
                <p className="text-xs text-white/35 font-light" style={{ paddingLeft: "48px" }}>
                  {st.time}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between" style={{ gap: "16px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-sm font-light text-white/50">
              Total Amount: <strong className="text-white font-bold">₹{MOCK_RECENT_ORDER.amount}</strong> ({MOCK_RECENT_ORDER.itemsCount} Items)
            </span>
            <button
              onClick={() => alert("Redirecting to tracking...")}
              className="px-7 py-3.5 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-[16px] hover:brightness-110 shadow-[0_4px_20px_rgba(212,150,26,0.2)] active:scale-95 transition-all"
            >
              Track Order
            </button>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            PERSONAL INFORMATION — Overview Card
           ════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          style={{ padding: "36px" }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <span className="text-[13px] font-accent uppercase tracking-[3px] text-v-gold font-bold block" style={{ marginBottom: "6px" }}>
                PROFILE DETAILS
              </span>
              <h3 className="font-display font-bold text-xl text-white">Personal Information</h3>
            </div>
            <Link
              href="/account/settings"
              className="px-5 py-2.5 text-xs font-accent uppercase font-bold tracking-wider bg-white/5 border border-white/10 rounded-[14px] hover:bg-white/10 hover:border-white/20 text-white transition-all"
            >
              Edit Profile
            </Link>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "20px" }}>
            {[
              { label: "Full Name", value: "Pavan Kumar" },
              { label: "Email Address", value: "pavan@vellari.com" },
              { label: "Phone Number", value: "+91 98765 43210" },
            ].map((info, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-[18px]" style={{ padding: "20px 24px" }}>
                <span className="text-white/35 text-xs font-accent uppercase tracking-wider font-bold block" style={{ marginBottom: "8px" }}>
                  {info.label}
                </span>
                <span className="font-bold text-white text-base">{info.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </AccountLayout>
  );
}
