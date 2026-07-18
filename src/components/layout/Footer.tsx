"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useAnimations";
import { Phone, Clock, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Newsletter (spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center p-2 border border-white/10">
                <img src="/logo.png" alt="Vellari" className="w-full h-auto object-contain" />
              </div>
              <span className="text-4xl font-black tracking-widest font-[family-name:var(--font-body)]">VELLARI</span>
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

          {/* Col 2: Quick Links (spans 2 cols) */}
          <div className="lg:col-span-2">
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

          {/* Col 3: Our Policies (spans 2 cols) */}
          <div className="lg:col-span-2">
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

          {/* Col 4: Get In Touch (spans 4 cols) */}
          <div className="lg:col-span-4">
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
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" }, // Using Twitter for X icon
                  { icon: Instagram, href: "#" },
                  { icon: Youtube, href: "#" }
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
