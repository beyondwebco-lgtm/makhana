"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "#products" },
  { label: "Find My Flavor", href: "#products" },
  { label: "About Us", href: "#story" },
  { label: "Why Vellari", href: "#story" },
  { label: "Offers / Reviews", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setPastHero(y > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-v-black border-b border-white/5">
        <div className="overflow-hidden h-10 flex items-center">
          <div className="animate-ticker whitespace-nowrap flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-6 px-8 text-[10px] md:text-[11px] tracking-[2px] md:tracking-[3px] text-v-cream/80 uppercase font-[family-name:var(--font-accent)]"
              >
                <span>✦ Free Shipping on Orders Above ₹499</span>
                <span className="text-v-gold">•</span>
                <span>✦ Roasted, Not Fried</span>
                <span className="text-v-gold">•</span>
                <span>✦ High in Protein · Gluten Free</span>
                <span className="text-v-gold">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn(
          "fixed top-10 left-0 right-0 z-[55] transition-all duration-500",
          scrolled
            ? pastHero
              ? "bg-v-cream/95 backdrop-blur-xl shadow-sm py-4 border-b border-v-black/5"
              : "bg-v-black/90 backdrop-blur-xl py-4 border-b border-white/5"
            : "py-6 bg-transparent"
        )}
      >
        <nav className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group flex items-center z-50 shrink-0">
            <img
              src="/logo.png"
              alt="Vellari Logo"
              className={cn(
                "w-auto object-contain transition-all duration-500",
                scrolled ? "h-14 md:h-18" : "h-20 md:h-24",
                pastHero && scrolled ? "opacity-100" : "opacity-90 hover:opacity-100"
              )}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center gap-10 xl:gap-12 absolute left-1/2 -translate-x-1/2 w-max">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "relative text-[11px] xl:text-[12px] font-[family-name:var(--font-accent)] font-semibold tracking-[2px] uppercase transition-colors duration-300 group bg-transparent border-none cursor-pointer",
                  pastHero && scrolled
                    ? "text-v-black/70 hover:text-v-black"
                    : "text-white/70 hover:text-v-cream"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover:w-full",
                    pastHero && scrolled ? "bg-v-black" : "bg-v-gold"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3 z-50 shrink-0">
            {[
              { icon: Search, label: "Search", hideOnMobile: true },
              { icon: User, label: "Account", hideOnMobile: true },
              { icon: Heart, label: "Wishlist", hideOnMobile: true },
            ].map(({ icon: Icon, label, hideOnMobile }) => (
              <button
                key={label}
                className={cn(
                  "w-10 h-10 items-center justify-center rounded-full transition-all duration-300",
                  hideOnMobile ? "hidden md:flex" : "flex",
                  pastHero && scrolled
                    ? "hover:bg-v-black/5"
                    : "hover:bg-white/10"
                )}
                aria-label={label}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    pastHero && scrolled
                      ? "text-v-black/60 hover:text-v-black"
                      : "text-white/60 hover:text-v-cream"
                  )}
                />
              </button>
            ))}

            {/* Cart */}
            <button
              className={cn(
                "relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                pastHero && scrolled
                  ? "hover:bg-v-black/5"
                  : "hover:bg-white/10"
              )}
              aria-label="Cart"
            >
              <ShoppingBag
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  pastHero && scrolled
                    ? "text-v-black/60 hover:text-v-black"
                    : "text-white/60 hover:text-v-cream"
                )}
              />
              <span className="absolute top-0 right-0 w-4 h-4 bg-v-gold text-v-black text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-sm">
                0
              </span>
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                pastHero && scrolled && !mobileOpen
                  ? "hover:bg-v-black/5"
                  : "hover:bg-white/10"
              )}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-v-cream" />
              ) : (
                <Menu
                  className={cn(
                    "w-6 h-6",
                    pastHero && scrolled ? "text-v-black" : "text-v-cream"
                  )}
                />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-0 z-[50] bg-v-black/98 backdrop-blur-2xl lg:hidden flex flex-col justify-center px-8"
            style={{ paddingTop: "80px" }}
          >
            <div className="flex flex-col gap-6 max-w-sm mx-auto w-full">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="w-full text-center"
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-2xl font-[family-name:var(--font-accent)] font-semibold tracking-[4px] text-v-cream/70 hover:text-v-gold transition-colors uppercase bg-transparent border-none cursor-pointer py-2"
                  >
                    {link.label}
                  </button>
                </motion.div>
              ))}
              
              {/* Mobile Actions Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10"
              >
                {[
                  { icon: Search, label: "Search" },
                  { icon: User, label: "Account" },
                  { icon: Heart, label: "Wishlist" },
                  { icon: ShoppingBag, label: "Cart" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-2 text-v-muted hover:text-v-gold transition-colors"
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-[9px] uppercase tracking-wider font-[family-name:var(--font-accent)]">
                      {label}
                    </span>
                  </button>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-[10px] tracking-[4px] text-v-muted/40 uppercase font-[family-name:var(--font-accent)] mt-8"
              >
                Flirty Flavours. Crunchy Feelings.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
