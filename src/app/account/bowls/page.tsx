"use client";

import React, { useState } from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { UtensilsCrossed, Plus, Reorder, Trash2, ArrowRight } from "lucide-react";

const INITIAL_BOWLS = [
  {
    id: "bowl-1",
    name: "Pavan's Midnight Crunch",
    flavors: ["Love Bite (Cheese)", "Red Flag (Peri Peri)", "Green Flag (Mint)"],
    price: 499,
    created: "12 July 2026"
  },
  {
    id: "bowl-2",
    name: "Spicy High-Protein Mix",
    flavors: ["Red Flag (Peri Peri)", "Love Bite (Cheese)"],
    price: 429,
    created: "02 June 2026"
  }
];

export default function AccountBowlsPage() {
  const { addCustomToCart } = useCart();
  const [bowls, setBowls] = useState(INITIAL_BOWLS);

  const handleDelete = (id: string) => {
    setBowls(bowls.filter(b => b.id !== id));
  };

  return (
    <AccountLayout activeBadgeCounts={{ bowls: bowls.length }}>
      <div className="flex flex-col" style={{ gap: "48px" }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[13px] font-accent uppercase tracking-[4px] font-bold text-v-gold block" style={{ marginBottom: "8px" }}>
              PERSONAL CREATIONS
            </span>
            <h2 className="font-display font-bold text-3xl text-white">Saved Custom Bowls</h2>
          </div>
          <Link
            href="/create-your-bowl"
            className="px-5 py-3 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-[16px] flex items-center gap-2 hover:brightness-110 shadow-[0_4px_20px_rgba(212,150,26,0.2)] active:scale-95 transition-all"
          >
            <Plus size={16} />
            Create New Bowl
          </Link>
        </div>

        {bowls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "24px" }}>
            {bowls.map((bowl, i) => (
              <motion.div
                key={bowl.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between group hover:border-v-gold/30 transition-all duration-300"
                style={{ padding: "36px" }}
              >
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                    <span className="text-[11px] font-accent uppercase tracking-wider text-v-gold font-bold">
                      Custom Signature Combo
                    </span>
                    <span className="text-xs text-white/40">{bowl.created}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-v-gold transition-colors" style={{ marginBottom: "16px" }}>
                    {bowl.name}
                  </h3>

                  <div className="flex flex-wrap" style={{ gap: "8px", marginBottom: "24px" }}>
                    {bowl.flavors.map((fl, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/80 text-xs font-medium">
                        {fl}
                      </span>
                    ))}
                  </div>

                  <span className="font-bold text-xl text-white block" style={{ marginBottom: "24px" }}>₹{bowl.price}</span>
                </div>

                <div className="flex border-t border-white/[0.08]" style={{ gap: "12px", paddingTop: "24px" }}>
                  <button
                    onClick={() => {
                      addCustomToCart({
                        slug: bowl.id,
                        name: bowl.name,
                        price: bowl.price,
                        image: "/products/6.png",
                        flavor: bowl.flavors.join(" • ")
                      });
                      alert(`${bowl.name} reordered & added to cart!`);
                    }}
                    className="flex-1 py-3.5 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-[14px] hover:brightness-110 shadow-[0_4px_20px_rgba(212,150,26,0.2)] active:scale-95 transition-all text-center"
                  >
                    Reorder Bowl
                  </button>
                  <button
                    onClick={() => handleDelete(bowl.id)}
                    className="px-4 py-3.5 text-xs bg-white/5 border border-white/10 text-white/50 rounded-[14px] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                    title="Delete saved bowl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-[#111111]/80 backdrop-blur-xl rounded-[24px] border border-white/[0.08]" style={{ padding: "80px 32px" }}>
            <UtensilsCrossed size={40} className="text-white/20 mx-auto" style={{ marginBottom: "16px" }} />
            <h3 className="font-bold text-xl text-white">No saved custom bowls</h3>
            <p className="text-sm text-white/50 font-light" style={{ marginTop: "8px", marginBottom: "28px" }}>Mix your favourite flavours and save your own signature bowl.</p>
            <Link href="/create-your-bowl" className="btn-primary py-3.5 px-8 text-xs">
              Create Your Bowl
            </Link>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
