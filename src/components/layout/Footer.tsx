"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useAnimations";
import { Phone, Clock, Mail } from "lucide-react";
import Image from "next/image";

// Custom SVG Icons for Socials
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const quickLinks = [
  { label: "About Us", href: "#" },
  { label: "GST-2.0", href: "#" },
  { label: "Make Your Own Mix", href: "#" },
  { label: "Snacking", href: "#" },
  { label: "Gifting", href: "#" },
  { label: "Recipes", href: "#" },
  { label: "Blogs", href: "#" },
  { label: "Contact Us", href: "#" },
];

const policies = [
  { label: "Shipping Policy", href: "#" },
  { label: "Return & Refund", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer() {
  const { ref, isInView } = useInView(0.1);

  return (
    <footer ref={ref} id="footer" style={{ width: "100%", background: "#070707", color: "white", padding: "40px 24px 0" }}>
      
      {/* Main Dark Gray Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "#3A3A3A",
          borderRadius: "16px",
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "60px"
        }}
      >
        {/* Top Section: 4 Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          
          {/* Col 1: Brand & Newsletter */}
          <div className="flex flex-col items-start max-w-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center p-3 border border-white/10 shrink-0">
                <img src="/footer-logo.png" alt="Vellari" className="w-full h-auto object-contain drop-shadow-md" />
              </div>
              <span className="text-5xl lg:text-6xl font-black tracking-widest font-[family-name:var(--font-body)]">VELLARI</span>
            </div>
            
            <p className="font-bold text-sm mb-6 max-w-[280px] leading-snug">
              "Bold snacks. New drops. Deals you'll want first dibs on."
            </p>
            
            <div className="flex bg-white rounded-full p-1 w-full max-w-[320px]">
              <input
                type="email"
                placeholder="We don't spam!"
                className="flex-1 bg-transparent text-black px-4 outline-none text-sm font-medium placeholder:text-gray-400"
              />
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap hover:bg-neutral-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase tracking-wider mb-6 font-[family-name:var(--font-body)]">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-neutral-200 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Our Policies */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase tracking-wider mb-6 font-[family-name:var(--font-body)]">Our Policies</h4>
            <ul className="flex flex-col gap-4">
              {policies.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-neutral-200 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Get In Touch */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase tracking-wider mb-6 font-[family-name:var(--font-body)]">Get In Touch</h4>
            <div className="flex flex-col gap-5">
              <a href="tel:+919911470022" className="flex items-center gap-3 text-sm text-neutral-200 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                +91-9911470022
              </a>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <Clock className="w-5 h-5" />
                'Monday to Friday (10am - 6pm)'
              </div>
              <a href="mailto:hello@vellari.com" className="flex items-center gap-3 text-sm text-neutral-200 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                hello@vellari.com
              </a>
              
              <div className="flex items-center gap-3 mt-2">
                {[
                  { icon: FacebookIcon, href: "#" },
                  { icon: TwitterIcon, href: "#" },
                  { icon: InstagramIcon, href: "#" },
                  { icon: YoutubeIcon, href: "#" }
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <social.icon className="w-4 h-4 fill-current" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-[13px] text-neutral-300 leading-relaxed font-medium">
            Consumers may note that the Company is not affiliated with PVR Inox Limited with effect from 29th January, 2026 and PVR Inox Limited is not involved in manufacturing, quality control or marketing of the Company's products.
          </p>
        </div>
      </motion.div>

      {/* Copyright & Floating Products */}
      <div className="relative pt-10 pb-6 text-center max-w-[1400px] mx-auto overflow-hidden">
        <p className="text-sm font-medium z-10 relative">
          Copyright © 2026, Vellari. All rights reserved.
        </p>
        
        {/* Jars peaking from bottom */}
        <div className="flex justify-center items-end gap-2 sm:gap-6 mt-6 translate-y-4">
          <Image src="/products/3.png" alt="Product" width={100} height={100} className="w-20 sm:w-28 h-auto object-contain hover:-translate-y-4 transition-transform duration-500" />
          <Image src="/products/1.png" alt="Product" width={120} height={120} className="w-24 sm:w-32 h-auto object-contain z-10 hover:-translate-y-4 transition-transform duration-500 drop-shadow-2xl" />
          <Image src="/products/2.png" alt="Product" width={100} height={100} className="w-20 sm:w-28 h-auto object-contain hover:-translate-y-4 transition-transform duration-500" />
        </div>
      </div>

    </footer>
  );
}
