"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useAnimations";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", location: "Mumbai", rating: 5, text: "Red Flag is dangerously addictive! The peri peri seasoning is perfect — not too spicy, just enough to keep you reaching for more. My go-to evening snack now.", product: "Red Flag ❤️" },
  { name: "Arjun Mehta", location: "Delhi", rating: 5, text: "Finally a healthy snack that actually tastes premium. The packaging is gorgeous — I gifted Solemate to my girlfriend and she loved it!", product: "Solemate 💜" },
  { name: "Sneha Patel", location: "Bangalore", rating: 5, text: "Love Bite is cheesy perfection. I can't believe these are roasted, not fried! The crunch is unreal. Already on my third jar this month.", product: "Love Bite ❤️" },
  { name: "Rohit Verma", location: "Gwalior", rating: 5, text: "Crush Me is the OG. Simple, classic, and so satisfying. I keep a jar on my desk at work. My colleagues keep stealing from it!", product: "Crush Me 🤍" },
  { name: "Ananya Singh", location: "Pune", rating: 5, text: "Green Flag mint is SO refreshing! It's like a dessert and a snack combined. The jar design is beautiful — it looks premium on my shelf.", product: "Green Flag 💚" },
  { name: "Karan Joshi", location: "Jaipur", rating: 5, text: "Blush is tangy tomato done right. The flavour is bold and the crunch is addictive. Best makhana brand I've tried, hands down.", product: "Blush 🩷" },
  { name: "Meera Iyer", location: "Chennai", rating: 5, text: "Ordered the combo pack for a house party and everyone went crazy! The flavour names are so fun and the taste backs it up. 10/10.", product: "All Flavours" },
];

const allTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="testimonials" ref={ref} style={{ width: "100%", background: "#FFF6E0", padding: "100px 0", overflow: "hidden" }}>

      {/* Header — centered */}
      <div style={{ maxWidth: "600px", margin: "0 auto 56px", padding: "0 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "6px", color: "#D4961A", textTransform: "uppercase", display: "block", marginBottom: "20px", fontFamily: "var(--font-accent)" }}>
            Love Letters
          </span>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontFamily: "var(--font-body)", fontWeight: "700", color: "#070707", marginBottom: "16px" }}>
            Love at First Crunch.
          </h2>
          <p style={{ color: "#8B7355", fontSize: "14px", textAlign: "center" }}>
            Real reviews from real snackers. No cap.
          </p>
        </motion.div>
      </div>

      {/* Infinite marquee */}
      <div style={{ position: "relative" }}>
        {/* Fade masks */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to right, #FFF6E0, transparent)", zIndex: 10, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to left, #FFF6E0, transparent)", zIndex: 10, pointerEvents: "none" }} />

        <div style={{ overflow: "hidden" }}>
          <div className="animate-marquee" style={{ display: "flex", gap: "20px", padding: "16px 0" }}>
            {allTestimonials.map((testimonial, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: "320px",
                  padding: "28px",
                  borderRadius: "24px",
                  background: "#FFFBF0",
                  border: "1px solid #F0E4CC",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Quote style={{ width: "24px", height: "24px", color: "rgba(212,150,26,0.2)", marginBottom: "16px" }} />

                {/* Stars */}
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "16px" }}>
                  {Array.from({ length: testimonial.rating }).map((_, s) => (
                    <Star key={s} style={{ width: "14px", height: "14px", color: "#D4961A", fill: "#D4961A" }} />
                  ))}
                </div>

                {/* Review */}
                <p style={{ fontSize: "13px", color: "rgba(7,7,7,0.7)", lineHeight: "1.6", marginBottom: "20px", textAlign: "center" }}>
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div style={{ borderTop: "1px solid rgba(240,228,204,0.6)", paddingTop: "16px", width: "100%", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", fontFamily: "var(--font-accent)", fontWeight: "600", color: "#070707" }}>
                    {testimonial.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "#8B7355", marginBottom: "8px" }}>
                    {testimonial.location}
                  </p>
                  <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#D4961A", fontWeight: "600", textTransform: "uppercase", fontFamily: "var(--font-accent)" }}>
                    {testimonial.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
