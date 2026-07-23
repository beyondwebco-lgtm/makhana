"use client";

import React from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import { Bell, Sparkles, Truck, PackageCheck } from "lucide-react";

const NOTIFS = [
  {
    id: "notif-1",
    type: "order",
    title: "Order #VEL-892401 Delivered!",
    desc: "Your delicious Vellari snacks were delivered successfully. Enjoy your crunch!",
    time: "2 days ago",
    read: true,
    icon: PackageCheck
  },
  {
    id: "notif-2",
    type: "offer",
    title: "Exclusive Member Perk Unlocked 🎉",
    desc: "Use code GOLD20 to get 20% extra discount on all custom signature combos.",
    time: "5 days ago",
    read: false,
    icon: Sparkles
  },
  {
    id: "notif-3",
    type: "shipping",
    title: "Order #VEL-884192 Shipped",
    desc: "Your package is on its way via Shiprocket Express.",
    time: "1 week ago",
    read: true,
    icon: Truck
  }
];

export default function AccountNotificationsPage() {
  return (
    <AccountLayout activeBadgeCounts={{ notifications: 1 }}>
      <div className="flex flex-col" style={{ gap: "48px" }}>
        <div>
          <span className="text-[13px] font-accent uppercase tracking-[4px] font-bold text-v-gold block" style={{ marginBottom: "8px" }}>
            TIMELINE ALERTS
          </span>
          <h2 className="font-display font-bold text-3xl text-white">Notifications</h2>
        </div>

        <div className="flex flex-col" style={{ gap: "24px" }}>
          {NOTIFS.map((n, i) => {
            const Icon = n.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`rounded-[24px] border flex items-start transition-all ${
                  n.read
                    ? "bg-[#111111]/80 backdrop-blur-xl border-white/[0.08]"
                    : "bg-[#161616] border-v-gold/40 shadow-[0_0_30px_rgba(212,150,26,0.12)]"
                }`}
                style={{ padding: "36px", gap: "24px" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-v-gold/10 border border-v-gold/30 flex items-center justify-center text-v-gold shrink-0 shadow-[0_0_15px_rgba(212,150,26,0.15)]">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between" style={{ gap: "12px", marginBottom: "8px" }}>
                    <h4 className="font-bold text-lg text-white">{n.title}</h4>
                    <span className="text-xs text-white/40 shrink-0 font-bold uppercase tracking-wider">{n.time}</span>
                  </div>
                  <p className="text-sm text-white/60 font-light leading-relaxed">{n.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AccountLayout>
  );
}
