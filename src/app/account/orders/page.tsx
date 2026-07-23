"use client";

import React from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

const ORDERS = [
  {
    id: "VEL-892401",
    date: "20 July 2026",
    status: "Delivered",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amount: 898,
    items: [
      { slug: "love-bite", name: "Love Bite (Cheese)", qty: 2, price: 299, image: "/products/6.png" },
      { slug: "red-flag", name: "Red Flag (Peri Peri)", qty: 1, price: 299, image: "/products/1.png" }
    ]
  },
  {
    id: "VEL-884192",
    date: "10 July 2026",
    status: "In Transit",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    amount: 449,
    items: [
      { slug: "bold-hearts", name: "Bold Hearts Combo", qty: 1, price: 449, image: "/assets/combos/bold-heart.png" }
    ]
  }
];

export default function AccountOrdersPage() {
  const { addToCart } = useCart();

  return (
    <AccountLayout>
      <div className="flex flex-col" style={{ gap: "48px" }}>

        {/* Page Title */}
        <div>
          <span className="text-[13px] font-accent uppercase tracking-[4px] font-bold text-v-gold block" style={{ marginBottom: "8px" }}>
            PURCHASE HISTORY
          </span>
          <h2 className="font-display font-bold text-3xl text-white">My Orders</h2>
        </div>

        {/* Orders List */}
        <div className="flex flex-col" style={{ gap: "28px" }}>
          {ORDERS.map((ord, i) => (
            <motion.div
              key={ord.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              style={{ padding: "36px" }}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between" style={{ gap: "20px", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <span className="text-[11px] font-accent uppercase tracking-wider text-white/35 font-bold block" style={{ marginBottom: "4px" }}>Order ID</span>
                  <span className="font-display font-bold text-xl text-white">{ord.id}</span>
                </div>
                <div>
                  <span className="text-[11px] font-accent uppercase tracking-wider text-white/35 font-bold block" style={{ marginBottom: "4px" }}>Date</span>
                  <span className="text-sm font-semibold text-white/80">{ord.date}</span>
                </div>
                <div>
                  <span className="text-[11px] font-accent uppercase tracking-wider text-white/35 font-bold block" style={{ marginBottom: "4px" }}>Total</span>
                  <span className="font-bold text-base text-v-gold">₹{ord.amount}</span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-accent font-bold uppercase tracking-wider border ${ord.statusColor}`}>
                  ● {ord.status}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col" style={{ gap: "16px", marginBottom: "32px" }}>
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-[18px]" style={{ gap: "16px", padding: "16px 20px" }}>
                    <div className="flex items-center" style={{ gap: "16px" }}>
                      <div className="w-16 h-16 relative bg-[#161616] border border-white/[0.08] rounded-[14px] shrink-0" style={{ padding: "8px" }}>
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{item.name}</h4>
                        <p className="text-xs text-white/40" style={{ marginTop: "4px" }}>Qty: {item.qty} × ₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-base text-white shrink-0">₹{item.qty * item.price}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-end" style={{ gap: "12px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={() => alert(`Tracking ${ord.id}...`)}
                  className="px-7 py-3.5 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-[16px] hover:brightness-110 shadow-[0_4px_20px_rgba(212,150,26,0.2)] active:scale-95 transition-all"
                >
                  Track Package
                </button>
                <button
                  onClick={() => { ord.items.forEach(i => addToCart(i.slug, i.qty)); alert("Items added to cart!"); }}
                  className="px-7 py-3.5 text-xs font-accent font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white rounded-[16px] hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  Buy Again
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </AccountLayout>
  );
}
