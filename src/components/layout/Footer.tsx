"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useAnimations";
import { Globe, MapPin, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "#products" },
    { label: "Flavours", href: "#products" },
    { label: "Our Story", href: "#story" },
  ],
  support: [
    { label: "FAQs", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "https://instagram.com", label: "Instagram" },
  { icon: Globe, href: "https://facebook.com", label: "Facebook" },
  { icon: Globe, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const { ref, isInView } = useInView(0.1);

  return (
    <footer ref={ref} id="footer" style={{ width: "100%", background: "#070707", borderTop: "1px solid rgba(255,255,255,0.05)", color: "white" }}>

      {/* Newsletter — centered */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}
        >
          <h3 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontFamily: "var(--font-body)", fontWeight: "700", color: "#FFF6E0", marginBottom: "10px" }}>
            Stay in the loop
          </h3>
          <p style={{ color: "#8B7355", fontSize: "14px", marginBottom: "32px" }}>
            Subscribe for exclusive drops, flirty updates, and first access to limited editions.
          </p>
          <div style={{ display: "flex", width: "100%" }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", borderRadius: "60px 0 0 60px", padding: "16px 24px", fontSize: "14px", color: "white", outline: "none", fontFamily: "var(--font-accent)" }}
            />
            <button className="btn-primary" style={{ borderRadius: "0 60px 60px 0", whiteSpace: "nowrap" }}>
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main footer — centered */}
      <div style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>

          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", marginBottom: "20px" }}
          >
            <span style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "4px", color: "#FFF6E0" }}>VELLARI</span>
          </button>

          <p style={{ color: "#8B7355", fontSize: "14px", lineHeight: "1.7", maxWidth: "400px", margin: "0 auto 24px", textAlign: "center" }}>
            We don&apos;t do boring. We roast, season and flirt with flavours.
            Vellari Makhana is your crunchy partner in every mood.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}
              >
                <social.icon style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.5)" }} />
              </a>
            ))}
          </div>

          {/* Contact */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "48px" }}>
            <a href="mailto:hello@vellari.com" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#8B7355", textDecoration: "none" }}>
              <Mail style={{ width: "14px", height: "14px" }} /> hello@vellari.com
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#8B7355" }}>
              <MapPin style={{ width: "14px", height: "14px" }} /> Gwalior, Madhya Pradesh, India
            </span>
          </div>

          {/* Link columns */}
          <div style={{ display: "flex", justifyContent: "center", gap: "64px", flexWrap: "wrap", marginBottom: "48px" }}>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontSize: "12px", fontFamily: "var(--font-accent)", letterSpacing: "4px", color: "#FFF6E0", textTransform: "uppercase", marginBottom: "20px" }}>
                Shop
              </h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} style={{ fontSize: "14px", color: "#8B7355", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                      {link.label}
                      <ArrowUpRight style={{ width: "12px", height: "12px", opacity: 0 }} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontSize: "12px", fontFamily: "var(--font-accent)", letterSpacing: "4px", color: "#FFF6E0", textTransform: "uppercase", marginBottom: "20px" }}>
                Support
              </h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} style={{ fontSize: "14px", color: "#8B7355", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                      {link.label}
                      <ArrowUpRight style={{ width: "12px", height: "12px", opacity: 0 }} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — centered */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "#8B7355", marginBottom: "6px" }}>
          © {new Date().getFullYear()} Vellari. All rights reserved. Made with ♡ in India.
        </p>
        <span style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(139,115,85,0.5)", textTransform: "uppercase", fontFamily: "var(--font-accent)" }}>
          Roasted · Not Fried
        </span>
      </div>
    </footer>
  );
}
