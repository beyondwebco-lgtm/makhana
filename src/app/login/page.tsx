"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff,
  ShieldCheck, Database, ArrowRight, Loader2, Sparkles, KeyRound
} from "lucide-react";

/* ─────────────────────────────────────────────
   FLOATING PARTICLE  (ambient background dot)
───────────────────────────────────────────── */
function Particle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-v-gold pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, opacity: 0 }}
      animate={{ opacity: [0, 0.35, 0], y: [0, -60, -120], scale: [1, 1.2, 0.6] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Pre-seeded deterministic particle data — avoids SSR/client hydration mismatch
const PARTICLES = [
  { id: 0,  x: 12.5,  y: 45.2,  size: 1.8,  delay: 0.0,  duration: 7.2 },
  { id: 1,  x: 28.3,  y: 62.7,  size: 2.4,  delay: 1.1,  duration: 8.5 },
  { id: 2,  x: 44.8,  y: 38.1,  size: 1.2,  delay: 2.3,  duration: 6.8 },
  { id: 3,  x: 61.2,  y: 78.4,  size: 3.0,  delay: 0.7,  duration: 9.1 },
  { id: 4,  x: 77.6,  y: 52.9,  size: 1.6,  delay: 3.2,  duration: 7.6 },
  { id: 5,  x: 90.1,  y: 33.6,  size: 2.2,  delay: 1.8,  duration: 8.0 },
  { id: 6,  x: 5.4,   y: 87.3,  size: 1.4,  delay: 4.1,  duration: 6.5 },
  { id: 7,  x: 35.7,  y: 31.8,  size: 2.8,  delay: 0.4,  duration: 9.4 },
  { id: 8,  x: 52.1,  y: 94.2,  size: 1.0,  delay: 2.9,  duration: 7.8 },
  { id: 9,  x: 68.4,  y: 41.5,  size: 2.6,  delay: 1.5,  duration: 8.3 },
  { id: 10, x: 83.9,  y: 69.8,  size: 1.9,  delay: 3.7,  duration: 6.9 },
  { id: 11, x: 20.2,  y: 57.3,  size: 3.2,  delay: 0.2,  duration: 9.7 },
  { id: 12, x: 47.6,  y: 81.1,  size: 1.5,  delay: 4.6,  duration: 7.1 },
  { id: 13, x: 73.3,  y: 44.7,  size: 2.1,  delay: 2.1,  duration: 8.8 },
  { id: 14, x: 8.8,   y: 70.5,  size: 1.3,  delay: 3.4,  duration: 6.6 },
  { id: 15, x: 38.5,  y: 96.2,  size: 2.7,  delay: 0.9,  duration: 9.2 },
  { id: 16, x: 57.9,  y: 35.4,  size: 1.7,  delay: 4.3,  duration: 7.5 },
  { id: 17, x: 92.4,  y: 82.6,  size: 2.3,  delay: 1.6,  duration: 8.1 },
];

/* ─────────────────────────────────────────────
   PREMIUM INPUT FIELD
───────────────────────────────────────────── */
interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
  delay?: number;
}

function InputField({ label, type, value, onChange, placeholder, icon, rightElement, required, autoComplete, delay = 0 }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2"
    >
      <label className={`text-[11px] font-accent font-bold uppercase tracking-[2px] transition-colors duration-300 ${focused ? "text-v-gold" : "text-white/40"}`}>
        {label}
      </label>
      <div
        className="relative"
        style={{
          borderRadius: 16,
          boxShadow: focused ? "0 0 0 3px rgba(212,150,26,0.12), 0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Icon */}
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? "text-v-gold" : "text-white/25"}`}>
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          style={{
            height: 60,
            paddingLeft: 56,
            paddingRight: rightElement ? 56 : 20,
            fontSize: 15,
            borderRadius: 16,
            background: focused ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.025)",
            border: focused ? "1.5px solid rgba(212,150,26,0.55)" : "1.5px solid rgba(255,255,255,0.07)",
            color: "#fff",
            width: "100%",
            outline: "none",
            transition: "background 0.3s ease, border-color 0.3s ease",
            letterSpacing: type === "password" && value ? "0.2em" : "normal",
          }}
          className="placeholder:text-white/20"
        />

        {rightElement && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const btnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  /* Mouse parallax for left image */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const imgX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const imgY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  /* Ripple effect */
  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/account");
    }, 1800);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex bg-[#070707] font-body selection:bg-v-gold/30 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── GLOBAL AMBIENT PARTICLES (client-only to avoid hydration mismatch) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted && PARTICLES.map((p) => <Particle key={p.id} {...p} />)}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-v-gold/[0.025] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-amber-600/[0.015] rounded-full blur-[200px]" />
      </div>

      {/* ── NOISE GRAIN ── */}
      <div className="grain fixed inset-0 z-[1] pointer-events-none opacity-30" />

      {/* ════════════════════════════════════════════════
          LEFT SIDE — 55% — CINEMATIC BRAND EXPERIENCE
         ════════════════════════════════════════════════ */}
      <div className="hidden lg:flex relative w-[55%] h-screen overflow-hidden z-10 flex-col">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-[-6%] z-0"
          style={{ x: imgX, y: imgY }}
        >
          <Image
            src="/lifestyle/1.png"
            alt="Vellari Premium Lifestyle"
            fill
            className="object-cover"
            priority
            style={{ filter: "blur(0px) brightness(0.75)" }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#070707]/70 via-black/25 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#070707]/80 via-transparent to-black/30" />
        {/* Warm golden vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 z-10 bg-gradient-to-t from-[#d4961a]/[0.08] to-transparent" />

        {/* ── LEFT CONTENT ── */}
        <div className="relative z-20 flex flex-col h-full px-16 py-14">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Vellari Logo"
                width={160}
                height={80}
                className="w-auto h-14 object-contain drop-shadow-2xl"
              />
            </Link>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Brand text — pushed to upper-middle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: "20%" }}
          >
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-v-gold/20 text-v-gold text-[10px] font-accent font-bold uppercase tracking-[3px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] mb-8"
            >
              <Sparkles size={12} />
              Members Only
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-display font-bold text-white tracking-tight leading-[1.08]"
              style={{ fontSize: "clamp(40px, 4vw, 58px)", marginBottom: 24 }}
            >
              Welcome back to<br />
              <span className="gradient-gold">Pure Indulgence.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="text-white/55 font-light leading-[1.75]"
              style={{ fontSize: 16, maxWidth: 480 }}
            >
              Access your account to manage orders, wishlist, saved bowls,
              addresses, rewards and exclusive member benefits.
            </motion.p>

            {/* Floating product jar */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mt-12 hidden xl:block"
            >
              <div className="flex items-center gap-5">
                {[
                  { label: "Orders", value: "02" },
                  { label: "Rewards", value: "Gold" },
                  { label: "Saved Bowls", value: "02" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                    className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4"
                  >
                    <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-white/40 mb-1">{s.label}</p>
                    <p className="text-2xl font-display font-bold text-white">{s.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          RIGHT SIDE — 45% — AUTHENTICATION CARD
         ════════════════════════════════════════════════ */}
      <div className="flex-1 h-screen flex flex-col items-center justify-center relative z-20 px-6 sm:px-10 py-16 overflow-y-auto">

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-10 shrink-0">
          <Image src="/logo.png" alt="Vellari Logo" width={130} height={65} className="w-auto h-12 object-contain" />
        </Link>

        {/* ── GLASSMORPHISM CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full relative"
          style={{
            maxWidth: 500,
            background: "rgba(15,15,15,0.88)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(212,150,26,0.14)",
            borderRadius: 28,
            padding: "48px 44px",
            boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03) inset",
          }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-v-gold/40 to-transparent rounded-full" />
          {/* Top ambient glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-52 h-28 bg-v-gold/[0.07] rounded-full blur-[50px] pointer-events-none" />

          {/* ── CARD HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ marginBottom: 40, textAlign: "center" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-v-gold/10 border border-v-gold/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,150,26,0.1)]">
              <KeyRound size={24} className="text-v-gold" />
            </div>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[1.1]"
              style={{ fontSize: 38, marginBottom: 12 }}
            >
              Sign in to your<br />Account
            </h2>
            <p className="text-white/40 font-light" style={{ fontSize: 15 }}>
              Access your Vellari dashboard securely.
            </p>
          </motion.div>

          {/* ── FORM ── */}
          <form onSubmit={handleLogin}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Email */}
              <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="hello@vellari.com"
                icon={<Mail size={20} />}
                required
                autoComplete="email"
                delay={0.35}
              />

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-accent font-bold uppercase tracking-[2px] text-white/40">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[11px] font-accent font-bold uppercase tracking-wider text-v-gold hover:text-amber-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </motion.div>

              {/* Remember Me */}
              <motion.label
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex items-center gap-3.5 cursor-pointer group"
                style={{ marginTop: 4 }}
              >
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      border: rememberMe ? "1.5px solid rgba(212,150,26,0.8)" : "1.5px solid rgba(255,255,255,0.12)",
                      background: rememberMe ? "rgba(212,150,26,0.15)" : "rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {rememberMe && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        width="11" height="8" viewBox="0 0 11 8" fill="none"
                      >
                        <path d="M1 4L3.8 6.5L10 1" stroke="#d4961a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-white/45 font-light group-hover:text-white/65 transition-colors select-none">
                  Remember me for 30 days
                </span>
              </motion.label>

              {/* ── PRIMARY BUTTON ── */}
              <motion.button
                ref={btnRef}
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.62 }}
                whileHover={{ scale: isLoading ? 1 : 1.015, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.985 }}
                onClick={(e) => { if (!isLoading) addRipple(e); }}
                className="relative overflow-hidden disabled:cursor-not-allowed"
                style={{
                  height: 60,
                  borderRadius: 16,
                  marginTop: 8,
                  background: isLoading
                    ? "linear-gradient(135deg, rgba(212,150,26,0.5), rgba(180,120,20,0.5))"
                    : "linear-gradient(135deg, #d4961a 0%, #f0b429 50%, #d4961a 100%)",
                  backgroundSize: "200% 100%",
                  border: "none",
                  boxShadow: isLoading
                    ? "none"
                    : "0 8px 32px rgba(212,150,26,0.3), 0 2px 8px rgba(212,150,26,0.2)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "box-shadow 0.3s ease, background 0.4s ease",
                }}
              >
                {/* Hover shine sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  initial={{ backgroundPosition: "-100% 0" }}
                  whileHover={{ backgroundPosition: "200% 0" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* Ripples */}
                {ripples.map((r) => (
                  <motion.span
                    key={r.id}
                    className="absolute bg-white/30 rounded-full pointer-events-none"
                    style={{ left: r.x - 4, top: r.y - 4, width: 8, height: 8 }}
                    animate={{ scale: [1, 12], opacity: [0.6, 0] }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                  />
                ))}

                {/* Label */}
                <div className="relative z-10 flex items-center justify-center gap-2.5 font-accent font-bold uppercase tracking-[2.5px] text-v-black" style={{ fontSize: 13 }}>
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={18} className="animate-spin" />
                        Authenticating…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2"
                      >
                        Sign In
                        <ArrowRight size={17} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </form>

          {/* ── DIVIDER ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-4"
            style={{ margin: "28px 0" }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
            <span className="text-[10px] font-accent font-bold uppercase tracking-[3px] text-white/25 shrink-0">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
          </motion.div>

          {/* ── GOOGLE BUTTON ── */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            type="button"
            className="w-full flex items-center justify-center gap-3 font-accent font-bold text-white/70 hover:text-white transition-all"
            style={{
              height: 60,
              borderRadius: 16,
              background: "rgba(255,255,255,0.025)",
              border: "1.5px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              fontSize: 13,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              transition: "background 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.055)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.16)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.025)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </motion.button>

          {/* ── SIGN UP LINK ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.82 }}
            className="text-center text-white/35 font-light"
            style={{ fontSize: 14, marginTop: 28 }}
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-v-gold font-bold hover:text-amber-300 transition-colors"
              style={{ textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Create One
            </Link>
          </motion.p>
        </motion.div>

        {/* ── TRUST BADGES ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="flex items-center justify-center flex-wrap"
          style={{ gap: "28px", marginTop: 32 }}
        >
          {[
            { icon: <ShieldCheck size={15} />, label: "Secure Login" },
            { icon: <Database size={15} />, label: "Encrypted Sessions" },
            { icon: <KeyRound size={15} />, label: "Powered by Supabase" },
          ].map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              whileHover={{ opacity: 1 }}
              className="flex items-center gap-2 cursor-default"
              style={{ opacity: 0.35, transition: "opacity 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.opacity = "0.8"}
              onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.opacity = "0.35"}
            >
              <span className="text-v-gold">{badge.icon}</span>
              <span className="text-[10px] font-accent font-bold uppercase tracking-[2px] text-white/70">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.main>
  );
}

/* ─────────────────────────────────────────────
   PASSWORD INPUT (separate component to manage its own focus)
───────────────────────────────────────────── */
function PasswordInput({ value, onChange, show, onToggle }: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        borderRadius: 16,
        boxShadow: focused ? "0 0 0 3px rgba(212,150,26,0.12), 0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.2)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="relative">
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? "text-v-gold" : "text-white/25"}`}>
          <Lock size={20} />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          style={{
            height: 60,
            paddingLeft: 56,
            paddingRight: 56,
            fontSize: 15,
            borderRadius: 16,
            background: focused ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.025)",
            border: focused ? "1.5px solid rgba(212,150,26,0.55)" : "1.5px solid rgba(255,255,255,0.07)",
            color: "#fff",
            width: "100%",
            outline: "none",
            transition: "background 0.3s ease, border-color 0.3s ease",
            letterSpacing: !show && value ? "0.2em" : "normal",
          }}
          className="placeholder:text-white/20"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/70 transition-colors"
          tabIndex={-1}
        >
          <AnimatePresence mode="popLayout">
            {show ? (
              <motion.span key="off" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }}>
                <EyeOff size={20} />
              </motion.span>
            ) : (
              <motion.span key="on" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }}>
                <Eye size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
