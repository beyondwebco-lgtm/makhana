"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Eye, Star } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";
import { products } from "@/data/products";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useCart } from "@/context/CartContext";

export default function ProductCollection() {
  const { ref, isInView } = useInView(0.05);
  const { addToCart } = useCart();

  return (
    <section id="products" ref={ref} className="section-padding bg-v-cream">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[6px] text-v-gold uppercase font-[family-name:var(--font-accent)] block mb-5">
            Shop
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-body)] font-bold text-v-black mb-4">
            The Collection
          </h2>
          <p className="text-v-muted max-w-md mx-auto text-sm leading-relaxed">
            Handpicked for the bold and the hungry. Find your flavour.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              variants={fadeInUp}
              custom={i}
              className="product-card group relative"
            >
              {product.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-[family-name:var(--font-accent)] text-white"
                    style={{ backgroundColor: product.color }}
                  >
                    {product.badge}
                  </span>
                </div>
              )}

              <button className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm hover:bg-white">
                <Eye className="w-4 h-4 text-v-black/70" />
              </button>

              <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-v-cream-light to-v-card">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${product.color}12, transparent 70%)`,
                  }}
                />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="product-image object-contain p-8"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="w-3 h-3"
                      fill={
                        s < Math.floor(product.rating)
                          ? "#D4961A"
                          : "transparent"
                      }
                      stroke="#D4961A"
                      strokeWidth={1.5}
                    />
                  ))}
                  <span className="text-[10px] text-v-muted ml-1">
                    ({product.reviewCount})
                  </span>
                </div>

                <h3 className="text-lg font-[family-name:var(--font-body)] font-semibold text-v-black mb-1">
                  {product.emoji} {product.name}
                </h3>
                <p className="text-xs text-v-muted leading-relaxed line-clamp-2 mb-3">
                  {product.tagline}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-[family-name:var(--font-accent)] font-bold text-v-black">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-v-muted line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product.slug, 1)}
                  className="w-full py-3.5 rounded-full text-[11px] font-[family-name:var(--font-accent)] font-semibold tracking-[1.5px] uppercase flex items-center justify-center gap-2 transition-all duration-400 border border-v-border text-v-black hover:bg-v-black hover:text-white hover:border-v-black"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
