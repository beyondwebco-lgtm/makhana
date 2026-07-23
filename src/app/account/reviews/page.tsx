"use client";

import React from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";

const REVIEWS = [
  {
    id: "rev-1",
    product: "Love Bite (Cheese Makhana)",
    rating: 5,
    date: "14 July 2026",
    comment: "The cheese flavor is unreal! Super crunchy and high protein. Easily my go-to late night snack.",
    verified: true
  },
  {
    id: "rev-2",
    product: "Red Flag (Peri Peri Makhana)",
    rating: 5,
    date: "02 June 2026",
    comment: "Bold spice kick! Paired perfectly with cold beverages. Will definitely buy the 3-pack combo next time.",
    verified: true
  }
];

export default function AccountReviewsPage() {
  return (
    <AccountLayout>
      <div className="flex flex-col" style={{ gap: "48px" }}>
        <div>
          <span className="text-[13px] font-accent uppercase tracking-[4px] font-bold text-v-gold block" style={{ marginBottom: "8px" }}>
            CUSTOMER FEEDBACK
          </span>
          <h2 className="font-display font-bold text-3xl text-white">My Reviews</h2>
        </div>

        <div className="flex flex-col" style={{ gap: "24px" }}>
          {REVIEWS.map((rev, i) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col"
              style={{ padding: "36px", gap: "16px" }}
            >
              <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08]" style={{ gap: "8px", paddingBottom: "16px" }}>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">{rev.product}</h3>
                  <span className="text-xs text-white/40">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-v-gold">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-v-gold" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-white/80 font-light leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {rev.verified && (
                <span className="text-[11px] font-accent uppercase font-bold text-emerald-400 tracking-wider">
                  ✓ Verified Buyer Review
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
