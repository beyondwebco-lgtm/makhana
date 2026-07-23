"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import LightRays from "@/components/ui/LightRays";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User, ShoppingBag, Heart, MapPin, UtensilsCrossed,
  Star, Bell, Settings, LogOut, Sparkles, Menu, X, Edit2
} from "lucide-react";

interface AccountLayoutProps {
  children: React.ReactNode;
  activeBadgeCounts?: {
    orders?: number;
    wishlist?: number;
    bowls?: number;
    notifications?: number;
  };
}

const NAV_ITEMS = [
  { id: "dashboard", href: "/account", label: "Dashboard", icon: User },
  { id: "orders", href: "/account/orders", label: "My Orders", icon: ShoppingBag, badgeKey: "orders" },
  { id: "wishlist", href: "/account/wishlist", label: "Wishlist", icon: Heart, badgeKey: "wishlist" },
  { id: "addresses", href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { id: "bowls", href: "/account/bowls", label: "Custom Bowls", icon: UtensilsCrossed, badgeKey: "bowls" },
  { id: "reviews", href: "/account/reviews", label: "Reviews", icon: Star },
  { id: "notifications", href: "/account/notifications", label: "Notifications", icon: Bell, badgeKey: "notifications" },
  { id: "settings", href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountLayout({ children, activeBadgeCounts }: AccountLayoutProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const counts = { orders: 2, wishlist: 3, bowls: 2, notifications: 1, ...activeBadgeCounts };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-body selection:bg-v-gold/30 relative overflow-hidden">

      {/* ── Ambient Background Lighting ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-80">
          <LightRays
            raysOrigin="top-center"
            raysColor="#d4961a"
            raysSpeed={1.5}
            lightSpread={1.8}
            rayLength={2.0}
            fadeDistance={1.2}
            noiseAmount={0.05}
            distortion={0.08}
            className="w-full h-full"
          />
        </div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-v-gold/[0.035] rounded-full blur-[200px]" />
        <div className="absolute top-[50%] right-[-15%] w-[500px] h-[500px] bg-v-gold/[0.02] rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-v-gold/[0.015] rounded-full blur-[200px]" />
      </div>

      <div className="grain" />
      <Navbar />

      {/* ════════════════════════════════════════════════
          MAIN CONTENT
         ════════════════════════════════════════════════ */}
      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10" style={{ paddingTop: "180px", paddingBottom: "100px" }}>

        {/* ── MOBILE NAV TOGGLE ── */}
        <div className="lg:hidden" style={{ marginBottom: "32px" }}>
          <div className="flex items-center justify-between bg-[#111111]/80 backdrop-blur-xl rounded-[20px] border border-white/[0.08]" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-v-gold/20 border border-v-gold/40 flex items-center justify-center font-bold text-v-gold text-sm shadow-[0_0_15px_rgba(212,150,26,0.2)]">
                P
              </div>
              <div>
                <p className="text-sm font-bold font-accent text-white">Pavan Kumar</p>
                <p className="text-[11px] text-white/40 uppercase tracking-wider" style={{ marginTop: "2px" }}>
                  {NAV_ITEMS.find(n => n.href === pathname)?.label || "Account"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="px-5 py-2.5 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-xl flex items-center gap-2 shadow-[0_4px_15px_rgba(212,150,26,0.2)] active:scale-95 transition-all"
            >
              {mobileDrawerOpen ? <X size={16} /> : <Menu size={16} />}
              Menu
            </button>
          </div>
        </div>

        {/* ── SIDEBAR + CONTENT FLEX ── */}
        <div className="flex flex-col lg:flex-row items-start" style={{ gap: "40px" }}>

          {/* ══════════════════════════════
              SIDEBAR (280px)
             ══════════════════════════════ */}
          <aside className={`w-full lg:w-[280px] shrink-0 flex flex-col ${mobileDrawerOpen ? "block" : "hidden lg:flex"}`} style={{ gap: "28px" }}>

            {/* Profile Card */}
            <div
              className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center text-center relative overflow-hidden"
              style={{ padding: "36px 28px" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-v-gold/[0.05] rounded-full blur-2xl pointer-events-none" />

              {/* Avatar */}
              <div className="relative w-[80px] h-[80px] rounded-full bg-[#161616] border-2 border-v-gold/40 shadow-[0_0_25px_rgba(212,150,26,0.15)] flex items-center justify-center" style={{ marginBottom: "20px" }}>
                <div className="w-full h-full rounded-full bg-v-gold/10 flex items-center justify-center font-display font-bold text-2xl text-v-gold">
                  PK
                </div>
                <Link
                  href="/account/settings"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-v-gold text-v-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                  title="Edit Profile"
                >
                  <Edit2 size={12} />
                </Link>
              </div>

              <h3 className="font-display font-bold text-lg text-white tracking-wide">Pavan Kumar</h3>

              <p className="text-xs text-white/45 font-light" style={{ marginTop: "4px", marginBottom: "16px" }}>
                pavan@vellari.com
              </p>

              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-v-gold/10 border border-v-gold/25 text-v-gold text-[11px] font-accent font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(212,150,26,0.1)]">
                <Sparkles size={12} />
                Vellari Gold Member
              </span>
            </div>

            {/* Navigation List */}
            <div
              className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col"
              style={{ padding: "12px" }}
            >
              <div className="flex flex-col" style={{ gap: "4px" }}>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const badgeCount = item.badgeKey ? (counts as any)[item.badgeKey] : undefined;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`w-full flex items-center justify-between rounded-[16px] text-[13px] font-accent uppercase tracking-wider font-bold transition-all duration-300 relative overflow-hidden group ${
                        isActive
                          ? "bg-gradient-to-r from-v-gold/20 via-v-gold/10 to-transparent text-v-gold border-l-[3px] border-v-gold shadow-[0_0_25px_rgba(212,150,26,0.1)]"
                          : "text-white/50 hover:text-white hover:bg-white/[0.03] hover:translate-x-0.5 border-l-[3px] border-transparent"
                      }`}
                      style={{ padding: "14px 16px" }}
                    >
                      <div className="flex items-center gap-3 z-10">
                        <Icon size={17} className={isActive ? "text-v-gold" : "text-white/35 group-hover:text-white/70"} />
                        <span>{item.label}</span>
                      </div>

                      {badgeCount !== undefined && badgeCount > 0 && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold z-10 ${
                          isActive ? "bg-v-gold text-v-black" : "bg-white/10 text-white/60"
                        }`}>
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="bg-white/[0.06]" style={{ height: "1px", margin: "8px 0" }} />

              <button
                onClick={() => alert("Logged out successfully")}
                className="w-full flex items-center gap-3 rounded-[16px] text-[13px] font-accent uppercase tracking-wider font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                style={{ padding: "14px 16px" }}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* ══════════════════════════════
              MAIN CONTENT (Flexible)
             ══════════════════════════════ */}
          <section className="flex-1 w-full min-w-0 flex flex-col" style={{ gap: "48px" }}>
            
            {/* ── WELCOME HEADER ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-left w-full"
            >
              <span className="text-[13px] font-accent uppercase tracking-[5px] font-bold text-v-gold block" style={{ marginBottom: "12px" }}>
                MY ACCOUNT
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-display font-bold text-white tracking-tight leading-[1.15]" style={{ marginBottom: "16px" }}>
                Welcome back, <span className="gradient-gold">Pavan Kumar</span>
              </h1>

              <p className="text-white/50 text-base sm:text-lg font-light leading-relaxed" style={{ marginTop: "8px" }}>
                Manage your profile, orders, wishlist, saved bowls and settings.
              </p>
            </motion.div>

            {children}
          </section>

        </div>
      </main>

      {/* Spacer before Footer */}
      <div style={{ height: "100px" }} />

      <Footer />
    </div>
  );
}
